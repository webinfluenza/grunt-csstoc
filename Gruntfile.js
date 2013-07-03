/*
 * grunt-csstoc
 * https://github.com/webinfluenza/grunt-csstoc
 *
 * Copyright (c) 2013 Benno Mielke
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function( grunt ) {
    // load all grunt tasks
    require( 'matchdep' ).filterDev( 'grunt-*' ).forEach( grunt.loadNpmTasks );

    // Project configuration.
    grunt.initConfig( {
        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/*.js',
                '<%= nodeunit.tests %>',
            ],
            options: {
                jshintrc: '.jshintrc',
            },
        },

        // Before generating any new files, remove any previously-created files.
        clean: {
            tests: ['tmp'],
        },

        // Configuration to be run (and then tested).
        csstoc: {
            test: {
                options: {
                    sectionString: 'section',
                    tocHead: 'Table Of Contents'
                },
                files: {
                    'tmp/foo.css': 'test/expected/foo.css'
                }
            }
        },

        watch: {
            csstoc: {
                files: '<%= jshint.all %>',
                tasks: ['jshint', 'csstoc']
            },
            csstoctest: {
                files: '<%= jshint.all %>',
                tasks: ['jshint', 'csstoc', 'nodeunit']
            }
        },

        // Unit tests.
        nodeunit: {
            tests: ['test/*_test.js'],
        },
    } );

    // Actually load this plugin's task(s).
    grunt.loadTasks( 'tasks' );

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask( 'test', ['clean', 'jshint', 'csstoc', 'nodeunit'] );

    // By default, lint and run all tests.
    grunt.registerTask( 'default', ['jshint', 'test'] );
};
