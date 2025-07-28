/**
 * <span color = "yellow">{@link Class}</span>: ComponentEmail
 *
 * ##### Instance:
 * - `.element`: {@link HTMLElement}
 * - `.options`: {@link Object}
 *   - `.attributes`: {@link Object}
 *   - `.name`: {@link string}
 *   - `.placeholder`: {@link string}
 *
 * ##### Methods:
 * - <span color=00ffff>{@link ve.ComponentEmail.getInput|getInput}</span>
 * - <span color=00ffff>{@link ve.ComponentEmail.setInput|setInput}</span>(arg0_value: {@link string})
 *
 * @type {ve.ComponentEmail}
 */
ve.ComponentEmail = class { //[WIP] - Finish Class and refactoring; missing handleEvents()
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
		html_string.push(`
			<input type = "email" id = "email-input" pattern = ".+@example\.com" size = "30" ${objectToAttributes(options.attributes)}>
		`);
		
		//Populate element and initialise handlers
		this.element.innerHTML = html_string.join("");
	}
	
	/**
	 * Returns a string representing the email inputted into the present Component.
	 *
	 * @returns {string}
	 */
	getInput () {
		//Return statement
		return this.element.querySelector(`input[type="email"]`).value;
	}
	
	/**
	 * Sets the email value for the present Component.
	 *
	 * @param {string} arg0_value
	 */
	setInput (arg0_value) {
		//Convert from parameters
		var value = arg0_value;
		
		//Set value
		this.element.querySelector(`input[type="email"]`).value = value;
	}
};