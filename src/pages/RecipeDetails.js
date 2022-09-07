import React, { useContext, useEffect, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import clipboardCopy from 'clipboard-copy';
import {
  getDoneRecipes,
  getRecipesInProgress,
  startRecipe,
} from '../services/saveStorage';
import { RecipesContext } from '../contexts/Contexts';
import SuggestedRecipe from '../components/SuggestedRecipe';
import RecipeCardDetails from '../components/RecipeCardDetails';
import useFavorites from '../hooks/useFavorites';
import useRecipe from '../hooks/useRecipe';
import GoBackButton from '../components/GoBackButton';
import RecipeDetail from '../components/RecipeDetail';
import Instructions from '../components/Instructions';
import '../styles/Recipes.css';
import '../styles/RecipeDetails.css';

function RecipeDetails() {
  const history = useHistory();
  const { pathname } = useLocation();
  const { id } = useParams();
  const { isFavorite, addRecipeToFavorites } = useFavorites(id, pathname);
  const { isNewRecipe } = useContext(RecipesContext);
  const { recipe, isFetched, ingredients, measures } = useRecipe(pathname, id);
  const [isStartedRecipe, setIsStartedRecipe] = useState(false);
  const [isFinishedRecipe, setIsFinishedRecipe] = useState(false);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);

  const questIsStartedRecipe = () => {
    const recipesInProgress = getRecipesInProgress();
    const type = pathname.includes('foods') ? 'meals' : 'cocktails';
    setIsStartedRecipe(!!recipesInProgress[type][id]);
  };

  const questIsFinishedRecipe = () => {
    const doneRecipes = getDoneRecipes();
    setIsFinishedRecipe(doneRecipes.some((doneRecipe) => doneRecipe.id === id));
  };

  useEffect(() => {
    questIsStartedRecipe();
    questIsFinishedRecipe();
  }, [isNewRecipe]);

  const copyLink = () => {
    clipboardCopy(window.location.href);
    setCopiedToClipboard(true);
  };

  const getEmbedId = () => {
    if (isFetched && recipe.strYoutube) {
      return recipe.strYoutube.split('watch?v=')[1];
    }
  };

  const startNewRecipe = () => {
    if (!isStartedRecipe) {
      const recipeType = pathname.includes('foods') ? 'meals' : 'cocktails';
      startRecipe(id, recipeType);
    }
    history.push(`${pathname}/in-progress`);
  };

  return (
    <main className="Recipe-Details-Container">
      {isFetched && (
        <>
          <section className="recipe-Details">
            <GoBackButton />
            <RecipeCardDetails
              imgTestId="recipe-photo"
              nameTestId="recipe-title"
              recipe={ recipe }
              showCategory
            />
            <RecipeDetail
              recipe={ recipe }
              copyLink={ copyLink }
              linkCopied={ copiedToClipboard }
              addToFavorites={ addRecipeToFavorites }
              isFavorite={ isFavorite }
            />
            <section className="Ingredients-Container">
              <h4 className="title-ingredients">Ingredients</h4>
              <div className="ingredient-list">
                {ingredients.map((item, index) => (
                  <p
                    key={ index }
                    data-testid={ `${index}-ingredient-name-and-measure` }
                    className="margin-zero"
                  >
                    {`${item}${measures[index] ? `: ${measures[index]}` : ''}`}
                  </p>
                ))}
              </div>
            </section>
            <Instructions recipe={ recipe } />
            <button
              type="button"
              data-testid="start-recipe-btn"
              disabled={ isFinishedRecipe }
              onClick={ startNewRecipe }
              className="btn btn-secondary btn-login Start-Recipe-Btn"
            >
              {isStartedRecipe ? 'Continue Recipe' : 'Start Recipe'}
            </button>
          </section>
          <section className="Side-Content">
            {pathname.includes('/food') && (
              <div className="video-style">
                <h4>Check this video!</h4>
                <iframe
                  title={ recipe.strMeal }
                  frameBorder="0"
                  data-testid="video"
                  width="320"
                  height="144"
                  allowFullScreen
                  src={ `https://www.youtube.com/embed/${getEmbedId()}` }
                />
              </div>
            )}
            <SuggestedRecipe />
          </section>
        </>
      )}
    </main>
  );
}

export default RecipeDetails;
