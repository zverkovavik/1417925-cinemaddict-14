
import NoFilmsView from '../view/no-films';
import SortView from '../view/sort';
import FilmCardContainerView from '../view/film-container';
import ShowMoreButtonView from '../view/show-more-button';
import { render, RenderPosition, removeComponent } from '../utils/render';
import { FilmCardNumber, SortType, Title,  UserAction, UpdateType } from '../constants';
import FilmCardPresenter from './film-card';
import FilmsView from '../view/films';
import { sortByDate, sortByRating, sortByComments } from '../utils/common';
import { filter } from '../utils/filter';

export default class FilmList {
  constructor(mainBlock, moviesModel, commentsModel, filterModel) {

    this._mainBlock = mainBlock;
    this._moviesModel = moviesModel;
    this._commentsModel = commentsModel;
    this._filterModel = filterModel;

    this._sortComponent = null;
    this._showMoreButtonComponent = null;
    this._topRatedFilmListComponent = null;
    this._mostCommentedFilmListComponent = null;

    this._noFilmComponent = new NoFilmsView();
    this._filmsComponent = new FilmsView();
    this._filmCardContainerComponent = new FilmCardContainerView(Title.ALL);

    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._filterModel.addObserver(this._handleModelEvent);
    this._commentsModel.addObserver(this._handleModelEvent);
    this._moviesModel.addObserver(this._handleModelEvent);

    this._renderedFilmCardCount = FilmCardNumber.FILM_CARD_PER_STEP;
    this._filmCardContainer = this._filmCardContainerComponent.getElement().querySelector('.films-list__container');
    this._filmsBlockContainer = this._filmsComponent.getElement().querySelector('.films');
    this._filmCardPresenter = {};
    this._currentSortType = SortType.DEFAULT;
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

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }
    this._sortComponent = new SortView(this._currentSortType);
    render(this._mainBlock, this._sortComponent, RenderPosition.BEFOREEND);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _handleViewAction(actionType, updateType, update) {
    // Здесь будем вызывать обновление модели.
    // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
    // update - обновленные данные
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this._moviesModel.updateMovie(updateType, update);
        break;
      case UserAction.ADD_COMMENT:
        this._moviesModel.addComment(updateType, update);
        // this._commentsModel.addComment(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this._moviesModel.deleteComment(updateType, update);
        // this._commentsModel.deleteComment(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    // В зависимости от типа изменений решаем, что делать:
    // - обновить одну карточку
    // - обновить список (мы в фильтре - и изменяем значение этого фильтра)
    // - обновить всю доску (например, при переключении фильтра)
    switch (updateType) {
      case UpdateType.PATCH:
        // - обновить одну карточку
        this._filmCardPresenter[data.id].init(data);
        break;
      case UpdateType.MINOR:
        // - обновить список (мы в фильтре - и изменяем значение этого фильтра)
        this._clearBoard();
        this._renderBoard();
        break;
      case UpdateType.MAJOR:
        this._clearBoard({resetRenderedFilmCount: true, _currentSortType: true});
        this._renderBoard();
        // - обновить всю доску (например, при переключении фильтра)
        break;
    }
  }

  _renderFilmCard(filmCard, container = this._filmCardContainer) {
    const filmCardPresenter = new FilmCardPresenter(container, this._handleViewAction, this._handleModeChange);
    filmCardPresenter.init(filmCard, container, this._getComments());
    this._filmCardPresenter[filmCard.id] = filmCardPresenter;
  }

  _renderFilmCards(films, container) {
    films.forEach((filmCard) => this._renderFilmCard(filmCard, container));
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
    this._clearBoard({resetRenderedFilmCount: true});
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
    const filmsCount = this._getMovies().length;

    this._renderSort();
    render(this._mainBlock, this._filmsComponent, RenderPosition.BEFOREEND);
    render(this._filmsBlockContainer, this._filmCardContainerComponent, RenderPosition.BEFOREEND);

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
      const filmCardPresenter = new FilmCardPresenter(this._topRatedFilmsContainer, this._handleViewAction, this._handleModeChange);
      filmCardPresenter.init(element, this._topRatedFilmsContainer, this._getComments());
    });
    render(this._filmsBlockContainer, this._topRatedFilmListComponent, RenderPosition.BEFOREEND);
  }

  _renderMostCommentedFilmList() {
    this._mostCommentedFilmListComponent = new FilmCardContainerView(Title.MOST, true);
    this._mostCommentedFilmsContainer = this._mostCommentedFilmListComponent.getElement().querySelector('.films-list__container');
    const mostCommentedFilms = this._getMovies().slice().sort(sortByComments).slice(0, FilmCardNumber.FILM_CARD_LIST_EXTRA_COUNT);
    mostCommentedFilms.forEach((element) => {
      const filmCardPresenter = new FilmCardPresenter(this._mostCommentedFilmsContainer, this._handleViewAction, this._handleModeChange);
      filmCardPresenter.init(element, this._mostCommentedFilmsContainer, this._getComments());
    });
    render(this._filmsBlockContainer, this._mostCommentedFilmListComponent, RenderPosition.BEFOREEND);
  }

  _clearBoard({resetRenderedFilmCount = false, resetSortType = false} = {}) {
    const filmCount = this._getMovies().length;

    Object.values(this._filmCardPresenter)
      .forEach((presenter) => presenter.destroy());
    this._filmCardPresenter = {};
    removeComponent(this._sortComponent);
    removeComponent(this._showMoreButtonComponent);
    removeComponent(this._noFilmComponent);
    removeComponent(this._topRatedFilmListComponent);
    removeComponent(this._mostCommentedFilmListComponent);

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
