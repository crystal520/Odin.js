if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"math/mathf",
	"math/vec2"
    ],
    function( Class, Vec2 ){
        "use strict";
        
        
        function Body( mass ){
	    
	    Class.call( this );
	    
	    this.position = new Vec2;
	    this.velocity = new Vec2;   
	    this.force = new Vec2;
	    
	    this.mass = mass || 1;
	    this.invMass = mass > 0 ? 1 / mass : 0;
	    
	    this.rotation = 0;
	    this.angularVelocity = 0;
	    this.torque = 0;
	    
	    this.inertia = 1;
	    this.invInertia = inertia > 0 ? 1 / inertia : 1;
	}
	
	Body.prototype = Object.create( Class.prototype );
        Body.prototype.constructor = Body;
	
	
        Body.prototype.integrate = function( dt ){
	    this.velocity.add( this.force.smul( this.invMass * dt ) );
	    this.position.add( this.velocity.smul( dt ) );
	    this.force.zero();
	};
	
        
        return Body;
    }
);