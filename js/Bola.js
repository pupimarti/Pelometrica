(function(scope){
    function Bola(bmp){
        this.inicializar(bmp);
    }

    
    Bola.prototype = new createjs.Bitmap();

    Bola.prototype.inicializar = function(bmp){
        this.image = bmp;
        
        this.velocity = {
            x: 0,
            y: 0,
            aY: 0,
        }
    }

    Bola.prototype.moverDerecha = function(){

    }

    Bola.prototype.moverIzquierda = function(){

    }

    Bola.prototype.saltar = function(){
        this.velocity.y = +15;
    }

    Bola.prototype.update = function(){
        {
            this.velocity.y += 1;
            if(this.velocity.y < 0 || this.y < 425){
                this.set({y:this.y + this.velocity.y});
            }

            if(this.velocity.x != 0){
                if(this.velocity.x > 0){
                    this.velocity.x -= 1;
                }else{
                    this.velocity.x +=1;
                }
                this.x += this.velocity.x;
            }
        }
    }

    scope.Bola = Bola;
    }(window));

