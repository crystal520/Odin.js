if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"base/time",
	"core/components/component",
	"math/vec2",
	"core/physics/objects/pcircle",
	"core/physics/objects/prect"
    ],
    function( Class, Time, Component, Vec2 ){
        "use strict";
	
        
        function RigidBody( opts ){
            opts || ( opts = {} );
	    
            Component.call( this );
	    
	    this.mass = !!opts.mass ? opts.mass : 0;
            
            this.radius = opts.radius !== undefined ? opts.radius : 0.5;
	    this.extents = opts.extents instanceof Vec2 ? opts.extents : new Vec2( 0.5, 0.5 );
	    
	    switch( opts.shape ){
                case RigidBody.CIRCLE:
                    this.shape = new PCircle( this.radius );
                    break;
		
		case RigidBody.RECT:
                default:
                    this.shape = new PRect( this.extents.clone() );
                    break;
	    }
	    
	    opts.shape = this.shape;
	    this.body = new PRigidBody( opts );
        }
        
	Class.extend( RigidBody, Component );
	
	
	RigidBody.prototype.init = function(){
	    var body = this.body,
		gameObject = this.gameObject;
	    
	    body.position.copy( gameObject.position );
	    body.rotation = gameObject.rotation;
	};
	
	
	RigidBody.prototype.update = function(){
	    var body = this.body,
		gameObject = this.gameObject;
	    
	    gameObject.position.copy( body.position );
	    gameObject.rotation = body.rotation;
	};
	
	
	RigidBody.CIRCLE = 0;
	RigidBody.RECT = 1;
	
        
        return RigidBody;
    }
);