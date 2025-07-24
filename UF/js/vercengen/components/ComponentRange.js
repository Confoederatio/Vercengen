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
		var actual_number_in_range = calculateNumberInRange(
			[
				returnSafeNumber(this.options.value.attributes.min, 0),
				returnSafeNumber(this.options.value.attributes.max, 100)
			], value, this.options.value.value_equation
		);
		var range_el = this.element.querySelector(`input[type="range"]`);
		
		//Set value
		range_el.value = actual_number_in_range;
	}
};