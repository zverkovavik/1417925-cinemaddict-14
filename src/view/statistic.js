import AbstractView from './abstract.js';

const createFilmCardContainerTemplate = (films) => {
  return `<section class="footer__statistics">
    <p>${films.length} movies inside</p>
  </section>`;
};

export default class Films extends AbstractView {
  constructor(films) {
    super();
    this._films = films;
  }
  getTemplate() {
    return createFilmCardContainerTemplate(this._films);
  }
}
