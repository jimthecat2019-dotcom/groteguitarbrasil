/* =========================================================
   GROTE GUITAR BRASIL
   INTERAÇÕES DO SITE
========================================================= */

(() => {
    "use strict";

    const reduzirMovimento = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    /* =====================================================
       ABERTURA DA PÁGINA / RESTAURAÇÃO DE ROLAGEM
    ====================================================== */

    if ("scrollRestoration" in history) {
        history.scrollRestoration = "manual";
    }

    const parametros = new URLSearchParams(window.location.search);
    const modeloCompartilhado = parametros.get("modelo");

    function irParaTopoImediatamente() {
        if (!modeloCompartilhado) {
            window.scrollTo(0, 0);
        }
    }

    irParaTopoImediatamente();

    window.addEventListener("pageshow", () => {
        if (!modeloCompartilhado) {
            window.scrollTo(0, 0);
        }
    });

    /* =====================================================
       HELPERS
    ====================================================== */

    function normalizar(texto = "") {
        return texto
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim();
    }

    function abrirDialog(dialog) {
        if (!dialog) return;

        if (typeof dialog.showModal === "function") {
            if (!dialog.open) dialog.showModal();
        } else {
            dialog.setAttribute("open", "");
        }

        document.documentElement.classList.add("modal-aberto");
    }

    function fecharDialog(dialog) {
        if (!dialog) return;

        if (typeof dialog.close === "function") {
            if (dialog.open) dialog.close();
        } else {
            dialog.removeAttribute("open");
        }

        if (!document.querySelector("dialog[open]")) {
            document.documentElement.classList.remove("modal-aberto");
        }
    }

    document.querySelectorAll("[data-fechar-modal]").forEach((botao) => {
        botao.addEventListener("click", () => {
            fecharDialog(botao.closest("dialog"));
        });
    });

    document.querySelectorAll("dialog").forEach((dialog) => {
        dialog.addEventListener("click", (evento) => {
            if (evento.target === dialog) {
                fecharDialog(dialog);
            }
        });

        dialog.addEventListener("close", () => {
            if (!document.querySelector("dialog[open]")) {
                document.documentElement.classList.remove("modal-aberto");
            }
        });
    });

    /* =====================================================
       MENU MOBILE
    ====================================================== */

    const botaoMenu = document.querySelector(".botao-menu");
    const menu = document.querySelector(".menu-principal");

    function fecharMenu() {
        if (!botaoMenu || !menu) return;

        menu.classList.remove("aberto");
        botaoMenu.classList.remove("aberto");
        botaoMenu.setAttribute("aria-expanded", "false");
        botaoMenu.setAttribute("aria-label", "Abrir menu");
    }

    if (botaoMenu && menu) {
        botaoMenu.addEventListener("click", (evento) => {
            evento.stopPropagation();

            const aberto = menu.classList.toggle("aberto");
            botaoMenu.classList.toggle("aberto", aberto);
            botaoMenu.setAttribute(
                "aria-expanded",
                aberto ? "true" : "false"
            );
            botaoMenu.setAttribute(
                "aria-label",
                aberto ? "Fechar menu" : "Abrir menu"
            );
        });

        menu.querySelectorAll('a[href^="#"]').forEach((link) => {
            link.addEventListener("click", fecharMenu);
        });

        document.addEventListener("click", (evento) => {
            if (
                menu.classList.contains("aberto") &&
                !menu.contains(evento.target) &&
                !botaoMenu.contains(evento.target)
            ) {
                fecharMenu();
            }
        });
    }

    /* =====================================================
       ANO
    ====================================================== */

    const anoAtual = document.querySelector("#ano-atual");

    if (anoAtual) {
        anoAtual.textContent = new Date().getFullYear();
    }

    /* =====================================================
       HERO — REINICIA A ANIMAÇÃO
    ====================================================== */

    const guitarraHero = document.querySelector(".hero-imagem img");

    if (guitarraHero && !reduzirMovimento) {
        guitarraHero.style.animation = "none";

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                guitarraHero.style.animation = "";
            });
        });
    }

    /* =====================================================
       REVEAL AO ROLAR
    ====================================================== */

    const seletoresReveal = [
        ".cabecalho-secao",
        ".categoria-card",
        ".destaque-produto-copy",
        ".produto-card",
        ".campanha-conteudo",
        ".sobre-copy",
        ".sobre-imagem",
        ".quiz-cta-copy",
        ".quiz-cta-acao",
        ".onde-comprar-grid > *",
        ".contato-grid > *",
        ".newsletter-grid > *"
    ];

    const elementosReveal = Array.from(
        document.querySelectorAll(seletoresReveal.join(","))
    );

    document.querySelectorAll(".categoria-card").forEach((card, indice) => {
        card.style.setProperty("--reveal-delay", `${indice * 80}ms`);
    });

    document.querySelectorAll(".produto-card").forEach((card, indice) => {
        card.style.setProperty("--reveal-delay", `${indice * 100}ms`);
    });

    document
        .querySelectorAll(".destaque-produto-imagem, .sobre-imagem")
        .forEach((elemento) => {
            elemento.classList.add("reveal", "reveal-imagem");
            elementosReveal.push(elemento);
        });

    elementosReveal.forEach((elemento) => {
        elemento.classList.add("reveal");
    });

    if (reduzirMovimento || !("IntersectionObserver" in window)) {
        elementosReveal.forEach((elemento) => {
            elemento.classList.add("reveal-visivel");
        });
    } else {
        const observerReveal = new IntersectionObserver(
            (entradas, observer) => {
                entradas.forEach((entrada) => {
                    if (!entrada.isIntersecting) return;

                    entrada.target.classList.add("reveal-visivel");
                    observer.unobserve(entrada.target);
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -8% 0px"
            }
        );

        elementosReveal.forEach((elemento) => {
            observerReveal.observe(elemento);
        });
    }

    /* =====================================================
       PARALLAX DA CAMPANHA
    ====================================================== */

    const campanha = document.querySelector(".campanha");
    const imagemCampanha = document.querySelector(".campanha-imagem img");

    if (campanha && imagemCampanha && !reduzirMovimento) {
        let ticking = false;

        const atualizarParallax = () => {
            const rect = campanha.getBoundingClientRect();
            const alturaJanela = window.innerHeight;

            if (rect.bottom > 0 && rect.top < alturaJanela) {
                const centroSecao = rect.top + rect.height / 2;
                const centroTela = alturaJanela / 2;
                const distancia = centroSecao - centroTela;

                const deslocamento = Math.max(
                    -22,
                    Math.min(22, distancia * -0.035)
                );

                imagemCampanha.style.setProperty(
                    "--parallax-y",
                    `${deslocamento.toFixed(2)}px`
                );
            }

            ticking = false;
        };

        const pedirAtualizacao = () => {
            if (ticking) return;

            ticking = true;
            requestAnimationFrame(atualizarParallax);
        };

        window.addEventListener("scroll", pedirAtualizacao, { passive: true });
        window.addEventListener("resize", pedirAtualizacao);
        pedirAtualizacao();
    }

    /* =====================================================
       VOLTAR AO TOPO
    ====================================================== */

    const voltarTopo = document.querySelector(".voltar-topo");

    if (voltarTopo) {
        const atualizarBotaoTopo = () => {
            voltarTopo.classList.toggle("visivel", window.scrollY > 600);
        };

        window.addEventListener(
            "scroll",
            atualizarBotaoTopo,
            { passive: true }
        );

        atualizarBotaoTopo();

        voltarTopo.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: reduzirMovimento ? "auto" : "smooth"
            });
        });
    }

    /* =====================================================
       MODELOS DISPONÍVEIS
    ====================================================== */

    const cardsModelos = Array.from(
        document.querySelectorAll(".produto-card[data-modelo-id]")
    );

    const modelos = cardsModelos.map((card) => ({
        id: card.dataset.modeloId,
        nome: card.dataset.modeloNome,
        categoria: card.dataset.modeloCategoria,
        termos: card.dataset.modeloTermos || "",
        imagem: card.dataset.modeloImagem,
        descricao: card.dataset.modeloDescricao || "",
        card
    }));

    function buscarModelo(id) {
        return modelos.find((modelo) => modelo.id === id);
    }

    function irParaModelo(modelo) {
        if (!modelo?.card) return;

        fecharMenu();

        document.querySelectorAll("dialog[open]").forEach(fecharDialog);

        modelo.card.scrollIntoView({
            behavior: reduzirMovimento ? "auto" : "smooth",
            block: "center"
        });

        modelo.card.classList.remove("modelo-destacado");

        setTimeout(() => {
            modelo.card.classList.add("modelo-destacado");
        }, reduzirMovimento ? 0 : 450);

        setTimeout(() => {
            modelo.card.classList.remove("modelo-destacado");
        }, 1800);
    }

    /* =====================================================
       ABRIR MODELO COMPARTILHADO
    ====================================================== */

    if (modeloCompartilhado) {
        window.addEventListener("load", () => {
            const modelo = buscarModelo(modeloCompartilhado);

            if (modelo) {
                setTimeout(() => irParaModelo(modelo), 180);
            }
        });
    } else {
        window.addEventListener("load", () => {
            window.scrollTo(0, 0);
        });
    }

    /* =====================================================
       BUSCA
    ====================================================== */

    const modalBusca = document.querySelector("#modal-busca");
    const inputBusca = document.querySelector("#busca-modelos");
    const resultadosBusca = document.querySelector("#busca-resultados");

    function criarResultado(modelo) {
        const botao = document.createElement("button");
        botao.type = "button";
        botao.className = "resultado-modelo";

        botao.innerHTML = `
            <img src="${modelo.imagem}" alt="" loading="lazy">
            <span>
                <strong>${modelo.nome}</strong>
                <small>${modelo.categoria}</small>
            </span>
            <span class="resultado-seta" aria-hidden="true">→</span>
        `;

        botao.addEventListener("click", () => {
            fecharDialog(modalBusca);
            irParaModelo(modelo);
        });

        return botao;
    }

    function renderizarBusca(consulta = "") {
        if (!resultadosBusca) return;

        const termo = normalizar(consulta);

        const encontrados = modelos.filter((modelo) => {
            const base = normalizar(
                `${modelo.nome} ${modelo.categoria} ${modelo.termos} ${modelo.descricao}`
            );

            return !termo || base.includes(termo);
        });

        resultadosBusca.replaceChildren();

        if (!encontrados.length) {
            resultadosBusca.innerHTML =
                '<div class="estado-vazio">Nenhum modelo encontrado.</div>';
            return;
        }

        encontrados.forEach((modelo) => {
            resultadosBusca.appendChild(criarResultado(modelo));
        });
    }

    document.querySelectorAll(".abrir-busca").forEach((botao) => {
        botao.addEventListener("click", () => {
            fecharMenu();
            renderizarBusca("");
            abrirDialog(modalBusca);

            setTimeout(() => inputBusca?.focus(), 50);
        });
    });

    inputBusca?.addEventListener("input", () => {
        renderizarBusca(inputBusca.value);
    });

    document.querySelector(".busca-form")?.addEventListener("submit", (evento) => {
        evento.preventDefault();
    });

    /* =====================================================
       FAVORITOS — LOCALSTORAGE
    ====================================================== */

    const CHAVE_FAVORITOS = "grote-favoritos-v1";
    const modalFavoritos = document.querySelector("#modal-favoritos");
    const favoritosLista = document.querySelector("#favoritos-lista");

    function lerFavoritos() {
        try {
            const dados = JSON.parse(localStorage.getItem(CHAVE_FAVORITOS));
            return Array.isArray(dados) ? dados : [];
        } catch {
            return [];
        }
    }

    function salvarFavoritos(lista) {
        try {
            localStorage.setItem(CHAVE_FAVORITOS, JSON.stringify(lista));
        } catch {
            /* O site continua funcionando mesmo sem armazenamento local. */
        }
    }

    let favoritos = lerFavoritos();

    function atualizarContadoresFavoritos() {
        document.querySelectorAll(".favoritos-contagem").forEach((contador) => {
            contador.textContent = favoritos.length;
            contador.setAttribute(
                "aria-label",
                `${favoritos.length} favorito${favoritos.length === 1 ? "" : "s"}`
            );
        });
    }

    function atualizarBotoesFavoritos() {
        document.querySelectorAll(".favorito-btn").forEach((botao) => {
            const id = botao.dataset.favorito;
            const ativo = favoritos.includes(id);
            const modelo = buscarModelo(id);

            botao.setAttribute("aria-pressed", String(ativo));
            botao.setAttribute(
                "aria-label",
                `${ativo ? "Remover" : "Adicionar"} ${modelo?.nome || "modelo"} ${
                    ativo ? "dos" : "aos"
                } favoritos`
            );
            botao.title = ativo
                ? "Remover dos favoritos"
                : "Adicionar aos favoritos";

            const icone = botao.querySelector("span");
            if (icone) icone.textContent = ativo ? "♥" : "♡";
        });
    }

    function renderizarFavoritos() {
        if (!favoritosLista) return;

        favoritosLista.replaceChildren();

        const selecionados = favoritos
            .map(buscarModelo)
            .filter(Boolean);

        if (!selecionados.length) {
            favoritosLista.innerHTML = `
                <div class="estado-vazio">
                    Você ainda não salvou nenhum modelo. Use o coração nos cards para criar sua seleção.
                </div>
            `;
            return;
        }

        selecionados.forEach((modelo) => {
            favoritosLista.appendChild(criarResultado(modelo));
        });
    }

    document.querySelectorAll(".favorito-btn").forEach((botao) => {
        botao.addEventListener("click", () => {
            const id = botao.dataset.favorito;

            if (favoritos.includes(id)) {
                favoritos = favoritos.filter((item) => item !== id);
            } else {
                favoritos = [...favoritos, id];
            }

            salvarFavoritos(favoritos);
            atualizarContadoresFavoritos();
            atualizarBotoesFavoritos();
        });
    });

    document.querySelectorAll(".abrir-favoritos").forEach((botao) => {
        botao.addEventListener("click", () => {
            fecharMenu();
            renderizarFavoritos();
            abrirDialog(modalFavoritos);
        });
    });

    atualizarContadoresFavoritos();
    atualizarBotoesFavoritos();

    /* =====================================================
       COMPARTILHAR MODELO
    ====================================================== */

    const modalCompartilhar = document.querySelector("#modal-compartilhar");
    const tituloCompartilhar = document.querySelector("#titulo-compartilhar");
    const linkWhatsApp = document.querySelector("#compartilhar-whatsapp");
    const botaoCopiar = document.querySelector("#copiar-link-modelo");
    const botaoCompartilharNativo = document.querySelector("#compartilhar-nativo");
    const feedbackCopia = document.querySelector("#feedback-copia");

    let compartilhamentoAtual = null;

    function criarUrlModelo(modelo) {
        const url = new URL(window.location.href);

        url.hash = "";
        url.searchParams.set("modelo", modelo.id);

        return url.toString();
    }

    async function copiarTexto(texto) {
        try {
            await navigator.clipboard.writeText(texto);
            return true;
        } catch {
            const area = document.createElement("textarea");
            area.value = texto;
            area.setAttribute("readonly", "");
            area.style.position = "fixed";
            area.style.opacity = "0";
            document.body.appendChild(area);
            area.select();

            let copiado = false;

            try {
                copiado = document.execCommand("copy");
            } catch {
                copiado = false;
            }

            area.remove();
            return copiado;
        }
    }

    document.querySelectorAll(".compartilhar-modelo").forEach((botao) => {
        botao.addEventListener("click", () => {
            const modelo = buscarModelo(botao.dataset.compartilhar);
            if (!modelo) return;

            const url = criarUrlModelo(modelo);

            compartilhamentoAtual = {
                title: `${modelo.nome} | Grote Guitar Brasil`,
                text: `Conheça o ${modelo.nome} da Grote Guitar Brasil.`,
                url
            };

            if (tituloCompartilhar) {
                tituloCompartilhar.textContent = modelo.nome;
            }

            if (linkWhatsApp) {
                const texto = encodeURIComponent(
                    `${compartilhamentoAtual.text} ${url}`
                );

                linkWhatsApp.href = `https://wa.me/?text=${texto}`;
            }

            if (feedbackCopia) {
                feedbackCopia.textContent = "";
            }

            if (botaoCompartilharNativo) {
                botaoCompartilharNativo.hidden = !("share" in navigator);
            }

            abrirDialog(modalCompartilhar);
        });
    });

    botaoCopiar?.addEventListener("click", async () => {
        if (!compartilhamentoAtual) return;

        const sucesso = await copiarTexto(compartilhamentoAtual.url);

        if (feedbackCopia) {
            feedbackCopia.textContent = sucesso
                ? "Link copiado."
                : "Não foi possível copiar automaticamente.";
        }
    });

    botaoCompartilharNativo?.addEventListener("click", async () => {
        if (!compartilhamentoAtual || !navigator.share) return;

        try {
            await navigator.share(compartilhamentoAtual);
        } catch {
            /* Cancelamento pelo usuário: nenhuma ação necessária. */
        }
    });

    /* =====================================================
       QUIZ — ENCONTRE SUA GROTE
    ====================================================== */

    const modalQuiz = document.querySelector("#modal-quiz");
    const formQuiz = document.querySelector("#quiz-grote");
    const resultadoQuiz = document.querySelector("#quiz-resultado");
    const resultadoNome = document.querySelector("#quiz-resultado-nome");
    const resultadoTexto = document.querySelector("#quiz-resultado-texto");
    const botaoVerModelo = document.querySelector("#quiz-ver-modelo");
    const botaoRefazer = document.querySelector("#quiz-refazer");

    let recomendacaoAtual = null;

    document.querySelectorAll(".abrir-quiz").forEach((botao) => {
        botao.addEventListener("click", () => {
            abrirDialog(modalQuiz);
        });
    });

    function recomendarModelo(dados) {
        if (dados.instrumento === "baixo") {
            return buscarModelo("gtbs-01");
        }

        const pontos = {
            "gt-335": 0,
            "gr-standard-t": 0,
            "gr-headless": 0
        };

        if (dados.estilo === "classico") pontos["gt-335"] += 2;
        if (dados.estilo === "direto") pontos["gr-standard-t"] += 2;
        if (dados.estilo === "moderno") pontos["gr-headless"] += 2;

        if (dados.formato === "semi-hollow") pontos["gt-335"] += 4;
        if (dados.formato === "solid-body") pontos["gr-standard-t"] += 4;
        if (dados.formato === "headless") pontos["gr-headless"] += 4;

        if (dados.prioridade === "visual") pontos["gt-335"] += 2;
        if (dados.prioridade === "familiar") pontos["gr-standard-t"] += 2;
        if (dados.prioridade === "contemporaneo") pontos["gr-headless"] += 2;

        if (dados.prioridade === "versatilidade") {
            pontos["gt-335"] += 1;
            pontos["gr-standard-t"] += 1;
            pontos["gr-headless"] += 1;
        }

        const vencedor = Object.entries(pontos)
            .sort((a, b) => b[1] - a[1])[0][0];

        return buscarModelo(vencedor);
    }

    formQuiz?.addEventListener("submit", (evento) => {
        evento.preventDefault();

        const dados = Object.fromEntries(
            new FormData(formQuiz).entries()
        );

        recomendacaoAtual = recomendarModelo(dados);

        if (!recomendacaoAtual) return;

        formQuiz.hidden = true;
        resultadoQuiz.hidden = false;

        resultadoNome.textContent = recomendacaoAtual.nome;
        resultadoTexto.textContent =
            `${recomendacaoAtual.descricao} Esta é uma recomendação de perfil baseada nas suas respostas; a escolha final depende do que você busca ao tocar.`;
    });

    botaoVerModelo?.addEventListener("click", () => {
        if (!recomendacaoAtual) return;

        fecharDialog(modalQuiz);
        irParaModelo(recomendacaoAtual);
    });

    botaoRefazer?.addEventListener("click", () => {
        formQuiz?.reset();

        if (formQuiz) formQuiz.hidden = false;
        if (resultadoQuiz) resultadoQuiz.hidden = true;

        recomendacaoAtual = null;
    });

    /* =====================================================
       NEWSLETTER VISUAL
       Evita o salto para "#" enquanto não houver serviço.
    ====================================================== */

    const newsletter = document.querySelector(".newsletter-form");

    newsletter?.addEventListener("submit", (evento) => {
        if (newsletter.getAttribute("action") === "#") {
            evento.preventDefault();
        }
    });
})();
