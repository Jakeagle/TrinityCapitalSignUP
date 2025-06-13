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

if (btnsOpenModal && btnsOpenModal.length) {
  btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
}
if (btnCloseModal) {
  btnCloseModal.addEventListener('click', closeModal);
}
if (overlay) {
  overlay.addEventListener('click', closeModal);
}

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////
// Button scrolling
if (btnScrollTo && section1) {
  btnScrollTo.addEventListener('click', function (e) {
    section1.scrollIntoView({ behavior: 'smooth' });
  });
}

///////////////////////////////////////
// Page navigation

// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

// 1. Add event listener to common parent element
// 2. Determine what element originated the event

if (document.querySelector('.nav__links')) {
  document.querySelector('.nav__links').addEventListener('click', function (e) {
    e.preventDefault();

    // Matching strategy
    if (e.target.classList.contains('nav__link')) {
      const id = e.target.getAttribute('href');
      if (!id || id === '#') return; // Prevent invalid selector error
      document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
    }
  });
}

///////////////////////////////////////
// Tabbed component

if (tabsContainer) {
  tabsContainer.addEventListener('click', function (e) {
    const clicked = e.target.closest('.operations__tab');

    // Guard clause
    if (!clicked) return;

    // Remove active classes
    tabs.forEach(t => t.classList.remove('operations__tab--active'));
    tabsContent.forEach(c => c.classList.remove('operations__content--active'));

    // Activate tab
    clicked.classList.add('operations__tab--active');

    // Activate content area
    document
      .querySelector(`.operations__content--${clicked.dataset.tab}`)
      .classList.add('operations__content--active');
  });
}

///////////////////////////////////////
// Menu fade animation
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// Passing "argument" into handler
if (nav) {
  nav.addEventListener('mouseover', handleHover.bind(0.5));
  nav.addEventListener('mouseout', handleHover.bind(1));
}

///////////////////////////////////////
// Sticky navigation: Intersection Observer API

const header = document.querySelector('.header');
if (header) {
  const navHeight = nav ? nav.getBoundingClientRect().height : 0;

  const stickyNav = function (entries) {
    const [entry] = entries;
    // console.log(entry);

    if (!entry.isIntersecting) nav.classList.add('sticky');
    else nav.classList.remove('sticky');
  };

  const headerObserver = new IntersectionObserver(stickyNav, {
    root: null,
    threshold: 0,
    rootMargin: `-${navHeight}px`,
  });

  headerObserver.observe(header);
}

///////////////////////////////////////
// Reveal sections
const allSections = document.querySelectorAll('.section');
if (allSections && allSections.length) {
  const revealSection = function (entries, observer) {
    const [entry] = entries;

    if (!entry.isIntersecting) return;

    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
  };

  const sectionObserver = new IntersectionObserver(revealSection, {
    root: null,
    threshold: 0.15,
  });

  allSections.forEach(function (section) {
    sectionObserver.observe(section);
    section.classList.add('section--hidden');
  });
}

///////////////////////////////////////
// Lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]');
if (imgTargets && imgTargets.length) {
  const loadImg = function (entries, observer) {
    const [entry] = entries;

    if (!entry.isIntersecting) return;

    // Replace src with data-src
    entry.target.src = entry.target.dataset.src;

    entry.target.addEventListener('load', function () {
      entry.target.classList.remove('lazy-img');
    });

    observer.unobserve(entry.target);
  };

  const imgObserver = new IntersectionObserver(loadImg, {
    root: null,
    threshold: 0,
    rootMargin: '200px',
  });

  imgTargets.forEach(img => imgObserver.observe(img));
}

///////////////////////////////////////
// Slider
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();

    activateDot(0);
  };
  init();

  // Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();

//*******************************Server Functions***********************************/
const socket = io('http://localhost:3000');
const createAccountURL = 'http://localhost:3000/createAccount';
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
