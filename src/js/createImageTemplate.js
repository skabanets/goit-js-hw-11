export const createImageTemplate = image => {
  return `<li class="image-card">
  <a href="${image.largeImageURL}">
  <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      <b>${image.likes}</b>
    </p>
    <p class="info-item">
      <b>Views</b>
      <b>${image.views}</b>
    </p>
    <p class="info-item">
      <b>Comments</b>
      <b>${image.comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads</b>
      <b>${image.downloads}</b>
    </p>
  </div>
</a>
</li>`;
};
