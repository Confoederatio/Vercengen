{
	if (!global.GeoPNG) global.GeoPNG = {};
	
	/**
	 * Returns the centroid of a given polygon, given its pixels.
	 * 
	 * @param {Array.<number[]>} arg0_pixels
	 * 
	 * @returns {number[]|null}
	 */
	GeoPNG.getPolygonCentroid = function (arg0_pixels) {
		//Convert from parameters
		let pixels = arg0_pixels;
		
		if (!pixels.length) return null; //Internal guard clause if pixels are not provided
		
		//Declare local instance variables
		let sum_x = 0;
		let sum_y = 0;
		
		//Iterate over all pixels
		for (let [x, y] of pixels) {
			sum_x += x;
			sum_y += y;
		}
		
		//Return statement
		return [sum_x/pixels.length, sum_y/pixels.length];
	};
	
	/**
	 * Returns the average (assuming a number-formatted GeoPNG) of the Moore neighbourhood surrounding a pixel.
	 * 
	 * @param {number[]} arg0_geopng_array
	 * @param {number} arg1_x
	 * @param {number} arg2_y
	 * @param {number} arg3_height
	 * @param {number} arg4_width
	 * 
	 * @returns {number}
	 */
	GeoPNG.getRasterNeighbourAverage = function (arg0_geopng_array, arg1_x, arg2_y, arg3_height, arg4_width) {
		//Convert from parameters
		let geopng_array = arg0_geopng_array;
		let local_x = arg1_x;
		let local_y = arg2_y;
		let height = arg3_height;
		let width = arg4_width;
		
		//Declare local instance variables
		let count = 0;
		let sum = 0;
		
		for (let i = -1; i <= 1; i++)
			for (let x = -1; x <= 1; x++) {
				if (i === 0 && x === 0) continue;
				
				let neighbour_x = local_x + i;
				let neighbour_y = local_y + x;
				
				if (neighbour_x >= 0 && neighbour_x < height && neighbour_y >= 0 && neighbour_y < width) {
					let local_index = neighbour_x*width + neighbour_y;
					let local_value = geopng_array[local_index];
					
					if (!isNaN(local_value)) {
						sum += local_value;
						count++;
					}
				}
			}
		
		//Return statement
		return (count > 0) ? sum/count : NaN;
	};
	
	/**
	 * Robustly eliminates specific colours by binning them to the nearest available non-binned colour.
	 *
	 * @param {string} arg0_input_path
	 * @param {string} arg1_output_path
	 * @param {Object} [arg2_options]
	 *  @param {Array.<number[]|Object>} arg2_options.bin_colours - Colours to be destroyed (supports [r,g,b,a], [r,g,b,a,tol], or { colour, tolerance }).
	 *   @param {Array.<number[]|Object>} arg2_options.ignore_colours - Colours to leave untouched.
	 *  @param {number} [arg2_options.bin_tolerance=0] - Default RGBA Euclidean distance tolerance for bin_colours.
	 *  @param {number} [arg2_options.ignore_tolerance=0] - Default RGBA Euclidean distance tolerance for ignore_colours.
	 */
	GeoPNG.kNNBin = async function (arg0_input_path, arg1_output_path, arg2_options) { //[WIP] - Test function
		//Convert from parameters
		let input_path = arg0_input_path;
		let output_path = arg1_output_path;
		let options = (arg2_options) ? arg2_options : {};
		
		//Declare local instance variables
		let default_bin_tolerance = (options.bin_tolerance !== undefined) ? 
			options.bin_tolerance : 0;
		let default_ignore_tolerance = (options.ignore_tolerance !== undefined) ? 
			options.ignore_tolerance : 0;
		
		//Helper to parse colour definitions and pre-calculate squared tolerances
		let parseColourList = (colour_list, default_tolerance) => {
			return (colour_list || []).map((item) => {
				let colour = Array.isArray(item) ? item.slice(0, 4) : (item.colour || item.color || [0, 0, 0, 255]);
				let tolerance = (Array.isArray(item) && item.length > 4) ? item[4] : ((item.tolerance !== undefined) ? item.tolerance : default_tolerance);
				
				return {
					colour: colour,
					sq_tolerance: tolerance*tolerance
				};
			});
		};
		
		let bin_list = parseColourList(options.bin_colours, default_bin_tolerance);
		let ignore_list = parseColourList(options.ignore_colours, default_ignore_tolerance);
		
		//Helper to check RGBA Euclidean distance against parsed colour thresholds
		let isColourMatched = (r, g, b, a, list) => {
			for (let i = 0; i < list.length; i++) {
				let target = list[i];
				let dr = r - target.colour[0];
				let dg = g - target.colour[1];
				let db = b - target.colour[2];
				let da = a - target.colour[3];
				let sq_dist = dr*dr + dg*dg + db*db + da*da;
				
				if (sq_dist <= target.sq_tolerance) return true;
			}
			return false;
		};
		
		let buffer = await fs.promises.readFile(input_path);
		let png = await new Promise((resolve, reject) =>
			new pngjs.PNG().parse(buffer, (err, data) => (err) ? reject(err) : resolve(data)));
		
		let { width, height, data } = png;
		let seed_map = new Array(width*height);
		let fallback_seed = null;
		
		//Initialise helper functions
		let checkNeighbour = (x, y, current_data, neighbour) => {
			if (neighbour && neighbour.sx !== -1) {
				let dx = x - neighbour.sx;
				let dy = y - neighbour.sy;
				let d2 = dx*dx + dy*dy;
				
				if (d2 < current_data.dist) {
					current_data.sx = neighbour.sx;
					current_data.sy = neighbour.sy;
					current_data.dist = d2;
				}
			}
		};
		
		//Step 1: Initialise Seed Map
		for (let y = 0; y < height; y++) {
			if (y % 500 === 0) await Blacktraffic.yield();
			
			for (let x = 0; x < width; x++) {
				let idx = (width*y + x) << 2;
				let r = data[idx];
				let g = data[idx + 1];
				let b = data[idx + 2];
				let a = data[idx + 3];
				
				let is_binned = isColourMatched(r, g, b, a, bin_list);
				let is_ignored = isColourMatched(r, g, b, a, ignore_list);
				
				if (!is_binned && !is_ignored) {
					seed_map[width*y + x] = { sx: x, sy: y, dist: 0 };
					if (!fallback_seed) fallback_seed = { x, y };
				} else {
					seed_map[width*y + x] = { sx: -1, sy: -1, dist: Infinity };
				}
			}
		}
		
		//Step 2: Forward Raster Scan
		for (let y = 0; y < height; y++) {
			if (y % 500 === 0) await Blacktraffic.yield();
			
			for (let x = 0; x < width; x++) {
				let idx = width*y + x;
				let current_data = seed_map[idx];
				if (current_data.dist === 0) continue;
				
				if (x > 0) checkNeighbour(x, y, current_data, seed_map[idx - 1]);
				if (y > 0) checkNeighbour(x, y, current_data, seed_map[idx - width]);
				if (x > 0 && y > 0) checkNeighbour(x, y, current_data, seed_map[idx - width - 1]);
				if (x < width - 1 && y > 0) checkNeighbour(x, y, current_data, seed_map[idx - width + 1]);
			}
		}
		
		//Step 3: Backward Raster Scan
		for (let y = height - 1; y >= 0; y--) {
			if (y % 500 === 0) await Blacktraffic.yield();
			
			for (let x = width - 1; x >= 0; x--) {
				let idx = width*y + x;
				let current_data = seed_map[idx];
				if (current_data.dist === 0) continue;
				
				if (x < width - 1) checkNeighbour(x, y, current_data, seed_map[idx + 1]);
				if (y < height - 1) checkNeighbour(x, y, current_data, seed_map[idx + width]);
				if (x < width - 1 && y < height - 1) checkNeighbour(x, y, current_data, seed_map[idx + width + 1]);
				if (x > 0 && y < height - 1) checkNeighbour(x, y, current_data, seed_map[idx + width - 1]);
			}
		}
		
		//Step 4: Apply Transformation
		let fallback_rgba = [0, 0, 0, 0];
		for (let y = 0; y < height; y++) {
			if (y % 500 === 0) await Blacktraffic.yield();
			
			for (let x = 0; x < width; x++) {
				let idx = (width*y + x) << 2;
				let r = data[idx];
				let g = data[idx + 1];
				let b = data[idx + 2];
				let a = data[idx + 3];
				
				if (isColourMatched(r, g, b, a, bin_list)) {
					let final_index = -1;
					let seed = seed_map[width*y + x];
					
					if (seed.sx !== -1) {
						final_index = (width*seed.sy + seed.sx) << 2;
					} else if (fallback_seed) {
						final_index = (width*fallback_seed.y + fallback_seed.x) << 2;
					}
					
					if (final_index !== -1) {
						data[idx] = data[final_index];
						data[idx + 1] = data[final_index + 1];
						data[idx + 2] = data[final_index + 2];
						data[idx + 3] = data[final_index + 3];
					} else {
						data[idx] = fallback_rgba[0];
						data[idx + 1] = fallback_rgba[1];
						data[idx + 2] = fallback_rgba[2];
						data[idx + 3] = fallback_rgba[3];
					}
				}
			}
		}
		
		//Step 5: Save Output
		await new Promise((resolve, reject) => {
			png.pack().pipe(fs.createWriteStream(output_path))
			.on("finish", resolve)
			.on("error", reject);
		});
	};
}