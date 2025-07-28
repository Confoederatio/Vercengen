/**
 * <span color = "yellow">{@link Class}</span>: ComponentReset
 *
 * ##### Instance:
 * - `.element`: {@link HTMLElement}
 * - `.options`: {@link Object}
 *   - `.name`: {@link String}
 *
 * @type {ve.ComponentReset}
 */
ve.ComponentReset = class { //[WIP] - Finish Class and refactoring
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
		html_string.push(`<input type = "reset" id = "reset-button" value = "Reset">`);
		
		//Populate element and initialise handlers
		this.element.innerHTML = html_string.join("");
	}
};