import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { FeeBalanceComponentsPage, FeeBalanceDetailPage, FeeBalanceUpdatePage } from './fee-balance.po';

describe('FeeBalance e2e test', () => {
  let loginPage: LoginPage;
  let feeBalanceComponentsPage: FeeBalanceComponentsPage;
  let feeBalanceUpdatePage: FeeBalanceUpdatePage;
  let feeBalanceDetailPage: FeeBalanceDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Fee Balances';
  const SUBCOMPONENT_TITLE = 'Fee Balance';
  let lastElement: any;
  let isVisible = false;

  const id = '10';
  const total = '10';

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

  it('should load FeeBalances', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'FeeBalance')
      .first()
      .click();

    feeBalanceComponentsPage = new FeeBalanceComponentsPage();
    await browser.wait(ec.visibilityOf(feeBalanceComponentsPage.title), 5000);
    expect(await feeBalanceComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(ec.visibilityOf(feeBalanceComponentsPage.entities.get(0)), ec.visibilityOf(feeBalanceComponentsPage.noResult)),
      5000
    );
  });

  it('should create FeeBalance', async () => {
    initNumberOfEntities = await feeBalanceComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(feeBalanceComponentsPage.createButton), 5000);
    await feeBalanceComponentsPage.clickOnCreateButton();
    feeBalanceUpdatePage = new FeeBalanceUpdatePage();
    await browser.wait(ec.visibilityOf(feeBalanceUpdatePage.pageTitle), 3000);
    expect(await feeBalanceUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await feeBalanceUpdatePage.typeSelectLastOption();
    await feeBalanceUpdatePage.setTotalInput(total);

    await feeBalanceUpdatePage.save();
    await browser.wait(ec.visibilityOf(feeBalanceComponentsPage.title), 3000);
    expect(await feeBalanceComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await feeBalanceComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last FeeBalance', async () => {
    feeBalanceComponentsPage = new FeeBalanceComponentsPage();
    await browser.wait(ec.visibilityOf(feeBalanceComponentsPage.title), 5000);
    lastElement = await feeBalanceComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last FeeBalance', async () => {
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

  it('should view the last FeeBalance', async () => {
    feeBalanceDetailPage = new FeeBalanceDetailPage();
    if (isVisible && (await feeBalanceDetailPage.pageTitle.isDisplayed())) {
      expect(await feeBalanceDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await feeBalanceDetailPage.getIdInput()).toEqual(id);

      expect(await feeBalanceDetailPage.getTotalInput()).toEqual(total);
    }
  });

  it('should delete last FeeBalance', async () => {
    feeBalanceDetailPage = new FeeBalanceDetailPage();
    if (isVisible && (await feeBalanceDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await feeBalanceDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(feeBalanceComponentsPage.title), 3000);
      expect(await feeBalanceComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await feeBalanceComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish FeeBalances tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
