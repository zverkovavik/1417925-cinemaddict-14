import AbstractView from './abstract.js';

export const createCommentTemplate = (comments) => {
  const { author, comment, date, emotion } = comments;

  return `<li class="film-details__comment">
            <span class="film-details__comment-emoji">
              <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
            </span>
            <div>
              <p class="film-details__comment-text">${comment}</p>
              <p class="film-details__comment-info">
                <span class="film-details__comment-author">${author}</span>
                <span class="film-details__comment-day">${date}</span>
                <button class="film-details__comment-delete">Delete</button>
              </p>
            </div>
          </li>`;
};

export default class Comment extends AbstractView{
  constructor(comments) {
    super();
    this._comments = comments;
  }

  getTemplate() {
    return createCommentTemplate(this._comments);
  }
}
