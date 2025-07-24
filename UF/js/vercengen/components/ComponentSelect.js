ve.ComponentSelect = class { //[WIP] - Finish Class and refactoring
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
		//Similar to datalist
		html_string.push(`<select class = "select-menu" ${objectToAttributes(options.attributes)}>`);
		//Add .options to select
		var all_options = Object.keys(options.options);
		
		//Iterate over all_options
		for (var i = 0; i < all_options.length; i++) {
			var local_value = options.options[all_options[i]];
			
			//Push option to html_string
			html_string.push(`<option value = "${all_options[i]}">${local_value}</option>`);
		}
		html_string.push(`</select>`);
		
		//Populate element and initialise handlers
		this.element.innerHTML = html_string.join("");
		this.handleEvents();
	}
	
	handleEvents () {
		if (this.options.onclick)
			this.element.onchange = this.options.onclick;
	}
	
	setInput (arg0_value) {
		//Convert from parameters
		var value = arg0_value;
		
		//Declare local instance variables
		this.element.querySelector(`select`).value = value;
	}
};