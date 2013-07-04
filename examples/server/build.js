({
    include: "../../requirejs/require.js",
    
    baseUrl: "./node_modules/odin/src/",
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
    
    out: "./client/odin.js",
})