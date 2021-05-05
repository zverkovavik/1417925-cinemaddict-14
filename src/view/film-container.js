import AbstractView from './abstract';

const createFilmCardContainerTemplate = (title, isExtraList = false) => {
  let extraClass = '';
  let hideTitleClass = '';

  isExtraList ? extraClass = 'films-list--extra' : hideTitleClass = 'visually-hidden';

  return `<section class="films-list ${extraClass}">
      <h2 class="films-list__title ${hideTitleClass}">${title}</h2>

      <div class="films-list__container">
      </div>
    </section>`;
};

export default class FilmCardContainer extends AbstractView {
  constructor(title, isExtraList) {
    super();
    this._title = title;
    this._isExtraList = isExtraList;
  }

  getTemplate() {
    return createFilmCardContainerTemplate(this._title, this._isExtraList);
  }
}
