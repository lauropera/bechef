import { arrayOf, bool, func, string } from 'prop-types';
import React from 'react';

function IngredientsList({
  ingredients,
  measures,
  refresh,
  checkIngredientsList,
  setProgressRecipe,
}) {
  return (
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
                    checkIngredientsList(ingredient) ? 'ingredient-check' : ''
                  }` }
                >
                  {`${ingredient} - ${measures[index]}`}
                </span>
              </label>
            </div>
          ))}
      </div>
    </section>
  );
}

IngredientsList.propTypes = {
  ingredients: arrayOf(string).isRequired,
  measures: arrayOf(string).isRequired,
  refresh: bool.isRequired,
  checkIngredientsList: func.isRequired,
  setProgressRecipe: func.isRequired,
};

export default IngredientsList;
