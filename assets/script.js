const startButton = document.getElementById('start-btn')
const questionContainerEl = document.getElementById('question-container')
const questionEl = document.getElementById('question')
const answerButtonsEl = document.getElementById('answer-buttons')
const nextButton = document.getElementById('next-btn')
const saveHighScoreBtn = document.getElementById('high-score')
const userName = document.getElementById('username')
const currentScoreText = document.getElementById('score')
const timeEl = document.getElementById('timer-value')
const highScoreEl = document.getElementById('high-score')
const closeHighScoreEl = document.getElementById('close-high-score')
const highScoreList = document.getElementById('highscore')
const scoreForm = document.getElementById('form')
const showHighScore = document.getElementById('show-high-score')

let score = 0
let shuffledQuestions, currentQuestionIndex

startButton.addEventListener('click', startGame)
nextButton.addEventListener('click', () => {
    currentQuestionIndex++
    const answerButtons = answerButtonsEl.children
    while (answerButtons.length > 0) {
        answerButtons [0].remove()
    }
    setNextQuestion()
    startTimer()
})

function startGame() {
    scoreForm.classList.add('hide')
    startButton.classList.add('hide')
    questionContainerEl.classList.remove('hide')
    shuffledQuestions = questions.sort(() => Math.random() - .5)
    currentQuestionIndex = 0
    questionContainerEl.classList.remove('hide')
    while (answerButtonsEl.firstChild) {
        answerButtonsEl.removeChild(answerButtonsEl.firstChild)
    }
    setNextQuestion()
    startTimer()
    

}
function setNextQuestion() {
    showQuestion(shuffledQuestions[currentQuestionIndex])
}
function showQuestion(question) {
    questionEl.innerText = question.question
    question.answers.forEach(answer => {
        const button = document.createElement('button')
        button.innerText = answer.text
        button.classList.add('btn')
        if (answer.correct) {
            button.dataset.correct = answer.correct
        }
        button.addEventListener('click', selectAnswer)
        answerButtonsEl.appendChild(button)
    })
}
function resetState() {
    nextButton.classList.add('hide')
    while (answerButtonsEl.firstChild) {
        answerButtonsEl.removeChild(answerButtonsEl.firstChild)
    }
}

function selectAnswer(e) {
    const selectButton = e.target
    const correct = selectButton.dataset.correct
    setStatusClass(document.body, correct)
    if (correct && secondsLeft>0) {
        addToScore()
    }
    if (shuffledQuestions.length > currentQuestionIndex + 1) {
        Array.from(answerButtonsEl.children).forEach(button => {
            setStatusClass(button, button.dataset.correct)
        })
        nextButton.classList.remove('hide')
    } else {
        startButton.innerText = 'Restart'
        startButton.classList.remove('hide')
        nextButton.classList.add('hide')
        scoreForm.classList.remove('hide')
        
    }
    clearInterval(clock)


}
function setStatusClass(element, correct) {
    clearStatusClass(element)
    if (correct) {
        element.classList.add('correct')
    } else {
        element.classList.add('wrong')
    }
}
function clearStatusClass(element) {
    element.classList.remove('correct')
    element.classList.remove('wrong')
}


function getHighScores(e) {
    const highScoreList = JSON.parse(window.localStorage.getItem('high-scores'))
   
    return Array.isArray(highScoreList) ? highScoreList : []
}
function setHighScore(list) {
    window.localStorage.setItem('high-scores', JSON.stringify(list))
}

function addHighScore(highScore) {
    const newScore = {score:Number(currentScoreText.innerText), name: userName.value}
    const list = getHighScores()
    list.push(newScore)
    list.sort((a, b) => a.score - b.score)
    setHighScore(list)
    
    const elementList = []
    for (const score of list) {
        const listItem = document.createElement("li")
        listItem.innerText = `${score.name}: ${score.score}`
        listItem.classList.add('highScore')
        elementList.push(listItem)
    }
    highScoreList.replaceChildren(...elementList)
    
    ClearScore()
}

