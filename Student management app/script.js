// ================================
// SELECT HTML ELEMENTS
// ================================
const nameInput = document.getElementById("nameInput");
const ageInput = document.getElementById("ageInput");
const gradeInput = document.getElementById("gradeInput");

const addBtn = document.getElementById("addBtn");

const searchInput = document.getElementById("searchInput");
const filterGrade = document.getElementById("filterGrade");
const sortBtn = document.getElementById("sortBtn");

const studentList = document.getElementById("studentList");

const modal = document.getElementById("modal");
const editName = document.getElementById("editName");
const editAge = document.getElementById("editAge");
const editGrade = document.getElementById("editGrade");
const saveEditBtn = document.getElementById("saveEditBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");


// ================================
// LOAD STUDENTS FROM STORAGE
// ================================
let students = JSON.parse(localStorage.getItem("studentsData")) || [];
let sortAsc = true;         // for age sorting
let editIndex = null;       // which student is being edited


// ================================
// SAVE STUDENTS TO LOCALSTORAGE
// ================================
function saveToStorage() {
    localStorage.setItem("studentsData", JSON.stringify(students));
}


// ================================
// RENDER STUDENTS (SHOW ON SCREEN)
// ================================
function renderStudents() {

    // Clear the list before adding new items
    studentList.innerHTML = "";

    // Start with a copy so filtering doesn’t affect original
    let result = [...students];

    // --- SEARCH ---
    const text = searchInput.value.toLowerCase();
    result = result.filter(s => s.name.toLowerCase().includes(text));

    // --- FILTER BY GRADE ---
    if (filterGrade.value !== "all") {
        result = result.filter(s => s.grade === filterGrade.value);
    }

    // --- DISPLAY EACH STUDENT ---
    result.forEach((student, index) => {

        const li = document.createElement("li");

        li.innerHTML = `
            <span>${student.name} | Age: ${student.age} | Grade: ${student.grade}</span>
            <div>
                <button class="editBtn" data-index="${index}">Edit</button>
                <button class="deleteBtn" data-index="${index}">Delete</button>
            </div>
        `;

        studentList.appendChild(li);
    });

    attachButtons();
}


// ================================
// ADD STUDENT
// ================================
addBtn.addEventListener("click", () => {

    const newStudent = {
        name: nameInput.value,
        age: Number(ageInput.value),
        grade: gradeInput.value
    };

    students.push(newStudent);
    saveToStorage();
    renderStudents();

    nameInput.value = "";
    ageInput.value = "";
    gradeInput.value = "";
});


// ================================
// SORT BY AGE
// ================================
sortBtn.addEventListener("click", () => {

    if (sortAsc) {
        students.sort((a, b) => a.age - b.age);
    } else {
        students.sort((a, b) => b.age - a.age);
    }

    sortAsc = !sortAsc;       // flip the sort type
    renderStudents();
});


// ================================
// SEARCH + FILTER EVENTS
// ================================
searchInput.addEventListener("input", renderStudents);
filterGrade.addEventListener("change", renderStudents);


// ================================
// HANDLE EDIT + DELETE BUTTONS
// ================================
function attachButtons() {

    // EDIT BUTTONS
    document.querySelectorAll(".editBtn").forEach(btn => {
        btn.addEventListener("click", () => {
            editIndex = btn.dataset.index;
            openEditModal(students[editIndex]);
        });
    });

    // DELETE BUTTONS
    document.querySelectorAll(".deleteBtn").forEach(btn => {
        btn.addEventListener("click", () => {
            const index = btn.dataset.index;
            students.splice(index, 1);
            saveToStorage();
            renderStudents();
        });
    });
}


// ================================
// OPEN EDIT MODAL
// ================================
function openEditModal(student) {
    modal.classList.remove("hidden");
    editName.value = student.name;
    editAge.value = student.age;
    editGrade.value = student.grade;
}


// ================================
// CLOSE EDIT MODAL
// ================================
cancelEditBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
});


// ================================
// SAVE EDITED STUDENT
// ================================
saveEditBtn.addEventListener("click", () => {

    students[editIndex] = {
        name: editName.value,
        age: Number(editAge.value),
        grade: editGrade.value
    };

    modal.classList.add("hidden");
    saveToStorage();
    renderStudents();
});


// ================================
// FIRST RENDER ON PAGE LOAD
// ================================
renderStudents();
