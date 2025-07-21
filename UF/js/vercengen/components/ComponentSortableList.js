ve.ComponentSortableList = class {
	constructor (arg0_options) {
		//Convert from parameters
		this.options = (arg0_options) ? arg0_options : {};
		
		//Declare local instance variables
		this.element = document.createElement("span");
		var html_string = [];
		var options = this.options;
		
		//Format html_string
		//Requires Sortable.js
		if (options.name)
			html_string.push(`<div class = "header">${options.name}</div>`);
		if (options.has_controls != false || options.disable_add == false)
			html_string.push(`<button id = "add-button">${(options.add_button_name) ? options.add_button_name : "Add Item"}</button>`);
		if (options.has_controls != false)
			if (options.other_header_buttons)
				html_string.push(`${options.other_header_buttons}`);
		
		html_string.push(`<ul class = "sortable-list" id = "${options.id}" ${objectToAttributes(options.attributes)}>`);
		
		//Iterate over all options.options
		if (options.options) {
			var all_suboptions = Object.keys(options.options);
			
			for (var i = 0; i < all_suboptions.length; i++) {
				var local_option = options.options[all_suboptions[i]];
				
				var local_delete_button_name = (options.delete_button_name) ? options.delete_button_name : "Delete";
				var local_delete_button_string = (options.has_controls != false || options.disable_remove == false) ?
					` <button class = "delete-button">${local_delete_button_name}</button>` : "";
				
				//Push option to html_string
				html_string.push(`<li class = "sortable-list-item" data-value = "${all_suboptions[i]}"><span>${local_option}</span>${local_delete_button_string}</li>`);
			}
		}
		
		html_string.push(`</ul>`);
		
		//Populate element and initialise handlers
		this.element.innerHTML = html_string.join("");
	}
};