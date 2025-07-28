/**
 * <span color = "yellow">{@link Class}</span>: ComponentURL
 *
 * ##### Instance:
 * - `.element`: {@link HTMLElement}
 * - `.options`: {@link Object}
 *   - `.attributes`: {@link Object}
 *   - `.name`: {@link string}
 *   - `.placeholder`: {@link string}
 *
 * ##### Methods:
 * - <span color=00ffff>{@link ve.ComponentURL.getInput|getInput}</span> | {@link string}
 * - <span color=00ffff>{@link ve.ComponentURL.setInput|setInput}</span>(arg0_value: {@link string})
 *
 * @type {ve.ComponentURL}
 */
ve.ComponentURL = class { //[WIP] - Missing handleEvents()
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
	
	/**
	 * Returns the URL of the present Component.
	 *
	 * @returns {string}
	 */
	getInput () {
		//Return statement
		return this.element.querySelector(`input[type="url"]`).value;
	}
	
	/**
	 * Sets the URL value for the present Component as a string.
	 *
	 * @param {string} arg0_value
	 */
	setInput (arg0_value) {
		//Convert from parameters
		var value = arg0_value;
		
		//Set value
		this.element.querySelector(`input[type="url"]`).value = value;
	}
};