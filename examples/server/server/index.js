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
            var scene = new Scene2D,
                vec = new Vec2;
            
            
            scene.add(
                new GameObject2D({
                    position: new Vec2( 0, -1 ),
                    components: [
                        new Box2D({
                            color: new Color("#000000"),
                            extents: new Vec2( 8, 0.5 )
                        }),
                        new RigidBody2D({
                            mass: 0,
                            extents: new Vec2( 8, 0.5 )
                        })
                    ]
                })
            );
            
            
            this.on("connection", function( id ){
                var client = this.clients[ id ],
                    userData = client.userData,
                    position = new Vec2( Mathf.randFloat( -6, 6 ), Mathf.randFloat( 0, 2 ) ),
                    player = new GameObject2D({
                        position: position,
                        userData: userData,
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
                            }),
                            new RigidBody2D({
                                mass: 1,
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
                userData.jump = 3;
                userData.canJump = false;
                
                player.components.RigidBody2D.on("collide", function( body, time ){
                    player.userData.canJump = true;
                })
                
                client.on("keydown", function( key ){
                    var userData = this.userData,
                        body = userData.player.components.RigidBody2D.body,
                        speed = userData.speed,
                        jump = userData.jump,
                        name = key.name;
                    
                    if( name === "up" ){
                        if( userData.canJump ){
                            body.applyImpulse( vec.set( 0, jump ), body.position, true );
                            userData.canJump = false;
                        }
                    }
                    if( name === "right" ){
                        body.applyTorque( -speed, true );
                    }
                    if( name === "left" ){
                        body.applyTorque( speed, true );
                    }
                });
                client.on("mousemove", function( mouse ){
                    
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