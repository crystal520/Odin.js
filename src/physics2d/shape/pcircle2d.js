if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"math/vec2",
	"physics2d/shape/pshape2d"
    ],
    function( Class, Vec2, PShape2D ){
        "use strict";
	
	var PI = Math.PI;
	
        
	function PCircle2D( radius ){
	    
	    PShape2D.call( this );
	    
	    this.type = PShape2D.CIRCLE;
	    
	    this.radius = radius !== undefined ? radius : 0.5;
	    
	    this.calculateAABB();
	    this.calculateBoundingRadius();
	    this.calculateVolume();
	}
	
	Class.extend( PCircle2D, PShape2D );
	
	
	PCircle2D.prototype.calculateAABB = function(){
	    var r = this.radius,
		aabb = this.aabb, min = aabb.min, max = aabb.max;
	    
	    min.x = min.y = -r;
	    max.x = max.y = r;
	};
	
	
	PCircle2D.prototype.calculateWorldAABB = function( position, rotation, aabb ){
	    var r = this.radius,
		min = aabb.min, max = aabb.max,
		x = position.x, y = position.y;
	    
	    min.x = x - r;
	    min.y = y - r;
	    max.x = x + r;
	    max.y = r + y;
	};
	
	
	PCircle2D.prototype.calculateInertia = function( mass ){
	    var r = this.radius;
	    
	    return mass * r * r * 0.4;
	};
	
	
	PCircle2D.prototype.calculateBoundingRadius = function(){
	    
	    this.boundingRadius = this.radius;
	};
	
	
	PCircle2D.prototype.calculateVolume = function(){
	    var r = this.radius;
	    
	    this.volume = PI * r * r;
	};
	
	
	PCircle2D.prototype.toJSON = function(){
	    var json = this._JSON;
	    
	    json.type = "PCircle2D";
	    json._SERVER_ID = this._id;
	    
	    json.shapeType = this.type;
	    
	    json.aabb = this.aabb;
	    json.volume = this.volume;
	    json.boundingRadius = this.boundingRadius;
	    
	    json.radius = this.radius;
	    
	    return json;
	};
	
	
	PCircle2D.prototype.fromJSON = function( json ){
	    
	    this.type = json.shapeType;
	    this._SERVER_ID = json._SERVER_ID;
	    
	    this.aabb.fromJSON( json.aabb );
	    this.volume = json.volume;
	    this.boundingRadius = json.boundingRadius;
	    
	    this.radius = json.radius;
	    
	    return this;
	};
	
        
        return PCircle2D;
    }
);