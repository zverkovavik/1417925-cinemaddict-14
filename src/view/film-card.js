import AbstractView from './abstract';
import dayjs from 'dayjs';
import { returnDurationInHoursMinutes } from '../utils/random-number-and-date';

const FIRST_ARRAY_ELEMENT = 0;
const checkDescriptionLength = (element) => {
  return element.length > 140 ? element.slice(0, 139).concat('...') : element;
};

const createFilmCardTemplate = (film) => {
  const { comments, filmInfo: { title, poster, totalRating, release: { date }, runtime, genre, description }, userDetails: { isInWatchlist, isAlreadyWatched, isFavorite }} = film;
  return `<article class="film-card">
          <h3 class="film-card__title">${title}</h3>
          <p class="film-card__rating">${totalRating}</p>
          <p class="film-card__info">
            <span class="film-card__year">${dayjs(date).format('YYYY')}</span>
            <span class="film-card__duration">${returnDurationInHoursMinutes(runtime)}</span>
            <span class="film-card__genre">${genre[FIRST_ARRAY_ELEMENT]}</span>
          </p>
          <img src="${poster}" alt="" class="film-card__poster">
          <p class="film-card__description">${checkDescriptionLength(description)}</p>
          <a class="film-card__comments">${comments.length} comments</a>
          <div class="film-card__controls">
            <button class="film-card__controls-item ${isInWatchlist ? ' film-card__controls-item--active': ''} button film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
            <button class="film-card__controls-item ${isAlreadyWatched ? ' film-card__controls-item--active': ''} button film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
            <button class="film-card__controls-item ${isFavorite ? ' film-card__controls-item--active': ''} button film-card__controls-item--favorite" type="button">Mark as favorite</button>
          </div>
        </article>`;
};

export default class FilmCard extends AbstractView {
  constructor(film) {
    super();
    this._film = film;
    this._openPopupClickHandler = this._openPopupClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
    this._alreadyWatchedClickHandler = this._alreadyWatchedClickHandler.bind(this);
  }

  getTemplate() {
    return createFilmCardTemplate(this._film);
  }

  _openPopupClickHandler() {
    this._callback.click();
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  _watchlistClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchlistClick();
  }

  _alreadyWatchedClickHandler(evt) {
    evt.preventDefault();
    this._callback.alreadyWatchedClick();
  }

  setOpenPopupClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().querySelector('.film-card__poster').addEventListener('click', this._openPopupClickHandler);
    this.getElement().querySelector('.film-card__title').addEventListener('click', this._openPopupClickHandler);
    this.getElement().querySelector('.film-card__comments').addEventListener('click', this._openPopupClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('.film-card__controls-item--favorite').addEventListener('click', this._favoriteClickHandler);
  }

  setWatchlistClickHandler(callback) {
    this._callback.watchlistClick = callback;
    this.getElement().querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this._watchlistClickHandler);
  }

  setAlreadyWatchedClickHandler(callback) {
    this._callback.alreadyWatchedClick = callback;
    this.getElement().querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this._alreadyWatchedClickHandler);
  }

  removeHandlers() {
    this._callback = {};

    this.getElement().removeEventListener('click', this._openPopupClickHandler);
    this.getElement().removeEventListener('click', this._watchlistClickHandler);
    this.getElement().removeEventListener('click', this._alreadyWatchedClickHandler);
    this.getElement().removeEventListener('click', this._favoriteClickHandler);
  }
}
