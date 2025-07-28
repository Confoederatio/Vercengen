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
		html_string.push(`</ul>`);
		
		//Populate element and initialise handlers
		this.element.innerHTML = html_string.join("");
		
		//Call fill for options.options
		this.handleEvents();
		this.setInput(options.options);
	}
	
	getInput () {
		//Return statement
		return this.element.querySelectorAll(`ul.sortable-list > li > span`);
	}
	
	handleEvents () {
		//Declare local instance variables
		var all_li_els = this.element.querySelectorAll(".sortable-list-item");
		
		//Functional handlers
		Sortable.create(this.element.querySelector(".sortable-list"), {
			animation: 150,
			onEnd: (e) => {
				e.component = this;
				
				if (this.options.onchange)
					this.options.onchange(e);
				if (this.options.onclick)
					this.options.onclick(e);
			},
			multiDrag: true,
			selectedClass: "selected"
		});
		
		this.element.querySelector(`#add-button`).addEventListener("click", (e) => {
			//Declare local instance variables
			var local_delete_button_name = (this.options.delete_button_name) ?
				this.options.delete_button_name : "Delete";
			var local_delete_button_string = (this.options.has_controls != false || this.options.disable_remove == false) ?
				` <button class = "delete-button">${local_delete_button_name}</button>` : "";
			
			//Push option to html_string
			var new_li_el = document.createElement("li");
				new_li_el.classList.add("sortable-list-item");
				new_li_el.innerHTML = `<span>New Item</span>${local_delete_button_string}`;
				new_li_el.setAttribute("data-value", generateRandomID());
				
			this.element.querySelector(".sortable-list").appendChild(new_li_el);
			
			var local_delete_button_el = new_li_el.querySelector(".delete-button");
			if (local_delete_button_el)
				local_delete_button_el.addEventListener("click", (e) => {
					if (this.options.onchange)
						this.options.onchange(this.element);
					if (this.options.onremove)
						this.options.onremove(new_li_el);
					new_li_el.remove();
				});
			
			if (this.options.onadd)
				this.options.onadd(new_li_el);
			if (this.options.onchange)
				this.options.onchange(this.element);
		});
		
		//Iterate over all_li_els; add .delete-button functionality
		var all_li_els = this.element.querySelectorAll(".sortable-list-item");
		
		for (let i = 0; i < all_li_els.length; i++) {
			let local_delete_button_el = all_li_els[i].querySelector(".delete-button");
			
			if (local_delete_button_el)
				local_delete_button_el.addEventListener("click", (e) => {
					e.component = this;
					if (this.element.onchange)
						this.element.onchange(e);
					if (this.element.onremove)
						this.element.onremove(e);
					all_li_els[i].remove();
				});
		}
	}
	
	setInput (arg0_value) {
		//Convert from parameters
		var value = arg0_value;
		
		//Declare local instance variables
		var all_suboptions = Object.keys(value);
		var html_string = [];
		
		for (var i = 0; i < all_suboptions.length; i++) {
			var local_option = value[all_suboptions[i]];
			
			var local_delete_button_name = (this.options.delete_button_name) ?
				this.options.delete_button_name : "Delete";
			var local_delete_button_string = (this.options.has_controls != false || this.options.disable_remove == false) ?
				`<button class = "delete-button">${local_delete_button_name}</button>` : "";
			
			//Push option to html_string
			html_string.push(`<li class = "sortable-list-item" data-value = "${all_suboptions[i]}"><span>${local_option}</span>${local_delete_button_string}</li>`);
		}
		
		//Set value
		this.element.querySelector(`ul[id="${this.options.id}"]`).innerHTML = html_string.join("");
	}
};