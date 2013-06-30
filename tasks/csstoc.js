/*
 * grunt-csstoc
 * https://github.com/webinfluenza/grunt-csstoc
 *
 * Copyright (c) 2013 Benno Mielke
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function( grunt ) {
    grunt.registerMultiTask( 'csstoc', 'Generate TOC for CSS.', function() {
        var fs = require( 'fs' ),

        // Merge task-specific and/or target-specific options with these defaults.
            options = this.options( {
                sectionString: 'section'
            } ),

            tocDefines = {
                eof: '\n', /* no CRLF here, assuming Unix line breaks (LF) */
                start: '/**',
                end: '*/',
                startString: '    @tableofcontents',
                indent: '    ',
                linePrefix: '       '
            },

            helper = {
                createFileArray: function( filepath ) {
                    var fileArray = [];

                    // read file content synchronous, split into lines and wrap in quotes
                    fs.readFileSync( filepath ).toString().split( /[\r\n]/ ).forEach( function( line ) {
                        fileArray.push( line + '' );
                    } );

                    return fileArray;
                },
                getTOCArray: function( inputArray ) {
                    if( typeof inputArray !== "undefined" && inputArray.constructor === Array ) {
                        var tocArray = [];

                        // loop through the input and check if the acutal array item is a proper TOC entry
                        for( var i = 0, iMax = inputArray.length; i < iMax; i++ ) {
                            var position = inputArray[i].indexOf( '@' + options.sectionString );

                            if( position !== -1 ) {
                                // position + 1 to remove the @ from the TOC generation in the head later
                                tocArray.push( inputArray[i].substring( position + 1, inputArray[i].length ) );
                            }
                        }

                        return tocArray;
                    }
                },
                writeNewFileWithTOC: function( oldFileContent, tocArray, outputFile ) {
                    // set the TOC on the head of the file and append the old file contents
                    if( typeof oldFileContent !== 'undefined' && tocArray.length > 0 ) {
                        // we're creating the head of the TOC here
                        var newFileContent = tocDefines.start + tocDefines.eof + tocDefines.startString + tocDefines.eof;

                        // indent the TOC entry, insert the section and append a newline
                        newFileContent += tocDefines.linePrefix + tocArray.join( tocDefines.eof + tocDefines.linePrefix );
                        newFileContent += tocDefines.eof + tocDefines.end + tocDefines.eof;

                        // the actual content
                        newFileContent += oldFileContent;

                        grunt.file.write( outputFile, newFileContent );
                    }
                },
                removeOldTOC: function( oldFileArray ) {
                    // alternative: clear old file and set the content new
                    var position = oldFileArray.indexOf( tocDefines.startString );

                    if( position > -1 ) {
                        var startPos = [0], /* as we're starting right at the first line of the file */
                            endPosToc = oldFileArray.indexOf( tocDefines.end ),
                            slicedFileArray = oldFileArray.slice( endPosToc + 1, oldFileArray.length );

                        return slicedFileArray;
                    } else {
                        // there seems to be no TOC yet, return unchanged version
                        return oldFileArray;
                    }
                }
            };

        // Iterate over all specified file groups.
        this.files.forEach( function( f ) {
            // Concat specified files.
            var src = f.src.filter( function( filepath ) {
                // Warn on and remove invalid source files (if nonull was set).
                if( !grunt.file.exists( filepath ) ) {
                    grunt.log.warn( 'Source file "' + filepath + '" not found.' );
                    return false;
                } else {
                    return true;
                }
            } ).map( function( filepath ) {
                // Read file source.
                var oldFileContent = grunt.file.read( filepath ), /* read the file contents */
                    fileArray = helper.createFileArray( filepath ), /* convert file contents to an array */
                    tocArray, clearedArray;

                // if there's already a TOC, remove the old one
                clearedArray = helper.removeOldTOC( fileArray );

                // check the content and find the TOC entries
                tocArray = helper.getTOCArray( clearedArray );

                // write the new file with the TOC
                helper.writeNewFileWithTOC( clearedArray.join( tocDefines.eof ), tocArray, f.dest );

                return oldFileContent;
            } );

            // Print a success message.
            grunt.log.writeln( 'File "' + f.dest + '" created.' );
        } );
    } );
};
