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
            forceCanvas: true,
            debug: true
        });
        
        game.on("init", function(){
            // Game goes here
        });
        
        game.init();
    }
);