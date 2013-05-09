if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"base/time",
	"math/color",
	"math/vec2",
	"core/physics/pworld"
    ],
    function( Class, Time, Color, Vec2, PWorld ){
        "use strict";
        
        
        function World( opts ){
	    opts || ( opts = {} );
            
            Class.call( this );
            
            this.name = opts.name || ( this._class +"-"+ this._id );
	    
            this.background = opts.background instanceof Color ? opts.background : new Color( 0.5, 0.5, 0.5, 1 );
	    
            this.gravity = opts.gravity instanceof Vec2 ? opts.gravity : new Vec2( 0, -9.801 );
	    
	    this.pworld = new PWorld({ gravity: this.gravity });
        }
        
	Class.extend( World, Class );
        
        
        World.prototype.add = function( rigidbody ){
	    
	    this.pworld.add( rigidbody.body );
        };
        
        
        World.prototype.remove = function( rigidbody ){
	    
	    this.pworld.remove( rigidbody.body );
        };
        
        
        World.prototype.update = function(){
	    
	    this.pworld.step( Time.delta );
	};
        
        
        return World;
    }
);