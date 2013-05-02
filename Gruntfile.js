module.exports = function( grunt ){
    
    grunt.initConfig({
	pkg: grunt.file.readJSON("package.json"),
	uglify: {
	    options: {
		optimize: "uglify",
		mangle: false,
		preserveLicenseComments: false,
	    },
	    build: {
		src: "src/odin.js",
		dest: "build/odin.min.js"
	    }
	}
    });
    
    grunt.loadNpmTasks("grunt-contrib-uglify");
    
    grunt.registerTask("default", ["uglify"]);
};