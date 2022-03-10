import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { BondComponentsPage, BondDetailPage, BondUpdatePage } from './bond.po';

describe('Bond e2e test', () => {
  let loginPage: LoginPage;
  let bondComponentsPage: BondComponentsPage;
  let bondUpdatePage: BondUpdatePage;
  let bondDetailPage: BondDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Bonds';
  const SUBCOMPONENT_TITLE = 'Bond';
  let lastElement: any;
  let isVisible = false;

  const id = '10';
  const name = 'name';
  const description = 'description';
  const code = 'code';
  const points = '10';

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

  it('should load Bonds', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'Bond')
      .first()
      .click();

    bondComponentsPage = new BondComponentsPage();
    await browser.wait(ec.visibilityOf(bondComponentsPage.title), 5000);
    expect(await bondComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(ec.or(ec.visibilityOf(bondComponentsPage.entities.get(0)), ec.visibilityOf(bondComponentsPage.noResult)), 5000);
  });

  it('should create Bond', async () => {
    initNumberOfEntities = await bondComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(bondComponentsPage.createButton), 5000);
    await bondComponentsPage.clickOnCreateButton();
    bondUpdatePage = new BondUpdatePage();
    await browser.wait(ec.visibilityOf(bondUpdatePage.pageTitle), 3000);
    expect(await bondUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await bondUpdatePage.setNameInput(name);
    await bondUpdatePage.setDescriptionInput(description);
    await bondUpdatePage.setCodeInput(code);
    await bondUpdatePage.setPointsInput(points);

    await bondUpdatePage.save();
    await browser.wait(ec.visibilityOf(bondComponentsPage.title), 3000);
    expect(await bondComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await bondComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last Bond', async () => {
    bondComponentsPage = new BondComponentsPage();
    await browser.wait(ec.visibilityOf(bondComponentsPage.title), 5000);
    lastElement = await bondComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last Bond', async () => {
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

  it('should view the last Bond', async () => {
    bondDetailPage = new BondDetailPage();
    if (isVisible && (await bondDetailPage.pageTitle.isDisplayed())) {
      expect(await bondDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await bondDetailPage.getIdInput()).toEqual(id);

      expect(await bondDetailPage.getNameInput()).toEqual(name);

      expect(await bondDetailPage.getDescriptionInput()).toEqual(description);

      expect(await bondDetailPage.getCodeInput()).toEqual(code);

      expect(await bondDetailPage.getPointsInput()).toEqual(points);
    }
  });

  it('should delete last Bond', async () => {
    bondDetailPage = new BondDetailPage();
    if (isVisible && (await bondDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await bondDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(bondComponentsPage.title), 3000);
      expect(await bondComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await bondComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish Bonds tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
