import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { RideCostsComponentsPage, RideCostsDetailPage, RideCostsUpdatePage } from './ride-costs.po';

describe('RideCosts e2e test', () => {
  let loginPage: LoginPage;
  let rideCostsComponentsPage: RideCostsComponentsPage;
  let rideCostsUpdatePage: RideCostsUpdatePage;
  let rideCostsDetailPage: RideCostsDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Ride Costs';
  const SUBCOMPONENT_TITLE = 'Ride Costs';
  let lastElement: any;
  let isVisible = false;

  const id = '10';
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

  it('should load RideCosts', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'RideCosts')
      .first()
      .click();

    rideCostsComponentsPage = new RideCostsComponentsPage();
    await browser.wait(ec.visibilityOf(rideCostsComponentsPage.title), 5000);
    expect(await rideCostsComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(ec.visibilityOf(rideCostsComponentsPage.entities.get(0)), ec.visibilityOf(rideCostsComponentsPage.noResult)),
      5000
    );
  });

  it('should create RideCosts', async () => {
    initNumberOfEntities = await rideCostsComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(rideCostsComponentsPage.createButton), 5000);
    await rideCostsComponentsPage.clickOnCreateButton();
    rideCostsUpdatePage = new RideCostsUpdatePage();
    await browser.wait(ec.visibilityOf(rideCostsUpdatePage.pageTitle), 3000);
    expect(await rideCostsUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await rideCostsUpdatePage.setPricePerKilometreInput(pricePerKilometre);

    await rideCostsUpdatePage.save();
    await browser.wait(ec.visibilityOf(rideCostsComponentsPage.title), 3000);
    expect(await rideCostsComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await rideCostsComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last RideCosts', async () => {
    rideCostsComponentsPage = new RideCostsComponentsPage();
    await browser.wait(ec.visibilityOf(rideCostsComponentsPage.title), 5000);
    lastElement = await rideCostsComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last RideCosts', async () => {
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

  it('should view the last RideCosts', async () => {
    rideCostsDetailPage = new RideCostsDetailPage();
    if (isVisible && (await rideCostsDetailPage.pageTitle.isDisplayed())) {
      expect(await rideCostsDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await rideCostsDetailPage.getIdInput()).toEqual(id);

      expect(await rideCostsDetailPage.getPricePerKilometreInput()).toEqual(pricePerKilometre);
    }
  });

  it('should delete last RideCosts', async () => {
    rideCostsDetailPage = new RideCostsDetailPage();
    if (isVisible && (await rideCostsDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await rideCostsDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(rideCostsComponentsPage.title), 3000);
      expect(await rideCostsComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await rideCostsComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish RideCosts tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
