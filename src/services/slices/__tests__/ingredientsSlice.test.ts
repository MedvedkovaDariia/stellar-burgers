import { expect, test } from '@jest/globals';

import ingredientsReducer, { fetchIngredients, initialState } from '../ingredientsSlice';

import type { TIngredient } from '../../../utils/types';

const mockIngredients: TIngredient[] = [
  {
    _id: '1',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'img',
    image_large: 'img',
    image_mobile: 'img',
  },
];

describe('Testing the reducer of', () => {
  test('must return the initial state when an unknown action is requested', () => {
    const result = ingredientsReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(result).toEqual(initialState);
  });
});

describe('Async action fetchIngredients', () => {
  test('must process the request fetchIngredients.pending', () => {
    const action = { type: fetchIngredients.pending.type };
    const result = ingredientsReducer(initialState, action);

    expect(result.isIngredientsLoading).toBe(true);
    expect(result.ingredientsError).toBeNull();
  });

  test('must process the request fetchIngredients.fulfilled', () => {
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients,
    };
    const result = ingredientsReducer(initialState, action);

    expect(result.isIngredientsLoading).toBe(false);
    expect(result.ingredients).toEqual(mockIngredients);
    expect(result.ingredientsError).toBeNull();
  });

  test('must process the request fetchIngredients.rejected', () => {
    const errorPayload = 'Ошибка загрузки ингредиентов';
    const action = {
      type: fetchIngredients.rejected.type,
      error: errorPayload,
    };
    const result = ingredientsReducer(initialState, action);

    expect(result.isIngredientsLoading).toBe(false);
    // В твоем коде: state.ingredientsError = action.error as string;
    expect(result.ingredientsError).toBe(errorPayload);
  });
});
