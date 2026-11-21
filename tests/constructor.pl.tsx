import { test, expect } from '@playwright/test';

test.describe('add ingredients to constructor works correctly', () => {

  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('./tests/hars/ingredients.har', {
      url: '**/api/ingredients*',
    });

    await page.route('**/api/auth/user', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ success: false }),
      });
    });
    await page.goto('/');
  });

  test('Получение ингредиентов ingredients.har', async ({ page }) => {
    await expect(page.getByTestId('header')).toBeVisible();
    await expect(page.getByTestId('burger-ingredients')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Краторная булка N-200i').first()).toBeVisible();
    await page.close();
  });

  test('Добавление ингредиентов в конструктор', async ({ page }) => {
    const ingredientBun = page.locator('li').filter({ hasText: 'Краторная булка N-200i' }).first();
    const ingredientFilling = page.locator('li').filter({ hasText: 'Говяжий метеорит (отбивная)' }).first();
    const ingredientSauce = page.locator('li').filter({ hasText: 'Соус Spicy-X' }).first();
    const constructorZone = page.getByTestId('constructor');

    await ingredientBun.getByRole('button', { name: 'Добавить' }).click();
    await ingredientFilling.getByRole('button',{name: 'Добавить'}).click();
    await ingredientSauce.getByRole('button',{name: 'Добавить'}).click();

    await expect(constructorZone.getByText(/Краторная булка N-200i/).first()).toBeVisible();
    await expect(constructorZone.getByText('Говяжий метеорит (отбивная)')).toBeVisible();
    await expect(constructorZone.getByText('Соус Spicy-X')).toBeVisible();
    await page.close();
  });


 test('Открытие и закрытие модального окна ингредиента по клавише Escape', async ({ page }) => {
     const ingredientName = 'Краторная булка N-200i';
     await page.locator('li').filter({ hasText: ingredientName }).first().click();

     const modal = page.getByTestId('modal');
     await expect(modal).toBeVisible();

     await page.keyboard.press('Escape');
     await expect(modal).toBeHidden();
   });

  test('Открытие и закрытие модального окна ингредиента по крестику', async ({ page }) => {
     const ingredientName = 'Краторная булка N-200i';
     await page.locator('li').filter({ hasText: ingredientName }).first().click();

     const modal = page.getByTestId('modal');
     await expect(modal).toBeVisible();

     await modal.getByTestId('close-button').click();
     await expect(modal).toBeHidden();
   });

   test('Открытие и закрытие модального окна ингредиента при нажатии вне карточки', async ({ page }) => {
     const ingredientName = 'Краторная булка N-200i';
     await page.locator('li').filter({ hasText: ingredientName }).first().click();

     const modal = page.getByTestId('modal');
     await expect(modal).toBeVisible();

     await page.mouse.click(10, 10);
     await expect(modal).toBeHidden();
   });

});
