/**
 * ===================================
 * HEADER RESPONSIVO - VERSÃO REFINADA
 * ===================================
 * - Código otimizado e acessível (WCAG 2.1)
 * - Melhor performance e scroll suave real
 * - Sem mudanças visuais
 */

(() => {
  'use strict';

  const header = document.getElementById('header');
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const navLinks = document.querySelectorAll('.header__nav-link, .header__mobile-nav-link');
  
  let isMenuOpen = false;
  let lastScrollY = 0;
  let ticking = false;

  function toggleMobileMenu() {
    isMenuOpen = !isMenuOpen;
    menuToggle.classList.toggle('active', isMenuOpen);
    mobileMenu.classList.toggle('active', isMenuOpen);

    menuToggle.setAttribute('aria-expanded', isMenuOpen);
    menuToggle.setAttribute('aria-label', isMenuOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';

    if (isMenuOpen) {
      setTimeout(() => mobileMenu.querySelector('a')?.focus(), 300);
    } else {
      menuToggle.focus();
    }
  }

  function closeMobileMenu() {
    if (isMenuOpen) toggleMobileMenu();
  }

  function handleScroll() {
    const currentY = window.scrollY;
    header.classList.toggle('scrolled', currentY > 50);
    updateActiveLink();
    lastScrollY = currentY;
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  }

  function smoothScrollTo(element) {
    if (!element) return;
    const headerHeight = header.offsetHeight;
    const targetY = element.getBoundingClientRect().top + window.scrollY - headerHeight - 20;

    window.scrollTo({ top: targetY, behavior: 'smooth' });
  }

  function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + header.offsetHeight + 100;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.id;
      const inView = scrollPosition >= top && scrollPosition < top + height;

      document.querySelectorAll(`a[href="#${id}"]`)
        .forEach(link => link.classList.toggle('active', inView));
    });
  }

  function init() {
    menuToggle?.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      toggleMobileMenu();
    });

    navLinks.forEach(link =>
      link.addEventListener('click', closeMobileMenu)
    );

    navLinks.forEach(link =>
      link.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) smoothScrollTo(target);
      })
    );

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 896 && isMenuOpen) closeMobileMenu();
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeMobileMenu();
    });

    document.addEventListener('click', e => {
      if (isMenuOpen && !mobileMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        closeMobileMenu();
      }
    });

    handleScroll();
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();
})();
