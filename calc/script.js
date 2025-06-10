// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    let display = document.getElementById('display');
    let historyList = document.getElementById('history-list');
    let currentInput = '0';
    let operator = null;
    let previousInput = null;
    let waitingForOperand = false;
    let lastExpression = '';

    // Sound effect (optional)
    function playClick() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (e) {
            // Fallback - no sound
        }
    }

    function updateDisplay() {
        display.value = currentInput;
    }

    function inputNumber(num) {
        playClick();
        if (waitingForOperand) {
            currentInput = num;
            waitingForOperand = false;
        } else {
            if (currentInput === '0') {
                currentInput = num;
            } else {
                currentInput += num;
            }
        }
        updateDisplay();
    }

    function inputDecimal() {
        playClick();
        if (waitingForOperand) {
            currentInput = '0.';
            waitingForOperand = false;
        } else if (currentInput.indexOf('.') === -1) {
            currentInput += '.';
        }
        updateDisplay();
    }

    function inputOperator(nextOperator) {
        playClick();
        const inputValue = parseFloat(currentInput);

        if (previousInput === null) {
            previousInput = inputValue;
        } else if (operator && !waitingForOperand) {
            const currentValue = previousInput || 0;
            const newValue = performCalculation(currentValue, inputValue, operator);

            if (newValue === 'Error') {
                currentInput = 'Error';
                display.classList.add('error');
                return;
            } else {
                currentInput = String(newValue);
                previousInput = newValue;
            }
            updateDisplay();
        }

        waitingForOperand = true;
        operator = nextOperator;

        // Update operator button appearance
        document.querySelectorAll('.btn-operator').forEach(btn => {
            btn.classList.remove('active');
        });
        event.currentTarget.classList.add('active');
    }

    function performCalculation(firstOperand, secondOperand, operator) {
        switch (operator) {
            case '+':
                return firstOperand + secondOperand;
            case '−':
                return firstOperand - secondOperand;
            case '×':
                return firstOperand * secondOperand;
            case '÷':
                if (secondOperand === 0) {
                    return 'Error';
                }
                return firstOperand / secondOperand;
            case '%':
                return firstOperand % secondOperand;
            default:
                return secondOperand;
        }
    }

    function calculate() {
        playClick();
        const inputValue = parseFloat(currentInput);

        if (previousInput !== null && operator && !waitingForOperand) {
            const expression = `${previousInput} ${operator} ${inputValue}`;
            const newValue = performCalculation(previousInput, inputValue, operator);

            if (newValue === 'Error') {
                currentInput = 'Error';
                display.classList.add('error');
            } else {
                currentInput = String(newValue);
                if (currentInput.includes('.') && currentInput.split('.')[1].length > 10) {
                    currentInput = parseFloat(currentInput).toPrecision(12);
                    currentInput = String(parseFloat(currentInput));
                }
                addToHistory(`${expression} = ${currentInput}`);
            }

            previousInput = null;
            operator = null;
            waitingForOperand = true;
            updateDisplay();

            document.querySelectorAll('.btn-operator').forEach(btn => {
                btn.classList.remove('active');
            });
        }
    }

    function addToHistory(entry) {
        const li = document.createElement('li');
        li.textContent = entry;
        historyList.prepend(li);

        if (historyList.children.length > 10) {
            historyList.removeChild(historyList.lastChild);
        }
    }

    function clearEntry() {
        playClick();
        currentInput = '0';
        updateDisplay();
        display.classList.remove('error');
    }

    function clearAll() {
        playClick();
        currentInput = '0';
        previousInput = null;
        operator = null;
        waitingForOperand = false;
        updateDisplay();
        display.classList.remove('error');

        document.querySelectorAll('.btn-operator').forEach(btn => {
            btn.classList.remove('active');
        });
    }

    // Make functions globally available for HTML onclick handlers
    window.inputNumber = inputNumber;
    window.inputDecimal = inputDecimal;
    window.inputOperator = inputOperator;
    window.calculate = calculate;
    window.clearEntry = clearEntry;
    window.clearAll = clearAll;

    // Theme toggle
    document.getElementById('toggle-theme').addEventListener('click', () => {
        playClick();
        document.body.classList.toggle('dark');
        const icon = document.getElementById('toggle-theme');
        icon.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
    });
    
    // Initialize the display
    updateDisplay();
});