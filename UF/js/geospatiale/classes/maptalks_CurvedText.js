if (!global.Geospatiale)
	global.Geospatiale = {};

/**
 * Curved text Geometry for Maptalks (UIMarker-based).
 * 
 * @param {Array.<number[]>|maptalks.Coordinate[]}
 * @param {Object} [arg1_options]
 *  @param {number} [arg1_options.base_font_size=16]
 *  @param {string} [arg1_options.class] - Overrides manual .style using a preset class.
 *  @param {number} [arg1_options.letter_spacing=0]
 *  @param {maptalks.Map} [arg1_options.map]
 *  @param {Object} [arg1_options.style]
 * 
 * @type {Geospatiale.maptalks_CurvedText}
 */
Geospatiale.maptalks_CurvedText = class {
	constructor (arg0_coords, arg1_options) {
		//Convert from parameters
		let coords = arg0_coords;
		let options = (arg1_options) ? arg1_options : {};
		
		//Declare local instance variables
		this.coords = coords;
		this.options = options;
		this.map = options.map;
		
		this.base_font_size = Math.returnSafeNumber(this.options.base_font_size, 16);
		this.base_zoom = (this.options.base_zoom !== undefined) ? this.options.base_zoom : this.map.getZoom();
		this.glyph_markers = [];
		this.style = {
			fontFamily: "sans-serif",
			fontSize: this.base_font_size,
			opacity: 0.85,
			pointerEvents: "none",
			...this.options.style
		};
		this.text_string = this.options.text_string;
		
		this.canvas = document.createElement("canvas");
		this.ctx = this.canvas.getContext("2d");
		
		//Event handling and initial render
		this.onviewchange_handler = this.render.bind(this);
		this.map.on("zoomend zooming moving moveend rotate pitch", this.onviewchange_handler);
		this.render();
	}
	
	/**
	 * Returns smoothed points between coords for arc curves.
	 * - Method of: {@link Geospatiale.maptalks_CurvedText}
	 * 
	 * @param {Array.<number[]>} arg0_coords
	 * @param [arg1_samples_per_segment=25]
	 * 
	 * @returns {Array.<number[]>}
	 */
	getSmoothPoints (arg0_coords, arg1_samples_per_segment) {
		//Convert from parameters
		let coords = arg0_coords;
		let samples_per_segment = Math.returnSafeNumber(arg1_samples_per_segment, 25);
		
		if (coords.length < 2) return coords; //Internal guard clause
		
		//Declare local instance variables
		let pt_list = [];
		let smooth_points =  [];
		
		//Iterate over coords
		for (let i = 0; i < coords.length; i++) {
			let local_coord = coords[i];
			let local_point = (local_coord.x !== undefined && local_coord.y !== undefined) ?
				[local_coord.x, local_coord.y] : [local_coord[0], local_coord[1]];
			pt_list.push(local_point);
		}
		
		//Iterate over pt_list
		for (let i = 0; i < pt_list.length - 1; i++) {
			let p0 = (i > 0) ? pt_list[i - 1] : pt_list[i];
			let p1 = pt_list[i];
			let p2 = pt_list[i + 1];
			let p3 = (i < pt_list.length - 2) ? pt_list[i + 2] : p2;
			
			//Iterate over samples_per_segment for segment
			for (let t = 0; t < 1; t += 1/samples_per_segment) {
				let t2 = t*t;
				let t3 = t2*t;
				let x = 0.5*((2 * p1[0]) + (-p0[0] + p2[0])*t + (2*p0[0] - 5*p1[0] + 4*p2[0] - p3[0])*t2 + (-p0[0] + 3*p1[0] - 3*p2[0] + p3[0])*t3);
				let y = 0.5*((2 * p1[1]) + (-p0[1] + p2[1])*t + (2*p0[1] - 5*p1[1] + 4*p2[1] - p3[1])*t2 + (-p0[1] + 3*p1[1] - 3*p2[1] + p3[1])*t3);
				smooth_points.push([x, y]);
			}
		}
		smooth_points.push(pt_list[pt_list.length - 1]);
		
		//Return statement
		return smooth_points;
	}
	
	/**
	 * Measures actual text width using a `<canvas>` to assess kerning.
	 * - Method of: {@link Geospatiale.maptalks_CurvedText}
	 * 
	 * @param {string} arg0_text
	 * @param {number} arg1_font_size
	 * 
	 * @returns {number}
	 */
	measureTextWidth (arg0_text, arg1_font_size) {
		//Convert from parameters
		let text = (arg0_text) ? arg0_text : "";
		let font_size =  Math.returnSafeNumber(arg1_font_size, this.base_font_size);
		
		//Declare local instance variables
		this.ctx.font = `bold ${font_size + Math.returnSafeNumber(this.options.letter_spacing)}px ${this.style.fontFamily}`;
		
		let metrics = this.ctx.measureText(text);
		
		//Return statement
		return metrics.width;
	}
	
	/**
	 * Removes the maptalks_CurvedText geometry from the map.
	 * - Method of: {@link Geospatiale.maptalks_CurvedText}
	 */
	remove () {
		//Remove map view event handlers
		if (this.map && this.onviewchange_handler)
			this.map.off("zoomend zooming moving moveend rotate pitch", this.onviewchange_handler);
		
		//Iterate over all this.glyph_markers and remove them
		for (let i = 0; i < this.glyph_markers.length; i++)
			this.glyph_markers[i].remove();
		this.glyph_markers = [];
	}
	
	/**
	 * Renders the maptalks_CurvedText geometry to the map.
	 * - Method of: {@link Geospatiale.maptalks_CurvedText}
	 */
	render () {
		if (!this.map || !this.text_string) return; //Internal guard clause
		
		//Declare local instance variables
		let char_widths = [];
		let cumulative_distances = [0];
		let map_bearing = this.map.getBearing();
		let sampled_coords = this.getSmoothPoints(this.coords, 25);
		let projected_points = [];
		let text_total_width = 0;
		let total_path_length = 0;
		
		//Iterate over all sampled_coords
		for (let i = 0; i < sampled_coords.length; i++) {
			let local_coord = new maptalks.Coordinate(sampled_coords[i]);
			let local_point = this.map.coordToPoint(local_coord, this.base_zoom);
			
			projected_points.push({ coord: local_coord, x: local_point.x, y: local_point.y });
		}
		
		//Iterate over all projected_points, calculate total_path_length; cumulative_distances
		for (let i = 1; i < projected_points.length; i++) {
			let dx = projected_points[i].x - projected_points[i - 1].x;
			let dy = projected_points[i].y - projected_points[i - 1].y;
			let distance = Math.sqrt(dx*dx + dy*dy);
			
			total_path_length += distance;
			cumulative_distances.push(total_path_length);
		}
		
		//Iterate over all characters in this.text_string; calculate char_widths, text_total_width
		for (let i = 0; i < this.text_string.length; i++) {
			let local_width = this.measureTextWidth(this.text_string[i], this.base_font_size);
			
			char_widths.push(local_width);
			text_total_width += local_width;
		}
		
		//Render character constants
		let start_distance = (total_path_length - text_total_width)/2;
		if (start_distance < 0) start_distance = 0;
		
		let current_zoom = this.map.getZoom();
		let zoom_scale = Math.pow(2, current_zoom - this.base_zoom);
		
		let current_font_size = this.base_font_size*zoom_scale;
		let marker_index = 0;
		let running_distance = start_distance;
		
		let renderChar = (i, arg1_options) => {
			//Convert from parameters
			let options = (arg1_options) ? arg1_options : {};
			
			//Declare local instance variables
			let char = this.text_string[i];
			let char_width = char_widths[i];
			let target_distance = running_distance + (char_width/2);
			
			if (target_distance > total_path_length) return; //Internal guard clause for truncation
			
			let segment_index = 0;
			while (segment_index < cumulative_distances.length - 2 && cumulative_distances[segment_index + 1] < target_distance)
				segment_index++;
			
			//Declare maths variables
			let d1 = cumulative_distances[segment_index];
			let d2 = cumulative_distances[segment_index + 1];
			let p1 = projected_points[segment_index];
			let p2 = projected_points[segment_index + 1];
			let ratio = (d2 > d1) ? (target_distance - d1)/(d2 - d1) : 0;
			
			let current_x = p1.x + (p2.x - p1.x)*ratio;
			let current_y = p1.y + (p2.y - p1.y)*ratio;
			let dx = p2.x - p1.x;
			let dy = p2.y - p1.y;
			
			let angle_deg = (Math.atan2(dy, dx)*180)/Math.PI;
			let target_pt = new maptalks.Point(current_x, current_y);
			let target_coord = this.map.pointToCoord(target_pt, this.base_zoom);
			let total_rotation = angle_deg;
			if (options.invert) total_rotation += 180;
			
			//Local helper function: sample two orthogonal screen-aligned world directions and take the maximum; corresponds to the unforeshortened axis (parallel to the camera's tilt) = pure distance attenuation
			let current_zoom = this.map.getZoom();
			let scale_constant = 100;
			let screen_pt = this.map.coordToContainerPoint(target_coord);
			let world_pt = this.map.coordToPoint(target_coord, current_zoom);
			
			let bearing_rad = -(this.map.getBearing()*Math.PI)/180; //Bearing is a float in [-180, 180]; trig handles wrapping implicitly
			let cos_bearing = Math.cos(bearing_rad);
			let sin_bearing = Math.sin(bearing_rad);
			
			let scaleAlong = (offset_x, offset_y) => {
				//Counter-rotate the requested screen-space direction into world-space
				let rotated_x = (offset_x*cos_bearing) - (offset_y*sin_bearing);
				let rotated_y = (offset_x*sin_bearing) + (offset_y*cos_bearing);
				
				let world_pt_offset = new maptalks.Point(world_pt.x + rotated_x, world_pt.y + rotated_y);
				let coord_offset = this.map.pointToCoord(world_pt_offset, current_zoom);
				let screen_pt_offset = this.map.coordToContainerPoint(coord_offset);
				
				//Return statement
				return screen_pt.distanceTo(screen_pt_offset)/scale_constant;
			};
			
			let perspective_scale = Math.max(scaleAlong(scale_constant, 0), scaleAlong(0, scale_constant));
			let zoom_scale = Math.pow(2, current_zoom - this.base_zoom);
			let current_font_size = this.base_font_size*zoom_scale*perspective_scale;
			
			let dom_el = document.createElement("div");
			//This needs an inner element since transform is reserved on wrapper
			dom_el.innerHTML = `<span style = "position: absolute; transform: translate(-50%, -50%) rotateZ(${-total_rotation}deg);">${char}</span>`;
			
			if (this.options.class) {
				dom_el.setAttribute("class", this.options.class);
			} else {
				Object.iterate(this.style, (local_key, local_value) =>
					dom_el.style[local_key] = String(local_value));
				dom_el.style.fontSize = `${current_font_size}px`;
			}
			
			if (marker_index < this.glyph_markers.length) {
				let existing_marker = this.glyph_markers[marker_index];
				existing_marker.setCoordinates(target_coord);
				existing_marker.setContent(dom_el);
				if (!existing_marker.isVisible()) existing_marker.show();
			} else {
				let new_marker = new maptalks.ui.UIMarker(target_coord, {
					draggable: false,
					single: false,
					eventsPropagation: false,
					pitchWithMap: true,
					rotateWithMap: true,
					
					content: dom_el
				});
				new_marker.addTo(this.map);
				this.glyph_markers.push(new_marker);
			}
			
			running_distance += char_width;
			marker_index++;
		};
		
		//Render all characters depending on map bearing
		if (map_bearing > -90 && map_bearing <= 90) {
			for (let i = 0; i < this.text_string.length; i++) renderChar(i);
		} else {
			for (let i = this.text_string.length - 1; i >= 0; i--) renderChar(i, { invert: true });
		}
		
		//Remove markers as needed
		while (this.glyph_markers.length > marker_index) {
			let removed_marker = this.glyph_markers.pop();
			removed_marker.remove();
		}
	}
	
	/**
	 * Sets coordinates for the maptalks_CurvedText geometry.
	 * - Method of: {@link Geospatiale.maptalks_CurvedText}
	 * 
	 * @param {Array.<number[]>} arg0_coords
	 */
	setCoordinates (arg0_coords) {
		//Convert from parameters
		let coords = arg0_coords;
		
		//Set coords, then render
		this.coords = coords;
		this.render();
	}
	
	/**
	 * Sets the font size for the maptalks_CurvedText geometry.
	 * - Method of: {@link Geospatiale.maptalks_CurvedText}
	 * 
	 * @param {number} arg0_size
	 */
	setFontSize (arg0_size) {
		//Convert from parameters
		let font_size = Math.returnSafeNumber(arg0_size, 16);
		
		//Refresh font_size relative to screenspace
		this.base_font_size = font_size;
		this.base_zoom = this.map.getZoom();
		this.render();
	}
	
	/**
	 * Sets the new text for the maptalks_CurvedText geometry.
	 * - Method of: {@link Geospatiale.maptalks_CurvedText}
	 * 
	 * @param {string} arg0_text
	 */
	setText (arg0_text) {
		//Convert from parameters
		let text = arg0_text;
		
		//Set text, then render
		this.text_string = text;
		this.render();
	}
	
	/**
	 * Internal helper function to refresh zoom.
	 * - Method of: {@link Geospatiale.maptalks_CurvedText}
	 */
	updateZoom () { this.render(); }
};