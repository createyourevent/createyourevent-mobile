import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { FeeTransactionComponentsPage, FeeTransactionDetailPage, FeeTransactionUpdatePage } from './fee-transaction.po';

describe('FeeTransaction e2e test', () => {
  let loginPage: LoginPage;
  let feeTransactionComponentsPage: FeeTransactionComponentsPage;
  let feeTransactionUpdatePage: FeeTransactionUpdatePage;
  let feeTransactionDetailPage: FeeTransactionDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Fee Transactions';
  const SUBCOMPONENT_TITLE = 'Fee Transaction';
  let lastElement: any;
  let isVisible = false;

  const id = '10';

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

  it('should load FeeTransactions', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'FeeTransaction')
      .first()
      .click();

    feeTransactionComponentsPage = new FeeTransactionComponentsPage();
    await browser.wait(ec.visibilityOf(feeTransactionComponentsPage.title), 5000);
    expect(await feeTransactionComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(ec.visibilityOf(feeTransactionComponentsPage.entities.get(0)), ec.visibilityOf(feeTransactionComponentsPage.noResult)),
      5000
    );
  });

  it('should create FeeTransaction', async () => {
    initNumberOfEntities = await feeTransactionComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(feeTransactionComponentsPage.createButton), 5000);
    await feeTransactionComponentsPage.clickOnCreateButton();
    feeTransactionUpdatePage = new FeeTransactionUpdatePage();
    await browser.wait(ec.visibilityOf(feeTransactionUpdatePage.pageTitle), 3000);
    expect(await feeTransactionUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await feeTransactionUpdatePage.save();
    await browser.wait(ec.visibilityOf(feeTransactionComponentsPage.title), 3000);
    expect(await feeTransactionComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await feeTransactionComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last FeeTransaction', async () => {
    feeTransactionComponentsPage = new FeeTransactionComponentsPage();
    await browser.wait(ec.visibilityOf(feeTransactionComponentsPage.title), 5000);
    lastElement = await feeTransactionComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last FeeTransaction', async () => {
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

  it('should view the last FeeTransaction', async () => {
    feeTransactionDetailPage = new FeeTransactionDetailPage();
    if (isVisible && (await feeTransactionDetailPage.pageTitle.isDisplayed())) {
      expect(await feeTransactionDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await feeTransactionDetailPage.getIdInput()).toEqual(id);
    }
  });

  it('should delete last FeeTransaction', async () => {
    feeTransactionDetailPage = new FeeTransactionDetailPage();
    if (isVisible && (await feeTransactionDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await feeTransactionDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(feeTransactionComponentsPage.title), 3000);
      expect(await feeTransactionComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await feeTransactionComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish FeeTransactions tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
