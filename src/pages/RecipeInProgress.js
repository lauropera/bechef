import React, { useEffect, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import clipboardCopy from 'clipboard-copy';
import useFavorites from '../hooks/useFavorites';
import useRecipe from '../hooks/useRecipe';
import {
  doneRecipe,
  getRecipesInProgress,
  startRecipe,
} from '../services/saveStorage';
import GoBackButton from '../components/GoBackButton';
import RecipeCardDetails from '../components/RecipeCardDetails';
import RecipeDetail from '../components/RecipeDetail';
import IngredientsList from '../components/IngredientsList';
import Instructions from '../components/Instructions';
import '../styles/RecipeInProgress.css';

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
    <main>
      {isFetched && (
        <main className="recipe-in-progress">
          <GoBackButton />
          <RecipeCardDetails
            imgTestId="recipe-photo"
            nameTestId="recipe-title"
            recipe={ recipe }
            showCategory
          />
          <RecipeDetail
            recipe={ recipe }
            copyLink={ shareRecipe }
            addToFavorites={ addRecipeToFavorites }
            isFavorite={ isFavorite }
            linkCopied={ linkCopied }
          />
          <IngredientsList
            ingredients={ ingredients }
            measures={ measures }
            refresh={ refresh }
            checkIngredientsList={ checkIngredientsList }
            setProgressRecipe={ setProgressRecipe }
          />
          <Instructions recipe={ recipe } />
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
    </main>
  );
}

export default RecipeInProgress;
