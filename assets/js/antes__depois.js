/**
 * ===== FUNCIONALIDADE INTERATIVA ANTES E DEPOIS =====
 * Script para controlar o slider de comparação de imagens
 */

document.addEventListener('DOMContentLoaded', function() {
  // Selecionar todos os containers de comparação
  const comparisons = document.querySelectorAll('.antes__depois__comparison');
  
  comparisons.forEach(function(comparison) {
    const depoisContainer = comparison.querySelector('.antes__depois__image-depois-container');
    const slider = comparison.querySelector('.antes__depois__slider');
    
    if (!depoisContainer || !slider) return;
    
    let isActive = false;
    
    // Função para atualizar a posição do slider
    function updateSliderPosition(x) {
      const rect = comparison.getBoundingClientRect();
      const position = ((x - rect.left) / rect.width) * 100;
      
      // Limitar entre 0% e 100%
      const clampedPosition = Math.max(0, Math.min(100, position));
      
      // Atualizar a largura do container "depois"
      depoisContainer.style.width = clampedPosition + '%';
      
      // Atualizar a posição do slider
      updateLabels(clampedPosition);
      slider.style.left = clampedPosition + '%';
    }
    
    // Evento de mouse down no slider
    slider.addEventListener('mousedown', function(e) {
      e.preventDefault();
      isActive = true;
      comparison.classList.add('active');
    });
    
    // Evento de mouse down no container de comparação
    comparison.addEventListener('mousedown', function(e) {
      e.preventDefault();
      isActive = true;
      comparison.classList.add('active');
      updateSliderPosition(e.clientX);
    });
    
    // Evento de mouse move no documento
    document.addEventListener('mousemove', function(e) {
      if (!isActive) return;
      e.preventDefault();
      updateSliderPosition(e.clientX);
    });
    
    // Evento de mouse up no documento
    document.addEventListener('mouseup', function() {
      if (isActive) {
        isActive = false;
        comparison.classList.remove('active');
      }
    });
    
    // Suporte para touch (mobile)
    slider.addEventListener('touchstart', function(e) {
      e.preventDefault();
      isActive = true;
      comparison.classList.add('active');
    });
    
    comparison.addEventListener('touchstart', function(e) {
      e.preventDefault();
      isActive = true;
      comparison.classList.add('active');
      const touch = e.touches[0];
      updateSliderPosition(touch.clientX);
    });
    
    document.addEventListener('touchmove', function(e) {
      if (!isActive) return;
      e.preventDefault();
      const touch = e.touches[0];
      updateSliderPosition(touch.clientX);
    }, { passive: false });
    
    document.addEventListener('touchend', function() {
      if (isActive) {
        isActive = false;
        comparison.classList.remove('active');
      }
    });
    
    // Acessibilidade: suporte para teclado
    comparison.setAttribute('tabindex', '0');
    comparison.setAttribute('role', 'slider');
    comparison.setAttribute('aria-label', 'Comparação antes e depois - use as setas para ajustar');
    comparison.setAttribute('aria-valuemin', '0');
    comparison.setAttribute('aria-valuemax', '100');
    comparison.setAttribute('aria-valuenow', '50');
    
    comparison.addEventListener('keydown', function(e) {
      const currentPosition = parseFloat(depoisContainer.style.width) || 50;
      let newPosition = currentPosition;
      
      // Seta para esquerda: diminuir
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        newPosition = Math.max(0, currentPosition - 5);
      }
      
      // Seta para direita: aumentar
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        newPosition = Math.min(100, currentPosition + 5);
      }
      
      // Atualizar posição
      depoisContainer.style.width = newPosition + '%';
      slider.style.left = newPosition + '%';
      comparison.setAttribute('aria-valuenow', Math.round(newPosition));
      updateLabels(newPosition); // Adicionado para teclado
    });
    
      // Animação de entrada suave
    setTimeout(function() {
      comparison.style.opacity = '1';
    }, 100);
    
    // Função para atualizar a visibilidade dos rótulos
    function updateLabels(position) {
      const labelAntes = comparison.querySelector('.antes__depois__label--antes');
      const labelDepois = comparison.querySelector('.antes__depois__label--depois');
      
      if (!labelAntes || !labelDepois) return;
      
      // ANTES deve sumir quando o slider estiver perto de 100% (lado "depois")
      // DEPOIS deve sumir quando o slider estiver perto de 0% (lado "antes")
      
      // Limiar de 15% para começar a sumir/aparecer
      const threshold = 15; 
      
      // Opacidade para ANTES: 100% - (posição / 100) * 100
      // Se position = 0, opacity = 1. Se position = 100, opacity = 0.
      // Usamos um limite para a transição
      
      let opacityAntes = 1;
      if (position < threshold) {
        // ANTES some quando o slider está no lado ANTES (perto de 0%)
        opacityAntes = position / threshold;
      } else if (position > 100 - threshold) {
        // Garante que está 100% visível no lado "depois"
        opacityAntes = 1;
      }
      
      let opacityDepois = 1;
      if (position > 100 - threshold) {
        // DEPOIS some quando o slider está no lado DEPOIS (perto de 100%)
        opacityDepois = 1 - ((position - (100 - threshold)) / threshold);
      } else if (position < threshold) {
        // Garante que está 100% visível no lado "antes"
        opacityDepois = 1;
      }
      
      labelAntes.style.opacity = Math.max(0, Math.min(1, opacityAntes));
      labelDepois.style.opacity = Math.max(0, Math.min(1, opacityDepois));
    }
    
    // Inicializar a posição dos rótulos
    const initialPosition = parseFloat(depoisContainer.style.width) || 50;
    updateLabels(initialPosition);
    
    // Adicionar a lógica de atualização de rótulos ao evento de teclado
    comparison.addEventListener('keydown', function(e) {
      const currentPosition = parseFloat(depoisContainer.style.width) || 50;
      let newPosition = currentPosition;
      
      // Seta para esquerda: diminuir
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        newPosition = Math.max(0, currentPosition - 5);
      }
      
      // Seta para direita: aumentar
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        newPosition = Math.min(100, currentPosition + 5);
      }
      
      // Atualizar posição
      depoisContainer.style.width = newPosition + '%';
      slider.style.left = newPosition + '%';
      comparison.setAttribute('aria-valuenow', Math.round(newPosition));
      updateLabels(newPosition); // Adicionado para teclado
    });
  });
  

  // Lazy loading de imagens para melhor performance
  const images = document.querySelectorAll('.antes__depois__image-antes, .antes__depois__image-depois');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const img = entry.target;
          
          // Verificar se a imagem tem data-src
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px'
    });
    
    images.forEach(function(img) {
      imageObserver.observe(img);
    });
  }
  

});

