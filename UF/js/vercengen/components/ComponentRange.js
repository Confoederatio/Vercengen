/**
 * <span color = "yellow">{@link Class}</span>: ComponentRange
 *
 * ##### Instance:
 * - `.element`: {@link HTMLElement}
 * - `.options`: {@link Object}
 *   - `.attributes`: {@link Object}
 *   - `.placeholder`: {@link number} - The number to filter through `this.options.value.value_equation`. A 1:1 ratio by default.
 * - - `.value`: {@link Object}
 *     - `.attributes`: {@link Object}
 *       - `.max=100`: {@link number}
 *       - `.min=0`: {@link number}
 *     - `.value_equation`: {@link string} - A string representing the actual value equation, where `VALUE` represents the given value.
 *
 * - - `.onclick`: function({@link ve.ComponentRangeOnclickEvent})
 *
 * ##### Methods:
 * - <span color=00ffff>{@link ve.ComponentRange.getInput|getInput}</span> | {@link number}
 * - <span color=00ffff>{@link ve.ComponentRange.handleEvents|handleEvents}</span>
 * - <span color=00ffff>{@link ve.ComponentRange.setInput|setInput}</span>(arg0_value: {@link number})
 *
 * @type {ve.ComponentRange}
 */
ve.ComponentRange = class { //[WIP] - Finish Class and refactoring
	constructor (arg0_options) {
		//Convert from parameters
		this.options = (arg0_options) ? arg0_options : {};
		
		//Declare local instance variables
		this.element = document.createElement("span");
		var html_string = [];
		var options = this.options;
		
		//Format html_string
		var name_string = (options.name) ? `${options.name} ` : "";
		
		html_string.push(`${name_string}<input type = "range" id = "range-input"${objectToAttributes(options.attributes)} value = "${returnSafeNumber(options.placeholder)}">`);
		
		//Populate element and initialise handlers
		this.element.innerHTML = html_string.join("");
		this.handleEvents();
	}
	
	/**
	 * Returns the processed value of the present Component.
	 *
	 * @returns {number}
	 */
	getInput () {
		//Return statement
		return this.element.querySelector(`input[type="range"]`).value;
	}
	
	/**
	 * Extends {@link HTMLElement.prototype.onchange}
	 *
	 * @typedef ve.ComponentRangeOnclickEvent
	 */
	
	/**
	 * Initialises event handlers for the present Component.
	 */
	handleEvents () {
		if (this.options.onclick)
			this.element.onchange = this.options.onclick;
	}
	
	/**
	 * Sets the value for the present Component as a number, processed via this.options.value.value_equation.
	 *
	 * @param {number} arg0_value
	 */
	setInput (arg0_value) {
		//Convert from parameters
		var value = arg0_value;
		
		//Declare local instance variables
		var actual_number_in_range = calculateNumberInRange(
			[
				returnSafeNumber(this.options.value.attributes.min, 0),
				returnSafeNumber(this.options.value.attributes.max, 100)
			], value, this.options.value.value_equation
		);
		var range_el = this.element.querySelector(`input[type="range"]`);
		
		//Set value
		range_el.value = actual_number_in_range;
	}
};