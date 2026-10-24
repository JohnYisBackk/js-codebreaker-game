"use strict";

// ======================================================
// SELECT ELEMENTS
// ======================================================

// HEADER
const attemptsLeftValue = document.getElementById("attemptsLeftValue");
const currentStreakValue = document.getElementById("currentStreakValue");
const bestScoreValue = document.getElementById("bestScoreValue");
const settingsBtn = document.getElementById("settingsBtn");

// DIFFICULTY
const difficultySelect = document.getElementById("difficultySelect");

// SECRET CODE
const secretCodeGrid = document.getElementById("secretCodeGrid");
const secretCodeDigits = document.querySelectorAll(".secret-code-digit");

// GUESS INPUTS
const guessInputGrid = document.getElementById("guessInputGrid");
const guessDigits = document.querySelectorAll(".guess-digit");

// FEEDBACK
const feedbackLegend = document.querySelector(".feedback-legend");

// GAME ACTIONS
const submitGuessBtn = document.getElementById("submitGuessBtn");
const clearGuessBtn = document.getElementById("clearGuessBtn");
const newGameBtn = document.getElementById("newGameBtn");
const gameMessage = document.getElementById("gameMessage");

// NUMERIC KEYPAD
const keypadButtons = document.querySelectorAll(".keypad-btn");

// GUESS HISTORY
const historyCount = document.getElementById("historyCount");
const historyList = document.getElementById("historyList");

// GAME STATS
const gameAttemptsLeftValue = document.getElementById("gameAttemptsLeftValue");
const gameBestScoreValue = document.getElementById("gameBestScoreValue");
const gamesWonValue = document.getElementById("gamesWonValue");
const currentStatusValue = document.getElementById("currentStatusValue");

// ======================================================
// DATA
// ======================================================

const difficultySettings = {
  classic: {
    maxAttempts: 10,
    codeLength: 4,
  },

  medium: {
    maxAttempts: 7,
    codeLength: 4,
  },

  hard: {
    maxAttempts: 5,
    codeLength: 4,
  },
};

const availableDigits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

// ======================================================
// STATE
// ======================================================

let secretCode = [];

let activeDifficulty = "classic";

let attempts = 0;

let history = [];

let gamesWon = 0;

let bestScore = null;

let currentStreak = 0;

let gameStatus = "playing";

let lockedPositions = [];

// ======================================================
// SAVE / LOAD DATA
// ======================================================

function saveData() {
  const gameStats = {
    gamesWon,
    bestScore,
    currentStreak,
  };

  localStorage.setItem("codebreakerGame", JSON.stringify(gameStats));
}

function loadData() {
  const storedData = localStorage.getItem("codebreakerGame");

  if (!storedData) return;

  try {
    const gameStats = JSON.parse(storedData);

    gamesWon = gameStats.gamesWon ?? 0;
    bestScore = gameStats.bestScore ?? null;
    currentStreak = gameStats.currentStreak ?? 0;
  } catch (error) {
    console.error("Failed to load game stats:", error);
  }
}

// ======================================================
// GENERATE SECRET CODE
// ======================================================

function generateSecretCode() {
  secretCode = [];

  const codeLength = difficultySettings[activeDifficulty].codeLength;

  while (secretCode.length < codeLength) {
    const randomIndex = Math.floor(Math.random() * availableDigits.length);

    const randomDigit = availableDigits[randomIndex];

    if (!secretCode.includes(randomDigit)) {
      secretCode.push(randomDigit);
    }
  }
}

// ======================================================
// GUESS INPUT MANAGEMENT
// ======================================================

function getCurrentGuess() {
  return Array.from(guessDigits).map((input) => input.value);
}

function getFirstEmptyInput() {
  return Array.from(guessDigits).find(
    (input, index) => !lockedPositions[index] && input.value === "",
  );
}

function addDigit(digit) {
  if (gameStatus !== "playing") return;

  if (!/^[0-9]$/.test(String(digit))) return;

  const emptyInput = getFirstEmptyInput();

  if (!emptyInput) return;

  // Prevent entering a digit already locked in another position.
  const lockedDigits = secretCode.filter((_, index) => lockedPositions[index]);

  if (lockedDigits.includes(Number(digit))) {
    showMessage("This digit is already locked!", "info");
    return;
  }

  emptyInput.value = String(digit);

  const nextInput = getFirstEmptyInput();

  if (nextInput) {
    nextInput.focus();
  }
}

function clearGuess() {
  guessDigits.forEach((input, index) => {
    if (!lockedPositions[index]) {
      input.value = "";
    }
  });
}

function updateLockedInputs() {
  guessDigits.forEach((input, index) => {
    const isLocked = lockedPositions[index] === true;

    input.readOnly = isLocked || gameStatus !== "playing";
    input.classList.toggle("locked", isLocked);

    if (isLocked) {
      input.value = String(secretCode[index]);
    }
  });
}

