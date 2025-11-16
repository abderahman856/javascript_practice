// ================================
// SELECT ELEMENTS
// ================================
const nameInput = document.getElementById('nameInput');
const ageInput = document.getElementById('ageInput');
const gradeInput = document.getElementById('gradeInput');

const addBtn = document.getElementById('addBtn');
const searchInput = document.getElementById('searchInput');
const filterGrade = document.getElementById('filterGrade');

const sortBtn = document.getElementById('sortBtn');
const studentList = document.getElementById('studentList');

const modal = document.getElementById('modal');
const editName = document.getElementById('editName');
const editAge = document.getElementById('editAge');
const editGrade = document.getElementById('editGrade');
const saveEditBtn = document.getElementById('saveEditBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');

let students = JSON.parse(localStorage.getItem("studentsData")) || [];
let sortAsc = true;
let editIndex = null;

