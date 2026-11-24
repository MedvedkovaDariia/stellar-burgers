import { test, expect, type Page } from '@playwright/test';

async function setupIngredientsMock(page: Page) {
  await page.routeFromHAR('./tests/hars/ingredients.har', {
    url: '**/api/ingredients',
    update: false,
    notFound: 'abort',
  });
  await page.goto('/');
}

test.beforeEach(async ({ page }) => {
  await setupIngredientsMock(page);
});

test.describe('Loading ingredients list', () => {
  test('Getting ingredients from the ingredients.har file', async ({ page }) => {
    await expect(page.getByTestId('header')).toBeVisible();
    await expect(page.getByTestId('burger-ingredients')).toBeVisible();
    await expect(page.getByText('Краторная булка N-200i').first()).toBeVisible();
  });
});

test.describe('The burger constructor works correctly', () => {
  test('Adding ingredients to the builder', async ({ page }) => {
    const ingredientBun = page
      .getByTestId('burger-ingredient')
      .filter({ hasText: 'Краторная булка N-200i' })
      .first();
    const ingredientFilling = page
      .getByTestId('burger-ingredient')
      .filter({ hasText: 'Говяжий метеорит (отбивная)' })
      .first();
    const ingredientSauce = page
      .getByTestId('burger-ingredient')
      .filter({ hasText: 'Соус Spicy-X' })
      .first();
    const constructorZone = page.getByTestId('constructor');

    await expect(constructorZone.getByText(/Выберите булки/).first()).toBeVisible();
    await ingredientBun.getByRole('button', { name: /Добавить/ }).click();
    await expect(constructorZone.getByText(/Выберите булки/).first()).toBeHidden();
    await expect(
      constructorZone.getByText(/Краторная булка N-200i/).first()
    ).toBeVisible();

    await expect(constructorZone.getByText(/Выберите начинку/)).toBeVisible();
    await ingredientFilling.getByRole('button', { name: 'Добавить' }).click();
    await expect(constructorZone.getByText(/Выберите начинку/).first()).toBeHidden();
    await expect(constructorZone.getByText('Говяжий метеорит (отбивная)')).toBeVisible();

    await expect(constructorZone.getByText('Соус Spicy-X')).toBeHidden();
    await ingredientSauce.getByRole('button', { name: 'Добавить' }).click();
    await expect(constructorZone.getByText('Соус Spicy-X')).toBeVisible();
  });
});

test.describe('The modal window works correctly', () => {
  test('Opening and closing the ingredient modal window using the Escape key', async ({
    page,
  }) => {
    const ingredientName = 'Краторная булка N-200i';
    const modal = page.getByTestId('modal');
    await expect(modal).toBeHidden();
    await page
      .getByTestId('burger-ingredient')
      .filter({ hasText: ingredientName })
      .first()
      .click();

    await expect(modal).toBeVisible();
    await expect(modal.getByText(ingredientName)).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(modal).toBeHidden();
  });

  test('Opening and closing the ingredient modal window via the X icon', async ({
    page,
  }) => {
    const ingredientName = 'Краторная булка N-200i';
    const modal = page.getByTestId('modal');
    await expect(modal).toBeHidden();
    await page
      .getByTestId('burger-ingredient')
      .filter({ hasText: ingredientName })
      .first()
      .click();

    await expect(modal).toBeVisible();
    await expect(modal.getByText(ingredientName)).toBeVisible();

    await modal.getByTestId('close-button').click();
    await expect(modal).toBeHidden();
  });

  test('Opening and closing the ingredient modal window by clicking outside the card', async ({
    page,
  }) => {
    const ingredientName = 'Краторная булка N-200i';
    const modal = page.getByTestId('modal');
    await expect(modal).toBeHidden();
    await page
      .getByTestId('burger-ingredient')
      .filter({ hasText: ingredientName })
      .first()
      .click();

    await expect(modal).toBeVisible();
    await expect(modal.getByText(ingredientName)).toBeVisible();

    await page.getByTestId('modal-overlay').click({ position: { x: 5, y: 5 } });
    await expect(modal).toBeHidden();
  });
});
