(function(scope){
    function Bola(bmp){
        this.inicializar(bmp);
    }

    
    Bola.prototype = new createjs.Bitmap();


    Bola.prototype.inicializar = function(bmp){
        this.image = bmp;

        this.y_piso = ((height / 4) * 3) - (ajustarDimension(this.image.height));
        
        this.velocidad = {
            x: 0,
            y: 0,
        }

        this.moverIzq = false;
        this.moverDer = false;
    }

    Bola.prototype.moverDerecha = function(){
        this.moverIzq = false;
        this.moverDer = true;
    }

    Bola.prototype.moverIzquierda = function(){
        this.moverDer = false;
        this.moverIzq = true;
    }

    Bola.prototype.noMoverDerecha = function(){
        this.moverDer = false;
    }

    Bola.prototype.noMoverIzquierda = function(){
        this.moverIzq = false;
    }

    Bola.prototype.saltar = function(){
        if(this.y >= this.y_piso){
            this.velocidad.y = ajustarDimension(-15);
        }
    }

    Bola.prototype.update = function(){
        {

            if(this.moverIzq){
                if(this.velocidad.x <= -20){
                    this.velocidad.x = -20;
                }else{
                    this.velocidad.x -= ajustarDimension(1);
                }
            }

            if(this.moverDer){
                if(this.velocidad.x >= 20){
                    this.velocidad.x = 20;
                }else{
                    this.velocidad.x += ajustarDimension(1);
                }
            }

            if(this.velocidad.x != 0){
                if(this.velocidad.x > 0){
                    this.velocidad.x *= 0.9;
                }else{
                    this.velocidad.x *= 0.9;
                }
                this.set({x:this.x += this.velocidad.x, skewX: this.rotation + this.velocidad.x});
                if(this.x <= -50)
                    this.set({x: width});
                else if(this.x >= width)
                    this.set({x:-50});
            }
            
            this.velocidad.y += ajustarDimension(0.7);
            if(this.velocidad.y < 0 || this.y < this.y_piso){
                this.set({y:this.y + this.velocidad.y});
            }
        }
    }

    scope.Bola = Bola;
    }(window));

