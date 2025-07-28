/**
 * <span color = "yellow">{@link Class}</span>: ComponentText
 *
 * ##### Instance:
 * - `.element`: {@link HTMLElement}
 * - `.options`: {@link Object}
 *   - `.attributes`: {@link Object}
 *   - `.name`: {@link string}
 *   - `.placeholder`: {@link string}
 *
 * - - `.onchange`: function({@link ve.ComponentTextOnclickEvent})
 *   - `.onclick`: function({@link ve.ComponentTextOnclickEvent})
 *
 * ##### Methods:
 * - <span color=00ffff>{@link ve.ComponentText.getInput|getInput}</span> | {@link string}
 * - <span color=00ffff>{@link ve.ComponentText.handleEvents|handleEvents}</span>
 * - <span color=00ffff>{@link ve.ComponentText.setInput|setInput}</span>(arg0_value: {@link string})
 *
 * @type {ve.ComponentText}
 */
ve.ComponentText = class {
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
		html_string.push(`<input type = "text" id = "text-input" ${objectToAttributes(options.attributes)}>`);
		
		//Populate element and initialise handlers
		this.element.innerHTML = html_string.join("");
		this.handleEvents();
	}
	
	/**
	 * Returns the inputted text input from the present Component.
	 *
	 * @returns {string}
	 */
	getInput () {
		//Return statement
		return this.element.querySelector(`input[type="text"]`).value;
	}
	
	/**
	 * Extends {@link HTMLElement.prototype.onclick}
	 * - `.component`: this:{@link ve.ComponentText}
	 *
	 * @typedef ve.ComponentTextOnclickEvent
	 */
	
	/**
	 * Initialises event handlers for the present Component.
	 */
	handleEvents () {
		if (this.options.onclick)
			if (typeof this.options.onclick == "string") {
				this.element.setAttribute("onchange", this.options.onclick);
			} else {
				this.element.onchange = (e) => {
					e.component = this;
					this.options.onclick(e);
				}
			}
	}
	
	/**
	 * Sets the inner HTML of the present text Component.
	 * @param {string} arg0_value
	 */
	setInput (arg0_value) {
		//Convert from parameters
		var value = arg0_value;
		
		//Set value
		this.element.innerHTML = value;
	}
};