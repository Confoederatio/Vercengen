if (!global.ve) global.ve = {};

/**
 * Represents a Vercengen PageMenu. Can be bound to any element of choice.
 *
 * PageMenus represent a paginated Interface with multiple tabs. These are not typically numerically ordered for consistent UI/UX design.
 *
 * ##### DOM:
 * - `.instance`: this:{@link ve.PageMenu}
 *
 * ##### Instance:
 * - `.options`: <span color = "lime">{@link ve.PageMenu.options}</span>
 * <br>
 * - `.element`: {@link HTMLElement} - The main content element. Also accessible via `.content_el`.
 * - `.tabs_el`: {@link HTMLElement} - The HTMLElement containing the tabs up top.
 * <br>
 * - `.current_page`: {@link string}
 * - `.interfaces`: {@link Object}<{@link ve.Interface}> - All .interfaces represented by the present PageMenu.
 * - `.page_states`: {@link Object} - Internal cache for page states to restore them upon switching tabs.
 *
 * @type {ve.PageMenu}
 */
ve.PageMenu = class {
	/**
	 * - `.default=all_pages[0]`: {@link string} - First page by default.
	 * <br>
	 * - `.left_offset=0.125`: {@link number} - Left offset in rem
	 * - `.pages`: {@link Object}<<span color = "yellow">{@link ve.PageMenu.Page}</span>> - Object dictionary map to individual page options; sub-options type.
	 *
	 * @typedef {Object} ve.PageMenu.options
	 *
	 * @property {function(ve.PageMenu)} [special_function] - The function to execute upon clicking <i>any</i> tab.
	 */
		/**
		 * Represents a Page within a PageMenu.
		 *
		 * - `.name`: {@link string}
		 * <br>
		 * - `.html`: {@link string}
		 * - `<component_key>`: <span color = "lime">{@link ve.Component.options}</span>
		 *
		 * @typedef {Object} ve.PageMenu.Page
		 *
		 * @property {function(ve.PageMenu)} [special_function] - The function to execute upon clicking this tab.
		 */
	
	constructor (arg0_options) {
		//Convert from parameters
		var options = (arg0_options) ? arg0_options : {};
		
		//Initialise options
		if (!options.pages) options.pages = {};
		this.interfaces = {};
		this.options = options;
		this.page_states = {};
		
		//Declare local instance variables
		var all_pages = Object.keys(options.pages);
		this.element = undefined;
		this.tabs_el = undefined;
		
		//Define this.element; tabs_el
		if (options.anchor && options.tab_anchor) {
			try {
				this.element = document.querySelector(options.anchor);
				this.tabs_el = document.querySelector(options.tab_anchor);
			} catch {
				this.element = options.anchor;
				this.tabs_el = options.tab_anchor;
			}
		} else {
			this.element = document.createElement("div");
			this.tabs_el = document.createElement("div");
		}
		
		//Set alias
		this.content_el = this.element;
		
		//Set this.tabs_el.innerHTML according to page_key
		var tabs_html = [];
		
		//Set tabs_html to tabs_el.innerHTML
		tabs_html.push(`<div class = "tabs-container">`);
		for (var i = 0; i < all_pages.length; i++) {
			var local_value = options.pages[all_pages[i]];
			
			var local_page_name = (local_value.name) ? local_value.name : all_pages[i];
			tabs_html.push(`<span id = "${all_pages[i]}">${local_page_name}</span>`);
		}
		tabs_html.push(`<hr>`);
		tabs_html.push(`</div>`);
		this.tabs_el.innerHTML = tabs_html.join("");
		
		//Add .onclick events for all_pages
		for (let i = 0; i < all_pages.length; i++) {
			let local_tab_button_el = this.tabs_el.querySelector(`span[id="${all_pages[i]}"]`);
			
			local_tab_button_el.onclick = (e) => {
				this.setPage(all_pages[i], e);
			};
		}
		
		//Parse options.default
		(options.default) ?
			this.setPage(options.default) : this.setPage(all_pages[0]);
		
		//Return statement
		return [this.tabs_el, this.element];
	}
	
	/**
	 * Returns the current PageMenu state according to inputs. State functions returns merged flattened-nested object.
	 *
	 * @returns {{"<flattened.key>": *, "<key>": *}}
	 */
	getState () {
		//Return statement
		return ve.getElementState(this.element);
	}
	
	/**
	 * Loads a PageMenu state, filling in all available inputs across all Interfaces associated with the PageMenu.
	 *
	 * @param {Object} [arg0_options]
	 *  @param {*} [arg0_options.'component_key'] - Maps values to inputs.
	 */
	loadState (arg0_options) {
		//Convert from parameters
		var options = (arg0_options) ? arg0_options : {};
		
		//Iterate over all_options and call ve.Component.setInput()
		var all_options = Object.keys(options);
		
		for (var i = 0; i < all_options.length; i++) {
			var local_option_el = this.element.querySelector(`[id="${all_options[i]}"]`);
			var local_value = options[all_options[i]];
			
			if (local_option_el)
				ve.Component.setInput({
					element: local_option_el,
					placeholder: local_value,
					type: local_option_el.getAttribute("type"),
					value: local_value
				});
		}
	}
	
	/**
	 * Sets the current page for the present PageMenu.
	 * @param {string} arg0_page
	 */
	setPage (arg0_page) {
		//Convert from parameters
		var page = arg0_page;
		
		//Declare local instance variables
		var all_pages = Object.keys(this.options.pages);
		var hr_el = this.tabs_el.querySelector("hr");
		var left_offset = returnSafeNumber(this.options.left_offset, 0.125); //In rem
		var local_tab_button_el = this.tabs_el.querySelector(`span[id="${page}"]`);
		var local_value = this.options.pages[page];
		
		//Initialise local_value options
		if (!local_value.anchor) local_value.anchor = this.element;
		
		//Parse .onclick handler
		if (this.options.special_function) this.options.special_function(this);
		if (local_value.special_function) local_value.special_function(this);
		
		//Save state before resetting it
		try {
			if (!this.current_page) this.current_page = page;
			this.page_states[this.current_page] = this.getState();
		} catch (e) {
			console.error(e);
		}
		this.element.innerHTML = "";
		
		//Remove 'active' class from all pages; and set the current tab to active in terms of highlighting
		for (var x = 0; x < all_pages.length; x++)
			removeClass(this.tabs_el.querySelector(`span[id="${all_pages[x]}"]`), "active");
		addClass(local_tab_button_el, "active");
		hr_el.style.left = `calc(${local_tab_button_el.offsetLeft - local_tab_button_el.parentElement.offsetLeft}px + ${left_offset}rem)`;
		
		//Set "page" attribute for this.element; replace content
		this.element.setAttribute("page", page);
		
		if (local_value.can_close == undefined)
			local_value.can_close = true;
		if (!local_value.html) {
			if (!local_value.class) local_value.class = "ve-transparent";
			this.element.innerHTML = "";
			this.interfaces[(local_value.id) ? local_value.id : generateRandomID(this.interfaces)] = new ve.Interface(local_value);
		} else {
			this.element.innerHTML = (Array.isArray(local_value.html)) ?
				local_value.html.join("") : local_value.html;
		}
		
		//Load any previous state
		if (this.page_states[page])
			this.loadState(this.page_states[page]);
		
		//Set this.current_page
		this.current_page = page;
	}
};