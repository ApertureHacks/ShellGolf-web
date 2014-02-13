module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // pkg: grunt.file.readJSON('package.json'),

    jshint: {
      files: [
               '*.js',
               '{lib,routes,test}/**/*.js',
               'public/javascripts/sg-*.js',
             ],
      options: {
        jshintrc: true
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  // grunt.loadNpmTasks('grunt-mocha-test');

  // Load the plugin that provides the "uglify" task.
  // grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s).
  grunt.registerTask('test', ['jshint', 'mocha']);

  // Alias the `test` task to run `mocha` instead
  grunt.registerTask('mocha', 'run mocha', function () {
    var done = this.async();
    var stderr = '';
    var mocha = require('child_process').spawn('./node_modules/.bin/mocha', ['-R', 'dot']);

    mocha.stdout.on('readable', function() {
      var data = mocha.stdout.read();
      if (data) {
        grunt.log.write(data);
      }
    });
    mocha.stderr.on('readable', function() {
      data = mocha.stderr.read();
      if (data) {
        grunt.log.write(data);
      }
    });

    mocha.on('error', function(err) {
      done(err);
    });

    mocha.on('close', function(code) {
      var err;
      if (code) {
        err = new Error(code.toString() + ' mocha tests failed.');
      }
      done(err);
    });
  });
};
