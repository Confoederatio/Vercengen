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