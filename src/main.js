import { FilmCardNumber } from './constants.js';
import { renderElement, RenderPosition, createGenre, isEscEvent } from './utils/render.js';
import NoFilmsView from './view/no-films.js';
import CommentView from './view/comments.js';
import CommentFormView from './view/comment-form.js';
import { generateFilmCard, generateFilmComments } from './mock/generation-film-card-and-comments.js';
import UserRankView from './view/user-rank.js';
import ShowMoreButtonView from './view/show-more-button.js';
import FilmCardContainerView from './view/film-container.js';
import FilmCardView from './view/film-card.js';
import FilmPopupView from './view/film-info.js';
import { generateFilters } from './generate-filters.js';
import FilterMenuView from './view/filter-menu.js';
import SortView from './view/sort.js';

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('footer');
const bodyElement = document.querySelector('body');

const filmCards = new Array(FilmCardNumber.FILM_CARD_QUANTITY).fill('').map(() => generateFilmCard());
const filters = generateFilters(filmCards);
const comments = new Array(FilmCardNumber.FILM_CARD_QUANTITY).fill('').map(() => generateFilmComments());

renderElement(headerElement, new UserRankView().getElement(), RenderPosition.BEFOREEND);
renderElement(mainElement, new FilterMenuView(filters).getElement(), RenderPosition.BEFOREEND);
const FilterMenuElement = document.querySelector('.main-navigation');
renderElement(FilterMenuElement, new SortView().getElement(), RenderPosition.AFTEREND);

renderElement(mainElement, new FilmCardContainerView().getElement(), RenderPosition.BEFOREEND);
const filmCardContainer = document.querySelector('.films-list__container');
const filmList = document.querySelector('.films-list');
const filmCardListExtra = document.querySelectorAll('.films-list--extra');
const filmCardContainerExtra = document.querySelectorAll('.films-list--extra .films-list__container');

const addEventListenerForFilmCard = (filmCardComponent, filmPopupComponent, i) => {
  filmCardComponent.setClickHandler(() => showPopup(filmPopupComponent, i));

  const onEscKeyDown = (evt) => {
    if (isEscEvent) {
      evt.preventDefault();
      closePopup(filmPopupComponent);
    }
  };

  const closePopup = () => {
    footerElement.removeChild(filmPopupComponent.getElement());
    filmPopupComponent.getElement().remove();
    bodyElement.classList.remove('hide-overflow');
    document.removeEventListener('keydown', onEscKeyDown);
  };

  const showPopup = () => {
    bodyElement.classList.add('hide-overflow');
    footerElement.appendChild(filmPopupComponent.getElement());
    createGenre(filmCards[i].filmInfo.genre);
    const FilmPopupForm = document.querySelector('.film-details__inner');
    renderElement(FilmPopupForm, new CommentFormView(filmCards[i]).getElement(), RenderPosition.BEFOREEND);
    const commentList = document.querySelector('.film-details__comments-list');
    renderElement(commentList, new CommentView(comments[i]).getElement(), RenderPosition.BEFOREEND);
    document.addEventListener('keydown', onEscKeyDown);
    filmPopupComponent.setClickHandler(() => {
      closePopup();
    });
  };
};

if (!filmCards.length) {
  renderElement(filmCardContainer, new NoFilmsView().getElement(), RenderPosition.BEFOREEND);
  for (const element of filmCardListExtra) {
    element.remove();
  }
} else {
  for (let i = 0; i < Math.min(filmCards.length, FilmCardNumber.FILM_CARD_PER_STEP); i++) {
    const filmCardComponent = new FilmCardView(filmCards[i]);
    const filmPopupComponent = new FilmPopupView(filmCards[i]);
    renderElement(filmCardContainer, filmCardComponent.getElement(), RenderPosition.BEFOREEND);
    addEventListenerForFilmCard(filmCardComponent, filmPopupComponent, i);
  }

  if (filmCards.length > FilmCardNumber.FILM_CARD_PER_STEP) {
    let renderedFilmCardCount = FilmCardNumber.FILM_CARD_PER_STEP;
    const showMoreButtonComponent = new ShowMoreButtonView();
    renderElement(filmList, showMoreButtonComponent.getElement(), RenderPosition.BEFOREEND);

    showMoreButtonComponent.setClickHandler(() => {
      filmCards
        .slice(renderedFilmCardCount, renderedFilmCardCount + FilmCardNumber.FILM_CARD_PER_STEP)
        .forEach((element) => {
          const otherFilmCardComponent = new FilmCardView(element);
          const filmPopupComponent = new FilmPopupView(element);
          const i = filmCards.indexOf(element);
          renderElement(filmCardContainer, otherFilmCardComponent.getElement(), RenderPosition.BEFOREEND);
          addEventListenerForFilmCard(otherFilmCardComponent, filmPopupComponent, i);
        });

      renderedFilmCardCount += FilmCardNumber.FILM_CARD_PER_STEP;

      if (renderedFilmCardCount >= filmCards.length) {
        showMoreButtonComponent.getElement().remove();
        showMoreButtonComponent.removeElement();
      }
    });
  }

  for (const element of filmCardContainerExtra) {
    for (let i = 0; i < FilmCardNumber.FILM_CARD_LIST_EXTRA_COUNT; i++) {
      const filmCardComponent = new FilmCardView(filmCards[i]);
      const filmPopupComponent = new FilmPopupView(filmCards[i]);
      renderElement(element, filmCardComponent.getElement(), RenderPosition.BEFOREEND);
      addEventListenerForFilmCard(filmCardComponent, filmPopupComponent, i);
    }
  }
}
