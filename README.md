# grunt-csstoc

> Generate table of contents (TOC) for CSS files

## Getting Started
This plugin requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-csstoc --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-csstoc');
```

## The "csstoc" task

### Overview
In your project's Gruntfile, add a section named `csstoc` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  csstoc: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
})
```

### Options

#### options.sectionString
Type: `String`
Default value: `'section'`

A string value that is used to do identify TOC entries.

### Usage Examples

#### Default Options
In this example, the PlugIn will read all the `@tocitem` entries from the CSS file and generates the TOC from these entries.

```js
grunt.initConfig( {
  csstoc: {
    options: {
      sectionString: 'tocitem'
    },
    files: {
      'dest/mycss.css': 'src/mycss.css',
    },
  },
} )
```

#### CSS File
How the TOC entries should look like:
```css
/**
 * @section 1. Foo
 **/

.foo {
    height: 20px
}

/**
 * @section 2. Bar
 **/

/**
 * @section 2.1 Subentry
 **/
.foo .bar {
    background-color: red
}
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
* 2013-06-30   v0.1.0   First official release, still **BETA**
