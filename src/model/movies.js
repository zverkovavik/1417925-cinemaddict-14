import Observer from '../utils/observer';

export default class Movies extends Observer {
  constructor() {
    super();
    this._movies= [];
  }

  setMovies(updateType, movies) {
    this._movies = movies.slice();

    this._notify(updateType);
  }

  getMovies() {
    return this._movies;
  }

  updateMovie(updateType, update) {
    const index = this._movies.findIndex((item) => item.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting movie');
    }

    this._movies = [
      ...this._movies.slice(0, index),
      update,
      ...this._movies.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addComment(updateType, update) {
    this._movies = [
      update,
      ...this._comments,
    ];

    this._notify(updateType, update);
  }

  deleteComment(updateType, update) {
    const index = this._movies.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    this._movies = [
      ...this._movies.slice(0, index),
      ...this._movies.slice(index + 1),
    ];

    this._notify(updateType);
  }

  static adaptToClient(film) {
    const adaptedFilm = Object.assign(
      {},
      film,
      {
        filmInfo: {
          title: film.film_info.title,
          alternativeTitle: film.film_info.alternative_title,
          totalRating: film.film_info.total_rating,
          poster: film.film_info.poster,
          ageRating: film.film_info.age_rating,
          director: film.film_info.director,
          writers: film.film_info.writers,
          actors: film.film_info.actors,
          release: {
            date: film.film_info.release.date,
            releaseCountry: film.film_info.release.release_country,
          },
          runtime: film.film_info.runtime,
          genre: film.film_info.genre,
          description: film.film_info.description,
        },
        userDetails: {
          isInWatchlist: film.user_details.watchlist,
          isAlreadyWatched: film.user_details.already_watched,
          watchingDate: film.user_details.watching_date,
          isFavorite: film.user_details.favorite,
        },
      },
    );

    delete adaptedFilm.film_info;
    delete adaptedFilm.user_details;

    return adaptedFilm;
  }

  static adaptToServer(film) {
    const adaptedFilm = Object.assign(
      {},
      film,
      {
        'film_info': {
          'title': film.filmInfo.title,
          'alternative_title': film.filmInfo.alternativeTitle,
          'total_rating': film.filmInfo.totalRating,
          'poster': film.filmInfo.poster,
          'age_rating': film.filmInfo.ageRating,
          'director': film.filmInfo.director,
          'writers': film.filmInfo.writers,
          'actors': film.filmInfo.actors,
          'release': {
            'date': film.filmInfo.release.date,
            'release_country': film.filmInfo.release.releaseCountry,
          },
          'runtime': film.filmInfo.runtime,
          'genre': film.filmInfo.genre,
          'description': film.filmInfo.description,
        },
        'user_details': {
          'watchlist': film.userDetails.isInWatchlist,
          'already_watched': film.userDetails.isAlreadyWatched,
          'watching_date': film.userDetails.watchingDate,
          'favorite': film.userDetails.isFavorite,
        },
      },
    );

    delete adaptedFilm.filmInfo;
    delete adaptedFilm.userDetails;


    return adaptedFilm;
  }
}
