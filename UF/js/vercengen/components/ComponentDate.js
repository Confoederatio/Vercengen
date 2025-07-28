/**
 * <span color = "yellow">{@link Class}</span>: ComponentDate
 *
 * ##### Instance:
 * - `.element`: {@link HTMLElement}
 * - `.options`: {@link Object}
 *   - `.multiple_rows`: {@link boolean}
 *   - `.name`: {@link string}
 *   - `.placeholder`: {@link ve.Date}
 *
 * ##### Methods:
 * - <span color=00ffff>{@link ve.ComponentDate.getInput|getInput}</span>
 * - <span color=00ffff>{@link ve.ComponentDate.setInput|setInput}</span>(arg0_value: {@link ve.Date})
 *
 * Static Methods:
 * - <span color=00ffff>{@link ve.ComponentDate.getMonths}</span>
 * - <span color=00ffff>{@link ve.ComponentDate.populateDateFields}</span>(arg0_date_container_el: {@link HTMLElement}, arg1_date: {@link ve.Date})
 *
 * @type {ve.ComponentDate}
 */
ve.ComponentDate = class { //[WIP] - Finish Class and refactoring; missing handleEvents()
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
	
	/**
	 * Returns a `ve.Date` Object from the present Component.
	 *
	 * @returns {ve.Date}
	 */
	getInput () {
		//Return statement
		return getDateFromFields(this.element);
	}
	
	/**
	 * Returns an Array<string> of all twelve months.
	 *
	 * @returns {Array<string>}
	 */
	static getMonths () {
		//Return statement
		return ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	}
	
	/**
	 * Populates all date fields given a ve.Date object or timestamp.
	 *
	 * @param {HTMLElement} arg0_date_container_el
	 * @param {ve.Date} arg1_date
	 */
	static populateDateFields (arg0_date_container_el, arg1_date) {
		//Convert from parameters
		var date_container_el = arg0_date_container_el;
		var date = arg1_date;
		
		//Declare local instance variables
		var day_el = date_container_el.querySelector(`#day-input`);
		var hour_el = date_container_el.querySelector(`#hour-input`);
		var minute_el = date_container_el.querySelector(`#minute-input`);
		var month_el = date_container_el.querySelector(`#month-input`);
		var year_el = date_container_el.querySelector(`#year-input`);
		var year_type_el = date_container_el.querySelector(`#year-type`);
		
		var days_in_month = JSON.parse(JSON.stringify(global.days_in_months[date.month - 1]));
		var is_leap_year = isLeapYear(date.year);
		var lowercase_months = config.defines.common.months_lowercase;
		var months_html = [];
		
		//Leap year check
		if (is_leap_year && date.month == 2)
			days_in_month++;
		
		//Adjust days if year_el; month_el are changed. Add leading zeroes to hour_el; minute_el if changed
		year_el.onchange = function () {
			var local_day = parseInt(deordinalise(day_el.value));
			var local_month = parseInt(month_el.value);
			var local_year = parseInt(this.value);
			
			//Max Leap year check
			if (isLeapYear(local_year) && parseInt(month_el.value) == 2)
				if (local_day > 29)
					day_el.value = ordinalise(29);
			//Max Month check
			if (local_day > days_in_month)
				day_el.value = ordinalise(days_in_month);
			if (local_day < 1)
				day_el.value = ordinalise(1);
		};
		month_el.onchange = function () {
			var local_day = parseInt(deordinalise(day_el.value));
			var local_month = getMonth(this.value);
			var local_year = parseInt(year_el.value);
			
			//Max Leap year check
			days_in_month = JSON.parse(JSON.stringify(days_in_months[local_month - 1]));
			if (isLeapYear(local_year) && local_month == 2) days_in_month++;
			
			//Set month; day .value
			month_el.value = config.defines.common.months_uppercase[local_month - 1];
			day_el.value = (local_day <= days_in_month) ? ordinalise(local_day) : ordinalise(days_in_month);
		};
		day_el.onchange = function () {
			var local_day = parseInt(deordinalise(this.value));
			var local_month = parseInt(month_el.value);
			var new_local_day = local_day;
			
			//Make sure local_day is a valid number
			if (isNaN(local_day) || local_day < 1)
				new_local_day = ordinalise(1);
			
			//Make sure local_day fits within bounds
			if (local_day > days_in_month)
				new_local_day = ordinalise(days_in_month);
			day_el.value = new_local_day;
			
			//Standardise day_el.value to ordinal
			if (!isNaN(day_el.value) && !isNaN(parseFloat(day_el.value)))
				day_el.value = ordinalise(day_el.value);
		};
		
		//Force leading zeroes for hours and minutes, make sure inputs are valid
		hour_el.onchange = function () {
			this.value = Math.max(Math.min(this.value, 23), 0);
			if (this.value < 10)
				this.value = `0${parseInt(this.value)}`;
		};
		minute_el.onchange = function () {
			this.value = Math.max(Math.min(this.value, 59), 0);
			if (this.value < 10)
				this.value = `0${parseInt(this.value)}`;
		};
		
		//Set values according to current date
		day_el.value = ordinalise(date.day);
		hour_el.value = `${(date.hour < 10) ? "0" : ""}${date.hour}`;
		minute_el.value = `${(date.minute < 10) ? "0" : ""}${date.minute}`;
		month_el.value = months[date.month - 1];
		year_el.value = Math.abs(date.year); //[WIP] - BC handling
		year_type_el.value = (date.year >= 0) ? "AD" : "BC";
	}
	
	/**
	 * Sets the date value for the present Component.
	 *
	 * @param {ve.Date} arg0_value
	 */
	setInput (arg0_value) {
		//Convert from parameters
		var value = arg0_value;
		if (value == undefined) return;
		
		//Declare local instance variables
		var months = ve.ComponentDate.getMonths();
		
		var day_el = this.element.querySelector(`#day-input`);
		var hour_el = this.element.querySelector(`#hour-input`);
		var minute_el = this.element.querySelector(`#minute-input`);
		var month_el = this.element.querySelector(`#month-input`);
		var year_el = this.element.querySelector(`#year-input`);
		var year_type_el = this.element.querySelector(`#year-type`);
		
		//Set local values from value
		value = convertTimestampToDate(value);
		
		if (value.placeholder.year < 0) {
			year_el.value = value.year*-1;
			year_type_el.value = "BC";
		} else {
			year_el.value = value.year;
			year_type_el.value = "AD";
		}
		
		month_el.value = (!isNaN(value.month)) ? months[value.month - 1] : "January";
		day_el.value = value.day;
		hour_el.value = `${(value.hour < 10) ? "0" : ""}${value.hour}`;
		minute_el.value = `${(value.minute < 10) ? "0" : ""}${value.minute}`;
	}
};

