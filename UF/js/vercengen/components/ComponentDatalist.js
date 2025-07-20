ve.ComponentDatalist = class { //[WIP] - Finish Class and refactoring
	constructor (arg0_options) {
		//Convert from parameters
		this.options = (arg0_options) ? arg0_options : {};
		
		//Declare local instance variables
		this.element = document.createElement("span");
		var html_string = [];
		var options = this.options;
		
		//Format html_string
		delete options.options.VALUE;
		
		if (options.name)
			html_string.push(`<div class = "header">${options.name}</div>`);
		html_string.push(`<input list = "${options.id}-datalist" value = "${(options.placeholder) ? options.placeholder : ""}">`)
		html_string.push(`<datalist id = "${options.id}-datalist" class = "datalist">`);
			//Add .options to datalist
			var all_options = Object.keys(options.options);

			//Iterate over all_options
			for (var i = 0; i < all_options.length; i++) {
				var local_value = options.options[all_options[i]];

				//Push option to html_string
				html_string.push(`<option id = "${all_options[i]}" value = "${local_value}"></option>`);
			}
		html_string.push(`</datalist>`);
		
		//Populate element and initialise handlers
		this.element.innerHTML = html_string.join("");
	}
};