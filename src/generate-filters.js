const filmToFilterMap = {
  All: (films) => films.length,
  Watchlist: (films) => films.filter((film) => film.userDetails.isInWatchlist).length,
  History: (films) => films.filter((film) => film.userDetails.isAlreadyWatched).length,
  Favorites: (films) => films.filter((film) => film.userDetails.isFavorite).length,
};

export const generateFilters = (films) => {
  return Object.entries(filmToFilterMap).map(([filterName, countFilms]) => {
    return {
      name: filterName,
      count: countFilms(films),
    };
  });
};
