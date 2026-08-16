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
