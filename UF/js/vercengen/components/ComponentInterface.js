/**
 * <span color = "yellow">{@link Class}</span>: ComponentInterface
 *
 * ##### Instance:
 * - `.element`: {@link HTMLElement}
 * - `.options`: <span color = "lime">{@link ve.Interface.options}</span>
 *
 * ##### Methods:
 * - <span color=#00ffff>{@link ve.ComponentInterface.getInput|getInput}</span> | {@link Object}
 * - <span color=#00ffff>{@link ve.ComponentInterface.setInput|setInput}</span>(arg0_value: {@link Object})
 *
 * @type {ve.ComponentInterface}
 */
ve.ComponentInterface = class { //[WIP] - Finish Class and refactoring; missing handleEvents()
	constructor (arg0_options) {
		//Convert from parameters
		this.options = (arg0_options) ? arg0_options : {};
		
		//Declare local instance variables
		this.element = document.createElement("span");
		var html_string = [];
		var options = this.options;
		
		//Format html_string
		html_string.push(`<details id = "interface-folder-${options.id}">`);
			html_string.push(`<summary>${(options.name) ? options.name : options.id}</summary>`);
			html_string.push(`<div id = "interface-body"></div>`);
		html_string.push(`</details>`);
		
		//Populate element and initialise handlers
		this.element.innerHTML = html_string.join("");
		
		//Populate interface
		var interface_body_selector = `[id="interface-folder-${this.options.id}"] #interface-body`;
			this.options.anchor = this.element.querySelector(interface_body_selector);
			this.options.can_close = true;
		this.interface = new ve.Interface(this.options);
		
		if (this.options.parent)
			this.options.parent.components[this.element.id] = this.interface;
		
		//Options parsing
		if (this.options.is_open)
			this.element.querySelector(`details[id="interface-folder-${this.options.id}"]`).open = true;
	}
	
	/**
	 * Returns all values present in the given interface; the sub-interface's state.
	 *
	 * @returns {Object}
	 */
	getInput () {
		//Return statement
		return this.interface.getState();
	}
	
	/**
	 * Sets sub .placeholder values for the nested interface within the present Component.
	 * @param {Object} arg0_value
	 */
	setInput (arg0_value) {
		//Convert from parameters
		var value = arg0_value;
		
		//Declare local instance variables
		if (this.options.parent)
			this.options.parent.components[this.element.id] = value;
	}
};