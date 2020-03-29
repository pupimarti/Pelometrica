(function(scope){
    function Alimento(bmp, suma, pos_x){
        this.inicializar(bmp, suma, pos_x);
    }

    
    Alimento.prototype = new createjs.Bitmap();

    Alimento.prototype.inicializar = function(bmp, suma, x){
        this.image = bmp;
        this.setTransform(x,-30,0.5,0.5);
        
        this.suma = suma;

        this.set({x:x})
        
        this.velocidad = {
            y: 0,
        }
    }

    Alimento.prototype.update = function(bola){
        {
            if(this.parent != null){
                this.velocidad.y += 0.01;
                if(this.velocidad.y < 0 || this.y < 430){
                    this.set({y:this.y + this.velocidad.y});
                }else if(this.y >= 430){
                    this.eliminar();
                    window.app.restarScore(this.suma)
                }
                var col = ndgmr.checkRectCollision(bola, this);
                if(col){
                    this.eliminar();
                    window.app.sumarScore(this.suma);
                }
            }
        }

    Alimento.prototype.eliminar = function(){
            if(this.parent != null){
                window.app.eliminarAlimento(this);
            }
        }
    }

    scope.Alimento = Alimento;
    }(window));

