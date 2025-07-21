ve.ComponentSearchSelect = class { //[WIP] - Finish Class and refactoring
	constructor (arg0_options) {
		//Convert from parameters
		this.options = (arg0_options) ? arg0_options : {};
		
		//Declare local instance variables
		this.element = document.createElement("span");
		var html_string = [];
		var options = this.options;
		
		//Format html_string
		html_string.push(`<div class = "search-select-container" ${objectToAttributes(options.attributes)}>`);
			html_string.push(`<input type = "text" id = "search" placeholder = "${(options.name) ? options.name : "Search..."}" onkeyup = "handleSearchSelect(this.parentElement);">`);

			//Iterate over all options.options
			if (options.options) {
				var all_suboptions = Object.keys(options.options);

				for (var i = 0; i < all_suboptions.length; i++) {
					var local_option = options.options[all_suboptions[i]];

					html_string.push(`<a class = "search-select-item" data-value = "${all_suboptions[i]}">${local_option}</a>`);
				}
			}
		html_string.push(`</div>`);
		
		//Populate element and initialise handlers
		this.element.innerHTML = html_string.join("");
	}
};