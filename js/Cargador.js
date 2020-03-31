(function(scope){
    function Cargador(){
        this.inicializar();
    }

    var cargadas = Cargador.prototype;
    var totales = Cargador.prototype;
    var cargaCompletada = Cargador.prototype;

    Cargador.prototype.inicializar = function(){
        
    };

    Cargador.prototype.cargarImagenes = function(lista){
        this.cargadas = 0;
        this.totales = lista.length;
        lista.forEach(element => {
            this.cargaImagen(element);
        });
    };

    Cargador.prototype.cargaImagen = function(ruta){
        var image = new Image();   
        var self = this;
        this[ruta] = image;
        image.onload = function(element){
            self.imagenCargada();
        }
        image.src = image.src = ruta;
    };

    Cargador.prototype.imagenCargada = function(){
        this.cargadas ++;
        if(this.cargadas >= this.totales){
            this.cargaCompletada();
        }
    }    

    scope.Cargador = Cargador;
    }(window));

    window.onload = function(){
        this.Cargador = new Cargador();
    }