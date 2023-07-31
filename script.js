'use strict';
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

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

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////
//button scroling
btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);

  console.log(e.target.getBoundingClientRect()); // pokazuje dokładną pozycję przycisku na stronie

  console.log('Current scroll (X/Y)', window.pageXOffset, window.pageYOffset); //pokazuje aktualną pozycję przesunięcia scrolla

  console.log(
    'height/width viewport',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  ); // pokazuje szerokość i wysokość strony aktualnie przeglądaną

  //Scroling
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // ); //skrolowanie do następnej sekcji )(Na stare przeglądarki)

  section1.scrollIntoView({ behavior: 'smooth' }); //skrolowanie do nowej sekcji
});
///////////////////////////////////////
//page naviagtion

// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

///////////////////////////////////////
//Tabbed component

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  //klauzula ochronna
  if (!clicked) return;

  //usuwanie starych elementów przed aktywacją nowych
  tabs.forEach(t => t.classList.remove('operations__tab--active')); // usuwa aktywny przycisk
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  //Aktywacja przycisku
  clicked.classList.add('operations__tab--active'); //dodawania clasy (przycisk do góry)

  //Aktywacja napisów
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});
///////////////////////////////////////
// //sticky navigation
// const initialCoords = section1.getBoundingClientRect();

// window.addEventListener('scroll', function () {
//   console.log(window.scrollY);

//   if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });
///////////////////////////
// const obsCallback = function (entries, observer) {
//   entries.forEach(enttry => {
//     console.log(enttry);
//   });
// };

// const obsOptions = {
//   root: null,
//   threshold: [0, 0.2],
// };

// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

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
///////////////////////////////
////Sekcja przewijania
const allSection = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSection.forEach(function (section) {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});
///////////////////////////////
////lENIWE ŁADOWANIE ZDJĘĆ
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  //Zamiana src na data src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 1,
});

imgTargets.forEach(img => imgObserver.observe(img));

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

/////////////////////
/////////////////////////
////////////////////
/*
//Selectiong elements
console.log(document.documentElement);
console.log(document.head);
console.log(document.body);

const header = document.querySelector('.header');
const allSection = document.querySelectorAll('.section');
console.log(allSection);

document.getElementById('section--1');
const allButtons = document.getElementsByTagName('button');
console.log(allButtons);

console.log(document.getElementsByClassName('btn'));

//creating and inserting elements

const message = document.createElement('div'); //dodanie elementu
message.classList.add('cookie-message'); // dodanie class do danego elementu
// message.textContent = 'We use coookied for improved functionality ';
message.innerHTML =
  'We use coookied for improved functionality. <button class="btn btn--close-cookie">Got it!</button>';

// header.prepend(message); //wczytanie na stronie jako pierwsze dziecko na strone(w danym miejscu )
header.append(message); //wczytanie na stronie jako ostatnie dziecko na strone (w danym miejscu)
// header.append(message.cloneNode(true)); //wczytanie jako ostatnie + pierwsze (klonowanie) dodaje w 2 miejscach stare i nowe
// header.before(message); //tworzenie przed nagłowkiem (tu header)
// header.after(message);//tworzenie za nagłowkiem (tu header)

/////////Delete elements
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    message.remove(); //klikając na przycisk z klasą btn--close-cookie następuje usunięcie całej klasy message
    // message.parentElement.removeChild(message); //stary sposób wybieranie elementu a później usuwanie dziecka
  });


//styles
message.style.backgroundColor = '#37383d';
message.style.width = '120%';

console.log(message.style.backgroundColor); ///możemy sprawdzic jaki daliśmy kolor ze strony js

console.log(getComputedStyle(message).color);
console.log(getComputedStyle(message).height); //sprawdzenie wysokości i koloru ze strony css

message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';
//zmiana wysokości (dodawnia 30px do bierzącego a przed zamiana string na number)

document.documentElement.style.setProperty('--color-primaty', 'orangered');
//zamiana kolorów na pomarańcz (zamiast pisania backgroundcolor)

//Attributes "src,alr,className,id,href "
const logo = document.querySelector('.nav__logo');
console.log(logo.alt);
console.log(logo.src);
console.log(logo.className);

logo.alt = 'Beautiful minimalist logo'; //zamiana alt pod zdjęciem przez js

//niestandardowe
console.log(logo.designer);
console.log(logo.getAttribute('designer'));
logo.setAttribute('company', 'Bankist'); //dodawanie atrybutu przez js

console.log(logo.src); //pokazuje dokładną lokalizację zdjęcia na serwerze
console.log(logo.getAttribute('src')); //pokazuje miejsce zdj

const link = document.querySelector('.nav__link--btn');
console.log(link.href); // pokazuje dokładny adres strony
console.log(link.getAttribute('href')); //pokazuje nazwę href do storny

//Data attributes
console.log(logo.dataset.versionNumber); // pokazuje numer wersji atrybutu który ma w nazwie (data-version-number)

//classes
logo.classList.add('c', 'j'); //dodawanie
logo.classList.remove('c', 'j'); //odejmowanie
logo.classList.toggle('c', 'Warunek jezeli if np'); //dodawanie warunków do klasy
logo.classList.contains('c'); //czy zawiera klasę

//Dont USE!!!
logo.className = 'jonas'; //Nadpisanie i pojedyncza klasa NIE UŻYWAĆ!!!!!

/* 
const h1 = document.querySelector('h1');

const alerth1 = function (e) {
  alert('addEventListener: całe te'); //funkcja z alertem

  // h1.removeEventListener('mouseenter', alerth1); //wyłącza ponowne kliknięcie
};

h1.addEventListener('mouseenter', alerth1); //klikając w h1 wyskoczy nam alert

setTimeout(() => h1.removeEventListener('mouseenter', alerth1), 3000); //wyłącza kliknięcie po upływie 3sekund

// h1.onmouseenter = function (e) {
//   alert('onmouseenter: całe te'); //klikając w h1 wyskoczy nam alert
// };

//rgb(255,255,255)
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min); //losowanie liczb od min do max
const randomColor = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`; //wpisywanie randomowych liczb od 0 do 255(tu chodzi o kolory)

document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('LINK', e.target, e.currentTarget);

  // e.stopPropagation(); //zatrzymuje dalsze malowanie elementów
}); // daje losowy kolor przyciskom

document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('CONTAINER', e.target, e.currentTarget);
}); //background navigacj przycisków

document.querySelector('.nav').addEventListener(
  'click',
  function (e) {
    this.style.backgroundColor = randomColor();
    console.log('NAV', e.target, e.currentTarget);
  }
  // true //idzie najpierw do celu czyli do true a jak nie to bombelkuje i zaczyna odpalać program po kolei
); //cała nawigazcja




const h1 = document.querySelector('h1');

console.log(h1.querySelectorAll('.highlight'));
console.log(h1.childNodes);
console.log(h1.children);
h1.firstElementChild.style.color = 'white';
h1.lastElementChild.style.color = 'red';

console.log(h1.parentNode);
console.log(h1.parentElement);

h1.closest('.header').style.background = 'var(--gradient-secondary)';

h1.closest('h1').style.background = 'var(--gradient-primary)';

console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

console.log(h1.previousSibling);
console.log(h1.nextSibling);

console.log(h1.parentElement.children);
[...h1.parentElement.children].forEach(function (el) {
  if (el !== h1) el.style.transform = 'scale(0.5)';
});
*/

document.addEventListener('DOMContentLoaded', function (e) {
  console.log('HTML parsed and DOM tree built!', e);
});
window.addEventListener('load', function (e) {
  console.log('Page filly loaded', e);
});

// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = '';
// });
