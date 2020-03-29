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
            this.velocidad.x *= 1.5;
        }
    }

    Bola.prototype.moverIzquierda = function(){
        if(this.velocidad.x <= 20){
            this.velocidad.x = -20;
        }else{
            this.velocidad.x *= -0.5;
        }
    }

    Bola.prototype.saltar = function(){
        this.velocidad.y = -15;
    }

    Bola.prototype.update = function(){
        {
            this.velocidad.y += 1;
            if(this.velocidad.y < 0 || this.y < 425){
                this.set({y:this.y + this.velocidad.y});
            }

            if(this.velocidad.x != 0){
                if(this.velocidad.x > 0){
                    this.velocidad.x *= 1.2;
                }else{
                    this.velocidad.x *= 0.6;
                }
                this.set({x:this.x += this.velocidad.x});
                if(this.x <= -50){
                    this.set({x: 600});
                }
            }
        }
    }

    scope.Bola = Bola;
    }(window));

