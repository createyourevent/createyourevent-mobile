import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { PointsExchangeComponentsPage, PointsExchangeDetailPage, PointsExchangeUpdatePage } from './points-exchange.po';

describe('PointsExchange e2e test', () => {
  let loginPage: LoginPage;
  let pointsExchangeComponentsPage: PointsExchangeComponentsPage;
  let pointsExchangeUpdatePage: PointsExchangeUpdatePage;
  let pointsExchangeDetailPage: PointsExchangeDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Points Exchanges';
  const SUBCOMPONENT_TITLE = 'Points Exchange';
  let lastElement: any;
  let isVisible = false;

  const id = '10';
  const pointsTotal = '10';
  const bondPointsTotal = '10';

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

  it('should load PointsExchanges', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'PointsExchange')
      .first()
      .click();

    pointsExchangeComponentsPage = new PointsExchangeComponentsPage();
    await browser.wait(ec.visibilityOf(pointsExchangeComponentsPage.title), 5000);
    expect(await pointsExchangeComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(ec.visibilityOf(pointsExchangeComponentsPage.entities.get(0)), ec.visibilityOf(pointsExchangeComponentsPage.noResult)),
      5000
    );
  });

  it('should create PointsExchange', async () => {
    initNumberOfEntities = await pointsExchangeComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(pointsExchangeComponentsPage.createButton), 5000);
    await pointsExchangeComponentsPage.clickOnCreateButton();
    pointsExchangeUpdatePage = new PointsExchangeUpdatePage();
    await browser.wait(ec.visibilityOf(pointsExchangeUpdatePage.pageTitle), 3000);
    expect(await pointsExchangeUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await pointsExchangeUpdatePage.setPointsTotalInput(pointsTotal);
    await pointsExchangeUpdatePage.setBondPointsTotalInput(bondPointsTotal);

    await pointsExchangeUpdatePage.save();
    await browser.wait(ec.visibilityOf(pointsExchangeComponentsPage.title), 3000);
    expect(await pointsExchangeComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await pointsExchangeComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last PointsExchange', async () => {
    pointsExchangeComponentsPage = new PointsExchangeComponentsPage();
    await browser.wait(ec.visibilityOf(pointsExchangeComponentsPage.title), 5000);
    lastElement = await pointsExchangeComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last PointsExchange', async () => {
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

  it('should view the last PointsExchange', async () => {
    pointsExchangeDetailPage = new PointsExchangeDetailPage();
    if (isVisible && (await pointsExchangeDetailPage.pageTitle.isDisplayed())) {
      expect(await pointsExchangeDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await pointsExchangeDetailPage.getIdInput()).toEqual(id);

      expect(await pointsExchangeDetailPage.getPointsTotalInput()).toEqual(pointsTotal);

      expect(await pointsExchangeDetailPage.getBondPointsTotalInput()).toEqual(bondPointsTotal);
    }
  });

  it('should delete last PointsExchange', async () => {
    pointsExchangeDetailPage = new PointsExchangeDetailPage();
    if (isVisible && (await pointsExchangeDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await pointsExchangeDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(pointsExchangeComponentsPage.title), 3000);
      expect(await pointsExchangeComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await pointsExchangeComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish PointsExchanges tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
