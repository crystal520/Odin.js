({
    include: "./node_modules/requirejs/require.js",
    
    baseUrl: "./src/",
    name: "odin",
    
    optimize: "uglify2",
    uglify2: {
	
        output: {
	    beautify: true
	},
	compress: {
	    sequences: false
	},
	warnings: true,
	mangle: false
    },
    
    out: "./build/odin.js",
})