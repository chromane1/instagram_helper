
	function prj_bg ( app ) {

		return {

			take_screenshot: async ( tab, exec ) => {

				var data_url = await exec( "chrome", "call", "tabs.captureVisibleTab", null, { format: 'png' } );

				return data_url;

			},

			create_tab: ( data, exec ) => {

					chrome.tabs.create({

						active: true,
						url: data.url,

					})

			}

		}

	};