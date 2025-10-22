/**
 * ===== SCRIPT ESPECÍFICO PARA SEÇÃO ABOUT (SOBRE NÓS) =====
 * Funcionalidade: Reprodução de vídeo em modal ao clicar no botão play
 * Autor: Projeto Higienização
 * Data: 2025
 */

document.addEventListener('DOMContentLoaded', function() {
    // Elementos específicos da seção About
    const aboutPlayBtn = document.getElementById('about__play-btn');
    const aboutVideoModal = document.getElementById('about__video-modal');
    const aboutVideoClose = document.getElementById('about__video-close');
    const aboutVideo = document.getElementById('about__video');

    // Verificar se todos os elementos existem
    if (!aboutPlayBtn || !aboutVideoModal || !aboutVideoClose || !aboutVideo) {
        console.warn('Elementos da seção About não encontrados.');
        return;
    }

    /**
     * Abrir modal de vídeo
     */
    function openVideoModal() {
        aboutVideoModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Reproduzir vídeo automaticamente
        aboutVideo.play().catch(error => {
            console.warn('Erro ao reproduzir vídeo:', error);
        });
    }

    /**
     * Fechar modal de vídeo
     */
    function closeVideoModal() {
        aboutVideoModal.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        // Pausar vídeo ao fechar
        aboutVideo.pause();
        aboutVideo.currentTime = 0;
    }

    /**
     * Event Listeners
     */
    
    // Abrir vídeo ao clicar no botão play
    aboutPlayBtn.addEventListener('click', openVideoModal);
    
    // Suporte para teclado (Enter e Space)
    aboutPlayBtn.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openVideoModal();
        }
    });

    // Fechar vídeo ao clicar no botão de fechar
    aboutVideoClose.addEventListener('click', closeVideoModal);

    // Fechar vídeo ao clicar fora do container (no fundo escuro)
    aboutVideoModal.addEventListener('click', function(event) {
        if (event.target === aboutVideoModal) {
            closeVideoModal();
        }
    });

    // Fechar vídeo ao pressionar ESC
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && aboutVideoModal.classList.contains('active')) {
            closeVideoModal();
        }
    });

    /**
     * Intersection Observer para animações ao scroll
     */
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observar elementos da seção About
    const aboutElements = document.querySelectorAll('.about__left, .about__right, .about__benefit-item');
    aboutElements.forEach(element => {
        observer.observe(element);
    });

    /**
     * Efeito de hover na imagem
     */
    const aboutImage = document.querySelector('.about__image-wrapper');
    if (aboutImage) {
        aboutImage.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
        });

        aboutImage.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    }

    console.log('Script da seção About carregado com sucesso.');
});

