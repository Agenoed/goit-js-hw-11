import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const inputElement = document.querySelector('input');
const btnElement = document.querySelector('button');
const galleryElement = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load-more');

let page = 1;
let counterClick = 1;

btnLoadMore.setAttribute('hidden', true);
btnElement.addEventListener('click', onSearch);
btnLoadMore.addEventListener('click', loadMore);

async function pixabayAPI(value, page) {
  const url = 'https://pixabay.com/api/';
  const apiKey = '31882217-972b08f02187a04a9df548d0a';

  const response = await axios.get(
    `${url}?key=${apiKey}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
  );
  return response.data;
}

function onSearch(element) {
  element.preventDefault();
  galleryElement.innerHTML = '';
  counterClick = 1;
  const searchValue = inputElement.value.trim();
  if (!searchValue) {
    Notiflix.Notify.failure('Please enter the text in search field');
    return;
  }
  btnLoadMore.removeAttribute('hidden', true);

  pixabayAPI(searchValue, (page = 1))
    .then(data => {
      galleryElement.insertAdjacentHTML('beforeend', createMarkup(data.hits));
      gallery.refresh();
      if (data.hits.length === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        Notiflix.Notify.info(`Hooray! We found ${data.totalHits} images.`);
      }
    })
    .catch(error => console.log(error));
}

function createMarkup(array) {
  return array
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `<div class="photo-card">
            <div class="wrap">
                <a class="link" href="${largeImageURL}">
                    <img class="img-item" src="${webformatURL}" alt="${tags}" loading="lazy" />
                    <div class="info">
                        <p class="info-item">
                            <b>Likes</b>${likes}  
                        </p>

                        <p class="info-item">
                            <b>Views</b>${views}
                        </p>
                        <p class="info-item">
                            <b>Comments</b>${comments}
                        </p>
                        <p class="info-item">
                            <b>Downloads</b>${downloads}  
                        </p>
                    </div>
                </a>
            </div>
        </div>`
    )
    .join('');
}

let gallery = new SimpleLightbox('.wrap a', {
  captionPosition: 'bottom',
  captionDelay: 250,
});

function loadMore() {
  page += 1;
  counterClick += 1;
  const searchValue = inputElement.value.trim();

  pixabayAPI(searchValue, page)
    .then(data => {
      galleryElement.insertAdjacentHTML('beforeend', createMarkup(data.hits));
      gallery.refresh();

      if (counterClick === 13) {
        btnLoadMore.setAttribute('hidden', true);
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }
    })
    .catch(error => console.log(error));
}
