
import NoFilmsView from '../view/no-films';
import FilterMenuView from '../view/filter-menu';
import SortView from '../view/sort';
import FilmCardContainerView from '../view/film-container';
import ShowMoreButtonView from '../view/show-more-button';
import { render, RenderPosition, removeComponent } from '../utils/render';
import { FilmCardNumber, SortType, Title } from '../constants';
import FilmCardPresenter from './film-card';
import FilmsView from '../view/films';
import { updateItem, sortByDate, sortByRating, sortByComments } from '../utils/common';

export default class FilmList {
  constructor(mainBlock) {
    this._mainBlock = mainBlock;
    this._noFilmComponent = new NoFilmsView();
    this._filterMenuComponent = new FilterMenuView();
    this._sortComponent = new SortView();
    this._filmsComponent = new FilmsView();
    this._filmCardContainerComponent = new FilmCardContainerView(Title.ALL);
    this._showMoreButtonComponent = new ShowMoreButtonView();

    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleFilmCardChange = this._handleFilmCardChange.bind(this);
    this._handleFilmCardExtraChange = this._handleFilmCardExtraChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._renderedFilmCardCount = FilmCardNumber.FILM_CARD_PER_STEP;
    this._filmCardContainer = this._filmCardContainerComponent.getElement().querySelector('.films-list__container');
    this._filmsBlockContainer = this._filmsComponent.getElement().querySelector('.films');
    this._topRatedFilmListComponent = new FilmCardContainerView(Title.TOP, true);
    this._topRatedFilmsContainer = this._topRatedFilmListComponent.getElement().querySelector('.films-list__container');
    this._mostCommentedFilmListComponent = new FilmCardContainerView(Title.MOST, true);
    this._mostCommentedFilmsContainer = this._mostCommentedFilmListComponent.getElement().querySelector('.films-list__container');
    this._filmCardPresenter = {};
    this._filmCardExtraPresenter = {};
    this._currentSortType = SortType.DEFAULT;
  }

  init(filmCards, filters, comments) {
    this._filmCards = filmCards.slice();
    this._sourceFilmCards = filmCards.slice();

    this._filters = filters.slice();
    this._comments = comments.slice();
    this._renderPage();
  }

  _renderFilters() {
    this._filterMenuComponent = new FilterMenuView(this._filters);
    render(this._mainBlock, this._filterMenuComponent, RenderPosition.BEFOREEND);
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

  _handleFilmCardExtraChange(updatedFilmCard) {
    this._filmCards = updateItem(this._filmCards, updatedFilmCard);
    this._filmCardExtraPresenter[updatedFilmCard.id].init(updatedFilmCard, this._topRatedFilmListComponent, this._comments);
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
    render(this._filmCardContainer, this._showMoreButtonComponent, RenderPosition.AFTEREND);
    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);
  }

  _renderFilmCardList() {
    this._renderFilmCards(0, Math.min(this._filmCards.length, FilmCardNumber.FILM_CARD_PER_STEP));
    if (this._filmCards.length > FilmCardNumber.FILM_CARD_PER_STEP) {
      this._renderShowMoreButton();
    }
  }

  _renderTopRatedFilmList() {
    const topRatedFilms = this._filmCards.slice().sort(sortByRating).slice(0, FilmCardNumber.FILM_CARD_LIST_EXTRA_COUNT);
    topRatedFilms.forEach((element) => {
      const filmCardPresenter = new FilmCardPresenter(this._topRatedFilmsContainer, this._handleFilmCardExtraChange, this._handleModeChange);
      filmCardPresenter.init(element, this._topRatedFilmsContainer, this._comments);
      this._filmCardExtraPresenter[element.id] = filmCardPresenter;
    });
    render(this._filmsBlockContainer, this._topRatedFilmListComponent, RenderPosition.BEFOREEND);
  }

  _renderMostCommentedFilmList() {
    const mostCommentedFilms = this._filmCards.slice().sort(sortByComments).slice(0, FilmCardNumber.FILM_CARD_LIST_EXTRA_COUNT);
    mostCommentedFilms.forEach((element) => {
      const filmCardPresenter = new FilmCardPresenter(this._mostCommentedFilmsContainer, this._handleFilmCardExtraChange, this._handleModeChange);
      filmCardPresenter.init(element, this._mostCommentedFilmsContainer, this._comments);
      this._filmCardExtraPresenter[element.id] = filmCardPresenter;
    });
    render(this._filmsBlockContainer, this._mostCommentedFilmListComponent, RenderPosition.BEFOREEND);
  }

  _renderPage() {
    this._renderFilters(this._filters);
    this._renderSort();
    render(this._mainBlock, this._filmsComponent, RenderPosition.BEFOREEND);
    render(this._filmsBlockContainer, this._filmCardContainerComponent, RenderPosition.BEFOREEND);

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
