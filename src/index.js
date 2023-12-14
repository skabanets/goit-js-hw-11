import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import { getImages } from './js/pixabay-api';
import { createImagesTemplte } from './js/createImagesTemplate';

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.js-gallery'),
};

let page = null;
let query = '';
let imagesLightBox = {};

let options = {
  root: null,
  rootMargin: '200px',
  threshold: 1.0,
};

let callback = (entries, observer) => {
  entries.forEach(async entry => {
    if (entry.isIntersecting) {
      observer.unobserve(entry.target);
      page += 1;

      try {
        const images = await getImages(query, page);
        const { totalHits } = images;
        let results = [...images.hits];

        const imagesMarkup = createImagesTemplte(results);
        refs.gallery.insertAdjacentHTML('beforeend', imagesMarkup);

        imagesLightBox.refresh();
        hasMoreImages(totalHits);
      } catch (error) {
        return Notify.failure(error.message);
      }
    }
  });
};

let observer = new IntersectionObserver(callback, options);

const onFormSubmit = async e => {
  e.preventDefault();

  query = e.target.elements.searchQuery.value;
  if (!query.trim()) {
    return Notify.failure('Fill in the search field!');
  }

  e.target.reset();
  page = 1;

  try {
    const images = await getImages(query, page);
    const { total, totalHits } = images;
    let results = [...images.hits];

    if (total === 0) {
      throw new Error(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    refs.gallery.innerHTML = '';
    Notify.success(`Hooray! We found ${totalHits} images.`);

    const imagesMarkup = createImagesTemplte(results);
    refs.gallery.insertAdjacentHTML('beforeend', imagesMarkup);

    imagesLightBox = new SimpleLightbox('.gallery a');
    hasMoreImages(totalHits);
  } catch (error) {
    return Notify.failure(error.message);
  }
};

refs.form.addEventListener('submit', onFormSubmit);

const hasMoreImages = total => {
  const totalPages = Math.ceil(total / 40);

  if (page < totalPages) {
    const item = document.querySelector('.image-card:last-child');
    observer.observe(item);
  }

  if (page === totalPages && page !== 1) {
    return Notify.warning(
      `We're sorry, but you've reached the end of search results.`
    );
  }
};
