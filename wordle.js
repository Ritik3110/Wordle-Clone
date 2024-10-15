const guesses = document.querySelectorAll(".guess");
const letters = document.querySelectorAll(".letter");
let pointer = 0;
let guess = 1;
let currentAns = "";
let todayAns = "";

init();

async function init() {
    let isLoading = true;
    setLoading(isLoading)
    const res = await fetch("https://words.dev-apis.com/word-of-the-day");
    const { word } = await res.json();
    todayAns = word.toUpperCase();
    isLoading = false;
    setLoading(isLoading)
    console.log(todayAns)
    document.addEventListener('keydown', (event) => {
        const press = event.key;
        if (press === "Enter")
            commit();
        else if (press === "Backspace") {
            backspace();
        }
        else if (isLetter(press)) {
            display(press.toUpperCase())
        }
    })
}

function isLetter(inp) {
    return /^[a-zA-Z]$/.test(inp);
}

function display(char) {
    if (pointer < guess * 5 && pointer >= (guess - 1) * 5) {
        letters[pointer].innerText = char;
        pointer++;
        currentAns += char
    }
}

function backspace() {
    if (pointer <= guess * 5 && pointer > (guess - 1) * 5) {
        pointer--;
        letters[pointer].innerText = "";
    }
    currentAns = currentAns.slice(0, currentAns.length - 1)
}

async function commit() {
    if (currentAns.length != 5) {
        wrong();
    }
    else {
        Validate(currentAns);
    }
}

function wrong() {
    guesses[guess - 1].classList.add('shake');
    setTimeout(() => {
        guesses[guess - 1].classList.remove('shake');
    }, 500);
}

async function Validate(ans) {
    let isLoading = true;
    setLoading(isLoading)
    const res = await fetch("https://words.dev-apis.com/validate-word", {
        method: "POST",
        body: JSON.stringify({ word: ans }),
    });
    const { validWord } = await res.json();
    console.log(JSON.stringify({ word: ans }))
    isLoading = false;
    setLoading(isLoading)
    if (validWord) {
        check(ans)
        guess++;
        currentAns = ""
    }
    else
        wrong()
    if (guess == 7) {
        document.querySelector(".res").innerText = "You Lose"
        document.querySelector(".res").classList.toggle("hidden", false);
    }
}

function check(ans) {
    let tAns = todayAns;
    let usedIndices = [];
    let correct = 0;
    for (let i = 0; i < 5; i++)
        if (ans[i] === tAns[i]) {
            letters[(guess - 1) * 5 + i].classList.add("correct");
            usedIndices.push(i);
            correct++;
        }
    if (correct == 5) {
        document.querySelector(".res").innerText = "You Win"
        document.querySelector(".res").classList.toggle("hidden", false);
        return;
    }
    for (let i = 0; i < 5; i++) {
        if (!letters[(guess - 1) * 5 + i].classList.contains("correct")) {
            let found = false;
            for (let j = 0; j < 5; j++) {
                if (ans[i] === tAns[j] && !usedIndices.includes(j)) {
                    letters[(guess - 1) * 5 + i].classList.add("pseudo");
                    usedIndices.push(j);
                    found = true;
                    break;
                }
            }
            if (!found) {
                letters[(guess - 1) * 5 + i].classList.add("invalid");
            }
        }
    }
}

function setLoading(isLoading) {
    document.querySelector(".game-box").classList.toggle("op", isLoading);
    document.querySelector(".loading").classList.toggle("hidden", !isLoading);
}
