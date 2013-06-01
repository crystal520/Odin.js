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
	
        
	function PContact2D( bi, bj ){
	    
	    PConstraint2D.call( this, bi, bj, 0, 1e6 );
	    
	    this.n = new Vec2;
	    
	    this.ri = new Vec2;
	    this.rj = new Vec2;
	    
	    this.rixn = 0;
	    this.rjxn = 0;
	}
	
	Class.extend( PContact2D, PConstraint2D );
	
	
	PContact2D.prototype.calculateB = function( h ){
	    var a = this.a, b = this.b, eps = this.eps,
		
		n = this.n,
		nx = n.x, ny = n.y,
		
		bi = this.bi,
		ri = this.ri,
		rix = ri.x, riy = ri.y,
		invMassi = bi.invMass,
		invInertiai = bi.invInertia,
		xi = bi.position, vi = bi.velocity, fi = bi.force,
		wi = bi.angularVelocity, ti = bi.torque,
		
		bj = this.bj,
		rj = this.rj,
		rjx = rj.x, rjy = rj.y,
		invMassj = bj.invMass,
		invInertiaj = bj.invInertia,
		xj = bj.position, vj = bj.velocity, fj = bj.force,
		wj = bj.angularVelocity, tj = bj.torque,
		
		e = 1 + min( bi.elasticity, bj.elasticity ),
		
		px = ( xj.x + rjx ) - ( xi.x + rix ),
		py = ( xj.y + rjy ) - ( xi.y + riy ),
		
		dvx = e * vj.x + ( -wj * rjy ) - e * vi.x - ( -wi * riy ),
		dvy = e * vj.y + ( wj * rjx ) - e * vi.y - ( wi * rix ),
		
		dfx = fj.x * invMassj + ( -tj * rjy * invInertiaj ) - fi.x * invMassi - ( -ti * riy * invInertiai ),
		dfy = fj.y * invMassj + ( tj * rjx * invInertiaj ) - fi.y * invMassi - ( ti * rix * invInertiai ),
		
		Gq = px * nx + py * ny,
		GW = dvx * nx + dvy * ny,
		GiMf = dfx * nx + dfy * ny,
		
		B = -a * Gq - b * GW - h * GiMf;
	    
	    this.rixn = rix * ny - riy * nx;
	    this.rjxn = rjx * ny - rjy * nx;
	    
	    return B;
	};
	
	
	PContact2D.prototype.calculateC = function(){
	    var n = this.n,
		nx = n.x, ny = n.y,
		
		bi = this.bi,
		bj = this.bj,
		
		invInertiai = bi.invInertia,
		invInertiaj = bj.invInertia,
		
		ri = this.ri,
		rj = this.rj,
		
		rixn = this.rixn,
		rjxn = this.rjxn,
		
		wi = bi.angularVelocity,
		wj = bj.angularVelocity,
		
		C = bi.invMass + bj.invMass + this.eps;
		
	    C += invInertiai * rixn;
	    C += invInertiaj * rjxn;
	    
	    return C;
	};
	
	
	PContact2D.prototype.calculateRelativeLambda = function(){
	    var n = this.n,
		nx = n.x, ny = n.y,
		
		bi = this.bi,
		bj = this.bj,
		
		ri = this.ri,
		rj = this.rj,
		
		rixn = this.rixn,
		rjxn = this.rjxn,
		
		vlambdai = bi.vlambda,
		vlambdaj = bj.vlambda,
		wlambdai = bi.wlambda,
		wlambdaj = bj.wlambda,
		
		lambdax = vlambdaj.x - vlambdai.x,
		lambday = vlambdaj.y - vlambdai.y,
		
		relativeLambda = lambdax * nx + lambday * ny;
	    
	    if( wlambdai !== undefined ){
		relativeLambda -= wlambdai * rixn;
	    }
	    if( wlambdaj !== undefined ){
		relativeLambda += wlambdaj * rjxn;
	    }
	    
	    return relativeLambda;
	};
	
	
	PContact2D.prototype.addToLambda = function( deltaLambda ){
	    var n = this.n,
		nx = n.x, ny = n.y,
		
		bi = this.bi,
		bj = this.bj,
		
		invInertiai = bi.invInertia,
		invInertiaj = bj.invInertia,
		
		ri = this.ri,
		rj = this.rj,
		
		rixn = this.rixn,
		rjxn = this.rjxn,
		
		vlambdai = bi.vlambda,
		vlambdaj = bj.vlambda,
		
		invMassi = bi.invMass,
		invMassj = bj.invMass;
		
	    vlambdai.x -= deltaLambda * invMassi * nx;
	    vlambdai.y -= deltaLambda * invMassi * ny;
	    
	    vlambdaj.x += deltaLambda * invMassj * nx;
	    vlambdaj.y += deltaLambda * invMassj * ny;
	    
	    if( bi.wlambda !== undefined ){
		bi.wlambda -= deltaLambda * invInertiai * rixn;
	    }
	    if( bj.wlambda !== undefined ){
		bj.wlambda += deltaLambda * invInertiaj * rjxn;
	    }
	};
	
        
        return PContact2D;
    }
);