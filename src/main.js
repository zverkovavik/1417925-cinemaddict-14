import { addMarkupComponent } from './view/utils.js';
import { createCommentForm, createCommentTemplate } from './view/comments.js';
import { generateFilmCard, generateFilmComments } from './view/generation-film-card-and-comments.js';
import { createUserRank } from './view/user-rank.js';
import { createShowMoreButton } from './view/show-more-button.js';
import { createFilmCardContainer, createFilmCard } from './view/film-card.js';
import { createFilmInfoPopup, createGenre } from './view/film-info.js';
import { createMenu, cb, filterbyWatchlist, filterbyHistory, filterbyFavorite, generateFilters } from './view/filter.js';

const FILM_CARD_LIST_EXTRA_COUNT = 2;
const FILM_CARD_QUANTITY = 20;
const FILM_CARD_PER_STEP = 5;

const headerElement = document.querySelector('.header__logo');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('footer');
const filmCards = new Array(FILM_CARD_QUANTITY).fill('').map(() => generateFilmCard());
const filters = generateFilters(filmCards);
const comments = new Array(FILM_CARD_QUANTITY).fill('').map(() => generateFilmComments());

addMarkupComponent(headerElement, createUserRank(), 'beforeend');
addMarkupComponent(mainElement, createMenu(filters), 'beforeend');
const allMovieFilter = document.querySelector('a[href="#all"]');
const watchlistFilter = document.querySelector('a[href="#watchlist"]');
const historyFilter = document.querySelector('a[href="#history"]');
const favoriteFilter = document.querySelector('a[href="#favorites"]');

addMarkupComponent(mainElement, createFilmCardContainer(), 'beforeend');
const filmCardList = document.querySelector('.films-list__container');

const addFilmCardsAndButtonShowMore = (filmCards) => {
  for (let i = 0; i < Math.min(filmCards.length, FILM_CARD_PER_STEP); i++) {
    addMarkupComponent(filmCardList, createFilmCard(filmCards[i]), 'beforeend');
  }
  if (filmCards.length > FILM_CARD_PER_STEP) {
    let renderedFilmCardCount = FILM_CARD_PER_STEP;
    addMarkupComponent(filmCardList, createShowMoreButton(), 'afterend');
    const showMoreButton = document.querySelector('.films-list__show-more');

    showMoreButton.addEventListener('click', (filmCards) => {
      filmCards
        .slice(renderedFilmCardCount, renderedFilmCardCount + FILM_CARD_PER_STEP)
        .forEach((element) => addMarkupComponent(filmCardList, createFilmCard(element), 'beforeend'));

      renderedFilmCardCount += FILM_CARD_PER_STEP;

      if (renderedFilmCardCount >= filmCards.length) {
        showMoreButton.remove();
      }
    });
  }
};

addFilmCardsAndButtonShowMore(filmCards);

const onWatchlistFilterClick = (data) => {
  watchlistFilter.addEventListener('click', (evt) => {
    cb(evt);
    // filmCardList.replaceChildren();
    // addFilmCardsAndButtonShowMore(filterbyWatchlist(data));
    filterbyWatchlist(data);
  });
};
onWatchlistFilterClick(filmCards);

favoriteFilter.addEventListener('click', (evt, data) => {
  cb(evt);
  filterbyFavorite(data);
  return data;
});

historyFilter.addEventListener('click', (evt, data) => {
  cb(evt);
  filterbyHistory(data);
  return filmCards;
});

allMovieFilter.addEventListener('click', (evt) => {
  cb(evt);
});

const filmCardListExtra = document.querySelectorAll('.films-list--extra .films-list__container');
for (const element of filmCardListExtra) {
  for (let i = 0; i < FILM_CARD_LIST_EXTRA_COUNT; i++) {
    addMarkupComponent(element, createFilmCard(filmCards[i]), 'beforeend');
  }
}

addMarkupComponent(footerElement, createFilmInfoPopup(filmCards[0]), 'afterend');
createGenre(filmCards[0].filmInfo.genre);
const filmInfoContainer = document.querySelector('.film-details__top-container');
addMarkupComponent(filmInfoContainer, createCommentForm(filmCards[0]), 'afterend');
const commentList = document.querySelector('.film-details__comments-list');
addMarkupComponent(commentList, createCommentTemplate(comments[0]), 'afterbegin');
