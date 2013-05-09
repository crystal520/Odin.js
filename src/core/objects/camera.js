if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"math/mat3",
	"math/vec2",
	"core/objects/gameobject"
    ],
    function( Class, Mat3, Vec2, GameObject ){
        "use strict";
	
	
        function Camera( opts ){
	    opts || ( opts = {} );
	    
            GameObject.call( this, opts );
	    
	    this.width = window.innerWidth;
            this.height = window.innerHeight;
            
            this.aspect = this.width / this.height;
            
            this.zoom = opts.zoom !== undefined ? opts.zoom : 1;
            
            this.matrixProjection = new Mat3;
            this.matrixProjectionInverse = new Mat3;
            this.matrixViewProjection = new Mat3;
            
            this.matrixWorldInverse = new Mat3;
            
            this.needsUpdate = true;
        }
        
	Class.extend( Camera, GameObject );
	
	
	Camera.prototype.clone = function(){
            var clone = new Camera();
            clone.copy( this );
            
            return clone;
        };
        
        
        Camera.prototype.copy = function( other ){
            
	    GameObject.call( this, other );
	    
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
        
        
        Camera.prototype.setSize = function( width, height ){
            
            this.width = width !== undefined ? width : this.width;
            this.height = height !== undefined ? height : this.height;
            
            this.aspect = this.width / this.height
            
            this.needsUpdate = true;
        };
        
        
        Camera.prototype.setZoom = function( zoom ){
            
            this.zoom = zoom !== undefined ? zoom : this.zoom;
            
            this.needsUpdate = true;
        };
        
        
        Camera.prototype.zoomBy = function( zoom ){
            
            this.zoom += zoom !== undefined ? zoom : 0;
            
            this.needsUpdate = true;
        };
        
        
        Camera.prototype.toWorld = function(){
	    var vec = new Vec2;
	    
	    return function( v ){
		
		return vec;
	    };
	}();
        
        
        Camera.prototype.updateMatrixProjection = function(){
	    var zoom = this.zoom,
		w = this.width, h = this.height,
		right = ( w * 0.5 ) * zoom,
		left = -right,
		top = ( h * 0.5 ) * zoom,
		bottom = -top;
		
	    this.matrixProjection.makeOrthographic( left, right, top, bottom );
            this.matrixProjectionInverse.getInverse( this.matrixProjection );
            
            this.needsUpdate = false;
        };
        
        
        Camera.prototype.update = function(){
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
            
            this.matrixWorldInverse.getInverse( this.matrixWorld );
	    
            this.trigger("lateupdate");
        };
        
        
	return Camera;
    }
);