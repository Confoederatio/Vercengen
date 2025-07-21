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
					is_open: true,
					name: "Basic Inputs:",
					type: "interface",
					
					basic_colour: {
						name: "Basic Colour",
						type: "basic_colour",
						x: 0,
						y: 0,
						
						onclick: function (e) {
							console.log(e, e.target.value);
						}
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
						},
						placeholder: "Help"
					},
					email: {
						name: "Email",
						type: "email",
						x: 0,
						y: 5,
						
						attributes: {
							size: 20, //[WIP] - Doesn't work because this is strongly set to 30 by default
							value: "johndoe@gmail.com"
						}
					},
					file: {
						name: "Classic File Input",
						type: "basic_file",
						x: 0,
						y: 6
					},
					number: {
						name: "Number (0-100):",
						type: "number",
						x: 0,
						y: 7,
						
						attributes: {
							min: 0,
							max: 100,
							step: 10
						}
					},
					password: {
						name: "Give me your password:",
						type: "password",
						x: 0,
						y: 8,
						
						attributes: {
							size: 12,
							value: "password"
						}
					},
					radio_list: {
						name: "Radio List:", //[WIP] - Not consistently implemented
						type: "radio",
						x: 0,
						y: 9,
						
						options: {
							"the": "The",
							"illusion": "Illusion of",
							"choice": "Choice"
						}
					},
					range: {
						name: "Range (Log):",
						type: "range",
						x: 0,
						y: 10,
						
						attributes: {
							min: 0,
							max: 100,
							step: 0.001, //This controls the resolution of control
						},
						placeholder: {
							VALUE: "VALUE*Math.pow(10, 3)"
						},
						value_equation: `VALUE/Math.pow(10, 3)`, //1 represents 0,001; 100 represents 0,1
					}
				},
				custom_html: {
					name: "Custom HTML:",
					type: "interface",
					
					custom_html: {
						name: "<b>This</b> is <u>custom HTML!</u>",
						type: "html"
					}
				},
				default_fallback: {
					name: "Default Fallback:",
					type: Infinity
				},
				more_inputs: {
					name: "More Inputs:",
					type: "interface",
					
					select_input: {
						name: "Select Input:",
						type: "select",
						
						options: {
							"winter": "Winter",
							"spring": "Spring",
							"summer": "Summer",
							"autumn": "Autumn"
						}
					},
					time_input: {
						name: "Time Input",
						type: "time"
					},
					url: {
						name: "URL",
						type: "url"
					}
				}
			}
		});
		
		window.form_inputs = new ve.Window({
			can_rename: false,
			name: "Date",
			x: window.form_inputs.x + window.form_inputs.element.offsetWidth*1.5 + margin_px,
			y: 100,
			interface: {
				regular_date: {
					name: "Date Picker",
					type: "date",
					multiple_rows: true
				},
				date_length_picker: {
					name: "Date Length Picker",
					type: "date_length"
				}
			}
		});
	}
}