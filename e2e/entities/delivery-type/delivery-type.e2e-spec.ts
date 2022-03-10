import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { DeliveryTypeComponentsPage, DeliveryTypeDetailPage, DeliveryTypeUpdatePage } from './delivery-type.po';

describe('DeliveryType e2e test', () => {
  let loginPage: LoginPage;
  let deliveryTypeComponentsPage: DeliveryTypeComponentsPage;
  let deliveryTypeUpdatePage: DeliveryTypeUpdatePage;
  let deliveryTypeDetailPage: DeliveryTypeDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Delivery Types';
  const SUBCOMPONENT_TITLE = 'Delivery Type';
  let lastElement: any;
  let isVisible = false;

  const id = '10';
  const minimumOrderQuantity = '10';
  const price = '10';
  const pricePerKilometre = '10';

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

  it('should load DeliveryTypes', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'DeliveryType')
      .first()
      .click();

    deliveryTypeComponentsPage = new DeliveryTypeComponentsPage();
    await browser.wait(ec.visibilityOf(deliveryTypeComponentsPage.title), 5000);
    expect(await deliveryTypeComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(ec.visibilityOf(deliveryTypeComponentsPage.entities.get(0)), ec.visibilityOf(deliveryTypeComponentsPage.noResult)),
      5000
    );
  });

  it('should create DeliveryType', async () => {
    initNumberOfEntities = await deliveryTypeComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(deliveryTypeComponentsPage.createButton), 5000);
    await deliveryTypeComponentsPage.clickOnCreateButton();
    deliveryTypeUpdatePage = new DeliveryTypeUpdatePage();
    await browser.wait(ec.visibilityOf(deliveryTypeUpdatePage.pageTitle), 3000);
    expect(await deliveryTypeUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await deliveryTypeUpdatePage.deliveryTypeSelectLastOption();
    await deliveryTypeUpdatePage.setMinimumOrderQuantityInput(minimumOrderQuantity);
    await deliveryTypeUpdatePage.setPriceInput(price);
    await deliveryTypeUpdatePage.setPricePerKilometreInput(pricePerKilometre);

    await deliveryTypeUpdatePage.save();
    await browser.wait(ec.visibilityOf(deliveryTypeComponentsPage.title), 3000);
    expect(await deliveryTypeComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await deliveryTypeComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last DeliveryType', async () => {
    deliveryTypeComponentsPage = new DeliveryTypeComponentsPage();
    await browser.wait(ec.visibilityOf(deliveryTypeComponentsPage.title), 5000);
    lastElement = await deliveryTypeComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last DeliveryType', async () => {
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

  it('should view the last DeliveryType', async () => {
    deliveryTypeDetailPage = new DeliveryTypeDetailPage();
    if (isVisible && (await deliveryTypeDetailPage.pageTitle.isDisplayed())) {
      expect(await deliveryTypeDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await deliveryTypeDetailPage.getIdInput()).toEqual(id);

      expect(await deliveryTypeDetailPage.getMinimumOrderQuantityInput()).toEqual(minimumOrderQuantity);

      expect(await deliveryTypeDetailPage.getPriceInput()).toEqual(price);

      expect(await deliveryTypeDetailPage.getPricePerKilometreInput()).toEqual(pricePerKilometre);
    }
  });

  it('should delete last DeliveryType', async () => {
    deliveryTypeDetailPage = new DeliveryTypeDetailPage();
    if (isVisible && (await deliveryTypeDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await deliveryTypeDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(deliveryTypeComponentsPage.title), 3000);
      expect(await deliveryTypeComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await deliveryTypeComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish DeliveryTypes tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
