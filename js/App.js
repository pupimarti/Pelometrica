(function(scope){
    function App(){
        this.initialize();
    }

    var canvas = App.prototype;
    var stage = App.prototype;
    var cargador = App.prototype;

    var fondo = App.prototype;
    var nave = App.prototype;

    var rutaFondo = "assets/fondo.jpg";
    var rutaBola = "assets/bola50.png";
    var rutaCuadrado = "assets/Cuadrado.png";
    var rutaEstrella = "assets/Estrella.png";
    var rutaTriangulo = "assets/Triangulo.png";
        
    const URL = "test";

    App.prototype.initialize = function(){
        var self = this;
        this.canvas = document.createElement("canvas");
        this.canvas.width = 600;
        this.canvas.height = 600;

        var contenedor = document.getElementById("juego");
        contenedor.appendChild(this.canvas);
        this.stage = new createjs.Stage(this.canvas);
        
        this.cargador = new Cargador();
        this.cargador.cargaCompletada = function(){
            self.assetsCargados();
        }
        this.cargador.cargarImagenes([rutaFondo,rutaBola,rutaEstrella,rutaTriangulo, rutaCuadrado]);
    }

    App.prototype.assetsCargados = function(){
        var bmp = this.cargador[rutaFondo];
        this.fondo = new createjs.Bitmap(bmp);
        this.fondo.setTransform(0, 0, 2, 2);
        this.stage.addChild(this.fondo);

        var bmpBola = this.cargador[rutaBola];
        this.bola = new Bola(bmpBola);
        this.bola.set({x:250,y:415});
        this.stage.addChild(this.bola);


        var self = this;
        createjs.Ticker.addEventListener("tick", handleTick);
        createjs.Ticker.interval = 10;
        function handleTick(e){
            self.bola.update();
            self.tick();
        };

    document.addEventListener("keypress", function(e){
        switch(e.keyCode){
            case 119: //w
                self.bola.saltar();
                break;
            case 32:
                self.bola.saltar();
                break;
            case 97: //a
                self.bola.moverIzquierda();
                break;
            case 100: //d
                self.bola.moverDerecha();
                break;
        }
    })
        
    }

    App.prototype.tick = function(){
        this.stage.update();
    }

    scope.App = App;
}(window));

window.onload = function(){
    this.app = new App();
}