(function(scope){
    function Bola(bmp){
        this.inicializar(bmp);
    }

    
    Bola.prototype = new createjs.Bitmap();


    Bola.prototype.inicializar = function(bmp){
        this.image = bmp;

        this.y_piso = ((window.app.canvas.height / 4) * 3) - ((this.image.height * window.app.adaptador));
        
        this.velocidad = {
            x: 0,
            y: 0,
        }
    }

    Bola.prototype.moverDerecha = function(){
        if(this.velocidad.x >= 20){
            this.velocidad.x = 20;
        }else{
            this.velocidad.x += 2 * window.app.adaptador;
        }
    }

    Bola.prototype.moverIzquierda = function(){
            if(this.velocidad.x <= -20){
                this.velocidad.x = -20;
            }else{
                this.velocidad.x -= 2 * window.app.adaptador;
            }
    }

    Bola.prototype.saltar = function(){
        if(this.y >= this.y_piso){
            this.velocidad.y = -15 * window.app.adaptador;
        }
    }

    Bola.prototype.update = function(){
        {

            if(this.velocidad.x != 0){
                if(this.velocidad.x > 0){
                    this.velocidad.x *= 0.9;
                }else{
                    this.velocidad.x *= 0.9;
                }
                this.set({x:this.x += this.velocidad.x, skewX: this.rotation + this.velocidad.x});
                if(this.x <= -50)
                    this.set({x: window.app.canvas.width});
                else if(this.x >= window.app.canvas.width)
                    this.set({x:-50});
            }
            
            this.velocidad.y += 1 * window.app.adaptador;
            if(this.velocidad.y < 0 || this.y < this.y_piso){
                this.set({y:this.y + this.velocidad.y});
            }
        }
    }

    scope.Bola = Bola;
    }(window));

