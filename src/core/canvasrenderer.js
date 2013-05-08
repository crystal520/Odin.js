if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"base/dom",
	"base/device",
	"core/canvas",
	"math/mat3"
    ],
    function( Class, Dom, Device, Canvas, Mat3 ){
	"use strict";
	
	var defaultImg = new Image;
	defaultImg.src = "data:image/gif;base64,R0lGODlhAQABAIAAAP7//wAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==";
	
	
        function CanvasRenderer( opts ){
            opts || ( opts = {} );
            
            Class.call( this );
            
            this.canvas = opts.canvas instanceof Canvas ? opts.canvas : new Canvas( opts.width, opts.height );
            
            this.autoClear = opts.autoClear !== undefined ? opts.autoClear : true;
	    
            this.context = Dom.get2DContext( this.canvas.element );
        }
        
	Class.extend( CanvasRenderer, Class );
	
        
        CanvasRenderer.prototype.setClearColor = function( color ){
            
	    if( color ){
		this.canvas.element.style.background = color.rgb();
	    }
	    else{
		this.canvas.element.style.background = "#000000";
	    }
	};
	
        
        CanvasRenderer.prototype.clear = function(){
            var ctx = this.context,
		canvas = this.canvas
	    
            ctx.clearRect( -1, -1, 2, 2 );
	};
        
        
        CanvasRenderer.prototype.setLineWidth = function(){
	    var lastLineWidth, ctx;
	    
	    return function( width ){
		ctx = this.context;
		
		if( width !== lastLineWidth ){
		    
		    ctx.lineWidth = width;
		    lastLineWidth = width;
		}
	    };
	}();
        
        
        CanvasRenderer.prototype.render = function(){
	    var lastScene, lastCamera;
	    
	    return function( scene, camera ){
		var self = this,
		    ctx = this.context,
		    sprites = scene._sprites,
		    sprite, i, il;
		
		if( lastScene !== scene ){
		    this.setClearColor( scene.world.background );
		    lastScene = scene;
		}
		if( lastCamera !== camera ){
		    var canvas = this.canvas,
			w = canvas.width,
			h = canvas.height,
			hw = canvas.width * 0.5,
			hh = canvas.height * 0.5;
		    
		    ctx.translate( hw, hh );
		    ctx.scale( hw, hh );
		    
		    camera.setSize( w, h );
		    
		    if( this.canvas.fullScreen ){
			this.canvas.on("resize", function(){
			     var canvas = this.canvas,
				w = this.width,
				h = this.height,
				hw = this.width * 0.5,
				hh = this.height * 0.5;
			    
			    camera.setSize( w, h );
			    
			    ctx.translate( hw, hh );
			    ctx.scale( hw, hh );
			});
		    }
		    
		    lastCamera = camera;
		}
		
		if( this.autoClear ){
		    this.clear();
		}
		
		for( i = 0, il = sprites.length; i < il; i++ ){
		    sprite = sprites[i];
		    
		    this.renderSprite( sprite, camera );
		}
	    };
        }();
        
        
        CanvasRenderer.prototype.renderSprite = function(){
	    var matrixPerspective = new Mat3,
		me = matrixPerspective.elements;
	    
	    return function( sprite, camera ){
		var ctx = this.context,
		    gameObject = sprite.gameObject,
		    offset = sprite.offset,
		    image = sprite.image || defaultImg;
		
		gameObject.matrixModelView.mmul( camera.matrixWorldInverse, gameObject.matrixWorld );
		matrixPerspective.mmul( camera.matrixProjection, gameObject.matrixModelView );
		
		ctx.save();
		
		ctx.transform( me[0], me[1], me[3], me[4], me[6], me[7] );
		
		ctx.drawImage(
		    image,
		    sprite.x, sprite.y,
		    sprite.w, sprite.h,
		    offset.x - sprite.width * 0.5,
		    offset.y - sprite.height * 0.5,
		    sprite.width, sprite.height
		);
		
		ctx.restore();
	    };
	}();
	
        
        return CanvasRenderer;
    }
);