//Initialise functions
{
	/*
		getDateFromFields() - Fetches a date object from input fields.
		arg0_date_container_el: (HTMLElement) - The container for all the date fields.

		Returns: (Object, Date)
	*/
	function getDateFromFields (arg0_date_container_el) {
		//Convert from parameters
		var date_container_el = arg0_date_container_el;
		
		//Declare local instance variables
		var day_el = date_container_el.querySelector(`#day-input`);
		var hour_el = date_container_el.querySelector(`#hour-input`);
		var minute_el = date_container_el.querySelector(`#minute-input`);
		var month_el = date_container_el.querySelector(`#month-input`);
		var year_el = date_container_el.querySelector(`#year-input`);
		var year_type_el = date_container_el.querySelector(`#year-type`);
		
		//Declare local instance variables
		var new_date = {};
		
		//Check if year is valid
		if (!isNaN(year_el.value))
			if (year_el.value > 0) {
				new_date.year = (year_type_el.value == "AD") ?
					parseInt(year_el.value) :
					parseInt(year_el.value)*-1;
			} else if (year_el.value == 0) {
				//Assume this means AD 1
				year_el.value = 1;
			} else {
				new_date.year = year_el.value;
				year_type_el.value = (year_type_el.value == "AD") ? "BC" : "AD";
			}
		
		//Set month; day; hour; minute
		new_date.month = getMonth(month_el.value); //[WIP] - This is flawed
		new_date.day = parseInt(day_el.value);
		
		var hour_value = returnSafeNumber(parseInt(hour_el.value));
		var minute_value = returnSafeNumber(parseInt(minute_el.value));
		
		//Set min, max bounds
		if (hour_value < 0) hour_value = 0;
		if (hour_value > 23) hour_value = 23;
		if (minute_value < 0) minute_value = 0;
		if (minute_value > 59) minute_value = 59;
		
		//New Year's exception (change to 00:01 if date is January 1)
		if (new_date.month == 1 && new_date.day == 1)
			if (hour_value == 0 && minute_value == 0)
				minute_value = 1;
		
		new_date.hour = hour_value;
		new_date.minute = minute_value;
		
		month_el.value = (!isNaN(new_date.month)) ? months[new_date.month - 1] : "January";
		day_el.value = new_date.day;
		hour_el.value = `${(new_date.hour < 10) ? "0" : ""}${new_date.hour}`;
		minute_el.value = `${(new_date.minute < 10) ? "0" : ""}${new_date.minute}`;
		
		//Return statement
		return new_date;
	}
}