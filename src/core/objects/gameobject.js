if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"core/objects/transform2d"
    ],
    function( Transform2D ){
        "use strict";
	
	
        function GameObject( opts ){
	    opts || ( opts = {} );
	    
            Transform2D.call( this, opts );
            
            this.name = opts.name || ( this._class +"-"+ this._id );
	    
            this.tags = [];
            this.components = {};
            
            this.scene = undefined;
	    
            this.add.apply( this, opts.children );
            this.addTag.apply( this, opts.tags );
            this.addComponent.apply( this, opts.components );
        }
        
        GameObject.prototype = Object.create( Transform2D.prototype );
        GameObject.prototype.constructor = GameObject;
        
        
        GameObject.prototype.clone = function(){
            var clone = new GameObject;
	    clone.copy( this );
	    
            return clone;
        };
        
        
        GameObject.prototype.copy = function( other ){
            var name, component, prop;
            
	    Transform2D.call( this, other );
	    
            this.name = this._class + this._id;
            
            this.tags.length = 0;
            this.addTag.apply( this, other.tags );
            
	    for( name in other.components ){
                component = other.components[ name ];
		this.addComponent( component.clone() );
            }
            
            if( other.scene ){
                other.scene.add( this );
            }
            
            return this;
        };
	
	
        GameObject.prototype.init = function(){
            var components = this.components,
                type, component;
                
            
            for( type in components ){
                component = components[ type ];
                
                if( component ){
                    component.init();
		    component.trigger("init");
                }
            }
            
            this.trigger("init");
        };
        
        
        GameObject.prototype.addTag = function(){
            var tags = this.tags,
                tag, index,
                i, il;
            
            for( i = 0, il = arguments.length; i < il; i++ ){
                tag = arguments[i];
                index = tags.indexOf( tag );
                
                if( index === -1 ){
                    tags.push( tag );
                }
            }
        };
        
        
        GameObject.prototype.removeTag = function(){
            var tags = this.tags,
                tag, index,
                i, il;
            
            for( i = 0, il = arguments.length; i < il; i++ ){
                tag = arguments[a];
                index = tags.indexOf( tag );
                
                if( index !== -1 ){
                    tags.splice( index, 1 );
                }
            }
        };
        
        
        GameObject.prototype.hasTag = function( tag ){
	    
	    return this.tags.indexOf( tag ) !== -1;
        };
        
        
        GameObject.prototype.addComponent = function(){
            var components = this.components,
                component, i, il;
            
            for( i = 0, il = arguments.length; i < il; i++ ){
                component = arguments[i];
                
                if( !components[ component._class ] ){
                    
		    if( component instanceof Component ){
			if( component.gameObject ){
			    component = component.clone();
			}
			
			components[ component._class ] = component;
			component.gameObject = this;
			
			this.trigger("addComponent", component );
			component.trigger("add", this );
		    }
		    else{
			console.warn("GameObject.addComponent: "+ component._class +" is not an instance of Component");
		    }
                }
		else{
		    console.warn("GameObject.addComponent: GameObject already has a "+ component +" Component");
		}
            }
        };
        
        
        GameObject.prototype.removeComponent = function(){
            var components = this.components,
                component, i, il;
            
            for( i = 0, il = arguments.length; i < il; i++ ){
                component = arguments[i];
                
                if( components[ component._class ] ){
                    
                    component.gameObject = undefined;
                    delete components[ component._class ];
                    
                    this.trigger("removeComponent", component );
                    component.trigger("remove", this );
                }
		else{
		    console.warn("GameObject.removeComponent: Component is not attached GameObject");
		}
            }
        };
        
        
        GameObject.prototype.hasComponent = function( type ){
            
            return !!this.components[ type ];
        };
        
        
        GameObject.prototype.getComponent = function( type ){
            
            return this.components[ type ];
        };
        
        
        GameObject.prototype.getComponents = function( results ){
            results = results || [];
	    var key;
            
            for( key in this.components ){
                results.push( this.components[ key ] );
            }
            
            return results;
        };
        
        
        GameObject.prototype.forEachComponent = function( callback ){
            var components = this.components,
                type, component;
                
            
            for( type in components ){
                component = components[ type ];
                
                if( component ){
                    callback( component );
                }
            }
        };
        
        
        GameObject.prototype.update = function(){
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
            
            this.trigger("lateUpdate");
        };
        
        
	return GameObject;
    }
);