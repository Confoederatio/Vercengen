if (!global.ve) global.ve = {};

/**
 * Represents a Vercengen Window. Global-level windows are stored in `ve.windows`.
 *
 * Windows are a type of draggable/resizeable Interface that is overlaid on top of the main app scene. They typically come with a header for minimisation/closing.
 *
 * DOM:
 * - `.instance`: (this)
 *
 * Instance:
 * @property {HTMLElement} element
 * @property {String} name
 * @property {String} window_id
 * @property {number} x
 * @property {number} y
 *
 * @property {{
 *   can_close: boolean,
 *   can_rename: boolean,
 *   draggable: boolean,
 *   headless: boolean,
 *   resizeable: boolean
 * }} [options]
 *
 * @type ve.Window
 */
ve.Window = class {
	constructor (arg0_options) {
		//Convert from parameters
		var options = (arg0_options) ? arg0_options : {};
		
		//Initialise options
		if (options.can_close != false) options.can_close = true;
		if (options.can_rename != false) options.can_rename = true;
		if (options.draggable != false) options.draggable = true;
		if (options.resizeable != false) options.resizeable = true;
		
		//Declare local instance variables
		this.element = document.createElement("div");
		this.name = (options.name) ? options.name : "New Window";
		this.window_id = (options.id) ? options.id : generateRandomID(ve.windows);
		this.x = returnSafeNumber(options.x);
		this.y = returnSafeNumber(options.y);
		
		if (this.x != 0 || this.y != 0) setTimeout((e) => {
			this.element.style.left = `${this.x}px`;
			this.element.style.top = `${this.y}px`;
		}, 0);
		
		//Instantiate window element in ve.window_overlay_el
		this.element.setAttribute("class", "ve-window ve-dark");
		this.element.setAttribute("data-window-id", this.window_id);
		this.element.id = this.window_id;
		this.element.innerHTML = `
				<div class = "window-header header${(options.headless) ? " display-none" : ""}" id = "window-header">
					<span id = "window-name"${(options.can_rename) ? ` contenteditable = "plaintext-only"` : ""}>${this.name}</span>
				</div>
				<div id = "window-body"></div>
			`;
		this.element.instance = this;
		
		//Initialise style
		/*setTimeout(() => {
			this.element.style.width = `${this.element.offsetWidth}px`;
		}, 1);*/
		this.element.style.zIndex = Object.keys(ve.windows).length.toString();
		
		//Set Instance to sync with global.ve.windows
		ve.windows[this.window_id] = this;
		ve.window_overlay_el.appendChild(this.element);
		
		//Instantiate element handlers
		if (options.draggable)
			elementDragHandler(this.element, {
				is_resizable: (options.resizeable)
			});
		if (options.can_close) {
			var close_button = document.createElement("img");
			close_button.id = "close-button";
			close_button.src = `./UF/gfx/close_icon_dark.png`;
			
			this.element.querySelector(`#window-header`).appendChild(close_button);
			close_button.onclick = (e) => {
				this.close();
			};
		}
		createSection({
			selector: `[data-window-id="${this.window_id}"] #window-header, [data-window-id="${this.window_id}"] #window-body`
		});
		//Z-index handler
		this.element.onmousedown = (e) => {
			this.select();
		};
		
		//Append interface if possible
		if (options.interface)
			this.setInterface(options.interface);
		if (options.page_menu)
			this.setPageMenu(options.page_menu);
	}
	
	//1. State functions
	/**
	 * Returns the current Window state according to inputs. State functions return a merged flattened-nested object.
	 *
	 * @returns {{"<flattened.key>": *, "<key>": *}}
	 */
	getState () {
		//Return statement
		return ve.getInputsAsObject(this.element);
	}
	
	//2. UI functions (Header)
	/** Closes the present Window. **/
	close () {
		//Delete ve.windows[this.window_id], then remove element
		delete ve.windows[this.window_id];
		this.element.remove();
	}
	
	/**
	 * Returns the name of the present Window.
	 *
	 * @returns {String}
	 */
	getName () {
		//Declare local instance variables
		var name_el = this.element.querySelector(`#window-name`);
		
		//Update instance state
		this.name = name_el.innerHTML;
		
		//Return statement
		return this.name;
	}
	
	/** Selects the present Window, raising its z-index above all other Windows. **/
	select () {
		//Declare local instance variables
		var current_highest_z_index = JSON.parse(JSON.stringify(ve.Window.getHighestZIndex())) + 1;
		
		//Swap z-indices
		this.element.style.zIndex = current_highest_z_index.toString();
		ve.Window.normaliseZIndexes();
	}
	
	/**
	 * Sets the name of the present Window.
	 * @param {String} arg0_name
	 */
	setName (arg0_name) {
		//Convert from parameters
		var name = (arg0_name) ? arg0_name : "";
		
		//Set this.name; update DOM
		this.name = name;
		this.element.querySelector(`#window-name`).innerHTML = name;
	}
	
	//3. UI functions (Body)
	/**
	 * Sets a single-page interface for the present Window.
	 * @param {Object<ve.Interface.options>} arg0_options
	 */
	setInterface (arg0_options) {
		//Convert from parameters
		var options = (arg0_options) ? arg0_options : {};
		
		//Declare local instance variables
		options.anchor = this.element.querySelector(`#window-body`);
		options.can_close = true;
		
		try {
			this.interface = new ve.Interface(options);
		} catch (e) {
			console.error(e);
		}
	}
	
	/**
	 * Sets the current page ID to be displayed in the Window. Top-level interface function.
	 * @param {String} arg0_page
	 */
	setPage (arg0_page) {
		//Convert from parameters
		var page = arg0_page;
		
		this.interface.setPage(page);
	}
	
	/**
	 * Sets the PageMenu interface for the present Window.
	 * @param {Object<ve.PageMenu.options>} arg0_options
	 */
	setPageMenu (arg0_options) {
		//Convert from parameters
		var options = (arg0_options) ? arg0_options : {};
		
		//Declare local instance variables
		var page_container_el = document.createElement("div");
		page_container_el.setAttribute("class", "window-page-container");
		var tabs_container_el = document.createElement("div");
		tabs_container_el.setAttribute("class", "window-tab-container");
		
		//Append page_container_el; tabs_container_el
		var window_body_el = this.element.querySelector(`#window-body`);
		window_body_el.appendChild(tabs_container_el);
		window_body_el.appendChild(page_container_el);
		
		//Set .options
		options.anchor = page_container_el;
		options.tab_anchor = tabs_container_el;
		
		options.left_offset = 0.5; //In rem for bottom hr in .tabs-container
		this.interface = new ve.PageMenu(options);
	}
	
	//3. Helper functions
	/**
	 * Returns the highest z-index over the set of all Windows in ve.windows.
	 * @param {Object} [arg0_options]
	 *  @param {boolean} [arg0_options.return_object=false] - Whether to return a Window instance.
	 *
	 * @returns {Number|ve.Window}
	 */
	static getHighestZIndex (arg0_options) {
		//Convert from parameters
		var options = (arg0_options) ? arg0_options : {};
		
		//Declare local instance variables
		var highest_z_index = [-Infinity, undefined];
		
		//Iterate over all ve.windows
		var all_ve_windows = Object.keys(ve.windows);
		
		for (let i = 0; i < all_ve_windows.length; i++) {
			let local_window = ve.windows[all_ve_windows[i]];
			
			highest_z_index[0] = Math.max(highest_z_index[0], local_window.getZIndex());
			highest_z_index[1] = local_window;
		}
		
		//Return statement
		return (!options.return_object) ? highest_z_index[0] : highest_z_index[1];
	}
	
	/**
	 * getZIndex() - Returns the current z-index of this Window.
	 *
	 * @returns {Number}
	 */
	getZIndex () {
		//Return statement
		return parseInt(getComputedStyle(this.element)["z-index"]);
	}
	
	/** Normalises all z-indexes over the set of ve.windows. */
	static normaliseZIndexes () {
		//Declare local instance variables
		var overlay_el = ve.window_overlay_el;
		
		//Get all elements with [data-window-id] and their z-index values
		var all_windows = Array.from(overlay_el.querySelectorAll('[data-window-id]'));
		
		// Extract z-index values and sort them numerically
		var z_indexes = all_windows
		.map((window) => ({
			element: window,
			z_index: parseInt(window.style.zIndex || 0, 10),
		}))
		.sort((a, b) => a.z_index - b.z_index);
		
		// Assign normalized z-index values (1, 2, 3, ...)
		z_indexes.forEach((item, index) => {
			item.element.style.zIndex = (index + 1).toString();
		});
	}
};