function lockCorrectDigits(guess) {
  let newlyLocked = 0;

  guess.forEach((digit, index) => {
    if (!lockedPositions[index] && Number(digit) === secretCode[index]) {
      lockedPositions[index] = true;
      newlyLocked++;
    }
  });

  updateLockedInputs();

  return newlyLocked;
}

// ======================================================
// VALIDATE GUESS
// ======================================================

function validateGuess() {
  const guess = getCurrentGuess();

  if (guess.includes("")) {
    showMessage("Please enter all 4 digits.", "info");
    return false;
  }

  if (guess.some((digit) => !/^[0-9]$/.test(digit))) {
    showMessage("Only digits from 0 to 9 are allowed.", "info");
    return false;
  }

  const uniqueDigits = new Set(guess);

  if (uniqueDigits.size < guess.length) {
    showMessage("All 4 digits must be unique.", "info");
    return false;
  }

  return true;
}

// ======================================================
// CHECK GUESS
// ======================================================

function checkGuess() {
  let correctPosition = 0;
  let correctDigit = 0;

  const guess = getCurrentGuess();

  for (let i = 0; i < secretCode.length; i++) {
    const digit = Number(guess[i]);

    if (secretCode[i] === digit) {
      correctPosition++;
    } else if (secretCode.includes(digit)) {
      correctDigit++;
    }
  }

  return {
    correctPosition,
    correctDigit,
  };
}

// ======================================================
// GAME MANAGEMENT
// ======================================================

function submitGuess() {
  if (gameStatus !== "playing") return;

  if (!validateGuess()) return;

  const guess = getCurrentGuess();
  const result = checkGuess();

  attempts++;

  const newlyLocked = lockCorrectDigits(guess);

  history.push({
    guess: [...guess],
    correctPosition: result.correctPosition,
    correctDigit: result.correctDigit,
    newlyLocked,
  });

  const maxAttempts = difficultySettings[activeDifficulty].maxAttempts;

  if (result.correctPosition === secretCode.length) {
    gameStatus = "won";
    gamesWon++;
    currentStreak++;

    if (bestScore === null || attempts < bestScore) {
      bestScore = attempts;
    }

    showMessage(
      `Congratulations! You cracked the code in ${attempts} attempts!`,
      "success",
    );
  } else if (attempts >= maxAttempts) {
    gameStatus = "lost";
    currentStreak = 0;

    showMessage(
      `Game over! The secret code was ${secretCode.join("")}.`,
      "game-over",
    );
  } else {
    const remaining = maxAttempts - attempts;

    showMessage(
      `${result.correctPosition}/4 positions locked. ` +
        `${result.correctDigit} correct digits in wrong positions. ` +
        `${newlyLocked} new ${newlyLocked === 1 ? "position" : "positions"} unlocked! ` +
        `${remaining} attempts remaining.`,
      newlyLocked > 0 ? "success" : "info",
    );
  }

  clearGuess();
  updateLockedInputs();

  saveData();

  renderGuessHistory();
  renderSecretCode();
  updateDashboard();
}

// ======================================================
// RENDER SECRET CODE
// ======================================================

function renderSecretCode() {
  secretCodeDigits.forEach((digit, index) => {
    if (gameStatus === "playing") {
      digit.textContent = "?";
    } else {
      digit.textContent = secretCode[index];
    }

    digit.classList.toggle("revealed", gameStatus !== "playing");
  });
}

// ======================================================
// RENDER GUESS HISTORY
// ======================================================

function renderGuessHistory() {
  historyList.innerHTML = "";

  historyCount.textContent = `${history.length} guesses`;

  if (history.length === 0) {
    historyList.innerHTML = `
      <div class="history-empty">
        <p>No guesses yet</p>
        <span>Your attempts will appear here.</span>
      </div>
    `;

    return;
  }

  history.forEach((item, index) => {
    // CREATE ROW
    const row = document.createElement("div");
    row.classList.add("history-row");

    // GUESS NUMBER
    const historyNumber = document.createElement("div");
    historyNumber.classList.add("history-number");
    historyNumber.textContent = index + 1;

    // GUESS DIGITS
    const historyGuess = document.createElement("div");
    historyGuess.classList.add("history-guess");

    item.guess.forEach((digit, digitIndex) => {
      const span = document.createElement("span");

      span.textContent = digit;

      // Mark correct positions within this historical guess.
      if (Number(digit) === secretCode[digitIndex]) {
        span.classList.add("correct");
      }

      historyGuess.append(span);
    });

    // CORRECT POSITION
    const correctPosition = document.createElement("div");
    correctPosition.classList.add("history-correct-position");
    correctPosition.textContent = item.correctPosition;

    // CORRECT DIGIT
    const correctDigit = document.createElement("div");
    correctDigit.classList.add("history-correct-digit");
    correctDigit.textContent = item.correctDigit;

    // RESULT
    const historyResult = document.createElement("div");
    historyResult.classList.add("history-result");

    const resultDot = document.createElement("span");
    resultDot.classList.add("result-dot");

    const resultText = document.createElement("span");

    if (item.correctPosition === secretCode.length) {
      resultText.textContent = "Won";
      historyResult.classList.add("won");
      resultDot.classList.add("green");
    } else if (gameStatus === "lost" && index === history.length - 1) {
      resultText.textContent = "Lost";
      historyResult.classList.add("lost");
    } else if (item.newlyLocked > 0) {
      resultText.textContent = "Locked";
      resultDot.classList.add("green");
    } else {
      resultText.textContent = "Checked";

      if (item.correctDigit > 0) {
        resultDot.classList.add("purple");
      }
    }

    historyResult.append(resultDot, resultText);

    // APPEND ELEMENTS
    row.append(
      historyNumber,
      historyGuess,
      correctPosition,
      correctDigit,
      historyResult,
    );

    // APPEND ROW
    historyList.append(row);
  });
}

