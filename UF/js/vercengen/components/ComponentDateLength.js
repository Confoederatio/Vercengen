ve.ComponentDateLength = class { //[WIP] - Finish Class and refactoring
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
		
		//Place date_length containers on separate lines for better readability
		html_string.push(`
			<div id = "date-container">
				<input id = "years-input" size = "6" placeholder = "2000" value = "2000"></input>
				<input id = "months-input" size = "6" placeholder = "January" value = "January"></input>
				<input id = "days-input" size = "5" placeholder = "1st" value = "1st" size = "4"></input>
			</div>
			<div id = "clock-container">
				<input id = "hours-input" placeholder = "00" value = "00" size = "2"></input> :
				<input id = "minutes-input" placeholder = "00" value = "00" size = "2"></input>
			</div>
		`);
		
		//Populate element and initialise handlers
		this.element.innerHTML = html_string.join("");
	}
};