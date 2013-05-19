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
	
	
	PContact2D.prototype.solve = function( dt ){
	    var a = this.a, b = this.b,
		na = this.na, ca = this.ca, cb = this.cb,
		p = this.p;
	    
	    p.set( 0, 0 );
	    p.add( b.position );
	    p.add( cb );
	    p.sub( a.position );
	    p.sub( ca );
	    
	    console.log(p+"");
	};
	
	
	return PContact2D;
    }
);