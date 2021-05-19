import SmartView from './smart';
import { COMMENT_EMOTIONS } from '../constants';
import dayjs from 'dayjs';
import { isEnterCtrlKeyDown, returnDurationInHoursMinutes } from '../utils/random-number-and-date';
import he from 'he';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

const createFilmPopupTemplate = (film, commentsArr) => {
  const { comments, filmInfo: { title, totalRating, poster, ageRating, director, writers, actors, release: { date, releaseCountry }, runtime, genre, description }, userDetails: { isInWatchlist, isAlreadyWatched, isFavorite }, currentCommentEmoji, currentCommentText } = film;

  const createGenres = (array) => {
    let result = '';
    array.forEach((element) => {
      const template = `<span class="film-details__genre">${element}</span>`;
      result = `${result}${template}`;
    });
    return result;
  };

  const createComments = () => {
    let result = '';

    commentsArr.forEach((element) => {
      const { id, author, date, emotion, comment } = element;
      const template = `<li class="film-details__comment">
              <span class="film-details__comment-emoji">
                <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
              </span>
              <div>
                <p class="film-details__comment-text">${comment.length !== 0 ? he.encode(comment) : ''}</p>
                <p id=${id} class="film-details__comment-info">
                  <span class="film-details__comment-author">${author}</span>
                  <span class="film-details__comment-day">${dayjs(date).fromNow()}</span>
                  <button class="film-details__comment-delete">Delete</button>
                </p>
              </div>
            </li>`;
      result = `${result}${template}`;
    });
    return result;
  };

  const isEmojiChecked = (element) => {
    if (!currentCommentEmoji) {
      return element === 'smile' ? 'checked' : '';
    }
    return element === currentCommentEmoji ? 'checked' : '';
  };

  const createEmojiList = () => {
    const emojiList = COMMENT_EMOTIONS.map((emoji) => {
      return `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji}" value="${emoji}" ${isEmojiChecked(emoji)}>
            <label class="film-details__emoji-label" for="emoji-${emoji}">
              <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="emoji">
            </label>`;
    }).join(' ');
    return emojiList;
  };

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
        <td class="film-details__cell">${dayjs(date).format('DD MMMM YYYY')}</td>
        </tr>
        <tr class="film-details__row">
        <td class="film-details__term">Runtime</td>
        <td class="film-details__cell">${returnDurationInHoursMinutes(runtime)}</td>
        </tr>
        <tr class="film-details__row">
        <td class="film-details__term">Country</td>
        <td class="film-details__cell">${releaseCountry}</td>
        </tr>
        <tr class="film-details__row">
        <td class="film-details__term">Genres</td>
        <td class="film-details__cell">
        ${createGenres(genre)}
        </td>
        </tr>
        </table>

        <p class="film-details__film-description">
        ${description}
        </p>
        </div>
        </div>

        <section class="film-details__controls">
        <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${isInWatchlist ? ' checked': ''}>
        <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${isAlreadyWatched ? ' checked': ''}>
        <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${isFavorite ? ' checked': ''}>
        <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
        </section>
        </div>

        <div class="film-details__bottom-container">
        <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

        <ul class="film-details__comments-list">
        ${createComments()}
        </ul>

        <div class="film-details__new-comment">
          <div class="film-details__add-emoji-label">
            ${currentCommentEmoji ? `<img src="images/emoji/${currentCommentEmoji}.png" width="55" height="55" alt="emoji-${currentCommentEmoji}">` : '<img src="images/emoji/smile.png" width="55" height="55" alt="emoji-smile">'}
          </div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${!currentCommentText ? '' : he.encode(currentCommentText)}</textarea>
          </label>

          <div class="film-details__emoji-list">
            ${createEmojiList()}
          </div>
        </div>
      </section>
    </div>
            </form>
            </section>`;

};

export default class FilmPopup extends SmartView {
  constructor(film, comments) {
    super();
    this._state = FilmPopup.parseDataToState(film);
    this._comments = comments;

    this._closePopupClickHandler = this._closePopupClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
    this._alreadyWatchedClickHandler = this._alreadyWatchedClickHandler.bind(this);
    this._emojiListClickHandler = this._emojiListClickHandler.bind(this);
    this._commentInputHandler = this._commentInputHandler.bind(this);
    this._commentDeleteHandler = this._commentDeleteHandler.bind(this);
    this._submitByKeyDownCombinationHadler = this._submitByKeyDownCombinationHadler.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createFilmPopupTemplate(this._state, this._comments);
  }

  _closePopupClickHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  _favoriteClickHandler() {
    this._callback.favoriteClick();
  }

  _watchlistClickHandler() {
    this._callback.watchlistClick();
  }

  _alreadyWatchedClickHandler() {
    this._callback.alreadyWatchedClick();
  }

  _emojiListClickHandler(evt) {
    if (!evt.target.src) {
      return;
    }
    evt.preventDefault();
    const path = evt.target.src.split('/');
    const emoji = path[path.length - 1].slice(0, -4);
    (emoji);
    this.updateData({
      currentCommentEmoji: emoji,
    });
  }

  _commentInputHandler(evt) {
    evt.preventDefault();
    this.updateData({
      currentCommentText: evt.target.value,
    }, true);
  }

  _commentDeleteHandler(evt) {
    evt.preventDefault();
    const commentId = evt.target.parentNode.id;
    this._callback.deleteClick(FilmPopup.parseStateToData(this._state), commentId);
  }

  _submitByKeyDownCombinationHadler (evt) {
    if(isEnterCtrlKeyDown(evt)) {
      evt.preventDefault();
      this._callback.submitForm(FilmPopup.parseStateToData(this._state));
    }
  }

  setClosePopupClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().querySelector('.film-details__close-btn').addEventListener('click', this._closePopupClickHandler);
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

  setEmojiClickHandler() {
    this.getElement().querySelector('.film-details__emoji-list').addEventListener('click', this._emojiListClickHandler);
  }

  setCommentInputHandler() {
    this.getElement().querySelector('.film-details__comment-input').addEventListener('input', this._commentInputHandler);
  }

  setCommentDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector('.film-details__comment-delete').addEventListener('click', this._commentDeleteHandler);
  }

  setSubmitKeyDownHandler(callback) {
    this._callback.submitForm = callback;
    this.getElement().querySelector('.film-details__comment-input').addEventListener('keydown', this._submitByKeyDownCombinationHadler);
  }

  _setInnerHandlers() {
    this.getElement().querySelector('.film-details__comment-input').addEventListener('input', this._commentInputHandler);
    this.getElement().querySelector('.film-details__comment-delete').addEventListener('click', this._commentDeleteHandler);
    this.getElement().querySelector('.film-details__emoji-list').addEventListener('click', this._emojiListClickHandler);
    this.getElement().querySelector('.film-details__comment-input').addEventListener('keydown', this._submitByKeyDownCombinationHadler);
    this.getElement().querySelector('.film-details__close-btn').addEventListener('click', this._closePopupClickHandler);
    this.getElement().querySelector('#favorite').addEventListener('click', this._favoriteClickHandler);
    this.getElement().querySelector('#watchlist').addEventListener('click', this._watchlistClickHandler);
    this.getElement().querySelector('#watched').addEventListener('click', this._alreadyWatchedClickHandler);
  }

  restoreHandlers() {
    this._setInnerHandlers();
  }

  removeHandlers() {
    this._callback = {};

    this.getElement().removeEventListener('click', this._closePopupClickHandler);
    this.getElement().removeEventListener('click', this._watchlistClickHandler);
    this.getElement().removeEventListener('click', this._alreadyWatchedClickHandler);
    this.getElement().removeEventListener('click', this._favoriteClickHandler);
  }

  static parseDataToState(film) {
    return Object.assign(
      {},
      film,
      {
        currentCommentEmoji: '',
        currentCommentText: '',
      },
    );
  }

  static parseStateToData(film) {
    film = Object.assign({}, film);

    delete film.currentCommentEmoji;
    delete film.currentCommentText;

    return film;
  }
}
