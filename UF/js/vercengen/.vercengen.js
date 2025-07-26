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
	
	//2. Helper functions
	/*
    getInputsAsObject() - Returns inputs as an object.
    arg0_context_menu_el: (HTMLElement) - The context menu element.
    arg1_options: (Object)
      do_not_include_submenus: (Boolean) - Optional. Whether to not include context submenus. False by default.
      entity_id: (String) - Optional. Whether the context menu is related to an entity. Undefined by default.
      custom_file_function: (Function) - Optional. The function to run to fetch input values for 'file' types. Fetches all paths by default.
      custom_html_function: (Function) - Optional. The function to run to fetch input values for custom 'html' types. Fetches nothing by default.

    Returns: (Object)
  */
	getInputsAsObject (arg0_context_menu_el, arg1_options) {
		//Convert from parameters
		var context_menu_el = arg0_context_menu_el;
		var options = (arg1_options) ? arg1_options : {};
		
		//Declare local instance variables
		var all_inputs = context_menu_el.querySelectorAll(`.context-menu-cell`);
		var return_obj = {};
		
		//1. General input handling
		//Iterate over all_inputs and set values in return_obj by referring to the ID
		for (var i = 0; i < all_inputs.length; i++) {
			var has_output = true;
			var local_id = all_inputs[i].getAttribute("id");
			var local_output;
			
			//Fetch local_output
			local_output = all_inputs[i].instance.getInput();
			if (local_output != null && local_output != undefined) has_output = true;
			
			//Set return_obj[local_id]
			if (has_output) {
				if (!Array.isArray(local_output) && typeof local_output == "object")
					return_obj = mergeObjects(return_obj, local_output);
				return_obj[local_id] = local_output;
			}
		}
		
		//2. Specialised input handling
		if (options.entity_id) {
			var common_selectors = config.defines.common.selectors;
			var entity_el = getEntityElement(options.entity_id);
			var entity_obj = getEntity(options.entity_id);
			
			//Make sure entity_obj exists
			if (entity_obj) {
				//Metadata handling
				//Metadata - Reserved variables
				if (!return_obj.ENTITY_ABSOLUTE_AGE) return_obj.ENTITY_ABSOLUTE_AGE = getEntityAbsoluteAge(options.entity_id);
				if (!return_obj.ENTITY_RELATIVE_AGE) return_obj.ENTITY_RELATIVE_AGE = getEntityRelativeAge(options.entity_id);
				
				//Multiple keyframes handling
				if (entity_obj.options.selected_keyframes_key)
					return_obj[entity_obj.options.selected_keyframes_key] = entity_obj.options.selected_keyframes;
				//Timestamp handling
				if (entity_el) {
					var entity_keyframe_anchor_el = entity_el.querySelector(`${common_selectors.entity_keyframe_context_menu_anchor}`);
					var entity_timestamp = entity_keyframe_anchor_el.getAttribute("timestamp");
					
					if (entity_timestamp)
						return_obj.timestamp = entity_timestamp;
				}
			}
		}
		
		//Return statement
		return return_obj;
	}
};