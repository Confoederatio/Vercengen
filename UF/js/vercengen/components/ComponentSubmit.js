/**
 * <span color = "yellow">{@link Class}</span>: ComponentSubmit
 *
 * ##### Instance:
 * - `.element`: {@link HTMLElement}
 * - `.options`: {@link Object}
 *   - `.attributes`: {@link Object}
 *   - `.name`: {@link string}
 *
 * @type {ve.ComponentSubmit}
 */
ve.ComponentSubmit = class {
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
		html_string.push(`<input type = "submit" value = "${(options.name) ? options.name : "Submit"}" ${objectToAttributes(options.attributes)}>`);
		
		//Populate element and initialise handlers
		this.element.innerHTML = html_string.join("");
	}
};