(function(scope){
    function Bola(bmp){
        this.inicializar(bmp);
    }

    
    Bola.prototype = new createjs.Bitmap();

    Bola.prototype.inicializar = function(bmp){
        this.image = bmp;
        
        this.velocidad = {
            x: 0,
            y: 0,
        }
    }

    Bola.prototype.moverDerecha = function(){
        if(this.velocidad.x >= 20){
            this.velocidad.x = 20;
        }else{
            this.velocidad.x += 3;
        }
    }

    Bola.prototype.moverIzquierda = function(){
            if(this.velocidad.x <= -20){
                this.velocidad.x = -20;
            }else{
                this.velocidad.x -= 3;
            }
    }

    Bola.prototype.saltar = function(){
        if(this.y === 425){
            this.velocidad.y = -15;
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
                    this.set({x: 600});
                else if(this.x >= 600)
                    this.set({x:-50});
            }
            
            this.velocidad.y += 1;
            if(this.velocidad.y < 0 || this.y < 425){
                this.set({y:this.y + this.velocidad.y});
            }
        }
    }

    scope.Bola = Bola;
    }(window));

