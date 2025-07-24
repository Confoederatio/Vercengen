ve.ComponentURL = class {
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
		html_string.push(`<input type = "url" id = "url-input" placeholder = "http://example.com" ${objectToAttributes(options.attributes)}>`);
		
		//Populate element and initialise handlers
		this.element.innerHTML = html_string.join("");
	}
	
	setInput (arg0_value) {
		//Convert from parameters
		var value = arg0_value;
		
		//Set value
		this.element.querySelector(`input[type="url"]`).value = value;
	}
};