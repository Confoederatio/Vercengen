//Initialise functions
global.ve = {
	//Set defines
	component_dictionary: {
		basic_colour: "ComponentBasicColour",
		basic_file: "ComponentBasicFile",
		biuf: "ComponentBIUF",
		button: "ComponentButton",
		checkbox: "ComponentCheckbox",
		colour: "ComponentColour",
		datalist: "ComponentDatalist",
		date: "ComponentDate",
		date_length: "ComponentDateLength",
		email: "ComponentEmail",
		html: "ComponentHTML",
		interface: "ComponentInterface",
		number: "ComponentNumber",
		password: "ComponentPassword",
		radio: "ComponentRadio",
		range: "ComponentRange",
		reset: "ComponentReset",
		search_select: "ComponentSearchSelect",
		select: "ComponentSelect",
		sortable_list: "ComponentSortableList",
		submit: "ComponentSubmit",
		telephone: "ComponentTelephone",
			tel: "ComponentTelephone",
		text: "ComponentText",
		time: "ComponentTime",
		url: "ComponentURL",
		wysiwyg: "ComponentWYSIWYG",
			rich_text: "ComponentWYSIWYG",
	},
	default_class: `ve context-menu`,
	interfaces: {}, //Stores all Interfaces and their Components in state
	windows: {}, //Stores all Windows in state

	//1. State functions
	/** Initialises Vercengen for the present app session. */
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
			
			this.attributes = (options.attributes) ? options.attributes : undefined;
			this.height = returnSafeNumber(options.height, 1);
			this.width = returnSafeNumber(options.width, 1);
			this.x = returnSafeNumber(options.x);
			this.y = returnSafeNumber(options.y);
			
			{
				//Scaffold this.component
				var component_obj = ve.Component.createInput(options);
				if (!component_obj) console.error(`Invalid component type:`, options.type);
				
				this.component = component_obj;
				
				//Onload handler
				if (options.onload) {
					var return_value = options.onload(this.component.element);
					
					if (typeof return_value == "object")
						this.component.element.innerHTML = ve.Component.createInput(
							dumbMergeObjects(this.element, return_value)
						);
				}
			}
			
			//this.component handling for both non-element and element returns
			var local_td_el = document.createElement("td");
				if (options.height) local_td_el.setAttribute("rowspan", options.height);
				if (options.width) local_td_el.setAttribute("colspan", options.width);
			
			if (typeof this.component == "object") {
				var local_context_menu_cell = document.createElement("div");
					local_context_menu_cell.setAttribute("id", options.id);
					local_context_menu_cell.setAttribute("class", "context-menu-cell");
					local_context_menu_cell.setAttribute("type", options.type);
				
					local_context_menu_cell.appendChild(this.component.element);
				local_td_el.appendChild(local_context_menu_cell);
				
				//Bindings handling
				{
					//Attach .instance whereever available
					local_context_menu_cell.instance = component_obj;
				}
			} else if (typeof this.component == "string") {
				local_td_el.innerHTML = JSON.parse(JSON.stringify(this.component));
			}
			
			//Reset this.component to be an actual HTMLElement
			var component_row = parent.table_rows[options.y];
			var component_x = (options.x != undefined) ? options.x : component_row.length;
			
			this.component = local_td_el;
			component_row[component_x] = this.component;
		}
		
		/*
			createInput() - Returns a string representing the HTML input element.
			arg0_options: (Object)
				id: (String) - The ID to associate this input with.
				type: (String) - The input type to return the HTML of. 'biuf'/'rich_text'/'wysiwyg'/'button'/'checkbox'/'color'/'colour'/'datalist'/'date'/'date_length'/'email'/'file'/'hidden'/'hierarchy'/'html'/'image'/'number'/'password'/'radio'/'range'/'reset'/'search_select'/'select'/'submit'/'tel'/'text'/'time'/'url'
	
				icon: (String) - Optional. The path to the display icon image.
				name: (String) - Optional. The HTML string of the button to display.
				onclick: (String) - Optional. The onclick/confirm attribute of the button.
				onload: (String) - Optional. The onload attribute of the button.
				tooltip: (String) - Optional. The HTML tooltip a user can see by hovering over this input.
	
				attributes: - Optional.
					<attribute_name>: <value> - The attribute to pass to the focus element.
				options: - Optional. Used for checkbox/datalist/select/radio
					<option_id>: <value> - The datalist/select option ID to pass to the focus element.
	
				//Individual input type options.
				//'biuf'
					default: (String) - Optional. The default string to input as a placeholder value. 'Name' by default
				//'checkbox'
					default: (String) - Optional. The default ID to be checked. None by default.
				//'date'
					default_date: (Object) - The date to set defaults to if applicable.
				//'html'
					innerHTML: (String) - The HTML to append to this cell.
		*/
		static createInput (arg0_options) {
			//Convert from parameters
			var options = (arg0_options) ? arg0_options : {};
			
			//Initialise options
			if (!options.attributes) options.attributes = {};
			if (!options.options) options.options = {};
			if (!options.options.VALUE) {
				if (options.attributes.value)
					options.options.VALUE = options.attributes.value;
				if (options.placeholder)
					options.options.VALUE = options.placeholder;
			}
			
			//Input type handling
			return (new ve[ve.component_dictionary[options.type]](options));
		}
		
		static setInput (arg0_options) {
			//Convert from parameters
			var options = (arg0_options) ? arg0_options : {};
			
			//Initalise options
			if (!options.value) options.value = {};
			
			//Guard clause if options.placeholder doesn't exist
			if (options.placeholder == undefined) return undefined;
			
			//Declare local instance variables
			var placeholder_obj = JSON.parse(JSON.stringify(options.placeholder));
			
			//Parse placeholder_obj
			if (typeof placeholder_obj == "object") {
				var all_placeholder_keys = Object.keys(options.placeholder);
				
				for (var i = 0; i < all_placeholder_keys.length; i++) {
					var local_placeholder = placeholder_obj[all_placeholder_keys[i]];
					var local_placeholder_string = JSON.parse(JSON.stringify(local_placeholder));
					
					if (local_placeholder != undefined)
						placeholder_obj[all_placeholder_keys[i]] = (options.value.value_equation) ?
							parseVariableString(options.value.value_equation, { VALUE: parseVariableString(local_placeholder) }) :
							parseVariableString(local_placeholder, { ignore_errors: true });
				}
				
				if (all_placeholder_keys.length == 1 && placeholder_obj.VALUE != undefined)
					placeholder_obj = placeholder_obj.VALUE;
			}
			
			//Modify name_label_el
			var name_data_el = options.element.querySelector(`data#name-label`);
			var name_label_el = options.element.querySelector(`span#name-label`);
			
			if (name_data_el && name_label_el)
				name_label_el.innerHTML = parseLocalisation(name_data_el.innerHTML, {
					is_html: true,
					scopes: { VALUE: placeholder_obj }
				});
			
			options.element.instance.setInput(placeholder_obj);
		}
	},
};