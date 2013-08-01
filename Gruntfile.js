module.exports = function(grunt) {

  // Load the required plugins
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-open');
  grunt.loadNpmTasks('grunt-mkdir');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  
  // Project configuration.
  grunt.initConfig({
    
    pkg: grunt.file.readJSON('package.json'),
    
    clean: {
      dist: ['<%= pkg.name %>.js', '<%= pkg.name %>.min.js', '<%= pkg.name %>.min.css', 'tmp']
    },
    
    mkdir: {
      all: {
        options: {
          mode: 0700,
          create: ['tmp']
        }
      }
    },
    
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['scripts/**/*.js'],
        dest: 'tmp/output.js'
      },
    },
    
    uglify: {
      options: {
        compress: true,
        mangle: false,
        report: 'gzip'
      },
      dist: {
        src: 'tmp/output.js',
        dest: '<%= pkg.name %>.min.js'
      }
    },

    cssmin: {
      combine: {
        files: {
          'styles/<%= pkg.name %>.min.css': ['styles/bootstrap-custom.css', 'styles/font-awesome.min.css', 'styles/mobile-nav.css', 'styles/main.css']
        }
      }
    },
    
    jshint: {
      all: ['Gruntfile.js', 'scripts/**/*.js', 'test/**/*.js']
    },
    
    test: {
      
    },
    
    watch: {
      all: {
        options: { livereload: true },
        files: ['scripts/**/*.js', 'styles/main.css'],
        tasks: ['default'],
      },
    }
  
  });

  grunt.registerTask('test', 'Execute unit tests', function () {
    grunt.log.writeln('TODO task not implemented yet');
  });

  // Default task: build a release in dist/
  grunt.registerTask('default', ['clean:dist',
                                 'test', 
                                 'jshint', 
                                 'mkdir', 
                                 'concat:dist',
                                 'uglify',
                                 'cssmin']);
  

};
