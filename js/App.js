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
    var rutaTrianguMalo = "assets/Triangumalo.png";
    var rutaPoligono = "assets/poligono.png";
    var rutaTriangulo = "assets/Triangulo.png";

    var alimentos = [];

    App.prototype.initialize = function(){
        var self = this;
        this.canvas = document.createElement("canvas");
        this.canvas.width = 600;
        this.canvas.height = 600;

        this.score = 0;
        this.vidas = 5;

        var contenedor = document.getElementById("juego");
        contenedor.appendChild(this.canvas);
        this.stage = new createjs.Stage(this.canvas);
        
        this.cargador = new Cargador();
        this.cargador.cargaCompletada = function(){
            self.assetsCargados();
            self.iniciarLluvia();
        }
        this.cargador.cargarImagenes([rutaFondo,rutaBola,rutaTrianguMalo, rutaPoligono,rutaTriangulo, rutaCuadrado]);
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

        this.scoreText = new createjs.Text("Score: "+this.score, "bold 20px Arial", "#000");
        this.scoreText.x = 10;
        this.scoreText.y = 30;
        this.scoreText.textBaseline = "alphabetic";
        this.stage.addChild(this.scoreText);

        this.vidaText = new createjs.Text("Vidas: "+this.vidas, "bold 20px Arial", "#000");
        this.vidaText.x = 10;
        this.vidaText.y = 50;
        this.vidaText.textBaseline = "alphabetic";
        this.stage.addChild(this.vidaText);

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
                if(this.vidas <= 0)
                    this.eliminarAlimento(a);
                else
                    a.update(this.bola);
            });
        }
    }

    App.prototype.iniciarLluvia = function(){
        this.timerLluvia = window.setInterval("app.agregarCuadrado()", 4000);
        this.timerPoligono = window.setInterval("app.agregarPoligono()", 5000);
        this.timerTriangulo = window.setInterval("app.agregarTriangulo()", 7500);
        this.timerMalo = window.setInterval("app.agregarTrianguloMalo()", 9500);
    }

    App.prototype.pararLluvia = function(){
        window.clearInterval(this.timerLluvia);
        window.clearInterval(this.timerPoligono);
        window.clearInterval(this.timerTriangulo);
        window.clearInterval(this.timerMalo);
    }

    App.prototype.agregarCuadrado = function(){
        var bmp = this.cargador[rutaCuadrado];
        var x = Math.floor(Math.random() * 550);
        var cuadrado = new Alimento(bmp, 100, x, 0.005);
        this.stage.addChild(cuadrado);
        alimentos.push(cuadrado);
    }

    App.prototype.agregarTriangulo = function(){
        var bmp = this.cargador[rutaTriangulo];
        var x = Math.floor(Math.random() * 550);
        var triangulo = new Alimento(bmp, 250, x, 0.01);
        this.stage.addChild(triangulo);
        alimentos.push(triangulo);
    }

    App.prototype.agregarPoligono = function(){
        var bmp = this.cargador[rutaPoligono];
        var x = Math.floor(Math.random() * 550);
        var triangulo = new Alimento(bmp, 175, x, 0.008);
        this.stage.addChild(triangulo);
        alimentos.push(triangulo);
    }

    App.prototype.agregarTrianguloMalo = function(){
        var bmp = this.cargador[rutaTrianguMalo];
        var x = Math.floor(Math.random() * 550);
        var triangulo = new Alimento(bmp, -20, x, 0.01);
        this.stage.addChild(triangulo);
        alimentos.push(triangulo);
    }

    App.prototype.eliminarAlimento = function(alimento){
        var index = alimentos.indexOf(alimento);
        this.stage.removeChild(alimento);
        if(index != -1)
            alimentos.splice(index, 1);
    }

    App.prototype.sumarScore = function(suma){
        this.score += suma;
        this.scoreText.set({text:'Score: '+ this.score});
    }

    App.prototype.quitarVida = function(){
        this.vidas--;
        if(this.vidas <= 0){
            this.pararLluvia();
        }
        this.vidaText.set({text:'Vidas: '+ this.vidas});
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