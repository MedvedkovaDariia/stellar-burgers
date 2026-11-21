
import {test, expect} from '@playwright/test';

test('Создание заказа', async ({ page, context }) =>{

  await page.addInitScript(() => {
    window.localStorage.setItem('accessToken', 'fake-access-token');
  });

  await context.addCookies([
    { name: 'accessToken', value: 'fake-access-token', domain: 'localhost', path: '/' },
  ]);

  await page.route('**/api/auth/user', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        user: { email: 'test@test.com', name: 'TestUser' },
      }),
    });
  });

  await page.route('**/api/orders', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        name: 'Space Burger',
        order: { number: 777 },
      }),
    });
  });

  await page.routeFromHAR('./tests/hars/ingredients.har', {
    url: '**/api/ingredients*',
  });

  await page.goto('/');
  await expect(page.getByTestId('header')).toBeVisible();

  const ingredientBun = page.locator('li').filter({ hasText: 'Краторная булка N-200i' }).first();
  const ingredientFilling = page.locator('li').filter({ hasText: 'Говяжий метеорит (отбивная)' }).first();
  const ingredientSauce = page.locator('li').filter({ hasText: 'Соус Spicy-X' }).first();

  await ingredientBun.getByRole('button', { name: /Добавить/i }).click();

  const constructorZone = page.getByTestId('constructor');
  await ingredientFilling.getByRole('button',{name: 'Добавить'}).click();
  await ingredientSauce.getByRole('button',{name: 'Добавить'}).click();

  await expect(constructorZone.getByText(/Краторная булка N-200i/).first()).toBeVisible();
  await expect(constructorZone.getByText('Говяжий метеорит (отбивная)')).toBeVisible();
  await expect(constructorZone.getByText('Соус Spicy-X')).toBeVisible();
  await expect(constructorZone.getByText('5600', { exact: true })).toBeVisible();

  await constructorZone.getByTestId('make-order').click();

  const modal = page.getByTestId('modal');
  await expect(modal).toBeVisible();
  await expect(modal.getByText('777')).toBeVisible();

  await page.mouse.click(10, 10);
  await expect(modal).toBeHidden();

  await expect(constructorZone.getByText('Выберите булки').first()).toBeVisible();
  await expect(constructorZone.getByText('0', { exact: true })).toBeVisible();
});
