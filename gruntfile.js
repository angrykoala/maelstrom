module.exports = function(grunt) {

	//load plugins
	grunt.loadNpmTasks('grunt-auto-install');
	grunt.loadNpmTasks('grunt-contrib-clean');


	//config
	grunt.initConfig({
		auto_install: {
			subdir: {
				options: {
					cwd: 'services',
					stdout: true,
					stderr: true,
					failOnError: true,
					recursive: true,
					//npm: '--production',
					bower: false,
					exclude: ['.git', 'node_modules', 'ncp', 'coverage']
				}
			}
		},
		clean: {
		node_modules:["node_modules/","services/*/node_modules/"],
		coverage: ["coverage/","services/*/coverage/","etc/","services/*/etc/"]		
		}
	});


//tasks


	grunt.registerTask('astyle', 'beautify all the project', function() {
		console.log('astyle');
	});




}
