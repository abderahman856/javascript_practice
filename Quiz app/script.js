const quizBox = document.getElementById("quiz-box");
const question = document.getElementById("question");
const answers = document.getElementById("answers");
const nextBtn = document.getElementById("next-btn");

const resultBox = document.getElementById("result-box");
const score = document.getElementById("score");
const restartBtn = document.getElementById("restart-btn");

let currentIndex = 0;
let userScore = 0;

const questions = [
  {
    question: "What does HTML stand for?",
    answers: [
      "Hyper Trainer Marking Language",
      "Hyper Text Markup Language",
      "High Text Machine Language",
      "None",
    ],
    correct: 1,
  },
  {
    question: "What does CSS control?",
    answers: ["Structure", "Style", "Database", "Server"],
    correct: 1,
  },
  {
    question: "Which one is a JavaScript data type?",
    answers: ["Boolean", "Selector", "Router", "Header"],
    correct: 0,
  },
];

function loadQuestion() {
  const q = questions[currentIndex];

  question.textContent = q.question;
  answers.innerHTML = "";
  nextBtn.style.display = "none";

  q.answers.forEach((ans, i) => {
    const btn = document.createElement("button");
    btn.textContent = ans;
    btn.classList.add("answer-btn");
    btn.dataset.index = i;
    answers.appendChild(btn);

    btn.addEventListener("click", () => selectAnswer(btn, i, q.correct));
  });
}

function selectAnswer(button, index, correctIndex) {
  const buttons = document.querySelectorAll(".answer-btn");

  buttons.forEach((btn, i) => {
    btn.disabled = true;
    if (i === correctIndex) btn.classList.add("correct");
  });

  if (index === correctIndex) {
    button.classList.add("correct");
    userScore++;
  } else {
    button.classList.add("wrong");
  }

  nextBtn.style.display = "block";
}

nextBtn.addEventListener("click", () => {
  currentIndex++;

  if (currentIndex < questions.length) {
    loadQuestion();
  } else {
    showResults();
  }
});

function showResults() {
  quizBox.style.display = "none";
  resultBox.style.display = "block";
  score.textContent = `You scored ${userScore} out of ${questions.length}`;
}

restartBtn.addEventListener("click", () => {
  currentIndex = 0;
  userScore = 0;

  resultBox.style.display = "none";
  quizBox.style.display = "block";

  loadQuestion();
});

loadQuestion();
