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
            host: "192.168.1.191",
            port: 3000,
            debug: true
        });
        
        game.on("init", function(){
            // Client Game goes here
        });
        
        game.init();
    }
);