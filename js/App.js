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

        if(document.body.offsetHeight / 2 > document.body.offsetWidth){
            this.canvas.width = document.body.offsetWidth;
            this.canvas.height = document.body.offsetWidth * 2;
            this.adaptador = this.canvas.width / 400;
        }else{
            this.canvas.width = document.body.offsetHeight / 2;
            this.canvas.height = document.body.offsetHeight;
            this.adaptador = this.canvas.height / 800;
        }

        var contenedor = document.getElementById("juego");
        contenedor.appendChild(this.canvas);
        this.stage = new createjs.Stage(this.canvas);

        
        this.puntuacion = 0;
        this.vidas = 5;

        this.cargador = new Cargador();
        this.cargador.cargaCompletada = function(){
            self.assetsCargados();
           /* var queue = new createjs.LoadQueue();
            createjs.Sound.alternateExtensions = ["mp3"];
            queue.installPlugin(createjs.Sound);
            queue.loadManifest([
                {id:"mapa1", src:"sfx/mapa1_cancion.mp3"}
            ]);*/
        }
        this.cargador.cargarImagenes([rutaFondo,rutaBola,rutaTrianguMalo, rutaPoligono,rutaTriangulo, rutaCuadrado, rutaTitulo, rutaJugar]);
    }

    App.prototype.assetsCargados = function(){

        this.fondo = this.crearBitmap(rutaFondo, 0, 0);

        var bmpBola = this.cargador[rutaBola];
        this.bola = new Bola(bmpBola);
        var x_bola = (this.canvas.width / 2) - (ajustarDimension(this.bola.image.width) / 2);
        this.bola.setTransform(x_bola,this.canvas.height / 2, this.adaptador, this.adaptador);
        this.stage.addChild(this.bola);

        this.puntuacionText = this.crearText("Puntuación: "+puntuacion,20,30);

        this.vidaText = this.crearText("Vidas: "+vidas,20,50);

        this.mejorPuntuacionText = this.crearText("Mejor Puntuación: "+this.puntuacion,20,30);

        this.titulo = this.crearBitmap(rutaTitulo, 101, 168);


        this.jugar = this.crearBitmap(rutaJugar, 124, 345);


        this.stage.addEventListener("stagemousedown", function(e){
            // Check si hace click a jugar (no encontre otra forma)
            if(e.localX > ajustarDimension(124) && e.localX <  ajustarDimension(124 + window.app.jugar.image.width) && e.localY >  ajustarDimension(345) && e.localY < ajustarDimension(345 +window.app.jugar.image.height)){ 
                app.iniciarJuego();
            }
        });

        this.panatallaInicio();

        var self = this;
        createjs.Ticker.interval = 20;
        createjs.Ticker.addEventListener("tick", handleTick);
        function handleTick(e){
            self.tick();
        };
    }

    function ajustarDimension(medida){return medida * window.app.adaptador};

    App.prototype.crearBitmap = function(ruta, x, y){
        var bmp = this.cargador[ruta];
        var bitmap = new createjs.Bitmap(bmp);
        bitmap.setTransform(ajustarDimension(x),ajustarDimension(y),this.adaptador,this.adaptador);
        window.app.stage.addChild(bitmap);
        return bitmap;
    }

    App.prototype.crearText = function(texto, x, y){
        var nuevoTexto = new createjs.Text(texto, `bold ${ajustarDimension(20)}px Arial`, "#000");
        nuevoTexto.x = ajustarDimension(x);
        nuevoTexto.y = ajustarDimension(y);
        nuevoTexto.textBaseline = "alphabetic";
        this.stage.addChild(nuevoTexto);
        return nuevoTexto;
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

        //createjs.Sound.play("mapa1");
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
        //createjs.Sound.stop();
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

    App.prototype.agregarAlimento = function (ruta, suma, velocidad){
        var bmp = this.cargador[ruta];
        var x = Math.floor(Math.random() * (this.canvas.width - 50));
        var velocidad_nueva = velocidad;
        if(puntuacion > 10000)
            velocidad_nueva *= 3;
        else if(puntuacion > 5000)
            velocidad_nueva *= 2;
        else if(puntuacion > 2500)
            velocidad_nueva *= 1.5;
            
        var alimento = new Alimento(bmp, suma, x, velocidad_nueva);
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