import React from 'react';
import { shape } from 'prop-types';

function Instructions({ recipe }) {
  return (
    <section className="Instructions-Container">
      <h4 className="title-instructions">Instructions</h4>
      <div className="instructions-text">
        <p data-testid="instructions" className="text-style">
          {recipe.strInstructions}
        </p>
      </div>
    </section>
  );
}

Instructions.propTypes = { recipe: shape({}).isRequired };

export default Instructions;
