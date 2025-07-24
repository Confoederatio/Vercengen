ve.ComponentCheckbox = class { //[WIP] - Finish Class and refactoring
	constructor (arg0_options) {
		//Convert from parameters
		this.options = (arg0_options) ? arg0_options : {};
		
		//Declare local instance variables
		this.element = document.createElement("span");
		var html_string = [];
		var options = this.options;
		
		//Initialise options
		if (!options.placeholder) options.placeholder = options.default;
		var placeholder_list = getList(options.placeholder);
		
		//Delete VALUE; temporary fix
		delete options.options.VALUE;
		
		//Format html_string
		if (options.name)
			html_string.push(`<span>${options.name}</span><br>`);
		if (!options.options) {
			if (options.icon)
				html_string.push(`<img src = "${options.icon}">`);
			html_string.push(`<input type = "checkbox" ${objectToAttributes(options.attributes)}>`);
		} else {
			//Iterate over all options.options
			var all_suboptions = Object.keys(options.options);
			
			for (var i = 0; i < all_suboptions.length; i++) {
				var local_option = options.options[all_suboptions[i]];
				
				//Append checkbox
				var checked_string = "";
				if (placeholder_list.includes(all_suboptions[i]))
					checked_string = " checked";
				html_string.push(`<input id = "${all_suboptions[i]}" type = "checkbox" ${objectToAttributes(options.attributes)}${checked_string}>`);
				html_string.push(`<label for = "${all_suboptions[i]}">${local_option}</label><br>`);
			}
		}
		
		//Populate element and initialise handlers
		this.element.innerHTML = html_string.join("");
	}
	
	getInput () {
		//Declare local instance variables
		var all_checkboxes = this.element.querySelectorAll(`[type="checkbox"]`);
		var output = {};
		
		//Iterate over all_checkboxes
		for (var i = 0; i < all_checkboxes.length; i++)
			output[all_checkboxes[i].id] = (all_checkboxes[i].checked);
		
		//Return statement
		return output;
	}
	
	setInput (arg0_value) {
		//Convert from parameters
		var value = arg0_value;
			if (value == undefined) return;
		
		//Declare local instance variables
		var all_checkbox_els = this.element.querySelectorAll(`[type="checkbox"]`);
		
		//Iterate over all_checkbox_els
		for (let i = 0; i < all_checkbox_els.length; i++) try {
			if (value[all_checkbox_els[i].id]) {
				all_checkbox_els[i].checked = value[all_checkbox_els[i].id];
			} else {
				all_checkbox_els[i].checked = true;
			}
		} catch {}
	}
};