/**
 * <span color = "yellow">{@link Class}</span>: ComponentHTML
 *
 * ##### Instance:
 * - `.element`: {@link HTMLElement}
 * - `.options`: {@link Object}
 *   - `.name`: {@link string}
 *   - `.innerHTML`: {@link string}
 *
 * - - `.special_function`: function({@link ve.ComponentHTML.getInput})
 *
 * ##### Methods:
 * - <span color=00ffff>{@link ve.ComponentHTML.getInput|getInput}</span>
 * - <span color=00ffff>{@link ve.ComponentHTML.setInput|setInput}</span>(arg0_value: {@link HTMLElement}|{@link string})
 *
 * {@type ve.ComponentHTML}
 */
ve.ComponentHTML = class { //[WIP] - Finish Class and refactoring; missing handleEvents()
	constructor (arg0_options) {
		//Convert from parameters
		this.options = (arg0_options) ? arg0_options : {};
		
		//Declare local instance variables
		this.element = document.createElement("span");
		var html_string = [];
		var options = this.options;
		
		//Format html_string
		if (options.name)
			html_string.push(`<div class = "header">${options.name}</div>`);
		if (options.innerHTML)
			html_string.push(options.innerHTML);
		
		//Populate element and initialise handlers
		this.element.innerHTML = html_string.join("");
	}
	
	/**
	 * Returns the present Component's value based upon `this.options.special_function`.
	 *
	 * @returns {*}
	 */
	getInput () {
		//Return statement
		if (this.options.special_function)
			return this.options.special_function(this.element);
	}
	
	/**
	 * Sets the innerHTML of the present Component. Additionally accepts an HTMLElement value.
	 *
	 * @param {HTMLElement|string} arg0_value
	 */
	setInput (arg0_value) {
		//Convert from parameters
		var value = arg0_value;
		
		//Set element fill
		if (typeof value == "object") {
			this.element = value;
		} else if (typeof value == "string") {
			this.element.innerHTML = value;
		}
	}
};