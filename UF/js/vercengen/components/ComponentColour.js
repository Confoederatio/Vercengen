/**
 * <span color = "yellow">{@link Class}</span>: ComponentColour
 *
 * ##### Instance:
 * - `.element`: {@link HTMLElement}
 * - `.options`: {@link Object}
 *   - `.attributes`: {@link Object}
 *   - `.placeholder`: {@link Array}<{@link number}, {@link number}, {@link number}>|{@link string}
 *
 * - - `.onclick`: function({@link ve.ComponentColourOnclickEvent})
 *
 * ##### Methods:
 * - <span color=00ffff>{@link ve.ComponentColour.getInput|getInput}</span> | {@link Array}<{@link number}, {@link number}, {@link number}>
 *
 * @type {ve.ComponentColour}
 */
ve.ComponentColour = class { //[WIP] - Finish Class and refactoring
	constructor (arg0_options) {
		//Convert from parameters
		this.options = (arg0_options) ? arg0_options : {};
		
		//Declare local instance variables
		this.element = document.createElement("span");
		var html_string = [];
		var options = this.options;
		
		//Format html_string
		if (options.name)
			html_string.push(`<div class = "header">${options.name}</div>`);

		//High-intensity - take a page from Naissance colour wheels
		html_string.push(`<div class = "colour-picker-container">`);
			//Colour picker HTML
			html_string.push(`<img id = "colour-picker-hue" class = "colour-picker-hue" src = "./UF/gfx/colour_wheel.png">`);
			html_string.push(`<div id = "colour-picker-brightness" class = "colour-picker-brightness"></div>`);

			html_string.push(`<div id = "colour-picker-cursor" class = "colour-picker-cursor"></div>`);
			html_string.push(`<div id = "colour-picker" class = "colour-picker-mask"></div>`);

			//RGB inputs
			html_string.push(`<div class = "rgb-inputs">`);
				html_string.push(`R: <input type = "number" id = "r" value = "255"><br>`);
				html_string.push(`G: <input type = "number" id = "g" value = "255"><br>`);
				html_string.push(`B: <input type = "number" id = "b" value = "255"><br>`);
			html_string.push(`</div>`);

			//No select
			html_string.push(`<span class = "no-select">`);
				html_string.push(`<span class = "brightness-range-container">`);
					html_string.push(`<input type = "range" min = "0" max = "100" value = "100" id = "colour-picker-brightness-range" class = "colour-picker-brightness-range">`);
					html_string.push(`<span id = "brightness-header" class = "small-header">BRT | 1</span>`);
				html_string.push(`</span>`);

				html_string.push(`<span class = "opacity-range-container">`);
					html_string.push(`<input type = "range" min = "0" max = "100" value = "50" id = "colour-picker-opacity-range" class = "colour-picker-opacity-range">`);
					html_string.push(`<span id = "opacity-header" class = "small-header">OPA | 0.5</span>`);
				html_string.push(`</span>`);
			html_string.push(`</span>`);
		html_string.push(`</div>`);
		
		//Populate element and initialise handlers
		this.element.innerHTML = html_string.join("");
		this.handleEvents();
	}
	
	/**
	 * Returns the present component's RGB value.
	 *
	 * @returns {Array<number, number, number>}
	 */
	getInput () {
		//Return statement
		return getColourFromFields(this.element);
	}
	
	/**
	 * Extends {@link HTMLEvent.prototype.onchange}
	 *
	 * @typedef ve.ComponentColourOnclickEvent
	 */
	
	/**
	 * Initialises event handlers for the present Component.
	 */
	handleEvents () {
		handleColourWheel(this.element);
		if (this.options.onclick)
			this.element.onchange = this.options.onclick;
	}
	
	/**
	 * Sets the RGB value for the present component with an RGB array.
	 *
	 * @param {Array<number, number, number>} arg0_value
	 */
	setInput (arg0_value) {
		//Convert from parameters
		var value = arg0_value;
		if (value == undefined) return;
		
		//Declare local instance variables
		var b_el = this.element.querySelector(`input#b`);
		var g_el = this.element.querySelector(`input#g`);
		var r_el = this.element.querySelector(`input#r`);
		
		//Set numbers and update colour wheel
		r_el.value = value[0];
		g_el.value = value[1];
		b_el.value = value[2];
	}
};

