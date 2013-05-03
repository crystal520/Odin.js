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
	
	
        function WebGLRenderer( opts ){
            opts || ( opts = {} );
            
            Class.call( this );
            
            this.canvas = opts.canvas instanceof Canvas ? opts.canvas : new Canvas( opts.width, opts.height );
            
            this.autoClear = opts.autoClear !== undefined ? opts.autoClear : true;
	    
            this.context = Dom.getWebGLContext( this.canvas.element, opts.attributes );
	    
	    this.ext = {
		texture_filter_anisotropic: undefined,
		texture_float: undefined,
		standard_derivatives: undefined,
		compressed_texture_s3tc: undefined
	    };
	    
	    this.gpu = {
		precision: "highp",
		maxAnisotropy: 16,
		maxTextures: 16,
		maxTextureSize: 16384,
		maxCubeTextureSize: 16384,
		maxRenderBufferSize: 16384
	    };
	    
	    this.getExtensions();
	    this.getGPUCapabilities();
	    
            this.setDefault();
        }
        
        WebGLRenderer.prototype = Object.create( Class.prototype );
        WebGLRenderer.prototype.constructor = WebGLRenderer;
        
        
        WebGLRenderer.prototype.getExtensions = function(){
	    var gl = this.context,
		ext = this.ext,
		
		texture_filter_anisotropic = gl.getExtension( "EXT_texture_filter_anisotropic" ) ||
		    gl.getExtension( "MOZ_EXT_texture_filter_anisotropic" ) ||
		    gl.getExtension( "WEBKIT_EXT_texture_filter_anisotropic" ),
		    
		compressed_texture_s3tc = gl.getExtension( "WEBGL_compressed_texture_s3tc" ) ||
		    gl.getExtension( "MOZ_WEBGL_compressed_texture_s3tc" ) ||
		    gl.getExtension( "WEBKIT_WEBGL_compressed_texture_s3tc" ),
		    
		standard_derivatives = gl.getExtension("OES_standard_derivatives"),
		
		texture_float = gl.getExtension("OES_texture_float");
		
	    ext.texture_filter_anisotropic = texture_filter_anisotropic;
	    ext.standard_derivatives = standard_derivatives;
	    ext.texture_float = texture_float;
	    ext.compressed_texture_s3tc = compressed_texture_s3tc;
        };
        
        
        WebGLRenderer.prototype.getGPUCapabilities = function(){
	    var gl = this.context,
		gpu = this.gpu, ext = this.ext,
	    
		VERTEX_SHADER = gl.VERTEX_SHADER,
		FRAGMENT_SHADER = gl.FRAGMENT_SHADER,
		HIGH_FLOAT = gl.HIGH_FLOAT,
		MEDIUM_FLOAT = gl.MEDIUM_FLOAT,
		LOW_FLOAT = gl.LOW_FLOAT,
		
		maxAnisotropy = ext.texture_filter_anisotropic ? gl.getParameter( ext.texture_filter_anisotropic.MAX_TEXTURE_MAX_ANISOTROPY_EXT ) : 1,
		
		maxTextures = gl.getParameter( gl.MAX_TEXTURE_IMAGE_UNITS ),
		
		maxTextureSize = gl.getParameter( gl.MAX_TEXTURE_SIZE ),
		
		maxCubeTextureSize = gl.getParameter( gl.MAX_CUBE_MAP_TEXTURE_SIZE ),
		
		maxRenderBufferSize = gl.getParameter( gl.MAX_RENDERBUFFER_SIZE ),
		
		vsHighpFloat = gl.getShaderPrecisionFormat( VERTEX_SHADER, HIGH_FLOAT ),
		vsMediumpFloat = gl.getShaderPrecisionFormat( VERTEX_SHADER, MEDIUM_FLOAT ),
		vsLowpFloat = gl.getShaderPrecisionFormat( VERTEX_SHADER, LOW_FLOAT ),
		
		fsHighpFloat = gl.getShaderPrecisionFormat( FRAGMENT_SHADER, HIGH_FLOAT ),
		fsMediumpFloat = gl.getShaderPrecisionFormat( FRAGMENT_SHADER, MEDIUM_FLOAT ),
		fsLowpFloat = gl.getShaderPrecisionFormat( FRAGMENT_SHADER, LOW_FLOAT ),
		
		highpAvailable = vsHighpFloat.precision > 0 && fsHighpFloat.precision > 0,
		mediumpAvailable = vsMediumpFloat.precision > 0 && fsMediumpFloat.precision > 0,
		
		precision = "highp";
	    
	    if( !highpAvailable || Device.mobile ){
		if( mediumpAvailable ){
		    precision = "mediump";
		}
		else{
		    precision = "lowp";
		}
	    }
	    
	    gpu.precision = precision;
	    gpu.maxAnisotropy = maxAnisotropy;
	    gpu.maxTextures = maxTextures;
	    gpu.maxTextureSize = maxTextureSize;
	    gpu.maxCubeTextureSize = maxCubeTextureSize;
	    gpu.maxRenderBufferSize = maxRenderBufferSize;
        };
        
        
        WebGLRenderer.prototype.setDefault = function(){
	    var gl = this.context;
	    
	    gl.clearColor( 0, 0, 0, 1 );
	    gl.clearDepth( 0 );
	    gl.clearStencil( 0 );
	    
	    gl.frontFace( gl.CCW );
	    gl.cullFace( gl.BACK );
	    gl.enable( gl.CULL_FACE );
	    
	    gl.enable( gl.BLEND );
	    gl.blendEquation( gl.FUNC_ADD );
	    gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA );
	};
        
        
        WebGLRenderer.prototype.setClearColor = function( color ){
            var gl = this.context;
            
            if( color ){
                gl.clearColor( color.r, color.g, color.b, color.a );
            }
            else{
                gl.clearColor( 0, 0, 0, 1 );
            }
	};
	
        
        WebGLRenderer.prototype.clear = function(){
            var gl = this.context;
	    
            gl.clear( gl.COLOR_BUFFER_BIT | gl.STENCIL_BUFFER_BIT );
	};
        
        
        WebGLRenderer.prototype.setBlending = function(){
	    var lastBlending, gl;
	    
	    return function( blending ){
		gl = this.context;
		
		if( blending !== lastBlending ){
		    
		    switch( blending ){
			case WebGLRenderer.none:
			    gl.disable( gl.BLEND );
			    break;
			
			case WebGLRenderer.additive:
			    gl.enable( gl.BLEND );
			    gl.blendEquation( gl.FUNC_ADD );
			    gl.blendFunc( gl.SRC_ALPHA, gl.ONE );
			    break;
			
			case WebGLRenderer.subtractive:
			    gl.enable( gl.BLEND );
			    gl.blendEquation( gl.FUNC_ADD );
			    gl.blendFunc( gl.ZERO, gl.ONE_MINUS_SRC_COLOR );
			    break;
			
			case WebGLRenderer.multiply:
			    gl.enable( gl.BLEND );
			    gl.blendEquation( gl.FUNC_ADD );
			    gl.blendFunc( gl.ZERO, gl.SRC_COLOR );
			    break;
			
			default:
			    gl.enable( gl.BLEND );
			    gl.blendEquationSeparate( gl.FUNC_ADD, gl.FUNC_ADD );
			    gl.blendFuncSeparate( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA );
			    break;
		    }
		    
		    lastBlending = blending;
		}
	    };
	}();
        
        
        WebGLRenderer.prototype.setLineWidth = function(){
	    var lastLineWidth, gl;
	    
	    return function( width ){
		gl = this.context;
		
		if( width !== lastLineWidth ){
		    
		    gl.lineWidth( width );
		    lastLineWidth = width;
		}
	    };
	}();
        
        
        WebGLRenderer.prototype.render = function(){
	    var lastScene, lastCamera;
	    
	    return function( scene, camera ){
		var gl = this.context;
		
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
	
	
	WebGLRenderer.none = 0;
	WebGLRenderer.additive = 1;
	WebGLRenderer.subtractive = 2;
	WebGLRenderer.multiply = 3;
	
        
        return WebGLRenderer;
    }
);