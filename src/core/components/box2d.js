if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"math/vec2",
	"core/components/renderable2d",
    ],
    function( Class, Vec2, Renderable2D ){
        "use strict";
	
        
        function Box2D( opts ){
            opts || ( opts = {} );
	    
            Renderable2D.call( this, opts );
	    
	    this.extents = opts.extents instanceof Vec2 ? opts.extents : new Vec2( 0.5, 0.5 );
	    
	    this.updateBox();
        }
        
	Class.extend( Box2D, Renderable2D );
	
        
        return Box2D;
    }
);