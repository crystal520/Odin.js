if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define(
    function( require ){
	"use strict";
	
	
	var OdinServer = {};
	
	OdinServer.Class = require("base/class");
	OdinServer.Time = require("base/time");
	OdinServer.Utils = require("base/utils");
	
	OdinServer.Bounds = require("math/bounds");
	OdinServer.Color = require("math/color");
	OdinServer.Mat3 = require("math/mat3");
	OdinServer.Mathf = require("math/mathf");
	OdinServer.Vec2 = require("math/vec2");
	
	OdinServer.Component = require("core/components/component");
	OdinServer.Sprite = require("core/components/sprite");
	
	OdinServer.ServerGame = require("core/game/servergame");
	
	OdinServer.Camera = require("core/objects/camera");
	OdinServer.GameObject = require("core/objects/gameobject");
	OdinServer.Transform2D = require("core/objects/transform2d");
	
	OdinServer.Scene = require("core/scene");
	OdinServer.World = require("core/world");
	
	
	return OdinServer;
    }
);