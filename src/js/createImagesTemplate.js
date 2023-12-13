import { createImageTemplate } from './createImageTemplate';

export const createImagesTemplte = images => {
  return images.map(createImageTemplate).join('');
};
