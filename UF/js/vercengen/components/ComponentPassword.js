/**
 * <span color = "yellow">{@link Class}</span>: ComponentPassword
 *
 * ##### Instance:
 * - `.element`: {@link HTMLElement}
 * - `.options`: {@link Object}
 *   - `.attributes`: {@link Object}
 *   - `.name`: {@link string}
 *   - `.placeholder`: {@link string}
 *
 * ##### Methods:
 * - <span color=00ffff>{@link ve.ComponentPassword.getInput|getInput}</span> | {@link string}
 * - <span color=00ffff>{@link ve.ComponentPassword.setInput|setInput}</span>(arg0_value: {@link string})
 *
 * @type {ve.ComponentPassword}
 */
ve.ComponentPassword = class { //[WIP] - Finish Class and refactoring
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
		html_string.push(`<input type = "password" id = "password-input" ${objectToAttributes(options.attributes)}>`);
		
		//Populate element and initialise handlers
		this.element.innerHTML = html_string.join("");
	}
	
	/**
	 * Returns the present Component's value as a string.
	 *
	 * @returns {string}
	 */
	getInput () {
		//Return statement
		return this.element.querySelector(`input[type="password"]`).value;
	}
	
	/**
	 * Sets the value of the present Component.
	 *
	 * @param {string} arg0_value
	 */
	setInput (arg0_value) {
		//Convert from parameters
		var value = arg0_value;
		
		//Set value
		this.element.querySelector(`input[type="password"]`).value = value;
	}
};