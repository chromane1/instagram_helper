
	function prj_unit_tests ( app ) {

		return {

			init: async ( app, exec ) => {

				var test_cases_text = await exec( "common", "fetch_text", chrome.extension.getURL( "/project/json/test_cases.js" ) );

				var raw_test_cases = JSON5.parse( test_cases_text );
				var raw_test_cases_2 = JSON5.parse( test_cases_text );
				var extended_test_cases = await exec( "exec_tester", "extend_json", raw_test_cases_2, "/project/json" );

				await app.modules.exec_tester.test_module( app.exec, app.exec.get_exec_data, "scraper", raw_test_cases.scraper, extended_test_cases.scraper );

			},

		};

	};