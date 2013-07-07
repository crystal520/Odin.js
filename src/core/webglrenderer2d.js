if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"base/dom",
	"base/device",
	"base/time",
	"core/canvas",
	"math/mathf",
	"math/color",
	"math/vec2",
	"math/mat32",
	"math/mat4"
    ],
    function( Class, Dom, Device, Time, Canvas, Mathf, Color, Vec2, Mat32, Mat4 ){
	"use strict";
	
	var now = Time.now,
	    
	    createProgram = Dom.createProgram,
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
                    "gl_FragColor = vec4( uColor, uAlpha );",
                "}"
	    ].join("\n");
	}
	
	//texture2D(uSampler, vec2(vTextureCoord.x * uCropSource.z, vTextureCoord.y * uCropSource.w) + uCropSource.xy);
	
	function spriteVertexShader( precision ){
	    
	    return [
		"precision "+ precision +" float;",
		
                "uniform mat4 uMatrix;",
                "uniform vec4 uCrop;",
                
                "attribute vec2 aVertexPosition;",
                "attribute vec2 aUvPosition;",
		
                "varying vec2 vUvPosition;",
                
                "void main(){",
                    
		    "vUvPosition = vec2( aUvPosition.x * uCrop.z, aUvPosition.y * uCrop.w ) + uCrop.xy;",
		    
                    "gl_Position = uMatrix * vec4( aVertexPosition, 0.0, 1.0 );",
                "}"
	    ].join("\n");
	}
	
	
	function spriteFragmentShader( precision ){
	    
	    return [
		"precision "+ precision +" float;",
		
                "uniform float uAlpha;",
                "uniform sampler2D uTexture;",
		
                "varying vec2 vUvPosition;",
                
                "void main(){",
		    "vec4 finalColor = texture2D( uTexture, vUvPosition );",
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
	    
	    this.time = 0;
	    
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
	    gl.blendEquationSeparate( gl.FUNC_ADD, gl.FUNC_ADD );
	    gl.blendFuncSeparate( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA );
	    
	    basic.vertexShader = basicVertexShader( precision );
	    basic.fragmentShader = basicFragmentShader( precision );
	    basic.program = createProgram( gl, basic.vertexShader, basic.fragmentShader );
	    parseUniformsAttributes( gl, basic );
	    
	    sprite.vertexShader = spriteVertexShader( precision );
	    sprite.fragmentShader = spriteFragmentShader( precision );
	    sprite.program = createProgram( gl, sprite.vertexShader, sprite.fragmentShader );
	    parseUniformsAttributes( gl, sprite );
	    
	    this.createImage("default");
	};
	
	
	WebGLRenderer2D.prototype.createImage = function( imageSrc ){
	    var self = this,
		data = this._data,
		images = data.images,
		textures = data.textures,
		image = images[ imageSrc ];
	    
	    if( !image ){
		if( imageSrc === "default" ){
		    image = images["default"];
		    if( !textures[ imageSrc ] ) createTexture( image, imageSrc );
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
		texture = gl.createTexture(),
		
		isPOT = isPowerOfTwo( image.width ) && isPowerOfTwo( image.height ),
		
		TEXTURE_2D = gl.TEXTURE_2D,
		MAG_FILTER = gl.LINEAR,
		MIN_FILTER = isPOT ? gl.LINEAR_MIPMAP_NEAREST : gl.LINEAR,
		WRAP = isPOT ? gl.REPEAT : gl.CLAMP_TO_EDGE,
		RGBA = gl.RGBA;
	    
	    gl.bindTexture( TEXTURE_2D, texture );
	    
	    gl.texImage2D( TEXTURE_2D, 0, RGBA, RGBA, gl.UNSIGNED_BYTE, image );
	    
	    gl.texParameteri( TEXTURE_2D, gl.TEXTURE_MAG_FILTER, MAG_FILTER );
	    gl.texParameteri( TEXTURE_2D, gl.TEXTURE_MIN_FILTER, MIN_FILTER );
	    
	    gl.texParameteri( TEXTURE_2D, gl.TEXTURE_WRAP_S, WRAP );
	    gl.texParameteri( TEXTURE_2D, gl.TEXTURE_WRAP_T, WRAP );
	    
	    if( isPOT ) gl.generateMipmap( TEXTURE_2D );
	    
	    gl.bindTexture( TEXTURE_2D, null );
	    textures[ imageSrc ] = texture;
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
		    start = now(),
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
			h = canvas.height * ipr;
		    
		    camera.setSize( w, h );
		    gl.viewport( 0, 0, canvas.width, canvas.height );
		    
		    if( this.canvas.fullScreen ){
			this.canvas.off("resize");
			this.canvas.on("resize", function(){
			    var ipr = 1 / self.pixelRatio,
				w = this.width * ipr,
				h = this.height * ipr;
			    
			    camera.setSize( w, h );
			    gl.viewport( 0, 0, this.width, this.height );
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
		
		this.time = now() - start;
	    };
        }();
        
        
        WebGLRenderer2D.prototype.renderComponent = function(){
	    var modelView = new Mat4,
		modelViewProj = new Mat4,
		mvp = modelViewProj.elements;
	    
	    return function( component, camera ){
		var gl = this.context,
		    data = this._data,
		    imageSrc = component.image,
		    image = data.images[ imageSrc ],
		    texture = data.textures[ imageSrc ],
		    componentData = component._data,
		    color = component.color,
		    lineColor = component.lineColor,
		    alpha = component.alpha,
		    gameObject = component.gameObject,
		    body = component.body, sleepState,
		    sprite = data.sprite, basic = data.basic,
		    uniforms, attributes, w, h;
		
		if( !texture && imageSrc ){
		    this.createImage( imageSrc );
		    image = data.images["default"];
		    texture = data.textures["default"];
		}
		if( componentData.needsUpdate ) this.setupBuffers( componentData );
		
		gameObject.matrixModelView.mmul( gameObject.matrixWorld, camera.matrixWorldInverse );
		
		modelView.fromMat32( gameObject.matrixModelView );
		modelViewProj.mmul( camera._matrixProjection3D, modelView );
		
		if( componentData.uvBuffer ){
		    gl.useProgram( sprite.program );
		    w = 1 / image.width;
		    h = 1 / image.height;
		    
		    uniforms = sprite.uniforms;
		    attributes = sprite.attributes;
		    
		    gl.activeTexture( gl.TEXTURE0 );
		    gl.bindTexture( gl.TEXTURE_2D, texture );
		    gl.uniform1i( uniforms.uTexture, 0 );
		    
		    gl.uniform4f( uniforms.uCrop, component.x * w, component.y * h, component.w * w, component.h * h );
		}
		else{
		    if( body ) sleepState = body.sleepState;
		    
		    gl.useProgram( basic.program );
		    
		    uniforms = basic.uniforms;
		    attributes = basic.attributes;
		    
		    gl.uniform3f( uniforms.uColor, color.r, color.g, color.b );
		}
		
		this.bindBuffers( attributes, componentData );
		
		gl.uniformMatrix4fv( uniforms.uMatrix, false, mvp );
		
		if( sleepState ){
			if( sleepState === 2 ){
			    alpha *= 0.5;
			}
			else if( sleepState === 3 ){
			    alpha *= 0.25;
			}
		    }
		
		gl.uniform1f( uniforms.uAlpha, alpha );
		
		gl.drawElements( gl.TRIANGLES, componentData.indices.length, gl.UNSIGNED_SHORT, 0 );
		
		if( component.line ){
		    gl.useProgram( basic.program );
		    
		    this.bindBuffers( attributes, componentData );
		    this.setLineWidth( component.lineWidth || this.invPixelRatio );
		    
		    uniforms = basic.uniforms;
		    attributes = basic.attributes;
		    
		    gl.bindTexture( gl.TEXTURE_2D, null );
		    gl.uniformMatrix4fv( uniforms.uMatrix, false, mvp );
		    gl.uniform3f( uniforms.uColor, lineColor.r, lineColor.g, lineColor.b );
		    gl.uniform1f( uniforms.uAlpha, 1 );
		    
		    gl.drawArrays( gl.LINE_LOOP, 0, componentData.vertices.length * 0.5 );
		}
	    };
	}();
        
        
        WebGLRenderer2D.prototype.bindBuffers = function( attributes, data ){
	    var gl = this.context,
		ARRAY_BUFFER = gl.ARRAY_BUFFER,
		ELEMENT_ARRAY_BUFFER = gl.ELEMENT_ARRAY_BUFFER,
		FLOAT = gl.FLOAT;
	    
	    gl.bindBuffer( ARRAY_BUFFER, data.vertexBuffer );
	    gl.enableVertexAttribArray( attributes.aVertexPosition );
	    gl.vertexAttribPointer( attributes.aVertexPosition, 2, FLOAT, false, 0, 0 );
	    
	    gl.bindBuffer( ELEMENT_ARRAY_BUFFER, data.indexBuffer );
	    
	    if( data.uvs.length ){
		gl.bindBuffer( ARRAY_BUFFER, data.uvBuffer );
		gl.enableVertexAttribArray( attributes.aUvPosition );
		gl.vertexAttribPointer( attributes.aUvPosition, 2, FLOAT, false, 0, 0 );
	    }
	};
        
        
        WebGLRenderer2D.prototype.setupBuffers = function( data ){
	    var gl = this.context,
		DRAW = data.dynamic ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW,
		ARRAY_BUFFER = gl.ARRAY_BUFFER, ELEMENT_ARRAY_BUFFER = gl.ELEMENT_ARRAY_BUFFER;
	    
	    if( data.vertices.length ){
		data.vertexBuffer = data.vertexBuffer || gl.createBuffer();
		
		gl.bindBuffer( ARRAY_BUFFER, data.vertexBuffer );
		gl.bufferData( ARRAY_BUFFER, new Float32Array( data.vertices ), DRAW );
	    }
	    if( data.uvs.length ){
		data.uvBuffer = data.uvBuffer || gl.createBuffer();
		
		gl.bindBuffer( ARRAY_BUFFER, data.uvBuffer );
		gl.bufferData( ARRAY_BUFFER, new Float32Array( data.uvs ), DRAW );
	    }
	    if( data.indices.length ){
		data.indexBuffer = data.indexBuffer || gl.createBuffer();
		
		gl.bindBuffer( ELEMENT_ARRAY_BUFFER, data.indexBuffer );
		gl.bufferData( ELEMENT_ARRAY_BUFFER, new Int16Array( data.indices ), DRAW );
	    }
	    
	    data.needsUpdate = false;
	};
	
	
	WebGLRenderer2D.none = 0;
	WebGLRenderer2D.additive = 1;
	WebGLRenderer2D.subtractive = 2;
	WebGLRenderer2D.multiply = 3;
	
        
        return WebGLRenderer2D;
    }
);