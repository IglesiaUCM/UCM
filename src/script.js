const carouselImages = document.querySelector('.carousel__carousel-images');
const images = document.querySelectorAll('.carousel-images__image');
const buttonNextImage = document.querySelector('.carousel__button-next-image');
const buttonPrevImage = document.querySelector('.carousel__button-prev-image');
const dotsContainer = document.querySelector('.carousel__dots');

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

const updatePosition = () => {
  const width = getWidth();
  carouselImages.style.transform = `translateX(-${index * width}px)`;
};

const updateDots = () => {
  document.querySelectorAll('.carousel__dot').forEach(dot => dot.classList.remove('active'));
  dotsContainer.children[index - 1]?.classList.add('active');
};

const showImage = (i) => {

  if (isAnimating) return; // 👈 BLOQUEA SI ESTÁ EN TRANSICIÓN
  isAnimating = true;
  index = i;

  const allImages = document.querySelectorAll('.carousel-images__image');

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
   TRANSICIÓN INFINITA
========================= */

carouselImages.addEventListener('transitionend', () => {
  const allImages = document.querySelectorAll('.carousel-images__image');

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