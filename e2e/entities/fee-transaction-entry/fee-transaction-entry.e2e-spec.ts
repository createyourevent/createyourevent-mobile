import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import {
  FeeTransactionEntryComponentsPage,
  FeeTransactionEntryDetailPage,
  FeeTransactionEntryUpdatePage,
} from './fee-transaction-entry.po';

describe('FeeTransactionEntry e2e test', () => {
  let loginPage: LoginPage;
  let feeTransactionEntryComponentsPage: FeeTransactionEntryComponentsPage;
  let feeTransactionEntryUpdatePage: FeeTransactionEntryUpdatePage;
  let feeTransactionEntryDetailPage: FeeTransactionEntryDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Fee Transaction Entries';
  const SUBCOMPONENT_TITLE = 'Fee Transaction Entry';
  let lastElement: any;
  let isVisible = false;

  const id = '10';
  const value = '10';

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

  it('should load FeeTransactionEntries', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'FeeTransactionEntry')
      .first()
      .click();

    feeTransactionEntryComponentsPage = new FeeTransactionEntryComponentsPage();
    await browser.wait(ec.visibilityOf(feeTransactionEntryComponentsPage.title), 5000);
    expect(await feeTransactionEntryComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(
        ec.visibilityOf(feeTransactionEntryComponentsPage.entities.get(0)),
        ec.visibilityOf(feeTransactionEntryComponentsPage.noResult)
      ),
      5000
    );
  });

  it('should create FeeTransactionEntry', async () => {
    initNumberOfEntities = await feeTransactionEntryComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(feeTransactionEntryComponentsPage.createButton), 5000);
    await feeTransactionEntryComponentsPage.clickOnCreateButton();
    feeTransactionEntryUpdatePage = new FeeTransactionEntryUpdatePage();
    await browser.wait(ec.visibilityOf(feeTransactionEntryUpdatePage.pageTitle), 3000);
    expect(await feeTransactionEntryUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await feeTransactionEntryUpdatePage.typeSelectLastOption();
    await feeTransactionEntryUpdatePage.setValueInput(value);

    await feeTransactionEntryUpdatePage.save();
    await browser.wait(ec.visibilityOf(feeTransactionEntryComponentsPage.title), 3000);
    expect(await feeTransactionEntryComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await feeTransactionEntryComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last FeeTransactionEntry', async () => {
    feeTransactionEntryComponentsPage = new FeeTransactionEntryComponentsPage();
    await browser.wait(ec.visibilityOf(feeTransactionEntryComponentsPage.title), 5000);
    lastElement = await feeTransactionEntryComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last FeeTransactionEntry', async () => {
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

  it('should view the last FeeTransactionEntry', async () => {
    feeTransactionEntryDetailPage = new FeeTransactionEntryDetailPage();
    if (isVisible && (await feeTransactionEntryDetailPage.pageTitle.isDisplayed())) {
      expect(await feeTransactionEntryDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await feeTransactionEntryDetailPage.getIdInput()).toEqual(id);

      expect(await feeTransactionEntryDetailPage.getValueInput()).toEqual(value);
    }
  });

  it('should delete last FeeTransactionEntry', async () => {
    feeTransactionEntryDetailPage = new FeeTransactionEntryDetailPage();
    if (isVisible && (await feeTransactionEntryDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await feeTransactionEntryDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(feeTransactionEntryComponentsPage.title), 3000);
      expect(await feeTransactionEntryComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await feeTransactionEntryComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish FeeTransactionEntries tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
