if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"math/bounds",
	"math/vec2"
    ],
    function( Class, Bounds, Vec2 ){
	"use strict";
	
	
        function PRigidBody( opts ){
            opts || ( opts = {} );
            
            Class.call( this );
	    
	    this.shape = opts.shape !== undefined ? opts.shape : undefined;
	    
	    this.position = opts.position instanceof Vec2 ? opts.position : new Vec2;
	    this.rotation = opts.rotation !== undefined ? opts.rotation : 0;
	    
	    this.velocity = opts.velocity instanceof Vec2 ? opts.velocity : new Vec2;
	    this.angularVelocity = opts.angularVelocity !== undefined ? opts.angularVelocity : 0;
	    
	    this.mass = opts.mass !== undefined ? opts.mass : 1;
	    this.invMass = this.mass !== 0 ? 1 / this.mass : 0;
	    
	    this.linearDamping = opts.linearDamping instanceof Vec2 ? opts.angularDamping : new Vec2;
	    this.angularDamping = opts.angularDamping !== undefined ? opts.angularDamping : 0;
	    
	    this.force = new Vec2;
	    this.torque = 0;
	    
	    this.aabb = new Bounds;
        }
        
	Class.extend( PRigidBody, Class );
	
	
	PRigidBody.prototype.calculateAABB = function(){
	    var aabb = this.aabb;
	    
	    aabb.copy( this.shape.aabb );
	    aabb.rotate( this.rotation );
	    
	    return this;
	};
	
	
	PRigidBody.static = 0;
	PRigidBody.kinematic = 1;
	PRigidBody.dynamic = 2;
	
        
        return PRigidBody;
    }
);