
	function chromane_form ( app ) {

		return {

			clear_values: ( model ) => {

				model.form_item_model_arr.forEach( ( model ) => {

					if ( model.type === "text_input" || model.type === "password" ) {

						model.value = "";
						model.validity = "unknown";

					} else if ( model.type === "html_editor" ) {

						console.log( model );

						model.quill.setContents([]);
						model.validity = "unknown";

					};

				});

			},

			set_values: ( model, obj ) => {

				model.form_item_model_arr.forEach( ( model ) => {

					if ( model.type === "text_input" ) {

						model.value = obj[ model.name ];

					} else if ( model.type === "html_editor" ) {

						model.element.querySelector( ".ql-editor" ).innerHTML = obj[ model.name ];

					};

				});

			},

			set_value: ( model, name, value, exec ) => {

				var form_item_model = exec( "common", "find", model.form_item_model_arr, "name", name );

				if ( form_item_model.type === "chromane_select" ) {

					exec( "chromane_select", "select", form_item_model.chromane_select_model, value )

				} else {

					form_item_model.value = value;

				};

			},

			get_value: ( form_item_model, exec ) => {

				if ( form_item_model.type === 'chromane_select' ) {

					if ( form_item_model.chromane_select_model.selected_option_data ) {

						return form_item_model.chromane_select_model.selected_option_data.value;
	
					} else {

						return null;

					};

				} else {

					return form_item_model.value;

				};

			},

			model_to_obj: ( model, exec ) => {

				var obj = {};

				model.form_item_model_arr.forEach( ( model ) => {

					obj[ model.name ] = exec( "chromane_form", "get_value", model );

				});

				return obj;

			},

			validate_form: ( model, exec ) => {

				var form_is_valid = true;

				model.form_item_model_arr.forEach( ( item_model ) => {

					item_model.validity = "valid";

					var value = exec( "chromane_form", "get_value", item_model );

					if ( item_model.required && !value ) {

						item_model.validity = "invalid";
						item_model.message = "This field is required.";

						form_is_valid = false;

					};

				});

				return form_is_valid;

			},

			mounted: function ( data, exec ) {

				data.this.model.form_item_model_arr.forEach( ( item_model ) => {

					if ( item_model.type === 'html_editor' ) {

						item_model.element = data.this.$el.querySelector( `.chromane_html_editor[data-name="${ item_model.name }"]` );

						item_model.quill = new Quill( item_model.element, {

							modules: { toolbar: true },
							theme: 'snow'

						});

						item_model.quill.on( 'text-change', function ( delta ) {

							item_model.value = item_model.element.querySelector( ".ql-editor" ).innerHTML;

						});

					};

				});

			},

			handle_chromane_select_change: function ( model, option, exec ) {

				var form_item_model = exec( "common", "find", model.parent_model.form_item_model_arr, "name", model.name );
				form_item_model.value = form_item_model.chromane_select_model.selected_option_data.value;

				if ( model.name === "current_user" ) {

					localStorage.current_user = option.value;

				};

			},

		};

	};