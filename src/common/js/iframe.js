
	function iframe ( app ) {

		return {

			// observers

				add_observers: () => {

					window.addEventListener( "message", ( event ) => {

						var name = event.data.name;
						var data = event.data.data;

						if ( name ) {

							app.exec.exec( "iframe", "handle_window_message", app.state, name, data, event );

						};

					});

					chrome.runtime.onMessage.addListener(( event, sender ) => {

						console.log( "runtime_message", event );

						var name = event.name;
						var data = event.data;

						if ( name && data ) {

							data.sender = sender;

							app.exec.exec( "prj_iframe", name, data );

						};

					});

				},

			// init

				init: async ( context, exec ) => {

					exec( "iframe", "add_observers" );

					var init_data = exec( "util", "decode_json", window.name );

					app.state.init_data = init_data;

					exec( "common", "post_window_message", window.parent, "iframe_ready", { init_data } );

					exec( "prj_iframe", "handle_state_update" );

				},

				update_model: () => {

				},

				open_drawer: async ( state, exec ) => {

					document.querySelector( "#drawer_overlay" ).style.display = "block";

					await exec( "util", "wait", 20 );

					document.querySelector( "#drawer_overlay" ).classList.add( "opened" );

				},

				close_drawer: async function ( state, exec ) {

					document.querySelector( "#drawer_overlay" ).classList.remove( "opened" );

					await exec( "util", "wait", 200 );

					document.querySelector( "#drawer_overlay" ).style.display = "none";

				},

				update_state: ( state, new_state, exec ) => {

					function update_object ( object, new_object ) {

						Object.keys( new_object ).forEach( ( key ) => {

							if ( object[ key ] !== null && typeof object[ key ] === "object" ) {

								update_object( object[ key ], new_object[ key ]);

							} else {

								object[ key ] = new_object[ key ];

							};

						});

					};

					update_object( state, new_state );

					exec( "iframe_project", "handle_state_update" );

				},

				handle_event: async ( state, name, data, exec ) => {

					if ( name === "menu_button_click" ) {

						exec( "iframe", "open_drawer", state );

					} else if ( name === "drawer_overlay_click" ) {

						exec( "iframe", "close_drawer", state );

					} else if ( name === "drawer_click" ) {

						data.event.stopPropagation();

					} else if ( name === "close_button_click" ) {

						window.parent.postMessage({ name: "toggle_iframe" }, "*" );

					} else {

						exec( "prj_iframe", name, data );

					};

				},

				handle_window_message: async ( state, name, data, event, exec ) => {

					if ( name === "exec" ) {

						for ( var i = 0; i < data.exec_arr.length; i++ ) {

							for ( var j = 0; j < data.exec_arr[ i ].length; j++ ) {

								if ( data.exec_arr[ i ][ j ] === "_state_" ) {

									data.exec_arr[ i ].splice( j, 1, state );

								};

							};

							await exec.apply( null, data.exec_arr[ i ] );

						};

					} else {

						exec( "prj_iframe", name, data );

					};

				},

		};

	};