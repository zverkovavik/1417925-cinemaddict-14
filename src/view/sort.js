import AbstractView from './abstract';
import { SortType } from '../constants';

const createSortTemplate = (currentSortType) => {
  return `<ul class="sort">
    <li><a href="#" class="sort__button ${currentSortType === SortType.DEFAULT ? 'sort__button--active' : ''}" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
    <li><a href="#" class="sort__button ${currentSortType === SortType.DATE ? 'sort__button--active' : ''}" data-sort-type="${SortType.DATE}">Sort by date</a></li>
    <li><a href="#" class="sort__button ${currentSortType === SortType.RATING ? 'sort__button--active' : ''}" data-sort-type="${SortType.RATING}">Sort by rating</a></li>
  </ul>`;
};

export default class Sort extends AbstractView {
  constructor(currentSortType) {
    super();
    this._sortType = currentSortType;
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSortTemplate(this._sortType);
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener('click', this._sortTypeChangeHandler);
  }
}

