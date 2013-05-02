if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"base/dom",
	"base/device",
    ],
    function( Class, Dom, Device ){
	"use strict";
	
	
        function CanvasRenderer( opts ){
            opts || ( opts = {} );
            
            Class.call( this );
            
            this.canvas = opts.canvas instanceof Canvas ? opts.canvas : new Canvas( opts.width, opts.height );
            
            this.autoClear = opts.autoClear !== undefined ? opts.autoClear : true;
	    
            this.context = Dom.get2DContext( this.canvas.element );
	    
	    this.setDefault();
        }
        
        CanvasRenderer.prototype = Object.create( Class.prototype );
        CanvasRenderer.prototype.constructor = CanvasRenderer;
        
        
        CanvasRenderer.prototype.setDefault = function(){
	    var gl = this.context,
		canvas = this.canvas,
		hw = canvas.width * 0.5,
		hh = canvas.height * 0.5;
	    
	    ctx.translate( hw, hh );
	    ctx.scale( hw, hh );
	};
        
        
        CanvasRenderer.prototype.setClearColor = function( color ){
            var gl = this.context;
            
            if( color ){
                gl.clearColor( color.r, color.g, color.b, color.a );
            }
            else{
                gl.clearColor( 0, 0, 0, 1 );
            }
	};
	
        
        CanvasRenderer.prototype.clear = function(){
            var gl = this.context,
		canvas = this.canvas
	    
            gl.clearRect( -1, -1, 1, 1 );
	};
        
        
        CanvasRenderer.prototype.setLineWidth = function(){
	    var lastLineWidth, gl;
	    
	    return function( width ){
		gl = this.context;
		
		if( width !== lastLineWidth ){
		    
		    gl.lineWidth = width;
		    lastLineWidth = width;
		}
	    };
	}();
        
        
        CanvasRenderer.prototype.render = function(){
	    var lastScene, lastCamera;
	    
	    return function( scene ){
		var gl = this.context,
		    camera = scene.camera;
		
		if( lastScene !== scene ){
		    this.setClearColor( scene.world.background );
		    lastScene = scene;
		}
		if( lastCamera !== camera ){
		    camera.setSize( this.canvas.width, this.canvas.height );
		    gl.viewport( 0, 0, this.canvas.width, this.canvas.height );
		    
		    if( this.canvas.fullScreen ){
			this.canvas.on("resize", function(){
			    camera.setSize( this.width, this.height );
			    gl.viewport( 0, 0, this.width, this.height );
			});
		    }
		    
		    lastCamera = camera;
		}
		
		if( this.autoClear ){
		    this.clear();
		}
	    };
        }();
	
        
        return CanvasRenderer;
    }
);