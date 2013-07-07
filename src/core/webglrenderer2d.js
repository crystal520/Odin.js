if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"base/dom",
	"base/device",
	"core/canvas",
	"math/mathf",
	"math/color",
	"math/vec2",
	"math/mat32",
	"math/mat4"
    ],
    function( Class, Dom, Device, Canvas, Mathf, Color, Vec2, Mat32, Mat4 ){
	"use strict";
	
	var createProgram = Dom.createProgram,
	    TWO_PI = Math.PI * 2,
	    cos = Math.cos,
	    sin = Math.sin,
	    isPowerOfTwo = Mathf.isPowerOfTwo,
	    toPowerOfTwo = Mathf.toPowerOfTwo,
	    
	    regAttribute = /attribute\s+([a-z]+\s+)?([A-Za-z0-9]+)\s+([a-zA-Z_0-9]+)\s*(\[\s*(.+)\s*\])?/,
	    regUniform = /uniform\s+([a-z]+\s+)?([A-Za-z0-9]+)\s+([a-zA-Z_0-9]+)\s*(\[\s*(.+)\s*\])?/,
	    
	    defaultImage = new Image;
	
	defaultImage.src = "data:image/gif;base64,R0lGODlhAQABAIAAAP7//wAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==";
	
	
	function parseUniformsAttributes( gl, shader ){
	    var src = shader.vertexShader + shader.fragmentShader,
		lines = src.split("\n"), matchAttributes, matchUniforms,
		name, length, line,
		i, j;
	    
	    for( i = lines.length; i--; ) {
		line = lines[i];
		matchAttributes = line.match( regAttribute );
		matchUniforms = line.match( regUniform );
		
		if( matchAttributes ){
		    name = matchAttributes[3];
		    shader.attributes[ name ] = gl.getAttribLocation( shader.program, name );
		}
		if( matchUniforms ){
		    name = matchUniforms[3];
		    length = parseInt( matchUniforms[5] );
		    
		    if( length ){
			shader.uniforms[ name ] = [];
			
			for( j = length; j--; ){
			    shader.uniforms[ name ][j] = gl.getUniformLocation( shader.program, name +"["+ j +"]" );
			}
		    }
		    else{
			shader.uniforms[ name ] = gl.getUniformLocation( shader.program, name );
		    }
		}
	    }
	}
	
	
	function basicVertexShader( precision ){
	    
	    return [
		"precision "+ precision +" float;",
		
                "uniform mat4 uMatrix;",
                
                "attribute vec2 aVertexPosition;",
                
                "void main(){",
                    
                    "gl_Position = uMatrix * vec4( aVertexPosition, 0.0, 1.0 );",
                "}"
	    ].join("\n");
	}
	
	
	function basicFragmentShader( precision ){
	    
	    return [
		"precision "+ precision +" float;",
		
                "uniform float uAlpha;",
                "uniform vec3 uColor;",
                
                "void main(){",
		    "vec4 finalColor = vec4( uColor, 1.0 );",
		    "finalColor.w *= uAlpha;",
		    
                    "gl_FragColor = finalColor;",
                "}"
	    ].join("\n");
	}
	
	
	function spriteVertexShader( precision ){
	    
	    return [
		"precision "+ precision +" float;",
		
                "uniform mat4 uMatrix;",
                
                "attribute vec2 aVertexPosition;",
                
                "void main(){",
                    
                    "gl_Position = uMatrix * vec4( aVertexPosition, 0.0, 1.0 );",
                "}"
	    ].join("\n");
	}
	
	
	function spriteFragmentShader( precision ){
	    
	    return [
		"precision "+ precision +" float;",
		
                "uniform float uAlpha;",
                "uniform vec3 uColor;",
                
                "void main(){",
		    "vec4 finalColor = vec4( uColor, 1.0 );",
		    "finalColor.w *= uAlpha;",
		    
                    "gl_FragColor = finalColor;",
                "}"
	    ].join("\n");
	}
	
	
        function WebGLRenderer2D( opts ){
            opts || ( opts = {} );
            
            Class.call( this );
            
	    this.debug = opts.debug !== undefined ? !!opts.debug : false;
            
	    this.pixelRatio = opts.pixelRatio !== undefined ? opts.pixelRatio : 128;
	    this.invPixelRatio = 1 / this.pixelRatio;
            
            this.canvas = opts.canvas instanceof Canvas ? opts.canvas : new Canvas( opts.width, opts.height );
            this.context = Dom.getWebGLContext( this.canvas.element, opts.attributes );
            
            this.autoClear = opts.autoClear !== undefined ? opts.autoClear : true;
	    
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
	    
	    this._data = {
		images: {
		    "default": defaultImage
		},
		textures: {
		    "default": undefined,
		},
		sprite: {
		    vertexShader: undefined,
		    fragmentShader: undefined,
		    program: undefined,
		    uniforms: {},
		    attributes: {}
		},
		basic: {
		    vertexShader: undefined,
		    fragmentShader: undefined,
		    program: undefined,
		    uniforms: {},
		    attributes: {}
		}
	    }
	    
            this.setDefault();
        }
        
	Class.extend( WebGLRenderer2D, Class );
        
        
        WebGLRenderer2D.prototype.getExtensions = function(){
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
        
        
        WebGLRenderer2D.prototype.getGPUCapabilities = function(){
	    var gl = this.context,
		gpu = this.gpu, ext = this.ext,
		
		VERTEX_SHADER = gl.VERTEX_SHADER,
		FRAGMENT_SHADER = gl.FRAGMENT_SHADER,
		HIGH_FLOAT = gl.HIGH_FLOAT,
		MEDIUM_FLOAT = gl.MEDIUM_FLOAT,
		LOW_FLOAT = gl.LOW_FLOAT,
		
		shaderPrecision = typeof gl.getShaderPrecisionFormat !== "undefined",
		
		maxAnisotropy = ext.texture_filter_anisotropic ? gl.getParameter( ext.texture_filter_anisotropic.MAX_TEXTURE_MAX_ANISOTROPY_EXT ) : 1,
		
		maxTextures = gl.getParameter( gl.MAX_TEXTURE_IMAGE_UNITS ),
		
		maxTextureSize = gl.getParameter( gl.MAX_TEXTURE_SIZE ),
		
		maxCubeTextureSize = gl.getParameter( gl.MAX_CUBE_MAP_TEXTURE_SIZE ),
		
		maxRenderBufferSize = gl.getParameter( gl.MAX_RENDERBUFFER_SIZE ),
		
		vsHighpFloat = shaderPrecision ? gl.getShaderPrecisionFormat( VERTEX_SHADER, HIGH_FLOAT ) : 0,
		vsMediumpFloat = shaderPrecision ? gl.getShaderPrecisionFormat( VERTEX_SHADER, MEDIUM_FLOAT ) : 23,
		
		fsHighpFloat = shaderPrecision ? gl.getShaderPrecisionFormat( FRAGMENT_SHADER, HIGH_FLOAT ) : 0,
		fsMediumpFloat = shaderPrecision ? gl.getShaderPrecisionFormat( FRAGMENT_SHADER, MEDIUM_FLOAT ) : 23,
		
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
	
	
        WebGLRenderer2D.prototype.setDefault = function(){
	    var gl = this.context,
		data = this._data,
		gpu = this.gpu, precision,
		basic = data.basic,
		sprite = data.sprite;
	    
	    this.getExtensions();
	    this.getGPUCapabilities();
	    precision = gpu.precision;
	    
	    gl.clearColor( 0, 0, 0, 1 );
	    gl.clearDepth( 0 );
	    gl.clearStencil( 0 );
	    
	    gl.frontFace( gl.CCW );
	    gl.cullFace( gl.BACK );
	    gl.enable( gl.CULL_FACE );
	    
	    gl.enable( gl.BLEND );
	    gl.blendEquation( gl.FUNC_ADD );
	    gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA );
	    
	    basic.vertexShader = basicVertexShader( precision );
	    basic.fragmentShader = basicFragmentShader( precision );
	    basic.program = createProgram( gl, basic.vertexShader, basic.fragmentShader );
	    parseUniformsAttributes( gl, basic );
	    
	    sprite.vertexShader = spriteVertexShader( precision );
	    sprite.fragmentShader = spriteFragmentShader( precision );
	    sprite.program = createProgram( gl, basic.vertexShader, basic.fragmentShader );
	    parseUniformsAttributes( gl, sprite );
	};
	
	
	WebGLRenderer2D.prototype.createImage = function( imageSrc ){
	    var self = this,
		data = this._data,
		images = data.images,
		image = images[ imageSrc ];
	    
	    if( !image ){
		if( imageSrc === "default" ){
		    image = images["default"];
		}
		else{
		    image = new Image();
		    image.src = imageSrc;
		    images[ imageSrc ] = image;
		}
	    }
	    
	    image.onload = function(){
		self.createTexture( image, imageSrc );
	    };
        };
	
	
	WebGLRenderer2D.prototype.createTexture = function( image, imageSrc ){
	    var gl = this.context,
		data = this._data,
		textures = data.textures,
		texture = gl.createTexture();
	    
	    gl.bindTexture( gl.TEXTURE_2D, texture );
	    gl.pixelStorei( gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true );
	    
	    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image );
	    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR );
	    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR );
	    
	    if( isPowerOfTwo( image.width ) && isPowerOfTwo( image.height ) ){
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE );
	    }
	    else{
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT );
	    }
	    
	    textures[ imageSrc ] = texture;
	    gl.bindTexture( gl.TEXTURE_2D, null );
        };
        
        
        WebGLRenderer2D.prototype.setClearColor = function( color ){
            
            if( color ){
                this.context.clearColor( color.r, color.g, color.b, color.a );
            }
            else{
                this.context.clearColor( 0, 0, 0, 1 );
            }
	};
	
        
        WebGLRenderer2D.prototype.clear = function(){
            var gl = this.context;
	    
            gl.clear( gl.COLOR_BUFFER_BIT | gl.STENCIL_BUFFER_BIT );
	};
        
        
        WebGLRenderer2D.prototype.setBlending = function(){
	    var lastBlending, gl;
	    
	    return function( blending ){
		gl = this.context;
		
		if( blending !== lastBlending ){
		    
		    switch( blending ){
			case WebGLRenderer2D.none:
			    gl.disable( gl.BLEND );
			    break;
			
			case WebGLRenderer2D.additive:
			    gl.enable( gl.BLEND );
			    gl.blendEquation( gl.FUNC_ADD );
			    gl.blendFunc( gl.SRC_ALPHA, gl.ONE );
			    break;
			
			case WebGLRenderer2D.subtractive:
			    gl.enable( gl.BLEND );
			    gl.blendEquation( gl.FUNC_ADD );
			    gl.blendFunc( gl.ZERO, gl.ONE_MINUS_SRC_COLOR );
			    break;
			
			case WebGLRenderer2D.multiply:
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
        
        
        WebGLRenderer2D.prototype.setLineWidth = function(){
	    var lastLineWidth = 1;
	    
	    return function( width ){
		
		if( width !== lastLineWidth ){
		    
		    this.context.lineWidth( width );
		    lastLineWidth = width;
		}
	    };
	}();
        
        
        WebGLRenderer2D.prototype.render = function(){
	    var lastScene, lastCamera, lastBackground = new Color;
	    
	    return function( scene, camera ){
		var self = this,
		    background = scene.world.background,
		    gl = this.context,
		    renderable, renderables = scene._renderables,
		    rigidbody, rigidbodies = scene._rigidbodies,
		    i;
		
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
		    
		    camera.setSize( w, h );
		    gl.viewport( 0, 0, hw, hh );
		    
		    if( this.canvas.fullScreen ){
			this.canvas.off("resize");
			this.canvas.on("resize", function(){
			    var ipr = 1 / self.pixelRatio,
				w = this.width * ipr,
				h = this.height * ipr,
				hw = this.width * 0.5,
				hh = this.height * 0.5;
			    
			    camera.setSize( w, h );
			    gl.viewport( 0, 0, hw, hh );
			});
		    }
		    
		    lastCamera = camera;
		}
		
		if( this.autoClear ) this.clear();
		
		if( this.debug ){
		    for( i = rigidbodies.length; i--; ){
			rigidbody = rigidbodies[i];
			
			if( rigidbody.visible ) this.renderComponent( rigidbody, camera );
		    }
		}
		
		for( i = renderables.length; i--; ){
		    renderable = renderables[i];
		    
		    if( renderable.visible ) this.renderComponent( renderable, camera );
		}
	    };
        }();
        
        
        WebGLRenderer2D.prototype.renderComponent = function(){
	    var modelView = new Mat4,
		modelViewProj = new Mat4,
		mvp = modelViewProj.elements;
	    
	    return function( component, camera ){
		var gl = this.context,
		    data = this._data,
		    image = component.image,
		    texture = data.textures[ image ],
		    gameObject = component.gameObject;
		
		if( !texture && image ){
		    this.createImage( image );
		    return;
		}
		
		gameObject.matrixModelView.mmul( gameObject.matrixWorld, camera.matrixWorldInverse );
		
		modelView.fromMat32( gameObject.matrixModelView );
		modelViewProj.mmul( modelView, camera._matrixProjection3D );
	    };
	}();
	
	
	WebGLRenderer2D.none = 0;
	WebGLRenderer2D.additive = 1;
	WebGLRenderer2D.subtractive = 2;
	WebGLRenderer2D.multiply = 3;
	
        
        return WebGLRenderer2D;
    }
);