
	function cs ( app ) {

		return {

			// add_observers

				handle_window_message: async ( name, data, event, exec ) => {

					if ( name === "toggle_iframe" ) {

						exec( "toolbar", "toggle" );

					} else if ( name === "open_iframe" ) {

						exec( "toolbar", "show" );

					} else if ( name === "toggle_present_mode" ) {

						$( document.body ).toggleClass( "chromane-present-mode" );

						if ( document.body.classList.contains( "chromane-present-mode" ) ) {

							chrome.storage.local.set({ present_mode: true });

						} else {

							chrome.storage.local.set({ present_mode: false });

						};

					} else {

						exec( "prj_cs", name, data );

					};

				},

				add_observers: () => {

					$( document ).on( "click", "#chromane_iframe_toggle_button", () => {

						$( "#chromane_iframe_container" ).toggleClass( "active" );

					});

					window.addEventListener( "message", ( event ) => {

						var name = event.data.name;
						var data = event.data.data;

						if ( name ) {

							if ( data ) {

								data.event = event;

							};

							app.exec.exec( "cs", "handle_window_message", name, data, event );

						};

					});

				},

			// main

				init: async ( app, exec ) => {

					chrome.storage.local.get([ "present_mode" ], ( storage ) => {

						if ( storage.present_mode ) {

							$( document.body ).addClass( "chromane-present-mode" );

						};

					});

					exec( "cs", "add_observers" );
					exec( "toolbar", "inject", document );

				},

		};

	};
