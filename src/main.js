import { FILM_CARD_LIST_EXTRA_COUNT, FILM_CARD_QUANTITY, FILM_CARD_PER_STEP } from './view/constants.js';
import { renderElement, RenderPosition, createGenre } from './view/utils.js';
import CommentView from './view/comments.js';
import CommentFormView from './view/comment-form.js';
import { generateFilmCard, generateFilmComments } from './mock/generation-film-card-and-comments.js';
import UserRankView from './view/user-rank.js';
import ShowMoreButtonView from './view/show-more-button.js';
import FilmCardContainerView from './view/film-container.js';
import FilmCardView from './view/film-card.js';
import FilmPopupView from './view/film-info.js';
import { generateFilters } from './mock/generate-filters.js';
import FilterMenuView from './view/filter-menu.js';
import SortView from './view/sort.js';

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('footer');
const bodyElement = document.querySelector('body');

const filmCards = new Array(FILM_CARD_QUANTITY).fill('').map(() => generateFilmCard());
const filters = generateFilters(filmCards);
const comments = new Array(FILM_CARD_QUANTITY).fill('').map(() => generateFilmComments());

renderElement(headerElement, new UserRankView().getElement(), RenderPosition.BEFOREEND);
renderElement(mainElement, new FilterMenuView(filters).getElement(), RenderPosition.BEFOREEND);
const FilterMenuElement = document.querySelector('.main-navigation');
renderElement(FilterMenuElement, new SortView().getElement(), RenderPosition.AFTEREND);

renderElement(mainElement, new FilmCardContainerView().getElement(), RenderPosition.BEFOREEND);
const filmCardContainer = document.querySelector('.films-list__container');
const filmList = document.querySelector('.films-list');

const addEventListenerForFilmCard = (filmCardComponent, filmPopupComponent, buttonCloseFilmPopup, i) => {
  const filmCardPoster = filmCardComponent.getElement().querySelector('.film-card__poster');
  const filmCardTitle = filmCardComponent.getElement().querySelector('.film-card__title');
  const filmCardComments = filmCardComponent.getElement().querySelector('.film-card__comments');
  filmCardPoster.addEventListener('click', () => showPopup(filmPopupComponent, buttonCloseFilmPopup, i));
  filmCardTitle.addEventListener('click', () => showPopup(filmPopupComponent, buttonCloseFilmPopup, i));
  filmCardComments.addEventListener('click', () => showPopup(filmPopupComponent, buttonCloseFilmPopup, i));
};

const closePopupByCloseButton = (filmPopupComponent) => {
  footerElement.removeChild(filmPopupComponent.getElement());
  filmPopupComponent.getElement().remove();
  bodyElement.classList.remove('hide-overflow');
};

const showPopup = (filmPopupComponent, buttonCloseFilmPopup, i) => {
  bodyElement.classList.add('hide-overflow');
  footerElement.appendChild(filmPopupComponent.getElement());
  createGenre(filmCards[i].filmInfo.genre);
  const FilmPopupForm = document.querySelector('.film-details__inner');
  renderElement(FilmPopupForm, new CommentFormView(filmCards[i]).getElement(), RenderPosition.BEFOREEND);
  const commentList = document.querySelector('.film-details__comments-list');
  renderElement(commentList, new CommentView(comments[i]).getElement(), RenderPosition.BEFOREEND);
  buttonCloseFilmPopup.addEventListener('click', () => closePopupByCloseButton(filmPopupComponent));
};

for (let i = 0; i < Math.min(filmCards.length, FILM_CARD_PER_STEP); i++) {
  const filmCardComponent = new FilmCardView(filmCards[i]);
  const filmPopupComponent = new FilmPopupView(filmCards[i]);
  const buttonCloseFilmPopup = filmPopupComponent.getElement().querySelector('.film-details__close-btn');
  renderElement(filmCardContainer, filmCardComponent.getElement(), RenderPosition.BEFOREEND);
  addEventListenerForFilmCard(filmCardComponent, filmPopupComponent, buttonCloseFilmPopup, i);
}

if (filmCards.length > FILM_CARD_PER_STEP) {
  let renderedFilmCardCount = FILM_CARD_PER_STEP;
  renderElement(filmList, new ShowMoreButtonView().getElement(), RenderPosition.BEFOREEND);
  const showMoreButton = document.querySelector('.films-list__show-more');

  showMoreButton.addEventListener('click', () => {
    filmCards
      .slice(renderedFilmCardCount, renderedFilmCardCount + FILM_CARD_PER_STEP)
      .forEach((element) => {
        const otherFilmCardComponent = new FilmCardView(element);
        const filmPopupComponent = new FilmPopupView(element);
        const buttonCloseFilmPopup = filmPopupComponent.getElement().querySelector('.film-details__close-btn');
        const i = filmCards.indexOf(element);
        renderElement(filmCardContainer, otherFilmCardComponent.getElement(), RenderPosition.BEFOREEND);
        addEventListenerForFilmCard(otherFilmCardComponent, filmPopupComponent, buttonCloseFilmPopup, i);
      });

    renderedFilmCardCount += FILM_CARD_PER_STEP;

    if (renderedFilmCardCount >= filmCards.length) {
      showMoreButton.remove();
    }
  });
}

const filmCardListExtra = document.querySelectorAll('.films-list--extra .films-list__container');
for (const element of filmCardListExtra) {
  for (let i = 0; i < FILM_CARD_LIST_EXTRA_COUNT; i++) {
    const filmCardComponent = new FilmCardView(filmCards[i]);
    const filmPopupComponent = new FilmPopupView(filmCards[i]);
    const buttonCloseFilmPopup = filmPopupComponent.getElement().querySelector('.film-details__close-btn');
    renderElement(element, filmCardComponent.getElement(), RenderPosition.BEFOREEND);
    addEventListenerForFilmCard(filmCardComponent, filmPopupComponent, buttonCloseFilmPopup);
  }
}
