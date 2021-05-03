
import NoFilmsView from '../view/no-films.js';
import FilterMenuView from '../view/filter-menu.js';
import SortView from '../view/sort.js';
import FilmCardContainerView from '../view/film-container.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import { render, RenderPosition, removeComponent } from '../utils/render.js';
import { FilmCardNumber } from '../constants.js';
import UserRankView from '../view/user-rank.js';
import FilmCardPresenter from './film-card.js';
import { updateItem } from '../utils/common.js';

const headerElement = document.querySelector('.header');

export default class FilmList {
  constructor(filmList) {
    this._filmList = filmList;
    this._noFilmComponent = new NoFilmsView();
    this._filterMenuComponent = new FilterMenuView();
    this._sortComponent = new SortView();
    this._userRankComponent = new UserRankView();
    this._filmCardContainerComponent = new FilmCardContainerView();
    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleFilmCardChange = this._handleFilmCardChange.bind(this);
    this._renderedFilmCardCount = FilmCardNumber.FILM_CARD_PER_STEP;
    this._filmCardContainer = this._filmCardContainerComponent.getElement().querySelector('.films-list__container');
    this._filmCardPresenter = {};
  }

  init(filmCards, filters, comments) {
    this._filmCards = filmCards.slice();
    this._filters = filters.slice();
    this._comments = comments.slice();
    render(headerElement, this._userRankComponent, RenderPosition.BEFOREEND);
    this._renderPage();
  }

  _renderFilters() {
    this._filterMenuComponent = new FilterMenuView(this._filters);
    render(this._filmList, this._filterMenuComponent, RenderPosition.BEFOREEND);
    render(this._filterMenuComponent, this._sortComponent, RenderPosition.AFTEREND);
  }

  _handleFilmCardChange(updatedFilmCard) {
    this._filmCards = updateItem(this._filmCards, updatedFilmCard);
    this._filmCardPresenter[updatedFilmCard.id].init(updatedFilmCard, this._filmCardContainer, this._comments);
  }

  _renderFilmCard(filmCard, container = this._filmCardContainer) {
    const filmCardPresenter = new FilmCardPresenter(container, this._handleFilmCardChange, this._handleModeChange);
    filmCardPresenter.init(filmCard, container, this._comments);
    this._filmCardPresenter[filmCard.id] = filmCardPresenter;
  }

  _renderFilmCards(from, to, container) {
    this._filmCards.slice(from, to).forEach((filmCard) => this._renderFilmCard(filmCard, container));
  }

  _renderNoFilms() {
    render(this._filmCardContainerComponent, this._noFilmComponent, RenderPosition.BEFOREEND);
  }

  _handleShowMoreButtonClick() {
    this._filmCards
      .slice(this._renderedFilmCardCount, this._renderedFilmCardCount + FilmCardNumber.FILM_CARD_PER_STEP)
      .forEach((element) => this._renderFilmCard(element));
    this._renderedFilmCardCount += FilmCardNumber.FILM_CARD_PER_STEP;

    if (this._renderedFilmCardCount >= this._filmCards.length) {
      removeComponent(this._showMoreButtonComponent);
    }
  }

  _handleModeChange() {
    Object.values(this._filmCardPresenter).forEach((presenter) => presenter.resetView());
  }

  _renderShowMoreButton() {
    this._filmList = this._filmCardContainerComponent.getElement().querySelector('.films-list');
    render(this._filmList, this._showMoreButtonComponent, RenderPosition.BEFOREEND);
    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);
  }

  _renderFilmCardList() {
    this._renderFilmCards(0, Math.min(this._filmCards.length, FilmCardNumber.FILM_CARD_PER_STEP));
    if (this._filmCards.length > FilmCardNumber.FILM_CARD_PER_STEP) {
      this._renderShowMoreButton();
    }
  }

  _renderExtraFilmLists() {
    this._filmCardContainerExtra = this._filmCardContainerComponent.getElement().querySelectorAll('.films-list--extra .films-list__container');
    for (const element of this._filmCardContainerExtra) {
      this._renderFilmCards(0, FilmCardNumber.FILM_CARD_LIST_EXTRA_COUNT, element);
    }
  }

  _renderPage() {
    this._renderFilters(this._filters);
    render(this._filmList, this._filmCardContainerComponent, RenderPosition.BEFOREEND);
    this._filmCardListExtra = this._filmCardContainerComponent.getElement().querySelectorAll('.films-list--extra');

    if (!this._filmCards.length) {
      this._renderNoFilms();
      for (const element of this._filmCardListExtra) {
        element.remove();
      }
    } else {
      this._renderFilmCardList();
      this._renderExtraFilmLists();
    }
  }

  _clearFilmList() {
    Object.values(this._filmCardPresenter)
      .forEach((presenter) => presenter.destroy());
    this._filmCardPresenter = {};
    this._renderedFilmCardCount = FilmCardNumber.FILM_CARD_PER_STEP;
    removeComponent(this._showMoreButtonComponent);
  }
}
