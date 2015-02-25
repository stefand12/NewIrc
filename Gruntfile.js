module.exports = function ( grunt ) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
  			options: {
    			// define a string to put between each file in the concatenated output
    			separator: ';'
  			},
  			dist: {
    			// the files to concatenate
    			src: [
    				'bower_components/bootstrap/js/affix.js',
    				'bower_components/bootstrap/js/alert.js',
    				'bower_components/bootstrap/js/button.js',
    				'bower_components/bootstrap/js/carousel.js',
    				'bower_components/bootstrap/js/collapse.js',
    				'bower_components/bootstrap/js/dropdown.js',
    				'bower_components/bootstrap/js/modal.js',
    				'bower_components/bootstrap/js/tooltip.js',
    				'bower_components/bootstrap/js/popover.js',
    				'bower_components/bootstrap/js/scrollspy.js',
    				'bower_components/bootstrap/js/tab.js',   				
    				'bower_components/bootstrap/js/transition.js',
    				'bower_components/bootstrap/js/bootstrap.js',
    				'bower_components/underscore/underscore.js',
    				'bower_components/angular/angular.js',
    				'bower_components/angular-route/angular-route.js',
    				'bower_components/angular-scroll-glue/src/scrollglue.js',
    				'src/js/socket.io.min.js',
    				'src/js/NewIrc.js',
    				'src/js/passPrompt.js',
    				'src/js/privateMessage.js',
    				'src/js/sharedVariables.js',
    				'src/js/socket-factory.js',
    				'src/js/HomeController.js',
    				'src/js/AboutController.js',
    				'src/js/UserListController.js',
    				'src/js/RoomListController.js',
    				'src/js/LoginController.js',
    				'src/js/RoomController.js',
    				'src/js/ChatController.js'
    				],
    			// the location of the resulting JS file
    			dest: 'dist/js/<%= pkg.name %>.js'
  			}
		},
		uglify: {
  			options: {
    			// the banner is inserted at the top of the output
    			banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
  			},
  			dist: {
    			files: {
      				'dist/js/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
  				}
  			}
		},
	  	jshint: {
	   		all: [
	   			'src/js/*.js',
	   			'!src/js/socket.io.min.js', /* Thessi file er uglified og þar af leiðandi generatar endalaust af villum */
	   		],
	    	gruntfile: [
	    		'Gruntfile.js'
	    	],
	    	options: {
	     		curly:  true,
				immed:  true,
			  	newcap: true,
			  	noarg:  true,
			  	sub:    true,
			  	boss:   true,
			  	eqnull: true,
			  	node:   true,
			  	undef:  true,
				globals: {
					_:       false,
				    jQuery:  false,
				    angular: false,
				    moment:  false,
				    console: false,
				    $:       false,
				    io:      false
				}
	    	}
	    },
	    watch: {
	    	files: ['<%= jshint.files%>'],
	    	tasks: ['jshint']
	    }
 	});

 	grunt.loadNpmTasks('grunt-contrib-jshint');
 	grunt.loadNpmTasks('grunt-contrib-uglify');
 	grunt.loadNpmTasks('grunt-contrib-watch');
 	grunt.loadNpmTasks('grunt-contrib-concat');

 	grunt.registerTask('test', ['jshint']);
 	grunt.registerTask('default', ['jshint','concat','uglify']);
};