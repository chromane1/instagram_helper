
	const fs = require( "fs" );
	const path = require( "path" );
	const rimraf = require( 'rimraf' );
	const chokidar = require( "chokidar" );
	const compiler = require( "vue-template-compiler" );

	var template_1 = `
		window.{{template_name}}_render = function () {

			{{render}}

		};
	`;

	var template_2 = `
		window.{{template_name}}_static_render_fns = function () {

			return [

				{{static_render_fns}}

			];

		};
	`;

	function watch ( src, dest ) {

		var watcher = chokidar.watch( src, { ignored: /^\./, persistent: true } );

		function compile_template ( item_path ) {

			console.log( `comiping template ${ item_path }` );

			var html = fs.readFileSync( item_path, "utf8" );
			var result = compiler.compile( html );
			var template_name = item_path.replace( /^.*[\\\/]/, '' ).replace( ".html", "" );

			var render_str = template_1.replace( "{{template_name}}", template_name ).replace( "{{render}}", result.render );
			var static_render_fns_str = template_2.replace( "{{template_name}}", template_name ).replace( "{{static_render_fns}}", result.staticRenderFns.map( ( code ) => { return `function(){${ code }}` } ).join( ",\n" ) );

			fs.writeFileSync( dest + `${ template_name }_render.js`, render_str + static_render_fns_str )
			// fs.writeFileSync( `src/project/templates/js/${ template_name }_static_render_fns.js`, static_render_fns_str )

		};

		watcher
		.on( 'add', function ( item_path ) {

			console.log( 'File', item_path, 'has been added' );
			compile_template( item_path );

		})
		.on( 'change', function ( item_path ) {

			console.log( 'File', item_path, 'has been changed' );
			compile_template( item_path );

		})
		.on( 'unlink', function ( item_path ) {

			console.log( 'File', item_path, 'has been removed');

		})
		.on( 'error', function ( error ) {

			console.error( 'Error happened', error);

		});

	};

	watch( path.join( __dirname, '..', 'src', 'project', 'templates', 'html' ), `../src/project/templates/js/` )
	watch( path.join( __dirname, '..', 'src', 'common', 'templates', 'html' ), `../src/common/templates/js/` )