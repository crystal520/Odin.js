if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"math/mathf",
	"math/vec2",
	"physics2d/constraints/pequation2d"
    ],
    function( Class, Mathf, Vec2, PEquation2D ){
	"use strict";
	
	var sqrt = Math.sqrt,
	    mMin = Math.min,
	    mMax = Math.max;
	
	
	function PContact2D( bi, bj ){
	    
	    PEquation2D.call( this, bi, bj );
	    
	    this.ni = new Vec2;
	    
	    this.ri = new Vec2;
	    this.rj = new Vec2;
	    
	    this.penetration = new Vec2;
	}
	
	Class.extend( PContact2D, PEquation2D );
	
	
	PContact2D.prototype.solve = function(){
	    var vec = new Vec2,
		dist = new Vec2,
		impulse = new Vec2;
	    
	    return function( dt ){
		var ni = this.ni,
		    penetration = this.penetration,
		    bi = this.bi, bj = this.bj,
		    ri = this.ri, rj = this.rj,
		    
		    invMassi = bi.invMass, invMassj = bj.invMass,
		    vi = bi.velocity, vj = bj.velocity,
		    fi = bi.force, fj = bj.force,
		    wi = bi.angularVelocity || 0, wj = bi.angularVelocity || 0,
		    ti = bi.torque || 0, tj = bj.torque || 0,
		    
		    e = 1 + mMin( bi.elasticity, bj.elasticity );
		
		penetration.x = 0; penetration.y = 0;
		penetration.add( bj.position ).add( rj );
		penetration.sub( bi.position ).sub( ri );
	    };
	}();
	
	
	PContact2D.prototype.solve = function(){
	    var vec = new Vec2,
		dist = new Vec2,
		impulse = new Vec2;
	    
	    return function( dt ){
		var ni = this.ni,
		    penetration = this.penetration,
		    bi = this.bi, bj = this.bj,
		    ri = this.ri, rj = this.rj,
		    
		    invMassi = bi.invMass, invMassj = bj.invMass,
		    vi = bi.velocity, vj = bj.velocity,
		    fi = bi.force, fj = bj.force,
		    wi = bi.angularVelocity || 0, wj = bi.angularVelocity || 0,
		    ti = bi.torque || 0, tj = bj.torque || 0,
		    
		    e = 1 + mMin( bi.elasticity, bj.elasticity ),
		    GW, GiMf, B
		
		penetration.x = 0; penetration.y = 0;
		penetration.add( bj.position ).add( rj );
		penetration.sub( bi.position ).sub( ri );
	    };
	}();
	
	
	PContact2D.prototype.calculateB = function(){
	    
	    return function( h ){
		var a = this.a,
		    b = this.b,
		    n = this.ni,
		    penetration = this.penetration,
		    bi = this.bi, bj = this.bj,
		    ri = this.ri, rj = this.rj,
		    
		    invMassi = bi.invMass, invMassj = bj.invMass,
		    vi = bi.velocity, vj = bj.velocity,
		    fi = bi.force, fj = bj.force,
		    wi = bi.angularVelocity || 0, wj = bi.angularVelocity || 0,
		    ti = bi.torque || 0, tj = bj.torque || 0,
		    
		    e = 1 + mMin( bi.elasticity, bj.elasticity ),
		    Gq, GW, GiMf, B
		
		penetration.x = 0; penetration.y = 0;
		penetration.add( bj.position ).add( rj );
		penetration.sub( bi.position ).sub( ri );
		
		Gq = n.dot( penetration );
		GW = e * vj.dot( n ) - e * vi.dot( n );
		GiMf = fj.dot( n )* invMassj - fi.dot( n ) * invMassi;
		
		B = -a * Gq - b * GW - h * GiMf;
		
		return B;
	    };
	}();
	
	
	PContact2D.prototype.calculateC = function(){
	    
	    return function(){
		var eps = this.eps,
		    bi = this.bi, bj = this.bj,
		    invMassi = bi.invMass, invMassj = bj.invMass,
		    C;
		
		C = invMassi + invMassj + eps;
		
		return C;
	    };
	}();
	
	
	PContact2D.prototype.calculateGWlambda = function(){
	    var ulambda = new Vec2;
	    
	    return function(){
		var bi = this.bi, bj = this.bj,
		    GWlambda = 0;
		    
		ulambda.vsub( bj.vlambda, bi.vlambda );
		GWlambda += ulambda.dot( this.ni );
		
		if( bi.wlambda !== undefined ){
		    GWlambda -= bi.wlambda;
		}
		if( bj.wlambda !== undefined ){
		    GWlambda += bj.wlambda;
		}
		
		return GWlambda;
	    };
	}();
	
	
	PContact2D.prototype.addWlambda = function(){
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
		
		if( bi.wlambda !== undefined ){
		    bi.wlambda -= tmp1.cross( n );
		}
		if( bj.wlambda !== undefined ){
		    bj.wlambda += tmp2.cross( n );
		}
	    };
	}();
	
	
	return PContact2D;
    }
);