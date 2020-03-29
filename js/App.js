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
    var rutaCuadrado = "assets/Cuadrado50.png";
    var rutaEstrella = "assets/Estrella.png";
    var rutaTriangulo = "assets/Triangulo50.png";

    var alimentos = [];
        
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
            self.lluviaAlimentos();
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
        createjs.Ticker.interval = 20;
        createjs.Ticker.addEventListener("tick", handleTick);
        function handleTick(e){
            self.tick();
        };

    App.prototype.tick = function(){
        this.stage.update();
        this.bola.update();
        if(alimentos.length > 0){
            alimentos.forEach(a => {
                a.update(this.bola, alimentos);
            });
        }
    }

    App.prototype.lluviaAlimentos = function(){
        var bmpCuadrado = this.cargador[rutaCuadrado];
        var cuadrado = new Alimento(bmpCuadrado, 10, 40);
        this.stage.addChild(cuadrado);
        alimentos.push(cuadrado);
    }

    App.prototype.eliminarAlimento = function(alimento){
        var index = alimentos.indexOf(alimento);
        if(index != -1)
            alimentos.splice(alimentos.indexOf(index), 1);
    }

    App.prototype.sumarScore = function(suma){
        console.log(suma);
    }

    App.prototype.restarScore = function(resta){
        console.log(resta);
    }


    document.addEventListener("keydown", function(e){
        switch(e.key){
            case 'w': //w
            case 'ArrowUp':
            case ' ': //space
                self.bola.saltar();
                break;
            case 'a': //a
            case 'ArrowLeft':
                self.bola.moverIzquierda();
                break;
            case 'd': //d
            case 'ArrowRight':
                self.bola.moverDerecha();
                break;
        }
    })
        
    }
    scope.App = App;
}(window));

window.onload = function(){
    this.app = new App();
}