ve.ComponentTime = class {
	constructor (arg0_options) {
		//Convert from parameters
		this.options = (arg0_options) ? arg0_options : {};
		
		//Declare local instance variables
		this.element = document.createElement("span");
		var html_string = [];
		var options = this.options;
		
		//Format html_string
		if (options.name)
			html_string.push(options.name);
		html_string.push(`<input type = "time" id = "time-input" ${objectToAttributes(options.attributes)}>`);
		
		//Populate element and initialise handlers
		this.element.innerHTML = html_string.join("");
	}
	
	setInput (arg0_value) {
		//Convert from parameters
		var value = arg0_value;
		
		//Declare local instance variables
		var time_el = this.element.querySelector(`input[type="time"]`);
		
		if (!Array.isArray(value) && typeof value == "object") {
			time_el.value = `${(value.hour < 10) ? `0` : ""}${value.hour}:${(value.minute < 10) ? `0` : ""}${value.minute}`;
		} else if (Array.isArray(value)) {
			time_el.value = `${(value[0] < 10) ? `0` : ""}${value[0]}:${(value[1] < 10) ? `0` : ""}${value[1]}`;
		} else {
			time_el.value = value;
		}
	}
};