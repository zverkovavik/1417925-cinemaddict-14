import AbstractView from './abstract.js';

const Rank = {
  NOVICE: 'Novice',
  FAN: 'Fan',
  BUFF: 'Movie buff',
};

const createUserRankTemplate = (films) => {
  const sortedFilms = films.filter((element) => element.userDetails.isAlreadyWatched);

  const createTemplate = (userRank) => {
    return `<section class="header__profile profile">
    <p class="profile__rating">${userRank}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
  };

  if (sortedFilms.length <= 0) {
    return;
  } else if (sortedFilms.length >= 1 && sortedFilms.length <= 10) {
    return createTemplate(Rank.NOVICE);
  } else if (sortedFilms.length >= 11 && sortedFilms.length <= 20) {
    return createTemplate(Rank.FAN);
  } else {
    return createTemplate(Rank.BUFF);
  }


};
export default class UserRank extends AbstractView {

  constructor(films) {
    super();
    this._films = films;
  }
  getTemplate() {
    return createUserRankTemplate(this._films);
  }
}
