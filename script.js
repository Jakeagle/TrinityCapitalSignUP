'use strict';

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////
// Button scrolling

///////////////////////////////////////
// Server Functions
const socket = io('https://moneytalksregistration-cfhnanfmasc7d0e8.eastus-01.azurewebsites.net');
const createAccountURL = 'https://moneytalksregistration-cfhnanfmasc7d0e8.eastus-01.azurewebsites.net/createAccount';
const errorModal = document.querySelector('.errorModal');
const tryAgain = document.querySelector('.tryAgainBTN');

socket.on('noSchoolCodeFound', modal => {
  console.log(modal, 'Called');
  errorModal.showModal();
});

socket.on('creationSuccesful', data => {
  window.location.replace(data.redirectUrl);
});

const firstNameInput = document.querySelector('.firstNameInput');
const lastNameInput = document.querySelector('.lastNameInput');
const schoolCodeInput = document.querySelector('.schoolCodeInput');
const createBTN = document.querySelector('.createBTN');
const inputDate = document.querySelector('.dateInput');
const userName = document.querySelector('.usernameInput');
const PIN = document.querySelector('.pinInput');

createBTN.addEventListener('click', function (e) {
  e.preventDefault();
  createProfile();
});

tryAgain.addEventListener('click', () => {
  errorModal.close();
});

async function createProfile() {
  const types = ['Checking', 'Savings'];
  const res = await fetch(createAccountURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      parcel: [
        firstNameInput.value,
        lastNameInput.value,
        schoolCodeInput.value,
        inputDate.value,
        userName.value,
        PIN.value,
        types,
      ],
    }),
  });
  console.log('COMPLETE');
}
