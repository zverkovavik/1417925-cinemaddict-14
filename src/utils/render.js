export const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
};


export const renderElement = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
    case RenderPosition.AFTEREND:
      container.after(element);
  }
};

export const createMarkupElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;
  return newElement.firstChild;
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

export const isEscEvent = (evt) => {
  return evt.key === 'Escape' || evt.key === 'Esc';
};
