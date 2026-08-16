/* =========================================
   ABRIR O SITE SEMPRE NO TOPO
========================================= */

window.addEventListener("load", () => {
    if (window.location.hash) {
        history.replaceState(null, "", window.location.pathname);
    }

    window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant"
    });
});

/* =========================================
   ANIMAÇÃO DA GUITARRA
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const guitarra = document.querySelector(".hero-imagem img");

    if (!guitarra) return;


    const observer = new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    guitarra.classList.add("guitarra-visivel");

                }

            });

        },
        {
            threshold: 0.15
        }
    );


    observer.observe(guitarra);

});
