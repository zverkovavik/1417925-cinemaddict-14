
import NoFilmsView from '../view/no-films.js';
import FilterMenuView from '../view/filter-menu.js';
import SortView from '../view/sort.js';
import FilmCardContainerView from '../view/film-container.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import { render, RenderPosition, removeComponent } from '../utils/render.js';
import { FilmCardNumber, SortType } from '../constants.js';
import UserRankView from '../view/user-rank.js';
import FilmCardPresenter from './film-card.js';
import ExtraFilmListView from '../view/film-list-extra.js';
import { updateItem, sortByDate, sortByRating, sortByComments } from '../utils/common.js';

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
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._renderedFilmCardCount = FilmCardNumber.FILM_CARD_PER_STEP;
    this._filmCardContainer = this._filmCardContainerComponent.getElement().querySelector('.films-list__container');
    this._extraFilmsContainer = this._filmCardContainerComponent.getElement().querySelector('.films-list');
    this._filmCardPresenter = {};
    this._currentSortType = SortType.DEFAULT;
  }

  init(filmCards, filters, comments) {
    this._filmCards = filmCards.slice();
    this._sourceFilmCards = filmCards.slice();

    this._filters = filters.slice();
    this._comments = comments.slice();
    render(headerElement, this._userRankComponent, RenderPosition.BEFOREEND);
    this._renderPage();
  }

  _renderFilters() {
    this._filterMenuComponent = new FilterMenuView(this._filters);
    render(this._filmList, this._filterMenuComponent, RenderPosition.BEFOREEND);
  }

  _renderSort() {
    render(this._filterMenuComponent, this._sortComponent, RenderPosition.AFTEREND);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _handleFilmCardChange(updatedFilmCard) {
    this._filmCards = updateItem(this._filmCards, updatedFilmCard);
    this._sourceFilmCards = updateItem(this._sourceFilmCards, updatedFilmCard);
    this._filmCardPresenter[updatedFilmCard.id].init(updatedFilmCard, this._filmCardContainer, this._comments);
  }

  _sortFilmCards(sortType) {

    switch(sortType) {
      case SortType.DATE:
        this._filmCards.sort(sortByDate);
        break;
      case SortType.RATING:
        this._filmCards.sort(sortByRating);
        break;
      default:
        this._filmCards = this._sourceFilmCards.slice();
    }
    this._currentSortType = sortType;
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

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortFilmCards(sortType);
    this._clearFilmList();
    this._renderFilmCardList();
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

  _renderTopRatedFilmList() {
    const topRatedFilms = this._filmCards.slice().sort(sortByRating);
    this._topRatedFilmListComponent = new ExtraFilmListView(topRatedFilms, 'Top rated');
    render(this._extraFilmsContainer, this._topRatedFilmListComponent, RenderPosition.AFTEREND);
  }

  _renderMostCommentedFilmList() {
    const mostCommentedFilms = this._filmCards.slice().sort(sortByComments);
    this._mostCommentedFilmListComponent = new ExtraFilmListView(mostCommentedFilms, 'Most Commented');
    render(this._extraFilmsContainer, this._mostCommentedFilmListComponent, RenderPosition.AFTEREND);
  }

  _renderPage() {
    this._renderFilters(this._filters);
    this._renderSort();
    render(this._filmList, this._filmCardContainerComponent, RenderPosition.BEFOREEND);

    if (!this._filmCards.length) {
      this._renderNoFilms();
    } else {
      this._renderTopRatedFilmList();
      this._renderMostCommentedFilmList();
      this._renderFilmCardList();
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
