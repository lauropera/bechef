import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouterAndContext from './helpers/renderWithRouterAndContext';
import mealCategories from './helpers/mocks/mealCategories';
import drinkCategories from './helpers/mocks/drinkCategories';
import meals from './helpers/mocks/meals';
import beefMeals from './helpers/mocks/beefMeals';
import drinks from './helpers/mocks/drinks';
import cocktailDrinks from './helpers/mocks/cocktailDrinks';
import Foods from '../pages/Foods';
import Drinks from '../pages/Drinks';
import { act } from 'react-dom/test-utils';

describe('Testes do componente de Receitas', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch');
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(meals),
    });
  });

  afterEach(() => jest.resetAllMocks());

  it('Testa se, após fazer Login, são renderizados "cards" de comidas', async () => {
    expect.assertions(2);

    const { history } = renderWithRouterAndContext(<Foods />);
    history.push('/foods');

    await waitFor(() => expect(fetch).toHaveBeenCalled());
    const corba = screen.getByRole('heading', { name: /corba/i });
    expect(corba).toBeInTheDocument();
  });

  it('Testa se são renderizados "cards" de bebidas', async () => {
    expect.assertions(2);
    jest.spyOn(global, 'fetch');
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(drinks),
    });

    const { history } = renderWithRouterAndContext(<Drinks />);
    history.push('/drinks');

    await waitFor(() => expect(fetch).toHaveBeenCalled());
    const ggDrink = screen.getByRole('heading', { name: 'GG' });
    expect(ggDrink).toBeInTheDocument();
  });

  it('Testa se os cards não são renderizados caso a requisição falhe', async () => {
    expect.assertions(2);
    jest.spyOn(global, 'fetch').mockImplementation(async () => {
      return Promise.reject([]);
    });

    const { history } = renderWithRouterAndContext(<Foods />);
    history.push('/foods');

    await waitFor(() => expect(fetch).toHaveBeenCalled());
    const corba = screen.queryByRole('heading', { name: /corba/i });
    expect(corba).not.toBeInTheDocument();
  });

  it('Testa se, após clicar em uma receita de comida, é redirecionado para os detalhes dela', async () => {
    expect.assertions(2);
    const { history } = renderWithRouterAndContext(<Foods />);
    history.push('/foods');

    await waitFor(() => expect(fetch).toHaveBeenCalled());
    const corba = screen.getByRole('heading', { name: /corba/i });
    userEvent.click(corba);

    const { pathname } = history.location;
    expect(pathname).toBe('/foods/52977');
  });

  it('Testa se, após clicar em uma receita de bebida, é redirecionado para os detalhes dela', async () => {
    expect.assertions(2);
    jest.spyOn(global, 'fetch');
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(drinks),
    });

    const { history } = renderWithRouterAndContext(<Drinks />);
    history.push('/drinks');

    await waitFor(() => expect(fetch).toHaveBeenCalled());
    const ggDrink = screen.getByRole('heading', { name: 'GG' });
    userEvent.click(ggDrink);

    const { pathname } = history.location;
    expect(pathname).toBe('/drinks/15997');
  });

  it('Testa se é renderizado apenas receitas de uma categoria apos seleciona-la', async () => {
    expect.assertions(5);
    jest.restoreAllMocks();
    jest.spyOn(global, 'fetch');
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(mealCategories),
    });

    const { history } = renderWithRouterAndContext(<Foods />);
    history.push('/foods');
    await waitFor(() => expect(fetch).toHaveBeenCalled());

    const beefBtn = screen.getByTestId('Beef-category-filter');
    expect(beefBtn).toBeInTheDocument();

    jest.restoreAllMocks();
    jest.spyOn(global, 'fetch');
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(beefMeals),
    });

    userEvent.click(beefBtn);

    await waitFor(() => expect(fetch).toHaveBeenCalled());
    const beef = screen.getByRole('heading', { name: /Beef Lo Mein/i });
    expect(beef).toBeInTheDocument();
    expect(screen.queryByText(/corba/i)).not.toBeInTheDocument();
  });

  it('Testa se mostra todas as receitas depois de clicar mais uma vez na categoria selecionada', async () => {
    expect.assertions(6);
    jest.restoreAllMocks();
    jest.spyOn(global, 'fetch');
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(mealCategories),
    });

    const { history } = renderWithRouterAndContext(<Foods />);
    history.push('/foods');

    await waitFor(() => expect(fetch).toHaveBeenCalled());
    const beefBtn = screen.getByTestId('Beef-category-filter');

    jest.restoreAllMocks();
    jest.spyOn(global, 'fetch');
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(beefMeals),
    });

    userEvent.click(beefBtn);
    await waitFor(() => expect(fetch).toHaveBeenCalled());
    const beef = screen.getByRole('heading', { name: /Beef Lo Mein/i });
    expect(beef).toBeInTheDocument();
    expect(screen.queryByText(/corba/i)).not.toBeInTheDocument();

    jest.restoreAllMocks();
    jest.spyOn(global, 'fetch');
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(meals),
    });
    userEvent.click(beefBtn);

    await waitFor(() => expect(fetch).toHaveBeenCalled());
    const corba = screen.getByRole('heading', { name: /corba/i });
    expect(corba).toBeInTheDocument();
  });

  it('Testa se mostra todas as categorias se clicar no botão "All"', async () => {
    expect.assertions(4);
    jest.restoreAllMocks();
    jest.spyOn(global, 'fetch');
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(drinkCategories),
    });

    const { history } = renderWithRouterAndContext(<Drinks />);
    history.push('/drinks');

    await waitFor(() => expect(fetch).toHaveBeenCalled());
    const cocktailBtn = screen.getByTestId('Cocktail-category-filter');
    const allRecipesBtn = screen.getByTestId('All-category-filter');

    jest.restoreAllMocks();
    jest.spyOn(global, 'fetch');
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(cocktailDrinks),
    });

    userEvent.click(cocktailBtn);
    await waitFor(() => expect(fetch).toHaveBeenCalled());

    jest.restoreAllMocks();
    jest.spyOn(global, 'fetch');
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(drinks),
    });
    userEvent.click(allRecipesBtn);

    await waitFor(() => expect(fetch).toHaveBeenCalled());
    const ggDrink = screen.getByRole('heading', { name: /gg/i });
    expect(ggDrink).toBeInTheDocument();
  });

  it('Testa se mostra todas as categorias caso clicar duas vezes na já selecionada', async () => {
    expect.assertions(3);
    jest.restoreAllMocks();
    jest.spyOn(global, 'fetch');
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(mealCategories),
    });

    const { history } = renderWithRouterAndContext(<Foods />);
    history.push('/foods');

    await waitFor(() => expect(fetch).toHaveBeenCalled());
    const beefBtn = screen.getByTestId('Beef-category-filter');

    jest.restoreAllMocks();
    jest.spyOn(global, 'fetch');
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(meals),
    });

    userEvent.click(beefBtn);
    userEvent.click(beefBtn);

    await waitFor(() => expect(fetch).toHaveBeenCalled());

    const corba = screen.getByRole('heading', { name: /corba/i });
    expect(corba).toBeInTheDocument();
  });

  it('Testa se nao renderiza nenhuma receita caso a requisição da API de categorias falhe', async () => {
    expect.assertions(2);
    jest.spyOn(global, 'fetch');
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(drinkCategories),
    });

    const { history } = renderWithRouterAndContext(<Drinks />);
    history.push('/drinks');

    await waitFor(() => expect(fetch).toHaveBeenCalled());
    const cocktailBtn = screen.getByTestId('Cocktail-category-filter');

    jest.spyOn(global, 'fetch').mockImplementation(async () => {
      return Promise.reject({});
    });

    await act(async() => userEvent.click(cocktailBtn))

    const ggDrink = screen.queryByRole('heading', { name: /gg/i });
    expect(ggDrink).not.toBeInTheDocument();
  });
});
