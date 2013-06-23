if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"base/dom",
	"base/utils",
	"core/components/component",
	"math/vec2",
	"math/color"
    ],
    function( Class, Dom, Utils, Component, Vec2, Color ){
        "use strict";
	
	var createProgram = Dom.createProgram,
	    has = Utils.has,
	    floor = Math.floor,
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
		dynamic: opts.dynamic !== undefined ? !!opts.dynamic : false,
		texture: undefined,
		vertexBuffer: undefined,
		indexBuffer: undefined,
		vertices: [],
		verticesNeedUpdate: true,
		indices: [],
		indicesNeedUpdate: true
	    };
        }
        
	Class.extend( Renderable2D, Component );
	
	
	Renderable2D.prototype.updateCircle = function(){
	    var data = this._data, vertices = data.vertices, indices = data.indices,
		radius = this.radius, step = TWO_PI / ( floor( sqrt( radius * 128 ) ) ),
		next, i, il;
	    
	    vertices.push( 0, 0 );
	    
	    for( i = 0; i < TWO_PI; i += step ){
		vertices.push( cos(i) * radius, sin(i) * radius );
	    }
	    for( i = 0, il = vertices.length * 0.5; i < il; i++ ){
		next = i === il - 1 ? 1 : i + 2;
		
		indices.push( 0, i+1, next );
	    }
	    
	    data.verticesNeedUpdate = true;
	    data.indicesNeedUpdate = true;
	};
	
	
	Renderable2D.prototype.updateBox = function(){
	    var data = this._data, extents = this.extents, x = extents.x, y = extents.y;
	    
	    data.vertices.push(
		x, y,
		-x, y,
		-x, -y,
		x, -y
	    );
	    
	    data.indices.push(
		0, 1, 2,
		0, 2, 3
	    );
	    
	    data.verticesNeedUpdate = true;
	    data.indicesNeedUpdate = true;
	};
	
	
	Renderable2D.prototype.updatePoly = function(){
	    var verts = this.vertices, data = this._data,
		vertices = data.vertices, indices = data.indices,
		vertex, i, il;
		
	    for( i = 0, il = verts.length; i < il; i++ ){
		vertex = verts[i];
		vertices.push( vertex.x, vertex.y );
		
		indices.push( i, i+1, i+2 );
	    }
	    
	    data.verticesNeedUpdate = true;
	    data.indicesNeedUpdate = true;
	};
	
	
	Renderable2D.prototype.updateSprite = function(){
	    var data = this._data, w = this.width, h = this.height;
	    
	    data.vertices.push(
		w, h,
		-w, h,
		-w, -h,
		w, -h
	    );
	    
	    data.indices.push(
		0, 1, 2,
		0, 2, 3
	    );
	    
	    data.verticesNeedUpdate = true;
	    data.indicesNeedUpdate = true;
	};
	
	
	Renderable2D.prototype.setupBuffers = function( renderer ){
	    var gl = renderer.context,
		data = this._data,
		DRAW = data.dynamic ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW;
	    
	    if( !data.vertexBuffer || data.verticesNeedUpdate ){
		data.vertexBuffer = data.vertexBuffer || gl.createBuffer();
		gl.bindBuffer( gl.ARRAY_BUFFER, data.vertexBuffer );
		gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( data.vertices ), DRAW );
		
		data.verticesNeedUpdate = false;
	    }
	    
	    if( !data.indexBuffer || data.indicesNeedUpdate ){
		data.indexBuffer = data.indexBuffer || gl.createBuffer();
		gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, data.indexBuffer );
		gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Int16Array( data.indices ), DRAW );
		
		data.indicesNeedUpdate = false;
	    }
	};
	
        
        return Renderable2D;
    }
);