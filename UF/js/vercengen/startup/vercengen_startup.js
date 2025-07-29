//Import Node.js libraries
var fs = require("fs");
var path = require("path");

//Initialise functions
{
	if (!global.ve) global.ve = {};
	
	/**
	 * Returns all non-evaluated files in a folder, so long as an evaluated set is provided.
	 *
	 * @param {string} arg0_folder_path
	 * @param {Set<string>} arg1_evaluated_set
	 *
	 * @returns {Array<string>}
	 */
	ve.getFilesInFolder = function (arg0_folder_path, arg1_evaluated_set) {
		//Convert from parameters
		var folder_path = arg0_folder_path;
		var evaluated_set = arg1_evaluated_set;
		
		//Declare local instance variables
		var file_list = fs.readdirSync(folder_path, { withFileTypes: true });
		var return_files = [];
		
		//Iterate over all entries in file_list
		for (var local_file_entry of file_list) {
			var full_path = path.join(folder_path, local_file_entry.name);
			
			if (evaluated_set.has(full_path)) continue;
				evaluated_set.add(full_path);
				
			//Recursively import files from directories
			if (local_file_entry.isDirectory()) {
				return_files = return_files.concat(ve.getFilesInFolder(full_path, evaluated_set));
			} else {
				return_files.push(full_path);
			}
		}
		
		//Return statement
		return return_files;
	};
	
	/**
	 * Returns an Array<String> from a list of patterns, including exclusionary patterns (!), wildcards (*), and folders/file paths, both absolute and relative.
	 *
	 * @param {Array<string>} arg0_patterns
	 *
	 * @returns {Array<string>}
	 */
	ve.getImportFiles = function (arg0_patterns) {
		//Convert from parameters
		var patterns = arg0_patterns;
		
		//Declare local instance variables
		var base_directory = process.cwd();
		var excluded = new Set();
		var evaluated = new Set();
		var included = [];
		
		//Iterate over all patterns
		for (let local_pattern of patterns) {
			var files = [];
			var is_exclusion = false;
			
			//1. Exclusion handling
			if (local_pattern.startsWith("!")) {
				is_exclusion = true;
				local_pattern = local_pattern.slice(1);
			}
			
			//2. Wildcard handling
			if (local_pattern.includes("*")) {
				files = ve.getWildcardsInFolder(base_directory, local_pattern);
			} else {
				//3. Non-wildcard handling
				var absolute_path = path.resolve(base_directory, local_pattern);
				
				if (fs.existsSync(absolute_path)) {
					if (fs.statSync(absolute_path).isDirectory()) {
						files = ve.getFilesInFolder(absolute_path, evaluated);
					} else {
						if (!evaluated.has(absolute_path)) {
							files = [absolute_path];
							evaluated.add(absolute_path);
						}
					}
				} else {
					console.error(`File does not exist: ${absolute_path}`);
				}
			}
			
			//4. Pattern processing
			if (is_exclusion) {
				files.forEach((f) => excluded.add(f));
			} else {
				files.forEach((f) => {
					if (!excluded.has(f) && !included.includes(f))
						included.push(f);
				});
			}
		}
		
		//Return statement
		return included;
	};
	
	/**
	 * Returns the absolute file paths of all wildcards within a given folder.
	 *
	 * @param {string} arg0_folder_path
	 * @param {Array<string>} arg1_wildcard_pattern
	 *
	 * @returns {Array<string>}
	 */
	ve.getWildcardsInFolder = function (arg0_folder_path, arg1_wildcard_pattern) {
		//Convert from parameters
		var folder_path = arg0_folder_path;
		var wildcard_pattern = arg1_wildcard_pattern;
		
		//Declare local instance variables
		var base = path.basename(wildcard_pattern);
		var directory = path.dirname(wildcard_pattern);
		
		//Non-wildcard resolution
		if (!base.includes("*")) {
			//No wildcard, simply return if the file exists
			var absolute_path = path.resolve(folder_path, wildcard_pattern);
			
			//Return statement
			if (fs.existsSync(absolute_path) && fs.statSync(absolute_path).isFile())
				return [absolute_path];
			if (fs.existsSync(absolute_path) && fs.statSync(absolute_path).isDirectory())
				return ve.getFilesInFolder(absolute_path, new Set());
			return [];
		}
		
		//Wildcard: match files in the directory
		var absolute_dir = path.resolve(folder_path, directory);
		
		//Return statement
		if (!fs.existsSync(absolute_dir) || !fs.statSync(absolute_dir).isDirectory())
			return [];
		
		//Return regex wildcard; return statement
		var regex = new RegExp("^" +
			base.replace(/\./g, "\\.")
				.replace(/\*/g, ".*") + "$"
		);
		
		return fs.readdirSync(absolute_dir)
			.filter((f) => regex.test(f))
			.map((f) => path.join(absolute_dir, f))
			.filter((f) => fs.statSync(f).isFile());
	};
	
	/**
	 * Initialises a Vercengen app, alongside necessary UF imports.
	 *
	 * arg0_options: {@link Object}
	 * - `.do_not_import_UF`: {@link boolean} - Whether to refuse UF imports unrelated to Vercengen startup functions.
	 * - `.load_files`: {@link Array}<{@link string}> - The sequence of files to load. `!` should be used as an exclusion prefix, whilst `*` functions as a wildcard pattern.
	 * - `.is_browser=true`: {@link boolean} - Whether the imports are for the Browser/Electron. Imports are assumed to be eval/Node.js otherwise.
	 * - `.is_node=false`: {@link boolean} - Whether the imports are for Node.js. Overridden by `.is_browser`. Inputs are assumed to be for eval if false.
	 * - `.special_function`: {@link function} - The function to execute upon startup and Vercengen initialisation.
	 *
	 * @returns Array<string>
	 */
	ve.start = function (arg0_options) { //[WIP] - Move Browser/Node/Eval selection to `.mode` optioning.
		//Convert from parameters
		var options = (arg0_options) ? arg0_options : {};
		
		//Initialise options
		if (options.is_browser == undefined) options.is_browser = true;
		if (options.load_files == undefined) options.load_files = [];
		
		//Declare local instance variables
		var load_patterns = (!options.do_not_import_UF) ? [
			"UF/js/vercengen/(vercengen_initialisation).js",
			"UF"
		] : [];
			load_patterns = load_patterns.concat(options.load_files);
		
		var load_files = ve.getImportFiles(load_patterns);
		
		console.log(`[VERCENGEN] Importing ${load_files.length} files.`);
		
		//1. Handle browser <link>/<script> tags
		if (options.is_browser) {
			for (var i = 0; i < load_files.length; i++) {
				var local_file_extension = path.extname(load_files[i]);
				var local_file_path = load_files[i];
				
				if (local_file_extension == ".css") {
					var link_el = document.createElement("link");
						link_el.setAttribute("rel", "stylesheet");
						link_el.setAttribute("type", "text/css");
						
						link_el.setAttribute("href", local_file_path);
					document.head.appendChild(link_el);
				}
				if (local_file_extension == ".js") {
					var script_el = document.createElement("script");
						script_el.setAttribute("type", "text/javascript");
						script_el.setAttribute("src", local_file_path);
					document.body.appendChild(script_el);
				}
			}
		}
		
		//2. Handle eval/Node.js require tags
		if (!options.is_browser) {
			for (var i = 0; i < load_files.length; i++) {
				var local_file_extension = path.extname(load_files[i]);
				var local_file_path = load_files[i];
				
				if (local_file_extension == ".js")
					if (options.is_node) {
						const local_library = require(local_file_path);
						
						//Destructure Node.js objects into global
						for (var [key, value] of Object.entries(local_library)) {
							if (global[key]) {
								console.error(`${key} is already a defined function namespace; ${local_file_path} is attempting an override. The present function is as follows:`, global[key]);
								continue;
							}
							global[key] = value;
						}
					} else {
						eval(fs.readFileSync(local_file_path, "utf8"));
					}
			}
		}
		
		//Initialise ve after import
		global.initialise_ve_loop = setInterval(function(){
			try {
				ve.initialise();
				clearInterval(global.initialise_ve_loop);
				
				if (options.special_function)
					options.special_function();
			} catch (e) {}
		}, 100);
		
		//Return statement
		return load_files;
	};
}