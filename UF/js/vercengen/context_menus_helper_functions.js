//Initialise functions
{
  //addParagraphTag() - Adds a paragraph tag when enter key is pressed
  function addParagraphTag (arg0_e) {
    //Convert from parameters
    var e = arg0_e;

    //Check if keyCode was enter
    if (e.keyCode == "13") {
      //Guard clause; Don't add a p tag on list item
      if (window.getSelection().anchorNode.parentNode.tagName == "LI") return;

      //Otherwise, add a p tag
      document.execCommand("formatBlock", false, "p");
    }
  }

  //childOf() - Checks if passed child has passed parent
  function childOf (arg0_child_el, arg1_parent_el) {
    //Convert from parameters
    var child_el = arg0_child_el;
    var parent_el = arg1_parent_el;

    //Return statement
    return parent_el.contains(child_el);
  }

  /**
   * elementDragHandler() - Provides a Window interface without CSS styling for an element. .header refers to the draggable header at the top.
   * @param {HTMLElement} arg0_el
   * @param {Object} [arg1_options]
   *  @param {boolean} [arg1_options.is_resizable=false]
   *
   * @returns {HTMLElement}
   */
  function elementDragHandler (arg0_el, arg1_options) {
    //Convert from parameters
    var el = (typeof arg0_el == 'string') ? document.querySelector(arg0_el) : arg0_el;
    var options = (arg1_options) ? arg1_options : {};

    //Declare local instance variables
    var position_one = 0;
    var position_two = 0;
    var position_three = 0;
    var position_four = 0;
    var is_resizing = false;
    var resize_edge = null;
    var resize_threshold = 5; // pixels from edge to trigger resize
    var initial_width = 0;
    var initial_height = 0;
    var initial_left = 0;
    var initial_top = 0;

    //Add resize handle styles
    el.style.position = 'absolute';
    el.style.resize = 'none'; // disable default resize
    el.style.overflow = 'hidden';

    //Add resize functionality if enabled
    if (options.is_resizable) {
      el.classList.add('resizable');

      //Define handle positions and cursors
      var handle_config = {
        'n': { top: '0', left: '0', right: '0', height: resize_threshold + 'px', cursor: 'n-resize' },
        'e': { top: '0', right: '0', bottom: '0', width: resize_threshold + 'px', cursor: 'e-resize' },
        's': { bottom: '0', left: '0', right: '0', height: resize_threshold + 'px', cursor: 's-resize' },
        'w': { top: '0', left: '0', bottom: '0', width: resize_threshold + 'px', cursor: 'w-resize' },
        'ne': { top: '0', right: '0', width: resize_threshold*2 + 'px', height: resize_threshold*2 + 'px', cursor: 'ne-resize' },
        'nw': { top: '0', left: '0', width: resize_threshold*2 + 'px', height: resize_threshold*2 + 'px', cursor: 'nw-resize' },
        'se': { bottom: '0', right: '0', width: resize_threshold*2 + 'px', height: resize_threshold*2 + 'px', cursor: 'se-resize' },
        'sw': { bottom: '0', left: '0', width: resize_threshold*2 + 'px', height: resize_threshold*2 + 'px', cursor: 'sw-resize' }
      };

      //Add resize handles
      var handles = ['n', 'e', 's', 'w', 'ne', 'nw', 'se', 'sw'];

      for (var i = 0; i < handles.length; i++)
        (function (edge) {
          var handle = document.createElement('div');
          handle.className = 'resize-handle resize-' + edge;
          handle.style.position = 'absolute';
          handle.style.zIndex = '1000';

          //Apply handle configuration
          var config = handle_config[edge];
          for (var prop in config) {
            handle.style[prop] = config[prop];
          }

          el.appendChild(handle);
          handle.onmousedown = function(e) {
            e.stopPropagation();
            is_resizing = true;
            resize_edge = edge; // This 'edge' is correctly scoped thanks to the IIFE.

            //Store initial dimensions
            var rect = el.getBoundingClientRect();
            initial_width = rect.width;
            initial_height = rect.height;
            initial_left = el.offsetLeft;
            initial_top = el.offsetTop;

            internalMouseDownHandler(e);
          };
        })(handles[i]);
    }

    //Header drag handler
    if (el.querySelector('.header')) {
      el.querySelector('.header').onmousedown = internalMouseDownHandler;
    } else {
      el.onmousedown = internalMouseDownHandler;
    }

    //Declare local internal helper functions
    function internalCloseDragElement (e) {
      //Declare local instance variables
      var e = (e || window.event);

      //Stop moving when mouse button is released
      document.onmouseup = null;
      document.onmousemove = null;
      is_resizing = false;
      resize_edge = null;
    }

    function internalElementDrag (e) {
      //Declare local instance variables
      var e = (e || window.event);
      var min_height = 50;
      var min_width = 50;
      var viewport_height = window.innerHeight;
      var viewport_width = window.innerWidth;

      e.preventDefault();

      if (is_resizing && options.is_resizable) {
        var delta_x = e.clientX - position_three;
        var delta_y = e.clientY - position_four;

        //Define resize operations
        var resize_ops = {
          'e': function() {
            let new_width = initial_width + delta_x;
            // Constrain width to not exceed viewport boundary
            new_width = Math.min(new_width, viewport_width - initial_left);
            el.style.width = Math.max(min_width, new_width) + 'px';
          },
          'w': function() {
            let new_width = initial_width - delta_x;
            // Constrain width so the left edge doesn't go past 0
            new_width = Math.min(new_width, initial_left + initial_width);
            new_width = Math.max(min_width, new_width);
            el.style.width = new_width + 'px';
            el.style.left = (initial_left + initial_width - new_width) + 'px';
          },
          's': function() {
            let new_height = initial_height + delta_y;
            // Constrain height to not exceed viewport boundary
            new_height = Math.min(new_height, viewport_height - initial_top);
            el.style.height = Math.max(min_height, new_height) + 'px';
          },
          'n': function() {
            let new_height = initial_height - delta_y;
            // Constrain height so the top edge doesn't go past 0
            new_height = Math.min(new_height, initial_top + initial_height);
            new_height = Math.max(min_height, new_height);
            el.style.height = new_height + 'px';
            el.style.top = (initial_top + initial_height - new_height) + 'px';
          },
          'se': function() {
            resize_ops.s();
            resize_ops.e();
          },
          'sw': function() {
            resize_ops.s();
            resize_ops.w();
          },
          'ne': function() {
            resize_ops.n();
            resize_ops.e();
          },
          'nw': function() {
            resize_ops.n();
            resize_ops.w();
          }
        };

        //Execute resize operation
        if (resize_ops[resize_edge]) {
          resize_ops[resize_edge]();
        }
      } else {
        position_one = position_three - e.clientX;
        position_two = position_four - e.clientY;
        position_three = e.clientX;
        position_four = e.clientY;

        var el_height = el.offsetHeight;
        var el_width = el.offsetWidth;
        var new_left = el.offsetLeft - position_one;
        var new_top = el.offsetTop - position_two;

        new_top = Math.max(0, Math.min(new_top, viewport_height - el_height));
        new_left = Math.max(0, Math.min(new_left, viewport_width - el_width));

        //Set element position
        el.style.top = `${new_top}px`;
        el.style.left = `${new_left}px`;
      }
    }

    function internalMouseDownHandler (e) {
      //Declare local instance variables
      var e = (e || window.event);

      position_three = e.clientX;
      position_four = e.clientY;

      document.onmouseup = internalCloseDragElement;
      document.onmousemove = internalElementDrag;
    }

    //Return statement
    return el;
  }

  function handleSearchSelect (arg0_parent_el) {
    //Convert from parameters
    var parent_el = arg0_parent_el;

    //Declare local instance variables
    var all_a_els = parent_el.querySelectorAll(`a`);
    var input_el = parent_el.querySelector(`#search`);
    
    var filter = input_el.value.toLowerCase();

    //Iterate over all_a_els
    for (var i = 0; i < all_a_els.length; i++) {
      var text_value = all_a_els[i].textContent || all_a_els[i].innerText;

      if (text_value.toLowerCase().indexOf(filter) > -1) {
        all_a_els[i].style.display = "";
      } else {
        all_a_els[i].style.display = "none";
      }
    }
  }

  function parentTagActive (arg0_el) {
    //Convert from parameters
    var element = arg0_el;

    //Guard clause for visual view
    if (!element || !element.classList || element.classList.contains("visual-view"))
      return false;

    //Declare local instance variables
    var tag_name = element.tagName.toLowerCase();
    var text_align = element.style.textAlign;
    var toolbar_button;

    //Active by tag name
    toolbar_button = document.querySelectorAll(`.toolbar .editor-button[data-tag-name="${tag_name}"]`)[0];

    //Active by text-align
    toolbar_button = document.querySelectorAll(`.toolbar .editor-button[data-style="textAlign:${text_align}"]`)[0];

    //Set toolbar_button to being active if toolbar_button is defined
    if (toolbar_button)
      toolbar_button.classList.add("active");

    //Return statement
    return parentTagActive(element.parentNode);
  }

  //pasteEvent() - Handles paste event by removing all HTML tags
  function pasteEvent (arg0_e) {
    //Convert from parameters
    var e = arg0_e;

    //Declare local instance variables
    var text = (e.originalEvent || e).clipboardData.getData("text/plain");

    e.preventDefault();
    document.execCommand("insertHTML", false, text);
  }

  function restoreSelection (arg0_saved_selection) {
    //Convert from parameters
    var saved_selection = arg0_saved_selection;

    //Restore selection
    if (saved_selection)
      if (window.getSelection) {
        selection = window.getSelection();
        selection.removeAllRanges();

        //Populate selection ranges
        for (var i = 0, length = saved_selection.length; i < length; i++)
          selection.addRange(saved_selection[i]);
      } else if (document.selection && saved_selection.select) {
        saved_selection.select();
      }
  }

  function saveSelection () {
    if (window.getSelection) {
      var selection = window.getSelection();

      if (selection.getRangeAt && selection.rangeCount) {
        var ranges = [];

        //Iterate over selection.rangeCount to populate ranges
        for (var i = 0, length = selection.rangeCount; i < length; i++)
          ranges.push(selection.getRangeAt(i));

        //Return statement
        return ranges;
      }
    } else if (document.selection && document.selection.createRange) {
      //Return statement
      return document.selection.createRange();
    }
  }

  function selectionChange (arg0_e, arg1_buttons, arg2_editor) {
    //Convert from parameters
    var e = arg0_e;
    var buttons = arg1_buttons;
    var editor = arg2_editor;

    //Declare local instance variables
    for (var i = 0; i < buttons.length; i++) {
      var local_button = buttons[i];

      //Don't remove active class on code toggle button
      if (local_button.dataset.action == "toggle-view") continue;

      local_button.classList.remove("active");
    }

    try {
      if (!childOf(window.getSelection().anchorNode.parentNode, editor))
        //Return statement; guard clause
        return false;

      parentTagActive(window.getSelection().anchorNode.parentNode);
    } catch {}
  }
}