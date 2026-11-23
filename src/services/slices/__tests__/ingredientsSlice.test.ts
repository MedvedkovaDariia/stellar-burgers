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

describe('Testing the reducer of ingredientsSlices', () => {
  test('Must return the initial state when an unknown action is requested', () => {
    const result = ingredientsReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(result).toEqual(initialState);
  });
});

describe('Async action fetchIngredients', () => {
  test('Must process the request fetchIngredients.pending', () => {
    const action = fetchIngredients.pending('requestId');
    const result = ingredientsReducer(initialState, action);

    expect(result.isIngredientsLoading).toBe(true);
    expect(result.ingredientsError).toBeNull();
  });

  test('Must process the request fetchIngredients.fulfilled', () => {
    const loadingState = { ...initialState, isIngredientsLoading: true };
    const action = fetchIngredients.fulfilled(mockIngredients, 'requestId');
    const result = ingredientsReducer(loadingState, action);

    expect(result.isIngredientsLoading).toBe(false);
    expect(result.ingredients).toEqual(mockIngredients);
    expect(result.ingredientsError).toBeNull();
  });

  test('Must process the request fetchIngredients.rejected', () => {
    const loadingState = { ...initialState, isIngredientsLoading: true };
    const errorPayload = new Error('Ошибка загрузки ингредиентов');
    const action = fetchIngredients.rejected(null, 'requestId', undefined, errorPayload);
    const result = ingredientsReducer(loadingState, action);

    expect(result.isIngredientsLoading).toBe(false);
    expect(result.ingredientsError).toBe(errorPayload);
  });
});
