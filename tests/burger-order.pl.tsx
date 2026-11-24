import {test, expect} from '@playwright/test';


test.describe('Make order',() =>{
  test('Make order by authorized user', async ({ context,page }) => {

    await context.addCookies([
      {
        name: 'accessToken',
        value: 'fake-access-token-123',
        domain: 'localhost',
        path: '/',
      },
    ]);

    await page.addInitScript(() => {
      window.localStorage.setItem('refreshToken', 'fake-refresh-token-456');
    });

    await page.routeFromHAR('./tests/hars/orders.har', {
       url: '**/api/orders',
       update: false,
       notFound: 'abort',
    });
    
    await page.routeFromHAR('./tests/hars/ingredients.har', {
      url: '**/api/ingredients',
      update: false,
      notFound: 'abort',
    });

    await page.routeFromHAR('./tests/hars/user.har', {
      url: '**/api/auth/user',
      update: false,
      notFound: 'abort',
    });

    await page.goto('/');     
    await expect(page.getByTestId('burger-ingredients')).toBeVisible({});
  
    const ingredientBun = page.locator('li').filter({ hasText: 'Краторная булка N-200i' }).first();
    const ingredientFilling = page.locator('li').filter({ hasText: 'Говяжий метеорит (отбивная)' }).first();
    const ingredientSauce = page.locator('li').filter({ hasText: 'Соус Spicy-X' }).first();
    
    const constructorZone = page.getByTestId('constructor');
    await expect(constructorZone.getByText(/Краторная булка N-200i/).first()).toBeHidden();
    await expect(constructorZone.getByText('Говяжий метеорит (отбивная)').first()).toBeHidden();
    await expect(constructorZone.getByText('Соус Spicy-X').first()).toBeHidden();

    await ingredientBun.getByRole('button', { name: /Добавить/i }).click();
    await ingredientFilling.getByRole('button', { name: /Добавить/i }).click();
    await ingredientSauce.getByRole('button', { name: /Добавить/i }).click();
    
    await expect(constructorZone.getByText(/Краторная булка N-200i/).first()).toBeVisible();
    await expect(constructorZone.getByText('Говяжий метеорит (отбивная)')).toBeVisible();
    await expect(constructorZone.getByText('Соус Spicy-X')).toBeVisible();
    await expect(constructorZone.getByText('5600', { exact: true })).toBeVisible();

    const modal = page.getByTestId('modal');
    await expect(modal).toBeHidden();
    await page.getByRole('button', { name: 'Оформить заказ' }).click();
    await expect(modal).toBeVisible();
  
    await expect(modal.getByText('8947')).toBeVisible();

    await page.mouse.click(10, 10);
    await expect(modal).toBeHidden();

    await expect(constructorZone.getByText('Выберите булки').first()).toBeVisible();
    await expect(constructorZone.getByText('0', { exact: true })).toBeVisible();
  });
});

