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
	
        
        function Poly2D( opts ){
            opts || ( opts = {} );
	    
            Renderable2D.call( this, opts );
	    
	    this.vertices = opts.vertices instanceof Array ? opts.vertices : [
		new Vec2( 0.5, 0.5 ),
		new Vec2( -0.5, 0.5 ),
		new Vec2( -0.5, -0.5 ),
		new Vec2( 0.5, -0.5 )
	    ];
	    
	    this.updatePoly();
        }
        
	Class.extend( Poly2D, Renderable2D );
	
        
        return Poly2D;
    }
);