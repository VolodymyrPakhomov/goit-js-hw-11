export default class GalleryController {
    constructor(galleryContainerRef){
        this.galleryContainerRef = galleryContainerRef;
    }

    clear(){
        this.galleryContainerRef.innerHTML = '';
    }
 
    addImgs(imgs){
        const markup = imgs.map(item => createMarkup(item)).join('');
        this.galleryContainerRef.insertAdjacentHTML('beforeend', markup);
    }

}

 
function createMarkup(photos) {
    const {
      webformatURL,
      largeImageURL,
      tags,
      likes,
      views,
      comments,
      downloads,
    } = photos;
    return `<div class="photo-card">
                <a class="photo-card__link" href="${largeImageURL}">
                    <img src="${webformatURL}" alt="${tags}" loading="lazy"/>
                </a>
                <div class="info">
                    <div class="info-item">
                        <b>Likes</b>
                        <p>${likes}</p>
                    </div>
                    <div class="info-item">
                        <b>Views</b>
                        <p>${views}</p>
                    </div>
                    <div class="info-item">
                        <b>Comments</b>
                        <p>${comments}</p>
                    </div>
                    <div class="info-item">
                        <b>Downloads</b>
                        <p>${downloads}</p>
                    </div>
                </div>
            </div>`;
  }