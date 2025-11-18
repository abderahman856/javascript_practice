// ================================
// SELECT HTML ELEMENTS
// ================================
const titleInput = document.getElementById("titleInput");
const amountInput = document.getElementById("amountInput");
const categoryInput = document.getElementById("categoryInput");

const addBtn = document.getElementById("addBtn");

const searchInput = document.getElementById("searchInput");
const filterCategory = document.getElementById("filterCategory");
const sortBtn = document.getElementById("sortBtn");

const totalExpenses = document.getElementById("totalExpenses");
const expenseList = document.getElementById("expenseList");

const modal = document.getElementById("modal");
const editTitle = document.getElementById("editTitle");
const editAmount = document.getElementById("editAmount");
const editCategory = document.getElementById("editCategory");
const saveEditBtn = document.getElementById("saveEditBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");


// ================================
// VARIABLES
// ================================
let expenses = JSON.parse(localStorage.getItem("expenseData")) || [];
let sortAsc = true;
let editIndex = null;


// ================================
// SAVE TO STORAGE
// ================================
function saveToStorage() {
    localStorage.setItem("expenseData", JSON.stringify(expenses));
}


// ================================
// RENDER EXPENSES
// ================================
function renderExpenses() {

    expenseList.innerHTML = "";

    // Start with copy
    let result = [...expenses];

    // --- SEARCH ---
    const text = searchInput.value.toLowerCase();
    result = result.filter(e => e.title.toLowerCase().includes(text));

    // --- FILTER ---
    if (filterCategory.value !== "all") {
        result = result.filter(e => e.category === filterCategory.value);
    }

    // --- SHOW EACH EXPENSE ---
    let total = 0;

    result.forEach((exp, index) => {

        total += exp.amount;

        const li = document.createElement("li");

        li.innerHTML = `
            <span>${exp.title} | $${exp.amount} | ${exp.category}</span>
            <div>
                <button class="editBtn" data-index="${index}">Edit</button>
                <button class="deleteBtn" data-index="${index}">Delete</button>
            </div>
        `;

        expenseList.appendChild(li);
    });

    totalExpenses.textContent = `Total: $${total}`;

    attachButtons();
}


// ================================
// ADD EXPENSE
// ================================
addBtn.addEventListener("click", () => {

    if (!titleInput.value || !amountInput.value || !categoryInput.value) {
        alert("Please fill all fields");
        return;
    }

    const newExp = {
        title: titleInput.value,
        amount: Number(amountInput.value),
        category: categoryInput.value
    };

    expenses.push(newExp);
    saveToStorage();
    renderExpenses();

    titleInput.value = "";
    amountInput.value = "";
    categoryInput.value = "";
});


// ================================
// SORT BY AMOUNT
// ================================
sortBtn.addEventListener("click", () => {

    if (sortAsc) {
        expenses.sort((a, b) => a.amount - b.amount);
    } else {
        expenses.sort((a, b) => b.amount - a.amount);
    }

    sortAsc = !sortAsc;
    renderExpenses();
});


// ================================
// SEARCH + FILTER EVENTS
// ================================
searchInput.addEventListener("input", renderExpenses);
filterCategory.addEventListener("change", renderExpenses);


// ================================
// EDIT + DELETE
// ================================
function attachButtons() {

    // EDIT
    document.querySelectorAll(".editBtn").forEach(btn => {
        btn.addEventListener("click", () => {
            editIndex = btn.dataset.index;
            openModal(expenses[editIndex]);
        });
    });

    // DELETE
    document.querySelectorAll(".deleteBtn").forEach(btn => {
        btn.addEventListener("click", () => {
            const index = btn.dataset.index;
            expenses.splice(index, 1);
            saveToStorage();
            renderExpenses();
        });
    });
}


// ================================
// EDIT MODAL
// ================================
function openModal(exp) {
    modal.classList.remove("hidden");
    editTitle.value = exp.title;
    editAmount.value = exp.amount;
    editCategory.value = exp.category;
}

cancelEditBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
});

saveEditBtn.addEventListener("click", () => {

    expenses[editIndex] = {
        title: editTitle.value,
        amount: Number(editAmount.value),
        category: editCategory.value
    };

    modal.classList.add("hidden");
    saveToStorage();
    renderExpenses();
});


// ================================
// FIRST RENDER
// ================================
renderExpenses();
