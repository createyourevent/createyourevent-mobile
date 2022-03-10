import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { BuildingComponentsPage, BuildingDetailPage, BuildingUpdatePage } from './building.po';

describe('Building e2e test', () => {
  let loginPage: LoginPage;
  let buildingComponentsPage: BuildingComponentsPage;
  let buildingUpdatePage: BuildingUpdatePage;
  let buildingDetailPage: BuildingDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Buildings';
  const SUBCOMPONENT_TITLE = 'Building';
  let lastElement: any;
  let isVisible = false;

  const id = '10';
  const surface = '10';

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

  it('should load Buildings', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'Building')
      .first()
      .click();

    buildingComponentsPage = new BuildingComponentsPage();
    await browser.wait(ec.visibilityOf(buildingComponentsPage.title), 5000);
    expect(await buildingComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(ec.visibilityOf(buildingComponentsPage.entities.get(0)), ec.visibilityOf(buildingComponentsPage.noResult)),
      5000
    );
  });

  it('should create Building', async () => {
    initNumberOfEntities = await buildingComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(buildingComponentsPage.createButton), 5000);
    await buildingComponentsPage.clickOnCreateButton();
    buildingUpdatePage = new BuildingUpdatePage();
    await browser.wait(ec.visibilityOf(buildingUpdatePage.pageTitle), 3000);
    expect(await buildingUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await buildingUpdatePage.setSurfaceInput(surface);

    await buildingUpdatePage.save();
    await browser.wait(ec.visibilityOf(buildingComponentsPage.title), 3000);
    expect(await buildingComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await buildingComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last Building', async () => {
    buildingComponentsPage = new BuildingComponentsPage();
    await browser.wait(ec.visibilityOf(buildingComponentsPage.title), 5000);
    lastElement = await buildingComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last Building', async () => {
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

  it('should view the last Building', async () => {
    buildingDetailPage = new BuildingDetailPage();
    if (isVisible && (await buildingDetailPage.pageTitle.isDisplayed())) {
      expect(await buildingDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await buildingDetailPage.getIdInput()).toEqual(id);

      expect(await buildingDetailPage.getSurfaceInput()).toEqual(surface);
    }
  });

  it('should delete last Building', async () => {
    buildingDetailPage = new BuildingDetailPage();
    if (isVisible && (await buildingDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await buildingDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(buildingComponentsPage.title), 3000);
      expect(await buildingComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await buildingComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish Buildings tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
