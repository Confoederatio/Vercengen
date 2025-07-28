/**
 * <span color = "yellow">{@link Class}</span>: ComponentSearchSelect
 *
 * ##### Instance:
 * - `.element`: {@link HTMLElement}
 * - `.options`: {@link Object}
 *   - `.attributes`: {@link Object}
 *   - `.name`: {@link string}
 *
 * - - `.options`: {@link Object}
 *     - `<option_key>`: {@link string}
 *
 * - - `.onchange`: function({@link ve.ComponentSearchSelectOnchangeEvent})
 *   - `.onclick`: function({@link ve.ComponentSearchSelectOnclickEvent}
 *
 * ##### Methods:
 * - <span color=00ffff>{@link ve.ComponentSearchSelect.getInput|getInput}</span> | {@link string}
 * - <span color=00ffff>{@link ve.ComponentSearchSelect.handleEvents|handleEvents}</span>
 * - <span color=00ffff>{@link ve.ComponentSearchSelect.setInput|setInput}</span>(arg0_value: {@link string})
 *
 * ##### Methods (Helper):
 * - <span color=00ffff>{@link ve.ComponentSearchSelect.handleSearchSelect|handleSearchSelect}</span>
 *
 * @type {ve.ComponentSearchSelect}
 */
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
			html_string.push(`<input type = "text" id = "search" placeholder = "${(options.name) ? options.name : "Search..."}">`);

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
		this.handleEvents();
	}
	
	/**
	 * Returns the `data-selected` attribute of the present Component's selected option.
	 *
	 * @returns {string}
	 */
	getInput () {
		//Return statement
		return this.element.getAttribute(`data-selected`);
	}
	
	/**
	 * Extends {@link HTMLElement.prototype.oninput}
	 *
	 * @typedef ve.ComponentSearchSelectOnchangeEvent
	 */
	/**
	 * Extends {@link HTMLElement.prototype.onclick}
	 *
	 * @typedef ve.ComponentSearchSelectOnclickEvent
	 */
	
	/**
	 * Initialises event handlers for the present Component.
	 */
	handleEvents () {
		//Declare local instance variables
		var all_a_els = this.element.querySelectorAll("a");
		
		//Functional handlers
		this.element.addEventListener("keyup", (e) => {
			this.handleSearchSelect();
		});
		this.element.querySelector(`#search`).addEventListener("click", (e) => {
			this.element.classList.toggle("shown");
		});
		
		//Iterate over all_a_els
		for (let i = 0; i < all_a_els.length; i++)
			all_a_els[i].addEventListener("click", (e) => {
				e.component = this;
				
				all_a_els[i].classList.toggle("selected");
				all_a_els[i].setAttribute("data-selected", all_a_els[i].getAttribute("data-value"));
				
				if (this.element.onchange)
					this.element.onchange(e);
				if (this.element.onclick)
					this.element.onclick(e);
			});
	}
	
	/**
	 * Handles keypress events for the present search_select Component.
	 */
	handleSearchSelect () {
		//Declare local instance variables
		var all_a_els = this.element.querySelectorAll(`a`);
		var input_el = this.element.querySelector(`#search`);
		
		var filter = input_el.value.toLowerCase();
		
		//Iterate over all_a_els
		for (var i = 0; i < all_a_els.length; i++) {
			var text_value = all_a_els[i].textContent || all_a_els[i].innerText;
			
			if (text_value.toLowerCase().indexOf(filter) > -1) {
				all_a_els[i].style.display = "";
			} else {
				all_a_els[i].style.display = "none";
			}
		}
	}
	
	/**
	 * Sets the value for the given input as a `.id` string by modifying the `data-selected` attribute.
	 *
	 * @param {string} arg0_value
	 */
	setInput (arg0_value) {
		//Convert from parameters
		var value = arg0_value;
		
		//Set value
		this.element.setAttribute("data-selected", value);
		this.element.querySelector(`[data-value="${value}"]`).classList.add("selected");
	}
};