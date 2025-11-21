const amount = document.getElementById('amount');
const fromCurrency = document.getElementById('fromCurrency');

const toCurrency = document.getElementById('toCurrency');
const convertBtn = document.getElementById('convertBtn');

const swapBtn = document.getElementById('swapBtn');
const resultText = document.getElementById('resultText');
const errorMessage = document.getElementById('errorMessage');

const API_KEY = "https://api.exchangerate-api.com/v4/latest/USD";

async function loadCurrencies() {
    try {
        const response = await fetch(API_KEY);
        const data = await response.json();

        const currencies = Object.keys(data.rates);

        currencies.forEach(curr => {
            let option1 = document.createElement('option');
            option1.value = curr;
            option1.textContent = curr;
            fromCurrency.appendChild(option1);

            let option2 = document.createElement('option');
            option2.value = curr;
            option2.textContent = curr;
            toCurrency.appendChild(option2);
        });
    } catch {
        showError('Failed to load currency list.');
    };
}

loadCurrencies();

convertBtn.addEventListener('click', convertCurrency);

async function convertCurrency() {
    const amt = amount.value.trim();

    if ( amt === "" || isNaN(amt) || Number(amt) <= 0 ) {
        showError('Please enter a valid number');
        return;
    };

    try {
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency.value}`);
        const data = await response.json();

        const rate = data.rates[toCurrency.value];
        const converted = (amt * rate).toFixed(2);

        resultText.textContent = `${amt} ${fromCurrency.value} = ${converted} ${toCurrency.value}`;
        errorMessage.classList.add('hidden');
    } catch {
        showError('Something went wrong. please try again')
    };
};

swapBtn.addEventListener('click', () => {
    const temp = fromCurrency.value;
    toCurrency.value = fromCurrency.value;
    toCurrency.value = temp;

    loadCurrencies();
});

function showError(msg) {
    errorMessage.textContent = msg;
    errorMessage.classList.remove('hidden');
    resultText.textContent = "";
}
