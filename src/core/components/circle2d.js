if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"core/components/renderable2d"
    ],
    function( Class, Renderable2D ){
        "use strict";
	
	var floor = Math.floor,
	    sqrt = Math.sqrt,
	    cos = Math.cos,
	    sin = Math.sin,
	    TWO_PI = Math.PI * 2;
	
        
        function Circle2D( opts ){
            opts || ( opts = {} );
	    
            Renderable2D.call( this, opts );
	    
	    this.radius = opts.radius !== undefined ? opts.radius : 0.5;
	    
	    this.updateCircle();
        }
        
	Class.extend( Circle2D, Renderable2D );
	
        
        return Circle2D;
    }
);