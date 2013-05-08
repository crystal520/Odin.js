require(
    {
        baseUrl: "../node_modules/odin/src"
    },
    [
        "odin",
    ],
    function( Odin ){
        
        Odin.globalize();
        
        game = new ClientGame({
            name: "Game",
            host: "127.0.0.1",
            port: 8080,
            debug: true
        });
        
        game.on("init", function(){
            // Game goes here
        });
        
        game.init();
    }
);