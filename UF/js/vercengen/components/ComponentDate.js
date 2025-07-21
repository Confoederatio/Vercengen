ve.ComponentDate = class { //[WIP] - Finish Class and refactoring
	constructor (arg0_options) {
		//Convert from parameters
		this.options = (arg0_options) ? arg0_options : {};
		
		//Declare local instance variables
		this.element = document.createElement("span");
		var html_string = [];
		var options = this.options;
		
		//Push HTML scaffolding
		if (options.name)
			html_string.push(`<div class = "header">${options.name}</div>`);

		//High-intensity - create date framework first
		//Day/month/year container
		if (options.multiple_rows) html_string.push(`<div class = "row-one">`);
		html_string.push(`<input id = "day-input" class = "day-input" placeholder = "1st" size = "4">`);
		html_string.push(`<input id = "month-input" class = "month-input" list = "months" placeholder = "January">`);
		html_string.push(`
			<datalist id = "months" name = "month">
				<option value = "January">1</option>
				<option value = "February">2</option>
				<option value = "March">3</option>
				<option value = "April">4</option>
				<option value = "May">5</option>
				<option value = "June">6</option>
				<option value = "July">7</option>
				<option value = "August">8</option>
				<option value = "September">9</option>
				<option value = "October">10</option>
				<option value = "November">11</option>
				<option value = "December">12</option>
			</datalist>
		`);
		html_string.push(`<input id = "year-input" class = "year-input">`);
		html_string.push(`
			<select id = "year-type">
				<option value = "AD">AD</option>
				<option value = "BC">BC</option>
			</select>
		`);
		if (options.multiple_rows) html_string.push(`</div>`);
		//Hour-minute container
		if (options.multiple_rows) html_string.push(`<div class = "row-two">`);
		html_string.push(`
			<input id = "hour-input" value = "00" placeholder = "00" size = "2"> :
			<input id = "minute-input" value = "00" placeholder = "00" size = "2">
		`);
		if (options.multiple_rows) html_string.push(`</div>`);
		
		//Populate element and initialise handlers
		this.element.innerHTML = html_string.join("");
	}
};