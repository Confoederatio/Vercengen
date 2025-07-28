/**
 * <span color = "yellow">{@link Class}</span>: ComponentBIUF
 *
 * ##### Instance:
 * - `.element`: {@link HTMLElement}
 * - `.options`: {@link Object}
 *   - `.name`: {@link string}
 *   - `.placeholder`: {@link string}
 *
 * - - `.onchange`: function({@link ve.ComponentBIUFOnchangeEvent})
 *   - `.onclick`: function({@link ve.ComponentBIUFOnclickEvent})
 *
 * ##### Methods:
 * - <span color=00ffff>{@link ve.ComponentBIUF.getInput|getInput}</span> | {@link string}
 * - <span color=00ffff>{@link ve.ComponentBIUF.handleEvents|handleEvents}</span>
 * - <span color=00ffff>{@link ve.ComponentBIUF.setInput|setInput}</span>(arg0_value: {@link string})
 *
 *
 * ##### Methods (Helper):
 * - <span color=00ffff>{@link ve.ComponentBIUF.initBIUFToolbar|initBIUFToolbar}</span>
 *
 * @type {ve.ComponentBIUF}
 */
ve.ComponentBIUF = class {
	constructor (arg0_options) { //From BrowserUI createInput()
		//Convert from parameters
		this.options = (arg0_options) ? arg0_options : {};

		//Declare local instance variables
		this.element = document.createElement("span");
		var html_string = [];
		var options = this.options;

		if (options.name)
			html_string.push(`<div class = "header">${options.name}</div>`);

		//Create a contenteditable div with onchange handlers to strip formatting
		html_string.push(`<div id = "biuf-toolbar" class = "biuf-toolbar">`);
			html_string.push(`<button id = "bold-button" class = "bold-icon">B</button>`);
			html_string.push(`<button id = "italic-button" class = "italic-icon">I</button>`);
			html_string.push(`<button id = "underline-button" class = "underline-icon">U</button>`);
			html_string.push(`<button id = "clear-button" class = "clear-icon">T</button>`);
		html_string.push(`</div>`);

		html_string.push(`<div id = "biuf-input" class = "biuf-input" contenteditable = "true" ${objectToAttributes(options.options)}>`);
			html_string.push((options.placeholder) ? options.placeholder : "Name");
		html_string.push(`</div>`);

		//Populate element and initialise handlers
		this.element.innerHTML = html_string.join("");
		this.element.querySelector(`#biuf-input`).addEventListener("input", (e) => {
			e.component = this;
			
			if (options.onchange)
				options.onchange(e);
			this.handleEvents();
		});
		this.element.querySelector(`#biuf-input`).addEventListener("onclick", (e) => {
			e.component = this;
			if (options.onclick)
				options.onclick(e);
		});
		this.initBIUFToolbar();
	}
	
	/**
	 * Returns the innerHTML of the present Component's inputted value.
	 *
	 * @returns {string}
	 */
	getInput () {
		//Return statement
		return this.element.querySelector(`#biuf-input`).innerHTML;
	}
	
	/**
	 * Extends {@link HTMLElement.prototype.oninput}
	 * - `.component`: this:{@link ve.ComponentBIUF}
	 *
	 * @typedef ve.ComponentBIUFOnchangeEvent
	 */
	/**
	 * Extends {@link HTMLElement.prototype.onclick}
	 * - `.component`: this:{@link ve.ComponentBIUF}
	 *
	 * @typedef ve.ComponentBIUFOnclickEvent
	 */
	
	/**
	 * Initialises event handlers for the present Component.
	 */
	handleEvents () {
		//Declare local instance variables
		var biuf_el = this.element.querySelector(`#biuf-input`);
		var child = biuf_el.firstChild;

		//Declare while loop, break when next sibling element can no longer be found.
		while (child) {
			var remove_node = null;

			//Check if child is not of <b><i><u> tags.
			if (child.tagName && (!["b", "i", "u"].includes(child.tagName.toLowerCase())))
				remove_node = child;
			child = child.nextSibling;

			//Remove node if flag is true
			if (remove_node)
				remove_node.parentNode.removeChild(remove_node);
		}
	}
	
	/**
	 * Initialises the BIUF toolbar for formatting options that shows when text is selected.
	 */
	initBIUFToolbar () {
		//Declare local instance variables
		var toolbar_el = this.element.querySelector(`#biuf-toolbar`);

		//Declare element references
		var bold_button = toolbar_el.querySelector("#bold-button");
		var clear_button = toolbar_el.querySelector("#clear-button");
		var italic_button = toolbar_el.querySelector("#italic-button");
		var underline_button = toolbar_el.querySelector("#underline-button");

		//Show toolbar when text is selected
		toolbar_el.style.display = "none";
		
		document.addEventListener("mouseup", (e) => {
			var selection = window.getSelection();

			if (selection.toString() != "" && this.element.querySelector(`#biuf-input:focus`)) {
				var range = selection.getRangeAt(0);
				var rect = range.getBoundingClientRect();

				toolbar_el.style.display = "block";
				toolbar_el.style.top = rect.top - toolbar_el.offsetHeight + "px";
				toolbar_el.style.left = `${rect.left - toolbar_el.offsetWidth/2}px`;
			} else {
				toolbar_el.style.display = "none";
			}
		});

		//Apply formatting when various toolbar buttons are clicked
		bold_button.addEventListener("click", function () {
			document.execCommand("bold");
		});
		clear_button.addEventListener("click", function () {
			document.execCommand("removeFormat");
		});
		italic_button.addEventListener("click", function () {
			document.execCommand("italic");
		});
		underline_button.addEventListener("click", function () {
			document.execCommand("underline");
		});
	}
	
	/**
	 * Sets the HTML value for the present Component as a string.
	 *
	 * @param {string} arg0_value
	 */
	setInput (arg0_value) {
		//Convert from parameters
		var value = (arg0_value) ? arg0_value : "";
		if (value == undefined) return;
		
		//Set #biuf-input value
		this.element.querySelector(`#biuf-input`).innerHTML = value;
	}
};