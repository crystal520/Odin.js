if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"math/vec2",
	"core/components/renderable2d",
    ],
    function( Class, Vec2, Renderable2D ){
        "use strict";
	
        
        function Box2D( opts ){
            opts || ( opts = {} );
	    
            Renderable2D.call( this, opts );
	    
	    this.extents = opts.extents instanceof Vec2 ? opts.extents : new Vec2( 0.5, 0.5 );
        }
        
	Class.extend( Box2D, Renderable2D );
        
        
        Box2D.prototype.toJSON = function(){
            var json = this._JSON;
	    
	    json.type = "Box2D";
	    json.visible = this.visible;
	    json.offset = this.offset;
	    
	    json.alpha = this.alpha;
	    
	    json.fill = this.fill;
	    json.color = this.color;
	    
	    json.line = this.line;
	    json.lineColor = this.lineColor;
	    json.lineWidth = this.lineWidth;
	    
	    json.extents = this.extents;
	    
	    return json;
        };
        
        
        Box2D.prototype.fromJSON = function( json ){
	    
            this.visible = json.visible;
	    this.offset.fromJSON( json.offset );
	    
	    this.alpha = json.alpha;
	    
	    this.fill = json.fill;
	    this.color.fromJSON( json.color );
	    
	    this.line = json.line;
	    this.lineColor.fromJSON( json.lineColor );
	    this.lineWidth = json.lineWidth;
	    
	    this.extents.fromJSON( json.extents );
	    
	    return this;
        };
	
        
        return Box2D;
    }
);