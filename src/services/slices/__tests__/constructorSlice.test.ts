import constructorReducer, {
  addIngredient,
  removeIngredient,
  clearConstructor,
  moveIngredient,
  initialState,
} from '../constructorSlice';

import type { TConstructorIngredient } from '../../../utils/types';

const mockBun = {
  _id: '1',
  name: 'Краторная булка N-200i',
  type: 'bun',
  price: 1255,
  image: 'img',
  proteins: 10,
  fat: 10,
  carbohydrates: 10,
  calories: 100,
  image_mobile: 'img',
  image_large: 'img',
  __v: 0,
};

const mockIngredient = {
  _id: '2',
  name: 'Говяжий метеорит',
  type: 'main',
  price: 3000,
  image: 'img',
  proteins: 10,
  fat: 10,
  carbohydrates: 10,
  calories: 100,
  image_mobile: 'img',
  image_large: 'img',
  __v: 0,
};

describe('Testing the reducer of constructorSlice', () => {
  test('must return the initial state when an unknown action is requested', () => {
    const result = constructorReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(result).toEqual(initialState);
  });

  describe('Synchronous action ', () => {
    test('must process action addIngredient (adding a bun)', () => {
      const action = addIngredient(mockBun);
      const result = constructorReducer(undefined, action);

      expect(result.bun).toEqual(expect.objectContaining({ name: mockBun.name }));
      expect(result.ingredients).toHaveLength(0);
    });

    test('must process action addIngredient (adding a filling)', () => {
      const action = addIngredient(mockIngredient);
      const result = constructorReducer(undefined, action);

      expect(result.bun).toBeNull();
      expect(result.ingredients).toHaveLength(1);
      expect(result.ingredients[0]).toEqual(
        expect.objectContaining({ name: mockIngredient.name })
      );
      // Проверяем, что добавился уникальный id
      expect(result.ingredients[0]).toHaveProperty('id');
    });

    test('must process action removeIngredient', () => {
      const stateWithIngredient = {
        bun: null,
        ingredients: [
          { ...mockIngredient, id: 'unique-uuid-123' },
        ] as TConstructorIngredient[],
      };

      const action = removeIngredient('unique-uuid-123');
      const result = constructorReducer(stateWithIngredient, action);

      expect(result.ingredients).toHaveLength(0);
    });

    test('must process action clearConstructor', () => {
      const stateWithData = {
        bun: { ...mockBun, id: 'bun-id' } as TConstructorIngredient,
        ingredients: [{ ...mockIngredient, id: 'ing-id' }] as TConstructorIngredient[],
      };

      const action = clearConstructor();
      const result = constructorReducer(stateWithData, action);

      expect(result).toEqual({
        bun: null,
        ingredients: [],
      });
    });

    test('must process action moveIngredient', () => {
      const stateWithIngredients = {
        bun: null,
        ingredients: [
          { ...mockIngredient, id: 'id-1', name: 'Ингредиент 1' },
          { ...mockIngredient, id: 'id-2', name: 'Ингредиент 2' },
        ] as TConstructorIngredient[],
      };

      const action = moveIngredient({ fromIndex: 0, toIndex: 1 });
      const result = constructorReducer(stateWithIngredients, action);

      expect(result.ingredients[0].name).toBe('Ингредиент 2');
      expect(result.ingredients[1].name).toBe('Ингредиент 1');
    });
  });
});
