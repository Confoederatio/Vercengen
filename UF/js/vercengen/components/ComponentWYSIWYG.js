ve.ComponentWYSIWYG = class {
	constructor (arg0_options) {
		//Convert from parameters
		this.options = (arg0_options) ? arg0_options : {};

		//Declare local instance variables
		this.element = document.createElement("span");
		var html_string = [];
		var options = this.options;

		//Div header
		if (options.name)
			html_string.push(`<div class = "header">${options.name}</div>`);

		html_string.push(`<div id = "wysiwyg-editor" class = "wysiwyg-editor">`);
			//Editor toolbar
			{
				html_string.push(`<div class = "toolbar">`);
					//FIRST LINE
					html_string.push(`<div class = "line">`);

					//First box: Bold, Italic, Underline, Strikethrough
					html_string.push(`<div class = "box">`);
						//Bold
						html_string.push(`<span class = "editor-button icon small" data-action = "bold" data-tag-name = "b" title = "Bold"><img src = "https://img.icons8.com/fluency-systems-filled/48/000000/bold.png"></span>`);
						//Italic
						html_string.push(`<span class = "editor-button icon small" data-action = "italic" data-tag-name = "i" title = "Italic"><img src = "https://img.icons8.com/fluency-systems-filled/48/000000/italic.png"></span>`);
						//Underline
						html_string.push(`<span class = "editor-button icon small" data-action = "underline" data-tag-name = "u" title = "Underline"><img src = "https://img.icons8.com/fluency-systems-filled/48/000000/underline.png"></span>`);
						//Strikethrough
						html_string.push(`<span class = "editor-button icon small" data-action = "strikeThrough" data-tag-name = "strike" title = "Strikethrough"><img src = "https://img.icons8.com/fluency-systems-filled/30/000000/strikethrough.png"></span>`);
					html_string.push(`</div>`);

					//Second box: Alignment, Lists, Indents, Hr
					html_string.push(`<div class = "box">`);
						html_string.push(`<span class = "editor-button icon has-submenu">`);
							//Menu icon
							html_string.push(`<img src = "https://img.icons8.com/fluency-systems-filled/48/000000/align-left.png">`);

							//1. Submenu
							html_string.push(`<div class = "submenu">`);
								//Align left
								html_string.push(`<span class = "editor-button icon" data-action = "justifyLeft" data-style = "textAlign:left" title = "Align Left"><img src = "https://img.icons8.com/fluency-systems-filled/48/000000/align-left.png"></span>`);
								//Align centre
								html_string.push(`<span class = "editor-button icon" data-action = "justifyCenter" data-style = "textAlign:center" title = "Align Centre"><img src = "https://img.icons8.com/fluency-systems-filled/48/000000/align-center.png"></span>`);
								//Align right
								html_string.push(`<span class = "editor-button icon" data-action = "justifyRight" data-style = "textAlign:right" title = "Align Right"><img src = "https://img.icons8.com/fluency-systems-filled/48/000000/align-right.png"></span>`);
								//Align justify
								html_string.push(`<span class = "editor-button icon" data-action = "formatBlock" data-style = "textAlign:justify" title = "Justify"><img src = "https://img.icons8.com/fluency-systems-filled/48/000000/align-justify.png"></span>`);
							html_string.push(`</div>`);
						html_string.push(`</span>`);

						//Insert ordered list
						html_string.push(`<span class = "editor-button icon" data-action = "insertOrderedList" data-tag-name = "ol" title = "Insert ordered list"><img src = "https://img.icons8.com/fluency-systems-filled/48/000000/numbered-list.png"></span>`);
						//Insert unordered list
						html_string.push(`<span class = "editor-button icon" data-action = "insertUnorderedList" data-tag-name = "ul" title = "Insert unordered list"><img src = "https://img.icons8.com/fluency-systems-filled/48/000000/bulleted-list.png"></span>`);
						//Indent
						html_string.push(`<span class = "editor-button icon" data-action = "indent" title = "Indent"><img src = "https://img.icons8.com/fluency-systems-filled/48/000000/indent.png"></span>`);
						//Outdent
						html_string.push(`<span class = "editor-button icon" data-action = "outdent" title = "Outdent" data-required-tag = "li"><img src = "https://img.icons8.com/fluency-systems-filled/48/000000/outdent.png"></span>`);
					html_string.push(`</div>`);

				html_string.push(`</div>`);

				//SECOND LINE
				html_string.push(`<div class = "line">`);

					//Third box: Undo, clear formatting
					html_string.push(`<div class = "box">`);
						//Undo
						html_string.push(`<span class = "editor-button icon small" data-action = "undo" title = "Undo"><img src = "https://img.icons8.com/fluency-systems-filled/48/000000/undo--v1.png"></span>`);
						//Remove formatting
						html_string.push(`<span class = "editor-button icon small" data-action = "removeFormat" title = "Remove format"><img src = "https://img.icons8.com/fluency-systems-filled/48/000000/remove-format.png"></span>`);
					html_string.push(`</div>`);

					//Fourth box: Add link, remove link
					html_string.push(`<div class = "box">`);
						//Insert Link
						html_string.push(`<span class = "editor-button icon small" data-action = "createLink" title = "Insert Link"><img src = "https://img.icons8.com/fluency-systems-filled/48/000000/add-link.png"></span>`);
						//Unlink
						html_string.push(`<span class = "editor-button icon small" data-action = "unlink" data-tag-name = "a" title = "Unlink"><img src = "https://img.icons8.com/fluency-systems-filled/48/000000/delete-link.png"></span>`);
					html_string.push(`</div>`);

					//Fifth box: Show HTML
					html_string.push(`<div class = "box">`);
						//Show HTML code
						html_string.push(`<span class = "editor-button icon" data-action = "toggle-view" title = "Show HTML Code"><img src = "https://img.icons8.com/fluency-systems-filled/48/000000/source-code.png"></span>`);
					html_string.push(`</div>`);
				html_string.push(`</div>`);
			html_string.push(`</div>`);
		}

			//Content area
			html_string.push(`<div class = "content-area">`);
				html_string.push(`<div class = "visual-view" contenteditable></div>`);
				html_string.push(`<textarea class = "html-view"></textarea>`);
			html_string.push(`</div>`);

			//Modal for hyperlinks
			html_string.push(`<div class = "modal">`);
				html_string.push(`<div class = "modal-bg"></div>`);
				html_string.push(`<div class = "modal-wrapper">`);
					html_string.push(`<div class = "close">x</div>`);
					html_string.push(`<div class = "modal-content" id = "modal-create-link">`);
						html_string.push(`<h3>Insert Link</h3>`);
						html_string.push(`<input type = "text" id = "link-value" placeholder = "Link (example: https://google.com/)">`);
						html_string.push(`<div class = "row">`);
							html_string.push(`<input type = "checkbox" id = "new-tab"`);
							html_string.push(`<label for = "new-tab">Open in New Tab?</label>`);
						html_string.push(`</div>`);
						html_string.push(`<button class = "done">Done</button>`);
					html_string.push(`</div>`);
				html_string.push(`</div>`);
			html_string.push(`</div>`);
		html_string.push(`</div>`);

		//Set .innerHTML
		this.element.innerHTML = html_string.join("");
		this.handleWYSIWYG();
		
		this.handleEvents();
	}

	getInput () {
		//Return statement
		return this.getWYSIWYGFromFields(this.element);
	}

	setInput (arg0_string) {
		//Convert from parameters
		var string = (arg0_string) ? arg0_string : "";

		//Set element .html-view, .visual-view content
		this.element.querySelector(`.html-view`).value = string;
		this.element.querySelector(`.visual-view`).innerHTML = string;
	}

	//Internal helper functions
	getWYSIWYGFromFields (arg0_wysiwyg_el) {
		//Convert from parameters
		var wysiwyg_el = arg0_wysiwyg_el;

		//Declare local instance variables
		var html_content_el = wysiwyg_el.querySelector(`.html-view`);
		var visual_content_el = wysiwyg_el.querySelector(`.visual-view`);

		//Return statement
		return (html_content_el.innerHTML.length > visual_content_el.innerHTML.length) ?
			html_content_el.innerHTML : visual_content_el.innerHTML;
	}
	
	handleEvents () {
		//Declare local instance variables
		if (this.options.onchange) {
			var editor_el = this.element.querySelector(`.wysiwyg-editor`);
			var html_view_el = this.element.querySelector(`.html-view`);
			var visual_view_el = this.element.querySelector(`.visual-view`);
			
			//Add change handlers
			html_view_el.addEventListener("input", () => {
				var event = new Event("change");
					event.component = this;
					event.target = html_view_el;
					event.value = html_view_el.innerHTML;
					
				this.options.onchange(event);
			});
			visual_view_el.addEventListener("input", () => {
				var event = new Event("change");
					event.component = this;
					event.target = visual_view_el;
					event.value = visual_view_el.innerHTML;
				
				this.options.onchange(event);
			});
		}
	}

	handleWYSIWYG () {
		this.initWYSIWYG();
		
		//Add .onchange handler if specified
		if (this.options && this.options.onchange) {
			var editor = this.element.querySelector('.wysiwyg-editor');
			var html_view = editor.querySelector('.html-view');
			var visual_view = editor.querySelector('.visual-view');

			//Add change handlers for both views
			visual_view.addEventListener("input", () => {
				var event = new Event("change");
				event.target = visual_view;
				event.value = visual_view.innerHTML;
				this.options.onchange(event);
			});

			html_view.addEventListener("input", () => {
				var event = new Event("change");
				event.target = html_view;
				event.value = html_view.value;
				this.options.onchange(event);
			});
		}
	}
	
	initWYSIWYG () {
		//Declare local instance variables
		var editor = this.element.querySelector(`.wysiwyg-editor`);
		var modal = editor.getElementsByClassName("modal")[0];
		var toolbar = editor.getElementsByClassName("toolbar")[0];
		
		var buttons = toolbar.querySelectorAll(`.editor-button:not(.has-submenu)`);
		var content_area = editor.getElementsByClassName("content-area")[0];
		var visual_view = content_area.getElementsByClassName(`visual-view`)[0];
		
		var html_view = content_area.getElementsByClassName(`html-view`)[0];
		
		//Add active tag event
		document.addEventListener("selectionchange", function (e) {
			selectionChange(e, buttons, editor);
		});
		
		//Add paste event
		visual_view.addEventListener("paste", pasteEvent);
		
		//Add paragraph tag on newline
		content_area.addEventListener("keypress", addParagraphTag);
		
		//Add toolbar button actions
		for (var i = 0; i < buttons.length; i++) {
			var local_button = buttons[i];
			
			local_button.addEventListener("click", function (e) {
				var action = this.dataset.action;
				
				//execCommand handler
				switch (action) {
					case "toggle-view":
						execCodeAction(this, editor, visual_view, html_view);
						break;
					case "createLink":
						execLinkAction(modal);
						break;
					default:
						execDefaultAction(action);
				}
			});
		}
	}
};

