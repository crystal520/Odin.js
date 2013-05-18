if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"math/mathf",
	"math/vec2",
	"physics2d/shape/pshape2d",
	"physics2d/body/pbody2d"
    ],
    function( Class, Mathf, Vec2, PShape2D, PBody2D ){
	"use strict";
	
	var vdot = Vec2.vdot,
	    abs = Math.abs,
	    sqrt = Math.sqrt,
	    mMin = Math.min,
	    mMax = Math.max,
	    sign = Mathf.sign,
	    contains = Mathf.contains,
	    CIRCLE = PShape2D.CIRCLE,
	    RECT = PShape2D.RECT,
	    POLY = PShape2D.POLY,
	    
	    DYNAMIC = PBody2D.DYNAMIC,
	    STATIC = PBody2D.STATIC,
	    KINEMATIC = PBody2D.KINEMATIC;
	
	
	function PSolver2D( world ){
	    
	    Class.call( this );
	    
	    this.world = world;
	}
	
	Class.extend( PSolver2D, Class );
	
	
	PSolver2D.prototype.solve = function(){
	    var world = this.world,
		pairsA = world._pairsA,
		pairsB = world._pairsB,
		aBody, bBody, aType, bType,
		i, il;
	    
	    for( i = 0, il = pairsA.length; i < il; i++ ){
		aBody = pairsA[i];
		bBody = pairsB[i];
		aType = aBody.shape.type; bType = bBody.shape.type;
		
		if( aType === RECT || aType === POLY ){
		    
		    if( bType === RECT || bType === POLY ){
			this.polyToPoly( aBody, bBody );
		    }
		}
	    }
	};
	
	
	PSolver2D.prototype.polyToPoly = function(){
	    var dist = new Vec2,
		axis = new Vec2;
	    
	    return function( a, b ){
		var aShape = a.shape, bShape = b.shape,
		    
		    aNormals = aShape.worldNormals, bNormals = bShape.worldNormals,
		    aNormalCount = aNormals.length, bNormalCount = bNormals.length,
		    
		    normal, overlap, minOverlap = Infinity, collision = false,
		    i, il;
		
		for( i = 0, il = aNormalCount + bNormalCount; i < il; i++ ){
		    if( i < aNormalCount ){
			normal = aNormals[i];
		    }
		    else{
			normal = bNormals[ i - aNormalCount ];
		    }
		    
		    aShape.project( normal );
		    bShape.project( normal );
		    
		    if( isOverlap( aShape.min, aShape.max, bShape.min, bShape.max ) ){
			collision = true;
		    }
		    else{
			break;
		    }
		    
		    overlap = getOverlap( aShape.min, aShape.max, bShape.min, bShape.max );
		    
		    if( overlap < minOverlap ){
			minOverlap = overlap;
			axis.copy( normal );
			
			dist.vsub( b.position, a.position );
			
			if( dist.dot( axis ) > 0 ){
			    axis.negate();
			}
		    }
		}
		
		if( collision ){
		    this.resolve( a, b, axis, minOverlap );
		}
	    };
	}();
	
	
	PSolver2D.prototype.resolve = function(){
	    var vec = new Vec2,
		mtv = new Vec2,
		newVel = new Vec2;
	    
	    return function( aBody, bBody, axis, overlap ){
		var ap = aBody.position, bp = bBody.position,
		    ae = aBody.elasticity, be = bBody.elasticity,
		    av = aBody.velocity, bv = bBody.velocity,
		    am = aBody.mass, bm = bBody.mass,
		    
		    m = am + bm,
		    invM = 1 / m,
		    vx = av.x + bv.x,
		    vy = av.y + bv.y,
		    
		    KEx = 0.5 * m * vx * vx,
		    KEy = 0.5 * m * vy * vy;
		
		newVel.x = sqrt( 2 * ae * KEx * invM );
		newVel.y = sqrt( 2 * ae * KEy * invM );
		
		mtv.copy( axis ).smul( -overlap );
		vec.copy( bp ).add( mtv );
		
		aBody.applyImpulse( newVel, vec );
		ap.add( vec.copy( axis ).smul( overlap ) );
		
		newVel.x = sqrt( 2 * be * KEx * invM );
		newVel.y = sqrt( 2 * be * KEy * invM );
		
		mtv.copy( axis ).smul( overlap );
		vec.copy( bp ).add( mtv );
		
		bBody.applyImpulse( newVel, vec );
		bp.add( vec.copy( axis ).smul( -overlap ) );
	    };
	}();
	
	
	function isOverlap( aMin, aMax, bMin, bMax ){
	    
	    return ( bMin < aMax || aMin < bMax );
	};
	
	
	function getOverlap( aMin, aMax, bMin, bMax ){
	    
	    if( aMin <= bMin && bMin <= aMax ){
		return mMin( aMax, bMax ) - bMin;
	    }
	    
	    return mMin( aMax, bMax ) - aMin;
	};
	
	
	return PSolver2D;
    }
);