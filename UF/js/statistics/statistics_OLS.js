//Initialise functions
{
	if (!global.Statistics)
		/**
		 * The namespace for all UF/Statistics utility functions, typically for static methods.
		 *
		 * @namespace Statistics
		 */
		global.Statistics = {};
	
	/**
	 * Computes the X^T * X matrix manually to save memory.
	 * @alias Statistics._computeXT_X
	 *
	 * @param {Array<Array<number>>} arg0_X
	 *
	 * @returns {Array<Array<number>>}
	 */
	Statistics._computeXT_X = function (arg0_X) {
		let X = arg0_X;
		let N = X.length;
		let K = X[0].length;
		
		let XT_X = new Array(K).fill(0).map(() => new Array(K).fill(0));
		
		//Optimisation: Halved loop multiplications taking advantage of reflectional symmetry
		for (let i = 0; i < N; i++) {
			let rowX = X[i];
			for (let j = 0; j < K; j++) {
				let x_j = rowX[j];
				for (let k = j; k < K; k++) {
					XT_X[j][k] += x_j * rowX[k];
				}
			}
		}
		
		//Mirror the computed lower half logic to the upper half logic
		for (let j = 0; j < K; j++) {
			for (let k = 0; k < j; k++) {
				XT_X[j][k] = XT_X[k][j];
			}
		}
		
		return XT_X;
	};
	
	/**
	 * Computes the VIF of a given matrix.
	 * @alias Statistics.computeVIF
	 *
	 * @param {Matrix|Array} arg0_X
	 *
	 * @returns {Array<number>}
	 */
	Statistics.computeVIF = function (arg0_X) {
		//Convert from parameters
		let X = arg0_X;
		try { X = X._data || X; } catch (e) {}
		
		//Declare local instance variables
		let XT_X = Statistics._computeXT_X(X);
		let XT_X_inv = mathjs.inv(XT_X);
		try { XT_X_inv = XT_X_inv._data || XT_X_inv; } catch(e) {}
		
		let vif = XT_X_inv.map((row, i) => row[i]);
		
		//Return statement
		return vif;
	};
	
	/**
	 * Returns the condition number of a given matrix.
	 * @alias Statistics.conditionNumber
	 *
	 * @param {Matrix|Array} arg0_X
	 * @param {number} [arg1_epsilon=1e-12]
	 *
	 * @returns {number}
	 */
	Statistics.conditionNumber = function (arg0_X, arg1_epsilon) {
		//Convert from parameters
		let X = arg0_X;
		let epsilon = Math.returnSafeNumber(arg1_epsilon, 1e-12);
		try { X = X._data || X; } catch (e) {}
		
		//Declare local instance variables
		let XT_X = Statistics._computeXT_X(X);
		
		let matrix = new ml_matrix.SVD(XT_X, { autoTranspose: true });
		let singular_values = matrix.diagonal.map(v => Math.sqrt(Math.max(0, v)));
		
		//Find max and min singular values
		let max_s = Math.max(...singular_values);
		let min_s = Math.max(Math.min(...singular_values), epsilon); //Ensure min_s is never 0
		
		//Return statement
		return max_s/min_s;
	};
	
	/**
	 * Geometrically average OLS models across a folder path, with base OLS prefixes.
	 * @alias Statistics.geomeanOLSModels
	 * 
	 * @param {string} arg0_input_folder_path
	 * @param {string} arg1_ols_prefix
	 * @returns {Promise<{coefficients: {}, raw_coefficients: {}}>}
	 */
	Statistics.geomeanOLSModels = async function (arg0_input_folder_path, arg1_ols_prefix) { 
		let input_folder_path = arg0_input_folder_path;
		let ols_prefix = arg1_ols_prefix;
		
		//Declare local instance variables
		let all_coefficients = {};
		let raw_coefficients = {};
		
		//Iterate over all_input_files matching ols_prefix
		let all_input_files = await File.getAllFiles(input_folder_path);
		
		for (let i = 0; i < all_input_files.length; i++)
			if (all_input_files[i].endsWith(".json")) {
				let local_split_path = all_input_files[i].split(/[/\\]/);
				let local_file_name = local_split_path[local_split_path.length - 1];
				
				if (local_file_name.startsWith(ols_prefix)) {
					let rawdata = JSON.parse(fs.readFileSync(all_input_files[i], "utf8"));
					let { coefficients } = rawdata;
					
					//Aggregate coefficients for geometric mean calculation
					for (let key in coefficients) {
						if (!all_coefficients[key]) all_coefficients[key] = [];
						if (!raw_coefficients[key]) raw_coefficients[key] = [];
						all_coefficients[key].push(coefficients[key]);
						raw_coefficients[key].push(coefficients[key]);
					}
				}
			}
		
		//Iterate over all_coefficients; compute geometric mean for each coefficient
		let format_slug = ols_prefix.split("_").join(" ").trim().split(" ").join("_");
		let hybrid_coefficients = {};
		
		for (let key in all_coefficients)
			hybrid_coefficients[key] = Math.weightedGeometricMean(all_coefficients[key]);
		
		let output_data = {
			coefficients: hybrid_coefficients,
			raw_coefficients
		};
		let output_path = `${input_folder_path}/geomean_${format_slug}.json`;
		
		fs.writeFileSync(output_path, JSON.stringify(output_data, null, 2));
		console.log(`OLS weighted geometric mean calculated and saved to ${output_path}.`);
		
		//Return statement
		return output_data;
	};
	
	/**
	 * Generates an OLS raster from a stack of coefficients.
	 * @alias Statistics.generateOLSRaster
	 * 
	 * @param {string} arg0_output_file_path
	 * @param {Object} [arg1_options]
	 *  @param {Object} arg1_options.covariates_obj
	 *  @param {string} [arg1_options.format="int32"]
	 *  @param {Array} [arg1_options.formatting_parameters]
	 *  @param {function} [arg1_options.guard_clause] - (local_index:{@link number}, rasters_obj:{@link Object}) - `false` skips pixel processing.
	 *  @param {Object|string} [arg1_options.model_obj] - File path or JSON object.
	 *  @param {string} [arg1_options.utility_format="int32"]
	 *  
	 *  @param {number} [arg1_options.height=2160]
	 *  @param {number} [arg1_options.width=4320]
	 * 
	 * @returns {Promise<void>}
	 */
	Statistics.generateOLSRaster = async function (arg0_output_file_path, arg1_options) {
		//Convert from parameters
		let output_file_path = arg0_output_file_path;
		let options = (arg1_options) ? arg1_options : {};
		
		//Initialise options
		if (!options.format) options.format = "float32";
		if (!options.formatting_parameters) options.formatting_parameters = [];
		options.height = Math.returnSafeNumber(options.height, 2160);
		options.width = Math.returnSafeNumber(options.width, 4320);
		
		//Declare local instance variables
		let covariates_obj = options.covariates_obj;
		let model_obj = (typeof options.model_obj === "string") ? 
			JSON.parse(fs.readFileSync(path.resolve(options.model_obj), "utf8")) : options.model_obj;
		let coefficients_obj = model_obj.coefficients;
		let rasters_obj = {};
		
		//Iterate over covariates_obj and load rasters
		Object.iterate(covariates_obj, (local_key, local_value) => {
			let local_file_path = (typeof local_value === "function") ? 
				local_value(...options.formatting_parameters) : local_value;
			let local_format = "int32";
			
			//Destructure if array is returned
			if (Array.isArray(local_file_path)) {
				local_format = local_file_path[1];
				local_file_path = local_file_path[0];
			}
			
			//Load existing rasters into rasters_obj
			if (fs.existsSync(local_file_path))
				rasters_obj[local_key] = GeoPNG.loadNumberRasterImage(local_file_path, {
					format: local_format
				});
		});
		
		//Write output file from rasters_obj
		GeoPNG.saveNumberRasterImage({
			file_path: output_file_path,
			format: options.format,
			width: options.width,
			height: options.height,
			function: (local_index) => {
				//Evaluate guard function if present
				if (options.guard_clause) {
					let should_process = options.guard_clause(local_index, rasters_obj);
					if (!should_process) return 0;
				}
				
				//Declare local instance variables
				let local_sum = 0;
				
				Object.iterate(rasters_obj, (local_key, local_value) => {
					let local_coefficient = Math.returnSafeNumber(coefficients_obj[local_key]);
					
					local_sum += (local_value?.data) ? 
						(local_value.data[local_index]*local_coefficient) : 0;
				});
				
				//Return statement
				return local_sum;
			}
		});
		
		console.log(`Saved OLS for ${output_file_path}.`);
	};
	
	/**
	 * Loads a stack of covariates for a specific utility file path for OLS training.
	 * @alias Statistics.loadOLSCovariates
	 *
	 * @param {string} arg0_utility_file_path
	 * @param {Object} [arg1_options]
	 *  @param {Object} arg1_options.covariates_obj
	 *  @param {Array} [arg1_options.formatting_parameters]
	 *  @param {string} [arg1_options.utility_format="int32"]
	 *  
	 * @returns {Promise<void>}
	 */
	Statistics.loadOLSCovariates = async function (arg0_utility_file_path, arg1_options) {
		//Convert from parameters
		let utility_file_path = path.resolve(arg0_utility_file_path);
		let options = (arg1_options) ? arg1_options : {};
		
		//Initialise options
		if (!options.formatting_parameters) options.formatting_parameters = [];
		
		//Declare local instance variables
		let input_data = [];
		let utility_image = GeoPNG.loadNumberRasterImage(utility_file_path, {
			format: options.utility_format
		});
		let utility_data = utility_image.data;
		let valid_keys = [];
		
		//Iterate over all input stocks; load each input variable as a predictor
		Object.iterate(options.covariates_obj, (local_key, local_value) => {
			let local_file_path = local_value(...options.formatting_parameters);
			let local_format = "int32";
			
			//Destructure if array is returned
			if (Array.isArray(local_file_path)) {
				local_format = local_file_path[1];
				local_file_path = local_file_path[0];
			}
			
			//Attempt to load the covariate raster; drop it on failure
			try {
				let local_rawdata = GeoPNG.loadNumberRasterImage(local_file_path, {
					format: local_format
				}).data;
				
				input_data.push(local_rawdata);
				valid_keys.push(local_key);
			} catch (e) {
				console.log(`- Missing covariate raster for ${local_key} at ${local_file_path}. Dropping coefficient for this run.`);
			}
		});
		
		//Transpose input data to match format [samples, features], discarding zeroes and NaNs safely
		let feature_count = input_data.length;
		let sample_count = utility_data.length;
		let X = [];
		let Y = [];
		
		//Iterate over sample_count
		for (let i = 0; i < sample_count; i++) {
			let has_data = false;
			let is_valid = true;
			let utility_value = utility_data[i];
			
			if (isNaN(utility_value)) {
				is_valid = false;
			} else if (utility_value !== 0) {
				has_data = true;
			}
			
			//Iterate over feature_count
			let local_row = new Array(feature_count);
			
			for (let x = 0; x < feature_count; x++) {
				let local_value = input_data[x][i];
				if (isNaN(local_value)) {
					is_valid = false;
					break;
				}
				local_row[x] = local_value;
				if (local_value !== 0) has_data = true;
			}
			
			if (has_data && is_valid) {
				X.push(local_row);
				Y.push([utility_value]);
			}
		}
		
		//Return statement
		return { keys: valid_keys, X, Y };
	};
	
	/**
	 * Processes and adjusts OLS model coefficients against target and covariate rasters via bidirectional weighted average adjustment.
	 * @alias Statistics.processOLSModel
	 *
	 * @param {string|Object} arg0_model - JSON model object or file path to JSON model.
	 * @param {Object} [arg1_options]
	 *  @param {Object} [arg1_options.covariates_obj] - Map of covariate keys to functions or file paths.
	 *  @param {boolean} [arg1_options.debug=false]
	 *  @param {string} [arg1_options.output_file_path] - Path to save the adjusted model JSON.
	 *  @param {Array<any>|any} [arg1_options.steps] - Array of steps or parameter sets (e.g., years) passed into target and covariate functions.
	 *  @param {string|Function} [arg1_options.target] - File path or function returning file path for target raster.
	 *  @param {string} [arg1_options.target_format="float32"]
	 *
	 * @returns {Promise<Object>}
	 */
	Statistics.processOLSModel = async function (arg0_model, arg1_options) {
		//Convert from parameters
		let processed_model = (typeof arg0_model === "string") ? JSON.parse(fs.readFileSync(path.resolve(arg0_model), "utf8")) : arg0_model;
		let options = (arg1_options) ? arg1_options : {};
		
		//Initialise options
		let covariates_obj = (options.covariates_obj) ? options.covariates_obj : {};
		let target_entry = (options.target) ? options.target : options.target_raster;
		let steps = (options.steps) ? (Array.isArray(options.steps) ? options.steps : [options.steps]) : [[]];
		
		//Ensure all coefficients are positive
		let all_coefficients = Object.keys(processed_model.coefficients);
		
		for (let i = 0; i < all_coefficients.length; i++)
			processed_model.coefficients[all_coefficients[i]] = Math.abs(processed_model.coefficients[all_coefficients[i]]);
		
		//Iterate over formatting parameters steps
		for (let i = 0; i < steps.length; i++) try {
			let current_params = Array.isArray(steps[i]) ? steps[i] : [steps[i]];
			console.log(`Processing OLS model adjustment for step [${current_params.join(", ")}] ..`);
			
			let local_target_file_path = (typeof target_entry === "function") ? target_entry(...current_params) : target_entry;
			let local_target_format = options.target_format || "float32";
			
			if (Array.isArray(local_target_file_path)) {
				local_target_format = local_target_file_path[1];
				local_target_file_path = local_target_file_path[0];
			}
			
			let local_covariate_images = {};
			let total_logs = {};
			let valid_covariate_keys = [];
			
			for (let key in covariates_obj) {
				let covariate_entry = covariates_obj[key];
				let local_file_path = (typeof covariate_entry === "function") ? covariate_entry(...current_params) : covariate_entry;
				let local_format = "float32";
				
				if (Array.isArray(local_file_path)) {
					local_format = local_file_path[1];
					local_file_path = local_file_path[0];
				}
				
				try {
					local_covariate_images[key] = GeoPNG.loadNumberRasterImage(local_file_path, {
						format: local_format
					});
					valid_covariate_keys.push(key);
				} catch (e) {
					console.warn(`- [WARN] Missing covariate raster for ${key} at ${local_file_path}. Filtering out key.`);
				}
			}
			
			let local_target_image = GeoPNG.loadNumberRasterImage(local_target_file_path, {
				format: local_target_format
			});
			
			//Guard clause if no valid_covariate_keys present
			if (valid_covariate_keys.length === 0) {
				console.warn(`- [WARN] No covariate keys for step [${current_params.join(", ")}]! Skipping iteration.`);
				continue;
			}
			
			//Iterate over all pixels
			console.log(`- Processing weights (bidirectional weighted average adjustment) ..`);
			let pixel_count = local_target_image.width * local_target_image.height;
			
			for (let x = 0; x < pixel_count; x++) {
				//Compute predicted_value based on covariate stocks
				let predicted_value = 0;
				let total_weight = 0;
				
				for (let k = 0; k < valid_covariate_keys.length; k++) {
					let key = valid_covariate_keys[k];
					let covariate_value = local_covariate_images[key].data[x] || 0;
					if (isNaN(covariate_value)) covariate_value = 0;
					
					let coefficient = processed_model.coefficients[key] ?? 1;
					if (isNaN(coefficient)) coefficient = 1;
					
					let weighted_contribution = covariate_value * coefficient;
					
					predicted_value += weighted_contribution;
					total_weight += covariate_value;
					
					if (options.debug && covariate_value > 0) {
						total_logs[key] = total_logs[key] || 0;
						if (total_logs[key] < 100)
							console.log(`- Covariate: Pixel ${x}: ${key}: Value: ${covariate_value}, Coefficient: ${coefficient}, Weighted contribution: ${weighted_contribution}`);
					}
				}
				
				let observed_value = local_target_image.data[x] || 0;
				if (isNaN(observed_value)) observed_value = 0;
				
				let residual = observed_value - predicted_value;
				let correction_factor = predicted_value !== 0 ? residual / predicted_value : 0;
				
				//Adjust coefficients proportionally based on each category's weight in that pixel
				if (total_weight > 0)
					for (let k = 0; k < valid_covariate_keys.length; k++) {
						let key = valid_covariate_keys[k];
						let covariate_value = local_covariate_images[key].data[x] || 0;
						if (isNaN(covariate_value)) covariate_value = 0;
						
						if (covariate_value === 0) continue;
						
						let local_coefficient = processed_model.coefficients[key];
						let weight_fraction = covariate_value / total_weight;
						let update_amount = local_coefficient * correction_factor * weight_fraction;
						
						if (!(correction_factor < 0 && local_coefficient < 1)) {
							if (options.debug) {
								total_logs[key] = total_logs[key] || 0;
								if (total_logs[key] < 100) {
									total_logs[key]++;
									console.log(`- Target Adj: Pixel ${x}: ${key}, Update Amount: ${update_amount}, Weight Fraction: ${weight_fraction}, Residual: ${residual}, Correction Factor: ${correction_factor}`);
								}
							}
							processed_model.coefficients[key] += (isNaN(update_amount) ? 0 : update_amount);
						}
					}
			}
			
			console.log(`- New coefficients:`, processed_model.coefficients);
		} catch (e) {
			console.error(`Statistics.processOLSModel(): Error when processing step:`);
			console.error(e);
		}
		
		//Save adjusted coefficients if output_file_path is provided
		if (options.output_file_path) {
			let output_file_path = path.resolve(options.output_file_path);
			fs.writeFileSync(output_file_path, JSON.stringify(processed_model, null, 2));
			console.log(`Processed model data saved successfully in ${output_file_path}.`);
		}
		
		//Return statement
		return processed_model;
	};
	
	/**
	 * Removes high VIF features for a given matrix.
	 * @alias Statistics.removeHighVIFFeatures
	 *
	 * @param {Matrix|Array} arg0_X
	 * @param {number} [arg1_threshold=10]
	 *
	 * @returns {Array<Array<number>>}
	 */
	Statistics.removeHighVIFFeatures = function (arg0_X, arg1_threshold) {
		//Convert from parameters
		let X = arg0_X;
		let threshold = Math.returnSafeNumber(arg1_threshold, 10);
		try { X = X._data || X; } catch(e) {}
		
		//Declare local instance variables
		let vif_scores = Statistics.computeVIF(X);
		let to_keep = vif_scores.map((vif, i) => (vif < threshold));
		
		//Return statement
		return X.map((row) => row.filter((_, index) => to_keep[index]));
	};
	
	/**
	 * Performs Ridge Regression on two matrices.
	 * @alias Statistics.ridgeRegression
	 *
	 * @param {Matrix|Array} arg0_X
	 * @param {Matrix|Array} arg1_Y
	 * @param {number} [arg2_lambda=1e-3]
	 *
	 * @returns {Matrix|Array}
	 */
	Statistics.ridgeRegression = function (arg0_X, arg1_Y, arg2_lambda) {
		//Convert from parameters
		let X = arg0_X;
		let Y = arg1_Y;
		let lambda = Math.returnSafeNumber(arg2_lambda, 1e-3);
		
		try { X = X._data || X; } catch (e) {}
		try { Y = Y._data || Y; } catch (e) {}
		
		//Declare local instance variables
		let N = X.length;
		let K = X[0].length;
		
		let XT_X = new Array(K).fill(0).map(() => new Array(K).fill(0));
		let XT_Y = new Array(K).fill(0).map(() => [0]);
		
		for (let i = 0; i < N; i++) {
			let rowX = X[i];
			let yVal = Y[i][0];
			for (let j = 0; j < K; j++) {
				let x_j = rowX[j];
				XT_Y[j][0] += x_j * yVal;
				for (let k = j; k < K; k++) {
					XT_X[j][k] += x_j * rowX[k];
				}
			}
		}
		
		for (let j = 0; j < K; j++) {
			for (let k = 0; k < j; k++) {
				XT_X[j][k] = XT_X[k][j];
			}
		}
		
		let XT_X_mat = mathjs.matrix(XT_X);
		let XT_Y_mat = mathjs.matrix(XT_Y);
		let identity = mathjs.identity(K);
		
		let XT_X_reg = mathjs.add(XT_X_mat, mathjs.multiply(identity, lambda)); //Ridge term
		
		//Return statement; return beta
		return mathjs.multiply(mathjs.inv(XT_X_reg), XT_Y_mat);
	};
	
	/**
	 * Trains a raster-based OLS model given a fitted covariates object { X, Y, keys }.
	 * @alias Statistics.trainOLSModel
	 *
	 * @param {string} arg0_output_file_path
	 * @param {Object} arg1_covariates_obj
	 * @param {Object} [arg2_options]
	 *  @param {boolean} [arg2_options.dynamic_lambda=false] - Condition numbers are dynamically selected if true.
	 *  @param {number} [arg2_options.lambda=1e9]
	 *  @param {boolean} [arg2_options.remove_high_vif_features=false] - Whether to remove high VIF features.
	 *  @param {string} [arg2_options.key]
	 *
	 * @returns {Promise<Object>}
	 */
	Statistics.trainOLSModel = async function (arg0_output_file_path, arg1_covariates_obj, arg2_options) {
		//Convert from parameters
		let output_file_path = path.resolve(arg0_output_file_path);
		let covariates_obj = arg1_covariates_obj;
		let options = (arg2_options) ? arg2_options : {};
		
		//Initialise options
		if (!options.key) options.key = output_file_path;
		
		//Declare local instance variables
		let basename = path.basename(output_file_path);
		let { keys, X, Y } = covariates_obj;
		
		console.log(`- Performing OLS for ${basename}.`);
		
		//1. Remove multicollinear features using VIF selection if specified
		if (options.remove_high_vif_features) {
			X = Statistics.removeHighVIFFeatures(X, 10);
			console.log(` - Removed high VIF features.`);
		}
		
		//2. Apply Ridge Regression to stabilise coefficients
		let selected_lambda = Math.returnSafeNumber(options.lambda, 1e9);
		console.log(`- Computed preliminary matrices.`);
		
		if (options.dynamic_lambda) {
			let condition_number = Statistics.conditionNumber(X);
			if (condition_number > 1e6) { selected_lambda = 1e9; }
			else if (condition_number > 1e4) { selected_lambda = 1e7; }
			else if (condition_number > 1e2) { selected_lambda = 1e5; }
			else { selected_lambda = 1e3; }
			console.log(`- Condition Number: ${condition_number}, using Lambda = ${selected_lambda}`);
		}
		
		let beta = Statistics.ridgeRegression(X, Y, selected_lambda);
		console.log(`- Applied Ridge Regression to stabilise coefficients.`);
		
		//3. Convert coefficients to JSON
		let beta_arr = beta._data || (beta.toArray ? beta.toArray() : beta);
		let coefficients = beta_arr.flat();
		console.log(`- Computed coefficients.`);
		
		//Save model to JSON
		let model_data_obj = {
			key: options.key,
			coefficients: Object.fromEntries(
				keys.map((key, i) => [key, coefficients[i]])
			)
		};
		
		fs.writeFileSync(output_file_path, JSON.stringify(model_data_obj, null, 2));
		console.log(`OLS model data for ${options.key} saved successfully in ${output_file_path}.`);
		
		//Return statement
		return model_data_obj;
	};
}