// ======================================================
// UPDATE DASHBOARD
// ======================================================

function updateDashboard() {
  const maxAttempts = difficultySettings[activeDifficulty].maxAttempts;
  const attemptsLeft = maxAttempts - attempts;

  attemptsLeftValue.textContent = `${attemptsLeft}/${maxAttempts}`;
  gameAttemptsLeftValue.textContent = `${attemptsLeft}/${maxAttempts}`;

  currentStreakValue.textContent = currentStreak;

  const bestScoreText = bestScore === null ? "—" : `${bestScore} attempts`;

  bestScoreValue.textContent = bestScoreText;
  gameBestScoreValue.textContent = bestScoreText;

  gamesWonValue.textContent = gamesWon;

  if (gameStatus === "playing") {
    currentStatusValue.textContent = "In Progress";
  } else if (gameStatus === "won") {
    currentStatusValue.textContent = "Won";
  } else if (gameStatus === "lost") {
    currentStatusValue.textContent = "Lost";
  }
}

// ======================================================
// GAME MESSAGES
// ======================================================

function showMessage(message, type = "info") {
  gameMessage.textContent = message;

  gameMessage.classList.remove("success", "game-over", "info");

  if (type === "success") {
    gameMessage.classList.add("success");
  } else if (type === "game-over") {
    gameMessage.classList.add("game-over");
  } else {
    gameMessage.classList.add("info");
  }
}

// ======================================================
// RESET GAME
// ======================================================

function resetGame() {
  attempts = 0;
  history = [];
  gameStatus = "playing";

  lockedPositions = Array(difficultySettings[activeDifficulty].codeLength).fill(
    false,
  );

  guessDigits.forEach((input) => {
    input.value = "";
    input.readOnly = false;
    input.classList.remove("locked");
  });

  generateSecretCode();

  renderGuessHistory();
  renderSecretCode();
  updateDashboard();
  updateLockedInputs();

  showMessage("Enter your first guess to start cracking the code.");
}

// ======================================================
// EVENT LISTENERS
// ======================================================

// SUBMIT
submitGuessBtn.addEventListener("click", submitGuess);

// CLEAR
clearGuessBtn.addEventListener("click", clearGuess);

// NEW GAME
newGameBtn.addEventListener("click", resetGame);

// DIFFICULTY
difficultySelect.addEventListener("change", () => {
  activeDifficulty = difficultySelect.value;
  resetGame();
});

// NUMERIC KEYPAD
keypadButtons.forEach((key) => {
  key.addEventListener("click", () => {
    const digit = key.dataset.digit;
    addDigit(digit);
  });
});

// PHYSICAL KEYBOARD INPUTS
guessDigits.forEach((input, index) => {
  input.addEventListener("input", () => {
    if (gameStatus !== "playing" || lockedPositions[index]) {
      input.value = lockedPositions[index] ? String(secretCode[index]) : "";
      return;
    }

    // Keep only the last entered numeric digit.
    input.value = input.value.replace(/\D/g, "").slice(-1);

    // Prevent duplicates of already locked digits.
    const lockedDigits = secretCode.filter(
      (_, digitIndex) => lockedPositions[digitIndex],
    );

    if (lockedDigits.includes(Number(input.value)) && input.value !== "") {
      input.value = "";
      showMessage("This digit is already locked!", "info");
      return;
    }

    // Focus next available input.
    if (input.value !== "") {
      const nextInput = Array.from(guessDigits)
        .slice(index + 1)
        .find((digitInput, offset) => {
          const actualIndex = index + 1 + offset;

          return !lockedPositions[actualIndex] && digitInput.value === "";
        });

      if (nextInput) {
        nextInput.focus();
      }
    }
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      submitGuess();
    }
  });
});

// ======================================================
// INITIALIZE APP
// ======================================================

function initApp() {
  activeDifficulty = difficultySelect.value;

  loadData();
  resetGame();

  lucide.createIcons();
}

initApp();
