import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { PointComponentsPage, PointDetailPage, PointUpdatePage } from './point.po';

describe('Point e2e test', () => {
  let loginPage: LoginPage;
  let pointComponentsPage: PointComponentsPage;
  let pointUpdatePage: PointUpdatePage;
  let pointDetailPage: PointDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Points';
  const SUBCOMPONENT_TITLE = 'Point';
  let lastElement: any;
  let isVisible = false;

  const id = '10';
  const key = 'key';
  const name = 'name';
  const keyName = 'keyName';
  const description = 'description';
  const keyDescription = 'keyDescription';
  const points = '10';
  const countPerDay = '10';

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

  it('should load Points', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'Point')
      .first()
      .click();

    pointComponentsPage = new PointComponentsPage();
    await browser.wait(ec.visibilityOf(pointComponentsPage.title), 5000);
    expect(await pointComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(ec.or(ec.visibilityOf(pointComponentsPage.entities.get(0)), ec.visibilityOf(pointComponentsPage.noResult)), 5000);
  });

  it('should create Point', async () => {
    initNumberOfEntities = await pointComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(pointComponentsPage.createButton), 5000);
    await pointComponentsPage.clickOnCreateButton();
    pointUpdatePage = new PointUpdatePage();
    await browser.wait(ec.visibilityOf(pointUpdatePage.pageTitle), 3000);
    expect(await pointUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await pointUpdatePage.setKeyInput(key);
    await pointUpdatePage.setNameInput(name);
    await pointUpdatePage.setKeyNameInput(keyName);
    await pointUpdatePage.setDescriptionInput(description);
    await pointUpdatePage.setKeyDescriptionInput(keyDescription);
    await pointUpdatePage.categorySelectLastOption();
    await pointUpdatePage.setPointsInput(points);
    await pointUpdatePage.setCountPerDayInput(countPerDay);

    await pointUpdatePage.save();
    await browser.wait(ec.visibilityOf(pointComponentsPage.title), 3000);
    expect(await pointComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await pointComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last Point', async () => {
    pointComponentsPage = new PointComponentsPage();
    await browser.wait(ec.visibilityOf(pointComponentsPage.title), 5000);
    lastElement = await pointComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last Point', async () => {
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

  it('should view the last Point', async () => {
    pointDetailPage = new PointDetailPage();
    if (isVisible && (await pointDetailPage.pageTitle.isDisplayed())) {
      expect(await pointDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await pointDetailPage.getIdInput()).toEqual(id);

      expect(await pointDetailPage.getKeyInput()).toEqual(key);

      expect(await pointDetailPage.getNameInput()).toEqual(name);

      expect(await pointDetailPage.getKeyNameInput()).toEqual(keyName);

      expect(await pointDetailPage.getDescriptionInput()).toEqual(description);

      expect(await pointDetailPage.getKeyDescriptionInput()).toEqual(keyDescription);

      expect(await pointDetailPage.getPointsInput()).toEqual(points);

      expect(await pointDetailPage.getCountPerDayInput()).toEqual(countPerDay);
    }
  });

  it('should delete last Point', async () => {
    pointDetailPage = new PointDetailPage();
    if (isVisible && (await pointDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await pointDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(pointComponentsPage.title), 3000);
      expect(await pointComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await pointComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish Points tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
