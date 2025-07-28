/**
 * <span color = "yellow">{@link Class}</span>
 *
 * ##### Instance:
 * - `.element`: {@link HTMLElement}
 * - `.options`: {@link Object}
 *   - `.attributes`: {@link Object}
 *   - `.disable_add=false`: {@link boolean}
 *   - `.disable_remove=false`: {@link boolean }
 *   - `.has_controls=false`: {@link boolean}
 *   - `.name`: {@link string}
 *   - `.placeholder`: {@link HTMLElement|string}
 *
 * - - `.add_button_name="Add Item"`: {@link string}
 *   - `.delete_button_name="Delete"`: {@link string}
 *   - `.other_header_buttons`: {@link string} - The .innerHTML to append after header controls.
 *
 * - - `.onadd`: function({@link HTMLElement})
 *   - `.onchange`: function({@link ve.ComponentSortableListOnchangeEvent})
 *   - `.onclick`: function({@link ve.ComponentSortableListOnclickEvent})
 *   - `.onremove`: function({@link ve.ComponentSortableListOnremoveEvent})
 *
 * ##### Methods:
 * - <span color=00ffff>{@link ve.ComponentSortableList.getInput|getInput}</span> | {@link string}
 * - <span color=00ffff>{@link ve.ComponentSortableList.handleEvents|handleEvents}</span>
 * - <span color=00ffff>{@link ve.ComponentSortableList.setInput|setInput}</span>(arg0_value: {@link HTMLElement}|{@link string})
 *
 * @type {ve.ComponentSortableList}
 */
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
	
	/**
	 * Returns an array of all elements within the present SortableList Component in order.
	 *
	 * @returns {NodeListOf<Element>}
	 */
	getInput () {
		//Return statement
		return this.element.querySelectorAll(`ul.sortable-list > li > span`);
	}
	
	/**
	 * Extends {@link HTMLElement.prototype.onclick}
	 * - `.component`: this:{@link ve.ComponentSortableList}
	 *
	 * @typedef ve.ComponentSortableListOnchangeEvent
	 */
	/**
	 * Extends {@link HTMLElement.prototype.onclick}
	 * - `.component`: this:{@link ve.ComponentSortableList}
	 *
	 * @typedef ve.ComponentSortableListOnclickEvent
	 */
	/**
	 * Extends {@link HTMLElement.prototype.onclick}
	 * - `.component`: this:{@link ve.ComponentSortableList}
	 *
	 * @typedef ve.ComponentSortableListOnremoveEvent
	 */
	
	/**
	 * Initialises event handlers for the present Component.
	 */
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
			e.component = this;
			
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
					e.component = this;
					
					if (this.options.onchange)
						this.options.onchange(e);
					if (this.options.onremove)
						this.options.onremove(e);
					new_li_el.remove();
				});
			
			if (this.options.onadd)
				this.options.onadd(e);
			if (this.options.onchange)
				this.options.onchange(e);
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
	
	/**
	 * Sets the HTML value as either an HTML string/HTMLElement for the present Component.
	 *
	 * @param {HTMLElement|string} arg0_value
	 */
	setInput (arg0_value) {
		//Convert from parameters
		var value = arg0_value;
		
		//Declare local instance variables
		var all_suboptions = Object.keys(value);
		var html_string = [];
		var list_el = this.element.querySelector(`ul[id="${this.options.id}"]`);
		
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
		list_el.innerHTML = html_string.join("");
	}
};