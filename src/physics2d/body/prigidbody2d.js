if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"math/vec2",
	"math/aabb2",
	"physics2d/body/pparticle2d"
    ],
    function( Class, Vec2, AABB2, PParticle2D ){
	"use strict";
	
	
	function PRigidBody2D( opts ){
	    opts || ( opts = {} );
	    
	    PParticle2D.call( this, opts );
	    
	    this.shape = opts.shape !== undefined ? opts.shape : undefined;
	    
	    this.angularVelocity = opts.angularVelocity !== undefined ? opts.angularVelocity : 0;
	    this.angularDamping = opts.angularDamping !== undefined ? opts.angularDamping : 0;
	    
	    this.torque = 0;
	    
	    this.aabb = new AABB2;
	}
	
	Class.extend( PRigidBody2D, PParticle2D );
	
	
	PRigidBody2D.prototype.applyForce = function(){
	    
	};
	
	
	return PRigidBody2D;
    }
);