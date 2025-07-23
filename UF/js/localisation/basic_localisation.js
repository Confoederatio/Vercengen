//General localisation functions
{
  /*
    parseLocalisation() - Parses a localisation into given strings.
    arg0_string: (String) - The string to parse into a given localisation, with {} representing scope variables.
    arg1_options: (Object)
      is_html: (Boolean) - Optional. Whether the localisation to be parsed is HTML. False by default.
      scopes: (Object)
        <variable_key>: (Variable) - The value to replace {<variable>} string keys with.

    Returns: (String)
  */
  function parseLocalisation (arg0_string, arg1_options) {
    //Convert from parameters
    var string = arg0_string;
    var options = (arg1_options) ? arg1_options : {};

    //Iterate over all scopes if they exist
    if (options.scopes) {
      var all_scopes = Object.keys(options.scopes);

      for (var i = 0; i < all_scopes.length; i++) {
        var local_regex = new RegExp(`{${all_scopes[i]}}`, "gm");
        var local_value = options.scopes[all_scopes[i]];

        if (!options.is_html) {
          string = string.replace(local_regex, local_value);
        } else {
          string = string.replace(local_regex, `<span data-key = "${all_scopes[i]}">${local_value}</span>`);
        }
      }
    }

    //Return statement
    return string;
  }

  /*
    parseMilliseconds() - Parses milliseconds into a human-readable time duration.

    Returns: (String)
  */
  function parseMilliseconds (arg0_milliseconds) {
    //Convert from parameters
    var duration = arg0_milliseconds;

    //Declare local instance variables
  	var milliseconds = parseInt((duration % 1000) / 100),
  	seconds = Math.floor((duration / 1000) % 60),
  	minutes = Math.floor((duration / (1000 * 60)) % 60),
  	hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  	return `${(hours > 0) ? parseNumber(hours) + " hours" : ""}${(minutes > 0) ? ((hours > 0) ? ", " : "") + parseNumber(minutes) + " minutes" : ""}${(seconds > 0) ? ((minutes > 0) ? ", " : "") + parseNumber(seconds) + " seconds" : ""}`;
  }

  /*
    parseNumber() - Formats a number to a string whilst displaying decimal separators (e.g. 1.567,23 instead of 1567.23).
    arg0_number: (Number) - The number to parse.
    arg1_options: (Object)
      display_float: true/false, - Whether or not to display a number to the hundreths place
      display_prefix: true/false - Whether or not to display a starting prefix

    Returns: (String)
  */
  function parseNumber (arg0_number, arg1_options) {
    //Convert from parameters
    var number = arg0_number;
    var options = (arg1_options) ? arg1_options : {};

    return (
      (options.display_prefix) ?
        (number > 0) ? "+" : ""
      : ""
    ) + Intl.NumberFormat('de').format(
      (typeof number == "number") ?
          (options.display_float) ?
            parseInt(number*100*100)/100/100 :
            parseInt(number) :
        parseInt(number)
    );
  }

  /*
    parseString() - Parses a debug string into human-readable text.
    arg0_string: (String) - The string to parse.

    Returns: (String)
  */
  function parseString (arg0_string) {
    var processed_string = arg0_string;

    return processed_string.split("_").join(" ").replace(/(^| )(\w)/g, s => s.toUpperCase());
  }

  /*
    printPercentage() - Formats a string to fit a certain percentage (e.g. 23%), instead of a default decimal number.
    arg0_number: (Number) - The number to format into a percentage.
    arg1_options: (Object)
      base_zero: true/false - Whether to start at a base zero instead of one
      display_float: true/false, - Whether or not to display a number to the hundreths place
      display_prefix: true/false - Whether or not to display a starting prefix
      is_modifier: true/false - Used for parsing negative modifiers

    Returns: (String)
  */
  function printPercentage (arg0_number, arg1_options) {
    //Convert from parameters
    var number = arg0_number;
    var options = (arg1_options) ? arg1_options : {};

  	//Initialise options
    if (options.base_one)
      number--;

  	//Declare local instance variables
  	var number_string = `${(!options.display_float) ? Math.round(number*100) : Math.round(number*100*100)/100}`;

    //Return statement
    return `${(options.display_prefix) ? (
      (number > 1 && !options.base_zero) ||
      (number > 0 && options.base_zero)
    ) ? "+" : "" : ""}${number_string}%`;
  }

  /*
    printRange() - Returns a given range of numbers as a string using [min, max] format.
    arg0_array: (Array<Number, Number>) - The range to input.

    Returns: (String)
  */
  function printRange (arg0_array) {
    //Convert from parameters
    var array = arg0_array;

    //Return statement
    return (array[0] == array[1]) ?
      parseNumber(array[0]) :
      `${parseNumber(Math.min(array[0], array[1]))} - ${parseNumber(Math.max(array[0], array[1]))}`;
  }
  
  
  
  /*
    parseVariableString() - Parses a variable string and returns its resolved value.
    arg0_string: (String) - The string which to resolve.
    arg1_options: (Object)
      <key>: (Variable)
      regex_replace: (Object)
        <key>: (Variable)

    Returns: (Variable)
  */
  function parseVariableString (arg0_string, arg1_options) { //[WIP] - Something here is wrong as it returns HTMLElement in some cases.
    //Convert from parameters
    var string = JSON.parse(JSON.stringify(arg0_string));
    var options = (arg1_options) ? arg1_options : {};
    
    //Initialise options
    if (!options.regex_replace) options.regex_replace = {};
    if (!options.regex_replace.BRUSH_OBJ) options.regex_replace.BRUSH_OBJ = "main.brush";
    if (!options.regex_replace.MAIN_OBJ) options.regex_replace.MAIN_OBJ = "global.main";
    
    //'hierarchies' handler
    var group_id = main.brush.selected_group_id;
    
    if (group_id) {
      var group_el = getGroupElement(group_id);
      var group_obj = getGroup("hierarchy", group_id);
      
      //Set FROM object
      if (!options.FROM)
        options.FROM = {
          current_group: group_obj,
          group_el: group_el,
          group_id: group_id,
          group_obj: group_obj
        };
    }
    
    //Declare local instance variables
    var all_option_keys = getAllObjectKeys(options, { include_parent_keys: true });
    
    //Destructure all keys in options such that they are locally available for eval to use
    for (var i = 0; i < all_option_keys.length; i++) {
      var local_split_key = all_option_keys[i].split(".");
      var local_value = getObjectKey(options, all_option_keys[i]);
      
      //Destructure local object first
      if (local_split_key.length > 1) {
        var define_string = [];
        
        for (var x = 0; x < local_split_key.length - 1; x++)
          if (x == 0) {
            define_string.push(`if (${local_split_key[0]} == undefined) var ${local_split_key[0]} = {};`);
          } else {
            var local_join_key = [];
            
            for (var y = 0; y < x + 1; y++)
              local_join_key.push(local_split_key[y]);
            local_join_key = local_join_key.join(".");
            
            define_string.push(`if (${local_join_key} == undefined) ${local_join_key} = {};`);
          }
        
        eval(define_string.join(""));
      } else {
        eval(`var ${all_option_keys[i]} = local_value;`);
      }
    }
    
    //console.log("parseVariableString()", all_option_keys);
    var evaluated_string;
    try {
      //Iterate over options.regex_replace
      var all_regex_replace_keys = Object.keys(options.regex_replace);
      
      for (var i = 0; i < all_regex_replace_keys.length; i++) {
        var local_value = options.regex_replace[all_regex_replace_keys[i]];
        var local_regexp = new RegExp(all_regex_replace_keys[i], "gm");
        
        try {
          string = string.replace(local_regexp, local_value);
        } catch {}
      }
      
      evaluated_string = eval(string);
    } catch (e) {
      if (!options.ignore_errors) {
        console.log("Options:", options);
        console.log("String:", string);
        console.log(e);
      }
      evaluated_string = string;
    }
    
    //Handle HTMLElement types
    if (isElement(evaluated_string))
      if (evaluated_string.getAttribute("type") == "checkbox") {
        //Return statement
        return evaluated_string.checked;
      } else {
        //Return statemenbt
        return evaluated_string.value;
      }
    
    //Return statement
    return evaluated_string;
  }
}
