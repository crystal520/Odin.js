if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"base/utils",
	"math/mathf",
	"math/vec2",
	"math/mat32"
    ],
    function( Class, Utils, Mathf, Vec2, Mat32 ){
        "use strict";
        
	var isNumber = Utils.isNumber,
	    EPSILON = Mathf.EPSILON,
	    standardRadian = Mathf.standardRadian;
	
	
        function Transform2D( opts ){
            opts || ( opts = {} );
	    
            Class.call( this );
            
            this.root = this;
            
            this.children = [];
            
	    this.matrix = new Mat32;
            this.matrixWorld = new Mat32;
            this.matrixModelView = new Mat32;
            
	    this.position = opts.position instanceof Vec2 ? opts.position : new Vec2;
	    this.rotation = !!opts.rotation ? opts.rotation : 0;
	    this.scale = opts.scale instanceof Vec2 ? opts.scale : new Vec2( 1, 1 );
	    
	    this._position = this.position.clone();
	    this._rotation = this.rotation;
	    this._scale = this.scale.clone();
	    
	    this.updateMatrices();
        }
        
	Class.extend( Transform2D, Class );
        
        
        Transform2D.prototype.clone = function(){
            var clone = new Transform2D;
	    clone.copy( this );
	    
            return clone;
        };
        
        
        Transform2D.prototype.copy = function( other ){
	    var children = other.children,
		child, i;
	    
            this.children.length = 0;
            
	    for( i = children.length; i--; ){
		child = children[c];
		
		if( child ) this.add( child.clone() );
	    }
            
            this.root = other.root;
            
            this.position.copy( other.position );
            this.scale.copy( other.scale );
            this.rotation = other.rotation;
            
            this.updateMatrices();
            
            return this;
        };
        
        
        Transform2D.prototype.add = function(){
            var children = this.children,
                child, index, root,
                i;
            
            for( i = arguments.length; i--; ){
                child = arguments[i];
                index = children.indexOf( child );
                
                if( index === -1 && child instanceof Transform2D ){
                    
                    if( child.parent ){
                        child.parent.remove( child );
                    }
                    child.parent = this;
                    
                    children.push( child );
                
                    root = this;
                    
                    while( !!root.parent ){
                        root = root.parent;
                    }
                    child.root = root;
                    
                    child.trigger("add");
                    this.trigger("addchild", child );
                }
            }
            
            return this;
        };
        
        
        Transform2D.prototype.remove = function(){
            var children = this.children,
                child, index,
                i;
            
            for( i = arguments.length; i--; ){
                child = arguments[i];
                index = children.indexOf( child );
                
                if( index !== -1 ){
                    
                    children.splice( index, 1 );
                    
                    child.parent = undefined;
                
                    root = this;
                    
                    while( !!root.parent ){
                        root = root.parent;
                    }
                    child.root = root;
                    
                    child.trigger("remove" );
                    this.trigger("removechild", child );
                }
            }
            
            return this;
        };
	
	
        Transform2D.prototype.localToWorld = function( v ){
	    
	    return v.applyMat32( this.matrixWorld );
	};
        
	
        Transform2D.prototype.worldToLocal = function(){
	    var mat = new Mat32;
	    
	    return function( v ){
		
		return v.applyMat32( mat.getInverse( this.matrixWorld ) );
	    };
	}();
	
	
	Transform2D.prototype.applyMat32 = function(){
	    var mat = new Mat32;
	    
	    return function( matrix ){
		
		this.matrix.mmul( matrix, this.matrix );
		
		this.scale.getScaleMat32( this.matrix );
		this.rotation = this.matrix.getRotation();
		this.position.getPositionMat32( this.matrix );
	    };
        }();
        
	
        Transform2D.prototype.translate = function(){
	    var vec = new Vec2,
		mat = new Mat32;
	    
	    return function( translation, relativeTo ){
		vec.copy( translation );
		
		if( relativeTo instanceof Transform2D ){
		    mat.setRotation( relativeTo.rotation );
		}
		else if( isNumber( relativeTo ) ){
		    mat.setRotation( relativeTo );
		}
		
		if( relativeTo ){
		    vec.applyMat32( mat );
		}
		
		this.position.add( vec );
	    };
        }();
        
        
        Transform2D.prototype.rotate = function( angle, relativeTo ){
	    
	    if( relativeTo ){
		angle += relativeTo.rotation;
	    }
	    
	    this.rotation += angle;
        };
        
        
        Transform2D.prototype.scale = function(){
	    var vec = new Vec2,
		mat = new Mat32;
	    
	    return function( scale, relativeTo ){
		vec.copy( scale );
		
		if( relativeTo instanceof Transform2D ){
		    mat.setRotation( relativeTo.rotation );
		}
		else if( isNumber( relativeTo ) ){
		    mat.setRotation( relativeTo );
		}
		
		if( relativeTo ){
		    vec.applyMat32( mat );
		}
		
		this.scale.add( vec );
	    }
        }();
        
        
        Transform2D.prototype.rotateAround = function(){
	    var point = new Vec2;
		
	    return function( point, angle ){
		
		point.copy( point ).sub( this.position );
		
		this.translate( point );
		this.rotate( angle );
		this.translate( point.inverse(), angle );
	    };
        }();
	
        
        Transform2D.prototype.lookAt = function(){
	    var vec = new Vec2,
		mat = new Mat32;
	    
	    return function( target ){
		
		if( target instanceof Transform2D ){
		    vec.copy( target.position );
		}
		else{
		    vec.copy( target );
		}
		
		this.rotation = mat.lookAt( this.position, vec ).getRotation();
	    };
        }();
	
	
	Transform2D.prototype.follow = function(){
	    var vec = new Vec2;
	    
	    return function( target, damping, relativeTo ){
		damping = damping ? damping : 1;
		
		if( target instanceof Transform2D ){
		    vec.vsub( target.position, this.position );
		}
		else if( target instanceof Vec2 ){
		    vec.vsub( target, this.position );
		}
		
		if( vec.lenSq() > EPSILON ){
		    this.translate( vec.smul( 1 / damping ), relativeTo );
		}
	    };
	}();
        
        
        Transform2D.prototype.updateMatrices = function(){
            var scale = this.scale,
		matrix = this.matrix,
		matrixWorld = this.matrixWorld;
	    
            matrix.setRotation( this.rotation );
	    
	    if( scale.x !== 1 || scale.y !== 1 ){
                matrix.scale( scale );
            }
	    
            matrix.setTranslation( this.position );
            
            if( this.root === this ){
                matrixWorld.copy( matrix );
            }
            else{
                matrixWorld.mmul( matrix, this.parent.matrixWorld );
            }
	    
	    if( !this._position.equals( this.position ) ) this.trigger("moved");
	    if( !this._scale.equals( scale ) ) this.trigger("scaled");
	    if( this._rotation !== this.rotation ) this.trigger("rotated");
        };
        
        
        Transform2D.prototype.toJSON = function(){
            var json = this._JSON,
		children = this.children, i;
	    
	    json.type = "Transform2D";
	    json.children = json.children || [];
	    
	    for( i = children.length; i--; ){
		json.children[i] = children[i].toJSON();
	    }
	    
	    json.position = this.position;
	    json.rotation = this.rotation;
	    json.scale = this.scale;
	    
            return json;
        };
        
        
        Transform2D.prototype.fromJSON = function( json ){
	    var children = json.children,
		jsonObject, object,
		i;
	    
	    for( i = children.length; i--; ){
		jsonObject = children[i];
		object = new objectTypes[ jsonObject.type ];
		this.add( object.fromJSON( jsonObject ) );
	    }
	    
	    this.position.fromJSON( json.position );
	    this.rotation = json.rotation;
	    this.scale.fromJSON( json.scale );
	    
	    this.updateMatrices();
	    
	    return this;
        };
        
        
	return Transform2D;
    }
);