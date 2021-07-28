
	function common () {

		return {

			run_complex_selector_arr: function ( complex_selector_arr, exec ) {

				var element = null;

				for ( var i = 0; i < complex_selector_arr.length; i++ ) {

					var element_arr = exec( "fb_manager", "run_complex_selector", complex_selector_arr[ i ] );

					if ( element_arr && element_arr.length > 0 ) {

						return element_arr[ 0 ];

					};

				};

				return null;

			},

			run_complex_selector: ( selector, exec ) => {

				// init root_element

					if ( selector.root_element ) {

						var root_element = selector.root_element;

					} else if ( selector.root_css ) {

						var root_element = document.querySelector( selector.root_css );

						if ( !root_element ) {

							root_element = document;

						};

					} else {

						var root_element = document;

					};

					exec( "log", "write_exec", "root_element", root_element );

				// init element_arr

					if ( selector.css ) {

						var element_arr = Array.from( root_element.querySelectorAll( selector.css ) );

					} else {

						var element_arr = Array.from( root_element.querySelectorAll( "*" ) );

					};

					exec( "log", "write_exec", "element_arr", element_arr );

				// filter by inner_text

					if ( selector.inner_text ) {

						for ( var i = element_arr.length; i--; ) {

							if ( element_arr[ i ].innerText !== selector.inner_text ) {

								element_arr.splice( i, 1 );

							};

						};

					};

				// filter by style

					if ( selector.style ) {

						var key_arr = Object.keys( selector.style );
						var style = null;

						loop_1: for ( var i = element_arr.length; i--; ) {

							style = window.getComputedStyle( element_arr[ i ] );

							loop_2: for ( var j = key_arr.length; j--; ) {

								if ( selector.style[ key_arr[ j ] ] !== style[ key_arr[ j ] ] ) {

									element_arr.splice( i, 1 );
									continue loop_1;

								};

							};

						};

					};

				// return

					return element_arr;

			},

			query_computed_style: () => {

			},

			fetch_json: async ( url, data ) => {

				var response = await fetch( url, data  );
				var json = await response.json();

				return { response, json };

			},

			fetch_text: async ( url ) => {

				var response = await fetch( url );
				var text = await response.text();

				return text;

			},

			get_intersection: ( arr_1, arr_2 ) => {

				var intersection = [];

				for ( var i = arr_1.length; i--; ) {

					if ( arr_2.indexOf( arr_1[ i ] ) > -1 ) {

						intersection.push( arr_1[ i ] );

					};

				};

				return intersection;

			},

			post_window_message: ( target, name, data ) => {

				target.postMessage( { name, data }, "*" );

			},

			background_exec: async function () {

				var argument_arr = Array.from( arguments );

				var module_name = argument_arr[ 0 ];
				var method_name = argument_arr[ 1 ];
				var arg_arr = argument_arr.slice( 2, -1 );
				var exec = argument_arr[ argument_arr.length - 1 ];

				return await exec( "chrome", "call", "runtime.sendMessage", { module_name, method_name, arg_arr } );

			},

			download_string: ( str, name ) => {

				var blob = new Blob([ str], { type: 'text/plain' } );
				var url = URL.createObjectURL( blob );
				var a = document.createElement("a");

				document.body.appendChild( a );
				a.style = "display: none";
				a.href = url;
				a.download = name;
				a.click();

				window.URL.revokeObjectURL( url );

			},

			find: ( arr, key, value ) => {

				for ( var i = 0; i < arr.length; i++ ) {

					if ( arr[ i ][ key ] === value ) {

						return arr[ i ];

					};

				};

				return null;

			},

			find_arr: ( arr, key, value ) => {

				var new_arr = [];

				for ( var i = 0; i < arr.length; i++ ) {

					if ( arr[ i ][ key ] === value ) {

						new_arr.push( arr[ i ] );

					};

				};

				return new_arr;

			},

			update_object ( object, new_object, exec ) {

				Object.keys( new_object ).forEach( ( key ) => {

					if ( object[ key ] !== null && typeof object[ key ] === "object" ) {

						exec( "common", "update_object", object[ key ], new_object[ key ] );

					} else {

						object[ key ] = new_object[ key ];

					};

				});

			},

			rows_to_data_arr: ( rows ) => {

				var data_arr = [];
				var data = null;

				// assume that the first row defines the property names of each object
				var property_name_arr = rows[ 0 ];

				for ( var i = 1; i < rows.length; i++ ) {

					data = {};

					for ( var j = 0; j < property_name_arr.length; j++ ) {

						data[ property_name_arr[ j ] ] = rows[ i ][ j ];

					};

					data_arr.push( data );

				};

				return data_arr;

			},

		};

	};