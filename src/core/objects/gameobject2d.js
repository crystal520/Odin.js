if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"core/objects/transform2d"
    ],
    function( Class, Transform2D ){
        "use strict";
	
	
        function GameObject2D( opts ){
	    opts || ( opts = {} );
	    
            Transform2D.call( this, opts );
            
            this.name = opts.name || ( this._class +"-"+ this._id );
	    
	    this.z = opts.z !== undefined ? opts.z : 0;
	    
            this.tags = [];
            this.components = {};
            
            this.scene = undefined;
	    
            this.add.apply( this, opts.children );
            this.addTag.apply( this, opts.tags );
            this.addComponent.apply( this, opts.components );
        }
        
	Class.extend( GameObject2D, Transform2D );
        
        
        GameObject2D.prototype.clone = function(){
            var clone = new GameObject2D;
	    clone.copy( this );
	    
            return clone;
        };
        
        
        GameObject2D.prototype.copy = function( other ){
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
	
	
        GameObject2D.prototype.init = function(){
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
        
        
        GameObject2D.prototype.addTag = function(){
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
        
        
        GameObject2D.prototype.removeTag = function(){
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
        
        
        GameObject2D.prototype.hasTag = function( tag ){
	    
	    return this.tags.indexOf( tag ) !== -1;
        };
        
        
        GameObject2D.prototype.addComponent = function(){
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
			
			this.trigger("addcomponent", component );
			component.trigger("add", this );
		    }
		    else{
			console.warn("GameObject2D.addComponent: "+ component._class +" is not an instance of Component");
		    }
                }
		else{
		    console.warn("GameObject2D.addComponent: GameObject2D already has a "+ component +" Component");
		}
            }
        };
        
        
        GameObject2D.prototype.removeComponent = function(){
            var components = this.components,
                component, i, il;
            
            for( i = 0, il = arguments.length; i < il; i++ ){
                component = arguments[i];
                
                if( components[ component._class ] ){
                    
                    component.gameObject = undefined;
                    delete components[ component._class ];
                    
                    this.trigger("removecomponent", component );
                    component.trigger("remove", this );
                }
		else{
		    console.warn("GameObject2D.removeComponent: Component is not attached GameObject2D");
		}
            }
        };
        
        
        GameObject2D.prototype.hasComponent = function( type ){
            
            return !!this.components[ type ];
        };
        
        
        GameObject2D.prototype.getComponent = function( type ){
            
            return this.components[ type ];
        };
        
        
        GameObject2D.prototype.getComponents = function( results ){
            results = results || [];
	    var key;
            
            for( key in this.components ){
                results.push( this.components[ key ] );
            }
            
            return results;
        };
        
        
        GameObject2D.prototype.forEachComponent = function( callback ){
            var components = this.components,
                type, component;
                
            
            for( type in components ){
                component = components[ type ];
                
                if( component ){
                    callback( component );
                }
            }
        };
        
        
        GameObject2D.prototype.update = function(){
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
            
            this.trigger("lateupdate");
        };
        
        
	return GameObject2D;
    }
);