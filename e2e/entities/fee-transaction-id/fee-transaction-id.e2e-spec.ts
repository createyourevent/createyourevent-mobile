import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { FeeTransactionIdComponentsPage, FeeTransactionIdDetailPage, FeeTransactionIdUpdatePage } from './fee-transaction-id.po';

describe('FeeTransactionId e2e test', () => {
  let loginPage: LoginPage;
  let feeTransactionIdComponentsPage: FeeTransactionIdComponentsPage;
  let feeTransactionIdUpdatePage: FeeTransactionIdUpdatePage;
  let feeTransactionIdDetailPage: FeeTransactionIdDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Fee Transaction Ids';
  const SUBCOMPONENT_TITLE = 'Fee Transaction Id';
  let lastElement: any;
  let isVisible = false;

  const id = '10';
  const transactionId = 'transactionId';

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

  it('should load FeeTransactionIds', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'FeeTransactionId')
      .first()
      .click();

    feeTransactionIdComponentsPage = new FeeTransactionIdComponentsPage();
    await browser.wait(ec.visibilityOf(feeTransactionIdComponentsPage.title), 5000);
    expect(await feeTransactionIdComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(ec.visibilityOf(feeTransactionIdComponentsPage.entities.get(0)), ec.visibilityOf(feeTransactionIdComponentsPage.noResult)),
      5000
    );
  });

  it('should create FeeTransactionId', async () => {
    initNumberOfEntities = await feeTransactionIdComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(feeTransactionIdComponentsPage.createButton), 5000);
    await feeTransactionIdComponentsPage.clickOnCreateButton();
    feeTransactionIdUpdatePage = new FeeTransactionIdUpdatePage();
    await browser.wait(ec.visibilityOf(feeTransactionIdUpdatePage.pageTitle), 3000);
    expect(await feeTransactionIdUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await feeTransactionIdUpdatePage.setTransactionIdInput(transactionId);

    await feeTransactionIdUpdatePage.save();
    await browser.wait(ec.visibilityOf(feeTransactionIdComponentsPage.title), 3000);
    expect(await feeTransactionIdComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await feeTransactionIdComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last FeeTransactionId', async () => {
    feeTransactionIdComponentsPage = new FeeTransactionIdComponentsPage();
    await browser.wait(ec.visibilityOf(feeTransactionIdComponentsPage.title), 5000);
    lastElement = await feeTransactionIdComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last FeeTransactionId', async () => {
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

  it('should view the last FeeTransactionId', async () => {
    feeTransactionIdDetailPage = new FeeTransactionIdDetailPage();
    if (isVisible && (await feeTransactionIdDetailPage.pageTitle.isDisplayed())) {
      expect(await feeTransactionIdDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await feeTransactionIdDetailPage.getIdInput()).toEqual(id);

      expect(await feeTransactionIdDetailPage.getTransactionIdInput()).toEqual(transactionId);
    }
  });

  it('should delete last FeeTransactionId', async () => {
    feeTransactionIdDetailPage = new FeeTransactionIdDetailPage();
    if (isVisible && (await feeTransactionIdDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await feeTransactionIdDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(feeTransactionIdComponentsPage.title), 3000);
      expect(await feeTransactionIdComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await feeTransactionIdComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish FeeTransactionIds tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
