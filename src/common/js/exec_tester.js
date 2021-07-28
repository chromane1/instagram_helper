
	function exec_tester ( app ) {

		var x = window[ window.webextension_library_name ];
		var _app = app;

		var _pub = {

			init: function ( app ) {

			},

			clone: function ( obj ) {

				return JSON.parse( JSON.stringify( obj ) );

			},

			exec_data_to_log: function ( exec_data ) {

				return exec_data.exec_data_arr.map( ( data ) => {

					var log = [];

					log[ 0 ] = data.stub_mode;

					log[ 1 ] = ([]).concat( data.arguments );
					log[ 1 ].unshift( data.method_name );
					log[ 1 ].unshift( data.module_name );

					if ( data.stub_mode === "stub" ) {

						log[ 2 ] = data.output;

					} else if ( data.stub_mode === "do_not_stub" ) {

						log[ 2 ] = null;

					};

					return log;

				});

			},

			log_to_exec_data: function ( log ) {

				var exec_data = {};

				exec_data.found = true;

				exec_data.exec_data_arr = log.map( ( log_item ) => {

					var item = {};

					item.module_name = log_item[ 1 ][ 0 ];
					item.method_name = log_item[ 1 ][ 1 ];
					item.arguments = log_item[ 1 ].slice( 2 );
					item.exec_data_arr = [];
					item.output = log_item[ 2 ];
					item.found = true;

					return item;

				});

				return exec_data;

			},

			test_module: async function ( exec, get_exec_data, module_name, raw_test_info, extended_test_info ) {

				var method_name_arr = Object.keys( extended_test_info );

				for ( var i = 0; i < method_name_arr.length; i++ ) {

					var method_name = method_name_arr[ i ];
					var test_data_arr = extended_test_info[ method_name ];
					var raw_test_data_arr = raw_test_info[ method_name ];

					exec.set_stub_arr([]);

					for ( var j = 0; j < test_data_arr.length; j++ ) {

						var test_data = test_data_arr[ j ];
						var raw_test_data = raw_test_data_arr[ j ];

						var io = await Promise.all([

							_pub.unserialize( test_data.input ),
							_pub.unserialize( test_data.output )

						]);

						var input = io[ 0 ];
						var output = io[ 1 ];

						var input_clone = input;
						// var input_clone = _pub.clone( input );

						if ( test_data.log ) {

							var stub_arr = test_data.log.map( ( item ) => {

								return [ item[ 0 ], item[ 1 ][ 0 ], item[ 1 ][ 1 ], item[ 2 ] ]

							});

						} else {

							var stub_arr = [];

						};

						exec.set_stub_arr( stub_arr );

						input_clone.unshift( method_name );
						input_clone.unshift( module_name );

						var exec_data = get_exec_data.apply( null, input_clone );
						test_data.actual_log = _pub.exec_data_to_log( exec_data );

						input_clone = input_clone.slice( 2 );

						if ( test_data.log ) {

							test_data.expected_exec_data = _pub.log_to_exec_data( test_data.log );
							test_data.expected_exec_data.arguments = input;
							test_data.expected_exec_data.app_name = "tests";
							test_data.expected_exec_data.module_name = module_name;
							test_data.expected_exec_data.method_name = method_name;

							test_data.log_check_result = _pub.compare( test_data.log, test_data.actual_log );

						} else {

							test_data.log_check_result = true;

						};

						if ( test_data.updated_input ) {

							test_data.updated_input_check_result = _pub.compare( test_data.updated_input, input_clone );
							test_data.actual_updated_input = input_clone;

						} else {

							test_data.updated_input_check_result = true;

						};

						if ( test_data.hasOwnProperty( "output" ) ) {

							test_data.output_check_result = _pub.compare( output, exec_data.output );

						} else {

							test_data.output_check_result = true;

						};

						var equal_bool = test_data.log_check_result && test_data.updated_input_check_result && test_data.output_check_result;

						// await x.util.wait( 10 );
						_pub.log_test_case( test_data, raw_test_data, exec_data, input, output, equal_bool );
						// await x.util.wait( 10 );

					};

				};

			},

			unserialize: function ( data ) {

				return new Promise( function ( resolve ) {

					if ( data === null || typeof data !== "object" ) {

						resolve( data );

					} else if ( data.__serial_type__ === "element" ) {

						resolve( _pub.html_to_element( data.html ) );

					} else if ( data.__serial_type__ === "date" ) {

						resolve( new Date( data.ts ) );

					} else if ( data.__serial_type__ === "page_data" ) {

						x.ajax({

							method: "get_text",
							url: "pages/" + encodeURIComponent( encodeURIComponent( data.url ) ),

						}).then( function ( text ) {

							resolve({

								url: data.url,
								text: text,
								doc: x.util.html_to_doc( text ),

							});

						});

					} else if ( data instanceof Document ) {

						resolve( data );

					} else {



						var total_key_count = Object.keys( data ).length;
						var unserialized_key_count = 0;

						Object.keys( data ).forEach( function ( key ) {

							_pub.unserialize( data[ key ] )
							.then( function ( value ) {

								data[ key ] = value;

								unserialized_key_count += 1;

								if ( unserialized_key_count === total_key_count ) {

									resolve( data );

								};

							});

						});

						if ( Object.keys( data ).length === 0 ) {

							resolve( data );

						};

					};

				});

			},

			html_to_element: function ( html ) {

				var parser = new DOMParser;
				var doc = parser.parseFromString( html, 'text/html');

				return doc;

			},

			compare: function ( obj_1, obj_2 ) {

				if ( obj_1 === obj_2 ) {

					return true;

				} else if ( obj_1 instanceof Date && obj_2 instanceof Date ) {

					return obj_1.getTime() === obj_2.getTime();

				} else if ( obj_1 === null && obj_2 === null ) {

					return true;

				} else if ( typeof obj_1 === "object" && typeof obj_2 === "object" && obj_1 !== null && obj_2 !== null ) {

					var key_arr_1 = Object.keys( obj_1 );
					var key_arr_2 = Object.keys( obj_2 );
					var equal;

					for ( var i = key_arr_1.length; i--; ) {

						equal = _pub.compare( obj_1[ key_arr_1[ i ] ], obj_2[ key_arr_1[ i ] ] );

						if ( equal === false ) {

							return false;

						};

					};

					for ( var i = key_arr_2.length; i--; ) {

						equal = _pub.compare( obj_1[ key_arr_2[ i ] ], obj_2[ key_arr_2[ i ] ] );

						if ( equal === false ) {

							return false;

						};

					};

					return true;

				} else {

					return false;

				};

			},

			log_test_case: function ( test_data, raw_test_data, exec_data, input, output, equal_bool ) {

				if ( test_data.test_type === "log_test" ) {

					console.log( "log_test" );
					console.log( exec_data );

				} else {

					var style = equal_bool ? "color:green" : "color:red";
					console.groupCollapsed( `%c ${ exec_data.module_name }.${ exec_data.method_name }`, style );

					console.log( "input" );
					console.log( input );

					if ( test_data.hasOwnProperty( "output" ) ) {

						console.log( "expected output" );
						console.log( output );
						console.log( "actual output" );
						console.log( exec_data.output );

					};

					if ( test_data.updated_input ) {

						console.log( "expected updated input" );
						console.log( test_data.updated_input );
						console.log( "actual updated input" );
						console.log( test_data.actual_updated_input );

					};

					if ( test_data.log ) {

						console.log( "expected log" );
						_app.log.force_log_exec_data( test_data.expected_exec_data );

						console.log( "actual log" );
						_app.log.force_log_exec_data( exec_data );

					} else {

						_app.log.force_log_exec_data( exec_data );

					};

					console.groupCollapsed( `%c new_test_data`, "color: grey" );

					var new_test_data = {};

					new_test_data.input = raw_test_data.input;

					if ( test_data.hasOwnProperty( "output" ) ) {

						new_test_data.output = exec_data.output;

					};

					if ( test_data.updated_input ) {

						new_test_data.updated_input = test_data.actual_updated_input;

					};

					if ( test_data.log ) {

						new_test_data.log = test_data.actual_log;

					};

					console.log( JSON.stringify( new_test_data, null, "\t" ) );

					console.groupEnd();

					console.groupEnd();

				};

				//  else {

				// 	var style = equal_bool ? "color:green" : "color:red";
				// 	console.groupCollapsed( `%c ${ exec_data.module_name }.${ exec_data.method_name }`, style );

				// 	console.log( "input" );
				// 	console.log( input.slice( 2 ) );
				// 	console.log( "expected output" );
				// 	console.log( output );
				// 	console.log( "actual output" );
				// 	console.log( exec_data.output );

				// 	console.groupCollapsed( `%c new_test_data`, "color: grey" );

				// 	var new_test_data = JSON.parse( JSON.stringify( test_data ) );
				// 	new_test_data.output = exec_data.output;
				// 	new_test_data.input = new_test_data.input.slice( 2 );

				// 	console.log( JSON.stringify( new_test_data, null, "\t" ) );

				// 	console.groupEnd();

				// 	_app.log.force_log_exec_data( exec_data );

				// 	console.groupEnd();

				// };

			},

			extend_json: async function ( obj, root_path, exec ) {

				if ( Array.isArray( obj ) ) {

					for ( var i = 0; i < obj.length; i++ ) {

						obj[ i ] = await exec( "exec_tester", "extend_json", obj[ i ], root_path );

					};

					return obj;

				} else if ( obj && typeof obj === "object" ) {

					if ( obj._type_ === "document" ) {

						var response = await fetch( root_path + obj._link_to_this_object_ );
						var text = await response.text();
						var doc = exec( "exec_tester", "html_to_element", text );

						return doc;

					} else {

						var key_arr = Object.keys( obj );

						for ( var i = 0; i < key_arr.length; i++ ) {

							obj[ key_arr[ i ] ] = await exec( "exec_tester", "extend_json", obj[ key_arr[ i ] ], root_path );

						};

						return obj;

					};

				} else {

					return obj;

				};

			},

		};

		return _pub;

	};