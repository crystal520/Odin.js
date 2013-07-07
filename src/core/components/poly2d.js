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
	    this.calculatePoly();
        }
        
	Class.extend( Poly2D, Renderable2D );
        
	
	Poly2D.prototype.copy = function( other ){
	    var vertices = other.vertices,
		vertex, i;
	    
	    Renderable2D.call( this, other );
	    
	    for( i = vertices.length; i--; ){
		vertex = this.vertices[i] || new Vec2;
		vertex.copy( vertices[i] );
	    }
	    
	    return this;
	};
        
        
        Poly2D.prototype.toJSON = function(){
            var json = this._JSON,
		vertices = this.vertices,
		i;
	    
	    json.type = "Poly2D";
	    json._SERVER_ID = this._id;
	    
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
	    
	    this._SERVER_ID = json._SERVER_ID;
	    
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