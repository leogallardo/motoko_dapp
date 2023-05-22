import { motoko_dapp_backend } from '../../declarations/motoko_dapp_backend';

const displaySmall = document.querySelector('.display-small');
const displayLarge = document.querySelector('.display-large');

const clearButton = document.querySelector('.clear');
const numberButtons = document.querySelectorAll('.number');
const operationButtons = document.querySelectorAll('.operator');
const backspaceButton = document.querySelector('.backspace');
const invertButton = document.querySelector('.invert');
const calculateButton = document.getElementById('calculate');
const decimalButton = document.querySelector('.decimal');

// initial setup
displaySmall.innerText = '';
let displaySmallIsClear = true;
displayLarge.innerText = 0;
let displayLargeIsClear = true;
let firstNum = null;
let secondNum = null;
let hasFirstNum = false;
let currentOperator = null;
let currentOperationSign = null;
let isLoading = false;

// clear button
clearButton.addEventListener('click', function () {
  clear();
});

// backspace button
backspaceButton.addEventListener('click', function () {
  if (displayLarge.innerText !== '0') {
    if (displayLarge.innerText.length > 1) {
      displayLarge.innerText = displayLarge.innerText.toString().slice(0, -1);
    } else {
      displayLarge.innerText = 0;
      displayLargeIsClear = true;
    }
  }

  if (!hasFirstNum) {
    firstNum = displayLarge.innerText;
  } else {
    secondNum = displayLarge.innerText;
  }
});

// invert button
invertButton.addEventListener('click', function () {
  displayLarge.innerText = -displayLarge.innerText;

  if (!hasFirstNum) {
    firstNum = displayLarge.innerText;
  } else {
    secondNum = displayLarge.innerText;
  }
});

// number buttons
numberButtons.forEach((number) => {
  number.addEventListener('click', (e) => {
    // prevent double zero
    if (e.target.innerText == 0 && displayLarge.innerText == '0') {
      return;
    }

    // prevent numbers starting with zero
    if ((hasFirstNum && secondNum == null) || displayLarge.innerText == '0') {
      displayLarge.innerText = '';
    }

    displayLargeNumber(e.target.innerText);

    if (!hasFirstNum) {
      firstNum = displayLarge.innerText;
    } else {
      secondNum = displayLarge.innerText;
    }

    consoleLog();
  });
});

// operator buttons
operationButtons.forEach((operator) => {
  operator.addEventListener('click', (e) => {
    setOperationType(e.target.id);
  });
});

// backspace button
calculateButton.addEventListener('click', function () {
  if (hasFirstNum && secondNum != null) {
    calculate();
  }

  consoleLog();
});

// decimal button
decimalButton.addEventListener('click', function () {
  if (!displayLarge.innerText.includes('.')) {
    if (displayLarge.innerText == 0) {
      displayLarge.innerText = '0.';
    } else {
      displayLarge.innerText += '.';
    }
  }

  displayLargeIsClear = false;

  if (!hasFirstNum) {
    firstNum = displayLarge.innerText;
  } else {
    secondNum = displayLarge.innerText;
  }

  //consoleLog();
});

// clear() - clears everything
function clear() {
  displaySmall.innerText = '';
  displaySmallIsClear = true;
  displayLarge.innerText = 0;
  displayLargeIsClear = true;
  firstNum = null;
  secondNum = null;
  hasFirstNum = false;
  currentOperator = null;
  currentOperationSign = null;
  isLoading = false;
}

// displaySmallNumber()
function displaySmallNumber(number) {
  if (!displaySmallIsClear) {
    displaySmall.innerText += number;
  }
}

// displayLargeNumber()
function displayLargeNumber(number) {
  console.log(number);
  if (displayLargeIsClear) {
    displayLarge.innerText = number;
    displayLargeIsClear = false;
  } else {
    displayLarge.innerText = displayLarge.innerText + number;
  }
}

// setOperationType()
function setOperationType(operator) {
  // if first time clicking on an operation button
  if (currentOperator == null) {
    currentOperator = operator;
    setOperationSign(operator);
  }

  // if click on an operation button but no number was entered
  if (!hasFirstNum && firstNum == null) {
    hasFirstNum = true;
    firstNum = 0;
  }

  // if first number was entered
  if (!hasFirstNum && firstNum != null) {
    hasFirstNum = true;
  }

  // perform the right calculation
  if (hasFirstNum && secondNum != null) {
    calculate();
  } else if (hasFirstNum && secondNum == null) {
    // change the operation sign without performing any calculation
    setOperationSign(operator);
    displaySmall.innerText = firstNum + ' ' + currentOperationSign;
  }

  // update the operator
  setOperationSign(operator);
}

