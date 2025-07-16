//Initialise functions
global.ve = {
	//Set defines
	default_class: `ve context-menu`,
	interfaces: {}, //Stores all Interfaces and their Components in state
	windows: {}, //Stores all Windows in state

	//1. State functions
	initialise: function () {
		//Declare Windows overlay element
		ve.window_overlay_el = document.createElement("div");
		ve.window_overlay_el.id = "ve-overlay";
		ve.window_overlay_el.setAttribute("class", "ve-overlay");
		document.body.appendChild(ve.window_overlay_el);
	},
	updateVercengenState: function () { //[WIP] - Finish function body
		//Iterate over ve.windows; ve.interfaces; and remove those without a valid .element
	},

	//2. Window class
	Window: class {
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

		close () {
			//Delete ve.windows[this.window_id], then remove element
			delete ve.windows[this.window_id];
			this.element.remove();
		}

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

		getName () {
			//Declare local instance variables
			var name_el = this.element.querySelector(`#window-name`);

			//Update instance state
			this.name = name_el.innerHTML;

			//Return statement
			return this.name;
		}

		getState () {
			//Return statement
			return getInputsAsObject(this.element);
		}

		getZIndex () {
			//Return statement
			return parseInt(getComputedStyle(this.element)["z-index"]);
		}

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

		select () {
			//Declare local instance variables
			var current_highest_z_index = JSON.parse(JSON.stringify(ve.Window.getHighestZIndex())) + 1;

			//Swap z-indices
			this.element.style.zIndex = current_highest_z_index.toString();
			ve.Window.normaliseZIndexes();
		}

		setInterface (arg0_options) {
			//Convert from parameters
			var options = (arg0_options) ? arg0_options : {};

			//Declare local instance variables
			options.anchor = this.element.querySelector(`#window-body`);
			options.can_close = true;

			this.interface = new ve.Interface(options);
		}

		setName (arg0_name) {
			//Convert from parameters
			var name = (arg0_name) ? arg0_name : "";

			//Set this.name; update DOM
			this.name = name;
			this.element.querySelector(`#window-name`).innerHTML = name;
		}

		setPage (arg0_page) {
			//Convert from parameters
			var page = arg0_page;

			this.interface.setPage(page);
		}

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
	},

	//3. PageMenu class - Contains tabs/interfaces - [WIP] - Needs to store state per page; use ve.interfaces for this
	/*
    PageMenu - Creates a page menu for a set of HTML elements.
    arg0_options: (Object)
      id: (String) - Optional. The ID of the page menu to use. Randomly generated by default.

      anchor: (HTMLElement/String) - The query selector anchor in which the page menu is created. If options.tab_anchor is specified, this is just where page content is displayed instead.
      tab_anchor: (HTMLElement/String) - Optional. Defaults to creating two elements in anchor if not available.

      default: (String) - Optional. The default context menu to apply tocontent and active tabs. The first key by default.
      left_offset: (Number) - Optional. 0.125 by default.
      pages: (Object)
        <page_key>: (Object) - new ve.Interface() options is placed here.
          name: (String)
          html: (Array<String>/String) - Optional. Any custom HTML to load into the page instead of context menu options.
          <key>: (Variable) - Optional. The same as most context menus. Does not apply if local .html is true.
          special_function: (Function) - The function to execute upon clicking this tab.
      special_function: (Function) - The function to execute upon clicking any tab.

    Returns: (HTMLElement)
  */
	PageMenu: class {
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
			this.content_el = undefined;
			this.tabs_el = undefined;

			//Define this.content_el; tabs_el
			if (options.anchor && options.tab_anchor) {
				try {
					this.content_el = document.querySelector(options.anchor);
					this.tabs_el = document.querySelector(options.tab_anchor);
				} catch {
					this.content_el = options.anchor;
					this.tabs_el = options.tab_anchor;
				}
			} else {
				this.content_el = document.createElement("div");
				this.tabs_el = document.createElement("div");
			}

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
			return [this.tabs_el, this.content_el];
		}

		getState () {
			//Return statement
			return getInputsAsObject(this.content_el);
		}

		loadState (arg0_options) {
			//Convert from parameters
			var options = (arg0_options) ? arg0_options : {};

			//Iterate over all_options and call autoFillInput()
			var all_options = Object.keys(options);

			for (var i = 0; i < all_options.length; i++) {
				var local_option_el = this.content_el.querySelector(`[id="${all_options[i]}"]`);
				var local_value = options[all_options[i]];

				if (local_option_el)
					autoFillInput({
						element: local_option_el,
						placeholder: local_value,
						type: local_option_el.getAttribute("type"),
						value: local_value
					});
			}
		}

		setPage (arg0_page, arg1_event) {
			//Convert from parameters
			var page = arg0_page;
			var event = arg1_event;

			//Declare local instance variables
			var all_pages = Object.keys(this.options.pages);
			var hr_el = this.tabs_el.querySelector("hr");
			var left_offset = returnSafeNumber(this.options.left_offset, 0.125); //In rem
			var local_tab_button_el = this.tabs_el.querySelector(`span[id="${page}"]`);
			var local_value = this.options.pages[page];

			//Initialise local_value options
			if (!local_value.anchor) local_value.anchor = this.content_el;

			//Parse .onclick handler
			if (this.options.special_function) this.options.special_function(e);
			if (local_value.special_function) local_value.special_function(e);

			//Save state before resetting it
			try {
				if (!this.current_page) this.current_page = page;
				this.page_states[this.current_page] = this.getState();
			} catch (e) {
				console.error(e);
			}
			this.content_el.innerHTML = "";

			//Remove 'active' class from all pages; and set the current tab to active in terms of highlighting
			for (var x = 0; x < all_pages.length; x++)
				removeClass(this.tabs_el.querySelector(`span[id="${all_pages[x]}"]`), "active");
			addClass(local_tab_button_el, "active");
			hr_el.style.left = `calc(${local_tab_button_el.offsetLeft - local_tab_button_el.parentElement.offsetLeft}px + ${left_offset}rem)`;

			//Set "page" attribute for this.content_el; replace content
			this.content_el.setAttribute("page", page);

			if (local_value.can_close == undefined)
				local_value.can_close = true;
			if (!local_value.html) {
				if (!local_value.class) local_value.class = "ve-transparent";
				this.content_el.innerHTML = "";
				this.interfaces[(local_value.id) ? local_value.id : generateRandomID(this.interfaces)] = new ve.Interface(local_value);
			} else {
				this.content_el.innerHTML = (Array.isArray(local_value.html)) ?
					local_value.html.join("") : local_value.html;
			}

			//Load any previous state
			if (this.page_states[page])
				this.loadState(this.page_states[page]);

			//Set this.current_page
			this.current_page = page;
		}
	},

	//4. Interface class
	/*
		new Interface()
		arg0_options: (Object)
			anchor: (String/Element) - The query selector to pin a context menu to.
			class: (String) - The class prefix to prepend.
			close_function: (String) - The function to execute when the close button is clicked.
			can_close: (Boolean) - Whether to not add a close button to the input. False by default.
			do_not_append: (Boolean) - Whether to append or not.
			id: (String) - The ID of the context menu.
			is_resizable: (Boolean) - Whether to allow the context menu to be resized. True by default if is_window is true.
			is_window: (Boolean) - Whether to treat the context menu as a window. False by default.
			name: (String) - Optional. Title of the context menu. Undefined; will not display by default.
			maximum_height: (String) - Optional. The height after which a scrollbar should appear in CSS units.
			maximum_width: (String) - Optional. Maximum width in CSS units.

			<input_key>: (Object)
				type: (String) - The type of HTML input to grab.
					- biuf
					- rich_text/wysiwyg

					- basic_colour
					- button
					- checkbox
					- color/colour
					- context_menu
					- datalist
					- date
					- date_length
					- email
					- file
					- hierarchy
					- hidden
					- html
					- image
					- number
					- password
					- radio
					- range
					- reset
					- search_select
					- select
					- sortable_list
					- submit
					- tel/telephone
					- text
					- time
					- url/URL

				icon: (String) - Optional. The path to the display icon image.
				name: (String) - Optional. The HTML text of the button to display.
				onclick: (String) - Optional. The JS code to execute on button click.
				options: (Object) - For 'checkbox'/'search_select'/'select'/'sortable_list'/'radio'
					<option_key>: (String) - The datalist/select option ID to pass to the focus element.
				tooltip: (String) - Optional. The HTML tooltip a user can see by hovering over this input.

				height: (Number) - Optional. The row height of this element in a grid. 1 by default.
				width: (Number) - Optional. The column width of this element in a grid. 1 by default.

				x: (Number) - Optional. The X position of the element in a grid. 0 by default.
				y: (Number) - Optional. The Y position of the element in a grid. n + 1 by default, where n = last row.

				return_html: (Boolean) - Optional. Whether to return the html_string instead of modifying the anchor element. False by default.

		Returns: (HTMLElement)
	 */
	Interface: class {
		constructor (arg0_options) {
			//Convert from parameters
			var options = (arg0_options) ? arg0_options : {};

			//Initialise options
			if (!options.class) options.class = "";

			//Declare local instance variable	s
			var all_options = Object.keys(options);
			var default_keys = ["anchor", "class", "id", "maximum_height", "maximum_width"];
			this.components = {};
			this.interface_el = document.createElement("div");
			var query_selector_el;
			var table_columns = 0;
			this.table_rows = 0;

			//Set interface object in ve.interfaces
			this.interface_id = (options.id) ? options.id : generateRandomID(ve.interfaces);
			ve.interfaces[this.interface_id] = this;

			//Format CSS strings
			var height_string = (options.maximum_height) ? `height: ${options.maximum_height}; overflow-y: auto;` : "";
			var width_string = (options.maximum_width) ? `width: ${options.maximum_width}; overflow-x: hidden;` : "";

			var parent_style = `${height_string}${width_string}`;

			//Format interface_el
			if (options.id) this.interface_el.id = options.id;
			this.interface_el.setAttribute("class", `${(options.class) ? options.class + " " : ""}${global.ve.default_class}`);
			if (parent_style.length > 0) this.interface_el.setAttribute("style", `${parent_style}`);

			//Add close button
			var can_close = (options.can_close);
			if (options.class)
				if (options.class.includes("unique"))
					can_close = true;

			if (!can_close) {
				var close_button_el = document.createElement("img");

				close_button_el.id = "close-button";
				close_button_el.src = "./UF/gfx/close_icon_dark.png";
				close_button_el.className = "uf-close-button";
				close_button_el.draggable = false;
				close_button_el.onclick = (e) => {
					this.close();
				};

				this.interface_el.appendChild(close_button_el);
			}

			//Fetch table_columns; table_rows
			for (var i = 0; i < all_options.length; i++) {
				var local_option = options[all_options[i]];

				//This is an input field; process .x, .y
				if (typeof local_option == "object") {
					if (local_option.x)
						table_columns = Math.max(table_columns, local_option.x);
					if (local_option.y) {
						this.table_rows = Math.max(this.table_rows, local_option.y);
					} else {
						this.table_rows++;
					}
				}
			}

			//Iterate over all_options; format them
			var table_el = document.createElement("table");

			var current_row = 0;
			this.table_rows = [];

			//1. Initialise table_rows
			for (var i = 0; i < all_options.length; i++) {
				var local_option = options[all_options[i]];

				if (typeof local_option == "object") {
					if (local_option.y != undefined) {
						current_row = local_option.y;
					} else {
						current_row++;
						local_option.y = current_row;
					}

					//Initialise table_rows[current_row]:
					this.table_rows[current_row] = [];
				}
			}

			//2. Populate table_rows
			for (var i = 0; i < all_options.length; i++) {
				var local_option = options[all_options[i]];

				if (typeof local_option == "object" && local_option.type) {
					var local_el_html = [];
					var local_row = this.table_rows[local_option.y];
					var local_x = (local_option.x != undefined) ?
						local_option.x : local_row.length;

					if (!local_option.id) local_option.id = all_options[i];
						local_option.x = local_x;
					var local_component = new ve.Component(this, local_option);
						this.components[(local_option.id) ? local_option.id : all_options[i]] = local_component;

					local_el_html = local_component.processed_html;

					//Set local_row[local_x]
					local_row[local_x] = local_el_html.join("");
				}
			}

			//3. Render and append table rows to table_el
			for (var i = 0; i < this.table_rows.length; i++) {
				var row_el = document.createElement("tr");

				if (this.table_rows[i])
					row_el.innerHTML = this.table_rows[i].join("");
				if (row_el.innerHTML.length == 0) continue; //Internal guard clause if row is empty
				table_el.appendChild(row_el);
			}

			//Append table to interface
			this.interface_el.appendChild(table_el);
				options.parent = this;
			handleContextMenu(this.interface_el, options);

			//Window handler
			{
				if (options.is_window) {
					var is_resizable = (options.is_resizable != false) ? true : false;

					//Invoke elementDragHandler()
					elementDragHandler(this.interface_el, { is_resizable: is_resizable });
				}
			}

			if (!options.return_html) {
				if (options.anchor) {
					query_selector_el = (isElement(options.anchor)) ?
						options.anchor : document.querySelector(options.anchor);

					if (!options.do_not_append) {
						query_selector_el.appendChild(this.interface_el);
					} else {
						query_selector_el.replaceChildren(this.interface_el);
					}
				}

				//Return statement
				return this.interface_el;
			} else {
				//Return statement
				return this.interface_el.innerHTML;
			}
		}

		close () {
			delete ve.interfaces[this.interface_id];
			this.interface_el.parentElement.remove();
		}
	},

	//5. Component class
	Component: class {
		constructor (arg0_parent, arg1_options) {
			//Convert from parameters
			var parent = arg0_parent; //Class: Interface
			var options = (arg1_options) ? arg1_options : {};

			//Set component state
			this.id = (options.id) ? options.id : "generic-component";
			this.name = (options.name) ? options.name : "";

			this.css_class = (options.css_class) ? options.css_class : "";
			this.defines = (options.defines) ? options.defines : undefined;
			this.disabled = (options.disabled == true) ? true : false;
			this.do_not_change = (options.do_not_change == true) ? true : false;
			this.type = (options.type) ? options.type : "text";
			this.variable = options.variable;

			this.attributes = (options.attributes) ? options.attributes : undefined;
			this.height = returnSafeNumber(options.height, 1);
			this.width = returnSafeNumber(options.width, 1);
			this.x = returnSafeNumber(options.x);
			this.y = returnSafeNumber(options.y);

			this.processed_html = [];
			this.raw_html = createInput(options);
			var component_row = parent.table_rows[options.y];
			var component_x;

			if (this.raw_html) {
				this.processed_html.push(`<td${(options.width) ? ` colspan = "${options.width}"` : ""}${(options.height) ? ` rowspan = "${options.height}"` : ""}>`);
					this.processed_html.push(this.raw_html);
				this.processed_html.push(`</td>`);

				component_x = (options.x != undefined) ? options.x : component_row.length;
				component_row[component_x] = this.processed_html.join("");
			} else {
				console.error(`Error when attempting to add UI element with options:`, options);
			}

			//Return Component
			return this;
		}
	},
};