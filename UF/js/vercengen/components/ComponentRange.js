ve.ComponentRange = class { //[WIP] - Finish Class and refactoring
	constructor (arg0_options) {
		//Convert from parameters
		this.options = (arg0_options) ? arg0_options : {};
		
		//Declare local instance variables
		this.element = document.createElement("span");
		var html_string = [];
		var options = this.options;
		
		//Format html_string
		var name_string = (options.name) ? `${options.name} ` : "";
		
		html_string.push(`${name_string}<input type = "range" id = "range-input"${objectToAttributes(options.attributes)} value = "${returnSafeNumber(options.placeholder)}">`);
		
		//Populate element and initialise handlers
		this.element.innerHTML = html_string.join("");
	}
};