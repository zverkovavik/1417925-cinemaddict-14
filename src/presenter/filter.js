import FilterView from '../view/filter-menu';
import { render, RenderPosition, replace, removeComponent } from '../utils/render';
import { filter } from '../utils/filter';
import { FilterType, UpdateType, FilterName } from '../constants';

export default class Filter {
  constructor(filterContainer, filterModel, moviesModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._moviesModel = moviesModel;

    this._filterComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeClick = this._handleFilterTypeClick.bind(this);

    this._moviesModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    const filters = this._getFilters();
    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new FilterView(filters, this._filterModel.getFilter());
    this._filterComponent.setFilterTypeClickHandler(this._handleFilterTypeClick);

    if (prevFilterComponent === null) {
      render(this._filterContainer, this._filterComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    removeComponent(prevFilterComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeClick(filterType) {
    if (this._filterModel.getFilter() === filterType) {
      return;
    }
    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  _getFilters() {
    const movies = this._moviesModel.getMovies();

    return [
      {
        type: FilterType.ALL,
        name: FilterName.ALL,
        count: filter[FilterType.ALL](movies).length,
      },
      {
        type: FilterType.FAVORITE,
        name: FilterName.FAVORITE,
        count: filter[FilterType.FAVORITE](movies).length,
      },
      {
        type: FilterType.ALREADY_WATCHED,
        name: FilterName.HISTORY,
        count: filter[FilterType.ALREADY_WATCHED](movies).length,
      },
      {
        type: FilterType.WATCHLIST,
        name: FilterName.WATCHLIST,
        count: filter[FilterType.WATCHLIST](movies).length,
      },
    ];
  }
}
