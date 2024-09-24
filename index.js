import { quizData } from './data.js';

//DOM Elements
const cardEl = document.querySelector('.card');
const questionContainer = document.getElementById('question-wrapper');
const optionsContainer = document.getElementById('options-wrapper');
const quizForm = document.getElementById('quiz-form');
const scoreElement = document.getElementById('score');
const totalQuestionsElement = document.getElementById('total-questions');
const submitButton = quizForm.querySelector('.btn-submit');

//State Variables
let currentQuestionIndex = 0;
let score = 0;

//Functions
function initializeQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    totalQuestionsElement.textContent = quizData.length;
    cardEl.classList.remove('completed');
    updateScore();
    renderQuestion(quizData[currentQuestionIndex]);
    submitButton.textContent = 'Submit';
}

function updateScore() {
    scoreElement.textContent = score;
}

function renderQuestion(item) {
    questionContainer.innerHTML = `
        <p class="lg ta-cen question-el"><span class="bold">Question:</span> ${item.question}</p>
    `;

    optionsContainer.innerHTML = item.options.map(optionItem => 
        `<label class="option-item">
            <input class="visually-hidden" type="radio" name="quiz-${item.id}" id="option-${optionItem.id}" value="${optionItem.id}" />
            ${optionItem.option}
        </label>`
    ).join('');
}

function showFeedback(selectedId, correctId) {
    const labels = optionsContainer.querySelectorAll('.option-item');
    labels.forEach(label => {
        const input = label.querySelector('input');
        if (input.value === selectedId) {
            label.classList.add(selectedId === correctId ? 'answer-correct' : 'answer-incorrect');
        } else if (input.value === correctId) {
            label.classList.add('answer-correct');
        }
    });

    if (selectedId === correctId) {
        score++;
        updateScore();
    }
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.length) {
        renderQuestion(quizData[currentQuestionIndex]);
    } else {
        endQuiz();
    }
}

function endQuiz() {
    cardEl.classList.add('completed');
    questionContainer.innerHTML = '<p class="ta-cen">Quiz completed!</p>';
    optionsContainer.innerHTML = `<p class="ta-cen">Your final score: ${score}/${quizData.length}</p>`;
    submitButton.textContent = 'Restart';
    submitButton.removeEventListener('click', handleSubmit);
    submitButton.addEventListener('click', restartQuiz);
}

function restartQuiz() {
    submitButton.removeEventListener('click', restartQuiz);
    submitButton.addEventListener('click', handleSubmit);
    initializeQuiz();
}

function handleSubmit(e) {
    e.preventDefault();
    const selectedOption = quizForm.querySelector('input[type="radio"]:checked');
    if (selectedOption) {
        const currentQuestion = quizData[currentQuestionIndex];
        showFeedback(selectedOption.value, currentQuestion.answer.toString());
        setTimeout(() => {
            nextQuestion();
        }, 2000); // Wait 2 seconds before moving to the next question
    }
}

// Event Listeners
submitButton.addEventListener('click', handleSubmit);

// Start the quiz
initializeQuiz();