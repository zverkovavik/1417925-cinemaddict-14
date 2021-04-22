import AbstractView from './abstract.js';
const FIRST_ARRAY_ELEMENT = 0;

const createFilmPopupTemplate = (film) => {
  const { filmInfo: { title, totalRating, poster, ageRating, director, writers, actors, release: { date: { fullDate }, releaseCountry }, runtime, genre, description }} = film;

  return `<section class="film-details">
  <form class="film-details__inner" action="" method="get">
  <div class="film-details__top-container">
  <div class="film-details__close">
  <button class="film-details__close-btn" type="button">close</button>
  </div>
  <div class="film-details__info-wrap">
  <div class="film-details__poster">
          <img class="film-details__poster-img" src="${poster}" alt="">

          <p class="film-details__age">${ageRating}</p>
        </div>

        <div class="film-details__info">
        <div class="film-details__info-head">
        <div class="film-details__title-wrap">
        <h3 class="film-details__title">${title}</h3>
        <p class="film-details__title-original">Original: ${title}</p>
        </div>

        <div class="film-details__rating">
        <p class="film-details__total-rating">${totalRating}</p>
        </div>
        </div>

        <table class="film-details__table">
        <tr class="film-details__row">
        <td class="film-details__term">Director</td>
        <td class="film-details__cell">${director}</td>
        </tr>
        <tr class="film-details__row">
        <td class="film-details__term">Writers</td>
        <td class="film-details__cell">${writers}</td>
        </tr>
        <tr class="film-details__row">
        <td class="film-details__term">Actors</td>
        <td class="film-details__cell">${actors}</td>
        </tr>
        <tr class="film-details__row">
        <td class="film-details__term">Release Date</td>
        <td class="film-details__cell">${fullDate}</td>
        </tr>
        <tr class="film-details__row">
        <td class="film-details__term">Runtime</td>
        <td class="film-details__cell">${runtime}</td>
        </tr>
        <tr class="film-details__row">
        <td class="film-details__term">Country</td>
        <td class="film-details__cell">${releaseCountry}</td>
        </tr>
        <tr class="film-details__row">
        <td class="film-details__term">Genres</td>
        <td class="film-details__cell">
        <span class="film-details__genre">${genre[FIRST_ARRAY_ELEMENT]}</span>
        </td>
        </tr>
        </table>

        <p class="film-details__film-description">
        ${description}
        </p>
        </div>
        </div>

        <section class="film-details__controls">
        <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist">
        <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched">
        <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite">
        <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
        </section>
        </div>
            </form>
            </section>`;

};

export default class FilmPopup extends AbstractView {
  constructor(film) {
    super();
    this._film = film;
    this._clickHandler = this._clickHandler.bind(this);
    this._alreadyWatchedClickHandler = this._alreadyWatchedClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
  }

  getTemplate() {
    return createFilmPopupTemplate(this._film);
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  _favoriteClickHandler() {
    this._callback.favoriteClick(this._film);
  }

  _watchlistClickHandler() {
    this._callback.watchlistClick(this._film);
  }

  _alreadyWatchedClickHandler() {
    this._callback.alreadyWatchedClick(this._film);
  }

  setClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().querySelector('.film-details__close-btn').addEventListener('click', this._clickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('#favorite').addEventListener('click', this._favoriteClickHandler);
  }

  setWatchlistClickHandler(callback) {
    this._callback.watchlistClick = callback;
    this.getElement().querySelector('#watchlist').addEventListener('click', this._watchlistClickHandler);
  }

  setAlreadyWatchedClickHandler(callback) {
    this._callback.alreadyWatchedClick = callback;
    this.getElement().querySelector('#watched').addEventListener('click', this._alreadyWatchedClickHandler);
  }
}
