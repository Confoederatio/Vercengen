if (!global.ve) global.ve = {};

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
ve.Interface = class {
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
		this.interface_el.appendChild(table_el);
		options.parent = this;
		
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
	
	getState () {
		//Return statement
		return getInputsAsObject(this.interface_el);
	}
};