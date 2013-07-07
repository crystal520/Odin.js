if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"base/utils",
	"core/components/component",
	"math/vec2",
	"math/color"
    ],
    function( Class, Utils, Component, Vec2, Color ){
        "use strict";
	
	var has = Utils.has,
	    ceil = Math.ceil,
	    sqrt = Math.sqrt,
	    cos = Math.cos,
	    sin = Math.sin,
	    TWO_PI = Math.PI * 2;
	
        
        function Renderable2D( opts ){
            opts || ( opts = {} );
	    
            Component.call( this );
	    
	    this.visible = opts.visible !== undefined ? !!opts.visible : true;
	    this.offset = opts.offset instanceof Vec2 ? opts.offset : new Vec2;
	    
	    this.alpha = opts.alpha !== undefined ? opts.alpha : 1;
	    
	    this.fill = opts.fill !== undefined ? !!opts.fill : true;
	    this.color = opts.color instanceof Color ? opts.color : new Color;
	    
	    this.line = opts.line !== undefined ? !!opts.line : false;
	    this.lineColor = opts.lineColor instanceof Color ? opts.lineColor : new Color;
	    this.lineWidth = opts.lineWidth !== undefined ? opts.lineWidth : 0.01;
	    
	    this._data = {
		needsUpdate: true,
		dynamic: opts.dynamic !== undefined ? !!opts.dynamic : false,
		vertices: [],
		vertexBuffer: undefined,
		indices: [],
		indexBuffer: undefined,
		uvs: [],
		uvBuffer: undefined
	    };
        }
        
	Class.extend( Renderable2D, Component );
        
	
	Renderable2D.prototype.calculateSprite = function(){
	    var data = this._data,
		w = this.width * 0.5,
		h = this.height * 0.5,
		uvs = data.uvs || [],
		vertices = data.vertices,
		indices = data.indices;
	    
	    vertices.push(
		w, h,
		-w, h,
		-w, -h,
		w, -h
	    );
	    indices.push(
		0, 1, 2,
		0, 2, 3
	    );
	    uvs.push(
		1, 0,
		0, 0,
		0, 1,
		1, 1
	    );
	};
        
	
	Renderable2D.prototype.calculateBox = function(){
	    var data = this._data,
		extents = this.extents,
		w = extents.x, h = extents.y,
		vertices = data.vertices,
		indices = data.indices;
	    
	    vertices.push(
		w, h,
		-w, h,
		-w, -h,
		w, -h
	    );
	    indices.push(
		0, 1, 2,
		0, 2, 3
	    );
	};
        
	
	Renderable2D.prototype.calculateCircle = function(){
	    var data = this._data,
		radius = this.radius,
		vertices = data.vertices,
		indices = data.indices,
		segments = ceil( sqrt( radius * radius * 1024 ) ),
		segment, i, il;
	    
	    vertices.push( 0, 0 );
	    
	    for( i = 0; i <= segments; i++ ){
		segment = i / segments * TWO_PI;;
		
		vertices.push( cos( segment ) * radius, sin( segment ) * radius );
	    }
	    for( i = 1; i <= segments; i++ ){
		indices.push( i, i + 1, 0 );
	    }
	};
        
	
	Renderable2D.prototype.calculatePoly = function(){
	    var data = this._data,
		tvertices = this.vertices,
		vertices = data.vertices,
		indices = data.indices,
		vertex, i;
	    
	    vertices.push( 0, 0 );
	    
	    for( i = 0, il = tvertices.length; i < il; i++ ){
		vertex = tvertices[i];
		vertices.push( vertex.x, vertex.y );
	    }
	    for( i = 2, il = vertices.length; i < il; i++ ){
		indices.push( 0, i - 1, i );
	    }
	};
        
	
	Renderable2D.prototype.copy = function( other ){
	    
	    this.visible = other.visible;
	    this.offset.copy( other.offset );
	    
	    this.alpha = other.alpha;
	    
	    this.fill = other.fill;
	    this.color.copy( other.color );
	    
	    this.line = other.line;
	    this.lineColor.copy( other.lineColor );
	    this.lineWidth = other.lineWidth;
	    
	    return this;
	};
        
        
        Renderable2D.prototype.toJSON = function(){
            var json = this._JSON;
	    
	    json.type = "Renderable2D";
	    json._SERVER_ID = this._id;
	    
	    json.visible = this.visible;
	    json.offset = this.offset;
	    
	    json.alpha = this.alpha;
	    
	    json.fill = this.fill;
	    json.color = this.color;
	    
	    json.line = this.line;
	    json.lineColor = this.lineColor;
	    json.lineWidth = this.lineWidth;
	    
	    return json;
        };
        
        
        Renderable2D.prototype.fromJSON = function( json ){
	    
	    this._SERVER_ID = json._SERVER_ID;
	    
            this.visible = json.visible;
	    this.offset.fromJSON( json.offset );
	    
	    this.alpha = json.alpha;
	    
	    this.fill = json.fill;
	    this.color.fromJSON( json.color );
	    
	    this.line = json.line;
	    this.lineColor.fromJSON( json.lineColor );
	    this.lineWidth = json.lineWidth;
	    
	    return this;
        };
	
        
        return Renderable2D;
    }
);