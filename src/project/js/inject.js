
	console.log( "injected" );

	( function () {

		// override fetch

			var real_fetch = window.fetch;

			async function handle_fetch_request ( args ) {

				if ( args[ 0 ] === "https://app-endpoints.shiphero.com/graphql" ) {

					try {

						var body = JSON.parse( args[ 1 ].body );

						if ( body.operationName === "getBulkShippableOrders" || body.operationName === "PendingOrders" || body.operationName === "PendingOrder" ) {

							args[ 1 ].signal = null;

							var response = await real_fetch( args[ 0 ], args[ 1 ] );
							var json = await response.json();

							if ( json && json.data && json.data.pending_orders ) {

								window.postMessage({

									name: "pending_orders_detected",
									data: {

										request_info: {

											url: args[ 0 ],
											request_data: args[ 1 ],
											json

										}

									}

								}, "*" );

							} else if ( json && json.data && json.data.bulk_shippable_orders ) {

								window.postMessage({

									name: "bulk_shippable_orders_detected",
									data: {

										request_info: {

											url: args[ 0 ],
											request_data: args[ 1 ],
											json

										}

									}

								}, "*" );

							} else if ( json && json.data && json.data.pending_order ) {

								window.postMessage({

									name: "pending_order_detected",
									data: {

										request_info: {

											url: args[ 0 ],
											request_data: args[ 1 ],
											json

										}

									}

								}, "*" );

							};

						};

					} catch ( e ) {

					}

				};

			};

			// window.fetch = function () {

			// 	var response = real_fetch.apply( window, arguments );

			// 	handle_fetch_request( arguments );

			// 	return response;

			// };

		// override xhr

			var _open = XMLHttpRequest.prototype.open;
			window.XMLHttpRequest.prototype.open = function ( method, URL ) {

				this.addEventListener( "readystatechange", ( event ) => {

					if ( this.readyState === 4 && this.status === 200 ) {

						// var selections = JSON.parse( JSON.parse( this.responseText ).selections );

						window.postMessage({

							name: "set_auth_data",
							data: { auth_data: JSON.parse( this.responseText ) },

						}, "*" );

						// console.log( JSON.parse( this.responseText ) );
						// console.log( JSON.parse( JSON.parse( this.responseText ).bookList ) );
						// console.log( "selections", JSON.parse( JSON.parse( this.responseText ).selections ) );
						// console.log( JSON.parse( JSON.parse( this.responseText ).userSelectionsData ) );

					};

				});

			return _open.apply( this, arguments );

		};

	} () );
