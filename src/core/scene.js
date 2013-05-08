if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"base/utils",
	"core/world",
	"core/objects/camera"
    ],
    function( Class, Utils, World, Camera ){
        "use strict";
	
	var isString = Utils.isString;
	
        
        function Scene( opts ){
	    opts || ( opts = {} );
            
            Class.call( this );
            
            this.name = opts.name || ( this._class +"-"+ this._id );
	    
            this.children = [];
	    
            this._sprites = [];
            this._cameras = [];
	    
            this.world = opts.world instanceof World ? opts.world : new World;
            
            this.add.apply( this, opts.children );
        }
        
	Class.extend( Scene, Class );
        
        
        Scene.prototype.forEach = function( callback ){
            var children = this.children,
                i, il;
            
            for( i = 0, il = children.length; i < il; i++ ){
                callback( children[i] );
            }
        };
        
        
        Scene.prototype.add = function(){
            var children = this.children,
                child, index,
                i, il;
            
            for( i = 0, il = arguments.length; i < il; i++ ){
                child = arguments[i];
                index = children.indexOf( child );
		
                if( index === -1 ){
		    
                    if( child instanceof GameObject ){
			
			child.scene = this;
			
			children.push( child );
			
			if( child.children.length > 0 ){
			    this.add.apply( this, child.children );
			}
			
			this._add( child );
			
			child.trigger("addToScene");
			this.trigger("addGameObject", child );
			
			child.init();
		    }
		    else{
                        console.warn("Scene.add: Object is not an instance of GameObject");
		    }
                }
                else{
                    console.warn("Scene.add: "+ child.name +" is already added to scene");
                }
            }
        };
        
        
        Scene.prototype.remove = function(){
            var children = this.children,
                child, index,
                i, il;
            
            for( i = 0, il = arguments.length; i < il; i++ ){
                child = arguments[i];
                index = children.indexOf( child );
                
                if( index !== -1 ){
                    
                    child.scene = undefined;
                    
                    children.splice( index, 1 );
                    
                    if( child.children.length > 0 ){
                        this.remove.apply( this, child.children );
		    }
		    
		    this._remove( child );
                    
		    child.trigger("removeFromScene");
		    this.trigger("removeGameObject", child );
                }
                else{
                    console.warn("Scene.remove: "+ child +" is not in scene");
                }
            }
        };
        
	
	Scene.prototype._add = function( gameObject ){
	    var sprite = gameObject.getComponent("Sprite");
	    
	    if( sprite ){
		this._sprites.push( sprite );
		this._sprites.sort( this.sort );
	    }
	    if( gameObject instanceof Camera ){
		this._cameras.push( gameObject );
	    }
	};
        
	
	Scene.prototype._remove = function( gameObject ){
	    var sprite = gameObject.getComponent("Sprite"),
		index;
	    
	    if( sprite ){
		index = this._sprites.indexOf( sprite );
		this._sprites.splice( index, 1 );
		
		this._sprites.sort( this.sort );
	    }
	    if( gameObject instanceof Camera ){
		index = this._sprites.indexOf( gameObject );
		this._cameras.splice( index, 1 );
	    }
	};
        
	
	Scene.prototype.sort = function( a, b ){
	    
	    return a.gameObject.z - b.gameObject.z;
	};
	
        
        Scene.prototype.findByTag = function( tag, results ){
            results = results || [];
            
            var children = this.children,
                child, i, il;
                
            for( i = 0, il = children.length; i < il; i++ ){
                child = children[i];
                
                if( child.hasTag( tag ) ){
                    results.push( child );
                }
            }
            
            return results;
        };
        
        
        Scene.prototype.findByName = function( name ){
            var children = this.children,
                child, i, il;
                
            for( i = 0, il = children.length; i < il; i++ ){
                child = children[i];
                
                if( child.name === name ){
                    
                    return child;
                }
            }
            
            return undefined;
        };
        
        
        Scene.prototype.update = function(){
            var children = this.children,
                i, il;
                
            this.trigger("update");
            
            for( i = 0, il = children.length; i < il; i++ ){
                children[i].update();
            }
            
            this.trigger("update");
        };
        
        
        return Scene;
    }
);