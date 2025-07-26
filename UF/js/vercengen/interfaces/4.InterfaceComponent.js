if (!global.ve) global.ve = {};

ve.Component = class {
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
};