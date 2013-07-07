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
        
        game.on("init", function(){
            // Client Game goes here
        });
        
        game.init();
    }
);