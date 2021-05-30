import SmartView from './smart';
import Chart from 'chart.js';
import { getGenreList, sortGenres, getStatisticsByWatchedFilms,  isWatchingDateInto } from '../utils/common';
import { Rank, TimeRange } from '../constants';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const BAR_HEIGHT = 50;
const typeBar = 'horizontalBar';
const BACKGROUND_COLOR = '#ffe800';
const HOVER_BACKGROUND_COLOR = '#ffe800';
const FONT_SIZE = 20;
const FONT_COLOR = '#ffffff';
const OFFSET = 40;
const TICKS_PADDING = 100;
const BAR_THICKNESS = 24;


const renderChart = (chart, watchedFilms) => {
  const data = getGenreList(watchedFilms).sort(sortGenres);
  const genres = data.map((element) => element.genre);
  const counts = data.map((element) => element.count);

  chart.height = BAR_HEIGHT * genres.length;

  return new Chart(chart, {
    plugins: [ChartDataLabels],
    type: typeBar,
    data: {
      labels: genres,
      datasets: [{
        data: counts,
        backgroundColor: BACKGROUND_COLOR,
        hoverBackgroundColor: HOVER_BACKGROUND_COLOR,
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: FONT_SIZE,
          },
          color: FONT_COLOR,
          anchor: 'start',
          align: 'start',
          offset: OFFSET,
          barThickness: BAR_THICKNESS,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: FONT_COLOR,
            padding: TICKS_PADDING,
            fontSize: FONT_SIZE,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },

        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const createUserRankTemplate = (watchedFilms) => {

  const createTemplate = (userRank) => {
    return `<p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${userRank}</span>
    </p>`;
  };

  if (watchedFilms.length <= 0) {
    return;
  } else if (watchedFilms.length >= 1 && watchedFilms.length <= 10) {
    return createTemplate(Rank.NOVICE);
  } else if (watchedFilms.length >= 11 && watchedFilms.length <= 20) {
    return createTemplate(Rank.FAN);
  } else {
    return createTemplate(Rank.BUFF);
  }
};

const createUserStatisticsTemplate = (films, watchedFilms, range) => {

  let allStats = {};
  if(!watchedFilms.length) {
    allStats.hours = 0;
    allStats.minutes = 0;
    allStats.watched = 0;
    allStats.topGenre = '';
  } else {
    allStats = getStatisticsByWatchedFilms(watchedFilms);
    allStats.hours = Math.floor(allStats.runtime/60);
    allStats.minutes = allStats.runtime % 60;
    allStats.genres = getGenreList(watchedFilms).sort(sortGenres);
    allStats.topGenre = allStats.genres[0].genre;
  }

  return `<section>
  <section class="statistic">
  ${createUserRankTemplate(films)}
    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" ${range === TimeRange.ALL_TIME ? 'checked' : ''}>
      <label for="statistic-all-time" class="statistic__filters-label">All time</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="day" ${range === TimeRange.DAY ? 'checked' : ''}>
      <label for="statistic-today" class="statistic__filters-label">Today</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week" ${range === TimeRange.WEEK ? 'checked' : ''}>
      <label for="statistic-week" class="statistic__filters-label">Week</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month" ${range === TimeRange.MONTH ? 'checked' : ''}>
      <label for="statistic-month" class="statistic__filters-label">Month</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year" ${range === TimeRange.YEAR ? 'checked' : ''}>
      <label for="statistic-year" class="statistic__filters-label">Year</label>
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${allStats.watched}<span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${allStats.hours} <span class="statistic__item-description">h</span>${allStats.minutes} <span class="statistic__item-description">m</p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${allStats.topGenre}</p>
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>

  </section>
  </section>`;
};

export default class UserStats extends SmartView {
  constructor(films) {
    super();
    this._films = films.slice();
    this._watchedFilms = this._films.slice().filter((element) => element.userDetails.isAlreadyWatched);
    this._data = this._watchedFilms;
    this._chart = null;
    this._range = TimeRange.ALL_TIME;

    this._renderChart(this._watchedFilms);

    this._rangeFilterChangeHandler = this._rangeFilterChangeHandler.bind(this);
    this._setRangeFilterChangeHandler();
  }

  getTemplate() {
    return createUserStatisticsTemplate(this._films, this._data, this._range);
  }

  restoreHandlers() {
    this._setRangeFilterChangeHandler();
  }

  _renderChart(data) {
    if (this._chart !== null) {
      this._chart = null;
    }
    if(!data) {
      this._chartPlace.childNode = null;
      return;
    }
    this._chartPlace = this.getElement().querySelector('.statistic__chart');
    this._chart = renderChart(this._chartPlace, data);
    this._chartPlace.childNode = this._chart;
  }

  _setRangeFilterChangeHandler() {
    this.getElement().querySelector('.statistic__filters').addEventListener('change', this._rangeFilterChangeHandler);
  }

  _sortFilmsByTimeRange(range) {
    return isWatchingDateInto(this._watchedFilms, range);
  }

  _rangeFilterChangeHandler(evt) {
    evt.preventDefault();
    this._data = this._sortFilmsByTimeRange(evt.target.value);
    this._range = evt.target.value;
    this.updateData(this._data);
    this._renderChart(this._data);
    evt.target.checked = true;
  }
}
