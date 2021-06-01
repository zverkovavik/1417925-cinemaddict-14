import FilmCardView from '../view/film-card';
import { render, RenderPosition, removeComponent, addPopup, replace } from '../utils/render';
import FilmPopupView from '../view/film-info';
import { Mode, UserAction, UpdateType, State } from '../constants';
import CommentsModel from '../model/comments';

const bodyElement = document.querySelector('body');
export default class FilmCard {
  constructor(filmCardListContainer, changeData, changeMode, api) {
    this._container = filmCardListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._api = api;

    this._filmCardComponent = null;
    this._filmPopupComponent = null;

    this._filmCardOpenPopupClickHandler = this._filmCardOpenPopupClickHandler.bind(this);
    this._closeHandler = this._closeHandler.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleAddFavoriteClick = this._handleAddFavoriteClick.bind(this);
    this._handleAlreadyWatchedClick = this._handleAlreadyWatchedClick.bind(this);

    this._handlePopupWatchlistClick = this._handlePopupWatchlistClick.bind(this);
    this._handlePopupAddFavoriteClick = this._handlePopupAddFavoriteClick.bind(this);
    this._handlePopupAlreadyWatchedClick = this._handlePopupAlreadyWatchedClick.bind(this);
    this._handleDeleteCommentClick = this._handleDeleteCommentClick.bind(this);
    this._handleSubmitCommentKeyDown = this._handleSubmitCommentKeyDown.bind(this);
    this._mode = Mode.DEFAULT;
  }

  init(filmCard, container) {
    this._filmCard = filmCard;
    this._commentsModel = new CommentsModel();

    const prevFilmCardComponent = this._filmCardComponent;
    const prevFilmPopupComponent = this._filmPopupComponent;

    this._filmCardComponent = new FilmCardView(filmCard);
    this._setFilmCardHandlers();

    this._api.getComments(filmCard.id).then((comments) => {
      this._commentsModel.setComments(comments);
      this._filmPopupComponent = new FilmPopupView(filmCard, comments);
      this._filmPopupComponent.updateElement();
    })
      .catch(this._commentsModel.setComments([]));

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
      const scrollTopPosition = prevFilmPopupComponent.getElement().scrollTop;
      replace(this._filmPopupComponent, prevFilmPopupComponent);
      this._filmPopupComponent.getElement().scrollTop = scrollTopPosition;
      this._setPopupHandlers();
    }

    removeComponent(prevFilmCardComponent);
    removeComponent(prevFilmPopupComponent);
  }

  setViewState(state, actionType = null, id = null) {
    switch(state) {
      case State.SAVING:
        this._filmPopupComponent.updateData({
          isSaving: true,
        });
        break;
      case State.DELETING:
        this._filmPopupComponent.updateData({
          deletedCommentId: id,
        });
        break;
      case State.ABORTING:
        this._filmPopupComponent.updateData({
          deletedCommentId: null,
          isSaving: false,
        });
        this._filmPopupComponent.shake(actionType, id);
        break;
    }
  }


  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._closePopup();
      this._removePopupHandlers();
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
    this._filmPopupComponent.setAlreadyWatchedClickHandler(this._handlePopupAlreadyWatchedClick);
    this._filmPopupComponent.setFavoriteClickHandler(this._handlePopupAddFavoriteClick);
    this._filmPopupComponent.setWatchlistClickHandler(this._handlePopupWatchlistClick);
    this._filmPopupComponent.setCommentDeleteClickHandler(this._handleDeleteCommentClick);
    this._filmPopupComponent.setSubmitKeyDownHandler(this._handleSubmitCommentKeyDown);
    this._filmPopupComponent.setClosePopupClickHandler(this._closeHandler);
    this._filmPopupComponent.setEscKeyDownHandler(this._closeHandler);
    this._filmPopupComponent.setCommentDeleteClickHandler(this._handleDeleteCommentClick);
  }

  _removePopupHandlers() {
    this._filmPopupComponent.removeHandlers();
  }

  _closeHandler() {
    this._closePopup(this._filmPopupComponent);
  }

  _closePopup () {
    removeComponent(this._filmPopupComponent);
    bodyElement.classList.remove('hide-overflow');
    this._removePopupHandlers();
    this._mode = Mode.DEFAULT;
  }

  _showPopup() {
    addPopup(this._filmPopupComponent);
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
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
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
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
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
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
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

  _handlePopupAddFavoriteClick(data) {
    this._changeData(
      UserAction.UPDATE_FILM,
      UpdateType.PATCH,
      Object.assign(
        {},
        data,
        {
          userDetails:
          Object.assign(
            {},
            data.userDetails,
            {
              isFavorite: !data.userDetails.isFavorite,
            },
          ),
        },
      ),
    );
  }

  _handlePopupAlreadyWatchedClick(data) {
    this._changeData(
      UserAction.UPDATE_FILM,
      UpdateType.PATCH,
      Object.assign(
        {},
        data,
        {
          userDetails:
          Object.assign(
            {},
            data.userDetails,
            {
              isAlreadyWatched: !data.userDetails.isAlreadyWatched,
            },
          ),
        },
      ),
    );
  }

  _handlePopupWatchlistClick(data) {
    this._changeData(
      UserAction.UPDATE_FILM,
      UpdateType.PATCH,
      Object.assign(
        {},
        data,
        {
          userDetails:
          Object.assign(
            {},
            data.userDetails,
            {
              isInWatchlist: !data.userDetails.isInWatchlist,
            },
          ),
        },
      ),
    );
  }

  _handleDeleteCommentClick(update) {
    this._changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.PATCH,
      update);
  }

  _handleSubmitCommentKeyDown(update) {
    this._changeData(
      UserAction.ADD_COMMENT,
      UpdateType.PATCH,
      update,
    );
  }
}
