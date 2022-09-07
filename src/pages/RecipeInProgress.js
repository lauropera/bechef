import React, { useEffect, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import {
  HiOutlineHeart,
  HiHeart,
  HiOutlineShare,
  HiShare,
} from 'react-icons/hi';
import clipboardCopy from 'clipboard-copy';
import shareIcon from '../images/shareIcon.svg';
import whiteHeart from '../images/whiteHeartIcon.svg';
import blackHeart from '../images/blackHeartIcon.svg';
import useFavorites from '../hooks/useFavorites';
import useRecipe from '../hooks/useRecipe';
import '../styles/RecipeInProgress.css';
import {
  doneRecipe,
  getRecipesInProgress,
  startRecipe,
} from '../services/saveStorage';
import GoBackButton from '../components/GoBackButton';

function RecipeInProgress() {
  const history = useHistory();
  const { pathname } = useLocation();
  const { id } = useParams();
  const [checkSaved, setCheckSaved] = useState([]);
  const [linkCopied, setLinkCopied] = useState(false);
  const [refresh, setRefresh] = useState(true);
  const { recipe, isFetched, ingredients, measures } = useRecipe(pathname, id);
  const { isFavorite, addRecipeToFavorites } = useFavorites(id, pathname);

  const getAndSetProgressRecipes = () => {
    const storageData = getRecipesInProgress();
    const type = pathname.includes('foods') ? 'meals' : 'cocktails';
    const ingredientList = storageData[type][id] || [];
    setCheckSaved([...ingredientList]);
    setRefresh(false);
  };

  useEffect(() => {
    getAndSetProgressRecipes();
  }, []);

  const setProgressRecipe = ({ target }) => {
    const type = pathname.includes('foods') ? 'meals' : 'cocktails';
    let doneIngredients = [...checkSaved, target.name];
    if (target.checked) setCheckSaved(doneIngredients);
    else {
      doneIngredients = checkSaved.filter((element) => element !== target.name);
      setCheckSaved(doneIngredients);
    }
    startRecipe(id, type, doneIngredients);
  };

  const shareRecipe = () => {
    setLinkCopied(true);
    clipboardCopy(window.location.href.split('/in-progress')[0]);
  };

  const finishRecipe = () => {
    history.push('/done-recipes');
    doneRecipe(recipe);
  };

  const checkIngredientsList = (newIngredient) => (
    checkSaved.some((ingredient) => ingredient === newIngredient));

  return (
    <div>
      {isFetched && (
        <main className="recipe-in-progress">
          <GoBackButton />
          <img
            className="recipeImg"
            src={ recipe.strMealThumb || recipe.strDrinkThumb }
            alt={ recipe.strMeal || recipe.strDrink }
            data-testid="recipe-photo"
          />
          <header className="title-share-favorite">
            <h4 data-testid="recipe-title" className="title">
              {recipe.strMeal || recipe.strDrink}
            </h4>
            <div className="btn-shareAndfavorite-position">
              <button
                className="btn-share-favorite"
                type="button"
                data-testid="share-btn"
                src={ shareIcon }
                alt="Share icon"
                onClick={ shareRecipe }
              >
                {linkCopied ? <HiShare /> : <HiOutlineShare />}
              </button>
              <button
                className="btn-share-favorite"
                type="button"
                data-testid="favorite-btn"
                alt="Favorite icon"
                onClick={ addRecipeToFavorites }
              >
                {isFavorite ? <HiHeart /> : <HiOutlineHeart />}
              </button>
            </div>
          </header>
          <div className="span-category">
            <h6 data-testid="recipe-category" className="category">
              {recipe.strCategory}
            </h6>
          </div>
          <section className="Ingredients-Container">
            <h4 className="title-ingredients">Ingredients</h4>
            <div className="ingredient-list">
              {!refresh
              && ingredients.map((ingredient, index) => (
                <div key={ index }>
                  <label
                    data-testid={ `${index}-ingredient-step` }
                    className="margin-zero ingredient-progress"
                    style={ { gap: '0.6rem' } }
                    htmlFor={ `${ingredient} - ${measures[index]}` }
                  >
                    <input
                      type="checkbox"
                      name={ `${ingredient} - ${measures[index]}` }
                      id={ `${ingredient} - ${measures[index]}` }
                      checked={ checkIngredientsList(
                        `${ingredient} - ${measures[index]}`,
                      ) }
                      onChange={ (e) => setProgressRecipe(e) }
                    />
                    <span
                      className={ `${
                        checkIngredientsList(ingredient)
                          ? 'ingredient-check'
                          : ''
                      }` }
                    >
                      {`${ingredient} - ${measures[index]}`}
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </section>
          <section className="Instructions-Container">
            <h4 className="title-instructions">Instructions</h4>
            <div className="instructions-text">
              <p data-testid="instructions" className="text-style">
                {recipe.strInstructions}
              </p>
            </div>
          </section>
          <button
            type="button"
            data-testid="finish-recipe-btn"
            disabled={ ingredients.length !== checkSaved.length }
            onClick={ finishRecipe }
            className="btn btn-secondary btn-login Start-Recipe-Btn"
          >
            Finish Recipe
          </button>
        </main>
      )}
    </div>
  );
}

export default RecipeInProgress;
