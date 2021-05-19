import AbstractView from './abstract';

const createFilterItemTemplate = (filter, currentFilterType) => {
  const { type, name, count} = filter;
  return `
      <a href="#${name}" id="#${type}" class="main-navigation__item ${type === currentFilterType ? 'main-navigation__item--active' : ''}"> ${name} ${name !== 'All movies' ? '<span class="main-navigation__item-count">' + `${count}` + '</span>' : ''} </a>`;
};

const createFilterTemplate = (filterElements, currentFilterType) => {
  const filterElementsTemplate = filterElements.slice(0, filterElements.length).map((filter) => createFilterItemTemplate(filter, currentFilterType)).join('');
  return `<nav class="main-navigation">
    <div class="main-navigation__items">
    ${filterElementsTemplate}
    </div>
    <a href="#stats" id="Statistics" class="main-navigation__additional ${currentFilterType === 'Statistics' ? 'main-navigation__additional--active' : ''}">Stats</a>
  </nav>`;
};

export default class Filter extends AbstractView {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilterType;

    this._filterTypeClickHandler = this._filterTypeClickHandler.bind(this);
  }

  getTemplate() {
    return createFilterTemplate(this._filters, this._currentFilter);
  }

  _filterTypeClickHandler(evt) {
    evt.preventDefault();
    const filterName = (evt.target.id).split('#').slice(-1).toString();
    this._callback.filterTypeClick(filterName);
  }

  setFilterTypeClickHandler(callback) {
    this._callback.filterTypeClick = callback;
    this.getElement().addEventListener('click', this._filterTypeClickHandler);
  }
}


