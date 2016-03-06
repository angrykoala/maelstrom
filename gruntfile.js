module.exports = function(grunt) {

	//load plugins
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-mocha-test');

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
			node_modules: ["node_modules/"],
			coverage: ["coverage/"],
			backup: ["*.log"]
		},
		mochaTest: {
			options: {
				//reporter: 'spec'
			},
			users: {
				src: ["services/users/test/*.js"]
			},
			proxy: {
				src: ["services/proxy/test/*.js"]
			},
			world: {
				src: ["services/world/test/*.js"]
			}
		}
	});
};
