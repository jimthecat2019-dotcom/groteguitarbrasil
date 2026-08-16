/* =========================================
   GROTE GUITAR BRASIL
   SCRIPT PRINCIPAL
========================================= */


/* =========================================
   SEMPRE ABRIR NO TOPO
========================================= */

/* Impede o navegador de restaurar a rolagem antiga */
if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
}


/* Remove #sobre, #modelos etc. ao recarregar */
if (window.location.hash) {
    history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search
    );
}


/* Força o topo imediatamente */
window.scrollTo(0, 0);


/* Força novamente quando o HTML carregar */
document.addEventListener("DOMContentLoaded", () => {
    window.scrollTo(0, 0);
});


/* Força novamente quando imagens e página terminarem */
window.addEventListener("load", () => {

    window.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto"
    });

});


/* Também funciona ao voltar para a página pelo navegador */
window.addEventListener("pageshow", () => {

    window.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto"
    });

});


/* Pequena garantia extra contra restauração tardia do Chrome */
setTimeout(() => {
    window.scrollTo(0, 0);
}, 100);

setTimeout(() => {
    window.scrollTo(0, 0);
}, 400);



/* =========================================
   ANIMAÇÃO DA GUITARRA DO HERO
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const guitarra = document.querySelector(".hero-imagem img");

    if (!guitarra) {
        return;
    }

    /*
       Reinicia a animação toda vez que
       a página é carregada.
    */

    guitarra.style.animation = "none";

    guitarra.offsetHeight;

    guitarra.style.animation = "";

});
