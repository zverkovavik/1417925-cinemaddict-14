export const createMenu = (filter) => {
  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
      <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${filter[1].count}</span></a>
      <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${filter[2].count}</span></a>
      <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${filter[3].count}</span></a>
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>
  <ul class="sort">
    <li><a href="#" class="sort__button sort__button--active">Sort by default</a></li>
    <li><a href="#" class="sort__button">Sort by date</a></li>
    <li><a href="#" class="sort__button">Sort by rating</a></li>
  </ul>`;
};

const filmToFilterMap = {
  all: (films) => films.length,
  watchlist: (films) => films.filter((film) => film.userDetails.watchlist).length,
  history: (films) => films.filter((film) => film.userDetails.alreadyWatched).length,
  favorites: (films) => films.filter((film) => film.userDetails.favorite).length,
};

export const generateFilters = (films) => {
  return Object.entries(filmToFilterMap).map(([filterName, countFilms]) => {
    return {
      name: filterName,
      count: countFilms(films),
    };
  });
};

export const cb = (evt) => {
  const activeFilter = document.querySelector('.main-navigation__item--active');
  activeFilter.classList.remove('main-navigation__item--active');
  evt.target.classList.add('main-navigation__item--active');
};

const filterbyWatchlist = (data) => {
  let films = data.slice(0, data.length);
  films = data.filter((film) => film.userDetails.watchlist);
  return films;
};

const filterbyHistory = (data) => {
  let films = data.slice(0, data.length);
  films = data.filter((film) => film.userDetails.history);
  return films;
};

const filterbyFavorite = (data) => {
  let films = data.slice(0, data.length);
  films = data.filter((film) => film.userDetails.favorite);
  return films;
};

export { filterbyWatchlist, filterbyHistory, filterbyFavorite };