function addToScore() {
    let currentScore = currentScoreText.innerText
    currentScore = Number(currentScore)
    currentScore++
    currentScoreText.innerText = currentScore

}
saveHighScoreBtn.addEventListener('click', e => {
    const userNameText = userName.value
    addHighScore({
        userName: userNameText,
        score: Number(currentScoreText.innerText)
    })
    userName.value = ''
    score = 0
    showHighScores
})

function ClearScore() {
    currentScoreText.innerText = 0
}

function showHighScores() {
    
    highScoreList.innerHTML = getHighScores()
        .map((score) => `<li>${score.score} - ${score.name}</li>`)
        .join('')
    
}


let secondsLeft = 10;
let clock
    
function countdown() {
    secondsLeft--;
    timeEl.textContent = secondsLeft
    if (secondsLeft <= 0) {
        console.log(`${typeof secondsLeft}${secondsLeft}`)
        
        stopTimer()
        Array.from(answerButtonsEl.children).forEach(button => {
            setStatusClass(button, button.dataset.correct)
        })
        if (shuffledQuestions.length > currentQuestionIndex + 1) {
            nextButton.classList.remove('hide')
        } else {
            startButton.innerText = 'Restart'
            startButton.classList.remove('hide')
        }
        
    }
}

function startTimer() {
    secondsLeft = 11
    clock = setInterval(countdown, 1000)
}
function stopTimer() {
    clearInterval(clock)
    console.log("here", clock)
}

let questions = [
    {
        question: "Which of these is NOT a JavaScript data type?",
        answers: [
            { text: 'Number', correct: false },
            { text: 'String', correct: false },
            { text: 'Array', correct: true },
            { text: 'Boolean', correct: false }
        ]
    },
    {
        question: "What is 'this' keyword in JavaScript?",
        answers: [
            { text: 'The window', correct: false },
            { text: 'The object from where it was called', correct: true },
            { text: 'The Cursor', correct: false },
            { text: 'Your computer', correct: false }
        ]
    },
    {
        question: "What is the === operator?",
        answers: [
            { text: 'Returns true when two operands have the same value', correct: true },
            { text: 'One operand has the same value', correct: false },
            { text: 'Returns False,', correct: false },
            { text: 'Always returns true', correct: false }
        ]
    },
    {
        question: "What is NOT a looping structure for JavaScript?",
        answers: [
            { text: 'For', correct: false },
            { text: 'While', correct: false },
            { text: 'Do-while', correct: false },
            { text: 'Do-later', correct: true }
        ]
    },
    {
        question: "What is called variable typing in JavaScript?",
        answers: [
            { text: 'i is 0', correct: false },
            { text: '0', correct: false },
            { text: 'i = 0', correct: true },
            { text: 'You are a variable', correct: false }
        ]
    },
    {
        question: "What is 'NULL'?",
        answers: [
            { text: 'Never Undulate Living Lizards', correct: false },
            { text: 'No value/No object', correct: true },
            { text: '0', correct: false },
            { text: 'Nothing', correct: false }
        ]
    },
    {
        question: "What is not a pop up window in JavaScript?",
        answers: [
            { text: 'Alert', correct: false },
            { text: 'Confirm', correct: false },
            { text: 'Timer', correct: true },
            { text: 'Prompt', correct: false }
        ]
    },
    
    {
        question: "What is NOT a boolean operator ?",
        answers: [
            { text: 'And (&&)', correct: false },
            { text: 'Or (||)', correct: false },
            { text: 'Not (!)', correct: false },
            { text: 'Maybe (:)', correct: true }
        ]
    },
    {
        question: "What does DOM stand for?",
        answers: [
            { text: `Don't Overstimulate Me`, correct: false },
            { text: `Dogs On Migration`, correct: false },
            { text: 'Digital Operating Method', correct: false },
            { text: 'Document Object Model', correct: true }
        ]
    },
    {
        question: "What variables can NOT be reassigned in JavaScript?",
        answers: [
            { text: 'Const', correct: true },
            { text: 'Var', correct: false },
            { text: 'Let', correct: false },
            { text: 'None', correct: false }
        ]
    },



]