import { FilterType } from '../constants';

export const filter = {
  [FilterType.ALL]: (films) => films,
  [FilterType.WATCHLIST]: (films) => films.filter((film) => film.userDetails.isInWatchlist),
  [FilterType.ALREADY_WATCHED]: (films) => films.filter((film) => film.userDetails.isAlreadyWatched),
  [FilterType.FAVORITE]: (films) => films.filter((film) => film.userDetails.isFavorite),
};

