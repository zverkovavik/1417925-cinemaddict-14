import AbstractView from './abstract.js';

const createFilmCardContainerTemplate = () => {
  return `<section>
  <section class="films">
   </section>
   </section>`;
};

export default class Films extends AbstractView {

  getTemplate() {
    return createFilmCardContainerTemplate();
  }
}
