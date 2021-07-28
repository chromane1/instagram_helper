
	function bg ( app ) {

		return {

			handle_runtime_message: async ( message, sender, callback, exec ) => {

				exec( "log", "write_exec", "message", message );
				exec( "log", "write_exec", message.module_name );
				exec( "log", "write_exec", message.method_name );

				if ( message.data && message.data.sender ) {

					message.data.sender = sender;

				};

				if ( message.arg_arr ) {

					for ( var i = message.arg_arr.length; i--; ) {

						if ( message.arg_arr[ i ] === "_tab_id_" ) {

							message.arg_arr[ i ] = sender.tab.id;

						} else if ( message.arg_arr[ i ] === "_tab_" ) {

							message.arg_arr[ i ] = sender.tab;

						};

					};

				};

				if ( message.arg_arr ) {

					var arg_arr = [ message.module_name, message.method_name ];
					arg_arr = arg_arr.concat( message.arg_arr );

				} else {

					var arg_arr = [ message.module_name, message.method_name ];

				};

				var result = await exec.apply( null, arg_arr );

				callback( result );

			},

			add_observers: () => {

				chrome.runtime.onMessage.addListener( function ( message, sender, callback ) {

					app.exec.exec( "bg", "handle_runtime_message", message, sender, callback );
					return true;

				});

			},

			get_tab_id: ( tab, exec ) => {

				return tab.id;

			},

			init: ( app, exec ) => {

				exec( "bg", "init_storage" );
				exec( "bg", "add_observers" );

			},

		};

	};