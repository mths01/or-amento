/* ==========================================================================
   MTHSFILMS — Slide Carousel & UI Engine (Saúde)
   ========================================================================== */

(function () {
  'use strict';

  // ── Elementos do DOM ──
  const wrapper       = document.getElementById('slidesWrapper');
  const slides        = wrapper.querySelectorAll('.slide');
  const dotsContainer  = document.getElementById('slideDots');
  const prevBtn       = document.getElementById('prevBtn');
  const nextBtn       = document.getElementById('nextBtn');
  const keyHint       = document.getElementById('keyboardHint');
  
  // Navbar Elements
  const navbar        = document.getElementById('navbar');
  const navToggle     = document.getElementById('navToggle');
  const navMenu       = document.getElementById('navMenu');
  const navLinks      = document.querySelectorAll('.slide-link');

  const totalSlides   = slides.length;
  let currentIndex    = 0;
  let isAnimating     = false;
  const ANIM_DURATION = 800; // ms

  // ── Inicializar Imagens de Fundo dos Slides ──
  slides.forEach(slide => {
    const bgSrc = slide.getAttribute('data-bg');
    if (bgSrc) {
      const bgEl = slide.querySelector('.slide-bg-image');
      if (bgEl) {
        bgEl.style.backgroundImage = `url('${bgSrc}')`;
      }
    }
  });

  // ── Criar Dots Indicadores ──
  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('button');
    dot.classList.add('slide-dot');
    dot.setAttribute('aria-label', `Ir para slide ${i + 1}`);
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  }

  const dots = dotsContainer.querySelectorAll('.slide-dot');

  // ── Criar Contador de Slides ──
  const counter = document.createElement('div');
  counter.classList.add('slide-counter');
  document.body.appendChild(counter);

  // ── Criar Brilho Ambiente (Ambient Glow) ──
  const glow1 = document.createElement('div');
  glow1.classList.add('ambient-glow', 'glow-1');
  document.body.appendChild(glow1);

  const glow2 = document.createElement('div');
  glow2.classList.add('ambient-glow', 'glow-2');
  document.body.appendChild(glow2);

  // ── Sincronização da Navbar ──
  // Mapeia o índice do slide ativo para o índice correspondente do link da navbar
  // Mapeamento:
  // Slide 0 -> Navbar Início (link index 0)
  // Slide 1 -> Navbar Processo (link index 1)
  // Slide 2 (Pacote 1) -> Navbar Pacotes (link index 2, data-slide="3")
  // Slide 3 (Pacote 2) -> Navbar Pacotes (link index 2, data-slide="3")
  // Slide 4 (Pacote 3) -> Navbar Pacotes (link index 2, data-slide="3")
  // Slide 5 -> Navbar Incluso (link index 3, data-slide="5")
  // Slide 6 (Diferenciais) -> Navbar Incluso (link index 3, data-slide="5" - mantém ativo ou nenhum)
  // Slide 7 -> Navbar Portfólio (link index 4, data-slide="7")
  // Slide 8 -> Navbar FAQ (link index 5, data-slide="8")
  // Slide 9 -> Navbar Contato (link index 6, data-slide="9")
  function updateActiveNavLink(slideIndex) {
    let activeNavLink = null;

    if (slideIndex === 0) {
      activeNavLink = document.querySelector('.slide-link[data-slide="0"]');
    } else if (slideIndex === 1) {
      activeNavLink = document.querySelector('.slide-link[data-slide="1"]');
    } else if (slideIndex >= 2 && slideIndex <= 4) {
      activeNavLink = document.querySelector('.slide-link[data-slide="3"]');
    } else if (slideIndex === 5 || slideIndex === 6) {
      activeNavLink = document.querySelector('.slide-link[data-slide="5"]');
    } else if (slideIndex === 7) {
      activeNavLink = document.querySelector('.slide-link[data-slide="7"]');
    } else if (slideIndex === 8) {
      activeNavLink = document.querySelector('.slide-link[data-slide="8"]');
    } else if (slideIndex === 9) {
      activeNavLink = document.querySelector('.slide-link[data-slide="9"]');
    }

    navLinks.forEach(link => link.classList.remove('active'));
    if (activeNavLink) {
      activeNavLink.classList.add('active');
    }
  }

  // ── Navegação Principal do Slider ──
  function goToSlide(index) {
    if (isAnimating || index === currentIndex || index < 0 || index >= totalSlides) return;

    isAnimating = true;
    
    // Desativa slide e dot atual
    slides[currentIndex].classList.remove('active');
    dots[currentIndex].classList.remove('active');

    // Define novo slide
    currentIndex = index;

    // Ativa novo slide e dot
    slides[currentIndex].classList.add('active');
    dots[currentIndex].classList.add('active');

    // Atualiza contador, navbar e botões
    updateCounter();
    updateActiveNavLink(currentIndex);

    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === totalSlides - 1;

    // Reseta o scroll interno do slide ao entrar nele
    slides[currentIndex].scrollTop = 0;

    // Libera a trava de animação
    setTimeout(() => {
      isAnimating = false;
    }, ANIM_DURATION);
  }

  function nextSlide() {
    if (currentIndex < totalSlides - 1) {
      goToSlide(currentIndex + 1);
    }
  }

  function prevSlide() {
    if (currentIndex > 0) {
      goToSlide(currentIndex - 1);
    }
  }

  function updateCounter() {
    const curr = String(currentIndex + 1).padStart(2, '0');
    const total = String(totalSlides).padStart(2, '0');
    counter.innerHTML = `<span class="current">${curr}</span><span class="separator">/</span><span>${total}</span>`;
  }

  // ── Eventos de Clique nos Elementos da Navbar ──
  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const targetSlide = parseInt(this.getAttribute('data-slide'));
      
      // Fecha menu mobile se estiver aberto
      if (navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
      }

      goToSlide(targetSlide);
    });
  });

  // ── Menu Mobile Toggle ──
  if (navToggle) {
    navToggle.addEventListener('click', function () {
      this.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
  }

  // ── Inicialização do Primeiro Slide ──
  slides[0].classList.add('active');
  dots[0].classList.add('active');
  prevBtn.disabled = true;
  updateCounter();
  updateActiveNavLink(0);

  // ── Eventos de Setas de Navegação ──
  prevBtn.addEventListener('click', prevSlide);
  nextBtn.addEventListener('click', nextSlide);

  // ── Navegação por Teclado ──
  let keyHintTimeout;

  document.addEventListener('keydown', (e) => {
    // Evita navegar se o usuário estiver preenchendo algum input/campo (se houver no futuro)
    if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        nextSlide();
        hideKeyHint();
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        prevSlide();
        hideKeyHint();
        break;
      case 'Home':
        e.preventDefault();
        goToSlide(0);
        break;
      case 'End':
        e.preventDefault();
        goToSlide(totalSlides - 1);
        break;
    }
  });

  function hideKeyHint() {
    if (keyHint && !keyHint.classList.contains('hidden')) {
      keyHint.classList.add('hidden');
    }
  }

  // Esconde o hint de teclado após 5 segundos
  keyHintTimeout = setTimeout(() => {
    hideKeyHint();
  }, 5000);

  // ── Navegação por Scroll do Mouse (Wheel) ──
  let wheelCooldown = false;

  document.addEventListener('wheel', (e) => {
    // Verifica se o slide atual tem scroll e se o usuário está scrollando dentro dele
    const activeSlide = slides[currentIndex];
    const isScrollable = activeSlide.scrollHeight > activeSlide.clientHeight;
    
    if (isScrollable) {
      // Se estiver rolando para baixo, e ainda não chegou no final do conteúdo do slide, deixa rolar nativamente
      if (e.deltaY > 0 && activeSlide.scrollTop + activeSlide.clientHeight < activeSlide.scrollHeight - 10) {
        return;
      }
      // Se estiver rolando para cima, e ainda não chegou no topo do conteúdo do slide, deixa rolar nativamente
      if (e.deltaY < 0 && activeSlide.scrollTop > 10) {
        return;
      }
    }

    if (wheelCooldown) return;
    wheelCooldown = true;

    if (e.deltaY > 0) {
      nextSlide();
    } else if (e.deltaY < 0) {
      prevSlide();
    }

    setTimeout(() => {
      wheelCooldown = false;
    }, 1000); // Cooldown de 1s para evitar trocas bruscas múltiplas
  }, { passive: false });

  // ── Navegação por Gestos de Toque (Swipe) ──
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;
  const SWIPE_THRESHOLD = 50;

  document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;
    
    const activeSlide = slides[currentIndex];
    const isScrollable = activeSlide.scrollHeight > activeSlide.clientHeight;

    // Determina se o swipe foi horizontal ou vertical
    if (Math.abs(diffX) > Math.abs(diffY)) {
      // Swipe Horizontal
      if (Math.abs(diffX) > SWIPE_THRESHOLD) {
        if (diffX > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
    } else {
      // Swipe Vertical
      if (isScrollable) {
        // Se o slide for rolável, permite o scroll nativo vertical primeiro
        if (diffY > 0 && activeSlide.scrollTop + activeSlide.clientHeight < activeSlide.scrollHeight - 10) {
          return;
        }
        if (diffY < 0 && activeSlide.scrollTop > 10) {
          return;
        }
      }
      
      if (Math.abs(diffY) > SWIPE_THRESHOLD) {
        if (diffY > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
    }
  }

  // ── Pré-carregamento das Imagens de Fundo para Evitar Atraso Visual ──
  slides.forEach(slide => {
    const bgSrc = slide.getAttribute('data-bg');
    if (bgSrc) {
      const img = new Image();
      img.src = bgSrc;
    }
  });

  // ── Lógica Interativa do Acordeão do FAQ ──
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(question => {
    question.addEventListener('click', function () {
      const faqItem = this.parentElement;
      const faqAnswer = faqItem.querySelector('.faq-answer');
      const isOpen = faqItem.classList.contains('active');

      // Fecha todos os outros itens de FAQ abertos
      document.querySelectorAll('.faq-item').forEach(item => {
        if (item !== faqItem && item.classList.contains('active')) {
          item.classList.remove('active');
          item.querySelector('.faq-answer').style.maxHeight = '0';
        }
      });

      // Alterna o estado do item atual
      if (isOpen) {
        faqItem.classList.remove('active');
        faqAnswer.style.maxHeight = '0';
      } else {
        faqItem.classList.add('active');
        faqAnswer.style.maxHeight = faqAnswer.scrollHeight + 'px';
      }
    });
  });

})();
