var requirejs = require("requirejs"),
    Odin = require("odin");

requirejs(
    {
        baseUrl: "./",
        nodeRequire: require
    },
    function(){
        
        Odin.globalize();
        
        var game = new ServerGame({
            host: "192.168.1.181",
            port: 3000,
            debug: true
        });
        
        game.on("init", function(){
            var scene = new Scene2D;
            
            
            scene.add(
                new GameObject2D({
                    components: [
                        new Box2D({
                            color: new Color("#ff0000"),
                            extents: new Vec2( 0.5, 0.5 )
                        })
                    ]
                })
            );
            
            
            this.on("connected", function( id ){
                var client = this.clients[ id ],
                    position = new Vec2( Mathf.randFloat( -4, 4 ), Mathf.randFloat( -4, 4 ) ),
                    player = new GameObject2D({
                        position: position,
                        userData: id,
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
                
                client.player = player.name;
                
                client.on("keydown", function( key ){
                    var name = key.name;
                    
                    if( name === "up" ){
                        player.position.y += 0.01;
                    }
                    if( name === "down" ){
                        player.position.y -= 0.01;
                    }
                    if( name === "right" ){
                        player.position.x += 0.01;
                    }
                    if( name === "left" ){
                        player.position.x -= 0.01;
                    }
                });
                
                this.setScene( client, scene );
                this.setCamera( client, scene, camera );
            });
            
            
            this.on("disconnect", function( id ){
                var client = this.clients[ id ],
                    scene = this.findSceneByName( client.scene ),
                    player = scene.findByName( client.player ),
                    camera = scene.findByName( client.camera );
                
                scene.remove( player, camera );
            });
            
            this.addScene( scene );
        });
        
        game.init();
    }
);