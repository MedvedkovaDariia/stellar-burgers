
import {test, expect} from '@playwright/test';


test.describe('make order',() =>{
  test('Make Order', async ({ page }) => {

    // const ACCESS_TOKEN = 'Bearer%20eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZiMDJhZWRhZDUyOTkyY2E1ZmZlNzRhZSIsImlhdCI6MTc5NTM0MDYxNSwiZXhwIjoxNzk1MzQxODE1fQ.Y5be8ENktdYnHbvH8D9JLQXTC557dCCmw8m07qAr44Y';
    // const REFRESH_TOKEN = 'a6966084d4a29687e17c8ea16be398acb9035272ce712545123b4fa04035403b0390c5a85e161ca8';

    // await context.addCookies([
    //   { name: 'accessToken', value: ACCESS_TOKEN, domain: 'localhost', path: '/' },
    //   { name: 'refreshToken', value: REFRESH_TOKEN, domain: 'localhost', path: '/' },
    // ]);

    // await page.addInitScript((token) => {
    //   window.localStorage.setItem('accessToken', token);
    // }, ACCESS_TOKEN);

    await page.routeFromHAR('./tests/hars/all-api.har', {
      url: '**/api/**',
     // update: false,
    });

    await page.goto('/');
    await expect(page.getByTestId('burger-ingredients')).toBeVisible();

    const ingredientBun = page.locator('li').filter({ hasText: 'Краторная булка N-200i' }).first();
    const ingredientFilling = page.locator('li').filter({ hasText: 'Говяжий метеорит (отбивная)' }).first();
    const ingredientSauce = page.locator('li').filter({ hasText: 'Соус Spicy-X' }).first();

    await ingredientBun.getByRole('button', { name: /Добавить/i }).click();
    await ingredientFilling.getByRole('button', { name: /Добавить/i }).click();
    await ingredientSauce.getByRole('button', { name: /Добавить/i }).click();

    const constructorZone = page.getByTestId('constructor');
    await expect(constructorZone.getByText(/Краторная булка N-200i/).first()).toBeVisible();
    await expect(constructorZone.getByText('Говяжий метеорит (отбивная)')).toBeVisible();
    await expect(constructorZone.getByText('Соус Spicy-X')).toBeVisible();
    await expect(constructorZone.getByText('5600', { exact: true })).toBeVisible();


    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    const modal = page.getByTestId('modal');
    await expect(modal).toBeVisible();
    await expect(modal.getByText('1219')).toBeVisible();

    await page.mouse.click(10, 10);
    await expect(modal).toBeHidden();

    await expect(constructorZone.getByText('Выберите булки').first()).toBeVisible();
    await expect(constructorZone.getByText('0', { exact: true })).toBeVisible();

    await page.waitForTimeout(1000);
  });
});

