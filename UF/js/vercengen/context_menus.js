//Initialise functions
{
  //Requires: html2canvas

  /**
   * createContextMenuIndex() - Creates a context menu indexing framework.
   * @param [arg0_options]
   *  @param {String} [arg0_options.config_key] - The main config key where action categories are stored, i.e. 'group_actions'.
   *  @param {String} [arg0_options.namespace] - The namespace in which to define global-level functions belonging to this index, i.e. 'GroupActions'.
   */
  function createContextMenuIndex (arg0_options) {
    //Convert from parameters
    var options = (arg0_options) ? arg0_options : {};

    //Declare local instance variables
    config[`flattened_${options.config_key}`] = dumbFlattenObject(config[options.config_key]);
    if (!config.defines.common[`reserved_${options.config_key}`])
      config.defines.common[`reserved_${options.config_key}`] = [];

    global[`getAll${options.namespace}s`] = function (arg0_options) {
      //Convert from parameters
      var local_options = (arg0_options) ? arg0_options : {};

      //Declare local instance variables
      var common_defines = config.defines.common;
      var flattened_namespace = config[`flattened_${options.config_key}`];
      var return_namespace = [];
      var return_keys = [];

      //Iterate over all_flattened_namespace
      var all_flattened_namespace = Object.keys(flattened_namespace);

      for (var i = 0; i < all_flattened_namespace.length; i++)
        if (!common_defines[`reserved_${options.config_key}`].includes(all_flattened_namespace[i])) {
          return_namespace.push(flattened_namespace[all_flattened_namespace[i]]);
          return_keys.push(all_flattened_namespace[i]);
        }

      //Return statement
      return (!local_options.return_keys) ? return_namespace : return_keys;
    };

    global[`get${options.namespace}`] = function (arg0_name, arg1_options) {
      //Convert from parameters
      var name = arg0_name;
      var local_options = (arg1_options) ? arg1_options : {};

      //Guard clause for objects; direct keys
      if (typeof name == "object") return name;
      if (config[`flattened_${options.config_key}`][name]) return (!local_options.return_key) ? config[`flattened_${options.config_key}`][name] : name;

      //Declare local instance variables
      var namespace_exists = [false, ""]; //[namespace_exists, namespace_key];
      var search_name = name.toLowerCase().trim();

      //ID search - soft search 1st, hard search 2nd
      {
        //Iterate over config[`all_${options.config_key}`]
        for (var i = 0; i < config[`all_${options.config_key}`].length; i++) {
          var local_value = config[`all_${options.config_key}`][i];

          if (local_value.id.toLowerCase().includes(search_name))
            namespace_exists = [true, local_value.key];
        }
        for (var i = 0; i < config[`all_${options.config_key}`].length; i++) {
          var local_value = config[`all_${options.config_key}`][i];

          if (local_value.id.toLowerCase() == search_name)
            namespace_exists = [true, local_value.key];
        }
      }

      //Name search - soft search 1st, hard search 2nd
      {
        //Iterate over config[`all_${options.config_key}`]
        for (var i = 0; i < config[`all_${options.config_key}`].length; i++) {
          var local_value = config[`all_${options.config_key}`][i];

          if (local_value.name)
            if (local_value.name.toLowerCase().includes(search_name))
              namespace_exists = [true, local_value.key];
        }
        for (var i = 0; i < config[`all_${options.config_key}`].length; i++) {
          var local_value = config[`all_${options.config_key}`][i];

          if (local_value.name)
            if (local_value.name.toLowerCase() == search_name)
              namespace_exists = [true, local_value.key];
        }
      }

      //Return statement
      if (namespace_exists[0])
        return (!local_options.return_key) ? config[`flattened_${options.config_key}`][namespace_exists[1]] : namespace_exists[1];
    };

    global[`get${options.namespace}sAtOrder`] = function (arg0_options) {
      //Convert from parameters
      var local_options = (arg0_options) ? arg0_options : {};

      //Declare local instance variables
      var flattened_namespace = config[`flattened_${options.config_key}`];
      var order = (local_options.order != undefined) ? local_options.order : 1;
      var return_namespaces = [];
      var return_keys = [];
      var return_obj = {};

      //Iterate over all_flattened_namespace
      var all_flattened_namespace = Object.keys(flattened_namespace);

      for (var i = 0; i < all_flattened_namespace.length; i++) {
        var local_namespace = flattened_namespace[all_flattened_namespace[i]];

        if (local_namespace.order == order) {
          return_namespaces.push(local_namespace);
          return_keys.push(all_flattened_namespace[i]);
        }
      }

      //local_options.return_object handler
      if (local_options.return_object) {
        for (var i = 0; i < return_namespaces.length; i++)
          return_obj[return_keys[i]] = return_namespaces[i];
        //Return statement
        return return_obj;
      }

      //Return statement
      return (!local_options.return_key) ? return_namespaces : return_keys;
    };

    global[`get${options.namespace}sCategory`] = function (arg0_name, arg1_options) {
      //Convert from parameters
      var name = arg0_name;
      var local_options = (arg1_options) ? arg1_options : {};

      //Guard clause for objects; direct keys
      if (typeof name == "object") return name;
      if (config[local_options.config_key][name]) return (!local_options.return_key) ? config[local_options.config_key][name] : name;

      //Declare local instance variables
      var all_namespaces = Object.keys(config[local_options.config_key]);
      var namespace_exists = [false, ""]; //[namespace_exists, namespace_key];
      var search_name = name.toLowerCase().trim();

      //ID search - soft search 1st, hard search 2nd
      {
        //Iterate over all_namespaces
        for (var i = 0; i < all_namespaces.length; i++) {
          var local_value = config[local_options.config_key][all_namespaces[i]];

          if (local_value.id.toLowerCase().includes(search_name))
            namespace_exists = [true, all_namespaces[i]];
        }
        for (var i = 0; i < all_namespaces.length; i++) {
          var local_value = config[local_options.config_key][all_namespaces[i]];

          if (local_value.id.toLowerCase() == search_name)
            namespace_exists = [true, all_namespaces[i]];
        }
      }

      //Name search - soft search 1st, hard search 2nd
      {
        //Iterate over all_namespaces
        for (var i = 0; i < all_namespaces.length; i++) {
          var local_value = config[local_options.config_key][all_namespaces[i]];

          if (local_value.name)
            if (local_value.name.toLowerCase().includes(search_name))
              namespace_exists = [true, all_namespaces[i]];
        }
        for (var i = 0; i < all_namespaces.length; i++) {
          var local_value = config[local_options.config_key][all_namespaces[i]];

          if (local_value.name)
            if (local_value.name.toLowerCase() == search_name)
              namespace_exists = [true, all_namespaces[i]];
        }
      }

      //Return statement
      if (namespace_exists[0])
        return (!local_options.return_key) ? config[local_options.config_key][namespace_exists[1]] : namespace_exists[1];
    };

    global[`get${options.namespace}sInput`] = function (arg0_namespace_id, arg1_input_id) {
      //Convert from parameters
      var namespace_id = arg0_namespace_id;
      var input_id = arg1_input_id;

      //Declare local instance variables
      var namespace_obj = global[`get${options.namespace}`](namespace_id);

      if (namespace_obj)
        if (namespace_obj.interface) {
          //Guard clause if citing direct key
          if (namespace_obj.interface[input_id]) return namespace_obj.interface[input_id];

          //Iterate over all_inputs
          var all_inputs = Object.keys(namespace_obj.interface);

          for (var i = 0; i < all_inputs.length; i++) {
            var local_input = namespace_obj.interface[all_inputs[i]];

            if (!Array.isArray(local_input) && typeof local_input == "object")
              if (local_input.id == input_id)
                //Return statement
                return local_input;
          }
        }
    };

    global[`get${options.namespace}sLowestOrder`] = function () {
      //Declare local instance variables
      var flattened_namespace = config[`flattened_${options.config_key}`];
      var min_order = Infinity;

      //Iterate over all_flattened_namespace
      var all_flattened_namespace = Object.keys(flattened_namespace);

      for (var i = 0; i < all_flattened_namespace.length; i++) {
        var local_namespace = flattened_namespace[all_flattened_namespace[i]];

        if (local_namespace.order != undefined)
          min_order = Math.min(min_order, local_namespace.order);
      }

      //Return statement
      return min_order;
    };

    global[`get${options.namespace}sNavigationObject`] = function () {
      //Declare local instance variables
      var flattened_namespace = config[`flattened_${options.config_key}`];
      var lowest_order = global[`get${options.namespace}sLowestOrder`]();
      var navigation_obj = global[`get${options.namespace}sAtOrder`]({ order: lowest_order, return_object: true });

      //Return statement
      return (navigation_obj.navigation_ui) ? navigation_obj.navigation_ui : navigation_obj;
    };

    //Initialise config variables
    config[`all_${options.config_key}`] = global[`getAll${options.namespace}s`]();
    config[`all_${options.config_key}_keys`] = global[`getAll${options.namespace}s`]({ return_keys: true });
    config[`${options.config_key}_lowest_order`] = global[`get${options.namespace}sLowestOrder`]();
  }

  /**
   * createContextMenuInterface() - Creates a context menu interface framework. Note here that only the navigation menu is unique.
   * @param [arg0_options]
   *  @param {String} [arg0_options.anchor]
   *  @param {String} [arg0_options.class=""]
   *  @param {String} [arg0_options.config_key]
   *  @param {String} [arg0_options.interface_key=arg0_options.config_key]
   *  @param {String} [arg0_options.left_margin] - The CSS calc attribute to prepend when calculating offset margins.
   *  @param {String} [arg0_options.limit_key="<entity_id>"] - Limit key if applicable, used for parseLimit(), i.e. '<entity_id>'
   *  @param {String} [arg0_options.right_margin] - The CSS calc attribute to prepend when calculating offset margins.
   *  @param {String} [arg0_options.namespace]
   *  @param {String} [arg0_options.navigation_mode="list"] - Either 'icons'/'list'/'list_icons'. Brush actions: 'icons', Entity actions: 'list_icons', Entity keyframes: 'list', Group actions: 'list'
   *  @param {String} [arg0_options.type="default"] - Either 'default'/'entity'/'group'
   */
  function createContextMenuInterface (arg0_options) {
    //Convert from parameters
    var options = (arg0_options) ? arg0_options : {};

    //Initialise options
    if (!options.class) options.class = "";
    if (!options.interface_key) options.interface_key = options.config_key;
    if (!options.left_margin) options.left_margin = "";
    if (!options.limit_key) options.limit_key = "entity_id";
    if (!options.navigation_mode) options.navigation_mode = "list";
    if (!options.right_margin) options.right_margin = "";
    if (!options.type) options.type = "default";

    /**
     * close<namespace>ContextMenu() - Closes entity actions context menus for a specific order.
     * @param {number} arg0_order
     * @param {Object} [arg1_options]
     */
    global[`close${options.namespace}ContextMenu`] = function (arg0_order, arg1_options) {
      //Convert from parameters
      var order = returnSafeNumber(arg0_order, 1);
      var local_options = (arg1_options) ? arg1_options : {};

      //Declare local instance variables
      var namespace_anchor_el = global[`get${options.namespace}sAnchorElement`](local_options);

      //Fetch local namespace context menu and close it
      var namespace_el = namespace_anchor_el.querySelector(`[order="${order}"]`);
      namespace_el.remove();
      global[`refresh${options.namespace}sContextMenus`](local_options);
    };

    global[`close${options.namespace}ContextMenus`] = function (arg0_options) {
      //Convert from parameters
      var local_options = (arg0_options) ? arg0_options : {};

      //Declare local instance variables
      var namespace_anchor_selector = global[`get${options.namespace}sAnchorElement`]({ ...local_options, return_selector: true });

      //Fetch local namespace context menus and close all of them
      var namespace_els = document.querySelectorAll(`${namespace_anchor_selector} > .context-menu`);

      //Iterate over all namespace_els
      for (var i = 0; i < namespace_els.length; i++)
        namespace_els[i].remove();
    };

    global[`close${options.namespace}LastContextMenu`] = function (arg0_options) {
      //Convert from parameters
      var local_options = (arg0_options) ? arg0_options : {};

      //Declare local instance variables
      var namespace_open_orders = global[`get${options.namespace}OpenOrders`](local_options);

      //Close last namespace context menu
      global[`close${options.namespace}ContextMenu`](namespace_open_orders[namespace_open_orders.length - 1], local_options);
    };

    global[`get${options.namespace}sAnchorElement`] = function (arg0_options) {
      //Convert from parameters
      var local_options = (arg0_options) ? arg0_options : {};

      //Declare local instance variables
      var common_selectors = config.defines.common.selectors;

      if (options.type == "default") {
        var namespace_anchor_el = document.querySelector(options.anchor);

        //Return statement
        return (!local_options.return_selector) ?
          namespace_anchor_el :
          options.anchor;
      } else if (options.type == "entity") {
        var entity_el = getEntityElement(local_options.entity_id);

        var entity_anchor_el = entity_el.querySelector(options.anchor);
        var entity_selector = `${common_selectors.entity_ui}[class*=" ${local_options.entity_id}"]`;

        //Return statement
        return (!local_options.return_selector) ?
          entity_anchor_el :
          `${entity_selector} ${options.anchor}`;
      } else if (options.type == "group") {
        var group_el = getGroupElement(local_options.group_id);

        var group_anchor_el;
          try { group_anchor_el = group_el.querySelector(options.anchor); }
          catch { group_anchor_el = document.querySelector(options.anchor); }
        var group_selector = `${common_selectors.group_ui}[data-id="${local_options.group_id}"]`;

        //Return statement
        return (!local_options.return_selector) ?
          group_anchor_el :
          `${group_selector} ${options.anchor}`;
      }
    };

    global[`get${options.namespace}sOpenOrders`] = function () {
      //Declare local instance variables
      var namespace_anchor_selector = global[`get${options.namespace}sAnchorElement`]({ return_selector: true });
      var namespace_els = document.querySelectorAll(`${namespace_anchor_selector} > .context-menu`);
      var unique_orders = [];

      //Iterate over all namespace_els
      for (var i = 0; i < namespace_els.length; i++) {
        var local_order = namespace_els[i].getAttribute("order");

        if (local_order != undefined) {
          local_order = parseInt(local_order);
          if (!unique_orders.includes(local_order))
            unique_orders.push(local_order);
        }
      }

      //Return statement
      return unique_orders;
    };

    global[`get${options.namespace}sInputObject`] = function (arg0_options) {
      //Convert from parameters
      var local_options = (arg0_options) ? arg0_options : {};

      //Declare local instance variables
      var namespace_anchor_el = global[`get${options.namespace}sAnchorElement`](local_options);
      var inputs_obj = {};

      //Iterate over all_context_menu_els
      var all_context_menu_els = namespace_anchor_el.querySelectorAll(".context-menu");

      for (var i = 0; i < all_context_menu_els.length; i++)
        inputs_obj = dumbMergeObjects(inputs_obj, ve.getInputsAsObject(all_context_menu_els[i]));

      //Return statement
      return inputs_obj;
    };

    global[`print${options.namespace}sContextMenu`] = function (arg0_namespace_obj, arg1_options) { //[WIP] - Finish function body
      //Convert from parameters
      var namespace_obj = arg0_namespace_obj;
      var local_options = (arg1_options) ? arg1_options : {};

      //Declare local instance variables
      var common_selectors = config.defines.common.selectors;
      var context_menu_el = document.createElement("div");

      if (options.type == "default") {
        //Initialise interfaces[options.interface_key] if it doesn't exist
        if (!global.interfaces[options.interface_key]) global.interfaces[options.interface_key] = {
          id: options.interface_key,
          options: {}
        };

        //Refresh namespace context menus first; then append the current context menu
        var context_menu_ui = {};

        //Parse given .interface from namespace_obj if applicable
        if (namespace_obj.interface) {
          var all_local_options = Object.keys(local_options);
          var namespace_anchor_el = global[`get${options.namespace}sAnchorElement`]();
          var namespace_anchor_selector = global[`get${options.namespace}sAnchorElement`]({ return_selector: true });
          var namespace_order = (namespace_obj.order != undefined) ? namespace_obj.order : 1;
          var lowest_order = config[`${options.config_key}_lowest_order`];

          //Initialise options
          if (namespace_order == lowest_order)
            for (let i = 0; i < all_local_options.length; i++) {
              var local_value = local_options[all_local_options[i]];

              if (local_value != undefined)
                namespace_anchor_el.setAttribute(all_local_options[i], local_value);
            }

          //Delete given order if already extant
          if (namespace_anchor_el.querySelector(`[order="${namespace_order}"]`))
            global[`close${options.namespace}ContextMenu`](namespace_order, local_options);

          //Append dummy context menu div first for context_menu_ui to append to
          context_menu_el.setAttribute("class", global.ve.default_class + ` scaffold`);
          context_menu_el.id = namespace_obj.id;
          context_menu_el.setAttribute("order", namespace_order);
          namespace_anchor_el.appendChild(context_menu_el);

          //Initialise context_menu_ui options
          context_menu_ui.anchor = `${namespace_anchor_selector} .context-menu#${namespace_obj.id}`;
          if (namespace_obj.class) context_menu_ui.class = namespace_obj.class;
          if (namespace_obj.name) context_menu_ui.name = namespace_obj.name;
          if (namespace_obj.maximum_height) context_menu_ui.maximum_height = namespace_obj.maximum_height;
          if (namespace_obj.maximum_width) context_menu_ui.maximum_width = namespace_obj.maximum_width;

          //Initialise preliminary context menu first
          var new_interface = JSON.parse(JSON.stringify(namespace_obj.interface));
          new_interface.anchor = context_menu_ui.anchor;
          new_interface.close_function = `close${options.namespace}ContextMenu(${namespace_order}); refresh${options.namespace}sContextMenus();`;

          var context_menu_ui = new ve.Interface(new_interface);
          global[`refresh${options.namespace}sContextMenus`](local_options);

          //Iterate over all_interface_keys and parse them correctly
          var all_interface_keys = Object.keys(namespace_obj.interface);

          for (let i = 0; i < all_interface_keys.length; i++) {
            let local_value = namespace_obj.interface[all_interface_keys[i]];

            if (!Array.isArray(local_value) && typeof local_value == "object") {
              let local_element = document.querySelector(`${options.anchor} #${local_value.id}`);
              if (!local_value.id) local_value.id = all_interface_keys[i];

              //Type handlers: set placeholders where applicable
              ve.Component.setValue({
                element: local_element,
                type: local_value.type,
                placeholder: local_value.placeholder,
                value: local_value
              });

              //Parse .effect to .onclick event handler
              if (local_value.effect || local_value.value_equation)
                local_element.onclick = function (e) {
                  var local_input = getInput(this);

                  //Fetch local_actual_value based on local_value.value_equation
                  var local_actual_value = (local_value.value_equation) ?
                    parseVariableString(local_value.value_equation, { VALUE: parseFloat(local_input) }) : parseFloat(local_input);

                  if (local_value.value_equation)
                    this.instance.setInput(local_actual_value);

                  parseEffect(undefined, local_value.effect, { timestamp: local_options.timestamp, ui_type: options.namespace });

                  //Range post-handler
                  if (local_value.type == "range") {
                    var range_el = this.querySelector(`input[type="range"]`);
                    range_el.value = parseFloat(local_input);
                  }
                };
            }
          }
        }
      } else if (options.type == "entity") {
        var entity_obj = getEntity(local_options.entity_id);

        //Initialise interfaces[options.interface_key] if it doesn't exist
        if (!global.interfaces[options.interface_key]) global.interfaces[options.interface_key] = {
          id: options.interface_key,
          entity_obj: entity_obj,
          options: {}
        };

        //Refresh entity context menus first; then append the current context menu
        var context_menu_ui = {};

        //Parse given .interface from namespace_obj if applicable
        if (namespace_obj.interface) {
          var entity_el = getEntityElement(local_options.entity_id);

          //Check to make sure namespace_obj is not of the lowest order
          if (namespace_obj.order != lowest_order)
            if (namespace_obj.interface) {
              var all_local_options = Object.keys(local_options);
              var entity_anchor_el = global[`get${options.namespace}sAnchorElement`](local_options);
              var entity_el = getEntityElement(local_options.entity_id);
              var entity_order = (namespace_obj.order != undefined) ? namespace_obj.order : 1;
              var entity_selector = getEntityElement(local_options.entity_id, { return_selector: true });
              var lowest_order = config[`${options.config_key}_lowest_order`];

              //Initialise options
              if (entity_order == lowest_order)
                for (let i = 0; i < all_local_options.length; i++) {
                  var local_value = local_options[all_local_options[i]];

                  if (local_value != undefined)
                    entity_anchor_el.setAttribute(all_local_options[i], local_value);
                }

              //Delete given order if already extant
              if (entity_el.querySelector(`${options.anchor} [order="${entity_order}"]`))
                global[`close${options.namespace}ContextMenu`](entity_order, { entity_id: local_options.entity_id });

              //Append dummy context menu div first for context_menu_ui to append to
              context_menu_el.setAttribute("class", global.ve.default_class);
              context_menu_el.id = namespace_obj.id;
              context_menu_el.setAttribute("order", entity_order);
              entity_anchor_el.appendChild(context_menu_el);

              //Initialise context_menu_ui options
              context_menu_ui.anchor = `${entity_selector} ${options.anchor} .context-menu#${namespace_obj.id}`;
              if (namespace_obj.class) context_menu_ui.class = namespace_obj.class;
              if (namespace_obj.name) context_menu_ui.name = namespace_obj.name;
              if (namespace_obj.maximum_height) context_menu_ui.maximum_height = namespace_obj.maximum_height;
              if (namespace_obj.maximum_width) context_menu_ui.maximum_width = namespace_obj.maximum_width;

              //Initialise preliminary context menu first
              var new_interface = JSON.parse(JSON.stringify(namespace_obj.interface));
              new_interface.anchor = context_menu_ui.anchor;
              new_interface.close_function = `close${options.namespace}ContextMenu(${entity_order}, { entity_id: '${local_options.entity_id}' }); refresh${options.namespace}sContextMenus({ entity_id: '${local_options.entity_id}' });`;

              var context_menu_ui = new ve.Interface(new_interface);
              global[`refresh${options.namespace}sContextMenus`](local_options);

              //Iterate over all_interface_keys and parse them correctly
              var all_interface_keys = Object.keys(namespace_obj.interface);

              for (let i = 0; i < all_interface_keys.length; i++) {
                let local_value = namespace_obj.interface[all_interface_keys[i]];

                if (!Array.isArray(local_value) && typeof local_value == "object") {
                  let local_element = document.querySelector(`${entity_selector} ${options.anchor} #${local_value.id}`);
                  if (!local_value.id) local_value.id = all_interface_keys[i];

                  //Type handlers: set placeholders where applicable
                  ve.Component.setValue({
                    element: local_element,
                    type: local_value.type,
                    placeholder: local_value.placeholder,
                    value: local_value
                  });

                  if (local_value.placeholder) { //[WIP] - Finish section body
                    var placeholder_dictionary = {};

                    //Merge local_options.options and entity_anchor_el attributes into placeholder_dictionary
                    var entity_anchor_attributes = entity_anchor_el.attributes;

                    for (let x = 0; x < entity_anchor_attributes.length; x++)
                      placeholder_dictionary[entity_anchor_attributes[x].name] = entity_anchor_attributes[x].value;
                    placeholder_dictionary = dumbMergeObjects(placeholder_dictionary, local_options.options);

                    local_element.instance.setInput(placeholder_dictionary[local_value.placeholder]);
                  }

                  //Parse .effect to .onclick event handler
                  if (local_value.effect)
                    local_element.onclick = function (e) {
                      var local_input = getInput(this, { entity_id: local_options.entity_id });

                      //Fetch local_actual_value based on local_value.value_equation
                      var local_actual_value = (local_value.value_equation) ?
                        parseVariableString(local_value.value_equation, { VALUE: parseFloat(local_input) }) : parseFloat(local_input);

                      if (local_value.value_equation)
                        this.instance.setInput(local_actual_value);
                      parseEffect(local_options.entity_id, local_value.effect, {
                        timestamp: local_options.timestamp,
                        ui_type: options.config_key
                      });

                      //Range post-handler
                      if (local_value.type == "range") {
                        var range_el = this.querySelector(`input[type="range"]`);
                        range_el.value = parseFloat(local_input);
                      }
                    }
                }
              }
            }
        }
      } else if (options.type == "group") {
        var group_obj = getGroup("hierarchy", local_options.group_id);

        //Initialise interfaces[local_options.group_id] if it doesn't exist
        if (!global.interfaces[local_options.group_id]) global.interfaces[local_options.group_id] = {
          id: local_options.group_id,
          group_obj: group_obj,
          options: {}
        };

        //Refresh group context menus first; then append the current context menu
        var context_menu_ui = {};

        //Parse given .interface from namespace_obj if applicable
        if (namespace_obj.interface) {
          var all_local_options = Object.keys(local_options);
          var group_el = getGroupElement(local_options.group_id);
          var group_anchor_el = global[`get${options.namespace}sAnchorElement`](local_options);
          var group_anchor_selector = global[`get${options.namespace}sAnchorElement`]({ return_selector: true, ...local_options });
          var group_order = (namespace_obj.order != undefined) ? namespace_obj.order : 1;
          var group_selector = getGroupElement(local_options.group_id, { return_selector: true });
          var lowest_order = config[`${options.config_key}_lowest_order`];

          //Initialise options
          if (group_order == lowest_order)
            for (let i = 0; i < all_local_options.length; i++) {
              var local_value = local_options[all_local_options[i]];

              if (local_value != undefined)
                group_anchor_el.setAttribute(all_local_options[i], local_value);
            }

          //Append dummy context menu div first for context_menu_ui to append to
          context_menu_el.setAttribute("class", global.ve.default_class);
          context_menu_el.id = namespace_obj.id;
          context_menu_el.setAttribute("order", group_order);
          group_anchor_el.appendChild(context_menu_el);

          //Initialise context_menu_ui options
          context_menu_ui.anchor = `${group_anchor_selector} .context-menu#${namespace_obj.id}`;
          if (namespace_obj.class) context_menu_ui.class = namespace_obj.class;
          if (namespace_obj.name) context_menu_ui.name = namespace_obj.name;
          if (namespace_obj.maximum_height) context_menu_ui.maximum_height = namespace_obj.maximum_height;
          if (namespace_obj.maximum_width) context_menu_ui.maximum_width = namespace_obj.maximum_width;

          //Initialise preliminary context menu first
          if (namespace_obj.interface) {
            var new_interface = JSON.parse(JSON.stringify(namespace_obj.interface));
            new_interface.anchor = context_menu_ui.anchor;
            new_interface.close_function = `close${options.namespace}ContextMenu(${group_order}, { group_id: '${local_options.group_id}' }); refresh${options.namespace}sContextMenus({ group_id: '${local_options.group_id}' });`;

            var context_menu_ui = new ve.Interface(new_interface);
            global[`refresh${options.namespace}sContextMenus`](local_options);
          }

          //Iterate over all_interface_keys and parse them correctly
          var all_interface_keys = Object.keys(namespace_obj.interface);

          for (let i = 0; i < all_interface_keys.length; i++) {
            let local_value = namespace_obj.interface[all_interface_keys[i]];

            if (!Array.isArray(local_value) && typeof local_value == "object") {
              let local_element = document.querySelector(`${group_anchor_selector} #${local_value.id}`);
              if (!local_value.id) local_value.id = all_interface_keys[i];

              //Type handlers: set placeholders where applicable
              ve.Component.setValue({
                element: local_element,
                type: local_value.type,
                placeholder: local_value.placeholder,
                value: local_value
              });

              //Special Group Handling
              if (local_value.attributes)
                if (local_value.attributes.global_key == "GROUP_OBJ.mask_select") {
                  var all_mask_types_keys = Object.keys(config.mask_types);
                  var all_option_els = [];
                  var local_select_el = local_element.querySelector("select");

                  for (var x = 0; x < all_mask_types_keys.length; x++) {
                    var local_mask = config.mask_types[all_mask_types_keys[x]];
                    var local_option_el = document.createElement("option");

                    local_option_el.setAttribute("value", all_mask_types_keys[x]);
                    local_option_el.innerHTML = (local_mask.name) ? local_mask.name : all_mask_types_keys[x];

                    //Push local_option_el into current all_option_els
                    all_option_els.push(local_option_el);
                  }

                  //Set local_element
                  local_select_el.innerHTML = "";
                  for (var x = 0; x < all_option_els.length; x++)
                    local_select_el.appendChild(all_option_els[x]);

                  //Set actual placeholder
                  var current_group_mask = getGroupMask(group_obj.id);

                  if (current_group_mask) {
                    local_select_el.value = current_group_mask;
                  } else {
                    local_select_el.value = "clear";
                  }
                }

              //Parse .effect to .onclick event handler
              if (local_value.effect)
                local_element.onclick = function (e) {
                  var local_input_obj = global[`get${options.namespace}sInputObject`](local_options);

                  parseEffect(local_options.group_id, local_value.effect, { ...local_input_obj, ui_type: options.config_key });
                };
            }
          }
        }
      }
    };

    global[`print${options.namespace}sNavigationMenu`] = function (arg0_parent_el, arg1_options) {
      //Convert from parameters
      var parent_el = arg0_parent_el;
      var local_options = (arg1_options) ? arg1_options : {};

      //Declare local instance variables
      var current_timestamp = getTimestamp(main.date);
      var namespace_anchor_el = global[`get${options.namespace}sAnchorElement`](local_options);
      var namespace_anchor_selector = global[`get${options.namespace}sAnchorElement`]({
        ...local_options,
        return_selector: true
      });
      var namespace_navigation_obj = global[`get${options.namespace}sNavigationObject`](local_options);

      //Iterate over all_namespace_keys
      var all_namespace_keys = Object.keys(namespace_navigation_obj);

      if (options.navigation_mode == "icons") {
        //Iterate over all_namespace_keys; add them as images or abbreviations (if no icon is available)
        for (var i = 0; i < all_namespace_keys.length; i++) {
          let local_namespace_obj = namespace_navigation_obj[all_namespace_keys[i]];

          if (!Array.isArray(local_namespace_obj) && typeof local_namespace_obj == "object")
            if (local_namespace_obj.effect) {
              var local_namespace_class;
              if (local_namespace_obj.attributes)
                if (local_namespace_obj.attributes.class)
                  local_namespace_class = local_namespace_obj.attributes.class;

              var local_class = `${options.class}${(local_namespace_class) ? " " + local_namespace_class : ""}`;
              var local_element;
              var local_id = all_namespace_keys[i];
              var limit_fulfilled = true;
              var limits_fulfilled = {};

              //Add local_action to namespace_anchor_el
              if (local_namespace_obj.icon) {
                var local_img = document.createElement("img");

                local_img.setAttribute("class", local_class);
                local_img.setAttribute("id", local_id);
                local_img.setAttribute("src", local_namespace_obj.icon);

                //Add local_img to namespace_anchor_el
                local_element = local_img;
              } else {
                var local_initials = "";
                var local_span = document.createElement("span");
                var local_split_string = local_namespace_obj.name.split(" ");

                for (var x = 0; x < local_split_string.length; x++)
                  local_initials += local_split_string[x][0];

                local_span.setAttribute("class", local_class);
                local_span.setAttribute("id", local_id);
                local_span.innerHTML = local_initials;

                //Add local_span to namespace_anchor_el
                local_element = local_span;
              }

              //Set .limit, .effect functionality
              //.limit handler
              {
                if (local_namespace_obj.limit)
                  limit_fulfilled = parseLimit(undefined, local_namespace_obj.limit, {
                    timestamp: current_timestamp,
                    ui_type: options.config_key
                  });

                if (limit_fulfilled) {
                  //Add element if limit_fulfilled
                  namespace_anchor_el.appendChild(local_element);
                  limits_fulfilled[all_namespace_keys[i]] = limit_fulfilled;
                }
              }

              //.effect handler
              {
                if (limits_fulfilled[all_namespace_keys[i]])
                  if (local_namespace_obj.effect) {
                    let button_el = local_element;

                    local_element.onclick = function (e) {
                      parseEffect(undefined, local_namespace_obj.effect, { ...local_options, timestamp: current_timestamp, ui_type: options.config_key });
                    };
                  }
              }

              //Set tooltip
              if (local_namespace_obj.name)
                tippy(`${namespace_anchor_selector} #${local_id}`, {
                  content: local_namespace_obj.name,
                  arrow: false
                });
            }
        }
      } else if (options.navigation_mode == "list") {
        var parent_offset = 0;
        var top_string = "";

        if (local_options.scroll_selector) {
          var scroll_selector_el = (typeof local_options.scroll_selector == "string") ?
            document.querySelector(local_options.scroll_selector) : local_options.scroll_selector;

          parent_offset = getY(parent_el, scroll_selector_el);
          top_string = `calc(${scroll_selector_el.offsetTop}px + ${parent_offset}px)`;
        }
        if (local_options.y)
          top_string = `calc(${local_options.y}px)`;

        //Create local context menu
        if (top_string)
          namespace_anchor_el.style.top = top_string;

        //Iterate over all_local_options keys
        var all_local_options = Object.keys(local_options);

        for (var i = 0; i < all_local_options.length; i++) {
          var local_value = local_options[all_local_options[i]];

          if (local_value != undefined)
            namespace_anchor_el.setAttribute(all_local_options[i], local_value);
        }

        global[`print${options.namespace}sContextMenu`](namespace_navigation_obj, local_options);
      } else if (options.navigation_mode == "list_icons") {
        var formatted_navigation_obj = {
          anchor: (local_options.anchor) ? local_options.anchor : namespace_anchor_selector,
          class: options.class
        };
        var limits_fulfilled = {};

        //Iterate over all_namespace_keys; add them as list icons
        for (var i = 0; i < all_namespace_keys.length; i++) {
          let local_namespace_obj = namespace_navigation_obj[all_namespace_keys[i]];

          if (!Array.isArray(local_namespace_obj) && typeof local_namespace_obj == "object") {
            //Check if .limit is fulfilled
            if (local_namespace_obj.limit) {
              limit_fulfilled = parseLimit(local_options[options.limit_key], local_namespace_obj.limit, {
                timestamp: current_timestamp,
                ui_type: options.config_key
              });
            } else {
              limit_fulfilled = true;
            }

            if (limit_fulfilled) {
              //Define default parameters for element
              formatted_navigation_obj[all_namespace_keys[i]] = {
                id: all_namespace_keys[i],
                type: "button"
              };
              var local_context_obj = formatted_navigation_obj[all_namespace_keys[i]];

              //Add element if limit_fulfilled
              local_context_obj = dumbMergeObjects(local_context_obj, local_namespace_obj);
              limits_fulfilled[all_namespace_keys[i]] = limit_fulfilled;
            }
          }
        }

        //formatted_navigation_obj now contains the correct new ve.Interface() options; assign to namespace_selector
        formatted_navigation_obj.do_not_append = true;

        //Delete current .innerHTML
        var context_menu_el = new ve.Interface(formatted_navigation_obj);

        //Iterate over all_namespace_keys
        for (var i = 0; i < all_namespace_keys.length; i++) {
          let local_value = namespace_navigation_obj[all_namespace_keys[i]];

          //Make sure limits are fulfilled firs tbefore parsing onclick
          if (limits_fulfilled[all_namespace_keys[i]])
            if (local_value.effect) {
              let button_el = context_menu_el.querySelector(`div[type="button"][id="${all_namespace_keys[i]}"]`);

              try {
                if (button_el)
                  button_el.onclick = function (e) {
                    parseEffect(local_options[options.limit_key], local_value.effect, { ...local_options, timestamp: current_timestamp, ui_type: options.config_key });
                  };
              } catch (e) {
                console.warn(e);
              }
            }
        }
      }
    };

    global[`refresh${options.namespace}sContextMenus`] = function (arg0_options) {
      //Convert from parameters
      var local_options = (arg0_options) ? arg0_options : {};

      //Declare local instance variables
      var lowest_order = global[`get${options.namespace}sLowestOrder`]();
      var namespace_anchor_el = global[`get${options.namespace}sAnchorElement`](local_options);
      var namespace_anchor_selector = global[`get${options.namespace}sAnchorElement`]({
        ...local_options,
        return_selector: true
      });
      var namespace_context_menus = namespace_anchor_el.querySelectorAll(`${namespace_anchor_selector} > .context-menu`);
      var namespace_context_width = 0; //Measured in px

      //Iterate over namespace_context_menus; fetch current namespace context menu width. Set current width
      namespace_context_menus = sortElements(namespace_context_menus, { attribute: "order" });

      for (var i = 0; i < namespace_context_menus.length; i++) {
        let local_order = namespace_context_menus[i].getAttribute("order");

        if (local_order == undefined) continue;

        //Set current position; track namespace_context_width
        namespace_context_menus[i].style.position = "absolute";
        namespace_context_menus[i].style.left = `${namespace_context_width}px`;

        if (namespace_context_menus[i].getAttribute("order") != lowest_order)
          if (options.right_margin) {
            namespace_context_menus[i].style.right = `calc(${options.right_margin} + ${namespace_context_width}px)`;
          } else {
            namespace_context_menus[i].style.left = `calc(${options.left_margin} + ${namespace_context_width}px)`;
          }

        namespace_context_width += namespace_context_menus[i].offsetWidth + 8;
      }

      //Update context menu inputs
      global[`refresh${options.namespace}sContextMenuInputs`](local_options);

      //Return statement
      return namespace_context_width;
    };

    global[`refresh${options.namespace}sContextMenuInputs`] = function (arg0_options) {
      //Convert from parameters
      var local_options = (arg0_options) ? arg0_options : {};

      //Declare local instance variables
      var namespace_anchor_el = global[`get${options.namespace}sAnchorElement`](local_options);
      var namespace_anchor_selector = global[`get${options.namespace}sAnchorElement`]({
        ...local_options,
        return_selector: true
      });
      var namespace_context_menus = namespace_anchor_el.querySelectorAll(`${namespace_anchor_selector} > .context-menu`);

      //Placeholder handlers
      //Iterate over all namespace_context_menus; fetch their IDs and update their inputs based on placeholders
      for (var i = 0; i < namespace_context_menus.length; i++) {
        var namespace_obj = config[`flattened_${options.config_key}`][namespace_context_menus[i].id];
        var input_obj = ve.getInputsAsObject(namespace_context_menus[i], local_options);

        if (namespace_obj)
          if (namespace_obj.interface) {
            var all_interface_keys = Object.keys(namespace_obj.interface);

            //Iterate over all_interface_keys to fill out inputs if placeholder exists
            for (var x = 0; x < all_interface_keys.length; x++) {
              var local_value = namespace_obj.interface[all_interface_keys[x]];

              //Make sure local_value.placeholder is a valid field before filling it in
              var local_input_el = namespace_context_menus[i].querySelector(`#${local_value.id}`);
              if (local_value.placeholder)
                local_input_el.instance.setInput((input_obj[local_value.placeholder]) ?
                  input_obj[local_value.placeholder] : local_value.placeholder);
            }
          }
      }
    };
  }
}