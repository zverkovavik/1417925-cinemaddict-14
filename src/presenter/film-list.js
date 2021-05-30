
import NoFilmsView from '../view/no-films';
import SortView from '../view/sort';
import FilmCardContainerView from '../view/film-container';
import ShowMoreButtonView from '../view/show-more-button';
import UserStaticticsView from '../view/user-statictics';
import { render, RenderPosition, removeComponent, replace } from '../utils/render';
import { FilmCardNumber, SortType, Title,  UserAction, UpdateType, FilterType } from '../constants';
import FilmCardPresenter from './film-card';
import FilmsView from '../view/films';
import { sortByDate, sortByRating, sortByComments } from '../utils/common';
import { filter } from '../utils/filter';
import LoadingView from '../view/loading';

export default class FilmList {
  constructor(mainBlock, moviesModel, filterModel, api) {

    this._mainBlock = mainBlock;
    this._moviesModel = moviesModel;
    this._filterModel = filterModel;
    this._api = api;

    this._sortComponent = null;
    this._showMoreButtonComponent = null;
    this._topRatedFilmListComponent = null;
    this._mostCommentedFilmListComponent = null;
    this._userStatsComponent = null;

    this._noFilmComponent = new NoFilmsView();
    this._filmsComponent = new FilmsView();
    this._filmCardContainerComponent = new FilmCardContainerView(Title.ALL);
    this._loadingComponent = new LoadingView();

    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._filterModel.addObserver(this._handleModelEvent);
    this._moviesModel.addObserver(this._handleModelEvent);

    this._renderedFilmCardCount = FilmCardNumber.FILM_CARD_PER_STEP;
    this._filmCardContainer = this._filmCardContainerComponent.getElement().querySelector('.films-list__container');
    this._filmsBlockContainer = this._filmsComponent.getElement().querySelector('.films');
    this._filmCardPresenter = {};
    this._currentSortType = SortType.DEFAULT;
    this._isLoading = true;
  }

  init() {
    this._renderBoard();
  }

  _getMovies() {
    const filterType = this._filterModel.getFilter();
    const movies = this._moviesModel.getMovies();
    const filteredMovies = filter[filterType](movies);

    switch(this._currentSortType) {
      case SortType.DATE:
        return filteredMovies.slice().sort(sortByDate);
      case SortType.RATING:
        return filteredMovies.slice().sort(sortByRating);
    }
    return filteredMovies;
  }

