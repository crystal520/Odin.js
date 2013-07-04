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
	
        
        function Poly2D( opts ){
            opts || ( opts = {} );
	    
            Renderable2D.call( this, opts );
	    
	    this.vertices = opts.vertices instanceof Array ? opts.vertices : [
		new Vec2( 0.5, 0.5 ),
		new Vec2( -0.5, 0.5 ),
		new Vec2( -0.5, -0.5 ),
		new Vec2( 0.5, -0.5 )
	    ];
        }
        
	Class.extend( Poly2D, Renderable2D );
        
        
        Poly2D.prototype.toJSON = function(){
            var json = this._JSON,
		vertices = this.vertices,
		i;
	    
	    json.type = "Poly2D";
	    json.visible = this.visible;
	    json.offset = this.offset;
	    
	    json.alpha = this.alpha;
	    
	    json.fill = this.fill;
	    json.color = this.color;
	    
	    json.line = this.line;
	    json.lineColor = this.lineColor;
	    json.lineWidth = this.lineWidth;
	    
	    json.vertices = json.vertices || [];
	    
	    for( i = vertices.length; i--; ){
		json.vertices[i] = vertices[i];
	    }
	    
	    return json;
        };
        
        
        Poly2D.prototype.fromJSON = function( json ){
	    var vertices = json.vertices,
		vertex;
	    
            this.visible = json.visible;
	    this.offset.fromJSON( json.offset );
	    
	    this.alpha = json.alpha;
	    
	    this.fill = json.fill;
	    this.color.fromJSON( json.color );
	    
	    this.line = json.line;
	    this.lineColor.fromJSON( json.lineColor );
	    this.lineWidth = json.lineWidth;
	    
	    for( i = vertices.length; i--; ){
		vertex = this.vertices[i];
		if( !vertex ) vertex = this.vertices[i] = new Vec2;
		
		vertex.fromJSON( vertices[i] );
	    }
	    
	    return this;
        };
	
        
        return Poly2D;
    }
);