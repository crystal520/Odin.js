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
	    
	    this.width = 960;
            this.height = 640;
            
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
        
        
        Camera2D.prototype.toJSON = function(){
            var json = this._JSON,
		children = this.children,
		components = this.components,
		tags = this.tags,
		i;
	    
	    json.type = "Camera2D";
	    json.name = this.name;
	    json.children = json.children || [];
	    json.components = json.components || [];
	    json.tags = json.tags || [];
	    
	    for( i = children.length; i--; ){
		json.children[i] = children[i].toJSON();
	    }
	    for( i = components.length; i--; ){
		json.components[i] = components[i].toJSON();
	    }
	    for( i = tags.length; i--; ){
		json.tags[i] = tags[i];
	    }
	    
	    json.z = this.z;
	    
	    json.position = this.position;
	    json.rotation = this.rotation;
	    json.scale = this.scale;
	    
	    json.width = this.width;
	    json.height = this.height;
	    json.zoom = this.zoom;
	    
            return json;
        };
        
        
        Camera2D.prototype.fromJSON = function( json ){
	    var children = json.children,
		components = json.components,
		tags = json.tags,
		jsonObject, object,
		i;
	    
	    this.name = json.name;
	    
	    for( i = children.length; i--; ){
		jsonObject = children[i];
		object = new objectTypes[ jsonObject.type ];
		this.add( object.fromJSON( jsonObject ) );
	    }
	    for( i in components ){
		jsonObject = components[i];
		object = new objectTypes[ jsonObject.type ];
		this.addComponent( object.fromJSON( jsonObject ) )
	    }
	    for( i = tags.length; i--; ){
		this.tags[i] = tags[i];
	    }
	    
	    this.z = json.z;
	    
	    this.position.fromJSON( json.position );
	    this.rotation = json.rotation;
	    this.scale.fromJSON( json.scale );
	    
	    this.zoom = json.zoom;
	    this.setSize( json.width, json.height );
	    
	    this.updateMatrices();
	    
	    return this;
        };
        
        
	return Camera2D;
    }
);