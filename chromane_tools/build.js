
	const fs = require( "fs" );
	const path = require( "path" );
	const rimraf = require( 'rimraf' );
	const zipper = require( "zip-local" );
	const copy_dir = require( "copy-dir" );
	const compiler = require( "vue-template-compiler" );

	rimraf( path.join( __dirname, "..", "dist" ), () => {

		// create a dsit folder if it does not exist

			if ( !fs.existsSync( path.join( __dirname, "..", "dist" ) ) ) {

				fs.mkdirSync( path.join( __dirname, "..", "dist" ) );

			};

		// create a prod build

			var name = "prod";

			copy_dir.sync( path.join( __dirname, "..", "src" ), path.join( __dirname, "..", "dist", name ) );

			rimraf.sync( path.join( __dirname, `..`, "dist", name, `chromane`, `testing` ) );
			rimraf.sync( path.join( __dirname, `..`, "dist", name, `pages`, `tests` ) );
			rimraf.sync( path.join( __dirname, `..`, "dist", name, `test_data.js` ) );
			rimraf.sync( path.join( __dirname, `..`, "dist", name, `config.json` ) );
			rimraf.sync( path.join( __dirname, `..`, "dist", name, `config.js` ) );
			rimraf.sync( path.join( __dirname, `..`, "dist", name, `manifest.json` ) );

			var manifest = JSON.parse(
				fs.readFileSync(
					path.join( __dirname, `..`, `src`, `manifest.json` ),
					'utf8'
				)
			);

			var config = JSON.parse(
				fs.readFileSync(
					path.join( __dirname, `..`, `src`, `config.json` ),
					'utf8'
				)
			);

			delete manifest.options_ui;

			config.mode = "prod";

			fs.writeFileSync( path.join( __dirname, "..", "dist", name, "manifest.json" ), JSON.stringify( manifest, null, "\t" ), { encoding: "utf8" } );
			fs.writeFileSync( path.join( __dirname, "..", "dist", name, "config.json" ), JSON.stringify( config, null, "\t" ), { encoding: "utf8" } );

			zipper.sync.zip(
					path.join( __dirname, `..`, "dist", name )
				)
				.compress()
				.save(
					path.join( __dirname, "..", "dist", manifest.version + " " + name + ".zip" )
				)

	});