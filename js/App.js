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
    var rutaBola = "assets/bola.png";
    var rutaCuadrado = "assets/Cuadrado.png";
    var rutaEstrella = "assets/Estrella.png";
    var rutaTriangulo = "assets/Triangulo.png";
        
    const URL = "test";

    App.prototype.initialize = function(){
        var self = this;
        this.canvas = document.createElement("canvas");
        this.canvas.width = 600;
        this.canvas.height = 600;
        this.canvas.style.backgroundColor = "#000";

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

        
        console.log("todos los recursos cargados.");

        var bmp = this.cargador[rutaFondo];
        this.fondo = new createjs.Bitmap(bmp);
        this.stage.addChild(this.fondo);

        var bmpBola = this.cargador[rutaBola];
        this.bola = new createjs.Bitmap(bmpBola);
        this.stage.addChild(this.bola);

        var self = this;
        createjs.Ticker.addEventListener("tick", handleTick);
        function handleTick(e){
            self.tick();
        };
    }

    App.prototype.tick = function(){
        this.stage.update();
    }

    scope.App = App;
}(window));

window.onload = function(){
    this.app = new App();
}