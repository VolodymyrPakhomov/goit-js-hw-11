import { Notify } from 'notiflix/build/notiflix-notify-aio';
import PixabayController from './js/PixabayController'
import GalleryController from './js/GalleryController'
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
    searchForm: document.querySelector('.search-form'),
    // loadMoreBtn: document.querySelector('.load-more'),
    galleryContainer: document.querySelector('.gallery'),
};

const pixabayController = new PixabayController();
const galleryController = new GalleryController(refs.galleryContainer);

const gallery = new SimpleLightbox('.gallery a', {});
gallery.on('show.simplelightbox');
 
refs.searchForm.addEventListener('submit', loadNewImages);
// refs.loadMoreBtn.addEventListener('click', loadMoreImages);

let isNewImgsLoading = false;
window.onscroll = async function() {
    if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight) {
        if(!isNewImgsLoading){
            await loadMoreImages();
        }
    }
}

// refs.loadMoreBtn.classList.add('is-hidden');
  
async function loadNewImages (event){
    isNewImgsLoading = true;

    event.preventDefault();

    const searchQueryInput = event.currentTarget.elements.searchQuery.value.trim();
    
    if (searchQueryInput.length === 0) {
        Notify.failure('Введи, что ты хочешь найти)))');
        return;       
    }

    const [totalHits, hints] = await pixabayController.requestNewImgs(searchQueryInput);
   
    if (hints.length === 0) {
        Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        return;       
    }

    Notify.success(`Hooray! We found ${totalHits} images.`);

    window.scroll(0, 0);
    galleryController.clear();
    galleryController.addImgs(hints);

    gallery.refresh();

    if (!pixabayController.isMoreImgsAvailable()) {
        Notify.failure('We\'re sorry, but you\'ve reached the end of search results.');
    }

    // if (pixabayController.isMoreImgsAvailable()) {
    //     refs.loadMoreBtn.classList.remove('is-hidden');
    // }
    // else 
    // {
    //     Notify.failure('We\'re sorry, but you\'ve reached the end of search results.');
    // }

    isNewImgsLoading = false;
}



async function loadMoreImages(){
    isNewImgsLoading = true;
  
    // refs.loadMoreBtn.classList.add('is-hidden');

    if (!pixabayController.isMoreImgsAvailable()) {
        return;
    }
    const hints = await pixabayController.requestMoreImgs();
    
    if (hints.length === 0) {
        Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        return;       
    }

    galleryController.addImgs(hints);

    const { height: cardHeight } = refs.galleryContainer.firstElementChild.getBoundingClientRect();

    // window.scrollBy({top: cardHeight * 2, behavior: "smooth"});

    gallery.refresh();

    if (!pixabayController.isMoreImgsAvailable()) {
        Notify.failure('We\'re sorry, but you\'ve reached the end of search results.');
    }

    // if (pixabayController.isMoreImgsAvailable()) {
    //     refs.loadMoreBtn.classList.remove('is-hidden');
    // }
    // else 
    // {
    //     Notify.failure('We\'re sorry, but you\'ve reached the end of search results.');
    // }

    isNewImgsLoading = false;
}
