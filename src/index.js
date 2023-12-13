import { Notify } from 'notiflix';
import { getImages } from './js/pixabay-api';
import { createImagesTemplte } from './js/createImagesTemplate';

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.js-gallery'),
};

let page = 1;
let query = '';

let options = {
  root: null,
  rootMargin: '100px',
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
        const results = [...images.hits];

        const imagesMarkup = createImagesTemplte(results);
        refs.gallery.insertAdjacentHTML('beforeend', imagesMarkup);

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
  refs.gallery.innerHTML = '';
  page = 1;

  try {
    const images = await getImages(query, page);

    const { total, totalHits } = images;
    const results = [...images.hits];

    if (total === 0) {
      throw new Error(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    Notify.success(`Hooray! We found ${totalHits} images.`);

    const imagesMarkup = createImagesTemplte(results);
    refs.gallery.insertAdjacentHTML('beforeend', imagesMarkup);

    hasMoreImages(totalHits);
  } catch (error) {
    return Notify.failure(error.message);
  }
};

refs.form.addEventListener('submit', onFormSubmit);

export const hasMoreImages = total => {
  if (page < Math.ceil(total / 40)) {
    const item = document.querySelector('.photo-card:last-child');
    observer.observe(item);
  }
};
