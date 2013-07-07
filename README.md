Odin.js
=======

2D HTML5 Canvas/WebGL Javascript Game Engine

[Examples](http://lonewolfgames.github.io/Odin.js/)


## How to use
```
// install the odin.js package
$ npm install odin -g


// create odin game dir
$ odin path/to/game

$ cd path/to/game

// install npm packages
$ npm install

// start the server
$ node server/index.js
```

## Basic Game
```
var requirejs = require("requirejs"),
    Odin = require("odin");

requirejs(
    {
        baseUrl: __dirname,
        nodeRequire: require
    },
    function(){
        
        Odin.globalize();
        
        var game = new ServerGame({
            host: "127.0.0.1",
            port: 3000,
            debug: true
        });
        
        game.on("init", function(){
            var scene = new Scene2D;
            
            this.on("connection", function( id ){
                var client = this.clients[ id ],
                    userData = client.userData,
                    position = new Vec2( Mathf.randFloat( -10, 10 ), Mathf.randFloat( -10, 10 ) ),
                    player = new GameObject2D({
                        position: position,
                        components: [
                            new Sprite2D({
                                image: "../assets/player.png",
                                x: 0,
                                y: 0,
                                w: 64,
                                h: 64,
                                width: 1,
                                height: 1,
                                animations: {
                                    idle: [
                                        [ 0, 0, 64, 64, 0.25 ],
                                        [ 64, 0, 64, 64, 0.5 ],
                                        [ 128, 0, 64, 64, 1 ],
                                        [ 192, 0, 64, 64, 0.1 ]
                                    ]
                                }
                            })
                        ]
                    }),
                    camera = new Camera2D({
                        position: position.clone()
                    });
                
                scene.add( player, camera );
                userData.player = player;
                userData.speed = 2;
                
                client.on("keydown", function( key ){
                    var userData = this.userData,
                        position = userData.player.position,
                        speed = userData.speed,
                        name = key.name;
                    
                    if( name === "up" ){
                        position.y += speed;
                    }
                    if( name === "down" ){
                        position.y -= speed;
                    }
                    if( name === "right" ){
                        position.x += speed;
                    }
                    if( name === "left" ){
                        position.x -= speed;
                    }
                });
                
                this.setScene( client, scene );
                this.setCamera( client, camera );
            });
            
            
            this.on("disconnect", function( id ){
                var client = this.clients[ id ],
                    player = client.scene.findById( client.userData.player._id ),
                    camera = client.scene.findById( client.camera._id );
                
                scene.remove( player, camera );
            });
            
            this.addScene( scene );
        });
        
        game.init();
    }
);

```