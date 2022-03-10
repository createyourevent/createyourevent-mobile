import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { GiftShoppingCartComponentsPage, GiftShoppingCartDetailPage, GiftShoppingCartUpdatePage } from './gift-shopping-cart.po';

describe('GiftShoppingCart e2e test', () => {
  let loginPage: LoginPage;
  let giftShoppingCartComponentsPage: GiftShoppingCartComponentsPage;
  let giftShoppingCartUpdatePage: GiftShoppingCartUpdatePage;
  let giftShoppingCartDetailPage: GiftShoppingCartDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Gift Shopping Carts';
  const SUBCOMPONENT_TITLE = 'Gift Shopping Cart';
  let lastElement: any;
  let isVisible = false;

  const id = '10';
  const amount = '10';

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

  it('should load GiftShoppingCarts', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'GiftShoppingCart')
      .first()
      .click();

    giftShoppingCartComponentsPage = new GiftShoppingCartComponentsPage();
    await browser.wait(ec.visibilityOf(giftShoppingCartComponentsPage.title), 5000);
    expect(await giftShoppingCartComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(ec.visibilityOf(giftShoppingCartComponentsPage.entities.get(0)), ec.visibilityOf(giftShoppingCartComponentsPage.noResult)),
      5000
    );
  });

  it('should create GiftShoppingCart', async () => {
    initNumberOfEntities = await giftShoppingCartComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(giftShoppingCartComponentsPage.createButton), 5000);
    await giftShoppingCartComponentsPage.clickOnCreateButton();
    giftShoppingCartUpdatePage = new GiftShoppingCartUpdatePage();
    await browser.wait(ec.visibilityOf(giftShoppingCartUpdatePage.pageTitle), 3000);
    expect(await giftShoppingCartUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await giftShoppingCartUpdatePage.setAmountInput(amount);

    await giftShoppingCartUpdatePage.save();
    await browser.wait(ec.visibilityOf(giftShoppingCartComponentsPage.title), 3000);
    expect(await giftShoppingCartComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await giftShoppingCartComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last GiftShoppingCart', async () => {
    giftShoppingCartComponentsPage = new GiftShoppingCartComponentsPage();
    await browser.wait(ec.visibilityOf(giftShoppingCartComponentsPage.title), 5000);
    lastElement = await giftShoppingCartComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last GiftShoppingCart', async () => {
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

  it('should view the last GiftShoppingCart', async () => {
    giftShoppingCartDetailPage = new GiftShoppingCartDetailPage();
    if (isVisible && (await giftShoppingCartDetailPage.pageTitle.isDisplayed())) {
      expect(await giftShoppingCartDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await giftShoppingCartDetailPage.getIdInput()).toEqual(id);

      expect(await giftShoppingCartDetailPage.getAmountInput()).toEqual(amount);
    }
  });

  it('should delete last GiftShoppingCart', async () => {
    giftShoppingCartDetailPage = new GiftShoppingCartDetailPage();
    if (isVisible && (await giftShoppingCartDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await giftShoppingCartDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(giftShoppingCartComponentsPage.title), 3000);
      expect(await giftShoppingCartComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await giftShoppingCartComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish GiftShoppingCarts tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
