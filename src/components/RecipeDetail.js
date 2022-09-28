import { bool, func, shape } from 'prop-types';
import React from 'react';
import {
  HiHeart,
  HiOutlineHeart,
  HiOutlineShare,
  HiShare,
} from 'react-icons/hi';

function RecipeDetail({
  recipe,
  copyLink,
  linkCopied,
  addToFavorites,
  isFavorite,
}) {
  return (
    <>
      <section className="title-share-favorite">
        <h4 data-testid="recipe-title" className="title">
          {recipe.strMeal || recipe.strDrink}
        </h4>
        <div className="btn-shareAndfavorite-position">
          <button
            className="btn-share-favorite"
            type="button"
            data-testid="share-btn"
            alt="Share icon"
            onClick={ copyLink }
          >
            {linkCopied ? <HiShare /> : <HiOutlineShare />}
          </button>
          <button
            className="btn-share-favorite"
            type="button"
            data-testid="favorite-btn"
            name={ isFavorite ? 'favorite' : 'not-favorite' }
            alt="Favorite icon"
            onClick={ () => addToFavorites(recipe) }
          >
            {isFavorite ? <HiHeart /> : <HiOutlineHeart />}
          </button>
        </div>
      </section>
      <div className="span-category">
        <h6 data-testid="recipe-category" className="category">
          {recipe.strAlcoholic || recipe.strCategory}
        </h6>
      </div>
    </>
  );
}

RecipeDetail.propTypes = {
  recipe: shape({}).isRequired,
  copyLink: func.isRequired,
  linkCopied: bool.isRequired,
  addToFavorites: func.isRequired,
  isFavorite: bool.isRequired,
};

export default RecipeDetail;
