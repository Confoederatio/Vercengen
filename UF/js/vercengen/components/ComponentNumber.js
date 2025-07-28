/**
 * <span color = "yellow">{@link Class}</span>: ComponentNumber
 *
 * ##### Instance:
 * - `.element`: {@link HTMLElement}
 * - `.options`: {@link Object}
 *   - `.name`: {@link string}
 *
 * - - `.onchange`: function({@link ve.ComponentNumberOnchangeEvent})
 *   - `.onclick`: function({@link ve.ComponentNumberOnclickEvent})
 *
 * ##### Methods:
 * - <span color=00ffff>{@link ve.ComponentNumber.getInput|getInput}</span> | {@link number}
 * - <span color=00ffff>{@link ve.ComponentNumber.handleEvents|handleEvents}</span>
 * - <span color=00ffff>{@link ve.ComponentNumber.setInput|setInput}</span>(arg0_value: {@link number})
 *
 * @type {ve.ComponentNumber}
 */
ve.ComponentNumber = class { //[WIP] - Finish Class and refactoring
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
		html_string.push(`<input type = "number" id = "number-input" ${objectToAttributes(options.attributes)}>`);
		
		//Populate element and initialise handlers
		this.element.innerHTML = html_string.join("");
		this.handleEvents();
	}
	
	/**
	 * Returns a number from the present Component.
	 *
	 * @returns {number}
	 */
	getInput () {
		//Return statement
		return parseFloat(this.element.querySelector(`input[type="number"]`).value);
	}
	
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
					
					if (this.options.onclick)
						this.options.onclick(e);
					if (this.options.onchange)
						this.options.onchange(e);
				};
			}
	}
	
	/**
	 * Sets the number value for the present Component.
	 *
	 * @param {number} arg0_value
	 */
	setInput (arg0_value) {
		//Convert from parameters
		var value = arg0_value;
		
		//Set value
		this.element.querySelector(`input[type="number"]`).value = value;
	}
};