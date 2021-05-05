import FilmCardView from '../view/film-card.js';
// import CommentView from '../view/comments.js';
import { render, RenderPosition, removeComponent, addPopup, replace } from '../utils/render.js';
import FilmPopupView from '../view/film-info.js';
import { Mode } from '../constants.js';

const bodyElement = document.querySelector('body');
export default class FilmCard {
  constructor(filmCardListContainer, changeData, changeMode) {
    this._container = filmCardListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._filmCardComponent = null;
    this._filmPopupComponent = null;

    this._filmCardOpenPopupClickHandler = this._filmCardOpenPopupClickHandler.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleAddFavoriteClick = this._handleAddFavoriteClick.bind(this);
    this._handleAlreadyWatchedClick = this._handleAlreadyWatchedClick.bind(this);
    this._mode = Mode.DEFAULT;
  }

  init(filmCard, container, comments) {
    this._filmCard = filmCard;
    this._comments = comments;

    const prevFilmCardComponent = this._filmCardComponent;
    const prevFilmPopupComponent = this._filmPopupComponent;

    this._filmCardComponent = new FilmCardView(filmCard);
    this._filmPopupComponent = new FilmPopupView(filmCard, this._comments[filmCard.comments]);

    this._setFilmCardHandlers();

    if (prevFilmCardComponent === null || prevFilmPopupComponent === null) {
      this._renderFilmCard(container);
      return;
    }

    if (this._container.contains(prevFilmCardComponent.getElement())) {
      replace(this._filmCardComponent, prevFilmCardComponent);
      this._filmCardOpenPopupClickHandler(this._filmPopupComponent);
      this._setFilmCardHandlers();
    }

    if (this._mode === Mode.POPUP) {
      replace(this._filmPopupComponent, prevFilmPopupComponent);
      this._setPopupHandlers();
      document.addEventListener('keydown', this._escKeyDownHandler);
      this._filmPopupComponent.setClosePopupClickHandler(() => {
        this._closePopup();
      });
    }

    removeComponent(prevFilmCardComponent);
    removeComponent(prevFilmPopupComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._closePopup();
    }
  }

  destroy() {
    removeComponent(this._filmCardComponent);
  }

  _filmCardOpenPopupClickHandler() {
    this._filmCardComponent.setOpenPopupClickHandler(() => this._showPopup(this._filmPopupComponent));
  }

  _setFilmCardHandlers() {
    this._filmCardComponent.setAlreadyWatchedClickHandler(this._handleAlreadyWatchedClick);
    this._filmCardComponent.setFavoriteClickHandler(this._handleAddFavoriteClick);
    this._filmCardComponent.setWatchlistClickHandler(this._handleWatchlistClick);
  }

  _setPopupHandlers() {
    this._filmPopupComponent.setAlreadyWatchedClickHandler(this._handleAlreadyWatchedClick);
    this._filmPopupComponent.setFavoriteClickHandler(this._handleAddFavoriteClick);
    this._filmPopupComponent.setWatchlistClickHandler(this._handleWatchlistClick);
  }

  _removeFilmCardHandlers() {
    this._filmCardComponent.removeHandlers();
  }

  _removePopupHandlers() {
    this._filmPopupComponent.removeHandlers();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._closePopup(this._filmPopupComponent);
    }
  }

  _closePopup () {
    removeComponent(this._filmPopupComponent);
    bodyElement.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }

  _showPopup() {
    addPopup(this._filmPopupComponent);
    document.addEventListener('keydown', this._escKeyDownHandler);
    this._filmPopupComponent.setClosePopupClickHandler(() => {
      this._closePopup();
    });
    this._setPopupHandlers();
    this._changeMode();
    this._mode = Mode.POPUP;
  }

  _renderFilmCard(container) {
    render(container, this._filmCardComponent, RenderPosition.BEFOREEND);
    this._filmCardOpenPopupClickHandler(this._filmPopupComponent);
  }

  _handleWatchlistClick() {
    this._changeData(
      Object.assign(
        {},
        this._filmCard,
        {
          userDetails:
          Object.assign(
            {},
            this._filmCard.userDetails,
            {
              isInWatchlist: !this._filmCard.userDetails.isInWatchlist,
            },
          ),
        },
      ),
    );
  }

  _handleAddFavoriteClick() {
    this._changeData(
      Object.assign(
        {},
        this._filmCard,
        {
          userDetails:
          Object.assign(
            {},
            this._filmCard.userDetails,
            {
              isFavorite: !this._filmCard.userDetails.isFavorite,
            },
          ),
        },
      ),
    );
  }

  _handleAlreadyWatchedClick() {
    this._changeData(
      Object.assign(
        {},
        this._filmCard,
        {
          userDetails:
          Object.assign(
            {},
            this._filmCard.userDetails,
            {
              isAlreadyWatched: !this._filmCard.userDetails.isAlreadyWatched,
            },
          ),
        },
      ),
    );
  }

}