//Initialise functions
{
	function handleColourWheel (arg0_parent_selector) {
		//Convert from parameters
		var parent_selector = arg0_parent_selector;
		
		//Declare local instance variables
		var parent_el = (typeof parent_selector == "string") ? document.querySelector(parent_selector) : parent_selector;
		
		var brightness_el = parent_el.querySelector(`#colour-picker-brightness-range`);
		var colour_brightness_el = parent_el.querySelector(`#colour-picker-brightness`);
		var colour_cursor_el = parent_el.querySelector(`#colour-picker-cursor`);
		var colour_wheel_el = parent_el.querySelector(`#colour-picker`);
		var opacity_el = parent_el.querySelector(`#colour-picker-opacity-range`);
		
		var b_el = parent_el.querySelector(`#b`);
		var g_el = parent_el.querySelector(`#g`);
		var r_el = parent_el.querySelector(`#r`);
		
		//Calculate rem_px
		var root_font_size = window.getComputedStyle(document.documentElement).fontSize;
		var rem_px = parseFloat(root_font_size.replace("px", ""));
		
		//colour_wheel_el onclick handler
		colour_wheel_el.onclick = function (e) {
			var bounding_rect = e.target.getBoundingClientRect();
			var coord_x = e.clientX - bounding_rect.left;
			var coord_y = e.clientY - bounding_rect.top;
			var name_label_el = parent_el.querySelector(`#name-label`);
			
			colour_cursor_el.style.left = `calc(${coord_x}px - 6px)`;
			colour_cursor_el.style.top = `calc(${coord_y}px - 6px)`;
			
			//Apply post-rem offset
			coord_x += rem_px;
			coord_y += rem_px;
			if (name_label_el) coord_y += name_label_el.offsetHeight;
			
			//Get r,g,b value of pixel
			removeErrorHandlers(); //Remove error handlers; restore later
			var temp_parent_el = parent_el.cloneNode(true);
			document.body.appendChild(temp_parent_el); //Temporarily append child to body for reading; restore later
			
			temp_parent_el.querySelector(`#colour-picker-cursor`).remove(); //Remove cursor from interference
			html2canvas(temp_parent_el, { logging: true }).then((canvas) => {
				var ctx = canvas.getContext("2d");
				
				var canvas_height = ctx.canvas.height;
				var canvas_width = ctx.canvas.width;
				var pixel = ctx.getImageData(coord_x, coord_y, 1, 1).data;
				
				//Set colour wheel CSS, interaction
				colour_cursor_el.style.background = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
				r_el.value = pixel[0];
				g_el.value = pixel[1];
				b_el.value = pixel[2];
				restoreErrorHandlers();
				
				//'onchange' handler
				if (parent_el.onchange)
					(typeof parent_el.onchange == "string") ?
						eval(parent_el.onchange) : parent_el.onchange([pixel[0], pixel[1], pixel[2]]);
			});
			temp_parent_el.remove();
		};
		
		//Range change listeners
		onRangeChange(brightness_el, function (e) {
			var brightness_value = parseInt(brightness_el.value);
			
			//Set brightness opacity
			colour_brightness_el.style.opacity = `${1 - brightness_value*0.01}`;
			updateBrightnessOpacityHeaders(parent_el);
		});
		onRangeChange(opacity_el, function (e) {
			if (e.onclick) {
				var local_expression = e.onclick;
				var local_result = new Function(local_expression)(e);
			}
			
			//Set brightness opacity
			updateBrightnessOpacityHeaders(parent_el);
		});
		
		//RGB listeners
		r_el.onchange = function () {
			this.value = Math.max(Math.min(this.value, 255), 0);
			setColourWheelCursor(parent_el, [r_el.value, g_el.value, b_el.value]);
		};
		g_el.onchange = function () {
			this.value = Math.max(Math.min(this.value, 255), 0);
			setColourWheelCursor(parent_el, [r_el.value, g_el.value, b_el.value]);
		};
		b_el.onchange = function () {
			this.value = Math.max(Math.min(this.value, 255), 0);
			setColourWheelCursor(parent_el, [r_el.value, g_el.value, b_el.value]);
		};
	}
	
	function getColourFromFields (arg0_colour_el) {
		//Convert from parameters
		var colour_el = arg0_colour_el;
		
		//Declare local instance variables
		var b_el = colour_el.querySelector(`input#b`);
		var g_el = colour_el.querySelector(`input#g`);
		var r_el = colour_el.querySelector(`input#r`);
		
		//Return statement
		return [parseInt(r_el.value), parseInt(g_el.value), parseInt(b_el.value)];
	}
	
	function setColourWheelCursor (arg0_parent_selector, arg1_colour, arg2_do_not_change) {
		//Convert from parameters
		var parent_selector = arg0_parent_selector;
		var colour = arg1_colour;
		var do_not_change = arg2_do_not_change;
		
		//Declare local instance variables
		var parent_el = (typeof parent_selector == "string") ? document.querySelector(parent_selector) : parent_selector;
		
		var brightness_el = parent_el.querySelector(`#colour-picker-brightness-range`);
		var colour_brightness_el = parent_el.querySelector(`#colour-picker-brightness`);
		var colour_cursor_el = parent_el.querySelector(`#colour-picker-cursor`);
		var colour_picker_el = parent_el.querySelector(`.colour-picker-container`);
		var colour_picker_hue_el = parent_el.querySelector(`.colour-picker-hue`);
		var has_colour = false;
		var max_brightness = 255;
		
		//Check if colour is defined
		if (colour)
			if (Array.isArray(colour))
				if (colour.length >= 3) {
					//Get closest r, g, b value in colour wheel and teleport cursor there
					has_colour = true;
					colour_cursor_el.style.visibility = "hidden";
					
					//Adjust brightness_el to new maximum brightness
					max_brightness = Math.max(Math.max(colour[0], colour[1]), colour[2])/255;
					
					brightness_el.value = max_brightness*100;
					colour_brightness_el.style.opacity = `${1 - max_brightness}`;
					
					//Set r, g, b colour fields
					parent_el.querySelector(`.rgb-inputs #r`).value = colour[0];
					parent_el.querySelector(`.rgb-inputs #g`).value = colour[1];
					parent_el.querySelector(`.rgb-inputs #b`).value = colour[2];
					
					//Move colour_cursor_el
					removeErrorHandlers();
					var temp_parent_el = colour_picker_el.cloneNode(true);
					document.body.appendChild(temp_parent_el); //Temporarily append child to body for reading; restore later
					
					temp_parent_el.querySelector(`#colour-picker-cursor`).remove(); //Remove cursor from interference
					html2canvas(temp_parent_el, { logging: false }).then((canvas) => {
						var ctx = canvas.getContext("2d");
						
						var canvas_height = ctx.canvas.height;
						var canvas_width = ctx.canvas.width;
						var circle_radius = canvas_width/2;
						var image_data = ctx.getImageData(0, 0, canvas_width, canvas_height).data;
						
						//Iterate over all image_data; each pixel has 4 elements
						var closest_pixel = [10000000, 0, 0]; //[colour_distance, x, y];
						
						//Iterate over image_data array
						for (var i = 0; i < image_data.length; i += 4) {
							var local_colour = [image_data[i], image_data[i + 1], image_data[i + 2]];
							
							if (local_colour.join(", ") != "255, 255, 255") {
								var distance_from_colour = deltaE(colour, local_colour);
								
								if (distance_from_colour < closest_pixel[0]) {
									//Calculate local_x, local_y
									var local_x = (i/4) % canvas_width;
									var local_y = Math.floor((i/4)/canvas_width);
									
									closest_pixel = [distance_from_colour, local_x, local_y, i];
								}
							}
						}
						
						//Set cursor colour
						colour_cursor_el.style.background = `rgb(${colour[0]}, ${colour[1]}, ${colour[2]})`;
						
						//Check if closest_pixel[1], closest_pixel[2] are inside circle
						if (
							pointIsInCircle(0, 0, closest_pixel[1], closest_pixel[2], circle_radius)
						) {
							colour_cursor_el.style.left = `calc(${closest_pixel[1]}px - 6px*2)`;
							colour_cursor_el.style.top = `calc(${closest_pixel[2]}px - 6px)`;
						} else {
							//If not, use closest point to edge of circle instead
							var bounding_rect = colour_picker_hue_el.getBoundingClientRect();
							var cursor_coords = closestPointInCircle(0, 0, closest_pixel[1], closest_pixel[2], circle_radius);
							
							var actual_x = (cursor_coords[0])*(bounding_rect.width/canvas_width);
							var actual_y = (cursor_coords[1])*(bounding_rect.height/canvas_height);
							
							colour_cursor_el.style.left = `calc(${actual_x}px - 6px)`;
							colour_cursor_el.style.top = `calc(${actual_y}px - 6px - 1rem)`;
						}
						
						colour_cursor_el.style.visibility = "visible";
						restoreErrorHandlers();
					});
					temp_parent_el.remove();
					
					//'onchange' handler
					if (Array.isArray(colour)) {
						colour[0] = parseInt(colour[0]);
						colour[1] = parseInt(colour[1]);
						colour[2] = parseInt(colour[2]);
						
						(typeof parent_el.onchange == "string") ?
							eval(parent_el.onchange) : parent_el.onchange(colour);
					}
				}
		
		//If no colour is defined, set cursor to the dead middle of the colour picker
		if (!has_colour)
			colour_cursor_el.style.top = `calc(${colour_picker_el.offsetHeight/3}px - 6px)`;
	}
	
	function updateBrightnessOpacityHeaders (arg0_parent_selector) {
		//Convert from parameters
		var parent_selector = arg0_parent_selector;
		
		//Declare local instance variables
		var parent_el = (typeof parent_selector == "string") ? document.querySelector(parent_selector) : parent_selector;
		
		var brightness_el = parent_el.querySelector(`#colour-picker-brightness-range`);
		var brightness_header_el = parent_el.querySelector(`#brightness-header`);
		var opacity_el = parent_el.querySelector(`#colour-picker-opacity-range`);
		var opacity_header_el = parent_el.querySelector(`#opacity-header`);
		
		var brightness_value = parseInt(brightness_el.value);
		var opacity_value = parseInt(opacity_el.value);
		
		//Update values
		if (brightness_header_el)
			brightness_header_el.innerHTML = `BRT | ${brightness_value/100}`;
		if (opacity_header_el)
			opacity_header_el.innerHTML = `OPA | ${opacity_value/100}`;
	}
}