//clicks en movil en movil
document.addEventListener("touchstart", handleClickMovil);

document.addEventListener("touchend", handleUpClickMovil);

function handleClickMovil(e){
    if(app.jugar.visible){
        if(hizoClickEn_Movil(e, app.jugar))
            app.iniciarJuego();
    }
    if(hizoClickEn_Movil(e, app.flechaIzq))
            app.bola.moverIzquierda();
    else if(hizoClickEn_Movil(e, app.flechaDer))
            app.bola.moverDerecha();
    else
        app.bola.saltar();
}

function handleUpClickMovil(e){
    if(hizoClickEn_Movil(e, app.flechaIzq))
            app.bola.noMoverIzquierda();
    else if(hizoClickEn_Movil(e, app.flechaDer))
            app.bola.noMoverDerecha();
}

function hizoClickEn_Movil(e, bitmap){
    //no encontre otra forma sin que tire error
    if(e.touches.length > 0){
        if(e.touches[0].clientX > bitmap.x 
            && e.touches[0].clientX < bitmap.x + ajustarDimension(bitmap.image.width) 
            && e.touches[0].clientY >  bitmap.y 
            && e.touches[0].clientY < bitmap.y + ajustarDimension(bitmap.image.height))
                return true;
    }
    return false;
}

document.addEventListener("keyup", function(e){
    switch(e.key){
        case 'w': //w
        case 'ArrowUp':
        case ' ': //space
            app.bola.saltar();
            break;
        case 'a': //a
        case 'ArrowLeft':
            app.bola.noMoverIzquierda();
            break;
        case 'd': //d
        case 'ArrowRight':
            app.bola.noMoverDerecha();
            break;
    }
})