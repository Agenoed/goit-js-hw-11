import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const inputElement = document.querySelector('input');
const btnElement = document.querySelector('button');
const galleryElement = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load-more');

let page = 1;
let total = 0;

btnLoadMore.style.display = 'none';
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
  page = 1;
  total = 0;
  element.preventDefault();

  const searchValue = inputElement.value.trim();
  if (!searchValue) {
    Notiflix.Notify.failure('Please enter the text in search field');
    galleryElement.innerHTML = '';
    btnLoadMore.style.display = 'none';
    return;
  }

  pixabayAPI(searchValue, (page = 1))
    .then(data => {
      gallery.refresh();
      total = 0;
      total += data.hits.length;

      galleryElement.innerHTML = '';
      galleryElement.insertAdjacentHTML('beforeend', createMarkup(data.hits));

      if (data.total == 0) {
        btnLoadMore.style.display = 'none';
        Notiflix.Notify.success(
          '"Sorry, there are no images matching your search query. Please try again."'
        );
        galleryElement.innerHTML = '';
      } else {
        Notiflix.Notify.info(`Hooray! We found ${data.totalHits} images.`);
        btnLoadMore.style.display = 'block';
      }
      if (total === Number(data.totalHits) && data.total != 0) {
        Notiflix.Notify.success(
          "We're sorry, but you've reached the end of search results."
        );
        btnLoadMore.style.display = 'none';
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
        </div>`
    )
    .join('');
}

let gallery = new SimpleLightbox('.photo-card a', {
  captionPosition: 'bottom',
  captionDelay: 250,
});

function loadMore() {
  page += 1;
  const searchValue = inputElement.value.trim();

  pixabayAPI(searchValue, page)
    .then(data => {
      console.log(data);
      total += data.hits.length;
      galleryElement.insertAdjacentHTML('beforeend', createMarkup(data.hits));
      gallery.refresh();
      if (total === Number(data.totalHits)) {
        btnLoadMore.style.display = 'none';
        Notiflix.Notify.success(
          "We're sorry, but you've reached the end of search results."
        );
      }
    })
    .catch(error => console.log(error));
}
