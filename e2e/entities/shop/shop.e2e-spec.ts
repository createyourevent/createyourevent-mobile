import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { ShopComponentsPage, ShopDetailPage, ShopUpdatePage } from './shop.po';

describe('Shop e2e test', () => {
  let loginPage: LoginPage;
  let shopComponentsPage: ShopComponentsPage;
  let shopUpdatePage: ShopUpdatePage;
  let shopDetailPage: ShopDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Shops';
  const SUBCOMPONENT_TITLE = 'Shop';
  let lastElement: any;
  let isVisible = false;

  const id = '10';
  const name = 'name';
  const description = 'description';
  const address = 'address';
  const motto = 'motto';
  const phone = 'phone';
  const webAddress = 'webAddress';

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

  it('should load Shops', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'Shop')
      .first()
      .click();

    shopComponentsPage = new ShopComponentsPage();
    await browser.wait(ec.visibilityOf(shopComponentsPage.title), 5000);
    expect(await shopComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(ec.or(ec.visibilityOf(shopComponentsPage.entities.get(0)), ec.visibilityOf(shopComponentsPage.noResult)), 5000);
  });

  it('should create Shop', async () => {
    initNumberOfEntities = await shopComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(shopComponentsPage.createButton), 5000);
    await shopComponentsPage.clickOnCreateButton();
    shopUpdatePage = new ShopUpdatePage();
    await browser.wait(ec.visibilityOf(shopUpdatePage.pageTitle), 3000);
    expect(await shopUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await shopUpdatePage.setNameInput(name);
    await shopUpdatePage.productTypeSelectLastOption();
    await shopUpdatePage.setLogoInput(logo);
    await shopUpdatePage.setDescriptionInput(description);
    await shopUpdatePage.setAddressInput(address);
    await shopUpdatePage.setMottoInput(motto);
    await shopUpdatePage.setPhoneInput(phone);
    await shopUpdatePage.setWebAddressInput(webAddress);

    await shopUpdatePage.save();
    await browser.wait(ec.visibilityOf(shopComponentsPage.title), 3000);
    expect(await shopComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await shopComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last Shop', async () => {
    shopComponentsPage = new ShopComponentsPage();
    await browser.wait(ec.visibilityOf(shopComponentsPage.title), 5000);
    lastElement = await shopComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last Shop', async () => {
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

  it('should view the last Shop', async () => {
    shopDetailPage = new ShopDetailPage();
    if (isVisible && (await shopDetailPage.pageTitle.isDisplayed())) {
      expect(await shopDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await shopDetailPage.getIdInput()).toEqual(id);

      expect(await shopDetailPage.getNameInput()).toEqual(name);

      expect(await shopDetailPage.getLogoInput()).toEqual(logo);

      expect(await shopDetailPage.getDescriptionInput()).toEqual(description);

      expect(await shopDetailPage.getAddressInput()).toEqual(address);

      expect(await shopDetailPage.getMottoInput()).toEqual(motto);

      expect(await shopDetailPage.getPhoneInput()).toEqual(phone);

      expect(await shopDetailPage.getWebAddressInput()).toEqual(webAddress);
    }
  });

  it('should delete last Shop', async () => {
    shopDetailPage = new ShopDetailPage();
    if (isVisible && (await shopDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await shopDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(shopComponentsPage.title), 3000);
      expect(await shopComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await shopComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish Shops tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
