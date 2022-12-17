class DataManager {
    #data = [];
    #limit = 5;
    #api = 'https://api.coincap.io/v2';
    #endpoint = '/markets';

    #KEY_STORAGE = 'data';

    SORT = {
        rank: 'rank',
        bSymbol: 'bSymbol',
        qSymbol: 'qSymbol',
        price: 'price',
        volume: 'volume'
    };

    #sortBy = this.SORT.rank;

    constructor(api, endpoint, limit) {
        if (api)
            this.#api = api;
        if (endpoint)
            this.#endpoint = endpoint;
        if (limit)
            this.#limit = limit;
    }


    sortData(sort) {
        this.#sortBy = sort;
        if (this.#sortBy === this.SORT.rank)
            this.#data.sort((a, b) => Number(a.rank) - Number(b.rank));
        if (this.#sortBy === this.SORT.bSymbol)
            this.#data.sort((a, b) => a.baseSymbol > b.baseSymbol);
        if (this.#sortBy === this.SORT.qSymbol)
            this.#data.sort((a, b) => a.quoteSymbol > b.quoteSymbol);
        if (this.#sortBy === this.SORT.price)
            this.#data.sort((a, b) => Number(a.priceUsd) - Number(b.priceUsd));
        if (this.#sortBy === this.SORT.volume)
            this.#data.sort((a, b) => Number(a.volumeUsd24Hr) - Number(b.volumeUsd24Hr));

    }

    async #fetch() {
        try {
            let url = this.#api + this.#endpoint + `?limit=${this.#limit}`;
            if (arguments.length > 0) {
                url += `&${[...arguments].join('&')}`;
            }

            console.log(url);

            const result = await fetch(url).then(res => res.json());
            console.log(result);
            return result;
        } catch (e) {
            console.error(e);
            return [];
        }
    }

    #save(data) {
        window["localStorage"].setItem(this.#KEY_STORAGE, JSON.stringify(data));
    }

    #load() {
        return JSON.parse(window["localStorage"].getItem(this.#KEY_STORAGE));
    }

    async loadData() {
        const local = this.#load();
        if (local)
            this.#data = local;
        else {
            const result = await this.#fetch(...arguments);
            if (result.data) {
                this.#data = result.data;
                this.#save(result.data);
            }
        }
    }

    async fetchMore() {
        const result = await this.#fetch(`offset=${this.#data.length}`, ...arguments);
        if (result.data) {
            this.#data.push(...result.data);
            this.sortData(this.#sortBy);
            return true;
        }
        return false;
    }


    get data() {
        return this.#data;
    }

    get sortBy() {
        return this.#sortBy;
    }



}