if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"math/mathf",
	"math/vec2",
	"math/mat32",
	"math/mat4",
	"core/objects/gameobject2d"
    ],
    function( Class, Mathf, Vec2, Mat32, Mat4, GameObject2D ){
        "use strict";
	
	var clampBottom = Mathf.clampBottom;
	
	
        function Camera2D( opts ){
	    opts || ( opts = {} );
	    
            GameObject2D.call( this, opts );
	    
	    this.width = window.innerWidth;
            this.height = window.innerHeight;
            
            this.aspect = this.width / this.height;
            
            this.zoom = opts.zoom !== undefined ? opts.zoom : 1;
            
	    this._matrixProjection3D = new Mat4;
	    
            this.matrixProjection = new Mat32;
            this.matrixProjectionInverse = new Mat32;
            
            this.matrixWorldInverse = new Mat32;
            
            this.needsUpdate = true;
        }
        
	Class.extend( Camera2D, GameObject2D );
	
	
	Camera2D.prototype.clone = function(){
            var clone = new Camera2D();
            clone.copy( this );
            
            return clone;
        };
        
        
        Camera2D.prototype.copy = function( other ){
            
	    GameObject2D.call( this, other );
	    
            this.width = other.width;
            this.height = other.height;
            
            this.aspect = other.aspect;
            
            this.zoom = other.zoom;
            
            this.matrixProjection.copy( other.matrixProjection );
            this.matrixProjectionInverse.copy( other.matrixProjectionInverse );
            
            this.matrixWorldInverse.copy( other.matrixWorldInverse );
            
            this.needsUpdate = other.needsUpdate;
            
            return this;
        };
        
        
        Camera2D.prototype.setSize = function( width, height ){
            
            this.width = width !== undefined ? width : this.width;
            this.height = height !== undefined ? height : this.height;
            
            this.aspect = this.width / this.height
            
            this.needsUpdate = true;
        };
        
        
        Camera2D.prototype.setZoom = function( zoom ){
            
            this.zoom = zoom !== undefined ? zoom : this.zoom;
            
            this.needsUpdate = true;
        };
        
        
        Camera2D.prototype.zoomBy = function( zoom ){
            
            this.zoom += zoom !== undefined ? zoom : 0;
            
            this.needsUpdate = true;
        };
        
        
        Camera2D.prototype.toWorld = function(){
	    var vec = new Vec2;
	    
	    return function( v ){
		
		return vec;
	    };
	}();
        
        
        Camera2D.prototype.updateMatrixProjection = function(){
	    var zoom = clampBottom( this.zoom, 0.001 ),
		w = this.width, h = this.height,
		right = ( w * 0.5 ) * zoom,
		left = -right,
		top = ( h * 0.5 ) * zoom,
		bottom = -top;
	    
	    this.matrixProjection.orthographic( left, right, top, bottom );
            this.matrixProjectionInverse.minv( this.matrixProjection );
	    
	    this._matrixProjection3D.orthographic( left, right, top, bottom, -1, 1 );
            
            this.needsUpdate = false;
        };
        
        
        Camera2D.prototype.update = function(){
            var components = this.components,
                type, component;
            
            this.trigger("update");
            
            for( type in components ){
                component = components[ type ];
                
                if( component && component.update ){
                    component.update();
                }
            }
            
            this.updateMatrices();
            
	    if( this.needsUpdate ){
                this.updateMatrixProjection();
            }
            
            this.matrixWorldInverse.minv( this.matrixWorld );
	    
            this.trigger("lateupdate");
        };
        
        
	return Camera2D;
    }
);