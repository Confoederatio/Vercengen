//Initialise functions
{
	function initialiseVercengenWindowsDemo () {
		//Declare local instance variables
		var margin_px = 4;
		
		//Declare windows
		window.biuf_wysiwyg_colour_window = new ve.Window({
			id: "biuf-wysiwyg-colour-ui",
			name: "BIUF/WYSIWYG/Colour",
			x: 100,
			y: 100,
			page_menu: {
				default: "biuf",
				pages: {
					biuf: {
						name: "BIUF",
						
						biuf_test: {
							name: "BIUF Test",
							type: "biuf"
						}
					},
					wysiwyg: {
						name: "WYSIWYG",
						
						wysiwyg: {
							name: "WYSIWYG Word Editor",
							type: "wysiwyg"
						}
					},
					colour: {
						name: "Colour",
						
						colour: {
							name: "Fancy Colour Wheel Input<br>&nbsp;",
							type: "colour"
						}
					}
				}
			}
		});
		
		window.form_inputs = new ve.Window({
			x: window.biuf_wysiwyg_colour_window.x + window.biuf_wysiwyg_colour_window.element.offsetWidth + margin_px,
			y: 100,
			interface: {
				basic_inputs: {
					name: "Basic Inputs:",
					type: "interface",
					
					basic_colour: {
						name: "Basic Colour",
						type: "basic_colour",
						x: 0,
						y: 0
					},
					button_grid_one: {
						name: "Button Grid 1",
						type: "button",
						x: 0,
						y: 1
					},
					button_grid_two: {
						name: "Button Grid 2",
						type: "button",
						x: 1,
						y: 1
					},
					button_grid_three: {
						name: "Button Grid 3",
						type: "button",
						x: 1,
						y: 2
					},
					button_grid_four: {
						name: "Button Grid 4",
						type: "button",
						x: 2,
						y: 2
					},
					checkbox_optioning: { //[WIP] - Nesting not supported; .default only able to support one element, no .placeholder
						name: "Checkbox List:",
						type: "checkbox",
						width: 2,
						x: 1,
						y: 3,
						
						options: {
							"test_one": "Test 1",
							"nested_support": "Nested Support WIP"
						},
						default: "nested_support"
					},
					datalist_test: {
						name: "Datalist",
						type: "datalist",
						width: 2,
						x: 1,
						y: 4,
						
						options: {
							"help": "Help",
							"info": "Info",
							"test": "Test"
						}
					}
				}
			}
		});
	}
}