// calculate()
function calculate() {
  // use the previously used operation sign, not the last clicked one
  switch (currentOperationSign) {
    case '+':
      const add = async () => {
        loading();

        const result = await motoko_dapp_backend.add(parseFloat(firstNum), parseFloat(secondNum));

        loading();

        firstNum = Number(result).toFixed(2).replace(/\.00$/, '') * 1;
        secondNum = null;

        displaySmall.innerText = firstNum + ' ' + currentOperationSign;
        displayLarge.innerText = Number(result).toFixed(2).replace(/\.00$/, '') * 1;

        return;
      };

      // perform the calculation
      add();

      break;

    case '-':
      const sub = async () => {
        loading();

        const result = await motoko_dapp_backend.sub(parseFloat(firstNum), parseFloat(secondNum));

        loading();

        firstNum = Number(result).toFixed(2).replace(/\.00$/, '') * 1;
        secondNum = null;

        displaySmall.innerText = firstNum + ' ' + currentOperationSign;
        displayLarge.innerText = Number(result).toFixed(2).replace(/\.00$/, '') * 1;

        return;
      };

      // perform the calculation
      sub();

      break;

    case 'x':
      const mul = async () => {
        loading();

        const result = await motoko_dapp_backend.mul(parseFloat(firstNum), parseFloat(secondNum));

        loading();

        firstNum = Number(result).toFixed(2).replace(/\.00$/, '') * 1;
        secondNum = null;

        displaySmall.innerText = firstNum + ' ' + currentOperationSign;
        displayLarge.innerText = Number(result).toFixed(2).replace(/\.00$/, '') * 1;

        return;
      };

      // perform the calculation
      mul();

      break;

    case '/':
      const div = async () => {
        // prevent the calculation if any of the numbers is 0
        if (firstNum != 0 && secondNum != 0) {
          loading();

          const result = await motoko_dapp_backend.div(parseFloat(firstNum), parseFloat(secondNum));

          loading();

          firstNum = Number(result).toFixed(2).replace(/\.00$/, '') * 1;
          secondNum = null;

          displaySmall.innerText = firstNum + ' ' + currentOperationSign;
          displayLarge.innerText = Number(result).toFixed(2).replace(/\.00$/, '') * 1;

          return;
        } else {
          secondNum = null;

          return;
        }
      };

      // perform the calculation
      div();

      break;
  }
}

// assign a proper operation sign
function setOperationSign(operator) {
  switch (operator) {
    case 'add':
      currentOperationSign = '+';
      break;
    case 'subtract':
      currentOperationSign = '-';
      break;
    case 'multiply':
      currentOperationSign = 'x';
      break;
    case 'divide':
      currentOperationSign = '/';
      break;
  }
}

// consoleLog() - prints values into the console
function consoleLog() {
  console.log('hasFirstNum: ' + hasFirstNum);
  console.log('firstNum: ' + firstNum);
  console.log('secondNum: ' + secondNum);
  console.log('currentOperationSign: ' + currentOperationSign);
}

// loading() - sets a loading behavior when conecting to the IC
function loading() {
  if (isLoading) {
    document.querySelector('body').style.opacity = '1';
    isLoading = false;
  } else {
    document.querySelector('body').style.opacity = '0.2';
    isLoading = true;
  }
}

// decimal.addEventListener('click', displayDecimal);

// function clearScreen() {
//   displaySmall.innerText = '';
// }

// function clearAllValues() {
//   firstNum= null;
//   secondNum = null;
//   currentOperator = null;
//   clearScreen();
// }

// function calculateResult() {
//   if (firstNum&& currentOperator && !resetScreen && !secondNum) {
//     setOperand(showNumber());
//     return operate(Number(num), Number(secondNum), currentOperator);
//   } else {
//     return false;
//   }
// }

// window.addEventListener('keydown', setKey);

// function setKey(e) {
//   if (e.key >= 0 && e.key <= 9) displaySmallNumber(e.key);
//   if (e.key === '.') displayDecimal(e.key);
//   if (e.key === 'Backspace') deleteNumber(e.key);
//   if (e.key === 'Delete') clearScreen(e.key);
// }