  _getComments() {
    return this._commentsModel.getComments();
  }
  _renderLoading() {
    render(this._filmsBlockContainer, this._loadingComponent, RenderPosition.BEFOREEND);
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }
    this._sortComponent = new SortView(this._currentSortType);
    render(this._mainBlock, this._sortComponent, RenderPosition.BEFOREEND);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _handleViewAction(actionType, updateType, update, id = null) {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this._api.updateMovie(update).then((response) => {
          this._moviesModel.updateMovie(updateType, response);
        });
        break;
      case UserAction.ADD_COMMENT:
        this._api.addComment(update, id).then((response) => {
          // console.log(response);
          this._moviesModel.addComment(updateType, response);
        });
        // console.log(update);
        break;
      case UserAction.DELETE_COMMENT:
        this._api.deleteComment(id).then(() => {
          this._moviesModel.deleteComment(updateType, update, id);
        });
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._filmCardPresenter[data.id].init(data, this._filmCardContainer);
        break;
      case UpdateType.MINOR:
        this.clearBoard();
        this._renderBoard();
        break;
      case UpdateType.MAJOR:
        this.clearBoard({resetRenderedFilmCount: true, _currentSortType: true});
        if(this._filterModel.getFilter() === FilterType.STATISTICS) {
          this._renderStats();
          return;
        }
        this._renderBoard();

        break;
      case UpdateType.INIT:
        this._isLoading = false;
        removeComponent(this._loadingComponent);
        this._renderBoard();
        break;
    }
  }

  _renderFilmCard(filmCard, container = this._filmCardContainer) {
    const filmCardPresenter = new FilmCardPresenter(container, this._handleViewAction, this._handleModeChange, this._api);
    filmCardPresenter.init(filmCard, container);
    this._filmCardPresenter[filmCard.id] = filmCardPresenter;
  }

  _renderFilmCards(films, container) {
    films.forEach((filmCard) => this._renderFilmCard(filmCard, container));
  }

  _renderStats() {
    const prevStatsComponent = this._userStatsComponent;
    this._userStatsComponent = new UserStaticticsView(this._moviesModel.getMovies());
    if (prevStatsComponent === null) {
      render(this._mainBlock, this._userStatsComponent, RenderPosition.BEFOREEND);

      return;
    }
    replace(this._userStatsComponent, prevStatsComponent);
    removeComponent(prevStatsComponent);
  }

  _renderNoFilms() {
    render(this._filmCardContainerComponent, this._noFilmComponent, RenderPosition.BEFOREEND);
  }

  _handleShowMoreButtonClick() {
    const moviesCount = this._getMovies().length;
    this._getMovies()
      .slice(this._renderedFilmCardCount, this._renderedFilmCardCount + FilmCardNumber.FILM_CARD_PER_STEP)
      .forEach((element) => this._renderFilmCard(element));
    this._renderedFilmCardCount += FilmCardNumber.FILM_CARD_PER_STEP;

    if (this._renderedFilmCardCount >= moviesCount) {
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

    this._currentSortType = sortType;
    this.clearBoard({resetRenderedFilmCount: true});
    this._renderBoard();
  }

  _renderShowMoreButton() {
    if (this._showMoreButtonComponent !== null) {
      this._showMoreButtonComponent = null;
    }

    this._showMoreButtonComponent = new ShowMoreButtonView();
    render(this._filmCardContainer, this._showMoreButtonComponent, RenderPosition.AFTEREND);
    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);
  }

  _renderBoard() {

    if (!this._isLoading) {
      this._renderSort();
    }

    const filmsCount = this._getMovies().length;
    render(this._mainBlock, this._filmsComponent, RenderPosition.BEFOREEND);
    render(this._filmsBlockContainer, this._filmCardContainerComponent, RenderPosition.BEFOREEND);

    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    if (!this._getMovies().length) {
      this._renderNoFilms();
      return;
    } else {
      const films = this._getMovies().slice(0, Math.min(filmsCount, FilmCardNumber.FILM_CARD_PER_STEP));
      this._renderFilmCards(films);

      if (filmsCount > FilmCardNumber.FILM_CARD_PER_STEP) {
        this._renderShowMoreButton();
      }
      this._renderTopRatedFilmList();
      this._renderMostCommentedFilmList();
    }
  }

  _renderTopRatedFilmList() {
    this._topRatedFilmListComponent = new FilmCardContainerView(Title.TOP, true);
    this._topRatedFilmsContainer = this._topRatedFilmListComponent.getElement().querySelector('.films-list__container');
    const topRatedFilms = this._getMovies().slice().sort(sortByRating).slice(0, FilmCardNumber.FILM_CARD_LIST_EXTRA_COUNT);
    topRatedFilms.forEach((element) => {
      const filmCardPresenter = new FilmCardPresenter(this._topRatedFilmsContainer, this._handleViewAction, this._handleModeChange, this._api);
      filmCardPresenter.init(element, this._topRatedFilmsContainer);
    });
    render(this._filmsBlockContainer, this._topRatedFilmListComponent, RenderPosition.BEFOREEND);
  }

  _renderMostCommentedFilmList() {
    this._mostCommentedFilmListComponent = new FilmCardContainerView(Title.MOST, true);
    this._mostCommentedFilmsContainer = this._mostCommentedFilmListComponent.getElement().querySelector('.films-list__container');
    const mostCommentedFilms = this._getMovies().slice().sort(sortByComments).slice(0, FilmCardNumber.FILM_CARD_LIST_EXTRA_COUNT);
    mostCommentedFilms.forEach((element) => {
      const filmCardPresenter = new FilmCardPresenter(this._mostCommentedFilmsContainer, this._handleViewAction, this._handleModeChange, this._api);
      filmCardPresenter.init(element, this._mostCommentedFilmsContainer);
    });
    render(this._filmsBlockContainer, this._mostCommentedFilmListComponent, RenderPosition.BEFOREEND);
  }

  clearBoard({resetRenderedFilmCount = false, resetSortType = false} = {}) {
    const filmCount = this._getMovies().length;

    Object.values(this._filmCardPresenter)
      .forEach((presenter) => presenter.destroy());
    this._filmCardPresenter = {};
    removeComponent(this._sortComponent);
    removeComponent(this._showMoreButtonComponent);
    removeComponent(this._noFilmComponent);
    removeComponent(this._topRatedFilmListComponent);
    removeComponent(this._mostCommentedFilmListComponent);
    removeComponent(this._loadingComponent);
    removeComponent(this._userStatsComponent);

    if (resetRenderedFilmCount) {
      this._renderedFilmCardCount = FilmCardNumber.FILM_CARD_PER_STEP;
    } else {
      this._renderedFilmCardCount = Math.min(filmCount, this._renderedFilmCardCount);

    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }
}
