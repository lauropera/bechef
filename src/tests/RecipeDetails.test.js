import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import renderWithRouterAndContext from './helpers/renderWithRouterAndContext';
import userEvent from '@testing-library/user-event';
import RecipeDetails from '../pages/RecipeDetails';
import oneMeal from './helpers/mocks/oneMeal';
import oneDrink from './helpers/mocks/oneDrink';
import { act } from 'react-dom/test-utils';

// https://trybecourse.slack.com/archives/C01T2C18DSM/p1630099534116900?thread_ts=1630092847.100100&cid=C01T2C18DSM
jest.mock('clipboard-copy', () => jest.fn());
const mockClipboard = require('clipboard-copy');

describe('Testes gerais da tela de detalhes de uma receita', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch');
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(oneMeal),
    });
  });

  afterEach(() => jest.resetAllMocks());

  describe('Testa a Requisição à API ao abrir a tela de Detalhes da Receita', () => {
    it('Verifica se a requisição à API da comida escolhida foi realizada', async () => {
      expect.assertions(2);

      const { history } = renderWithRouterAndContext(<RecipeDetails />);
      history.push(`/foods/${oneMeal.meals[0].idMeal}`);
      await waitFor(() => expect(fetch).toHaveBeenCalled());

      const arrabiata = screen.getByRole('heading', {
        name: /Spicy Arrabiata Penne/i,
        level: 4,
      });
      expect(arrabiata).toBeInTheDocument();
    });

    it('Verifica se as requisições à API de bebidas foi realizada', async () => {
      expect.assertions(2);
      jest.restoreAllMocks();
      jest.spyOn(global, 'fetch');
      global.fetch.mockResolvedValue({
        json: jest.fn().mockResolvedValue(oneDrink),
      });

      const { history } = renderWithRouterAndContext(<RecipeDetails />);
      history.push(`/drinks/${oneDrink.drinks[0].idDrink}`);
      await waitFor(() => expect(fetch).toHaveBeenCalled());

      const aquamarine = screen.getByRole('heading', {
        name: /aquamarine/i,
        level: 4,
      });
      expect(aquamarine).toBeInTheDocument();
    });
  });

  describe('Testa as funcionalidades da tela de detalhes', () => {
    it('Verifica se ao clicar no botão de compartilhar o link da receita é copiado', async () => {
      expect.assertions(2);

      const { history } = renderWithRouterAndContext(<RecipeDetails />);
      history.push(`/foods/${oneMeal.meals[0].idMeal}`);
      await waitFor(() => expect(fetch).toHaveBeenCalled());

      const shareBtn = screen.getByTestId('share-btn');
      mockClipboard.mockImplementation(() => null);
      userEvent.click(shareBtn);
      expect(mockClipboard).toBeCalledTimes(1);
    });

    it('Testa se a receita foi favoritada', async () => {
      localStorage.clear();
      expect.assertions(3);

      const { history } = renderWithRouterAndContext(<RecipeDetails />);
      history.push(`/foods/${oneMeal.meals[0].idMeal}`);
      await waitFor(() => expect(fetch).toHaveBeenCalled());

      const favBtn = screen.getByTestId('favorite-btn');
      expect(favBtn).toHaveAttribute('name', 'not-favorite');
      userEvent.click(favBtn);
      expect(favBtn).toHaveAttribute('name', 'favorite');
    });

    it('Testa se a receita continua favoritada após recarregar a página', async () => {
      expect.assertions(4);
      localStorage.clear();
      const { history } = renderWithRouterAndContext(<RecipeDetails />);
      history.push(`/foods/${oneMeal.meals[0].idMeal}`);
      await waitFor(() => expect(fetch).toHaveBeenCalled());

      const favBtn = screen.getByTestId('favorite-btn');
      userEvent.click(favBtn);
      expect(favBtn).toHaveAttribute('name', 'favorite');
      window.location.reload;
      expect(favBtn).toHaveAttribute('name', 'favorite');
      expect(favBtn).not.toHaveAttribute('name', 'not-favorite');
    });

    it('Testa se a receita foi removida dos favoritos', async () => {
      localStorage.clear();
      jest.resetAllMocks();
      jest.spyOn(global, 'fetch');
      global.fetch.mockResolvedValue({
        json: jest.fn().mockResolvedValue(oneDrink),
      });
      expect.assertions(4);

      const { history } = renderWithRouterAndContext(<RecipeDetails />);
      history.push(`/drinks/${oneDrink.drinks[0].idDrink}`);
      await waitFor(() => expect(fetch).toHaveBeenCalled());

      const favBtn = screen.getByTestId('favorite-btn');
      expect(favBtn).toHaveAttribute('name', 'not-favorite');
      userEvent.click(favBtn);
      expect(favBtn).toHaveAttribute('name', 'favorite');
      userEvent.click(favBtn);
      expect(favBtn).toHaveAttribute('name', 'not-favorite');
    });

    it('Testa se ao clicar em "Start Recipe" é redirecionado para página de progresso da comida', async () => {
      localStorage.clear();
      expect.assertions(3);

      const { history } = renderWithRouterAndContext(<RecipeDetails />);
      history.push(`/foods/${oneMeal.meals[0].idMeal}`);
      await waitFor(() => expect(fetch).toHaveBeenCalled());

      const startBtn = screen.getByTestId('start-recipe-btn');
      expect(startBtn).toHaveTextContent('Start Recipe');
      userEvent.click(startBtn);
      const { pathname } = history.location;
      expect(pathname).toBe(`/foods/${oneMeal.meals[0].idMeal}/in-progress`);
    });

    it('Testa se ao clicar em "Start Recipe" é redirecionado para página de progresso da bebida', async () => {
      expect.assertions(3);

      localStorage.clear();
      jest.resetAllMocks();
      jest.spyOn(global, 'fetch');
      global.fetch.mockResolvedValue({
        json: jest.fn().mockResolvedValue(oneDrink),
      });

      const { history } = renderWithRouterAndContext(<RecipeDetails />);
      history.push(`/drinks/${oneDrink.drinks[0].idDrink}`);
      await waitFor(() => expect(fetch).toHaveBeenCalled());

      const startBtn = screen.getByTestId('start-recipe-btn');
      expect(startBtn).toHaveTextContent('Start Recipe');
      userEvent.click(startBtn);
      const { pathname } = history.location;
      expect(pathname).toBe(
        `/drinks/${oneDrink.drinks[0].idDrink}/in-progress`
      );
    });

    it('Testa se aparece o botão "Continue Recipe" caso a receita da comida já tenha sido iniciada', async () => {
      const { history } = renderWithRouterAndContext(<RecipeDetails />);
      history.push(`/foods/${oneMeal.meals[0].idMeal}`);
      await waitFor(() => expect(fetch).toHaveBeenCalled());

      const startBtn = screen.getByTestId('start-recipe-btn');
      expect(startBtn).toHaveTextContent('Continue Recipe');
    });

    it('Testa se aparece o botão "Continue Recipe" caso a receita da bebida já tenha sido iniciada', async () => {
      const { history } = renderWithRouterAndContext(<RecipeDetails />);
      history.push(`/drinks/${oneDrink.drinks[0].idDrink}`);
      await waitFor(() => expect(fetch).toHaveBeenCalled());

      const startBtn = screen.getByTestId('start-recipe-btn');
      expect(startBtn).toHaveTextContent('Continue Recipe');
    });

    it('Testa se o botão de voltar para a rota "/foods" funciona ', async () => {
      const { history } = renderWithRouterAndContext(<RecipeDetails />);
      history.push(`/foods/${oneMeal.meals[0].idMeal}`);
      
      await waitFor(() => expect(fetch).toHaveBeenCalled());
      const goBackBtn = screen.getByTestId('go-back-btn');
      userEvent.click(goBackBtn);
      expect(history.location.pathname).toBe('/foods');
    });

    it('Testa se o botão de voltar para a rota "/drinks" funciona ', async () => {
      const { history } = renderWithRouterAndContext(<RecipeDetails />);
      history.push(`/drinks/${oneDrink.drinks[0].idDrink}`);
      
      await waitFor(() => expect(fetch).toHaveBeenCalled());
      const goBackBtn = screen.getByTestId('go-back-btn');
      userEvent.click(goBackBtn);
      expect(history.location.pathname).toBe('/drinks');
    });

    it('Testa se o botão de voltar para a página de detalhes funciona', async () => {
      const { history } = renderWithRouterAndContext(<RecipeDetails />);
      history.push(`/drinks/${oneDrink.drinks[0].idDrink}/in-progress`);
      
      await waitFor(() => expect(fetch).toHaveBeenCalled());
      const goBackBtn = screen.getByTestId('go-back-btn');
      userEvent.click(goBackBtn);
      expect(history.location.pathname).toBe('/drinks/178319');
    });

    it('Testa se a receita não é renderizada caso a requisição para a API falhe', async () => {
      jest.spyOn(global, 'fetch').mockImplementation(async () => {
        return Promise.reject({});
      });

      await act(async() => {
        const { history } = renderWithRouterAndContext(<RecipeDetails />);
        history.push(`/foods/${oneMeal.meals[0].idMeal}`);
      });

      const arrabiata = screen.queryByText(/Spicy Arrabiata Penne/i);
      expect(arrabiata).not.toBeInTheDocument();
    });
  });
});
