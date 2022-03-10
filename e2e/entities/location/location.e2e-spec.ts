import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { LocationComponentsPage, LocationDetailPage, LocationUpdatePage } from './location.po';

describe('Location e2e test', () => {
  let loginPage: LoginPage;
  let locationComponentsPage: LocationComponentsPage;
  let locationUpdatePage: LocationUpdatePage;
  let locationDetailPage: LocationDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Locations';
  const SUBCOMPONENT_TITLE = 'Location';
  let lastElement: any;
  let isVisible = false;

  const id = '10';
  const name = 'name';
  const description = 'description';

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

  it('should load Locations', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'Location')
      .first()
      .click();

    locationComponentsPage = new LocationComponentsPage();
    await browser.wait(ec.visibilityOf(locationComponentsPage.title), 5000);
    expect(await locationComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(ec.visibilityOf(locationComponentsPage.entities.get(0)), ec.visibilityOf(locationComponentsPage.noResult)),
      5000
    );
  });

  it('should create Location', async () => {
    initNumberOfEntities = await locationComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(locationComponentsPage.createButton), 5000);
    await locationComponentsPage.clickOnCreateButton();
    locationUpdatePage = new LocationUpdatePage();
    await browser.wait(ec.visibilityOf(locationUpdatePage.pageTitle), 3000);
    expect(await locationUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await locationUpdatePage.setNameInput(name);
    await locationUpdatePage.setDescriptionInput(description);
    await locationUpdatePage.setPhotoInput(photo);

    await locationUpdatePage.save();
    await browser.wait(ec.visibilityOf(locationComponentsPage.title), 3000);
    expect(await locationComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await locationComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last Location', async () => {
    locationComponentsPage = new LocationComponentsPage();
    await browser.wait(ec.visibilityOf(locationComponentsPage.title), 5000);
    lastElement = await locationComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last Location', async () => {
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

  it('should view the last Location', async () => {
    locationDetailPage = new LocationDetailPage();
    if (isVisible && (await locationDetailPage.pageTitle.isDisplayed())) {
      expect(await locationDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await locationDetailPage.getIdInput()).toEqual(id);

      expect(await locationDetailPage.getNameInput()).toEqual(name);

      expect(await locationDetailPage.getDescriptionInput()).toEqual(description);

      expect(await locationDetailPage.getPhotoInput()).toEqual(photo);
    }
  });

  it('should delete last Location', async () => {
    locationDetailPage = new LocationDetailPage();
    if (isVisible && (await locationDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await locationDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(locationComponentsPage.title), 3000);
      expect(await locationComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await locationComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish Locations tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
