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
	
	
	function PContact2D( bi, bj ){
	    
	    Class.call( this );
	    
	    this.bi = bi;
	    this.bj = bj;
	    
	    this.n = new Vec2;
	    
	    this.ri = new Vec2;
	    this.rj = new Vec2;
	    
	    this.penetration = new Vec2;
	}
	
	Class.extend( PContact2D, Class );
	
	
	PContact2D.prototype.solve = function(){
	    var dv = new Vec2;
	    
	    return function( dt ){
		var n = this.n,
		    penetration = this.penetration,
		    bi = this.bi,
		    invMassi = bi.invMass,
		    ri = this.ri,
		    rix = ri.x, riy = ri.y,
		    vi = bi.velocity,
		    wi = bi.angularVelocity,
		    wix = wi * ri.x, wiy = wi * ri.y,
		    
		    bj = this.bj,
		    invMassj = bj.invMass,
		    rj = this.rj,
		    rjx = rj.x, rjy = rj.y,
		    vj = bj.velocity,
		    wj = bj.angularVelocity,
		    wjx = wj * rj.x, wjy = wj * rj.y,
		    
		    vix = vi.x + wix,
		    viy = vi.y + wiy,
		    
		    vjx = vj.x + wjx,
		    vjy = vj.y + wjy,
		    e = 1 + mMin( bi.elasticity, bj.elasticity ),
		    vn, j;
		    
		dv.x = vix - vjx;
		dv.y = viy - vjy;
		
		vn = -dv.dot(n);
	    }
	}();
	
	
	return PContact2D;
    }
);