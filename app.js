// --------------------------------------- VARIABLES & OBJECTS --------------------------------------- //

// ----------- Toggles ----------- //
const darkBlueThemeToggle = document.querySelector('.calc__toggle-btn--dark-blue');
const lightThemeToggle = document.querySelector('.calc__toggle-btn--light');
const violetThemeToggle = document.querySelector('.calc__toggle-btn--violet');
const toggleController = document.querySelector('.calc__toggle-controller');
// ----------------------------- // 

// ----------- OUTPUT VALUES ----------- //
const accumulatedOutput = document.querySelector('.calc__output--accumulated');
const currentOutput = document.querySelector('.calc__output--current');
// ------------------------------------ //

// ----------- INPUT KEYS ----------- //
const numberKeys = document.querySelectorAll('.calc__input-key[name="number"]');
const operatorKeys = document.querySelectorAll('.calc__input-key[name="operator"]');
const resetKey = document.querySelector('.calc__input-key[name="reset"]');
const deleteKey = document.querySelector('.calc__input-key[name="delete"]');
const equalsKey = document.querySelector('.calc__input-key[name="="]');
// ---------------------------------- //


// -------------------------------------------------------------------------------------------------- //



// --------------------------------------- FUNCTIONS --------------------------------------- //
const handleNumberInput = (event) => {
    const digit = event.target.value;

    if (isCurrentOutputEmpty()) {
        currentOutput.textContent = digit;
    } else {
        let numberStr = currentOutput.textContent.replace(/,/g, ''); // Remove commas from the current output
        numberStr += digit; // Concatenate the new digit
        currentOutput.textContent = Number(numberStr).toLocaleString('en-US'); // Add commas to the current output
    }
}

const handleOperatorInput = (event) => {
    let operator = event.target.value;

    switch (operator) {
        case '-':
            if (isCurrentOutputEmpty()) {
                currentOutput.textContent = operator;
                return;
            }
        case '+': case 'x': case '/': case '-':
            if (isCurrentOutputEmpty()) {
                return;
            }
            if (isAccumulatedOutputEmpty()) {
                accumulatedOutput.textContent = currentOutput.textContent + ` ${operator} `;
                currentOutput.textContent = '';
                return;
            }
            const accumulatedNumberStr = accumulatedOutput.textContent.replace(/,/g, ''); // Remove commas from the accumulated output
            const currentNumberStr = currentOutput.textContent.replace(/,/g, ''); // Remove commas from the current output
            const expressionStr = (accumulatedNumberStr + currentNumberStr).replace('x', '*'); // Concatenate the new value and replace 'x' with '*' (if it exists)
            const updatedAccumulatedNumber = new Function('return ' + expressionStr)(); // Evaluate the expression and return the result as a number (Function constructor is safer than eval()
            accumulatedOutput.textContent = updatedAccumulatedNumber.toLocaleString('en-US') + ` ${operator} `; // Add commas and operator to the accumulated output
            currentOutput.textContent = '';
            break;
        case '.':
            if (isCurrentOutputEmpty()) {
                currentOutput.textContent = '0.';
            } else if (!currentOutput.textContent.includes('.')) {
                currentOutput.textContent += '.';
            } else {
                return;
            }
            break;
        default:
            break;
    }
}

const handleEqualsInput = () => {
    if (isCurrentOutputEmpty()) {
        return;
    }
    if (isAccumulatedOutputEmpty()) {
        return;
    }
    const accumulatedNumberStr = accumulatedOutput.textContent.replace(/,/g, ''); // Remove commas from the accumulated output
    const currentNumberStr = currentOutput.textContent.replace(/,/g, ''); // Remove commas from the current output
    const expressionStr = (accumulatedNumberStr + currentNumberStr).replace('x', '*'); // Concatenate the new value and replace 'x' with '*' (if it exists)
    const updatedAccumulatedNumber = new Function('return ' + expressionStr)(); // Evaluate the expression and return the result as a number (Function constructor is safer than eval()
    accumulatedOutput.textContent = '';
    currentOutput.textContent = updatedAccumulatedNumber.toLocaleString('en-US');
}

const switchTheme = () => {
    let theme = '';

    if (darkBlueThemeToggle.checked) {
        lightThemeToggle.checked = true;
        theme = 'light';
    } else if (lightThemeToggle.checked) {
        violetThemeToggle.checked = true;
        theme = 'violet';
    } else {
        darkBlueThemeToggle.checked = true;
        theme = 'dark-blue';
    }

    applyThemeToPage(theme);
}

const applyThemeToPage = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

const isCurrentOutputEmpty = () => {
    return currentOutput.textContent === '';
}

const isAccumulatedOutputEmpty = () => {
    return accumulatedOutput.textContent === '';
}
// ---------------------------------------------------------------------------------------- //

// --------------------------------------- ON START --------------------------------------- //
// Get the saved theme from localStorage
const savedTheme = localStorage.getItem('theme');

// Apply the saved theme by setting the checked attribute
if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Find the corresponding toggle button and set it as checked
    document.querySelector(`.calc__toggle-btn--${savedTheme}`).checked = true;
}

// Event listener for theme change
document.addEventListener('change', function (event) {
    if (event.target.classList.contains('calc__toggle-btn--dark-blue')) {
        localStorage.setItem('theme', 'dark-blue');
    } else if (event.target.classList.contains('calc__toggle-btn--light')) {
        localStorage.setItem('theme', 'light');
    } else if (event.target.classList.contains('calc__toggle-btn--violet')) {
        localStorage.setItem('theme', 'violet');
    }
});
// ---------------------------------------------------------------------------------------- //

// --------------------------------------- EVENT LISTENERS --------------------------------------- //

toggleController.addEventListener('click', switchTheme);
numberKeys.forEach(key => key.addEventListener('click', handleNumberInput));
operatorKeys.forEach(key => key.addEventListener('click', handleOperatorInput));
resetKey.addEventListener('click', () => { accumulatedOutput.textContent = ''; currentOutput.textContent = ''; });
deleteKey.addEventListener('click', () => { currentOutput.textContent = currentOutput.textContent.slice(0, -1); });
equalsKey.addEventListener('click', handleEqualsInput);

// ---------------------------------------------------------------------------------------------- //