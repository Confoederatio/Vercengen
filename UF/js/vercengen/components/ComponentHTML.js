ve.ComponentHTML = class { //[WIP] - Finish Class and refactoring
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
		if (options.innerHTML)
			html_string.push(options.innerHTML);
		
		//Populate element and initialise handlers
		this.element.innerHTML = html_string.join("");
	}
	
	fill (arg0_value) {
		//Convert from parameters
		var value = arg0_value;
		
		//Set element fill
		if (typeof value == "object") {
			this.element = value;
		} else if (typeof value == "string") {
			this.element.innerHTML = value;
		}
	}
};