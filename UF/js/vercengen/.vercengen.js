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
	}
};