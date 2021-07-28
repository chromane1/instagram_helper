
	function load_scripts ( script_data_arr, extension_id ) {

		var div = document.createElement( "div" );
		var html = ``;

		script_data_arr.forEach( ( data ) => {

			if ( data[ 0 ] === "css" ) {

				var link = document.createElement( "link" );
				link.rel = "stylesheet";
				link.href = `chrome-extension://${ extension_id }${ data[ 1 ] }`;

				document.head.appendChild( link );

			} else if ( data[ 0 ] === "css_remote" ) {

				var link = document.createElement( "link" );
				link.rel = "stylesheet";
				link.href = data[ 1 ];

				document.head.appendChild( link );

			} else {

				var script = document.createElement( "script" );
				script.src = `chrome-extension://${ extension_id }${ data[ 1 ] }`;
				script.async = false

				document.body.appendChild( script );

			};

		});

		// div.innerHTML = html;
		// document.body.appendChild( div );

	};

	async function chromane_init ( context, extension_id, script_data_arr, config ) {

		// Vue.config.errorHandler = function ( err, vm, info ) {};

		// general setup

			if ( script_data_arr[ 0 ][ 0 ] === "meta" ) {

				var meta = script_data_arr[ 0 ][ 1 ];

			} else {

				var meta = {};

			};

			var x = window.webextension_library;

			var _state = {

				extension_id,
				config: config,
				model: {},

			};

			var app = window.app = {

				name: "iframe",

				log: null,
				exec: null,

				state: _state,
				modules: {},

			};

			app.log = x.modules.log( app, meta.mode || config.mode );
			app.exec = x.modules.exec( app, meta.mode || config.mode );

			app.modules.chrome = x.modules.chrome( app );
			app.modules.util = x.util;

		// initialize modules

			script_data_arr.forEach( ( data ) => {

				if ( data[ 0 ] === "module" ) {

					app.modules[ data[ 2 ] ] = window[ data[ 2 ] ]( app );

				};

			});

		// initialize state with the help of modules

			script_data_arr.forEach( ( data ) => {

				if ( data[ 0 ] === "module" ) {

					app.exec.exec( data[ 2 ], "init_state", app.state );

				};

			});

		// initialize vue templates/components

			script_data_arr.forEach( ( script_data ) => {

				if ( script_data[ 0 ] === "root_template" ) {

					window.main_vm = new Vue({

						el: "#root",
						data: { model: app.state.model },

						render: function () { return window[ script_data[ 2 ] + "_render" ].apply( this ) },
						staticRenderFns: ( function () { return window[ script_data[ 2 ] + "_static_render_fns" ].apply( this ) } () ),

						methods: {

							handle_event: function ( name, data ) {

								app.exec.exec( script_data[ 2 ], "handle_event", _state, name, data );

							},

						},

					});

				} else if ( script_data[ 0 ] === "component" ) {

					Vue.component( script_data[ 2 ], {

						props: [ "model" ],

						render: function () { return window[ script_data[ 2 ] + "_render" ].apply( this ) },
						staticRenderFns: ( function () { return window[ script_data[ 2 ] + "_static_render_fns" ].apply( this ) } () ),

						methods: {

							handle_event: function ( name, data ) {

								app.exec.exec( script_data[ 2 ], name, data );

							},

						},

					});

				};

			});

		// kickstart

			script_data_arr.forEach( ( data ) => {

				if ( data[ 0 ] === "module" ) {

					app.exec.exec( data[ 2 ], "init", app );

				};

			});

	};

	async function init_with_loading ( context, extension_id ) {

		// document.documentElement.dataset.extension_id

		var config_result = await fetch(  `chrome-extension://${ extension_id }/config.json` );
		var config = await config_result.json();
		var script_data_arr = config.scripts[ context ];

		window.scripts_loaded = function () {

			chromane_init( context, extension_id, script_data_arr, config );

		};

		load_scripts( script_data_arr, extension_id );

	};

	async function init_without_loading ( context, extension_id ) {

		var config_result = await fetch(  `chrome-extension://${ extension_id }/config.json` );
		var config = await config_result.json();
		var script_data_arr = config.scripts[ context ];

		chromane_init( context, extension_id, script_data_arr, config );

	};