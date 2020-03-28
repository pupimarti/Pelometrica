(function(scope){
    function Bola(bmpBola){
        this.inicializar(bmpBola);
    }

    Bola.prototype.inicializar = function(bmpBola){
        Bola.prototype = new createjs.Bitmap(bmpBola);
        
        var self = this;
        console.log(this);
        console.log("inicializando bola");
        this.x = 300;
        this.y = 300;
        this.velocity = {x:0, y:-15};

    }

    Bola.prototype.onTick = function(){
        this.velocity.y == 1;
        if(this.velocity.y < 0 || this.y < 500){
            this.y += this.velocity.y;
        }
    }

    scope.Bola = Bola;
    }(window));