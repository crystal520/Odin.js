if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"base/utils",
	"core/scene/world2d",
	"core/objects/camera2d",
	"core/objects/gameobject2d",
	"core/objects/transform2d"
    ],
    function( Class, Utils, World2D, Camera2D, GameObject2D, Transform2D ){
        "use strict";
	
	var objectTypes = {
		Camera2D: Camera2D,
		GameObject2D: GameObject2D,
		Transform2D: Transform2D
	    };
	    
	
        
        function Scene2D( opts ){
	    opts || ( opts = {} );
            
            Class.call( this );
            
            this.name = opts.name || ( this._class +"-"+ this._id );
	    
            this.children = [];
	    
            this._renderables = [];
            this._rigidbodies = [];
            this._cameras = [];
	    
            this.world = opts.world instanceof World2D ? opts.world : new World2D( opts );
            
            this.add.apply( this, opts.children );
        }
        
	Class.extend( Scene2D, Class );
        
        
        Scene2D.prototype.forEach = function( callback ){
            var children = this.children, i;
            
            for( i = children.length; i--; ){
                callback( children[i] );
            }
        };
        
        
        Scene2D.prototype.add = function(){
            var children = this.children,
                child, index, i;
            
            for( i = arguments.length; i--; ){
                child = arguments[i];
                index = children.indexOf( child );
		
                if( index === -1 ){
		    
		    child.scene = this;
		    
		    children.push( child );
		    
		    if( child.children.length > 0 ){
			this.add.apply( this, child.children );
		    }
		    
		    this._add( child );
		    
		    child.trigger("addtoscene");
		    this.trigger("addgameobject", child );
		    
		    child.init();
                }
                else{
                    console.warn("Scene2D.add: "+ child.name +" is already added to scene");
                }
            }
        };
        
        
        Scene2D.prototype.remove = function(){
            var children = this.children,
                child, index, i;
            
            for( i = arguments.length; i--; ){
                child = arguments[i];
                index = children.indexOf( child );
                
                if( index !== -1 ){
                    
                    child.scene = undefined;
                    
                    children.splice( index, 1 );
                    
                    if( child.children.length > 0 ){
                        this.remove.apply( this, child.children );
		    }
		    
		    this._remove( child );
                    
		    child.trigger("removefromscene");
		    this.trigger("removegameobject", child );
                }
                else{
                    console.warn("Scene2D.remove: "+ child +" is not in scene");
                }
            }
        };
        
        
        Scene2D.prototype.clear = function(){
            var children = this.children,
                child, index, i;
            
            for( i = children.length; i--; ){
                child = children[i];
                child.scene = undefined;
                children.splice( i, 1 );
		
		if( child.children.length > 0 ){
		    this.remove.apply( this, child.children );
		}
		
		this._remove( child );
                
		child.trigger("removefromscene");
		this.trigger("removegameobject", child );
            }
        };
        
	
	Scene2D.prototype._add = function( gameObject ){
	    var renderable = (
		    gameObject.getComponent("Sprite2D") ||
		    gameObject.getComponent("Box2D") ||
		    gameObject.getComponent("Circle2D") ||
		    gameObject.getComponent("Poly2D")
		),
		rigidbody2d = gameObject.getComponent("RigidBody2D");
	    
	    if( renderable ){
		this._renderables.push( renderable );
		this._renderables.sort( this.sort );
	    }
	    if( rigidbody2d ){
		this._rigidbodies.push( rigidbody2d );
		this.world.add( rigidbody2d );
	    }
	    if( gameObject.matrixProjection ){
		this._cameras.push( gameObject );
	    }
	};
        
	
	Scene2D.prototype._remove = function( gameObject ){
	    var renderable = (
		    gameObject.getComponent("Sprite2D") ||
		    gameObject.getComponent("Box2D") ||
		    gameObject.getComponent("Circle2D") ||
		    gameObject.getComponent("Poly2D")
		),
		rigidbody2d = gameObject.getComponent("RigidBody2D"),
		index;
	    
	    if( renderable ){
		index = this._renderables.indexOf( renderable );
		this._renderables.splice( index, 1 );
		
		this._renderables.sort( this.sort );
	    }
	    if( rigidbody2d ){
		index = this._rigidbodies.indexOf( rigidbody2d );
		this._rigidbodies.splice( index, 1 );
		this.world.remove( rigidbody2d );
	    }
	    if( gameObject.matrixProjection ){
		index = this._cameras.indexOf( gameObject );
		this._cameras.splice( index, 1 );
	    }
	};
        
	
	Scene2D.prototype.sort = function( a, b ){
	    
	    return a.gameObject.z - b.gameObject.z;
	};
	
        
        Scene2D.prototype.findByTag = function( tag, results ){
            results = results || [];
            
            var children = this.children,
                child, i;
            
            for( i = children.length; i--; ){
                child = children[i];
                
                if( child.hasTag( tag ) ){
                    results.push( child );
                }
            }
            
            return results;
        };
        
        
        Scene2D.prototype.findByName = function( name ){
            var children = this.children,
                child, i;
            
            for( i = children.length; i--; ){
                child = children[i];
                
                if( child.name === name ){
                    
                    return child;
                }
            }
            
            return undefined;
        };
        
        
        Scene2D.prototype.update = function(){
            var children = this.children, i;
            
            this.trigger("update");
	    
	    this.world.update();
            
            for( i = children.length; i--; ){
                children[i].update();
            }
            
            this.trigger("update");
        };
        
        
        Scene2D.prototype.toJSON = function(){
            var json = this._JSON,
		children = this.children,
		i;
	    
	    json.type = "Scene2D";
	    json.name = this.name;
	    json.world = this.world.toJSON();
	    
	    json.children = json.children || [];
	    
	    for( i = children.length; i--; ){
		json.children[i] = children[i].toJSON();
	    }
	    
	    return json;
        };
        
        
        Scene2D.prototype.fromJSON = function( json ){
            var children = json.children,
		jsonObject, object,
		i;
	    
	    this.name = json.name;
	    this.world.fromJSON( json.world );
	    
	    this.clear();
	    for( i = children.length; i--; ){
		jsonObject = children[i];
		object = new objectTypes[ jsonObject.type ];
		this.add( object.fromJSON( jsonObject ) );
	    }
	    
	    return this;
        };
        
        
        return Scene2D;
    }
);