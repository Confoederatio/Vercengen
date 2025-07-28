/**
 * <span color = "yellow">{@link Class}</span>
 * ComponentDateLength
 *
 * ##### Instance:
 * - `.element`: {@link HTMLElement}
 * - `.options`: {@link Object}
 *   - `.name`: {@link string}
 *   - `.placeholder`: {@link ve.Date}
 *
 * ##### Methods:
 * - <span color=00ffff>{@link ve.ComponentDateLength.getInput|getInput}</span>
 * - <span color=00ffff>{@link ve.ComponentDateLength.setInput|setInput}</span>
 *
 * @type {ve.ComponentDateLength}
 */
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
	
	getInput () {
		//Return statement
		return getDateLengthFromFields(this.element);
	}
	
	setInput (arg0_value) {
		//Convert from parameters
		var value = arg0_value;
			if (value == undefined) return;
		
		//Declare local instance variables
		var days_el = this.element.querySelector(`#days-input`);
		var hours_el = this.element.querySelector(`#hours-input`);
		var minutes_el = this.element.querySelector(`#minutes-input`);
		var months_el = this.element.querySelector(`#months-input`);
		var years_el = this.element.querySelector(`#years-input`);
		
		//Set local values from value
		value = convertTimestampToDate(value);
		
		years_el.value = value.year;
		months_el.value = value.month;
		days_el.value = value.day;
		hours_el.value = value.hour;
		minutes_el.value = value.minute;
	}
};

//Initialise functions
{
	/*
    getDateLengthFromFields() - Fetchesa date object from input fields, representing a length of time.
    arg0_date_range_container_el: (HTMLElement) - The container for all the date length fields.

    Returns: (Object, Date)
  */
	function getDateLengthFromFields (arg0_date_range_container_el) {
		//Convert from parameters
		var date_range_container_el = arg0_date_range_container_el;
		
		//Declare local instance variables
		var day_el = date_range_container_el.querySelector(`#days-input`);
		var hour_el = date_range_container_el.querySelector(`#hours-input`);
		var minute_el = date_range_container_el.querySelector(`#minutes-input`);
		var month_el = date_range_container_el.querySelector(`#months-input`);
		var year_el = date_range_container_el.querySelector(`#years-input`);
		
		//Declare local instance variables
		var local_date = {
			year: parseInt(year_el.value),
			month: parseInt(month_el.value),
			day: parseInt(month_el.value),
			
			hour: parseInt(month_el.value),
			minute: parseInt(month_el.value)
		};
		
		//Return statement
		return convertTimestampToDate(getTimestamp(local_date)); //Flatten date
	}
}