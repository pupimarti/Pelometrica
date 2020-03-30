(function(scope){
    function Alimento(bmp, suma, pos_x, velocidad){
        this.inicializar(bmp, suma, pos_x, velocidad);
    }

    
    Alimento.prototype = new createjs.Bitmap();

    Alimento.prototype.inicializar = function(bmp, suma, x, velocidad){
        this.image = bmp;
        this.setTransform(x,-30,0.5,0.5);
        
        this.suma = suma;

        this.set({x:x})
        
        this.velocidad = {
            velocidad: velocidad,
            y: 0,
        }
    }

    Alimento.prototype.update = function(bola){
        {
            if(this.parent != null){
                this.velocidad.y += this.velocidad.velocidad;
                if(this.velocidad.y < 0 || this.y < 600){
                    this.set({y:this.y + this.velocidad.y});
                }else if(this.y >= 600){
                    this.eliminar();
                    window.app.quitarVida()
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

