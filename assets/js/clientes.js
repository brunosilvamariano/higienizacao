/**
 * ============================================
 * SCRIPT DE CONTROLE - SEÇÃO DE CLIENTES
 * ============================================
 * 
 * Gerencia a interatividade e funcionalidades
 * da seção de clientes atendidos.
 */

class ClientesSection {
    /**
     * Inicializa a classe ClientesSection
     */
    constructor() {
        this.section = document.getElementById('clientes-section');
        this.videoBackground = document.querySelector('[data-video-background]');
        this.logosList = document.querySelector('[data-logos-list]');
        this.logoItems = document.querySelectorAll('.clientes-section__logo-item');
        
        // Inicializa o módulo
        this.init();
    }

    /**
     * Inicializa todos os módulos e listeners
     */
    init() {
        this.setupVideoBackground();
        this.setupLogoInteractions();
        this.setupIntersectionObserver();
        this.setupResizeObserver();
        this.logInitialization();
    }

    /**
     * Configura o vídeo de fundo
     * Trata erros de carregamento e fallback
     */
    setupVideoBackground() {
        if (!this.videoBackground) {
            console.warn('Vídeo de fundo não encontrado');
            return;
        }

        // Listener para erros de carregamento do vídeo
        this.videoBackground.addEventListener('error', () => {
            console.error('Erro ao carregar o vídeo de fundo');
            this.handleVideoError();
        });

        // Listener para quando o vídeo começa a tocar
        this.videoBackground.addEventListener('play', () => {
            this.section.classList.add('clientes-section--video-playing');
        });

        // Listener para quando o vídeo é pausado
        this.videoBackground.addEventListener('pause', () => {
            this.section.classList.remove('clientes-section--video-playing');
        });

        // Tenta reproduzir o vídeo
        const playPromise = this.videoBackground.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.error('Erro ao reproduzir vídeo:', error);
            });
        }
    }

    /**
     * Trata erros de carregamento do vídeo
     */
    handleVideoError() {
        // Adiciona uma classe de fallback para estilização alternativa
        this.section.classList.add('clientes-section--video-error');
        
        // Você pode adicionar uma cor de fundo alternativa aqui
        const overlay = document.querySelector('.clientes-section__overlay');
        if (overlay) {
            overlay.style.opacity = '1';
        }
    }

    /**
     * Configura interações com os logotipos
     */
    setupLogoInteractions() {
        this.logoItems.forEach((item, index) => {
            const image = item.querySelector('.clientes-section__logo-image');
            
            if (!image) return;

            // Adiciona atributo data para rastreamento
            item.setAttribute('data-logo-index', index);

            // Listener para hover (desktop)
            item.addEventListener('mouseenter', () => {
                this.handleLogoHover(item);
            });

            item.addEventListener('mouseleave', () => {
                this.handleLogoLeave(item);
            });

            // Listener para toque (mobile)
            item.addEventListener('touchstart', () => {
                this.handleLogoHover(item);
            });

            item.addEventListener('touchend', () => {
                this.handleLogoLeave(item);
            });

            // Listener para focus (acessibilidade)
            image.addEventListener('focus', () => {
                this.handleLogoFocus(item);
            });

            image.addEventListener('blur', () => {
                this.handleLogoBlur(item);
            });
        });
    }

    /**
     * Manipula o evento de hover do logotipo
     * @param {HTMLElement} item - Elemento do logotipo
     */
    handleLogoHover(item) {
        item.classList.add('clientes-section__logo-item--hovered');
    }

    /**
     * Manipula o evento de saída do hover do logotipo
     * @param {HTMLElement} item - Elemento do logotipo
     */
    handleLogoLeave(item) {
        item.classList.remove('clientes-section__logo-item--hovered');
    }

    /**
     * Manipula o evento de focus do logotipo
     * @param {HTMLElement} item - Elemento do logotipo
     */
    handleLogoFocus(item) {
        item.classList.add('clientes-section__logo-item--focused');
    }

    /**
     * Manipula o evento de blur do logotipo
     * @param {HTMLElement} item - Elemento do logotipo
     */
    handleLogoBlur(item) {
        item.classList.remove('clientes-section__logo-item--focused');
    }

    /**
     * Configura Intersection Observer para lazy loading
     * e animações ao entrar na viewport
     */
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '50px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.section.classList.add('clientes-section--visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        observer.observe(this.section);
    }

    /**
     * Configura ResizeObserver para ajustes responsivos
     */
    setupResizeObserver() {
        if (!window.ResizeObserver) {
            console.warn('ResizeObserver não suportado neste navegador');
            return;
        }

        const resizeObserver = new ResizeObserver(() => {
            this.handleResize();
        });

        resizeObserver.observe(this.section);
    }

    /**
     * Manipula eventos de redimensionamento da janela
     */
    handleResize() {
        const width = window.innerWidth;
        
        // Ajusta a duração da animação baseado no tamanho da tela
        if (width <= 480) {
            this.logosList.style.setProperty('--clientes-carousel-duration', '12s');
        } else if (width <= 768) {
            this.logosList.style.setProperty('--clientes-carousel-duration', '15s');
        } else {
            this.logosList.style.setProperty('--clientes-carousel-duration', '20s');
        }
    }

    /**
     * Pausa a animação do carrossel
     */
    pauseCarousel() {
        if (this.logosList) {
            this.logosList.style.animationPlayState = 'paused';
        }
    }

    /**
     * Retoma a animação do carrossel
     */
    resumeCarousel() {
        if (this.logosList) {
            this.logosList.style.animationPlayState = 'running';
        }
    }

    /**
     * Pausa o vídeo de fundo
     */
    pauseVideo() {
        if (this.videoBackground) {
            this.videoBackground.pause();
        }
    }

    /**
     * Retoma o vídeo de fundo
     */
    resumeVideo() {
        if (this.videoBackground) {
            this.videoBackground.play();
        }
    }

    /**
     * Registra a inicialização no console
     */
    logInitialization() {
        console.log('✓ ClientesSection inicializado com sucesso');
        console.log(`✓ ${this.logoItems.length} logotipos carregados`);
        console.log('✓ Vídeo de fundo configurado');
        console.log('✓ Interatividade habilitada');
    }

    /**
     * Destrói a instância e remove listeners
     */
    destroy() {
        if (this.videoBackground) {
            this.videoBackground.removeEventListener('error', this.handleVideoError);
            this.videoBackground.removeEventListener('play', this.setupVideoBackground);
            this.videoBackground.removeEventListener('pause', this.setupVideoBackground);
        }

        this.logoItems.forEach(item => {
            item.removeEventListener('mouseenter', this.handleLogoHover);
            item.removeEventListener('mouseleave', this.handleLogoLeave);
            item.removeEventListener('touchstart', this.handleLogoHover);
            item.removeEventListener('touchend', this.handleLogoLeave);
        });

        console.log('✓ ClientesSection destruído');
    }
}

/**
 * ============================================
 * INICIALIZAÇÃO DO DOCUMENTO
 * ============================================
 */

// Aguarda o carregamento completo do DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.clientesSection = new ClientesSection();
    });
} else {
    // DOM já foi carregado
    window.clientesSection = new ClientesSection();
}

/**
 * ============================================
 * LISTENERS GLOBAIS
 * ============================================
 */

// Pausa animações quando a aba fica inativa
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        window.clientesSection?.pauseCarousel();
        window.clientesSection?.pauseVideo();
    } else {
        window.clientesSection?.resumeCarousel();
        window.clientesSection?.resumeVideo();
    }
});

// Tratamento de erros global
window.addEventListener('error', (event) => {
    console.error('Erro global:', event.error);
});

// Tratamento de promises não capturadas
window.addEventListener('unhandledrejection', (event) => {
    console.error('Promise rejeitada não tratada:', event.reason);
});