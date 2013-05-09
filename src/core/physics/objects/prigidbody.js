if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"math/bounds",
	"math/vec2",
	"core/physics/objects/pparticle"
    ],
    function( Class, Bounds, Vec2, PParticle ){
	"use strict";
	
	
        function PRigidBody( opts ){
            opts || ( opts = {} );
            
            PParticle.call( this, opts );
	    
	    this.shape = opts.shape !== undefined ? opts.shape : undefined;
	    
	    this.rotation = opts.rotation !== undefined ? opts.rotation : 0;
	    
	    this.angularVelocity = opts.angularVelocity !== undefined ? opts.angularVelocity : 0;
	    this.angularDamping = opts.angularDamping !== undefined ? opts.angularDamping : 0;
	    
	    this.torque = 0;
	    
	    this.aabb = new Bounds;
        }
        
	Class.extend( PRigidBody, PParticle );
	
	
	PRigidBody.prototype.calculateAABB = function(){
	    var aabb = this.aabb;
	    
	    aabb.copy( this.shape.aabb );
	    aabb.rotate( this.rotation );
	    
	    return this;
	};
	
        
        return PRigidBody;
    }
);