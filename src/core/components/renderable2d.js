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
        }
        
	Class.extend( Renderable2D, Component );
        
        
        Renderable2D.prototype.toJSON = function(){
            var json = this._JSON;
	    
	    json.type = "Renderable2D";
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