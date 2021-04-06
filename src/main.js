import './view/utils.js';
import { generateFilmCard /* generateFilmComments */ } from './view/generation-film-card.js';
import { createMenu } from './view/menu.js';
import { createUserRank } from './view/user-rank.js';
import { createShowMoreButton } from './view/show-more-button.js';
import { createFilmCardContainer, createFilmCard } from './view/film-card.js';
import { createFilmInfoPopup } from './view/film-info.js';

const FILM_CARD_LIST_EXTRA_COUNT = 2;
const FILM_CARD_QUANTITY = 20;
const FILM_CARD_PER_STEP = 5;

const headerElement = document.querySelector('.header__logo');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('footer');
const filmCards = new Array(FILM_CARD_QUANTITY).fill('').map(() => generateFilmCard());

const addMarkupComponent = (conteiner, template, place) => {
  conteiner.insertAdjacentHTML(place, template);
};

addMarkupComponent(headerElement, createUserRank(), 'beforeend');
addMarkupComponent(mainElement, createMenu(), 'beforeend');
addMarkupComponent(mainElement, createFilmCardContainer(), 'beforeend');
const filmCardList = document.querySelector('.films-list__container');
for (let i = 0; i < Math.min(filmCards.length, FILM_CARD_PER_STEP); i++) {
  addMarkupComponent(filmCardList, createFilmCard(filmCards[i]), 'beforeend');
}

if (filmCards.length > FILM_CARD_PER_STEP) {
  let renderedFilmCardCount = FILM_CARD_PER_STEP;
  addMarkupComponent(filmCardList, createShowMoreButton(), 'afterend');
  const showMoreButton = document.querySelector('.films-list__show-more');

  showMoreButton.addEventListener('click', () => {
    filmCards
      .slice(renderedFilmCardCount, renderedFilmCardCount + FILM_CARD_PER_STEP)
      .forEach((element) => addMarkupComponent(filmCardList, createFilmCard(element), 'beforeend'));

    renderedFilmCardCount += FILM_CARD_PER_STEP;

    if (renderedFilmCardCount >= filmCards.length) {
      showMoreButton.remove();
    }
  });
}
const filmCardListExtra = document.querySelectorAll('.films-list--extra .films-list__container');
for (const element of filmCardListExtra) {
  for (let i = 0; i < FILM_CARD_LIST_EXTRA_COUNT; i++) {
    addMarkupComponent(element, createFilmCard(filmCards[i]), 'beforeend');
  }
}

//   addMarkupComponent(footerElement, createFilmInfoPopup(filmCards[0]), 'afterend');


