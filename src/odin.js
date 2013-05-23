if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define(
    function( require ){
	"use strict";
	
	
	var Odin = {};
	
	Odin.globalize = function(){
	    
	    for( var key in this ){
		window[ key ] = this[ key ];
	    }
	    window.Odin = this;
	};
	
	Odin.test = function(){
	    var now = Date.now,
		start, i;
	    
	    return function( name, times, fn ){
		start = now();
		
		for( i = 0; i < times; i++ ){
		    fn();
		}
		
		console.log( name +": "+ ( now() - start ) +"ms");
	    };
	}();
	
	Odin.Class = require("base/class");
	Odin.Device = require("base/device");
	Odin.Dom = require("base/dom");
	Odin.Time = require("base/time");
	Odin.Utils = require("base/utils");
	
	Odin.AABB2 = require("math/aabb2");
	Odin.AABB3 = require("math/aabb3");
	Odin.Affine = require("math/affine");
	Odin.Color = require("math/color");
	Odin.Mat2 = require("math/mat2");
	Odin.Mat3 = require("math/mat3");
	Odin.Mat4 = require("math/mat4");
	Odin.Mathf = require("math/mathf");
	Odin.Quat = require("math/quat");
	Odin.Ray2 = require("math/ray2");
	Odin.Ray3 = require("math/ray3");
	Odin.Vec2 = require("math/vec2");
	Odin.Vec3 = require("math/vec3");
	Odin.Vec4 = require("math/vec4");
	
	Odin.PBody2D = require("physics2d/body/pbody2d");
	Odin.PRigidBody2D = require("physics2d/body/prigidbody2d");
	
	Odin.PBroadphase2D = require("physics2d/collision/pbroadphase2d");
	Odin.PCollision2D = require("physics2d/collision/pcollision2d");
	Odin.PSolver2D = require("physics2d/collision/psolver2d");
	
	Odin.PContact2D = require("physics2d/constraints/pcontact2d");
	Odin.PEquation2D = require("physics2d/constraints/pequation2d");
	
	Odin.PCircle = require("physics2d/shape/pcircle");
	Odin.PConvex2D = require("physics2d/shape/pconvex2d");
	Odin.PRect = require("physics2d/shape/prect");
	Odin.PShape2D = require("physics2d/shape/pshape2d");
	
	Odin.PContactGenerator2D = require("physics2d/pcontactgenerator2d");
	Odin.PWorld2D = require("physics2d/pworld2d");
	
	Odin.Component = require("core/components/component");
	Odin.RigidBody = require("core/components/rigidbody");
	Odin.Sprite = require("core/components/sprite");
	
	Odin.Game = require("core/game/game");
	Odin.ClientGame = require("core/game/clientgame");
	
	Odin.Accelerometer = require("core/input/accelerometer");
	Odin.Input = require("core/input/input");
	Odin.Key = require("core/input/key");
	Odin.Keyboard = require("core/input/keyboard");
	Odin.Mouse = require("core/input/mouse");
	Odin.Orientation = require("core/input/orientation");
	Odin.Touch = require("core/input/touch");
	Odin.Touches = require("core/input/touches");
	
	Odin.Camera2D = require("core/objects/camera2d");
	Odin.GameObject2D = require("core/objects/gameobject2d");
	Odin.Transform2D = require("core/objects/transform2d");
	
	Odin.Canvas = require("core/canvas");
	Odin.CanvasRenderer = require("core/canvasrenderer");
	Odin.Scene = require("core/scene");
	Odin.WebGLRenderer = require("core/webglrenderer");
	Odin.World = require("core/world");
	
	
	return Odin;
    }
);