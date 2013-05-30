if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"base/dom",
	"base/device",
	"core/canvas",
	"math/color",
	"math/mat32"
    ],
    function( Class, Dom, Device, Canvas, Color, Mat32 ){
	"use strict";
	
	var PI = Math.PI,
	    TWO_PI = PI * 2,
	    HALF_PI = PI * 0.5,
	    defaultImg = new Image;
	    
	defaultImg.src = "data:image/gif;base64,R0lGODlhAQABAIAAAP7//wAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==";
	
	
        function CanvasRenderer( opts ){
            opts || ( opts = {} );
            
            Class.call( this );
            
	    this.pixelRatio = opts.pixelRatio !== undefined ? opts.pixelRatio : 128;
	    this.invPixelRatio = 1 / this.pixelRatio;
	    
            this.canvas = opts.canvas instanceof Canvas ? opts.canvas : new Canvas( opts.width, opts.height );
            
            this.autoClear = opts.autoClear !== undefined ? opts.autoClear : true;
	    
            this.context = Dom.get2DContext( this.canvas.element );
        }
        
	Class.extend( CanvasRenderer, Class );
	
        
        CanvasRenderer.prototype.setClearColor = function( color ){
            
	    if( color ){
		this.canvas.element.style.background = color.hex();
	    }
	    else{
		this.canvas.element.style.background = "#000000";
	    }
	};
	
        
        CanvasRenderer.prototype.clear = function(){
	    
            this.context.clearRect( -1, -1, 2, 2 );
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
	    var lastScene, lastCamera, lastBackground = new Color;
	    
	    return function( scene, camera ){
		var self = this,
		    background = scene.world.background,
		    ctx = this.context,
		    rigidbodies = scene._rigidbodies,
		    sprites = scene._sprites,
		    i, il;
		
		if( !lastBackground.equals( background ) ){
		    this.setClearColor( background );
		    lastBackground.copy( background );
		}
		if( lastScene !== scene ){
		    this.setClearColor( background );
		    lastScene = scene;
		}
		if( lastCamera !== camera ){
		    var canvas = this.canvas,
			ipr = 1 / this.pixelRatio,
			w = canvas.width * ipr,
			h = canvas.height * ipr,
			hw = canvas.width * 0.5,
			hh = canvas.height * 0.5;
		    
		    ctx.translate( hw, hh );
		    ctx.scale( hw, hh );
		    
		    camera.setSize( w, h );
		    
		    if( this.canvas.fullScreen ){
			this.canvas.off("resize");
			this.canvas.on("resize", function(){
			    var ipr = 1 / self.pixelRatio,
				w = this.width * ipr,
				h = this.height * ipr,
				hw = this.width * 0.5,
				hh = this.height * 0.5;
			    
			    ctx.translate( hw, hh );
			    ctx.scale( hw, hh );
			    
			    camera.setSize( w, h );
			});
		    }
		    
		    lastCamera = camera;
		}
		
		if( this.autoClear ){
		    this.clear();
		}
		
		for( i = 0, il = sprites.length; i < il; i++ ){
		    this.renderSprite( sprites[i], camera );
		}
		
		for( i = 0, il = rigidbodies.length; i < il; i++ ){
		    this.renderRigidBody( rigidbodies[i], camera );
		}
	    };
        }();
        
        
        CanvasRenderer.prototype.renderRigidBody = function(){
	    var modelViewProj = new Mat32,
		mvp = modelViewProj.elements;
	    
	    return function( rigidbody, camera ){
		var ctx = this.context,
		    gameObject = rigidbody.gameObject,
		    body = rigidbody.body,
		    shape = body.shape,
		    radius = shape.radius,
		    vertices = shape.vertices,
		    aabb = shape.aabb,
		    vertex, i, il;
		
		gameObject.matrixModelView.mmul( gameObject.matrixWorld, camera.matrixWorldInverse );
		modelViewProj.mmul( gameObject.matrixModelView, camera.matrixProjection );
		
		ctx.save();
		
		ctx.transform( mvp[0], -mvp[2], -mvp[1], mvp[3], mvp[4], mvp[5] );
		ctx.scale( 1, -1 );
		
		ctx.strokeStyle = "#ff0000";
		ctx.lineWidth = this.invPixelRatio;
		
		ctx.beginPath();
		
		if( radius ){
		    ctx.arc( 0, 0, radius, 0, TWO_PI );
		}
		if( vertices ){
		    for( i = 0, il = vertices.length; i < il; i++ ){
			vertex = vertices[i];
			ctx.lineTo( vertex.x, vertex.y );
		    }
		}
		
		ctx.closePath();
		ctx.stroke();
		
		ctx.restore();
	    };
	}();
        
        
        CanvasRenderer.prototype.renderSprite = function(){
	    var modelViewProj = new Mat32,
		mvp = modelViewProj.elements;
	    
	    return function( sprite, camera ){
		var ctx = this.context,
		    gameObject = sprite.gameObject,
		    offset = sprite.offset,
		    image = sprite.image || defaultImg;
		
		gameObject.matrixModelView.mmul( gameObject.matrixWorld, camera.matrixWorldInverse );
		modelViewProj.mmul( gameObject.matrixModelView, camera.matrixProjection );
		
		ctx.save();
		
		ctx.transform( mvp[0], -mvp[2], -mvp[1], mvp[3], mvp[4], mvp[5] );
		ctx.scale( 1, -1 );
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