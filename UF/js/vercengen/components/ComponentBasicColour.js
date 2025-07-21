ve.ComponentBasicColour = class { //[WIP] - Finish Class and refactoring
	constructor (arg0_options) {
		//Convert from parameters
		this.options = (arg0_options) ? arg0_options : {};
		
		//Declare local instance variables
		this.element = document.createElement("span");
		var html_string = [];
		var options = this.options;
		
		if (options.name)
			html_string.push(`<span>${options.name}</span> `);
		html_string.push(`<input type = "color" ${objectToAttributes(options.attributes)}>`);
		
		//Populate element and initialise handlers
		this.element.innerHTML = html_string.join("");
		
		if (options.onclick)
			this.handleOnclick(options.onclick);
	}
	
	handleOnclick (arg0_function) {
		//Convert from parameters
		var local_function = arg0_function;
		
		//Set handler
		this.element.querySelector(`input[type="color"]`).onchange = (e) => {
			e.component = this;
			local_function(e);
		}
	}
};