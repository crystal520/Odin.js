if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"math/vec2",
	"physics2d/constraints/pconstraint2d",
    ],
    function( Class, Vec2, PConstraint2D ){
        "use strict";
	
	var sqrt = Math.sqrt,
	    min = Math.min;
	
        
	function PFriction2D( bi, bj, slip ){
	    
	    PConstraint2D.call( this, bi, bj, -slip, slip );
	    
	    this.t = new Vec2;
	    
	    this.ri = new Vec2;
	    this.rj = new Vec2;
	}
	
	Class.extend( PFriction2D, PConstraint2D );
	
	
	PFriction2D.prototype.calculateB = function( h ){
	    var a = this.a, b = this.b, eps = this.eps,
		
		t = this.t,
		tx = t.x, ty = t.y,
		
		bi = this.bi,
		ri = this.ri,
		rix = ri.x, riy = ri.y,
		invMassi = bi.invMass,
		invInertiai = bi.invInertia,
		vi = bi.velocity, fi = bi.force,
		wi = bi.angularVelocity, ti = bi.torque,
		
		bj = this.bj,
		rj = this.rj,
		rjx = rj.x, rjy = rj.y,
		invMassj = bj.invMass,
		invInertiaj = bj.invInertia,
		vj = bj.velocity, fj = bj.force,
		wj = bj.angularVelocity, tj = bj.torque,
		
		dvx = vj.x + ( -wj * rjy ) - vi.x - ( -wi * riy ),
		dvy = vj.y + ( wj * rjx ) - vi.y - ( wi * rix ),
		
		dfx = fj.x * invMassj + ( -tj * rjy * invInertiaj ) - fi.x * invMassi - ( -ti * riy * invInertiai ),
		dfy = fj.y * invMassj + ( tj * rjx * invInertiaj ) - fi.y * invMassi - ( ti * rix * invInertiai ),
		
		Gq = 0,
		GW = dvx * tx + dvy * ty,
		GiMf = dfx * tx + dfy * ty,
		
		B = -a * Gq - b * GW - h * GiMf;
	    
	    return B;
	};
	
	
	PFriction2D.prototype.calculateC = function(){
	    var t = this.t,
		tx = t.x, ty = t.y,
		
		bi = this.bi,
		bj = this.bj,
		
		ri = this.ri,
		rj = this.rj,
		
		wi = bi.angularVelocity,
		wj = bj.angularVelocity,
		
		C = bi.invMass + bj.invMass + this.eps;
		
	    C += bi.invInertia * ( ri.x * ty - ri.y * tx );
	    C += bj.invInertia * ( rj.x * ty - rj.y * tx );
	    
	    return C;
	};
	
	
	PFriction2D.prototype.calculateRelativeLambda = function(){
	    var t = this.t,
		tx = t.x, ty = t.y,
		
		bi = this.bi,
		bj = this.bj,
		
		ri = this.ri,
		rj = this.rj,
		
		vlambdai = bi.vlambda,
		vlambdaj = bj.vlambda,
		
		lambdax = vlambdaj.x - vlambdai.x,
		lambday = vlambdaj.y - vlambdai.y,
		
		relativeLambda = lambdax * tx + lambday * ty;
	    
	    if( bi.wlambda !== undefined ){
		relativeLambda -= bi.wlambda * ( ri.x * ty - ri.y * tx );
	    }
	    if( bj.wlambda !== undefined ){
		relativeLambda += bj.wlambda * ( rj.x * ty - rj.y * tx );
	    }
	    
	    return relativeLambda;
	};
	
	
	PFriction2D.prototype.addToLambda = function( deltaLambda ){
	    var t = this.t,
		tx = t.x, ty = t.y,
		
		bi = this.bi,
		bj = this.bj,
		
		ri = this.ri,
		rj = this.rj,
		
		vlambdai = bi.vlambda,
		vlambdaj = bj.vlambda,
		invMassi = bi.invMass,
		invMassj = bj.invMass;
		
	    vlambdai.x -= deltaLambda * invMassi * tx;
	    vlambdai.y -= deltaLambda * invMassi * ty;
	    
	    vlambdaj.x += deltaLambda * invMassj * tx;
	    vlambdaj.y += deltaLambda * invMassj * ty;
	    
	    if( bi.wlambda !== undefined ){
		bi.wlambda -= deltaLambda * bi.invInertia * ( ri.x * ty - ri.y * tx );
	    }
	    if( bj.wlambda !== undefined ){
		bj.wlambda += deltaLambda * bj.invInertia * ( rj.x * ty - rj.y * tx );
	    }
	};
	
        
        return PFriction2D;
    }
);