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
		this.handleEvents();
	}
	
	fill (arg0_value) {
		//Convert from parameters
		var value = arg0_value;
		
		//Declare local instance variables
		var input_el = this.element.querySelector(`input[type="color"]`);
		
		if (Array.isArray(value)) {
			input_el.value = RGBToHex(value);
		} else if (typeof value == "string") {
			input_el.value = value;
		}
	}
	
	handleEvents (arg0_function) {
		//Declare local instance variables
		var colour_input_el = this.element.querySelector(`input[type="color"]`);
		
		//Set handler
		if (this.options.onclick)
			colour_input_el.onchange = (e) => {
				e.component = this;
				this.options.onclick(e);
			}
	}
};