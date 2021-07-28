
	function prj_ui_tester ( app ) {

		return {

			init_state: ( state, exec ) => {

				exec( "common", "update_object", state, {

					iframe_data_arr: [

						{

							name: "website_mock",
							description: "Website Mock",
							url: chrome.extension.getURL( "/core/pages/website_mock/index.html" ),
							active: true,
							width: "calc( 100% - 200px )",
							height: "800px",
							exec_arr: []

						}

					],

				});

			},

			init: ( app, exec ) => {

				window.addEventListener( "message", ( event ) => {

					var name = event.data.name;
					var data = event.data.data;

					if ( name === "iframe_ready" ) {

						console.log( name, data, event.source );

						if ( data.init_data.name === "website_mock" ) {

							exec( "common", "post_window_message", event.source, "show_toolbar", null );

						};

						// exec( "common", "post_window_message", event.source, "exec", { exec_arr: app.state.iframe_data_arr[ data.init_data.index ].exec_arr } );

					};

				});

				exec( "prj_ui_tester", "inject_iframes", chrome.runtime.id );

			},

			inject_iframes: ( ext_id ) => {

				app.state.iframe_data_arr.forEach( ( data, index ) => {

					if ( data.active ) {

						var iframe = document.createElement( "iframe" );
						iframe.allow = "camera;microphone";
						iframe.src = data.url;
						iframe.name = JSON.stringify({ index, name: data.name });

						var iframe_container = $( `<div class = "iframe_container" data-name = "${ data.name }" data-index = "${ index }" ><h1><span style = "flex-grow: 1" >${ data.description }</span></h1></div>` );
						iframe_container.append( iframe );

						data.iframe = iframe;
						data.date_now = Date.now();

						if ( data.width ) {

							iframe_container.css( "width", data.width );

						};

						if ( data.height ) {

							iframe_container.css( "height", data.height );

						};

						$( "#content" ).append( iframe_container );

					};

				});

			},

		};

	};