/**
 * <span color = "yellow">{@link Class}</span>: ComponentBasicFile
 *
 * ##### Instance:
 * - `.element`: {@link HTMLElement}
 * - `.options`: {@link Object}
 *   - `.name`: {@link string}
 *   - `.placeholder`: {@link string}
 *
 * - - `.is_folder`: {@link boolean}
 *   - `.is_multifile`: {@link boolean}
 *   - `.label="Save File"`: {@link string}
 *
 * - - `.onchange`: function({@link ve.ComponentBasicFileOnchangeEvent})
 *   - `.onclick`: function({@link ve.ComponentBasicFileOnclickEvent})
 *
 * ##### Methods:
 * - <span color=00ffff>{@link ve.ComponentBasicFile.getInput|getInput}</span> | {@link FileList}|{@link string}
 * - <span color=00ffff>{@link ve.ComponentBasicFile.handleEvents|handleEvents}</span>
 * - <span color=00ffff>{@link ve.ComponentBasicFile.setInput|setInput}</span>(arg0_value: {@link string})
 *
 * @type {ve.ComponentBasicFile}
 */
ve.ComponentBasicFile = class { //[WIP] - Finish Class and refactoring
	constructor (arg0_options) {
		//Convert from parameters
		this.options = (arg0_options) ? arg0_options : {};
		
		//Declare local instance variables
		this.element = document.createElement("span");
		var html_string = [];
		var options = this.options;
		
		var folder_string = (options.is_folder) ? `webkitdirectory directory ` : "";
		var multifile_string = (options.is_multifile) ? `multiple ` : "";
		
		if (options.name)
			html_string.push(`<span>${options.name}</span> `);
		
		if (!options.is_save) {
			html_string.push(`<input type = "file" ${objectToAttributes(options.attributes)} ${folder_string}${multifile_string}>`);
		} else {
			html_string.push(`<button id = "save-file">${(options.label) ? options.label : "Save File"}</button>`);
		}
		
		//Populate element and initialise handlers
		this.element.innerHTML = html_string.join("");
		this.handleEvents();
	}
	
	/**
	 * Returns a {@link FileList} or {@link string} representing the present Component's filepath.
	 *
	 * @returns {FileList|string}
	 */
	getInput () {
		//Declare local instance variables
		var file_el = this.element.querySelector(`input[type="file"]`);
		
		//Return statement
		if (file_el) return file_el.value;
		return this.element.querySelector(`button[id="save-file"]`).value;
	}
	
	/**
	 * Extends {@link HTMLElement.prototype.onchange}
	 * - `.component`: this:{@link ve.ComponentBasicFile}
	 *
	 * @typedef ve.ComponentBasicFileOnchangeEvent
	 */
	/**
	 * Extends {@link HTMLElement.prototype.onclick}
	 * - `.component`: this:{@link ve.ComponentBasicFile}
	 *
	 * @typedef ve.ComponentBasicFileOnclickEvent
	 */
	
	/**
	 * Initialises event handlers for the present Component.
	 */
	handleEvents () {
		//Declare local instance variables
		var file_input_el = this.element.querySelector(`input[type="file"]`);
		var save_input_el = this.element.querySelector(`button[id="save-file"]`);
		
		if (file_input_el) {
			file_input_el.onchange = (e) => {
				e.component = this;
				
				if (this.options.onchange) this.options.onchange(e);
				if (this.options.onclick) this.options.onclick(e);
			};
		} else {
			save_input_el.onclick = (e) => {
				showSaveFilePicker().then((e) => {
					if (file_input_el.onchange)
						file_input_el.onchange(e);
					if (file_input_el.onclick)
						file_input_el.onclick(e);
				});
			};
		}
	}
	
	/**
	 * Sets the filepath value for the present Component as a relative/absolute string.
	 *
	 * @param {string} arg0_value
	 */
	setInput (arg0_value) {
		//Convert from parameters
		var value = arg0_value;
		if (value == undefined) return;
		
		//Declare local instance variables
		var file_input_el = this.element.querySelector(`input[type="file"]`);
		var save_file_el = this.element.querySelector(`button[id="save-file"]`);
		
		if (file_input_el) {
			file_input_el.setAttribute("value", value);
		} else if (save_file_el) {
			save_file_el.setAttribute("value", value);
		}
	}
};