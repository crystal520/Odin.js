if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"math/mat3",
	"core/objects/gameobject"
    ],
    function( Class, Mat3, GameObject ){
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
            this.matrixProjectionScreen = new Mat3;
            
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
            this.matrixProjectionScreen.copy( other.matrixProjectionScreen );
            
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
        
        
        Camera.prototype.updateMatrixProjection = function(){
	    var width = this.width * 0.25,
		height = this.height * 0.25,
		zoom = this.aspect > 1 ? this.zoom / height : this.zoom / width,
		right = ( this.width * 0.5 ) * zoom,
		left = -right,
		top = ( this.height * 0.5 ) * zoom,
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
            this.matrixProjectionScreen.mmul( this.matrixProjection, this.matrixWorldInverse );
	    
            this.trigger("lateUpdate");
        };
        
        
	return Camera;
    }
);