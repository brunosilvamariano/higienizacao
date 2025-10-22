/* ===== JAVASCRIPT DA SEÇÃO DE SERVIÇOS ===== */

(function() {
  'use strict';

  // ===== CONFIGURAÇÕES =====
  const CONFIG = {
    animationDelay: 100,
    observerThreshold: 0.2,
    cardHoverScale: 1.02,
  };

  // ===== INTERSECTION OBSERVER PARA ANIMAÇÕES =====
  const initScrollAnimations = () => {
    // Verificar se o navegador suporta Intersection Observer
    if (!('IntersectionObserver' in window)) {
      console.warn('Intersection Observer não suportado. Animações de scroll desabilitadas.');
      return;
    }

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: CONFIG.observerThreshold,
    };

    const observerCallback = (entries, observer) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Adicionar delay progressivo aos cards
          setTimeout(() => {
            entry.target.classList.add('servicos__card--visible');
          }, index * CONFIG.animationDelay);
          
          // Parar de observar após a animação
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observar todos os cards de serviço
    const cards = document.querySelectorAll('.servicos__card');
    cards.forEach(card => {
      observer.observe(card);
    });

    // Observar o cabeçalho da seção
    const header = document.querySelector('.servicos__header');
    if (header) {
      observer.observe(header);
    }

    // Observar o CTA
    const cta = document.querySelector('.servicos__cta');
    if (cta) {
      observer.observe(cta);
    }
  };

  // ===== EFEITOS DE HOVER NOS CARDS =====
  const initCardHoverEffects = () => {
    const cards = document.querySelectorAll('.servicos__card');

    cards.forEach(card => {
      // Efeito de paralaxe suave no hover
      card.addEventListener('mouseenter', function(e) {
        const cardImage = this.querySelector('.servicos__img');
        if (cardImage) {
          cardImage.style.transform = 'scale(1.1)';
        }
      });

      card.addEventListener('mouseleave', function(e) {
        const cardImage = this.querySelector('.servicos__img');
        if (cardImage) {
          cardImage.style.transform = 'scale(1)';
        }
      });

      // Efeito de movimento 3D baseado na posição do mouse
      card.addEventListener('mousemove', function(e) {
        if (window.innerWidth < 768) return; // Desabilitar em mobile

        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * 5; // Máximo 5 graus
        const rotateY = ((x - centerX) / centerX) * -5; // Máximo 5 graus

        this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
      });

      card.addEventListener('mouseleave', function() {
        this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
      });
    });
  };

  // ===== TRACKING DE CLIQUES (ANALYTICS) =====
  const initAnalyticsTracking = () => {
    const buttons = document.querySelectorAll('.servicos__card-btn, .servicos__cta-btn');

    buttons.forEach(button => {
      button.addEventListener('click', function(e) {
        const serviceName = this.closest('.servicos__card')?.querySelector('.servicos__card-title')?.textContent || 'CTA Geral';
        
        // Log para debug (remover em produção)
        console.log(`Clique no serviço: ${serviceName}`);

        // Integração com Google Analytics (se disponível)
        if (typeof gtag !== 'undefined') {
          gtag('event', 'click', {
            'event_category': 'Serviços',
            'event_label': serviceName,
            'value': 1
          });
        }

        // Integração com Facebook Pixel (se disponível)
        if (typeof fbq !== 'undefined') {
          fbq('track', 'Lead', {
            content_name: serviceName,
            content_category: 'Serviços'
          });
        }
      });
    });
  };

  // ===== LAZY LOADING DE IMAGENS =====
  const initLazyLoading = () => {
    // Verificar se o navegador suporta lazy loading nativo
    if ('loading' in HTMLImageElement.prototype) {
      const images = document.querySelectorAll('.servicos__img');
      images.forEach(img => {
        img.loading = 'lazy';
      });
    } else {
      // Fallback para navegadores antigos usando Intersection Observer
      if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target;
              img.src = img.dataset.src || img.src;
              img.classList.add('loaded');
              observer.unobserve(img);
            }
          });
        });

        const images = document.querySelectorAll('.servicos__img');
        images.forEach(img => imageObserver.observe(img));
      }
    }
  };

  // ===== ACESSIBILIDADE - NAVEGAÇÃO POR TECLADO =====
  const initKeyboardNavigation = () => {
    const cards = document.querySelectorAll('.servicos__card');

    cards.forEach(card => {
      const button = card.querySelector('.servicos__card-btn');
      
      if (button) {
        // Permitir ativar o card com Enter ou Space
        card.addEventListener('keydown', function(e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            button.click();
          }
        });

        // Adicionar tabindex para tornar o card focável
        if (!card.hasAttribute('tabindex')) {
          card.setAttribute('tabindex', '0');
        }
      }
    });
  };

  // ===== SMOOTH SCROLL PARA ÂNCORAS =====
  const initSmoothScroll = () => {
    const links = document.querySelectorAll('a[href^="#servicos"]');

    links.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          const headerOffset = document.querySelector('.header')?.offsetHeight || 80;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  };

  // ===== INICIALIZAÇÃO =====
  const init = () => {
    // Aguardar o DOM estar completamente carregado
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        initScrollAnimations();
        initCardHoverEffects();
        initAnalyticsTracking();
        initLazyLoading();
        initKeyboardNavigation();
        initSmoothScroll();
      });
    } else {
      // DOM já carregado
      initScrollAnimations();
      initCardHoverEffects();
      initAnalyticsTracking();
      initLazyLoading();
      initKeyboardNavigation();
      initSmoothScroll();
    }
  };

  // Executar inicialização
  init();

  // ===== PERFORMANCE MONITORING (OPCIONAL) =====
  if ('PerformanceObserver' in window) {
    const perfObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
          console.log('LCP:', entry.startTime);
        }
      }
    });

    try {
      perfObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      // Navegador não suporta
    }
  }

})();

