//Initialise functions
{
  /**
   * autoFillInput() - Auto-fills inputs for a given element based on parseVariableString() and their context menu .placeholder object.
   * @param {Object} [arg0_options]
   *  @param {HTMLElement} [arg0_options.element] - The direct element object for which to fill in an input for
   *  @param {Object|String} [arg0_options.placeholder] - The variable to use as the placeholder
   *  @param {string} [arg0_options.type] - The type of input the element represents
   *  @param {Object} [arg0_options.value] - The local value for the given context menu object element
   */
  function autoFillInput (arg0_options) { //[WIP] - Rework autoFillInput() to use parseVariableString() for all inputs
    //Convert from parameters
    var options = (arg0_options) ? arg0_options : {};

    //Initalise options
    if (!options.value) options.value = {};

    //Guard clause if options.placeholder doesn't exist
    if (options.placeholder == undefined) return undefined;

    //Declare local instance variables
    var placeholder_obj = JSON.parse(JSON.stringify(options.placeholder));

    //Parse placeholder_obj
    if (typeof placeholder_obj == "object") {
      var all_placeholder_keys = Object.keys(options.placeholder);

      for (var i = 0; i < all_placeholder_keys.length; i++) {
        var local_placeholder = placeholder_obj[all_placeholder_keys[i]];
        var local_placeholder_string = JSON.parse(JSON.stringify(local_placeholder));

        if (local_placeholder != undefined)
          placeholder_obj[all_placeholder_keys[i]] = (options.value.value_equation) ?
            parseVariableString(options.value.value_equation, { VALUE: parseVariableString(local_placeholder) }) :
            parseVariableString(local_placeholder, { ignore_errors: true });
      }

      if (all_placeholder_keys.length == 1 && placeholder_obj.VALUE != undefined)
        placeholder_obj = placeholder_obj.VALUE;
    }

    //Modify name_label_el
    var name_data_el = options.element.querySelector(`data#name-label`);
    var name_label_el = options.element.querySelector(`span#name-label`);

    if (name_data_el && name_label_el)
      name_label_el.innerHTML = parseLocalisation(name_data_el.innerHTML, {
        is_html: true,
        scopes: { VALUE: placeholder_obj }
      });
    
    options.element.instance.fill(placeholder_obj);
  }
}