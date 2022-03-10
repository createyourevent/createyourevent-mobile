import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { CartComponentsPage, CartDetailPage, CartUpdatePage } from './cart.po';

describe('Cart e2e test', () => {
  let loginPage: LoginPage;
  let cartComponentsPage: CartComponentsPage;
  let cartUpdatePage: CartUpdatePage;
  let cartDetailPage: CartDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Carts';
  const SUBCOMPONENT_TITLE = 'Cart';
  let lastElement: any;
  let isVisible = false;

  const id = '10';
  const totalCosts = '10';

  beforeAll(async () => {
    loginPage = new LoginPage();
    await loginPage.navigateTo('/');
    await browser.sleep(1000);
    await browser.wait(ec.visibilityOf(loginPage.signInButton), 3000);
    await loginPage.signInButton.click();
    const username = process.env.E2E_USERNAME || 'admin';
    const password = process.env.E2E_PASSWORD || 'admin';
    await loginPage.login(username, password);
  });

  it('should load Carts', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'Cart')
      .first()
      .click();

    cartComponentsPage = new CartComponentsPage();
    await browser.wait(ec.visibilityOf(cartComponentsPage.title), 5000);
    expect(await cartComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(ec.or(ec.visibilityOf(cartComponentsPage.entities.get(0)), ec.visibilityOf(cartComponentsPage.noResult)), 5000);
  });

  it('should create Cart', async () => {
    initNumberOfEntities = await cartComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(cartComponentsPage.createButton), 5000);
    await cartComponentsPage.clickOnCreateButton();
    cartUpdatePage = new CartUpdatePage();
    await browser.wait(ec.visibilityOf(cartUpdatePage.pageTitle), 3000);
    expect(await cartUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await cartUpdatePage.setTotalCostsInput(totalCosts);

    await cartUpdatePage.save();
    await browser.wait(ec.visibilityOf(cartComponentsPage.title), 3000);
    expect(await cartComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await cartComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last Cart', async () => {
    cartComponentsPage = new CartComponentsPage();
    await browser.wait(ec.visibilityOf(cartComponentsPage.title), 5000);
    lastElement = await cartComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last Cart', async () => {
    browser
      .executeScript('arguments[0].scrollIntoView()', lastElement)
      .then(async () => {
        if ((await lastElement.isEnabled()) && (await lastElement.isDisplayed())) {
          browser
            .executeScript('arguments[0].click()', lastElement)
            .then(async () => {
              isVisible = true;
            })
            .catch();
        }
      })
      .catch();
  });

  it('should view the last Cart', async () => {
    cartDetailPage = new CartDetailPage();
    if (isVisible && (await cartDetailPage.pageTitle.isDisplayed())) {
      expect(await cartDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await cartDetailPage.getIdInput()).toEqual(id);

      expect(await cartDetailPage.getTotalCostsInput()).toEqual(totalCosts);
    }
  });

  it('should delete last Cart', async () => {
    cartDetailPage = new CartDetailPage();
    if (isVisible && (await cartDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await cartDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(cartComponentsPage.title), 3000);
      expect(await cartComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await cartComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish Carts tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
