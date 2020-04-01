let height = 0;
let width = 0;
let offsetLeft = 0;
let offsetTop = 0;

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
    var rutaFlechaIzq = "assets/flecha-izq.png";
    var rutaFlechaDer = "assets/flecha-der.png";

    var alimentos = [];

    var vidas = 0;
    var puntuacion = 0;

    App.prototype.initialize = function(){
        var self = this;

        this.canvas = document.createElement("canvas");

        var ancho_pantalla = window.innerWidth;
        var largo_pantalla = window.innerHeight;

        if(largo_pantalla/ 2 > ancho_pantalla){
            this.canvas.width = ancho_pantalla;
            this.canvas.height = ancho_pantalla * 2;
            this.adaptador = this.canvas.width / 400;
        }else{
            this.canvas.width = largo_pantalla / 2;
            this.canvas.height = largo_pantalla;
            this.adaptador = this.canvas.height / 800;
        }

        height = this.canvas.height;
        width = this.canvas.width;

        var contenedor = document.getElementById("juego");
        contenedor.appendChild(this.canvas);
        this.stage = new createjs.Stage(this.canvas);

        offsetLeft = this.canvas.offsetLeft;
        offsetTop = this.canvas.offsetTop;

        
        if(!checkCookie("record"))
            this.record = 0;
        else
            this.record = getCookie("record");
        
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
        this.cargador.cargarImagenes([rutaFondo,rutaBola,rutaTrianguMalo, rutaPoligono,rutaTriangulo, rutaCuadrado, rutaFlechaIzq, rutaFlechaDer]);
    }
    
    App.prototype.assetsCargados = function(){

        this.fondo = this.crearBitmap(rutaFondo, 0, 0);

        var bmpBola = this.cargador[rutaBola];
        this.bola = new Bola(bmpBola);
        var x_bola = (this.canvas.width / 2) - (ajustarDimension(this.bola.image.width) / 2);
        this.bola.setTransform(x_bola,this.canvas.height / 2, this.adaptador, this.adaptador);
        this.stage.addChild(this.bola);

        this.puntuacionText = this.crearText(puntuacion,200,30,50, "center");

        this.vidaText = this.crearText("♥:"+vidas,10,10,35, "left", "#922B21");
        
        this.recordText = this.crearText("Récord: "+this.record,200,380, 25, "center", "#FFF");

        this.titulo = this.crearText("PELOMÉTRICA", 200, 130, 50, "center", "#2E4053");
        
        if(isMobile()){
            this.jugar = this.crearText("(Presiona la pelota para comenzar..)", 200, 500, 20, "center", "#212F3C")
            this.flechaIzq = this.crearBitmap(rutaFlechaIzq, 20, 700);
            this.flechaDer = this.crearBitmap(rutaFlechaDer, 330, 700);
        }else{
            this.jugar = this.crearText("(Pulsa la tecla 'J' para comenzar..)", 200, 500, 20, "center", "#212F3C")
        }

/*        if(!isMobile())
            this.stage.addEventListener("stagemousedown", handleClick);

        function handleClick(e){
            if(app.jugar.visible){
                if(hizoClickEnBitmap(e, app.jugar))
                    app.iniciarJuego();
            }
        }
        
        function hizoClickEnBitmap(e, bitmap){
            //no encontre otra forma sin que tire error
            if(e.localX > bitmap.x 
                && e.localX < bitmap.x + ajustarDimension(bitmap.image.width) 
                && e.localY >  bitmap.y 
                && e.localY < bitmap.y + ajustarDimension(bitmap.image.height)){ 
                    return true;
            }
            return false;
        }*/

        
        this.panatallaInicio();

        var self = this;
        createjs.Ticker.interval = 10;
        createjs.Ticker.addEventListener("tick", handleTick);
        function handleTick(e){
            self.tick();
        };
    }


    App.prototype.crearBitmap = function(ruta, x, y){
        var bmp = this.cargador[ruta];
        var bitmap = new createjs.Bitmap(bmp);
        bitmap.setTransform(ajustarDimension(x),ajustarDimension(y),this.adaptador,this.adaptador);
        window.app.stage.addChild(bitmap);
        return bitmap;
    }

    App.prototype.crearText = function(texto, x, y, tamano, align, color = "#000"){
        var nuevoTexto = new createjs.Text(texto, `${ajustarDimension(tamano)}px 'Baloo Thambi 2', cursive`, "#000");
        nuevoTexto.x = ajustarDimension(x);
        nuevoTexto.y = ajustarDimension(y);
        nuevoTexto.textAlign = align;
        nuevoTexto.color = color;
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
        this.recordText.visible = false;

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
        this.actualizarRecord();
        this.vidaText.visible = false;
        this.puntuacionText.visible = false;
        this.pararLluvia();
    }

    App.prototype.panatallaInicio = function(){
        this.pararJuego();
        this.titulo.visible = true;
        this.jugar.visible = true;
        this.recordText.visible = true;
    }

    App.prototype.iniciarLluvia = function(){
        this.timerLluvia = setInterval(`app.agregarAlimento('${rutaCuadrado}',100, 0.005)`, 4000);
        this.timerPoligono = setInterval(`app.agregarAlimento('${rutaPoligono}',175, 0.008)`, 5000);
        this.timerTriangulo = setInterval(`app.agregarAlimento('${rutaTriangulo}',250, 0.01)`, 7500);
        this.timerMalo = setInterval(`app.agregarAlimento('${rutaTrianguMalo}',-1, 0.08)`, 9500);
    }

    App.prototype.pararLluvia = function(){
        clearInterval(this.timerLluvia);
        clearInterval(this.timerPoligono);
        clearInterval(this.timerTriangulo);
        clearInterval(this.timerMalo);
    }

    App.prototype.agregarAlimento = function (ruta, suma, velocidad){
        var bmp = this.cargador[ruta];
        var x = Math.floor(Math.random() * (this.canvas.width - ajustarDimension(25)));
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

    App.prototype.actualizarVida = function(){
            var texto_vidas = "";
            for(var i = 1; i <= vidas; i++)
                texto_vidas += "♥ "
            this.vidaText.set({text: texto_vidas}
        )};

    App.prototype.actualizarPuntuacion = function(){this.puntuacionText.set({text:puntuacion})};

    App.prototype.actualizarRecord = function(){
        if(puntuacion > this.record){
            this.record = puntuacion;
            setCookie("record", this.record, 365);
            this.recordText.set({text:'Récord: '+ this.record});
        }        
    };
        
    scope.App = App;
}(window));


function ajustarDimension(medida){
    if(window.app.adaptador)
        return medida * window.app.adaptador
    else
        return 0;
};

window.onload = function(){
    this.app = new App();
}

