import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouterAndContext from './helpers/renderWithRouterAndContext';
import meals from '../../cypress/mocks/meals';
import drinks from '../../cypress/mocks/drinks';
import App from '../App';
import clipboardCopy from 'clipboard-copy';
//import clipboardCopy from 'clipboard-copy';

jest.mock('clipboard-copy', () => jest.fn());
const mockClipboard = require('clipboard-copy');
// https://trybecourse.slack.com/archives/C01T2C18DSM/p1630099534116900?thread_ts=1630092847.100100&cid=C01T2C18DSM
describe('Testes da pagina de receitas em progresso', () => {

  it('Testa se, após navegar para receitas em progresso com um id de receita a página é renderizada para aquela receita', async () => {
    expect.assertions(1);
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve(drinks),
    }));
    const { history } = renderWithRouterAndContext(<App />);
    history.push('/drinks/178319/in-progress');
    await waitFor(() => {
      const drinkImg = screen.getByTestId("recipe-photo");
      expect(drinkImg).toHaveAttribute('src', 'https://www.thecocktaildb.com/images/media/drink/vyxwut1468875960.jpg');
    })
  });
  it('Testa se, após clicar em compartilhar receita um link de food é copiado para a área de transferência', async () => {
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve(meals),
    }));
    const { history } = renderWithRouterAndContext(<App />);    
    history.push('/foods/52771/in-progress');
    await waitFor(() => {
      const shareButton = screen.getByTestId('share-btn');
      userEvent.click(shareButton);
    });
    mockClipboard.mockImplementation(() => null); 
    expect(mockClipboard).toBeCalledTimes(1);
  });
  it('Testa se, após clicar em compartilhar receita um link de drink é copiado para a área de transferência', async () => {
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve(drinks),
    }));
    const { history } = renderWithRouterAndContext(<App />);    
    history.push('/drinks/178319/in-progress');
    await waitFor(() => {
      const drinkImg = screen.getByTestId("recipe-photo");
      expect(drinkImg).toHaveAttribute('src', 'https://www.thecocktaildb.com/images/media/drink/vyxwut1468875960.jpg');
    })
  });
  it('Testa se, após clicar no botão de favoritar o coração muda de white para black e a receita é salva em favoritos', async () => {
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve(meals),
    }));
    const { history } = renderWithRouterAndContext(<App />);    
    history.push('/foods/52771/in-progress');
      const favoriteButton = await screen.findByTestId('favorite-btn');
      expect(favoriteButton).toHaveAttribute('src', 'whiteHeartIcon.svg');
      userEvent.click(favoriteButton);
      expect(favoriteButton).toHaveAttribute('src', 'blackHeartIcon.svg');
      userEvent.click(favoriteButton);
      expect(favoriteButton).toHaveAttribute('src', 'whiteHeartIcon.svg');
  });
  it('Testa se, após marcar um ingrediente ele é salvo como concluído e ao desmarcar ele é removido da lista', async () => {
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve(meals),
    }));
    const { history } = renderWithRouterAndContext(<App />);    
    history.push('/foods/52771/in-progress');    
    const checkProgress = await screen.findByRole("checkbox", { name: /Lentils \- 1 cup/i });
    userEvent.click(checkProgress);
    expect(checkProgress).toBeChecked();
    userEvent.click(checkProgress);
    expect(checkProgress).not.toBeChecked();
  });
});
