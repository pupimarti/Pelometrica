(function(scope){
    function App(){
        this.initialize();
    }

    var rutaFondo = "assets/fondo.jpg";
    var rutaBola = "assets/bola.png";
    var rutaCuadrado = "assets/Cuadrado.png";
    var rutaTrianguMalo = "assets/Triangumalo.png";
    var rutaPoligono = "assets/poligono.png";
    var rutaTriangulo = "assets/Triangulo.png";
    var rutaTitulo = "assets/Titulo.png";
    var rutaJugar = "assets/Jugar.png";

    var alimentos = [];

    var vidas = 0;
    var score = 0;

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
        }
        this.cargador.cargarImagenes([rutaFondo,rutaBola,rutaTrianguMalo, rutaPoligono,rutaTriangulo, rutaCuadrado, rutaTitulo, rutaJugar]);
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

        this.scoreText = new createjs.Text("Score: "+score, "bold 20px Arial", "#000");
        this.scoreText.x = 10;
        this.scoreText.y = 30;
        this.scoreText.textBaseline = "alphabetic";
        this.stage.addChild(this.scoreText);

        this.vidaText = new createjs.Text("Vidas: "+vidas, "bold 20px Arial", "#000");
        this.vidaText.x = 10;
        this.vidaText.y = 50;
        this.vidaText.textBaseline = "alphabetic";
        this.stage.addChild(this.vidaText);

        
        var bmp = this.cargador[rutaTitulo];
        this.titulo = new createjs.Bitmap(bmp);
        this.titulo.setTransform(200,100,1,1);
        this.stage.addChild(this.titulo);

        var bmp = this.cargador[rutaJugar];
        this.jugar = new createjs.Bitmap(bmp);
        this.jugar.setTransform(220,300,1,1);
        this.stage.addEventListener("stagemousedown", handleClick);
        function handleClick(e) {
           // Check si hace click a jugar (no encontre otra forma)
           if(e.localX > 220 && e.localX < 370 && e.localY > 300 && e.localY < 340){ 
               app.iniciarJuego();
           }
        }
        this.stage.addChild(this.jugar);

        this.panatallaInicio();

        var self = this;
        createjs.Ticker.interval = 20;
        createjs.Ticker.addEventListener("tick", handleTick);
        function handleTick(e){
            self.tick();
        };
    }

    App.prototype.tick = function(){
        this.stage.update();
        this.bola.update();
        if(alimentos.length > 0){
            alimentos.forEach(a => {
                if(vidas <= 0)
                    this.eliminarAlimento(a);
                else
                    a.update(this.bola);
            });
        }
    }

    App.prototype.iniciarJuego = function(){

        this.titulo.visible = false;
        this.jugar.visible = false;

        this.vidaText.visible = true;
        this.scoreText.visible = true;

        vidas = this.vidas;
        this.actualizarVida();
        
        score = 0;
        this.actualizarScore();

        this.iniciarLluvia();
    }

    
    App.prototype.pararJuego = function(){
        this.vidaText.visible = false;
        this.scoreText.visible = false;
        this.pararLluvia();
    }

    App.prototype.panatallaInicio = function(){
        this.pararJuego();
        this.titulo.visible = true;
        this.jugar.visible = true;
    }

    App.prototype.iniciarLluvia = function(){
        this.timerLluvia = setInterval(`app.agregarAlimento('${rutaCuadrado}',100, 0.005)`, 4000);
        this.timerPoligono = setInterval(`app.agregarAlimento('${rutaPoligono}',175, 0.008)`, 5000);
        this.timerTriangulo = setInterval(`app.agregarAlimento('${rutaTriangulo}',250, 0.01)`, 7500);
        this.timerMalo = setInterval(`app.agregarAlimento('${rutaTrianguMalo}',-1, 0.1)`, 9500);
    }

    App.prototype.pararLluvia = function(){
        clearInterval(this.timerLluvia);
        clearInterval(this.timerPoligono);
        clearInterval(this.timerTriangulo);
        clearInterval(this.timerMalo);
    }

    App.prototype.agregarAlimento = function (ruta, score, velocidad){
        var bmp = this.cargador[ruta];
        var x = Math.floor(Math.random() * 550);
        var alimento = new Alimento(bmp, score, x, velocidad);
        this.stage.addChild(alimento);
        alimentos.push(alimento);
    }

    App.prototype.eliminarAlimento = function(alimento){
        var index = alimentos.indexOf(alimento);
        this.stage.removeChild(alimento);
        if(index != -1)
            alimentos.splice(index, 1);
    }

    App.prototype.sumarScore = function(suma){
        score += suma;
        this.actualizarScore();
    }

    App.prototype.quitarVida = function(){
        vidas--;
        this.actualizarVida();
        if(vidas <= 0) this.panatallaInicio();
    }

    App.prototype.actualizarVida = function(){this.vidaText.set({text:'Vidas: '+ vidas})};

    App.prototype.actualizarScore = function(){this.scoreText.set({text:'Score: '+ score})};


    document.addEventListener("keydown", function(e){
        switch(e.key){
            case 'w': //w
            case 'ArrowUp':
            case ' ': //space
                app.bola.saltar();
                break;
            case 'a': //a
            case 'ArrowLeft':
                app.bola.moverIzquierda();
                break;
            case 'd': //d
            case 'ArrowRight':
                app.bola.moverDerecha();
                break;
        }
    })
        
    scope.App = App;
}(window));

window.onload = function(){
    this.app = new App();
}