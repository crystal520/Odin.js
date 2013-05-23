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
	
	
	function PContact2D( bi, bj ){
	    
	    PEquation2D.call( this, bi, bj, 0, 1000000 );
	    
	    this.elasticity = 0;
	    
	    this.ni = new Vec2;
	    
	    this.ri = new Vec2;
	    this.rj = new Vec2;
	    
	    this.penetration = new Vec2;
	}
	
	Class.extend( PContact2D, PEquation2D );
	
	
	PContact2D.prototype.computeB = function(){
	    var tmp1 = new Vec2,
		tmp2 = new Vec2;
	    
	    return function( dt ){
		var n = this.ni,
		    a = this.a, b = this.b,
		    bi = this.bi, bj = this.bj,
		    ri = this.ri, rj = this.rj,
		    
		    vi = bi.velocity, wi = bi.angularVelocity, fi = bi.force, ti = bi.torque,
		    vj = bj.velocity, wj = bj.angularVelocity, fj = bj.force, tj = bj.torque,
		    
		    penetration = this.penetration,
		    invMassi = bi.invMass,
		    invMassj = bj.invMass,
		    B, Gq, GW, GiMf, e, ep1;
		
		penetration.set( 0, 0 );
		penetration.add( bj.position ).add( rj );
		penetration.sub( bi.position ).sub( ri );
		
		this.elasticity = e = mMin( bi.elasticity, bj.elasticity );
		ep1 = e + 1;
		
		Gq = n.dot( penetration );
		
		GW = ep1 * vj.dot(n) - ep1 * vi.dot(n) + wj - wi;
		GiMf = fj.dot(n) * invMassj - fi.dot(n) * invMassi + tj - ti;
		
		B = -Gq * a - GW * b - dt * GiMf;
		
		return B;
	    };
	}();
	
	
	PContact2D.prototype.computeC = function(){
	    var tmp1 = new Vec2,
		tmp2 = new Vec2;
	    
	    return function(){
		var bi = this.bi, bj = this.bj,
		    invMassi = bi.invMass,
		    invMassj = bj.invMass,
		    C = invMassi + invMassj + this.eps;
		
		return C;
	    };
	}();
	
	
	PContact2D.prototype.computeGWlambda = function(){
	    var ulambda = new Vec2;
	    
	    return function(){
		var bi = this.bi, bj = this.bj,
		    GWlambda = 0;
		
		ulambda.vsub( bj.vlambda, bi.vlambda );
		GWlambda += ulambda.dot(this.ni);
		
		if( bi.wlambda ){
		    GWlambda -= bi.wlambda.cross( this.ri );
		}
		if( bj.wlambda ){
		    GWlambda += bi.wlambda.cross( this.rj );
		}
		
		return GWlambda;
	    };
	}();
	
	
	PContact2D.prototype.addToWlambda = function(){
	    var tmp1 = new Vec2,
		tmp2 = new Vec2;
	    
	    return function( deltalambda ){
		var bi = this.bi, bj = this.bj,
		    invMassi = bi.invMass, invMassj = bj.invMass,
		    n = this.ni;
		
		tmp1.copy( n ).smul( invMassi * deltalambda );
		bi.vlambda.sub( tmp1 );
		
		tmp2.copy( n ).smul( invMassj * deltalambda );
		bj.vlambda.add( tmp2 );
		
		if( bi.wlambda ){
		    bi.wlambda.sub( tmp1 );
		}
		if( bj.wlambda ){
		    bj.wlambda.sub( tmp2 );
		}
	    };
	}();
	
	
	return PContact2D;
    }
);