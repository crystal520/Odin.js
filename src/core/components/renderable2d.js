if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"core/components/component",
	"math/vec2"
    ],
    function( Class, Component, Vec2 ){
        "use strict";
	
        
        function Renderable2D( opts ){
            opts || ( opts = {} );
	    
            Component.call( this );
	    
	    this.visible = opts.visible !== undefined ? !!opts.visible : true;
	    this.offset = opts.offset instanceof Vec2 ? opts.offset : new Vec2;
	    
	    this._vertices = [];
	    
	    this._webgl = {
		vertices: undefined
	    }
        }
        
	Class.extend( Renderable2D, Component );
	
        
        return Renderable2D;
    }
);