import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import meals from './helpers/mocks/meals';
import milkDrinks from './helpers/mocks/milkDrinks';
import beefMeals from './helpers/mocks/beefMeals';
import oneMeal from './helpers/mocks/oneMeal';
import oneDrink from './helpers/mocks/oneDrink';
import userEvent from '@testing-library/user-event';
import renderWithRouterAndContext from './helpers/renderWithRouterAndContext';
import App from '../App';
import SearchBar from '../components/SearchBar';
import Foods from '../pages/Foods';
import { act } from 'react-dom/test-utils';

describe('Testes da barra de pesquisa', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch');
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(meals),
    });
  });

  afterEach(() => jest.restoreAllMocks());

  it('Testa se o botão "Search" está desativado quando os inputs estão vazios', () => {
    expect.assertions(1);

    renderWithRouterAndContext(<SearchBar />);

    const searchBtn = screen.getByTestId('exec-search-btn');
    expect(searchBtn).toBeDisabled();
  });

  it('Deve aparecer um alerta quando colocar mais de uma letra no input e selecionar "First-Letter"', () => {
    expect.assertions(2);
    global.alert = jest.fn();

    renderWithRouterAndContext(<SearchBar />);

    const searchInput = screen.getByTestId('search-input');
    const fistLetterRadio = screen.getByTestId('first-letter-search-radio');
    userEvent.click(fistLetterRadio);
    userEvent.type(searchInput, 'co');

    expect(global.alert).toHaveBeenCalled();
    expect(searchInput).toHaveValue('c');
  });

  it('Deve aparecer um alerta quando colocar nao encontrar uma comida filtrada', async () => {
    expect.assertions(2);
    jest.resetAllMocks();

    jest.spyOn(global, 'fetch');
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue([]),
    });
    global.alert = jest.fn();

    renderWithRouterAndContext(<SearchBar />);

    const searchInput = screen.getByTestId('search-input');
    const nameRadio = screen.getByTestId('name-search-radio');
    const searchBtn = screen.getByTestId('exec-search-btn');
    userEvent.type(searchInput, 'AMONGUS');
    userEvent.click(nameRadio);
    userEvent.click(searchBtn);

    await waitFor(() => expect(fetch).toHaveBeenCalled());
    expect(global.alert).toHaveBeenCalled();
  });

  describe('Testes de Filtro', () => {
    it('Testa se é chamado a API de comidas quando está na rota "/foods" e faz uma pesquisa', async () => {
      expect.assertions(1);
      jest.resetAllMocks();
      jest.spyOn(global, 'fetch');
      global.fetch.mockResolvedValue({
        json: jest.fn().mockResolvedValue(beefMeals),
      });

      const { history } = renderWithRouterAndContext(<SearchBar />);
      history.push('/foods');

      const searchInput = screen.getByTestId('search-input');
      const radio = screen.getByTestId('ingredient-search-radio');
      const searchBtn = screen.getByTestId('exec-search-btn');
      userEvent.type(searchInput, 'beef');
      userEvent.click(radio);
      await act(async() => userEvent.click(searchBtn));

      const URL = 'https://www.themealdb.com/api/json/v1/1/filter.php?i=beef';
      expect(fetch).toHaveBeenCalledWith(URL);
    });

    it('Testa se é chamado a API de bebidas quando está na rota "/drinks" e faz uma pesquisa', async () => {
      expect.assertions(1);
      jest.resetAllMocks();
      jest.spyOn(global, 'fetch');
      global.fetch.mockResolvedValue({
        json: jest.fn().mockResolvedValue(milkDrinks),
      });

      renderWithRouterAndContext(<SearchBar />);

      const searchInput = screen.getByTestId('search-input');
      const nameRadio = screen.getByTestId('name-search-radio');
      const searchBtn = screen.getByTestId('exec-search-btn');
      userEvent.type(searchInput, 'milk');
      userEvent.click(nameRadio);
      await act(async() => userEvent.click(searchBtn));

      const URL =
        'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=milk';
      expect(fetch).toHaveBeenCalledWith(URL);
    });

    it('Testa se traz comidas pelo filtro "First-Letter"', async () => {
      expect.assertions(1);
      renderWithRouterAndContext(<App />);

      const emailInput = screen.getByTestId('email-input');
      const passInput = screen.getByTestId('password-input');
      const loginBtn = screen.getByTestId('login-submit-btn');
      userEvent.type(emailInput, 'test@test.com');
      userEvent.type(passInput, '1234567');
      userEvent.click(loginBtn);

      const showSearchBtn = screen.getByTestId('search-top-btn');
      userEvent.click(showSearchBtn);

      const searchInput = screen.getByTestId('search-input');
      const fistLetterRadio = screen.getByTestId('first-letter-search-radio');
      const searchBtn = screen.getByTestId('exec-search-btn');
      userEvent.click(fistLetterRadio);
      userEvent.type(searchInput, 'b');

      jest.resetAllMocks();
      jest.spyOn(global, 'fetch');
      global.fetch.mockResolvedValue({
        json: jest.fn().mockResolvedValue(oneMeal),
      });

      await act(async() => userEvent.click(searchBtn));

      const URL = 'https://www.themealdb.com/api/json/v1/1/search.php?f=b';
      expect(fetch).toHaveBeenCalledWith(URL);
    });

    it('Testa se redireciona para pagina da comida caso encontre apenas uma', async () => {
      expect.assertions(2);
      jest.restoreAllMocks();
      jest.spyOn(global, 'fetch');
      global.fetch.mockResolvedValue({
        json: jest.fn().mockResolvedValue(oneMeal),
      });

      const { history } = renderWithRouterAndContext(<SearchBar />);
      history.push('/foods');

      const searchInput = screen.getByTestId('search-input');
      const nameRadio = screen.getByTestId('name-search-radio');
      const searchBtn = screen.getByTestId('exec-search-btn');
      userEvent.type(searchInput, 'Spicy Arrabiata Penne');
      userEvent.click(nameRadio);
      userEvent.click(searchBtn);

      await waitFor(() => expect(fetch).toHaveBeenCalled());
      expect(history.location.pathname).toBe('/foods/52771');
    });

    it('Testa se redireciona para pagina da bebida caso encontre apenas uma', async () => {
      expect.assertions(2);
      jest.restoreAllMocks();
      jest.spyOn(global, 'fetch');
      global.fetch.mockResolvedValue({
        json: jest.fn().mockResolvedValue(oneDrink),
      });

      const { history } = renderWithRouterAndContext(<SearchBar />);
      history.push('/drinks');

      const searchInput = screen.getByTestId('search-input');
      const nameRadio = screen.getByTestId('name-search-radio');
      const searchBtn = screen.getByTestId('exec-search-btn');
      userEvent.type(searchInput, 'Aquamarine');
      userEvent.click(nameRadio);
      userEvent.click(searchBtn);

      await waitFor(() => expect(fetch).toHaveBeenCalled());
      expect(history.location.pathname).toBe('/drinks/178319');
    });

    it('Testa se as receitas somem caso a requisição para a API de filtros falhe', async () => {
      expect.assertions(3);
      const { history } = renderWithRouterAndContext(<Foods />);
      history.push('/foods');

      await waitFor(() => expect(fetch).toHaveBeenCalled());

      const corba = screen.queryByText(/corba/i);
      expect(corba).toBeInTheDocument();
      const searchBtn = screen.getByTestId('search-top-btn');
      userEvent.click(searchBtn);

      const searchInput = screen.getByTestId('search-input');
      const nameRadio = screen.getByTestId('name-search-radio');
      const searchFilterBtn = screen.getByTestId('exec-search-btn');
      userEvent.type(searchInput, 'milk');
      userEvent.click(nameRadio);

      jest.spyOn(global, 'fetch').mockImplementation(async () => {
        return Promise.reject({});
      });
      await act(async () => userEvent.click(searchFilterBtn));
      expect(corba).not.toBeInTheDocument();
    });
  });
});
