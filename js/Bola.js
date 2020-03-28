(function(scope){
    function Bola(bmpBola){
        this.inicializar(bmpBola);
    }

    Bola.prototype = new createjs.Bitmap();
    Bola.prototype.promote = Bola.prototype.inicializar;

    Bola.prototype.inicializar = function(bmpBola){
        this.promote(bmpBola);
        
        var self = this;
        console.log(this);
        console.log("inicializando bola");

    }

    Bola.prototype.onTick = function(){

    }

    scope.Bola = Bola;
    }(window));