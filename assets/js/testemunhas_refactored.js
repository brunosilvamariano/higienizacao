
document.addEventListener("DOMContentLoaded", () => {
    const carousel = document.querySelector(".testimonials-carousel");
    const cards = document.querySelectorAll(".testimonial-card");
    const carouselDotsContainer = document.querySelector(".carousel-dots");
    const totalCards = cards.length;

    let currentIndex = 0;
    let cardWidth = 0; 
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID = 0;

    function getCardWidth() {
        if (cards.length === 0) return 0;
        const style = window.getComputedStyle(cards[0]);
        const width = cards[0].offsetWidth;
        const gap = parseFloat(window.getComputedStyle(carousel).gap) || 20;
        return width + gap;
    }

    function updateCarousel() {
        if (cards.length === 0) return;
        carousel.style.transition = "transform 0.5s ease-in-out";
        carousel.style.transform = `translateX(${-currentIndex * cardWidth}px)`;
        updateDots();
    }

    function handleResize() {
        cardWidth = getCardWidth();
        updateCarousel();
    }

    window.addEventListener("resize", handleResize);
    handleResize(); // Inicializa a largura do cartão no carregamento da página

    // Criar pontos de navegação
    function createDots() {
        carouselDotsContainer.innerHTML = "";
        for (let i = 0; i < totalCards; i++) {
            const dot = document.createElement("div");
            dot.classList.add("dot");
            dot.dataset.index = i;
            dot.addEventListener("click", () => {
                currentIndex = i;
                updateCarousel();
            });
            carouselDotsContainer.appendChild(dot);
        }
        updateDots();
    }

    function updateDots() {
        const dots = document.querySelectorAll(".carousel-dots .dot");
        dots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add("active");
            } else {
                dot.classList.remove("active");
            }
        });
    }

    createDots(); // Criar os pontos inicialmente

    // Adicionar funcionalidade de arrastar (swipe) para dispositivos móveis
    cards.forEach((card) => {
        card.addEventListener("contextmenu", (e) => {
            e.preventDefault();
        });
    });

    carousel.addEventListener("touchstart", touchStart);
    carousel.addEventListener("touchend", touchEnd);
    carousel.addEventListener("touchmove", touchMove);

    // Eventos de mouse para desktop (opcional, se o comportamento de arrastar for desejado)
    carousel.addEventListener("mousedown", touchStart);
    carousel.addEventListener("mouseup", touchEnd);
    carousel.addEventListener("mouseleave", touchEnd);
    carousel.addEventListener("mousemove", touchMove);

    function getPositionX(e) {
        return e.type.includes("mouse") ? e.pageX : e.touches[0].clientX;
    }

    function touchStart(e) {
        startPos = getPositionX(e);
        isDragging = true;
        animationID = requestAnimationFrame(animation);
        carousel.classList.add("grabbing");
        carousel.style.transition = "none"; // Desativa a transição durante o arrasto
        prevTranslate = currentTranslate; // Armazena a posição atual para o cálculo do delta
    }

    function touchEnd() {
        cancelAnimationFrame(animationID);
        isDragging = false;
        const movedBy = currentTranslate - prevTranslate;

        if (movedBy < -100 && currentIndex < totalCards - 1) {
            currentIndex += 1;
        } else if (movedBy > 100 && currentIndex > 0) {
            currentIndex -= 1;
        }

        setPositionByIndex();
        carousel.classList.remove("grabbing");
    }

    function touchMove(e) {
        if (isDragging) {
            const currentPosition = getPositionX(e);
            currentTranslate = prevTranslate + currentPosition - startPos;
            setSliderPosition();
        }
    }

    function animation() {
        if (isDragging) requestAnimationFrame(animation);
    }

    function setSliderPosition() {
        carousel.style.transform = `translateX(${currentTranslate}px)`;
    }

    function setPositionByIndex() {
        cardWidth = getCardWidth(); // Recalcular a largura antes de definir a posição
        currentTranslate = currentIndex * -cardWidth;
        prevTranslate = currentTranslate;
        updateCarousel();
    }
});

