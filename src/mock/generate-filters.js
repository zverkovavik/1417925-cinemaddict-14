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

