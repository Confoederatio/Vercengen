ve.ComponentText = class {
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
		html_string.push(`<input type = "text" id = "text-input" ${objectToAttributes(options.attributes)}>`);
		
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
					this.options.onclick(e);
				}
			}
	}
};