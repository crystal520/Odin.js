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
	
	var abs = Math.abs;
	
        
	function PFriction2D( bi, bj, slipForce ){
	    
	    PEquation2D.call( this, bi, bj, -slipForce, slipForce );
	    
	    this.t = new Vec2;
	    
	    this.ri = new Vec2;
	    this.rj = new Vec2;
	    
	    this.rixt = 0;
	    this.rjxt = 0;
	    
	    this.stiffness = 1e7;
	    this.relaxation = 3;
	}
	
	Class.extend( PFriction2D, PEquation2D );
	
	
	PFriction2D.prototype.calculateB = function( h ){
	    var b = this.b,
		t = this.t, tx = t.x, ty = t.y,
		
		ri = this.ri, rix = ri.x, riy = ri.y,
		rj = this.rj, rjx = rj.x, rjy = rj.y,
		
		bi = this.bi,
		invMassi = bi.invMass, invInertiai = bi.invInertia,
		vi = bi.velocity, fi = bi.force,
		wi = bi.angularVelocity, ti = bi.torque,
		
		bj = this.bj,
		invMassj = bj.invMass, invInertiaj = bj.invInertia,
		vj = bj.velocity, fj = bj.force,
		wj = bj.angularVelocity, tj = bj.torque,
		
		rixt = rix * ty - riy * tx,
		rjxt = rjx * ty - rjy * tx,
		
		GWx = vj.x + ( -wj * rjy ) - vi.x - ( -wi * riy ),
		GWy = vj.y + ( wj * rjx ) - vi.y - ( wi * rix ),
		GW = GWx * tx + GWy * ty,
		
		GiMfx = fj.x * invMassj + ( -tj * rjy * invInertiaj ) - fi.x * invMassi - ( -ti * riy * invInertiai ),
		GiMfy = fj.y * invMassj + ( tj * rjx * invInertiaj ) - fi.y * invMassi - ( ti * rix * invInertiai ),
		GiMf = GiMfx * tx + GiMfy * ty;
		
	    this.rixt = rixt;
	    this.rjxt = rjxt;
	    
	    return -b * GW - h * GiMf;
	};
	
	
	PFriction2D.prototype.calculateC = function(){
	    var t = this.t, tx = t.x, ty = t.y,
		
		bi = this.bi,
		bj = this.bj,
		
		ri = this.ri,
		rj = this.rj,
		
		rixt = this.rixt,
		rjxt = this.rjxt,
		
		C = bi.invMass + bj.invMass + this.eps;
	    
	    C += bi.invInertia * rixt * rixt;
	    C += bj.invInertia * rjxt * rjxt;
	    
	    return C;
	};
	
	
	PFriction2D.prototype.calculateGWlambda = function(){
	    var t = this.t, tx = t.x, ty = t.y,
		
		ri = this.ri,
		rj = this.rj,
		
		bi = this.bi,
		vlambdai = bi.vlambda,
		wlambdai = bi.wlambda,
		
		bj = this.bj,
		vlambdaj = bj.vlambda,
		wlambdaj = bj.wlambda,
		
		ulambdax = vlambdaj.x - vlambdai.x,
		ulambday = vlambdaj.y - vlambdai.y,
		
		GWlambda = ulambdax * tx + ulambday * ty;
	    
	    if( wlambdai !== undefined ){
		GWlambda -= wlambdai * this.rixt;
	    }
	    if( wlambdaj !== undefined ){
		GWlambda += wlambdaj * this.rjxt;
	    }
	    
	    return GWlambda;
	};
	
	
	PFriction2D.prototype.addToWlambda = function( deltalambda ){
	    var t = this.t, tx = t.x, ty = t.y,
		
		ri = this.ri,
		rj = this.rj,
		
		rixt = this.rixt,
		rjxt = this.rjxt,
		
		bi = this.bi,
		invMassi = bi.invMass,
		vlambdai = bi.vlambda,
		
		bj = this.bj,
		invMassj = bj.invMass,
		vlambdaj = bj.vlambda,
		
		lambdax = deltalambda * tx,
		lambday = deltalambda * ty;
	    
	    vlambdai.x -= lambdax * invMassi;
	    vlambdai.y -= lambday * invMassi;
	    
	    vlambdaj.x += lambdax * invMassj;
	    vlambdaj.y += lambday * invMassj;
	    
	    if( bi.wlambda !== undefined ){
		bi.wlambda -= ( ri.x * lambday - ri.y * lambdax ) * bi.invInertia * rixt * rixt;
	    }
	    if( bj.wlambda !== undefined ){
		bj.wlambda += ( rj.x * lambday - rj.y * lambdax ) * bj.invInertia * rjxt * rjxt;
	    }
	};
	
        
        return PFriction2D;
    }
);