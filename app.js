const table = document.querySelector('tbody');
const currency = document.querySelector('select');
const form = document.querySelector('form');
const amount = document.querySelector('#amount');
const sortdesc = document.querySelector('#sortdesc');
const sortasc = document.querySelector('#sortasc');
const sortabcreverse = document.querySelector('#sortabcreverse');
const sortabc = document.querySelector('#sortabc');
const btncontainer = document.querySelector('#btncontainer');

let ratesArray = [];
let currentPage = 1;
let rowsPerPage = 10;

const currencyRate = async () => {
    try {
        if (currency.value === 'Choose currency' || amount.value === '') {
            alert('Enter valid data.');
        }
        const res = await axios.get(`https://v6.exchangerate-api.com/v6/237558c566dce41b41e2cdeb/latest/${currency.value}`);
        const rates = res.data.conversion_rates;
        console.log(rates);
        for (let rate in rates) {
            if (rate.toLowerCase() === currency.value) {
                continue;
            }
            ratesArray.push({ [rate]: rates[rate] });
        };
        btncontainer.innerHTML = '';
        generatePage(ratesArray, table, rowsPerPage, currentPage);
        paginationButtons();
    }
    catch (error) {
        return error;
    }
}

function tableSort(direction) {
    table.innerText = '';
    if (direction === 'asc') {
        ratesArray.sort((a, b) => Object.values(b) - Object.values(a));
    } else {
        ratesArray.sort((a, b) => Object.values(a) - Object.values(b));
    }
    generatePage(ratesArray, table, rowsPerPage, currentPage);
}

function renderTable(arr) {
    for (let item of arr) {
        let rate = Object.keys(item)[0];
        let value = Object.values(item)[0];
        const row = document.createElement('tr');
        const name = document.createElement('td');
        const amountHolder = document.createElement('td');
        name.innerText = `${rate}`;
        amountHolder.innerText = `${(value * amount.value).toFixed(2)}`;
        row.append(name, amountHolder);
        table.append(row);
    };
}

function sortAlphabetical(arr) {
    arr.sort(function (a, b) {
        if (Object.keys(a) < Object.keys(b)) {
            return -1;
        }
        if (Object.keys(a) > Object.keys(b)) {
            return 1;
        }
        return 0;
    });

}

function generatePage(arr, table, rows, page) {
    table.innerText = '';
    page--;
    let start = rows * page;
    let end = start + rows;
    let paginatedItems = arr.slice(start, end);
    renderTable(paginatedItems);
}

function paginationButtons() {
    const previous = document.createElement('button');
    const next = document.createElement('button');
    previous.id = 'previous';
    next.id = 'next';
    previous.classList.add('btn', 'btn-dark');
    next.classList.add('btn', 'btn-dark', 'float-end');
    previous.innerText = 'Previous';
    next.innerText = 'Next';
    previous.addEventListener('click', function () {
        if (currentPage !== 1) {
            currentPage--;
            generatePage(ratesArray, table, rowsPerPage, currentPage);
        }
    });
    next.addEventListener('click', function () {
        if (currentPage !== pageCount(ratesArray)) {
            currentPage++;
            generatePage(ratesArray, table, rowsPerPage, currentPage);
        }
    });
    btncontainer.append(previous, next);
}

function pageCount(arr) {
    return numberOfPages = Math.ceil(arr.length / rowsPerPage);
}

form.addEventListener('submit', function (e) {
    e.preventDefault();
    table.innerText = '';
    ratesArray = [];
    currencyRate();
});

sortasc.addEventListener('click', function () {
    let direction = this.dataset.direction;
    tableSort(direction);
});

sortdesc.addEventListener('click', function () {
    let direction = this.dataset.direction;
    tableSort(direction);
});

sortabc.addEventListener('click', function () {
    table.innerText = '';
    sortAlphabetical(ratesArray);
    generatePage(ratesArray, table, rowsPerPage, currentPage);
})

sortabcreverse.addEventListener('click', function () {
    table.innerText = '';
    sortAlphabetical(ratesArray);
    ratesArray.reverse();
    generatePage(ratesArray, table, rowsPerPage, currentPage);
});