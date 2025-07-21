ve.ComponentButton = class { //[WIP] - Finish Class and refactoring
	constructor (arg0_options) {
		//Convert from parameters
		this.options = (arg0_options) ? arg0_options : {};
		
		//Declare local instance variables
		this.element = document.createElement("span");
		var html_string = [];
		var options = this.options;
		
		//Format html_string
		this.element.setAttribute("class", "button");
		if (options.icon)
			html_string.push(`<img src = "${options.icon}">`);
		if (options.name)
			html_string.push(options.name);
		
		//Populate element and initialise handlers
		this.element.innerHTML = html_string.join("");
		this.handleEvents();
	}
	
	handleEvents () {
		if (this.options.onclick)
			if (this.options.onclick == "string") {
				this.element.setAttribute("onclick", this.options.onclick);
			} else {
				this.element.onclick = (e) => {
					e.component = this;
					
					this.options.onclick(e);
				};
			}
	}
};