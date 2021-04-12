const FIRST_ARRAY_ELEMENT = 0;

export const createFilmInfoPopup = ({ filmInfo: { title, totalRating, poster, ageRating, director, writers, actors, release: { date: { fullDate }, releaseCountry }, runtime, genre, description }}) => {


  return `<section class="film-details">
  <form class="film-details__inner" action="" method="get">
  <div class="film-details__top-container">
  <div class="film-details__close">
  <button class="film-details__close-btn" type="button">close</button>
  </div>
  <div class="film-details__info-wrap">
  <div class="film-details__poster">
          <img class="film-details__poster-img" src="${poster}" alt="">

          <p class="film-details__age">${ageRating}</p>
        </div>

        <div class="film-details__info">
        <div class="film-details__info-head">
        <div class="film-details__title-wrap">
        <h3 class="film-details__title">${title}</h3>
        <p class="film-details__title-original">Original: ${title}</p>
        </div>

        <div class="film-details__rating">
        <p class="film-details__total-rating">${totalRating}</p>
        </div>
        </div>

        <table class="film-details__table">
        <tr class="film-details__row">
        <td class="film-details__term">Director</td>
        <td class="film-details__cell">${director}</td>
        </tr>
        <tr class="film-details__row">
        <td class="film-details__term">Writers</td>
        <td class="film-details__cell">${writers}</td>
        </tr>
        <tr class="film-details__row">
        <td class="film-details__term">Actors</td>
        <td class="film-details__cell">${actors}</td>
        </tr>
        <tr class="film-details__row">
        <td class="film-details__term">Release Date</td>
        <td class="film-details__cell">${fullDate}</td>
        </tr>
        <tr class="film-details__row">
        <td class="film-details__term">Runtime</td>
        <td class="film-details__cell">${runtime}</td>
        </tr>
        <tr class="film-details__row">
        <td class="film-details__term">Country</td>
        <td class="film-details__cell">${releaseCountry}</td>
        </tr>
        <tr class="film-details__row">
        <td class="film-details__term">Genres</td>
        <td class="film-details__cell">
        <span class="film-details__genre">${genre[FIRST_ARRAY_ELEMENT]}</span>
        </td>
        </tr>
        </table>

        <p class="film-details__film-description">
        ${description}
        </p>
        </div>
        </div>

        <section class="film-details__controls">
        <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist">
        <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched">
        <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite">
        <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
        </section>
        </div>
            </form>
            </section>`;

};

export const createGenre = (genres) => {
  const genreCell = document.querySelector('.film-details__genre');
  const genreContainer = genreCell.parentNode;
  genreContainer.removeChild(genreCell);
  for (const element of genres) {
    const genreCellTemplate = genreCell.cloneNode(true);
    const newGenre = genreContainer.appendChild(genreCellTemplate);
    newGenre.textContent = element;
  }
};
