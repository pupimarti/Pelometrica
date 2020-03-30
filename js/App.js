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
    var puntuacion = 0;

    App.prototype.initialize = function(){
        var self = this;
        this.canvas = document.createElement("canvas");

        if(this.canvas.height / 2 > this.canvas.width){
            this.canvas.width = screen.width;
            this.canvas.height = screen.width * 2;
            this.adaptador = this.canvas.width / 400;
        }else{
            this.canvas.width = screen.height / 2;
            this.canvas.height = screen.height;
            this.adaptador = this.canvas.height / 800;
        }


        this.puntuacion = 0;
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
        this.fondo.setTransform(0, 0, this.canvas.width / this.fondo.image.width, this.canvas.height / this.fondo.image.height);
        this.stage.addChild(this.fondo);

        var bmpBola = this.cargador[rutaBola];
        this.bola = new Bola(bmpBola);
        var x_bola = (this.canvas.width / 2) - ((this.bola.image.width * this.adaptador) / 2);
        this.bola.setTransform(x_bola,this.canvas.height / 2, this.adaptador, this.adaptador);
        this.stage.addChild(this.bola);

        this.puntuacionText = new createjs.Text("Puntuación: "+puntuacion, `bold ${20*this.adaptador}px Arial`, "#000");
        this.puntuacionText.x = 20 * this.adaptador;
        this.puntuacionText.y = 30 * this.adaptador;
        this.puntuacionText.textBaseline = "alphabetic";
        this.stage.addChild(this.puntuacionText);

        this.vidaText = new createjs.Text("Vidas: "+vidas, `bold ${20*this.adaptador}px Arial`, "#000");
        this.vidaText.x = 20 * this.adaptador;
        this.vidaText.y = 50 * this.adaptador;
        this.vidaText.textBaseline = "alphabetic";
        this.stage.addChild(this.vidaText);

        this.mejorPuntuacionText = new createjs.Text("Mejor Puntuación: "+vidas, `bold ${20*this.adaptador}px Arial`, "#000");
        this.mejorPuntuacionText.x = 20 * this.adaptador;
        this.mejorPuntuacionText.y = 50 * this.adaptador;
        this.mejorPuntuacionText.textBaseline = "alphabetic";
        this.stage.addChild(this.mejorPuntuacionText);

        
        var bmp = this.cargador[rutaTitulo];
        this.titulo = new createjs.Bitmap(bmp);
        var x_titulo = (this.canvas.width / 2) - ((this.titulo.image.width * this.adaptador) / 2);
        var y_titulo = (this.canvas.height / 4) - ((this.titulo.image.height * this.adaptador) / 2);
        this.titulo.setTransform(x_titulo,y_titulo,this.adaptador,this.adaptador);
        this.stage.addChild(this.titulo);

        var bmp = this.cargador[rutaJugar];
        this.jugar = new createjs.Bitmap(bmp);
        var x_jugar = (this.canvas.width / 2) - ((this.jugar.image.width * this.adaptador) / 2);
        var y_jugar = ((this.canvas.height / 4) - ((this.jugar.image.height * this.adaptador) / 2)) * 2;
        this.jugar.setTransform(x_jugar,y_jugar,this.adaptador,this.adaptador);
        this.stage.addEventListener("stagemousedown", handleClick);
        function handleClick(e) {
           // Check si hace click a jugar (no encontre otra forma)
           if(e.localX > x_jugar && e.localX < x_jugar + window.app.jugar.image.width && e.localY > y_jugar && e.localY < y_jugar + window.app.jugar.image.height){ 
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
        this.mejorPuntuacionText.visible = false;

        this.vidaText.visible = true;
        this.puntuacionText.visible = true;

        vidas = this.vidas;
        this.actualizarVida();

        puntuacion = 0;
        this.actualizarPuntuacion();

        this.iniciarLluvia();
    }

    
    App.prototype.pararJuego = function(){
        if(puntuacion > this.puntuacion){
            this.puntuacion = puntuacion;
            this.actualizarMejorPuntuacion();
        }
        this.vidaText.visible = false;
        this.puntuacionText.visible = false;
        this.pararLluvia();
    }

    App.prototype.panatallaInicio = function(){
        this.pararJuego();
        this.titulo.visible = true;
        this.jugar.visible = true;
        this.mejorPuntuacionText.visible = true;
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

    App.prototype.agregarAlimento = function (ruta, puntuacion, velocidad){
        var bmp = this.cargador[ruta];
        var x = Math.floor(Math.random() * (this.canvas.width - 50));
        var alimento = new Alimento(bmp, puntuacion, x, velocidad);
        this.stage.addChild(alimento);
        alimentos.push(alimento);
    }

    App.prototype.eliminarAlimento = function(alimento){
        var index = alimentos.indexOf(alimento);
        this.stage.removeChild(alimento);
        if(index != -1)
            alimentos.splice(index, 1);
    }

    App.prototype.sumarPuntuacion = function(suma){
        puntuacion += suma;
        this.actualizarPuntuacion();
    }

    App.prototype.quitarVida = function(){
        vidas--;
        this.actualizarVida();
        if(vidas <= 0) this.panatallaInicio();
    }

    App.prototype.actualizarVida = function(){this.vidaText.set({text:'Vidas: '+ vidas})};

    App.prototype.actualizarPuntuacion = function(){this.puntuacionText.set({text:'Puntuación: '+ puntuacion})};

    App.prototype.actualizarMejorPuntuacion = function(){this.mejorPuntuacionText.set({text:'Mejor Puntuacion: '+ this.puntuacion})};


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