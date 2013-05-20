if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"math/mathf",
	"math/vec2"
    ],
    function( Class, Mathf, Vec2 ){
	"use strict";
	
	var mMin = Math.min;
	
	
	function PContact2D( a, b ){
	    
	    Class.call( this );
	    
	    this.a = a;
	    this.b = b;
	    
	    this.na = new Vec2;
	    
	    this.ca = new Vec2;
	    this.cb = new Vec2;
	    
	    this.p = new Vec2;
	}
	
	Class.extend( PContact2D, Class );
	
	
	PContact2D.prototype.solve = function(){
	    var vec = new Vec2,
		impulse = new Vec2;
	    
	    return function( dt ){
		var a = this.a, b = this.b,
		    na = this.na, ca = this.ca, cb = this.cb,
		    p = this.p,
		    j, vn, e = mMin( a.elasticity, b.elasticity );
		
		p.set( 0, 0 );
		p.add( b.position );
		p.add( cb );
		p.sub( a.position );
		p.sub( ca );
		
		vec.vsub( b.velocity, a.velocity );
		vn = vec.dot( na );
		
		j = ( -( 1 + e ) * vn ) / ( a.invMass + b.invMass );
		
		impulse.copy( na ).smul(j);
		
		a.velocity.sub( vec.copy( impulse ).smul( a.invMass ) );
		b.velocity.add( vec.copy( impulse ).smul( b.invMass ) );
	    };
	}();
	
	
	return PContact2D;
    }
);