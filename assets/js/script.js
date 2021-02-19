var viewScoreEl = document.querySelector("h3");
var timerEl = document.querySelector("#timer");
var quizBox = document.querySelector(".container");

var time;
var timer;
var questions = [];
var questionNum;
var currentQuestion = 0;

// Initialize localStorage if needed
if (JSON.parse(localStorage.getItem("hiScores")) === null){
    localStorage.setItem("hiScores", JSON.stringify([]));
}

// Add question data to array
function loadQuestionData(question, answers, answerID){
    questions.push({
        question: question,
        possibleAnswers: answers,
        answer: answerID
    })
}

// Load questions into question data array
// Questions and answers taken from http://mcqspdfs.blogspot.com/2013/08/60-top-javascript-multiple-choice.html
loadQuestionData("What are variables used for in JavaScript programs?", ["Storing numbers, dates, or other values","Varying randomly","Causing high-school algebra flashbacks","None of the above"], 0);
loadQuestionData("Which of the following are capabilities of functions in JavaScript?", ["Return a value","Accept parameters and Return a value","Accept parameters","None of the above"], 2);
loadQuestionData("The ______ tag is an extension to HTML that can enclose any number of JavaScript statements.", ["<script>","<body>","<head>","<title>"], 0);
loadQuestionData("What is the correct syntax for referring to an external script called 'abc.js'?", ["<script href='abc.js'>","<script name='abc.js'>","<script src='abc.js'>","None of the above"], 2);
loadQuestionData("The _______ method of an Array object adds and/or removes elements from an array.", ["Reverse","Shift","Slice","Splice"], 3);

// Remove elements in current text box.
function clearElements() {
    while (quizBox.children.length !== 0) {
        quizBox.removeChild(quizBox.lastChild);
    }
}

// Clear current high scores list
function clearHiScores() {
    var emptyHiScores = [];
    localStorage.setItem("hiScores", JSON.stringify(emptyHiScores));
    loadHiScores();
}

// Show current high scores
function loadHiScores() {
    clearElements();

    var quizHiScoresEl = document.createElement("h2");
    var quizHiScoresListEl = document.createElement("ul");
    var quizGoBackBtnEl = document.createElement("button");
    var quizClearHiScoresBtnEl = document.createElement("button");

    var hiScores = JSON.parse(localStorage.getItem("hiScores"));
    
    quizHiScoresEl.textContent = "High Scores";

    quizGoBackBtnEl.textContent = "Go Back";
    quizGoBackBtnEl.addEventListener("click", quizPreStart);

    quizClearHiScoresBtnEl.textContent = "Clear High Scores";
    quizClearHiScoresBtnEl.addEventListener("click", clearHiScores);

    quizBox.appendChild(quizHiScoresEl);
    quizBox.appendChild(quizHiScoresListEl);

    for (var i = 0; i < hiScores.length; i++) {
        var hiScoreEl = document.createElement("li");
        hiScoreEl.textContent = hiScores[i].initials + " - " + hiScores[i].score;
        quizBox.lastChild.appendChild(hiScoreEl);
    }

    quizBox.appendChild(quizGoBackBtnEl);
    quizBox.appendChild(quizClearHiScoresBtnEl);
    
}

// Set new high score and add it to existing high scores
function setHiScores(event){
    event.preventDefault();
    var initials = document.getElementById("initials").value;
    console.log(initials);
    var hiScores = JSON.parse(localStorage.getItem("hiScores"));
    var newHiScore = {
        initials: initials,
        score: time
    }

    hiScores.push(newHiScore);
    localStorage.setItem("hiScores", JSON.stringify(hiScores));
    loadHiScores();
}

