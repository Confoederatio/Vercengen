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
	}
};