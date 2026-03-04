const carouselImages = document.querySelector('.carousel__carousel-images');
const images = document.querySelectorAll('.carousel-images__image');
const buttonNextImage = document.querySelector('.carousel__button-next-image');
const buttonPrevImage = document.querySelector('.carousel__button-prev-image');
const dotsContainer = document.querySelector('.carousel__dots');

let startX = 0;
let currentX = 0;
let isDragging = false;
const swipeThreshold = 50; // distancia mínima para activar cambio

let total = images.length;
let index = 1;
const intervalTime = 3000;
let autoplay;
let isAnimating = false;
/* =========================
   CLONES PARA LOOP INFINITO
========================= */

const firstClone = images[0].cloneNode(true);
const lastClone = images[total - 1].cloneNode(true);

carouselImages.appendChild(firstClone);
carouselImages.insertBefore(lastClone, images[0]);

const allImages = document.querySelectorAll('.carousel-images__image');

carouselImages.style.transform = `translateX(-100%)`;

/* =========================
   FUNCIONES
========================= */

const getWidth = () => carouselImages.offsetWidth;

const getRealIndex = () => {
  if (index === 0) return total - 1;
  if (index === total + 1) return 0;
  return index - 1;
};

const updatePosition = () => {
  const width = getWidth();
  carouselImages.style.transform = `translateX(-${index * width}px)`;
};

const updateDots = () => {
  document.querySelectorAll('.carousel__dot').forEach(dot => dot.classList.remove('active'));
  const realIndex = getRealIndex();
  dotsContainer.children[realIndex]?.classList.add('active');
};

const showImage = (i) => {

  if (isAnimating) return; // 👈 BLOQUEA SI ESTÁ EN TRANSICIÓN
  isAnimating = true;
  index = i;

  if (index >= allImages.length) return;
  if (index < 0) return;

  carouselImages.style.transition = 'transform 0.5s ease-in-out';
  updatePosition();
  updateDots();
};

/* =========================
   AUTOPLAY
========================= */

const startAutoplay = () => {
  autoplay = setInterval(() => {
    showImage(index + 1);
  }, intervalTime);
};

const resetAutoplay = () => {
  clearInterval(autoplay);
  startAutoplay();
};

/* =========================
   EVENTOS BOTONES
========================= */

buttonNextImage.addEventListener('click', () => {
  showImage(index + 1);
  resetAutoplay();
});

buttonPrevImage.addEventListener('click', () => {
  showImage(index - 1);
  resetAutoplay();
});

/* =========================
   SWIPE TÁCTIL
========================= */

const viewport = carouselImages.parentElement; // contenedor visible

viewport.addEventListener('touchstart', (e) => {
  if (isAnimating) return;

  startX = e.touches[0].clientX;
  isDragging = true;
});

viewport.addEventListener('touchmove', (e) => {
  if (!isDragging) return;

  currentX = e.touches[0].clientX;
});

viewport.addEventListener('touchend', () => {
  if (!isDragging) return;

  let diff = startX - currentX;

  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      // Swipe izquierda → siguiente
      showImage(index + 1);
    } else {
      // Swipe derecha → anterior
      showImage(index - 1);
    }

    resetAutoplay();
  }

  isDragging = false;
});


/* =========================
   TRANSICIÓN INFINITA
========================= */

carouselImages.addEventListener('transitionend', () => {
  // Si estamos en el clone del final (última posición visual)
  if (index === allImages.length - 1) {
    carouselImages.style.transition = 'none';
    index = 1;
    updatePosition();
  }

  // Si estamos en el clone del inicio (posición 0)
  if (index === 0) {
    carouselImages.style.transition = 'none';
    index = total;
    updatePosition();
  }
  updateDots();
  isAnimating = false; // 👈 LIBERA AQUÍ
});

/* =========================
   DOTS DINÁMICOS
========================= */

for (let i = 0; i < total; i++) {
  const dot = document.createElement('div');
  dot.classList.add('carousel__dot');

  dot.addEventListener('click', () => {
    showImage(i + 1);
    resetAutoplay();
  });

  dotsContainer.appendChild(dot);
}

updateDots();

/* =========================
   RESIZE
========================= */

window.addEventListener('resize', updatePosition);

/* =========================
   INICIO
========================= */

startAutoplay();