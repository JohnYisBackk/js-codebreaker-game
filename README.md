# 🔐 Codebreaker PRO

An interactive code-breaking game built with HTML, CSS and Vanilla JavaScript.

Crack a secret four-digit code using logic, progressive digit locking and smart feedback. Correctly positioned digits stay locked, helping you solve the remaining positions before running out of attempts.

## 🚀 Live Demo

🎮 [Play Codebreaker PRO](https://johnyisbackk.github.io/js-codebreaker-game/)

## 📸 Preview

![Codebreaker PRO Preview](/preview.png)

## ✨ Features

- 🔐 Randomly generated 4-digit secret codes
- 🔢 Unique digits from 0 to 9
- 🔒 Progressive digit locking
- ✅ Correct digits remain fixed in their positions
- 🧠 Smart feedback after every guess
- 🎯 Correct position and correct digit detection
- ⚙️ Three difficulty levels
- ⌨️ Physical keyboard support
- 🔢 Interactive numeric keypad
- 📝 Detailed guess history
- 🟢 Visual feedback and colored indicators
- 🏆 Best score tracking
- 🔥 Consecutive win streak tracking
- 📊 Games won and remaining attempts
- 💾 LocalStorage statistics persistence
- 🔄 New game and clear guess functionality
- 📱 Responsive user interface
- 🌙 Modern dark-themed design

## 🎮 Difficulty Levels

| Difficulty | Maximum Attempts | Code Length |
| ---------- | ---------------- | ----------- |
| Classic    | 10               | 4           |
| Medium     | 7                | 4           |
| Hard       | 5                | 4           |

## 🕹️ How to Play

1. Select a difficulty level.
2. Enter four unique digits using the keyboard or numeric keypad.
3. Click **Submit Guess**.
4. Correct digits in the correct positions become locked.
5. Incorrect positions are cleared for the next attempt.
6. Use the feedback and guess history to improve your next guess.
7. Unlock all four positions before running out of attempts.

### Example

Secret code: `4729`

First guess: `4286`

The digit `4` is correctly positioned and becomes locked.

Second guess: `4736`

The digit `7` is now also locked.

Continue until all four positions are correct.

## 🛠️ Built With

- HTML5
- CSS3
- Vanilla JavaScript (ES6+)
- LocalStorage API
- Lucide Icons

## 🧠 JavaScript Concepts Practiced

This project demonstrates:

- DOM selection and manipulation
- Event listeners and event handling
- Array methods: `map()`, `find()`, `filter()`, `forEach()`
- `Set` for duplicate detection
- Conditional statements
- Loops and functions
- Objects and application state
- Dynamic element creation
- Form input validation
- CSS class manipulation
- LocalStorage and JSON
- Game logic and state management

## 📂 Project Structure

```text
codebreaker-pro/
├── index.html
├── style.css
├── script.js
├── preview.png
├── README.md
└── LICENSE
```

## ⚙️ Getting Started

1. Clone the repository:

```bash
git clone https://github.com/JohnyIsBackk/codebreaker-pro.git
```

2. Open the project folder.

3. Open `index.html` in your browser or use Live Server in VS Code.

No frameworks, build tools or installation required.

## 🚧 Future Improvements

- Optional sound effects
- Additional game statistics
- Custom game settings
- Accessibility improvements
- More difficulty customization

## 👨‍💻 Author

**Samuel Jahn**

Frontend Developer

🌐 Portfolio: [samueljahn.sk](https://samueljahn.sk)

💻 GitHub: [JohnyIsBackk](https://github.com/JohnyIsBackk)

## 📄 License

This project is licensed under the MIT License.
