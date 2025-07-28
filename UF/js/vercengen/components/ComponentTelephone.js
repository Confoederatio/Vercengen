/**
 * <span color = "yellow">{@link Class}</span>: ComponentTelephone
 *
 * ##### Instance:
 * - `.element`: {@link HTMLElement}
 * - `.options`: {@link Object}
 *   - `.attributes`: {@link Object}
 *   - `.name`: {@link string}
 *   - `.placeholder`: {@link string}
 *
 * ##### Methods:
 * - <span color=00ffff>{@link ve.ComponentTelephone.getInput|getInput}</span> | {@link string}
 * - <span color=00ffff>{@link ve.ComponentTelephone.setInput|setInput}</span>(arg0_value: {@link string}})
 *
 * @type {ve.ComponentTelephone}
 */
ve.ComponentTelephone = class { //[WIP] - Missing handleEvents()
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
		html_string.push(`${(options.name) ? options.name + " " : ""}<input type = "tel" id = "telephone-input" ${objectToAttributes(options.attributes)}>`);
		
		//Populate element and initialise handlers
		this.element.innerHTML = html_string.join("");
	}
	
	/**
	 * Returns the telephone input value of the present Component.
	 *
	 * @returns {string}
	 */
	getInput () {
		//Return statement
		return this.element.querySelector(`input[type="tel"]`).value;
	}
	
	/**
	 * Sets the string value for the telephone input's number.
	 *
	 * @param {string} arg0_value
	 */
	setInput (arg0_value) {
		//Convert from parameters
		var value = arg0_value;
		
		//Set value
		this.element.querySelector(`input[type="tel"]`).value = value;
	}
};