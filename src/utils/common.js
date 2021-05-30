import { TimeRange } from '../constants';
import dayjs from 'dayjs';

const SHAKE_ANIMATION_TIMEOUT = 600;

export const sortByDate = (dateA, dateB) => {
  return dayjs(dateB.filmInfo.release.date).diff(dayjs(dateA.filmInfo.release.date));
};

export const sortByRating = (genreA, genreB) => {
  return genreB.filmInfo.totalRating - genreA.filmInfo.totalRating;
};

export const sortByComments = (commentNumberA, commentNumberB) => {
  return commentNumberB.comments.length - commentNumberA.comments.length;
};

export const sortGenres = (genreA, genreB) => {
  return genreB.count - genreA.count;
};

export const getGenreList = (films) => {
  let sumArray = [];
  films.forEach((film) => {
    return sumArray = sumArray.concat(film.filmInfo.genre);
  });

  const genreList = Array.from(new Set(sumArray));
  const genres = genreList.map((genre) => {
    return {
      genre: genre,
      count: (sumArray.filter((element) => element === genre)).length,
    };
  });
  return genres;
};

export const getStatisticsByWatchedFilms = (films) => {

  const result = films.slice().reduce((count, film) => {
    count.watched += 1;
    count.runtime += film.filmInfo.runtime;
    return count;
  }, { watched: 0, runtime: 0 });
  return result;
};


export const isWatchingDateInto = (films, range) => {
  let result = [];
  result = range === TimeRange.ALL_TIME ? films.slice() :
    films.slice().filter((film) => {
      const now = new Date();
      return dayjs(film.userDetails.watchingDate).isSame(now, range);
    });
  return result;
};

export const shake = (element) => {
  element.classList.add('shake');
  setTimeout(() => element.classList.remove('shake'), SHAKE_ANIMATION_TIMEOUT);
};
