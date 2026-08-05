// ==========================================================================
// script.js — Site sobre Rita Lee
// ==========================================================================

function saudacao() {
    console.log("Olá, Rita Lee!");
}

// ---------- Sistema de toast (substitui o alert() antigo) ----------
function mostrarToast(mensagem, duracaoMs = 3200) {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = mensagem;
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("saindo");
        toast.addEventListener("animationend", () => toast.remove(), { once: true });
    }, duracaoMs);
}

// ---------- Curiosidades sobre Rita Lee ----------
const curiosidades = [
    "Rita Lee foi uma das fundadoras do grupo Os Mutantes, ícone do movimento Tropicália.",
    "Além de cantora, Rita Lee também escreveu livros, incluindo sua autobiografia.",
    "Ela transitou por diversos estilos ao longo da carreira: rock, pop, MPB e até música psicodélica.",
    "Rita Lee foi uma voz ativa em causas sociais e ambientais durante toda a sua trajetória.",
    "Sua carreira solo rendeu diversos álbuns de sucesso e a consolidou como ícone do rock nacional.",
    "Ela é lembrada carinhosamente pelo público como a 'Rainha do Rock Brasileiro'."
];

let ultimoIndiceCuriosidade = -1;

function mostrarCuriosidadeAleatoria() {
    const elemento = document.getElementById("curiosidade-texto");
    if (!elemento) return;

    let indice;
    do {
        indice = Math.floor(Math.random() * curiosidades.length);
    } while (indice === ultimoIndiceCuriosidade && curiosidades.length > 1);

    ultimoIndiceCuriosidade = indice;
    elemento.textContent = curiosidades[indice];
}

// ---------- Contador animado das estatísticas ----------
function animarContador(elemento, alvo, duracaoMs = 1400) {
    const inicio = performance.now();

    function passo(agora) {
        const progresso = Math.min((agora - inicio) / duracaoMs, 1);
        const valorAtual = Math.floor(progresso * alvo);
        elemento.textContent = valorAtual.toLocaleString("pt-BR");

        if (progresso < 1) {
            requestAnimationFrame(passo);
        } else {
            elemento.textContent = alvo.toLocaleString("pt-BR");
        }
    }

    requestAnimationFrame(passo);
}

function iniciarContadores() {
    const numeros = document.querySelectorAll(".stat-numero");
    numeros.forEach((numero) => animarContador(numero, Number(numero.dataset.alvo)));
}

// ---------- Revelar seções conforme o usuário rola a página ----------
function configurarRevelacaoAoRolar() {
    const elementos = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || elementos.length === 0) {
        elementos.forEach((el) => el.classList.add("visivel"));
        return;
    }

    const observador = new IntersectionObserver(
        (entradas, observer) => {
            entradas.forEach((entrada) => {
                if (entrada.isIntersecting) {
                    entrada.target.classList.add("visivel");

                    // Dispara o contador apenas quando a seção de estatísticas aparece
                    if (entrada.target.id === "stats") {
                        iniciarContadores();
                    }

                    observer.unobserve(entrada.target);
                }
            });
        },
        { threshold: 0.2 }
    );

    elementos.forEach((el) => observador.observe(el));
}

// ---------- Botão "voltar ao topo" ----------
function configurarBotaoTopo() {
    const botao = document.getElementById("topoButton");
    if (!botao) return;

    window.addEventListener("scroll", () => {
        botao.classList.toggle("visivel", window.scrollY > 400);
    });

    botao.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

// ---------- Easter egg: cliques rápidos no título ----------
function configurarEasterEgg() {
    const titulo = document.querySelector(".hero h1");
    if (!titulo) return;

    let contagemCliques = 0;
    let ultimoClique = 0;

    titulo.addEventListener("click", () => {
        const agora = Date.now();
        contagemCliques = agora - ultimoClique < 800 ? contagemCliques + 1 : 1;
        ultimoClique = agora;

        if (contagemCliques === 5) {
            mostrarToast("🎸 Você desbloqueou o modo tropicalista! Ela vive na nossa trilha sonora.");
            document.body.classList.toggle("modo-tropicalia");
            contagemCliques = 0;
        }
    });
}

// ---------- Inicialização ----------
document.addEventListener("DOMContentLoaded", () => {
    saudacao();
    mostrarToast("Bem-vindo ao site sobre Rita Lee!");
    mostrarCuriosidadeAleatoria();

    const botaoSaibaMais = document.getElementById("myButton");
    if (botaoSaibaMais) {
        botaoSaibaMais.addEventListener("click", () => {
            window.location.href = "https://pt.wikipedia.org/wiki/Rita_Lee";
        });
    }

    const botaoCuriosidade = document.getElementById("curiosidadeButton");
    if (botaoCuriosidade) {
        botaoCuriosidade.addEventListener("click", mostrarCuriosidadeAleatoria);
    }

    configurarRevelacaoAoRolar();
    configurarBotaoTopo();
    configurarEasterEgg();
});
