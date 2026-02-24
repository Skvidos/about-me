class TournamentSlider {
  constructor(cardElement) {
    this.card = cardElement;
    this.sliderTrack = cardElement.querySelector('.slider-track');
    this.sliderItems = cardElement.querySelectorAll('.slider-item');
    this.indicators = cardElement.querySelectorAll('.indicator');
    this.prevBtn = cardElement.querySelector('.slider-prev');
    this.nextBtn = cardElement.querySelector('.slider-next');

    this.currentIndex = 0;
    this.totalSlides = this.sliderItems.length;

    this.sliderItems.forEach((item, index) => {
      const img = item.querySelector('img');
      if (img && index !== 0) {
        img.loading = 'lazy';
      }
    });

    this.init();
  }

  init() {
    this.prevBtn.addEventListener('click', () => this.prevSlide());
    this.nextBtn.addEventListener('click', () => this.nextSlide());
    this.indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => this.goToSlide(index));
    });
  }

  updateSlider() {
    this.sliderItems.forEach(item => item.classList.remove('active'));
    this.sliderItems[this.currentIndex].classList.add('active');

    this.indicators.forEach(indicator => indicator.classList.remove('active'));
    this.indicators[this.currentIndex].classList.add('active');
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.totalSlides;
    this.updateSlider();
  }

  prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
    this.updateSlider();
  }

  goToSlide(index) {
    this.currentIndex = index;
    this.updateSlider();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const tournamentCards = document.querySelectorAll('.tournament-card');
  tournamentCards.forEach(card => {
    new TournamentSlider(card);
  });

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') {
    const focusedCard = document.activeElement.closest('.tournament-card');
    if (focusedCard) {
      focusedCard.querySelector('.slider-prev').click();
    }
  } else if (e.key === 'ArrowRight') {
    const focusedCard = document.activeElement.closest('.tournament-card');
    if (focusedCard) {
      focusedCard.querySelector('.slider-next').click();
    }
  }
});

(function () {
  const modal = document.getElementById('image-modal');
  if (!modal) return;
  const modalImg = document.getElementById('modal-img');
  const closeBtn = modal.querySelector('.modal-close');
  const content = modal.querySelector('.image-modal-content');

  let images = [];
  let current = 0;

  const prevBtn = document.createElement('button');
  prevBtn.className = 'modal-nav modal-prev';
  prevBtn.setAttribute('aria-label', 'Previous image');
  prevBtn.innerHTML = '❮';

  const nextBtn = document.createElement('button');
  nextBtn.className = 'modal-nav modal-next';
  nextBtn.setAttribute('aria-label', 'Next image');
  nextBtn.innerHTML = '❯';

  content.appendChild(prevBtn);
  content.appendChild(nextBtn);

  function show(index) {
    if (!images.length) return;
    current = (index + images.length) % images.length;
    modalImg.src = images[current].src;
    modalImg.alt = images[current].alt || '';
  }

  function openModalWith(imagesArray, startIndex) {
    images = imagesArray.slice();
    show(startIndex || 0);
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    modalImg.src = '';
    images = [];
    document.body.style.overflow = '';
  }

  document.addEventListener('click', (e) => {
    const imgEl = e.target.closest('.slider-image');
    if (!imgEl) return;
    const card = imgEl.closest('.tournament-card');
    if (!card) return;
    const imgs = Array.from(card.querySelectorAll('.slider-image')).map(i => ({ src: i.src, alt: i.alt }));
    const start = imgs.findIndex(i => i.src === imgEl.src);
    openModalWith(imgs, start >= 0 ? start : 0);
  });

  prevBtn.addEventListener('click', () => { show(current - 1); });
  nextBtn.addEventListener('click', () => { show(current + 1); });

  closeBtn && closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('open')) return;
    if (e.key === 'Escape') closeModal();
    else if (e.key === 'ArrowLeft') show(current - 1);
    else if (e.key === 'ArrowRight') show(current + 1);
  });
})();
