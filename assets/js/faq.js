/**
 * FAQ Interativo - Script melhorado com animações e funcionalidades avançadas
 * Gerencia a abertura/fechamento de itens FAQ com transições suaves
 */

document.addEventListener('DOMContentLoaded', () => {
    const faqItems = document.querySelectorAll('.faq__item');
    const faqContainer = document.querySelector('.faq__content');

    // Inicializar itens FAQ
    faqItems.forEach((item, index) => {
        // Adicionar delay na animação de entrada
        item.style.animationDelay = `${index * 0.1}s`;

        // Event listener para toggle
        item.addEventListener('toggle', (e) => {
            handleFaqToggle(e.target);
        });

        // Adicionar suporte a teclado (Enter e Space)
        const summary = item.querySelector('.faq__question');
        summary.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                item.open = !item.open;
            }
        });
    });

    /**
     * Gerencia o toggle de um item FAQ
     * @param {HTMLElement} item - O elemento details do FAQ
     */
    function handleFaqToggle(item) {
        const icon = item.querySelector('.faq__icon i');
        const isOpen = item.open;

        // Animar ícone
        if (isOpen) {
            icon.classList.remove('bi-plus-lg');
            icon.classList.add('bi-dash-lg');
            // Adicionar classe de animação
            item.classList.add('faq__item--open');
        } else {
            icon.classList.remove('bi-dash-lg');
            icon.classList.add('bi-plus-lg');
            // Remover classe de animação
            item.classList.remove('faq__item--open');
        }

        // Fechar outros itens se desejado (comentado por padrão)
        // closeOtherFaqItems(item);
    }

    /**
     * Fecha outros itens FAQ quando um é aberto (opcional)
     * Descomente para ativar comportamento de accordion único
     * @param {HTMLElement} openItem - O item que foi aberto
     */
    function closeOtherFaqItems(openItem) {
        faqItems.forEach(item => {
            if (item !== openItem && item.open) {
                item.open = false;
                const icon = item.querySelector('.faq__icon i');
                icon.classList.remove('bi-dash-lg');
                icon.classList.add('bi-plus-lg');
            }
        });
    }

    // Adicionar efeito de scroll suave para o FAQ quando clicado
    document.querySelectorAll('a[href="#faq"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const faqSection = document.getElementById('faq');
            if (faqSection) {
                faqSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Rastrear visualizações de FAQ (opcional - para analytics)
    faqItems.forEach(item => {
        item.addEventListener('toggle', () => {
            if (item.open) {
                const question = item.querySelector('.faq__question-text').textContent;
                trackFaqView(question);
            }
        });
    });

    /**
     * Rastrear visualizações de FAQ (integração com analytics)
     * @param {string} question - A pergunta que foi visualizada
     */
    function trackFaqView(question) {
        // Integração com Google Analytics (se disponível)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'faq_view', {
                'faq_question': question
            });
        }

        // Log no console para debug
        console.log('FAQ visualizado:', question);
    }

    // Adicionar suporte a busca/filtro de FAQ (opcional)
    setupFaqSearch();
});

/**
 * Configurar funcionalidade de busca de FAQ (opcional)
 * Descomente e adicione um input de busca no HTML para ativar
 */
function setupFaqSearch() {
    const searchInput = document.getElementById('faq-search');
    if (!searchInput) return;

    const faqItems = document.querySelectorAll('.faq__item');

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();

        faqItems.forEach(item => {
            const question = item.querySelector('.faq__question-text').textContent.toLowerCase();
            const answer = item.querySelector('.faq__answer').textContent.toLowerCase();

            if (question.includes(searchTerm) || answer.includes(searchTerm)) {
                item.style.display = '';
                item.classList.add('faq__item--highlight');
            } else {
                item.style.display = 'none';
                item.classList.remove('faq__item--highlight');
            }
        });

        // Mostrar mensagem se nenhum resultado for encontrado
        const visibleItems = Array.from(faqItems).filter(item => item.style.display !== 'none');
        const noResults = document.querySelector('.faq__no-results');
        
        if (visibleItems.length === 0) {
            if (noResults) {
                noResults.style.display = '';
            }
        } else {
            if (noResults) {
                noResults.style.display = 'none';
            }
        }
    });
}

// Adicionar classe de animação ao carregar
document.addEventListener('DOMContentLoaded', () => {
    const faqSection = document.querySelector('.faq');
    if (faqSection) {
        faqSection.classList.add('faq--loaded');
    }
});

