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
		child, c = 0, cl = other.children.length;
	    
            this.children.length = 0;
            
	    for( c; c < cl; c++ ){
		child = children[c];
		
		if( !!child ){
		    this.add( child.clone() );
		}
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
                i, il;
            
            for( i = 0, il = arguments.length; i < il; i++ ){
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
                    this.trigger("addChild", child );
                }
            }
            
            return this;
        };
        
        
        Transform2D.prototype.remove = function(){
            var children = this.children,
                child, index,
                i, il;
            
            for( i = 0, il = arguments.length; i < il; i++ ){
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
                    this.trigger("removeChild", child );
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
        };
        
        
	return Transform2D;
    }
);