if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"math/vec2",
	"physics2d/constraints/pequation2d"
    ],
    function( Class, Vec2, PEquation2D ){
	"use strict";
	
	var mMin = Math.min,
	    mMax = Math.max;
	
	
	function PFrictionEquation2D( bi, bj ){
	    
	    PEquation2D.call( this, bi, bj );
	    
	    this.ri = new Vec2;
	    this.rj = new Vec2;
	    this.t = new Vec2;
	    
	    this.p = new Vec2;
	}
	
	Class.extend( PFrictionEquation2D, PEquation2D );
	
	
	PFrictionEquation2D.prototype.solve = function( dt ){
	    var t = this.t, p = this.p,
		bi = this.bi, bj = this.bj,
		ri = this.ri, rj = this.rj,
		
		vi = bi.velocity, vj = bj.velocity,
		wi = bi.angularVelocity, wj = bi.angularVelocity;
	};
	
	
	return PFrictionEquation2D;
    }
);