if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"base/dom",
	"base/device",
	"core/canvas",
	"math/color",
	"math/affine"
    ],
    function( Class, Dom, Device, Canvas, Color, Affine ){
	"use strict";
	
	var PI = Math.PI,
	    defaultImg = new Image;
	    
	defaultImg.src = "data:image/gif;base64,R0lGODlhAQABAIAAAP7//wAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==";
	
	
        function CanvasRenderer( opts ){
            opts || ( opts = {} );
            
            Class.call( this );
            
	    this.pixelRatio = opts.pixelRatio !== undefined ? opts.pixelRatio : 128;
	    
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
		    sprites = scene._sprites,
		    rigidbodies = scene._rigidbodies,
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
	    var mvp = new Affine;
	    
	    return function( rigidbody, camera ){
		var ctx = this.context,
		    gameObject = rigidbody.gameObject,
		    body = rigidbody.body,
		    shape = body.shape,
		    vertices, vertex,
		    i, il;
		    
		gameObject.matrixModelView.mmul( gameObject.matrixWorld, camera.matrixWorldInverse );
		mvp.mmul( gameObject.matrixModelView, camera.matrixProjection );
		
		ctx.save();
		
		ctx.transform( mvp.a, mvp.b, mvp.c, mvp.d, mvp.x, mvp.y );
		ctx.scale( 1, -1 );
		
		ctx.strokeStyle = "#ff0000";
		ctx.lineWidth = 1/this.pixelRatio;
		
		if( shape.radius ){
		    
		}
		else if( shape.vertices ){
		    
		    ctx.beginPath();
		    ctx.arc( 0 , 0, shape.boundingRadius , 0, 2*PI, true );
		    ctx.closePath();
		    ctx.stroke();
		    
		    vertices = shape.vertices;
		    
		    ctx.beginPath();
		    ctx.moveTo( vertices[0].x, vertices[0].y );
		    
		    for( i = 0, il = vertices.length; i < il; i++ ){
			ctx.lineTo( vertices[i].x, vertices[i].y );
		    }
		    
		    ctx.lineTo( vertices[0].x, vertices[0].y );
		    ctx.closePath();
		    ctx.stroke();
		}
		
		ctx.restore();
	    };
	}();
        
        
        CanvasRenderer.prototype.renderSprite = function(){
	    var mvp = new Affine;
	    
	    return function( sprite, camera ){
		var ctx = this.context,
		    gameObject = sprite.gameObject,
		    offset = sprite.offset,
		    image = sprite.image || defaultImg;
		
		gameObject.matrixModelView.mmul( gameObject.matrixWorld, camera.matrixWorldInverse );
		mvp.mmul( gameObject.matrixModelView, camera.matrixProjection );
		
		ctx.save();
		
		ctx.transform( mvp.a, mvp.b, mvp.c, mvp.d, mvp.x, mvp.y );
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