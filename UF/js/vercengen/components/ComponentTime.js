/**
 * <span color = "yellow">{@link Class}</span>: ComponentTime
 *
 * ##### Instance:
 * - `.element`: {@link HTMLElement}
 * - `.options`: {@link Object}
 *   - `.attributes`: {@link Object}
 *   - `.name`: {@link string}
 *   - `.placeholder`: {hour: {@link number}, minute: {@link number}}
 *
 * ##### Methods:
 * - <span color=00ffff>{@link ve.ComponentTime.getInput|getInput}</span> | {@link string}
 * - <span color=00ffff>{@link ve.ComponentTime.setInput|setInput}</span>(arg0_value: {hour: {@link number}, minute: {@link number}})
 *
 * @type {ve.ComponentTime}
 */
ve.ComponentTime = class { //[WIP] - Missing handleEvents()
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
		html_string.push(`<input type = "time" id = "time-input" ${objectToAttributes(options.attributes)}>`);
		
		//Populate element and initialise handlers
		this.element.innerHTML = html_string.join("");
	}
	
	/**
	 * Returns the input date as a {@link ve.Time} object from the present Component.
	 *
	 * @returns {{hour: number, minute: number}}
	 */
	getInput () {
		//Declare local instance variables
		var output = this.element.querySelector(`input[type="time"]`).value;
		
		//Parse time
		if (output && output != "n/a") {
			output = output.split(":");
			output = {
				hour: parseInt(output[0]),
				minute: parseInt(output[1])
			};
		}
		
		//Return statement
		return output;
	}
	
	/**
	 * Sets the time value for the present Component as a {@link ve.Time} object.
	 * @param arg0_value
	 */
	setInput (arg0_value) {
		//Convert from parameters
		var value = arg0_value;
		
		//Declare local instance variables
		var time_el = this.element.querySelector(`input[type="time"]`);
		
		if (!Array.isArray(value) && typeof value == "object") {
			time_el.value = `${(value.hour < 10) ? `0` : ""}${value.hour}:${(value.minute < 10) ? `0` : ""}${value.minute}`;
		} else if (Array.isArray(value)) {
			time_el.value = `${(value[0] < 10) ? `0` : ""}${value[0]}:${(value[1] < 10) ? `0` : ""}${value[1]}`;
		} else {
			time_el.value = value;
		}
	}
};