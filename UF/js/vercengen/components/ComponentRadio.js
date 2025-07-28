/**
 * <span color = "yellow">{@link Class}</span>: ComponentRadio
 *
 * ##### Instance:
 * - `.element`: {@link HTMLElement}
 * - `.options`: {@link Object}
 *   - `.attributes`: {@link Object}
 *   - `.name`: {@link string}
 *   - `.placeholder`: {@link Object}<{@link boolean}>
 *
 * - - `.options`: {@link Object} - An `.id` to human-readable name map for all suboptions in the radio list component.
 *
 * ##### Methods:
 * - <span color=00ffff>{@link ve.ComponentRadio.getInput|getInput}</span> | {@link string}
 * - <span color=00ffff>{@link ve.ComponentRadio.setInput|setInput}</span>(arg0_value: {@link string})
 *
 * @type {ve.ComponentRadio}
 */
ve.ComponentRadio = class { //[WIP] - Finish Class and refactoring; missing handleEvents()
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
	
	/**
	 * Returns a string with the ID of the chosen option.
	 *
	 * @returns {string}
	 */
	getInput () {
		//Declare local instance variables
		var all_radio_els = this.element.querySelectorAll(`[type="radio"]`);
		var output;
		
		//Iterate over all radio_els
		for (var i = 0; i < all_radio_els.length; i++)
			if (all_radio_els[i].checked) {
				output = all_radio_els[i].id;
				break;
			}
		
		//Return statement
		return output;
	}
	
	/**
	 * Sets the value for the present Component as an `.id` string.
	 *
	 * @param {string} arg0_value
	 */
	setInput (arg0_value) {
		//Convert from parameters
		var value = arg0_value;
		
		//Declare local instance variables
		var all_radio_els = this.element.querySelectorAll(`[type="radio"]`);
		
		//Iterate over all_radio_els
		for (let i = 0; i < all_radio_els.length; i++)
			if (value == all_radio_els[i].id)
				all_radio_els[i].checked = true;
	}
};