// Generate High Scores page
function loadHiScorePrompt() {
    clearElements();

    var quizDoneFormEl = document.createElement("form");
    var quizDoneEl = document.createElement("h2");
    var quizDoneScoreEl = document.createElement("p");
    var quizDoneLabelEl = document.createElement("label");
    var quizDoneFormTextEl = document.createElement("input");
    var quizDoneFormBtnEl = document.createElement("input");

    quizDoneEl.textContent = "All done!";
    quizDoneScoreEl.textContent = "Your score: " + time;

    quizDoneLabelEl.setAttribute("for", "initials");
    quizDoneLabelEl.textContent = "Enter your initials:";

    quizDoneFormTextEl.setAttribute("id", "initials");
    quizDoneFormTextEl.setAttribute("type", "text");
    quizDoneLabelEl.append(quizDoneFormTextEl);

    quizDoneFormBtnEl.setAttribute("type", "submit");
    quizDoneFormBtnEl.textContent = "Enter High Scores";
    quizDoneFormBtnEl.addEventListener("click", setHiScores);

    quizDoneFormEl.appendChild(quizDoneEl);
    quizDoneFormEl.appendChild(quizDoneScoreEl);
    quizDoneFormEl.appendChild(quizDoneLabelEl);
    quizDoneFormEl.appendChild(quizDoneFormBtnEl);

    quizBox.appendChild(quizDoneFormEl);
}

// End timer
function stopTimer() {
    clearInterval(timer);
    loadHiScorePrompt();
}

// Start timer
function startTimer() {
    // Set initial time
    time = 60;

    // Decrement time every second
    timer = setInterval( () => {
        timerEl.textContent = "Time: " + time;
        time--;

        if(time < 0) {
            timerEl.textContent = "Time: 0";
            time = 0;
            stopTimer();
        }
    }, 1000);
}

// Generate elements for quiz start screen
function quizPreStart() {

    clearElements();
    
    // Create text elements for the quiz title and description, adding text content
    var quizHeadEl = document.createElement("h2");
    quizHeadEl.textContent = "Coding Quiz Challenge";

    var quizDescEl = document.createElement("p");
    quizDescEl.textContent = "Try to answer the following code-related questions within the time limit. Keep in mind that incorrect answers will penalize your score/time by ten seconds!";

    // Create start button to begin quiz, including event handler
    var quizStartEl = document.createElement("button");
    quizStartEl.id = "btnStart";
    quizStartEl.textContent = "Start Quiz";
    quizStartEl.addEventListener("click", quizStart);

    // Store elements in array, then loop to add elements to page
    var quizStartEls = [quizHeadEl, quizDescEl, quizStartEl];

    for(var i = 0; i < quizStartEls.length; i++) {
        quizBox.appendChild(quizStartEls[i]);
    }
}
// Populate elements with current question data
function loadQuestion() {
    var questionEl = quizBox.children[0];
    var answerEls = quizBox.children[1].children;
    
    questionEl.textContent = questions[currentQuestion].question;

    for(var i = 0; i < answerEls.length; i++){
        answerEls[i].lastChild.textContent = questions[currentQuestion].possibleAnswers[i];
    }
}

// Check chosen answer and move to next question
function nextQuestion(event) {

    var chosenAnswer = event.target.getAttribute("id");
    var rightWrong = quizBox.querySelector("p");

    // Check answer and display message. If answer is wrong, reduce time by 10
    if (chosenAnswer != questions[currentQuestion].answer){
        rightWrong.textContent = "Wrong!";
        time -= 10;
    }
    else {
        rightWrong.textContent = "Correct!";
    }

    currentQuestion++;

    // If there are more questions, load next question
    if(currentQuestion < questions.length){
        loadQuestion();
    }
    // Else, prompt High Scores
    else {
        stopTimer();
    }
}

// Create elements for question and answers
function createQuestionEls(){
    var questionEl = document.createElement("h2");
    var answersEl = document.createElement("ol");
    var rightOrWrong = document.createElement("p");
    rightOrWrong.setAttribute("id", "rightWrongText");

    quizBox.appendChild(questionEl);
    quizBox.appendChild(answersEl);

    for (var i = 0; i < 4; i++){i
        var answersLiEl = document.createElement("li");
        var answerBtnEl = document.createElement("button");
        answerBtnEl.setAttribute("id", i);
        answerBtnEl.addEventListener("click", nextQuestion);
        answersLiEl.appendChild(answerBtnEl);
        // answersLiEl.innerHTML = "<button type='button' class='answer' id='" + i + "'></button>";
        quizBox.lastChild.appendChild(answersLiEl);
    }

    quizBox.appendChild(rightOrWrong);
}

// Start the timer and load the first question
function quizStart () {
    currentQuestion = 0;

    clearElements();
    startTimer();

    createQuestionEls();
    loadQuestion();
}


quizPreStart();

document.querySelector("h3").addEventListener("click", loadHiScores);