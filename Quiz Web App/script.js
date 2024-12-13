let API_URL = "https://opentdb.com/api.php?amount=10&encode=url3986"

//Body wird referenziert und alle nötigen Elemente fürs Intro erstellt
let name = localStorage.getItem("name");
//Alternative - speichert namen nur bis tab geschlossen wird - let name = sessionStorage.getItem("name");
const body = document.body
const intro = document.createElement("div")
const introHeading = document.createElement("h1")
const introText = document.createElement("p")
const introName = document.createElement("input")
const introBox = document.createElement("div")
const introButton = document.createElement("button")
const quiz = [];

//Attribute, Klasse und onClick werden hinzugefügt
introName.setAttribute("type", "text")
introButton.setAttribute("type", "button")
intro.classList.add("intro")
introButton.onclick = function () {
    saveName()
}
//Die erstellten divs werden zugewiesen
body.appendChild(intro)
intro.appendChild(introHeading)
intro.appendChild(introText)
intro.appendChild(introBox)
introBox.appendChild(introName)
introBox.appendChild(introButton)

//Texte werden eingefügt
if (name) {
    introHeading.innerText = "Welcome " + name
    saveName()
} else {
    introHeading.innerText = "Welcome"
}

introText.innerText = "Type in your Name to start..."
introButton.innerText = "I'm Ready"

//Name wird gespeichert und Loading Animation erstellt
function saveName() {
    if (name) {
        intro.classList.add("hidden")
        createGameEnviroment()
    } else {
        if (name === null || name === "") {
            name = "Guest"
        }

        name = introName.value
        localStorage.setItem("name", name)
        //sesscionStorage.setItem("name", name)
        intro.removeChild(introBox)
        introHeading.innerText = "Welcome " + name
        introText.innerText = "Loading"
        let timeOut = 0;
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                introText.innerText += "."
            }, timeOut + 500)
            timeOut = timeOut + 500;
        }
        setTimeout(() => {
            intro.classList.add("hidden")
            createGameEnviroment()
        }, 2000);
    }
}

function createGameEnviroment() {
//Begrüßung wird erstellt
    let greeting = document.createElement("h1")
    greeting.innerText = "Welcome " + name
    body.appendChild(greeting)
    greeting.id = "greeting"

//Game und Map Divs werden erstellt, zugewiesen und mit klassen versehen.

    const gameDiv = document.createElement("div")
    const mapDiv = document.createElement("div")
    gameDiv.id = "game"
    mapDiv.id = "map"
    body.appendChild(gameDiv)
    body.appendChild(mapDiv)

    //GameDiv mit einem Button versehen, Game beginnen
    const questionInt = document.createElement("input");
    questionInt.type = "number";
    questionInt.min = 1;
    questionInt.max = 9;
    questionInt.placeholder = "Anzahl der Fragen";
    questionInt.id = "questionCount";
    body.appendChild(questionInt);

    const difficulty = document.createElement("select")
    difficulty.id = "difficulty"
    const levels = ["easy", "medium", "hard"];
    levels.forEach(level => {
        let option = document.createElement("option");
        option.value = level;
        option.textContent = level.charAt(0).toUpperCase() + level.slice(1);
        difficulty.appendChild(option);
    });

    const startGame = document.createElement("button")
    startGame.id = "startGame"
    startGame.innerText = "Start Game"
    startGame.onclick = function () {
        getQuestions()
    }
    gameDiv.appendChild(questionInt)
    gameDiv.appendChild(difficulty)
    gameDiv.appendChild(startGame)

    function createMap() {
        //Map wird erstellt
        for (let i = 0; i < questionInt.value; i++) {
            let div = document.createElement("div")
            let text = document.createElement("p")
            mapDiv.appendChild(div)
            text.innerText = i + 1
            div.appendChild(text)
            div.addEventListener("click", (event) => {
                setActive(event.currentTarget);
            });
            div.classList.add("mapGrid")
        }
        document.querySelector(".mapGrid").click()
    }

    //Funktion wo die Map eins weiter springt, das derzeitige inaktiv und das nächste auf aktiv setzt
    function setActive(div) {
        document.querySelectorAll(".mapGrid.active").forEach(activeDiv => {
            activeDiv.classList.remove("active");
        });
        div.classList.add("active");
        let temp = div.textContent
        showQuestion(temp, div)
    }


    async function getQuestions() {
        const amount = parseInt(questionInt.value);
        const difficulty = document.getElementById("difficulty").value;

        const API_URL = `https://opentdb.com/api.php?amount=20&difficulty=${difficulty}&encode=url3986`;


        try {
            let response = await fetch(API_URL);
            if (!response.ok) throw new Error(`API Fehler: ${response.status}`);

            let data = await response.json();

            if (!data.results || data.results.length === 0) {
                alert("Keine Fragen verfügbar. Bitte versuche es später erneut.");
                return;
            }

            // Filtere Fragen (falls notwendig)
            let filteredResults = data.results.filter(question => question.type !== "boolean");

            // Überprüfen, ob genügend Fragen vorhanden sind
            if (filteredResults.length < amount) {
                alert("Nicht genügend Fragen verfügbar. Die Anzahl wird angepasst.");
            }

            // Schneide die Liste auf die gewünschte Anzahl zu
            let finalQuestions = filteredResults.slice(0, amount);

            // Quiz erstellen
            createQuiz(finalQuestions);
        } catch (error) {
            console.error("Fehler beim Abrufen der Fragen:", error);
            alert("Ein Fehler ist aufgetreten. Bitte versuche es später erneut.");
        }
    }

    function createQuiz(results) {
        quiz.length = 0; // Quiz zurücksetzen

        results.forEach(result => {
            let obj = {
                question: decodeURIComponent(result.question), // Frage dekodieren
                correctAnswer: decodeURIComponent(result.correct_answer), // Richtige Antwort dekodieren
                incorrectAnswers: result.incorrect_answers.map(answer => decodeURIComponent(answer)) // Falsche Antworten dekodieren
            };
            quiz.push(obj);
        });

        console.log("Erstelltes Quiz:", quiz);
        createMap();
    }
}


