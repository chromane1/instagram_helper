
	( function () {

		var script = document.createElement( "script" );

		script.innerHTML = `

			// xhr

				var _open = XMLHttpRequest.prototype.open;
				var _setRequestHeader = window.XMLHttpRequest.prototype.setRequestHeader

				window.XMLHttpRequest.prototype.setRequestHeader = function ( name, value ) {

					if ( !this.chromane_request_headers ) {

						this.chromane_request_headers = {};

					};

					this.chromane_request_headers[ name ] = value;

					return _setRequestHeader.apply( this, arguments );

				};

				window.XMLHttpRequest.prototype.open = function ( method, request_url ) {

					this.addEventListener( "readystatechange", ( event ) => {

						if ( this.readyState === 4 && this.status === 200 ) {

							window.postMessage({

								name: "xhr_response_captured",
								data: {

									status: this.status,
									response_text: this.responseText,

									request_url: request_url,
									response_url: this.responseURL,

									request_headers: this.chromane_request_headers,
									// response_headers: this.getAllresponseHeaders(),

								},

							}, "*" );

						};

					});

					return _open.apply( this, arguments );

				};

			// fetch

				var real_fetch = window.fetch;

				async function handle_fetch_request ( args, response ) {

					var response_data = await response;
					var clone = response_data.clone();
					var text = "sdfsd";
					var text = await clone.text();

					console.log( 'args', args, response_data, clone, text );

				};

				window.fetch = async function () {

					var response = await real_fetch.apply( window, arguments );
					var response_clone = response.clone();
					var response_text = await response_clone.text();

					var message = {

						name: "fetch_response_captured",
						data: {

							status: response_clone.status,
							response_text: response_text,

							request_url: arguments[ 0 ],

						},

					};

					if ( arguments[ 1 ] && arguments[ 1 ].headers ) {

						message.data.response_headers = arguments[ 1 ].headers;

					};

					if ( arguments[ 1 ] && arguments[ 1 ].body ) {

						message.data.response_body = arguments[ 1 ].body;

					};

					window.postMessage( message, "*" );

					return response;

				};

		`;

		document.documentElement.prepend( script );

	} () )