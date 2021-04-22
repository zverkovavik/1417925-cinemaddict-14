import Abstract from '../view/abstract.js';

export const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
};


export const render = (container, child, place) => {
  if (container instanceof Abstract) {
    container = container.getElement();
  }

  if (child instanceof Abstract) {
    child = child.getElement();
  }

  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(child);
      break;
    case RenderPosition.BEFOREEND:
      container.append(child);
      break;
    case RenderPosition.AFTEREND:
      container.after(child);
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
  for (const child of genres) {
    const genreCellTemplate = genreCell.cloneNode(true);
    const newGenre = genreContainer.appendChild(genreCellTemplate);
    newGenre.textContent = child;
  }
};

export const removeComponent = (component) => {
  if(!(component instanceof Abstract)) {
    throw new Error('Can remove only components');
  }
  component.getElement().remove();
  component.removeElement();
};

const bodyElement = document.querySelector('body');
const footerElement = document.querySelector('footer');
export const addPopup = (popup) => {
  if (popup instanceof Abstract) {
    popup = popup.getElement();
  }
  bodyElement.classList.add('hide-overflow');
  footerElement.appendChild(popup);
};

export const replace = (newChild, oldChild) => {
  if (oldChild instanceof Abstract) {
    oldChild = oldChild.getElement();
  }

  if (newChild instanceof Abstract) {
    newChild = newChild.getElement();
  }

  const parent = oldChild.parentElement;

  if (parent === null || oldChild === null || newChild === null) {
    throw new Error('Can\'t replace unexisting elements');
  }

  parent.replaceChild(newChild, oldChild);
};
