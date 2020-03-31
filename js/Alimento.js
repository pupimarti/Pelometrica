(function(scope){
    function Alimento(bmp, suma, pos_x, velocidad){
        this.inicializar(bmp, suma, pos_x, velocidad);
    }

    
    Alimento.prototype = new createjs.Bitmap();

    Alimento.prototype.inicializar = function(bmp, suma, x, velocidad){
        this.image = bmp;



        this.setTransform(x, ajustarDimension(-30), ajustarDimension(0.5), ajustarDimension(0.5));
        
        this.suma = suma;

        this.y_piso = ((height / 4) - (ajustarDimension(this.image.height) / 2)) * 3;

        this.set({x:x})
        
        this.velocidad = {
            velocidad: velocidad,
            y: 0,
        }
    }

    Alimento.prototype.update = function(bola){
        {
            if(this.parent != null){
                this.velocidad.y += ajustarDimension(this.velocidad.velocidad);
                if(this.y < height){
                    this.set({y:this.y + this.velocidad.y});
                }else{
                    this.eliminar();
                    if(this.suma > 0)
                        window.app.quitarVida()
                }
                var col = ndgmr.checkRectCollision(bola, this);
                if(col){
                    this.eliminar();
                    if(this.suma < 0)
                        window.app.quitarVida();
                    else
                        window.app.sumarPuntuacion(this.suma);
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

