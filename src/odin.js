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
	Odin.ObjectPool = require("base/objectpool");
	Odin.Time = require("base/time");
	Odin.Utils = require("base/utils");
	
	Odin.AABB2 = require("math/aabb2");
	Odin.AABB3 = require("math/aabb3");
	Odin.Color = require("math/color");
	Odin.Line2 = require("math/line2");
	Odin.Mat2 = require("math/mat2");
	Odin.Mat3 = require("math/mat3");
	Odin.Mat32 = require("math/mat32");
	Odin.Mat4 = require("math/mat4");
	Odin.Mathf = require("math/mathf");
	Odin.Quat = require("math/quat");
	Odin.Vec2 = require("math/vec2");
	Odin.Vec3 = require("math/vec3");
	Odin.Vec4 = require("math/vec4");
	
	Odin.PBody2D = require("physics2d/body/pbody2d");
	Odin.PParticle2D = require("physics2d/body/pparticle2d");
	Odin.PRigidBody2D = require("physics2d/body/prigidbody2d");
	
	Odin.PBroadphase2D = require("physics2d/collision/pbroadphase2d");
	Odin.PNearphase2D = require("physics2d/collision/pnearphase2d");
	
	Odin.PConstraint2D = require("physics2d/constraints/pconstraint2d");
	Odin.PContact2D = require("physics2d/constraints/pcontact2d");
	Odin.PDistanceConstraint2D = require("physics2d/constraints/pdistanceconstraint2d");
	Odin.PEquation2D = require("physics2d/constraints/pequation2d");
	Odin.PFriction2D = require("physics2d/constraints/pfriction2d");
	
	Odin.PBox2D = require("physics2d/shape/pbox2d");
	Odin.PCircle2D = require("physics2d/shape/pcircle2d");
	Odin.PConvex2D = require("physics2d/shape/pconvex2d");
	Odin.PShape2D = require("physics2d/shape/pshape2d");
	
	Odin.PSolver2D = require("physics2d/psolver2d");
	Odin.PWorld2D = require("physics2d/pworld2d");
	
	Odin.Box2D = require("core/components/box2d");
	Odin.Circle2D = require("core/components/circle2d");
	Odin.Component = require("core/components/component");
	Odin.Poly2D = require("core/components/poly2d");
	Odin.Renderable2D = require("core/components/renderable2d");
	Odin.RigidBody2D = require("core/components/rigidbody2d");
	Odin.Sprite2D = require("core/components/sprite2d");
	
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
	
	Odin.Scene2D = require("core/scene/scene2d");
	Odin.World2D = require("core/scene/world2d");
	
	Odin.Canvas = require("core/canvas");
	Odin.CanvasRenderer2D = require("core/canvasrenderer2d");
	Odin.WebGLRenderer2D = require("core/webglrenderer2d");
	
	return Odin;
    }
);