import { bool, func, number, shape } from 'prop-types';
import React from 'react';
import { HiOutlineShare, HiShare } from 'react-icons/hi';
import favoriteIcon from '../images/blackHeartIcon.svg';

function RecipeListCard({
  recipe,
  index,
  useTags,
  isLinkToClipboard,
  isFavoritePage,
  toRecipePage,
  shareRecipe,
  removeFavorite,
}) {
  const {
    id,
    image,
    name,
    category,
    nationality,
    alcoholicOrNot,
    type,
    doneDate,
    tags,
  } = recipe;
  return (
    <li key={ id } className="recipe">
      <button
        type="button"
        onClick={ () => toRecipePage(type, id) }
        className="recipe-img-btn"
      >
        <img
          src={ image }
          alt={ name }
          data-testid={ `${index}-horizontal-image` }
          className="recipe-img"
        />
      </button>
      <div className="recipe-info">
        <p data-testid={ `${index}-horizontal-top-text` }>
          {`${type === 'food' ? nationality : alcoholicOrNot} - ${category}`}
        </p>
        <button
          type="button"
          onClick={ () => toRecipePage(type, id) }
          className="recipe-title"
        >
          <h3 data-testid={ `${index}-horizontal-name` }>{name}</h3>
        </button>
        {!isFavoritePage && (
          <p data-testid={ `${index}-horizontal-done-date` }>
            {`Done in: ${doneDate}`}
          </p>
        )}
        <div className="tags">
          {useTags
            && tags.slice(0, 2).map((tag) => (
              <p key={ tag } data-testid={ `${index}-${tag}-horizontal-tag` }>
                {tag}
              </p>
            ))}
        </div>
      </div>
      <div className="share-btn">
        <button
          type="button"
          data-testid={ `${index}-horizontal-share-btn` }
          alt="Share icon"
          onClick={ () => shareRecipe(type, id) }
        >
          {isLinkToClipboard[id] ? <HiShare /> : <HiOutlineShare />}
        </button>
        {isFavoritePage && (
          <button
            type="button"
            data-testid={ `${index}-horizontal-favorite-btn` }
            src={ favoriteIcon }
            onClick={ () => removeFavorite(id) }
          >
            <img src={ favoriteIcon } alt="Favorite icon" />
          </button>
        )}
      </div>
    </li>
  );
}

RecipeListCard.defaultProps = {
  index: 0,
  useTags: false,
  isLinkToClipboard: {},
  isFavoritePage: false,
};

RecipeListCard.propTypes = {
  recipe: shape({}).isRequired,
  index: number,
  useTags: bool,
  isLinkToClipboard: shape({}),
  isFavoritePage: bool,
  toRecipePage: func.isRequired,
  shareRecipe: func.isRequired,
  removeFavorite: func.isRequired,
};

export default RecipeListCard;
