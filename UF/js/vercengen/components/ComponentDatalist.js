/**
 * <span color = "yellow">{@link Class}</span>: ComponentDatalist
 *
 * ##### Instance:
 * - `.element`: {@link HTMLElement}
 * - `.options`: {@link Object}
 *   - `.attributes`: {@link Object}
 *   - `.name`: {@link string}
 *   - `.placeholder`: {@link string} - The <option> ID that should be selected by default.
 *
 * - - `.options`: {@link Object} - The options in the datalist.
 *     - `<option_key>`: {@link string}
 *
 * ##### Methods:
 * - <span color=00ffff>{@link ve.ComponentDatalist.getInput|getInput}</span>
 * - <span color=00ffff>{@link ve.ComponentDatalist.setInput|setInput}</span>(arg0_value: {@link string})
 *
 * @type {ve.ComponentDatalist}
 */
ve.ComponentDatalist = class { //[WIP] - Missing handleEvents()
	constructor (arg0_options) {
		//Convert from parameters
		this.options = (arg0_options) ? arg0_options : {};
		
		//Declare local instance variables
		this.element = document.createElement("span");
		var html_string = [];
		var options = this.options;
		
		//Format html_string
		delete options.options.VALUE;
		
		if (options.name)
			html_string.push(`<div class = "header">${options.name}</div>`);
		html_string.push(`<input list = "${options.id}-datalist" value = "${(options.placeholder) ? options.placeholder : ""}">`)
		html_string.push(`<datalist id = "${options.id}-datalist" class = "datalist">`);
			//Add .options to datalist
			var all_options = Object.keys(options.options);

			//Iterate over all_options
			for (var i = 0; i < all_options.length; i++) {
				var local_value = options.options[all_options[i]];

				//Push option to html_string
				html_string.push(`<option id = "${all_options[i]}" value = "${local_value}"></option>`);
			}
		html_string.push(`</datalist>`);
		
		//Populate element and initialise handlers
		this.element.innerHTML = html_string.join("");
	}
	
	/**
	 * Returns the chosen <option> value for the present Component.
	 *
	 * @returns {string}
	 */
	getInput () {
		//Return statement
		return this.element.querySelector(`input[list]`).value;
	}
	
	/**
	 * Sets the <option> value for the present Component.
	 *
	 * @param {string} arg0_value
	 */
	setInput (arg0_value) {
		//Convert from parameters
		var value = arg0_value;
			if (value == undefined) return;
		
		//Declare local instance variables
		this.element.querySelector(`input[list*="datalist"]`).value = value;
	}
};