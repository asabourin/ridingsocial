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
  
  // Project configuration.
  grunt.initConfig({
    
    pkg: grunt.file.readJSON('package.json'),
    
    clean: {
      dist: ['<%= pkg.name %>.js', '<%= pkg.name %>.min.js', 'tmp']
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
    
    copy: {
      dist: {
        files: [{
          src: 'tmp/output.js',
          dest: '<%= pkg.name %>.js'
        }]
      }
    },
    
    uglify: {
      options: {
        compress: true,
        report: 'gzip'
      },
      dist: {
        src: 'tmp/output.js',
        dest: '<%= pkg.name %>.min.js'
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
        files: ['scripts/**/*.js'],
        tasks: ['clean:example', 'concat:example'],
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
                                 'copy:dist',
                                 'uglify']);
  

};
