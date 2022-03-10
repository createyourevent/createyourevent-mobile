import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { AddressComponentsPage, AddressDetailPage, AddressUpdatePage } from './address.po';

describe('Address e2e test', () => {
  let loginPage: LoginPage;
  let addressComponentsPage: AddressComponentsPage;
  let addressUpdatePage: AddressUpdatePage;
  let addressDetailPage: AddressDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Addresses';
  const SUBCOMPONENT_TITLE = 'Address';
  let lastElement: any;
  let isVisible = false;

  const id = '10';
  const address = 'address';
  const lat = '10';
  const lng = '10';

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

  it('should load Addresses', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'Address')
      .first()
      .click();

    addressComponentsPage = new AddressComponentsPage();
    await browser.wait(ec.visibilityOf(addressComponentsPage.title), 5000);
    expect(await addressComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(ec.visibilityOf(addressComponentsPage.entities.get(0)), ec.visibilityOf(addressComponentsPage.noResult)),
      5000
    );
  });

  it('should create Address', async () => {
    initNumberOfEntities = await addressComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(addressComponentsPage.createButton), 5000);
    await addressComponentsPage.clickOnCreateButton();
    addressUpdatePage = new AddressUpdatePage();
    await browser.wait(ec.visibilityOf(addressUpdatePage.pageTitle), 3000);
    expect(await addressUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await addressUpdatePage.setAddressInput(address);
    await addressUpdatePage.setLatInput(lat);
    await addressUpdatePage.setLngInput(lng);

    await addressUpdatePage.save();
    await browser.wait(ec.visibilityOf(addressComponentsPage.title), 3000);
    expect(await addressComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await addressComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last Address', async () => {
    addressComponentsPage = new AddressComponentsPage();
    await browser.wait(ec.visibilityOf(addressComponentsPage.title), 5000);
    lastElement = await addressComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last Address', async () => {
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

  it('should view the last Address', async () => {
    addressDetailPage = new AddressDetailPage();
    if (isVisible && (await addressDetailPage.pageTitle.isDisplayed())) {
      expect(await addressDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await addressDetailPage.getIdInput()).toEqual(id);

      expect(await addressDetailPage.getAddressInput()).toEqual(address);

      expect(await addressDetailPage.getLatInput()).toEqual(lat);

      expect(await addressDetailPage.getLngInput()).toEqual(lng);
    }
  });

  it('should delete last Address', async () => {
    addressDetailPage = new AddressDetailPage();
    if (isVisible && (await addressDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await addressDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(addressComponentsPage.title), 3000);
      expect(await addressComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await addressComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish Addresses tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
