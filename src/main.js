import { createMenu } from './view/menu.js';
import { createUserRank } from './view/user-rank.js';
import { createShowMoreButton } from './view/show-more-button.js';
import { createFilmCardContainer, createFilmCard, generateFilmCard } from './view/film-card.js';
import { createFilmInfoPopup } from './view/film-info.js';

const FILM_CARD_LIST_COUNT = 5;
const FILM_CARD_LIST_EXTRA_COUNT = 2;
const FILM_CARD_QUANTITY = 15;

const headerElement = document.querySelector('.header__logo');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('footer');

const addMarkupComponent = (conteiner, template, place) => {
  conteiner.insertAdjacentHTML(place, template);
};

addMarkupComponent(headerElement, createUserRank(), 'beforeend');
addMarkupComponent(mainElement, createMenu(), 'beforeend');
addMarkupComponent(mainElement, createFilmCardContainer(), 'beforeend');
const filmCardList = document.querySelector('.films-list__container');
for (let i = 0; i < FILM_CARD_LIST_COUNT; i++) {
  addMarkupComponent(filmCardList, createFilmCard(), 'beforeend');
}
addMarkupComponent(filmCardList, createShowMoreButton(), 'afterend');
const filmCardListExtra = document.querySelectorAll('.films-list--extra .films-list__container');
for (const element of filmCardListExtra) {
  for (let i = 0; i < FILM_CARD_LIST_EXTRA_COUNT; i++) {
    addMarkupComponent(element, createFilmCard(), 'beforeend');
  }
}
// addMarkupComponent(footerElement, createFilmInfoPopup(), 'afterend');

const filmCards = new Array(FILM_CARD_QUANTITY).fill('').map(() => generateFilmCard());
