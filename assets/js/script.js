var viewScoreEl = document.querySelector("h3");
var timerEl = document.querySelector("#timer");
var quizBox = document.querySelector(".container");

var time;
var timer;

// Remove elements in current text box.
function clearElements() {
    while (quizBox.children.length !== 0) {
        quizBox.removeChild(quizBox.lastChild);
    }
}

// Start timer
function startTimer() {
    // Set initial time
    time = 60;

    // Decrement time every second
    timer = setInterval( () => {
        timerEl.textContent = "Time: " + time;
        time--;
    }, 1000);
}

// End timer
function stopTimer() {
    clearInterval(timer);
}

// Generate elements for quiz start screen
function quizPreStart() {

    clearElements();
    
    // Create text elements for the quiz title and description, adding text content
    var quizHeadEl = document.createElement("h2");
    quizHeadEl.textContent = "Coding Quiz Challenge";

    var quizDescEl = document.createElement("p");
    quizDescEl.textContent = "Try to answer the following code-related questions within the time limit. Keep in mind that incorrect answers will penalize your score/time by ten seconds!";

    // Create start button to begin quiz
    var quizStartEl = document.createElement("button");
    quizStartEl.id = "btnStart";
    quizStartEl.textContent = "Start Quiz";

    // Store elements in array, then loop to add elements to page
    var quizStartEls = [quizHeadEl, quizDescEl, quizStartEl];

    for(var i = 0; i < quizStartEls.length; i++) {
        quizBox.appendChild(quizStartEls[i]);
    }
}

function quizStart () {
    console.log("Quiz started");
}

quizPreStart();

document.getElementById("btnStart").addEventListener("click", quizStart);