//Zeigt die Frage für ein bestimmtes Feld an an
function showQuestion(int, div) {
    //Referenziert das Spiel-Div, löscht den bisherigen Inhalt, erstellt ein neues Div mit ID für die Frage und fügt das neue Div dem Spiel hinzu
    let game = document.getElementById("game")
    game.innerHTML = ""
    let gameDiv = document.createElement("div")
    gameDiv.id = "gameDiv"
    game.appendChild(gameDiv)


    function showErrorMessage() {
        //Fehlermeldung
        let error = document.createElement("p")
        error.id = "error"
        error.innerText = "Falsche Antwort. Versuchs erneut."
        error.classList.add("error_hidden")
        gameDiv.appendChild(error)
    }

    showErrorMessage();

    function generateQuestionAndAnswer() {
        //Erstellt das Frage Element
        let question = document.createElement("h2")
        gameDiv.appendChild(question)

        //Holt die Frage und setzt den Fragen text
        let temp = quiz[(--int)]
        question.innerText = temp.question

        //Kopiert die falschen Antworten und fügt die richtige Antwort hinzu
        let decisionsArr = [...temp.incorrectAnswers]
        decisionsArr.push(temp.correctAnswer)

        //Mischt die Antworten
        decisionsArr = decisionsArr.sort(() => Math.random() - 0.5)

        //Erstellt eine Liste für die Antworten
        let decisions = document.createElement("ul")

        //Erstellt ein Listen und Input Element, setzt auf Radio, setzt die ID und setzt den Namen
        for (let i = 0; i < 4; i++) {
            let decisionLi = document.createElement("li")
            let decision = document.createElement("input")
            decision.setAttribute("type", "radio")
            decision.setAttribute("id", `question-${int}-option-${i}`)
            decision.setAttribute("name", "decision")

            //Erstellt und verknüpft ein Label, mit dem Input und setzt den Antworttext
            let label = document.createElement("label")
            label.setAttribute("for", `question-${int}-option-${i}`)
            label.innerText = decisionsArr[i]

            //Fügt den Input, Label und Antwort zur Liste hinzu
            decisionLi.appendChild(decision)
            decisionLi.appendChild(label)
            decisions.appendChild(decisionLi)
        }
        //Fügt die Liste dem Div hinzu
        gameDiv.appendChild(decisions)
    }

    generateQuestionAndAnswer();

    //Erstellt den Control Button
    let controlButton = document.createElement("button")
    controlButton.setAttribute("type", "button")
    controlButton.setAttribute("id", `control`)
    controlButton.innerText = "Check Answer"
    controlButton.addEventListener("click", () => {
        control(div)
    })
    gameDiv.appendChild(controlButton)
}

//Überprüft die ausgewählte Antwort
function control(div) {
    let selected = document.querySelector('input[name="decision"]:checked')

    if (!selected) {
        alert("Bitte wähle eine Antwort aus, bevor du fortfährst!");
        return;
    }


    //Teilt die ID in Teile und holt den Frage Index
    let idParts = selected.id.split("-")
    let questionIndex = parseInt(idParts[1])
    // let answerIndex = parseInt(idParts[3])

    //Holt die richtige Antwort
    let answer = quiz[questionIndex].correctAnswer
    let label = document.querySelector(`label[for="${selected.id}"]`).innerText;

    //Überprüft ob die Antwort korrekt ist
    if (label === answer) {
        correctAnswer(div)
    } else {
        let error = document.getElementById("error")
        error.classList.remove("error_hidden")
        error.classList.add("error")
    }
}

//Markiert die aktuelle Antwort als korrekt und geht zur nächsten Frage
function correctAnswer(div) {
    div.classList.remove("mapGrid", "active")
    div.classList.add("correctAnswer")
    let next = document.querySelector(".mapGrid");
    //Überprüft ob keine Fragen mehr übrig sind
    if (next) {
        next.click();
    } else {
        winGame()
    }
}

//Zeigt den Gewinnbildschirm an
function winGame() {
    //Löscht alles vom Bildschirm
    document.getElementById("greeting").innerHTML = ""
    let game = document.getElementById("game")
    game.innerText = ""
    document.getElementById("map").innerHTML = ""

    //Überschrift
    let winHeading = document.createElement("h2")
    winHeading.innerText = "Glückwunsch " + name
    game.appendChild(winHeading)

    //Text
    let winText = document.createElement("p")
    winText.innerText = "Möchtest du noch eine runde spielen?"
    game.appendChild(winText)

    //Reset Button
    const reset = document.createElement("button")
    reset.innerText = "Reset"
    reset.onclick = function () {
        document.body.innerHTML = ""
        createGameEnviroment()
    }
    game.appendChild(reset)
}