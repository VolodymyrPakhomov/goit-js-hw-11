import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '30416408-c6842ca729ef5a51b1af270dd';
const params = `?key=${KEY}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40`;

export default class PixabayController {
    constructor(){
        this.page = 1;
        this.totalHits = null;
        this.hits = null;
        this.input = null;
    }

    async requestNewImgs(input) {
        this.page = 1;
        this.totalHits = null;
        this.hits = null;
        this.input = null;

        try {
            const response = await axios.get(`${BASE_URL}${params}&q=${input}&page=${this.page}`);

            if(response.status != 200){
                throw new Error(response.status);
            }

            this.input = input;
            this.totalHits = response.data.totalHits;
            this.hits = response.data.hits.length;

            return [response.data.totalHits, response.data.hits];

        } catch (error) {
            Notify.failure('Something went wrong! Please retry');
            console.log(error);
        }

        return [0, []];
    }

    async requestMoreImgs(){
        if (this.input === null) {
            Notify.failure('Something went wrong! Please retry');
            return;  
        }

        this.page += 1;

        try {
            const response = await axios.get(`${BASE_URL}${params}&q=${this.input}&page=${this.page}`);

            if(response.status != 200){
                throw new Error(response.status);
            }

            this.hits += response.data.hits.length;
            return response.data.hits;
        } catch (error) {
            Notify.failure('Something went wrong! Please retry');
            console.log(error);
        }

        return [];
    }

    isMoreImgsAvailable(){
        if (this.input === null) {
            return false;  
        }
        return this.hits < this.totalHits;
    }
}