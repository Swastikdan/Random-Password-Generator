const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const numberChars = '0123456789';
const specialChars = '!@#$%^&*()_+[]{}|;:,.<>?';

const lengthSlider = document.getElementById('length');
const lengthValue = document.getElementById('lengthValue');
const decreaseLengthButton = document.getElementById('decreaseLength');
const increaseLengthButton = document.getElementById('increaseLength');
const includeUppercase = document.getElementById('includeUppercase');
const includeLowercase = document.getElementById('includeLowercase');
const includeNumbers = document.getElementById('includeNumbers');
const includeSpecial = document.getElementById('includeSpecial');
const generateButton = document.getElementById('generate');
const copyButton = document.getElementById('copy');
const passwordField = document.getElementById('password');
const strengthIndicator = document.getElementById('passwordStrength');

const svg = generateButton.querySelector('svg');
let rotation = 0;

generateButton.addEventListener('click', () => {
    rotation -= 360;
    svg.style.transition = 'transform 0.3s ease-in-out';
    svg.style.transform = `rotate(${rotation}deg)`;
});

function updateButtonsState() {
    const currentLength = parseInt(lengthSlider.value);
    decreaseLengthButton.disabled = currentLength <= 1;
    increaseLengthButton.disabled = currentLength >= 50;
}

lengthSlider.addEventListener('input', () => {
    lengthValue.textContent = lengthSlider.value;
    generatePasswordAndUpdateStrength();
    updateButtonsState();
});

decreaseLengthButton.addEventListener('click', () => {
    lengthValue.textContent = parseInt(lengthSlider.value) - 1;
    lengthSlider.value = parseInt(lengthSlider.value) - 1;
    generatePasswordAndUpdateStrength();
    updateButtonsState();
});

increaseLengthButton.addEventListener('click', () => {
    lengthValue.textContent = parseInt(lengthSlider.value) + 1;
    lengthSlider.value = parseInt(lengthSlider.value) + 1;
    generatePasswordAndUpdateStrength();
    updateButtonsState();
});

const checkboxes = [includeUppercase, includeLowercase, includeNumbers, includeSpecial];

function updateCheckboxState() {
    const checkedCount = checkboxes.filter(checkbox => checkbox.checked).length;

    checkboxes.forEach(checkbox => {
        if (checkedCount === 1 && checkbox.checked) {
            checkbox.disabled = true;
            toggleOpacityClass(checkbox.id, true);
        } else {
            checkbox.disabled = false;
            toggleOpacityClass(checkbox.id, false);
        }
    });
}

function toggleOpacityClass(checkboxId, addClass) {
    const label = document.querySelector(`label[for=${checkboxId}]`);
    if (addClass) {
        label.classList.add('opacity-50');
        label.classList.add('cursor-not-allowed');
    } else {
        label.classList.remove('opacity-50');
        label.classList.remove('cursor-not-allowed');
    }
}

checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        updateCheckboxState();
        generatePasswordAndUpdateStrength();
    });
});

includeUppercase.addEventListener('change', generatePasswordAndUpdateStrength);
includeLowercase.addEventListener('change', generatePasswordAndUpdateStrength);
includeNumbers.addEventListener('change', generatePasswordAndUpdateStrength);
includeSpecial.addEventListener('change', generatePasswordAndUpdateStrength);

generateButton.addEventListener('click', generatePasswordAndUpdateStrength);

function updatePartialPasswordDisplay(password) {
    let screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    let maxVisibleCharacters;
    if (screenWidth >= 1440) {
        maxVisibleCharacters = 30;
    } else {
        maxVisibleCharacters = Math.floor(screenWidth / 28);
    }
    const partialPassword = password.substring(0, maxVisibleCharacters);
    const displayedPassword = partialPassword + (password.length > maxVisibleCharacters ? '...' : '');

    const passwordDisplay = document.getElementById('partialPassword');
    passwordDisplay.style.opacity = '0';

    setTimeout(() => {
        passwordDisplay.textContent = displayedPassword;
        passwordDisplay.style.opacity = '1';
    }, 200);
}

window.addEventListener('resize', () => {
    updatePartialPasswordDisplay(passwordField.value);
});

function generatePasswordAndUpdateStrength() {
    const length = parseInt(lengthSlider.value);
    const includeUppercaseChars = includeUppercase.checked ? uppercaseChars : '';
    const includeLowercaseChars = includeLowercase.checked ? lowercaseChars : '';
    const includeNumbersChars = includeNumbers.checked ? numberChars : '';
    const includeSpecialChars = includeSpecial.checked ? specialChars : '';

    const allChars = includeUppercaseChars + includeLowercaseChars + includeNumbersChars + includeSpecialChars;

    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * allChars.length);
        password += allChars.charAt(randomIndex);
    }

    updatePartialPasswordDisplay(password);
    passwordField.value = password;
    updatePasswordStrength(password);
    updateButtonsState();
}

document.addEventListener('DOMContentLoaded', () => {
    const copyButton = document.getElementById('copy');
    const passwordField = document.getElementById('password');
    const copyMessage = document.getElementById('copy-message');

    copyButton.addEventListener('click', () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(passwordField.value)
                .then(() => showCopyMessage('Copied to Clipboard! 🎉'))
                .catch(() => showCopyMessage('Copying failed.'));
        } else {
            fallbackCopyText(passwordField);
        }
    });

    function fallbackCopyText(element) {
        const textArea = document.createElement('textarea');
        textArea.value = element.value;
        document.body.appendChild(textArea);
        textArea.select();

        try {
            document.execCommand('copy');
            showCopyMessage('Copied to Clipboard! 🎉');
        } catch (err) {
            console.error('Copying failed: ', err);
            showCopyMessage('Error');
        }

        document.body.removeChild(textArea);
    }

    function showCopyMessage(message) {
        copyMessage.innerHTML = `<div id="dismiss-alert" class="hs-removing:translate-x-5 hs-removing:opacity-0 transition duration-300 bg-teal-50 border border-teal-200 rounded-md px-4 py-2" role="alert">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <svg class="h-4 w-4 text-teal-400 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
          </svg>
        </div>
        <div class="ml-3">
          <div  class="text-sm text-teal-800 font-medium">
          ${message}
          </div>
        </div>
      </div>
    </div>
`;
        setTimeout(() => {
            copyMessage.innerHTML = '';
        }, 3000);
    }

});

function updatePasswordStrength(password) {
    let strength = '';
    let color = '';

    const length = password.length;

    if (length >= 12) {
        strength = 'Very Strong';
        color = 'blue-600';
    } else if (length >= 10) {
        strength = 'Strong';
        color = 'green-600';
    } else if (length >= 8) {
        strength = 'Good';
        color = 'yellow-300';
    } else if (length >= 6) {
        strength = 'Weak';
        color = 'red-600';
    } else {
        strength = 'Very Weak';
        color = 'red-600';
    }

    strengthIndicator.innerHTML = ` <p class="bg-${color} px-3 md:px-8 py-1 uppercase rounded-md text-[9px] md:text-sm">
  ${strength}
</p>`;
    strengthIndicator.className = strength.toLowerCase();
}

generatePasswordAndUpdateStrength();
updateButtonsState();