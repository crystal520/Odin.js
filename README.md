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
// Client index.js
require(
    {
        baseUrl: "./"
    },
    [
        "odin",
    ],
    function( Odin ){
        
        Odin.globalize();
        
        game = new ClientGame({
            host: "127.0.0.1",
            port: 3000,
            debug: true
        });
        
        game.init();
    }
);


// Server index.js
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
                            new Circle2D({
                                radius: 0.5
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
                    
                    if( name === "up" ) position.y += speed;
                    
                    if( name === "down" ) position.y -= speed;
                    
                    if( name === "right" ) position.x += speed;
                    
                    if( name === "left" ) position.x -= speed;
                });
                
                this.setScene( client, scene );
                this.setCamera( client, camera );
            });
            
            
            this.addScene( scene );
        });
        
        game.init();
    }
);
```