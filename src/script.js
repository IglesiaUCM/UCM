const images = document.querySelectorAll('.carousel-images__image');
const total = images.length;
const intervalTime = 3000;
let index = 0;

const carouselImages = document.querySelector('.carousel__carousel-images');
const buttonNextImage = document.querySelector('.carousel__button-next-image');
const buttonPrevImage = document.querySelector('.carousel__button-prev-image');

const getCarouselWidth = function () {
    return carouselImages.offsetWidth;
}

const showImage = function (i) {
    const width = getCarouselWidth();
    index = (i + total) % total; // Para hacer el bucle circular
    carouselImages.style.transform = `translateX(-${index * width}px)`;
}

buttonNextImage.addEventListener('click', () => {
    showImage(index + 1);
});

buttonPrevImage.addEventListener('click', () => {
    showImage(index - 1);
});

window.addEventListener('resize', () => {
  showImage(index); // Reposiciona usando el nuevo ancho
});

document.addEventListener('DOMContentLoaded', () => {
  showImage(index);
});

let autoplay = setInterval(() => {
  showImage(index + 1);
}, intervalTime);