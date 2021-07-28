
	function chromane_select ( app ) {

		return {

			// init

				init_model: ( parent_model, model, name, placeholder, exec ) => {

					exec( "common", "update_object", model, {

						parent_model,

						value: "",
						name,
						placeholder,

						active: false,
						results_available_flag: true,
						selected_option_data: null,

						option_data_arr: [

							// {
								// value: "any",
								// visible: "bool",
								// name: "string",
							// }

						],

					});

				},

			// methods

				select: ( model, value, exec ) => {

					model.selected_option_data = exec( "common", "find", model.option_data_arr, "value", value );
					model.value = model.selected_option_data.name;

				},

				filter_options: function ( model ) {

					var value = model.value.toLowerCase();
					var option_data = null;
					var results_available_flag = false;

					for ( var i = 0; i < model.option_data_arr.length; i++ ) {

						option_data = model.option_data_arr[ i ];

						if ( option_data.name.toLowerCase().indexOf( value ) === -1 ) {

							option_data.visible = false;

						} else {

							option_data.visible = true;
							results_available_flag = true;

						};

					};

					model.results_available_flag = results_available_flag;

				},

				unfocus: ( model ) => {

					model.active = false;

					model.value = model.selected_option_data.name;

				},

			// event handlers

				chromane_select_disabled_cover_click: ( data ) => {

					data.event.stopPropagation();

				},

				chromane_select_input: ( data, exec ) => {

					exec( "chromane_select", "filter_options", data.model );

				},

				chromane_select_click: ( data, exec ) => {

					data.model.value = "";
					data.model.active = true;
					exec( "chromane_select", "filter_options", data.model );
					data.event.stopPropagation();

				},

				chromane_select_option_click: ( data, exec ) => {

					data.model.selected_option_data = data.option;
					data.model.value = data.option.name;
					data.model.active = false;

					data.event.stopPropagation();

					if ( data.model.parent_model.model_name === "chromane_form" ) {

						exec( "chromane_form", "handle_chromane_select_change", data.model, data.option );

					};

				},

		};

	};