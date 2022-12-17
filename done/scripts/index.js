const API = 'https://api.coincap.io/v2';
const END_MARKETS = '/markets';
const EXCHANGE = 'exchangeid=binance';

const rankHeader = document.getElementById('rank');
const baseHeader = document.getElementById('baseSymbol');
const quoteHeader = document.getElementById('quoteSymbol');
const priceHeader = document.getElementById('priceUsd');
const volumeHeader = document.getElementById('volumeUsd24Hr');

const table = document.getElementById('table-body');

const loadBtn = document.getElementById('load');

const manager = new DataManager(API, END_MARKETS, 5);

function changeSort(sort) {
    manager.sortData(sort);

    const sortHeader = document.querySelector('.sorted');
    if (sortHeader)
        sortHeader.classList.remove('sorted');

    if (manager.sortBy === manager.SORT.bSymbol)
        baseHeader.classList.add('sorted');
    if (manager.sortBy === manager.SORT.qSymbol)
        quoteHeader.classList.add('sorted');
    if (manager.sortBy === manager.SORT.price)
        priceHeader.classList.add('sorted');
    if (manager.sortBy === manager.SORT.volume)
        volumeHeader.classList.add('sorted');

    updateUI();
}

function formatPrice(price) {
    return price > 1 ? Number(price).toFixed(2) : Number(price).toFixed(5);
}
function formatVolume(volume) {
    let formated = Number(Number(volume).toFixed(2)).toLocaleString();
    return formated[formated.length - 2] === '.' ? formated += '0' : formated;
}

function createTableElement(data) {
    const { rank, baseSymbol, quoteSymbol, priceUsd, volumeUsd24Hr } = data;
    const dataTr = document.createElement('tr');

    const rankTd = document.createElement('td');
    rankTd.innerText = rank;

    const baseTd = document.createElement('td');
    baseTd.innerText = baseSymbol;

    const quoteTd = document.createElement('td');
    quoteTd.innerText = quoteSymbol;

    const priceTd = document.createElement('td');
    priceTd.innerText = `$ ${formatPrice(priceUsd)}`;

    const volumeTd = document.createElement('td');
    volumeTd.innerText = `$ ${formatVolume(volumeUsd24Hr)}`;

    dataTr.appendChild(rankTd);
    dataTr.appendChild(baseTd);
    dataTr.appendChild(quoteTd);
    dataTr.appendChild(priceTd);
    dataTr.appendChild(volumeTd);

    return dataTr;
}

function updateUI() {
    table.innerHTML = '';
    manager.data.forEach(el => {
        const row = createTableElement(el);
        table.appendChild(row);
    });
}

async function loadMore() {
    loadBtn.setAttribute('disabled', true);
    loadBtn.innerText = 'Loading...';
    const result = await manager.fetchMore(EXCHANGE);
    if (result) {
        updateUI();
        loadBtn.innerText = 'LOAD MORE';
        loadBtn.removeAttribute('disabled');
    }
    else
        loadBtn.remove();
}

async function onLoad() {
    await manager.loadData(EXCHANGE);
    updateUI();
}

rankHeader.addEventListener('click', () => changeSort(manager.SORT.rank));
baseHeader.addEventListener('click', () => changeSort(manager.SORT.bSymbol));
quoteHeader.addEventListener('click', () => changeSort(manager.SORT.qSymbol));
priceHeader.addEventListener('click', () => changeSort(manager.SORT.price));
volumeHeader.addEventListener('click', () => changeSort(manager.SORT.volume));
loadBtn.addEventListener('click', loadMore);

window.addEventListener('load', onLoad);