//Initialise functions
{
	function execCodeAction (arg0_button_el, arg1_editor_el, arg2_visual_view_el, arg3_html_view_el) {
		//Convert from parameters
		var button_el = arg0_button_el;
		var editor_el = arg1_editor_el;
		var visual_view = arg2_visual_view_el;
		var html_view = arg3_html_view_el;
		
		//Toggle visual/HTML view depending on current state
		if (button_el.classList.contains("active")) { //Show visual view
			visual_view.innerHTML = html_view.innerHTML = html_view.value;
			html_view.style.display = "none";
			visual_view.style.display = "block";
			
			button_el.classList.remove("active");
		} else { //Show HTML view
			html_view.innerText = visual_view.innerHTML;
			visual_view.style.display = "none";
			html_view.style.display = "block";
			
			button_el.classList.add("active");
		}
	}
	
	function execDefaultAction (arg0_action) {
		//Convert from parameters
		var action = arg0_action;
		
		//Invoke execCommand
		document.execCommand(action, false);
	}
	
	function execLinkAction (arg0_modal_el) {
		//Convert from parameters
		var modal = arg0_modal_el;
		
		//Declare local instance variables
		var close = modal.querySelectorAll(".close")[0];
		var selection = saveSelection();
		var submit = modal.querySelectorAll("button.done")[0];
		
		//Set modal to visible
		modal.style.display = "block";
		
		//Add link once done button is active
		submit.addEventListener("click", function (e) {
			e.preventDefault();
			
			var new_tab_checkbox = modal.querySelectorAll(`#new-tab`)[0];
			var link_input = modal.querySelectorAll(`#link-value`)[0];
			var link_value = link_input.value;
			var new_tab = new_tab_checkbox.checked;
			
			//Restore selection
			restoreSelection(selection);
			
			//Handle selection
			if (window.getSelection().toString()) {
				var local_a = document.createElement("a");
				
				local_a.href = link_value;
				if (new_tab)
					local_a.target = "_blank";
				window.getSelection().getRangeAt(0).surroundContents(local_a);
			}
			
			//Hide modal, deregister modal events
			modal.style.display = "none";
			link_input.value = "";
			
			submit.removeEventListener("click", arguments.callee);
			close.removeEventListener("click", arguments.callee);
		});
		
		//Close modal on close button click
		close.addEventListener("click", function (e) {
			e.preventDefault();
			
			var link_input = modal.querySelectorAll("#link-value")[0];
			
			//Hide modal, deregister modal events
			modal.style.display = "none";
			link_input.value = "";
			
			submit.removeEventListener("click", arguments.callee);
			close.removeEventListener("click", arguments.callee);
		});
	}
}