if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"math/aabb2"
    ],
    function( Class, AABB2 ){
	"use strict";
	
	
	function PShape2D(){
	    
	    Class.call( this );
	    
	    this.aabb = new AABB2;
	    
	    this.volume = 0;
	    this.volumeNeedsUpdate = true;
	    
	    this.boundingRadius = 0;
	    this.boundingRadiusNeedsUpdate = true;
	}
	
	Class.extend( PShape2D, Class );
	
	
	PShape2D.prototype.calculateBoundingRadius = function(){};
	
	
	PShape2D.prototype.getBoundingRadius = function(){
	    
	    if( this.boundingRadiusNeedsUpdate ){
		this.calculateBoundingRadius();
	    }
	    
	    return this.boundingRadius;
	};
	
	
	PShape2D.prototype.calculateVolume = function(){
	    return this;
	};
	
	
	PShape2D.prototype.getVolume = function(){
	    
	    if( this.volumeNeedsUpdate ){
		this.calculateVolume();
	    }
	    
	    return this.volume;
	};
	
	
	PShape2D.prototype.calculateAABB = function(){
	    return this;
	};
	
	
	PShape2D.prototype.calculateInertia = function(){
	    return this;
	};
	
	
	PShape2D.CIRCLE = 0;
	PShape2D.RECT = 1;
	PShape2D.POLY = 2;
	
	
	return PShape2D;
    }
);