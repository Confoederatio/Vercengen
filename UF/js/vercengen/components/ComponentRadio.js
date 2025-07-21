ve.ComponentRadio = class { //[WIP] - Finish Class and refactoring
	constructor (arg0_options) {
		//Convert from parameters
		this.options = (arg0_options) ? arg0_options : {};
		
		//Declare local instance variables
		this.element = document.createElement("span");
		var html_string = [];
		var options = this.options;
		
		//Format html_string
		delete options.options.VALUE;
		if (!options.options) {
			if (options.name)
				html_string.push(options.name);
			html_string.push(`<input type = "radio" id = "radio-input" ${objectToAttributes(options.attributes)}>`);
		} else {
			//Iterate over all options.options
			var all_suboptions = Object.keys(options.options);

			for (var i = 0; i < all_suboptions.length; i++) {
				var local_option = options.options[all_suboptions[i]];

				//Append radio
				var checked_string = "";
				if (all_suboptions[i] == options.default)
					checked_string = " checked";
				html_string.push(`<input type = "radio" id = "${all_suboptions[i]}" name = "radio-input" ${objectToAttributes(options.attributes)}${checked_string}>`);
				html_string.push(`<label for = "${all_suboptions[i]}">${local_option}</label>`);
			}
		}
		
		//Populate element and initialise handlers
		this.element.innerHTML = html_string.join("");
	}
};