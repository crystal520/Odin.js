if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"base/time",
	"math/color",
	"math/vec2"
    ],
    function( Class, Time, Color, Vec2 ){
        "use strict";
        
        
        function World( opts ){
	    opts || ( opts = {} );
            
            Class.call( this );
            
            this.name = opts.name || ( this._class +"-"+ this._id );
	    
            this.background = opts.background instanceof Color ? opts.background : new Color( 0.5, 0.5, 0.5, 1 );
	    
            this.gravity = opts.gravity instanceof Vec2 ? opts.gravity : new Vec2( 0, -9.801 );
        }
        
	Class.extend( World, Class );
        
        
        World.prototype.add = function( rigidbody ){
	    
        };
        
        
        World.prototype.remove = function( rigidbody ){
	    
        };
        
        
        World.prototype.update = function(){
	};
        
        
        return World;
    }
);