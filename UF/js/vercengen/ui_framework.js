//Initialise functions
{
  /**
   * createSection() - Creates a foldable element that can be minimised/expanded.
   * @param {Object} [arg0_options]
   *  @param {String} [arg0_options.expand_class="uf-expanded"] - The class to add when the section is expanded.
   *  @param {String} [arg0_options.minimise_class="uf-minimised"] - The class to add when the section is collapsed.
   *  @param {String} [arg0_options.selector] - The selector of the elements that can be minimised/expanded. Note that the first element covered by the selector will have the chevron controller.
   *  @param {String} [arg0_options.selector_class="uf-chevron minimise"] - The class to add to the chevron controller.
   *  @param {String} [arg0_options.src="./UF/gfx/chevron_icon.png"] - The source of the chevron image.
   *  @param {Boolean} [arg0_options.is_collapsed=false] - Whether the section should start in a collapsed state.
   */
  function createSection (arg0_options) {
    //Convert from parameters
    var options = (arg0_options) ? arg0_options : {};

    //Initialise options
    if (!options.expand_class) options.expand_class = "uf-expanded";
    if (!options.minimise_class) options.minimise_class = "uf-minimised";
    if (!options.selector) options.selector = "";
    if (!options.selector_class) options.selector_class = "uf-chevron minimise";
    if (!options.src) options.src = "./UF/gfx/chevron_icon.png";
    if (options.is_collapsed === undefined) options.is_collapsed = false;

    //Declare local instance variables
    var all_collapsible_els = document.querySelectorAll(options.selector);

    //Set chevron image on first collapsible el
    var chevron_btn = document.createElement("img");
      chevron_btn.setAttribute("class", options.selector_class);
      chevron_btn.setAttribute("draggable", false);
      chevron_btn.src = options.src;

    //Add chevron to first element if it exists
    if (all_collapsible_els.length > 0) {
      var first_el = all_collapsible_els[0];
      first_el.appendChild(chevron_btn, first_el.firstChild);
    }

    //Set initial state if collapsed
    if (options.is_collapsed && all_collapsible_els.length > 1) {
      for (var i = 1; i < all_collapsible_els.length; i++) {
        var el = all_collapsible_els[i];
        el.classList.remove(options.expand_class);
        el.classList.add(options.minimise_class);
      }
      chevron_btn.style.transform = "rotate(0deg)";
    }

    //Add click handler to toggle section
    chevron_btn.addEventListener("click", function(e) {
      e.preventDefault();
      e.stopPropagation();

      //Toggle classes on all collapsible elements
      if (all_collapsible_els.length > 1)
        for (var i = 1; i < all_collapsible_els.length; i++) {
          var el = all_collapsible_els[i];
          
          if (!el.classList.contains(options.minimise_class)) {
            el.classList.remove(options.expand_class);
            el.classList.add(options.minimise_class);
          } else {
            el.classList.remove(options.minimise_class);
            el.classList.add(options.expand_class);
          }
        }

      //Toggle chevron rotation
      if (chevron_btn.style.transform === "rotate(180deg)") {
        chevron_btn.style.transform = "rotate(0deg)";
      } else {
        chevron_btn.style.transform = "rotate(180deg)";
      }
    });

    //Return the chevron button for external control if needed
    return chevron_btn;
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
}