/* ===== JAVASCRIPT DA SEÇÃO COMO FUNCIONA - INTERAÇÃO POR CLIQUE ===== */

/**
 * Inicializa a seção Como Funciona quando o DOM estiver carregado
 */
document.addEventListener("DOMContentLoaded", function() {
    initComoFunciona();
});

/**
 * Função principal de inicialização
 */
function initComoFunciona() {
    // Seleciona todos os cards
    const cards = document.querySelectorAll(".como__funciona__card");
    
    if (cards.length === 0) {
        console.warn("Nenhum card da seção Como Funciona foi encontrado.");
        return;
    }

    // Adiciona event listeners para cada card
    cards.forEach(card => {
        setupSaibaMaisButton(card);
        // Não é mais necessário setupCardInteraction, pois a interação é focada no botão
    });

    // Adiciona animação de scroll reveal
    setupScrollReveal();
}

/**
 * Configura a interação do botão "Saiba mais"
 * @param {HTMLElement} card - O elemento do card
 */
function setupSaibaMaisButton(card) {
    const saibaMaisBtn = card.querySelector(".como__funciona__saiba-mais-btn");
    const cardDetails = card.querySelector(".como__funciona__card-details");
    
    if (!saibaMaisBtn || !cardDetails) {
        return;
    }

    // Adiciona evento de clique no botão
    saibaMaisBtn.addEventListener("click", function(e) {
        e.stopPropagation(); // Evita que o clique no botão acione outros eventos do card
        
        // Toggle das classes para mostrar/ocultar detalhes
        const isShowing = card.classList.contains("show-details");
        
        if (isShowing) {
            // Ocultar detalhes
            card.classList.remove("show-details");
            cardDetails.classList.remove("show");
            saibaMaisBtn.style.display = 'inline-flex'; // Mostra o botão 'Saiba mais' novamente
            const existingCloseBtn = card.querySelector('.como__funciona__close-btn');
            if (existingCloseBtn) {
                existingCloseBtn.remove();
            }
            saibaMaisBtn.setAttribute("aria-expanded", "false");
        } else {
            // Mostrar detalhes
            
            // Oculta todos os outros cards abertos (para garantir que apenas um esteja aberto por vez)
            document.querySelectorAll(".como__funciona__card.show-details").forEach(openCard => {
                if (openCard !== card) {
                    openCard.classList.remove("show-details");
                    openCard.querySelector(".como__funciona__card-details").classList.remove("show");
                    const otherBtn = openCard.querySelector(".como__funciona__saiba-mais-btn");
if (otherBtn) {
                    otherBtn.style.display = 'inline-flex';
                    otherBtn.setAttribute("aria-expanded", "false");
                    const otherCloseBtn = openCard.querySelector('.como__funciona__close-btn');
                    if (otherCloseBtn) {
                        otherCloseBtn.remove();
                    }
                }
                }
            });
            
            card.classList.add("show-details");
            cardDetails.classList.add("show");
            saibaMaisBtn.style.display = 'none'; // Oculta o botão 'Saiba mais'
            const closeBtn = document.createElement('button');
            closeBtn.className = 'como__funciona__close-btn';
            closeBtn.innerHTML = '<i class="bi bi-x-lg" aria-hidden="true"></i>';
            closeBtn.setAttribute('aria-label', 'Fechar detalhes');
            cardDetails.appendChild(closeBtn);
            closeBtn.addEventListener('click', function() {
                card.classList.remove('show-details');
                cardDetails.classList.remove('show');
                saibaMaisBtn.style.display = 'inline-flex'; // Mostra o botão 'Saiba mais' novamente
                saibaMaisBtn.setAttribute('aria-expanded', 'false');
                closeBtn.remove();
            });
            saibaMaisBtn.setAttribute("aria-expanded", "true");
        }
    });

    // Adiciona atributo de acessibilidade
    saibaMaisBtn.setAttribute("aria-expanded", "false");
    
    // Suporte para teclado (acessibilidade)
    saibaMaisBtn.addEventListener("keydown", function(e) {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            saibaMaisBtn.click();
        }
    });
}

/**
 * Configura animação de scroll reveal para os cards
 */
function setupScrollReveal() {
    // Cria um Intersection Observer para detectar quando os elementos entram na viewport
    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.1
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Adiciona classe para ativar animação
                entry.target.classList.add("como__funciona__visible");
                
                // Para de observar após a primeira aparição
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observa todos os cards
    const cards = document.querySelectorAll(".como__funciona__card");
    cards.forEach(card => {
        observer.observe(card);
    });

    // Observa o header e footer também
    const header = document.querySelector(".como__funciona__header");
    const footer = document.querySelector(".como__funciona__footer");
    
    if (header) observer.observe(header);
    if (footer) observer.observe(footer);
}

/**
 * Adiciona classe CSS para elementos visíveis apenas para leitores de tela
 */
const style = document.createElement("style");
style.textContent = `
    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border-width: 0;
    }
`;
document.head.appendChild(style);

/**
 * Adiciona suporte para redução de movimento (acessibilidade)
 */
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    // Desabilita animações para usuários que preferem movimento reduzido
    const cards = document.querySelectorAll(".como__funciona__card");
    cards.forEach(card => {
        card.style.transition = "none";
    });
}

// Log de inicialização (pode ser removido em produção)
console.log("Seção Como Funciona inicializada com sucesso!");
