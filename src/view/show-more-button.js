import { createMarkupElement } from './utils.js';

const createShowMoreButtonTemplate = () => {
  return `<button class="films-list__show-more">Show more</button>
  `;
};
export default class ShowMoreButton {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createShowMoreButtonTemplate();
  }

  getElement() {
    if(!this._element) {
      this._element = createMarkupElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
