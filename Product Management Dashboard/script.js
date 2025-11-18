// ================================
// SELECT ELEMENTS
// ================================
const productName = document.getElementById('productName');
const productPrice = document.getElementById('productPrice');
const productCategory = document.getElementById('productCategory');

const addBtn = document.getElementById('addBtn');
const searchInput = document.getElementById('searchInput');
const filterCategory = document.getElementById('filterCategory');
const sortBtn = document.getElementById('sortBtn');
const productList = document.getElementById('productList');

// ================================
// LOAD PRODUCTS FROM LOCALSTORAGE
// ================================
let products = JSON.parse(localStorage.getItem('productData')) || [];
let sortAsc = true;

// ================================
// SAVE PRODUCTS TO LOCALSTORAGE
// ================================
function saveProducts() {
    localStorage.setItem('productData', JSON.stringify(products));
}

// ================================
// RENDER PRODUCTS
// ================================
function renderProducts() {
    productList.innerHTML = "";

    let result = [...products];

    // SEARCH FILTER
    const search = searchInput.value.toLowerCase();
    result = result.filter(p => p.name.toLowerCase().includes(search));

    // CATEGORY FILTER
    if (filterCategory.value !== "") {
        result = result.filter(p => p.category === filterCategory.value);
    }

    result.forEach((p, index) => {
        const li = document.createElement('li');
        li.classList.add('product-card');
        li.innerHTML = `
            <h3>${p.name}</h3>
            <p>Price: $${p.price}</p>
            <p>Category: ${p.category}</p>
            <div class="actions">
                <button class="edit-btn" data-index="${index}">Edit</button>
                <button class="delete-btn" data-index="${index}">Delete</button>
            </div>
        `;
        productList.appendChild(li);
    });

    attachButtons();
}

// ================================
// ADD PRODUCT
// ================================
addBtn.addEventListener('click', () => {
    const name = productName.value.trim();
    const price = productPrice.value.trim();
    const category = productCategory.value.trim();

    if (!name || !price || !category) {
        alert("Please fill all fields!");
        return;
    }

    const product = {
        name,
        price: Number(price),
        category
    };

    products.push(product);
    saveProducts();
    renderProducts();

    productName.value = "";
    productPrice.value = "";
    productCategory.value = "";
});

// ================================
// ATTACH EDIT + DELETE BUTTONS
// ================================
function attachButtons() {
    // DELETE
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = btn.dataset.index;
            products.splice(index, 1);
            saveProducts();
            renderProducts();
        });
    });

    // EDIT
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = btn.dataset.index;
            const p = products[index];
            productName.value = p.name;
            productPrice.value = p.price;
            productCategory.value = p.category;

            // remove old product
            products.splice(index, 1);
            saveProducts();
            renderProducts();
        });
    });
}

// ================================
// SEARCH & FILTER EVENTS
// ================================
searchInput.addEventListener('input', renderProducts);
filterCategory.addEventListener('change', renderProducts);

// ================================
// SORT BY PRICE
// ================================
sortBtn.addEventListener('click', () => {
    if (sortAsc) {
        products.sort((a, b) => a.price - b.price);
    } else {
        products.sort((a, b) => b.price - a.price);
    }
    sortAsc = !sortAsc;
    renderProducts();
});

// ================================
// FIRST RENDER
// ================================
renderProducts();
