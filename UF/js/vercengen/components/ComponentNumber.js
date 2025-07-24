ve.ComponentNumber = class { //[WIP] - Finish Class and refactoring
	constructor (arg0_options) {
		//Convert from parameters
		this.options = (arg0_options) ? arg0_options : {};
		
		//Declare local instance variables
		this.element = document.createElement("span");
		var html_string = [];
		var options = this.options;
		
		//Format html_string
		if (options.name)
			html_string.push(options.name);
		html_string.push(`<input type = "number" id = "number-input" ${objectToAttributes(options.attributes)}>`);
		
		//Populate element and initialise handlers
		this.element.innerHTML = html_string.join("");
		this.handleEvents();
	}
	
	handleEvents () {
		if (this.options.onclick)
			if (typeof this.options.onclick == "string") {
				this.element.setAttribute("onchange", this.options.onclick);
			} else {
				this.element.onchange = (e) => {
					e.component = this;
					
					if (this.options.onclick)
						this.options.onclick(e);
					if (this.options.onchange)
						this.options.onchange(e);
				};
			}
	}
	
	setInput (arg0_value) {
		//Convert from parameters
		var value = arg0_value;
		
		//Set value
		this.element.querySelector(`input[type="number"]`).value = value;
	}
};