/**
 * <span color = "yellow">{@link Class}</span>: ComponentCheckbox
 *
 * ##### Instance:
 * - `.element`: {@link HTMLElement}
 * - `.options`: {@link Object}
 *   - `.attributes`: {@link Object}
 *   - `.placeholder`: {@link Array}<{@link string}>|{@link string} - A list of checked `.id` options.
 *
 * - - `.options`: {@link Object} - An `.id` to human-readable name map for all suboptions in the checkbox list component.
 *
 * ##### Methods:
 * - <span color=00ffff>{@link ve.ComponentCheckbox.getInput|getInput}</span> | {@link Object}<{@link boolean}>
 * - <span color=00ffff>{@link ve.ComponentCheckbox.setInput|setInput}</span>(arg0_value: {@link string})
 *
 * @type {ve.ComponentCheckbox}
 */
ve.ComponentCheckbox = class { //[WIP] - Missing handleEvents()
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
	
	/**
	 * Returns a boolean Object map of the present Component's state.
	 *
	 * @returns {{"'checkbox_id'": boolean}}
	 */
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
	
	/**
	 * Sets the value for the present Component as a boolean Object map.
	 *
	 * @param {{"'checkbox_id'": boolean}} arg0_value
	 */
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