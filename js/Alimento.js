(function(scope){
    function Alimento(bmp, suma, pos_x){
        this.inicializar(bmp, suma, pos_x);
    }

    
    Alimento.prototype = new createjs.Bitmap();

    Alimento.prototype.inicializar = function(bmp, suma, x){
        this.image = bmp;

        this.suma = suma;

        this.set({x:x})
        
        this.velocidad = {
            y: 0,
        }
    }

    Alimento.prototype.update = function(bola, alimentos){
        {
            this.velocidad.y += 0.1;
            if(this.velocidad.y < 0 || this.y < 425){
                this.set({y:this.y + this.velocidad.y});
            }
            var col = ndgmr.checkRectCollision(bola, this);
            
            if(col){
                alimentos.splice(alimentos.indexOf(this), 1);
                this.parent.removeChild(this);
                //window.app.alimentos.splice(window.app.alimentos.indexOf(this), 1);
            }
        }
    }

    scope.Alimento = Alimento;
    }(window));

