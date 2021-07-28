
	function prj_website_mock ( app ) {

		return {

			init_state: ( state, exec ) => {

				exec( "common", "update_object", state, {

					model: {

					},

				});

			},

			init: ( app, exec ) => {

				function post_window_message ( name, data ) {

					// document.querySelector( "#chromane_iframe_container iframe" ).contentWindow.postMessage({ name, data }, "*" );
					window.postMessage({ name, data }, "*" );

				};

				document.addEventListener( "click", ( event ) => {

					if ( event.target.dataset.onclick === "set_auth_data_1" ) {

						post_window_message( "set_auth_data", { auth_data: app.state.auth_data_1 } );

					} else if ( event.target.dataset.onclick === "set_bookid_1" ) {

						post_window_message( "set_bookid", { bookid: "58" } );

					};

				});

			},

		};

	};