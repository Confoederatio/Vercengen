ve.ComponentInterface = class { //[WIP] - Finish Class and refactoring
	constructor (arg0_options) {
		//Convert from parameters
		this.options = (arg0_options) ? arg0_options : {};
		
		//Declare local instance variables
		this.element = document.createElement("span");
		var html_string = [];
		var options = this.options;
		
		//Format html_string
		html_string.push(`<details id = "interface-folder-${options.id}">`);
			html_string.push(`<summary>${(options.name) ? options.name : options.id}</summary>`);
			html_string.push(`<div id = "interface-body"></div>`);
		html_string.push(`</details>`);
		
		//Populate element and initialise handlers
		this.element.innerHTML = html_string.join("");
	}
};