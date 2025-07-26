if (!global.ve) global.ve = {};

/**
 * Represents a Vercengen Interface. Contains a number of components.
 *
 * Interfaces are a sort of form/UI that stores local states. It can be recursively nested via the use of ComponentInterface as a sub-component, which utilises the same options.
 *
 * DOM:
 * - `,instance`: (this)
 *
 * Instance:
 * @property {HTMLElement} element
 *
 * @property {Object<ve.Component>} components
 * @property {Object<Array<Array<ve.Component>>>} table_rows - Stores all ve.Component instances in a 2D array.
 *
 * @property {ve.Interface.options} [options]
 *
 * @type {ve.Interface}
 */
ve.Interface = class {
	/**
	 * @typedef {Object} ve.Interface.options
	 * @property {HTMLElement|string} [anchor] - The element the present Interface should be attached to.
	 *  @property {string} [class=""] - The CSS class to apply to the present Interface.
	 *  @property {string} [id=generateRandomNumber(ve.interfaces)]
	 *
	 *  @property {boolean} [can_close=false]
	 *  @property {boolean} [do_not_append=false]
	 *  @property {boolean} [is_resizable=false]
	 *  @property {boolean] [is_window=false]
	 *  @property {string} [name=""]
	 *  @property {string} [maximum_height] - The height after which a scrollbar should appear in CSS units.
	 *  @property {string} [maximum_width] - The maximum width in CSS units.
	 *
	 *  @property {function(HTMLElement.prototype.onclick)} [options.close_function]
	 *
	 *  @property {Object<ve.Component.options>} [options.'input_key']
	 */
	constructor (arg0_options) {
		//Convert from parameters
		var options = (arg0_options) ? arg0_options : {};
		
		//Initialise options
		if (!options.class) options.class = "";
		
		//Declare local instance variable	s
		var all_options = Object.keys(options);
		var default_keys = ["anchor", "class", "id", "maximum_height", "maximum_width"];
		this.components = {};
		this.element = document.createElement("div");
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
		if (options.id) this.element.id = options.id;
		this.element.setAttribute("class", `${(options.class) ? options.class + " " : ""}${global.ve.default_class}`);
		if (parent_style.length > 0) this.element.setAttribute("style", `${parent_style}`);
		
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
				if (options.close_function)
					options.close_function(e);
				this.close();
			};
			
			this.element.appendChild(close_button_el);
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
			
			if (typeof local_option == "object" && local_option.type != undefined) {
				var local_el_html = [];
				var local_row = this.table_rows[local_option.y];
				var local_x = (local_option.x != undefined) ?
					local_option.x : local_row.length;
				
				//.id is not settable since it is essentially boilerplate given that .id is contained in the key anyway
				local_option.id = all_options[i];
				if (typeof local_option.type != "string") local_option.type = "text";
				local_option.x = local_x;
				var local_component = new ve.Component(this, local_option);
				this.components[(local_option.id) ? local_option.id : all_options[i]] = local_component;
				
				//Set local_row[local_x]
				local_row[local_x] = local_component.component;
			}
		}
		
		//3. Render and append table rows to table_el
		for (var i = 0; i < this.table_rows.length; i++) {
			var row_el = document.createElement("tr");
			
			if (this.table_rows[i])
				for (var x = 0; x < this.table_rows[i].length; x++)
					if (this.table_rows[i][x])
						row_el.appendChild(this.table_rows[i][x]);
			
			if (row_el.innerHTML.length == 0) continue; //Internal guard clause if row is empty
			
			table_el.appendChild(row_el);
		}
		
		//Append table to interface
		this.element.appendChild(table_el);
		options.parent = this;
		
		//Window handler
		{
			if (options.is_window) {
				var is_resizable = (options.is_resizable != false) ? true : false;
				
				//Invoke elementDragHandler()
				elementDragHandler(this.element, { is_resizable: is_resizable });
			}
		}
		
		if (!options.return_html) {
			if (options.anchor) {
				query_selector_el = (isElement(options.anchor)) ?
					options.anchor : document.querySelector(options.anchor);
				
				if (!options.do_not_append) {
					query_selector_el.appendChild(this.element);
				} else {
					query_selector_el.replaceChildren(this.element);
				}
			}
			
			//Return statement
			return this.element;
		} else {
			//Return statement
			return this.element.innerHTML;
		}
	}
	
	close () {
		delete ve.interfaces[this.interface_id];
		this.element.parentElement.remove();
	}
	
	getState () {
		//Return statement
		return ve.getElementState(this.element);
	}
};