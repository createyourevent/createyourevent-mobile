import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { PropertyComponentsPage, PropertyDetailPage, PropertyUpdatePage } from './property.po';

describe('Property e2e test', () => {
  let loginPage: LoginPage;
  let propertyComponentsPage: PropertyComponentsPage;
  let propertyUpdatePage: PropertyUpdatePage;
  let propertyDetailPage: PropertyDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Properties';
  const SUBCOMPONENT_TITLE = 'Property';
  let lastElement: any;
  let isVisible = false;

  const id = '10';
  const key = 'key';
  const value = 'value';

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

  it('should load Properties', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'Property')
      .first()
      .click();

    propertyComponentsPage = new PropertyComponentsPage();
    await browser.wait(ec.visibilityOf(propertyComponentsPage.title), 5000);
    expect(await propertyComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(ec.visibilityOf(propertyComponentsPage.entities.get(0)), ec.visibilityOf(propertyComponentsPage.noResult)),
      5000
    );
  });

  it('should create Property', async () => {
    initNumberOfEntities = await propertyComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(propertyComponentsPage.createButton), 5000);
    await propertyComponentsPage.clickOnCreateButton();
    propertyUpdatePage = new PropertyUpdatePage();
    await browser.wait(ec.visibilityOf(propertyUpdatePage.pageTitle), 3000);
    expect(await propertyUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await propertyUpdatePage.setKeyInput(key);
    await propertyUpdatePage.setValueInput(value);

    await propertyUpdatePage.save();
    await browser.wait(ec.visibilityOf(propertyComponentsPage.title), 3000);
    expect(await propertyComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await propertyComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last Property', async () => {
    propertyComponentsPage = new PropertyComponentsPage();
    await browser.wait(ec.visibilityOf(propertyComponentsPage.title), 5000);
    lastElement = await propertyComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last Property', async () => {
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

  it('should view the last Property', async () => {
    propertyDetailPage = new PropertyDetailPage();
    if (isVisible && (await propertyDetailPage.pageTitle.isDisplayed())) {
      expect(await propertyDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await propertyDetailPage.getIdInput()).toEqual(id);

      expect(await propertyDetailPage.getKeyInput()).toEqual(key);

      expect(await propertyDetailPage.getValueInput()).toEqual(value);
    }
  });

  it('should delete last Property', async () => {
    propertyDetailPage = new PropertyDetailPage();
    if (isVisible && (await propertyDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await propertyDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(propertyComponentsPage.title), 3000);
      expect(await propertyComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await propertyComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish Properties tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
