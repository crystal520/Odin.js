if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"base/time",
	"math/color",
	"math/vec2",
	"physics2d/pworld2d"
    ],
    function( Class, Time, Color, Vec2, PWorld2D ){
        "use strict";
        
        
        function World2D( opts ){
	    opts || ( opts = {} );
            
            Class.call( this );
            
            this.name = opts.name || ( this._class +"-"+ this._id );
	    
            this.background = opts.background instanceof Color ? opts.background : new Color( 0.5, 0.5, 0.5, 1 );
	    
            this.gravity = opts.gravity instanceof Vec2 ? opts.gravity : new Vec2( 0, -9.801 );
	    
	    this.pworld = new PWorld2D( opts );
        }
        
	Class.extend( World2D, Class );
        
        
        World2D.prototype.add = function( rigidbody ){
	    var body = rigidbody.body;
	    
	    body.userData = rigidbody;
	    this.pworld.add( body );
        };
        
        
        World2D.prototype.remove = function( rigidbody ){
	    var body = rigidbody.body;
	    
	    body.userData = undefined;
	    this.pworld.remove( body );
        };
        
        
        World2D.prototype.update = function(){
	    
	    this.pworld.step( Time.delta );
	};
        
        
        World2D.prototype.toJSON = function(){
            var json = this._JSON;
	    
	    json.type = "World2D";
	    json.name = this.name;
	    json._SERVER_ID = this._id;
	    json.gravity = this.gravity
	    json.background = this.background
	    json.pworld = this.pworld
	    
	    return json;
        };
        
        
        World2D.prototype.fromJSON = function( json ){
            
	    this.name = json.name;
	    this._SERVER_ID = json._SERVER_ID;
	    this.gravity.fromJSON( json.gravity );
	    this.background.fromJSON( json.background );
	    this.pworld.fromJSON( json.pworld );
	    
	    return this;
        };
        
        
        return World2D;
    }
);