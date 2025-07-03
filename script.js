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
const socket = io('https://tcregistrationserver-production.up.railway.app');
const createAccountURL = 'https://tcregistrationserver-production.up.railway.app/createAccount';
const errorModal = document.querySelector('.errorModal');
const tryAgain = document.querySelector('.tryAgainBTN');

socket.on('noSchoolCodeFound', modal => {
  console.log(modal, 'Called');
  errorModal.showModal();
});

socket.on('creationSuccesful', data => {
  if (data.isTeacher && data.oauth2Url) {
    // Do nothing here; modal will be shown by createProfile()
    return;
  } else {
    window.location.replace(data.redirectUrl);
  }
});

const firstNameInput = document.querySelector('.firstNameInput');
const lastNameInput = document.querySelector('.lastNameInput');
const schoolCodeInput = document.querySelector('.schoolCodeInput');
const createBTN = document.querySelector('.createBTN');
const inputDate = document.querySelector('.dateInput');
const userName = document.querySelector('.usernameInput');
const PIN = document.querySelector('.pinInput');
const teacherOauthModal = document.getElementById('teacher-oauth-modal');
const googleOauthBtn = document.getElementById('google-oauth-btn');
const microsoftOauthBtn = document.getElementById('microsoft-oauth-btn');

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
  const data = await res.json();
  if (data.isTeacher && data.oauth2Url) {
    // Show the modal for email provider selection
    teacherOauthModal.style.display = 'flex';
    teacherOauthModal.showModal();
    // Google button click handler
    googleOauthBtn.onclick = () => {
      console.log('Google OAuth button clicked');
      // Always open the Google OAuth2 link in a new tab
      window.open(data.oauth2Url, '_blank', 'noopener');
      teacherOauthModal.close();
    };
    // Microsoft button (not implemented)
    microsoftOauthBtn.onclick = () => {
      alert('Microsoft email connection is not yet implemented.');
    };
    return;
  }
  if (data.redirectUrl) {
    window.location.replace(data.redirectUrl);
    return;
  }
  console.log('COMPLETE');
}
