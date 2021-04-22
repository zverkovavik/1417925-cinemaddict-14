import AbstractView from './abstract.js';
import FilmCardView from './film-card.js';
import { FilmCardNumber } from '../constants.js';

const createFilmCardContainerTemplate = (data, title) => {

  const createTemplate = () => {
    let result = '';
    data.slice(0, FilmCardNumber.FILM_CARD_LIST_EXTRA_COUNT).forEach((element) => {
      const filmCardTemplate = new FilmCardView(element);
      result = `${result}${filmCardTemplate.getTemplate()}`;
    });
    return result;
  };

  return `<section class="films-list films-list--extra">
      <h2 class="films-list__title">${title}</h2>
      <div class="films-list__container">
        ${createTemplate()}
      </div>
    </section>
  `;
};

export default class ExtraFilmList extends AbstractView {

  constructor(data, title) {
    super();
    this._data = data;
    this._title = title;
  }

  getTemplate() {
    return createFilmCardContainerTemplate(this._data, this._title);
  }
}
