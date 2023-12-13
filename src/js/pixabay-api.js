import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api';
// axios.defaults.headers.common['Authorization'] =
//   '41224920-e0172563ca95fa25f351d5f8a';

export const getImages = async (q, page) => {
  const params = {
    q,
    page,
    per_page: 40,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    key: '41224920-e0172563ca95fa25f351d5f8a',
  };

  const { data } = await axios.get('', { params });
  return data;
};
