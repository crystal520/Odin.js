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
	    var ctx = this.context,
		canvas = this.canvas,
		hw = canvas.width * 0.5,
		hh = canvas.height * 0.5;
	    
	    ctx.translate( hw, hh );
	    ctx.scale( hw, hh );
	};
        
        
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
	    
            ctx.clearRect( -1, -1, 1, 1 );
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
	    
	    return function( scene ){
		var self = this,
		    ctx = this.context,
		    camera = scene.camera;
		
		if( lastScene !== scene ){
		    this.setClearColor( scene.world.background );
		    lastScene = scene;
		}
		if( lastCamera !== camera ){
		    camera.setSize( this.canvas.width, this.canvas.height );
		    this.setDefault();
		    
		    if( this.canvas.fullScreen ){
			this.canvas.on("resize", function(){
			    camera.setSize( this.width, this.height );
			    self.setDefault();
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