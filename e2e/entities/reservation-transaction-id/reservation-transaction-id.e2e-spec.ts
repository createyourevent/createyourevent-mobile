import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import {
  ReservationTransactionIdComponentsPage,
  ReservationTransactionIdDetailPage,
  ReservationTransactionIdUpdatePage,
} from './reservation-transaction-id.po';

describe('ReservationTransactionId e2e test', () => {
  let loginPage: LoginPage;
  let reservationTransactionIdComponentsPage: ReservationTransactionIdComponentsPage;
  let reservationTransactionIdUpdatePage: ReservationTransactionIdUpdatePage;
  let reservationTransactionIdDetailPage: ReservationTransactionIdDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Reservation Transaction Ids';
  const SUBCOMPONENT_TITLE = 'Reservation Transaction Id';
  let lastElement: any;
  let isVisible = false;

  const id = '10';
  const transactionDepositId = 'transactionDepositId';
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

  it('should load ReservationTransactionIds', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'ReservationTransactionId')
      .first()
      .click();

    reservationTransactionIdComponentsPage = new ReservationTransactionIdComponentsPage();
    await browser.wait(ec.visibilityOf(reservationTransactionIdComponentsPage.title), 5000);
    expect(await reservationTransactionIdComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(
        ec.visibilityOf(reservationTransactionIdComponentsPage.entities.get(0)),
        ec.visibilityOf(reservationTransactionIdComponentsPage.noResult)
      ),
      5000
    );
  });

  it('should create ReservationTransactionId', async () => {
    initNumberOfEntities = await reservationTransactionIdComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(reservationTransactionIdComponentsPage.createButton), 5000);
    await reservationTransactionIdComponentsPage.clickOnCreateButton();
    reservationTransactionIdUpdatePage = new ReservationTransactionIdUpdatePage();
    await browser.wait(ec.visibilityOf(reservationTransactionIdUpdatePage.pageTitle), 3000);
    expect(await reservationTransactionIdUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await reservationTransactionIdUpdatePage.setTransactionDepositIdInput(transactionDepositId);
    await reservationTransactionIdUpdatePage.setTransactionIdInput(transactionId);

    await reservationTransactionIdUpdatePage.save();
    await browser.wait(ec.visibilityOf(reservationTransactionIdComponentsPage.title), 3000);
    expect(await reservationTransactionIdComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await reservationTransactionIdComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last ReservationTransactionId', async () => {
    reservationTransactionIdComponentsPage = new ReservationTransactionIdComponentsPage();
    await browser.wait(ec.visibilityOf(reservationTransactionIdComponentsPage.title), 5000);
    lastElement = await reservationTransactionIdComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last ReservationTransactionId', async () => {
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

  it('should view the last ReservationTransactionId', async () => {
    reservationTransactionIdDetailPage = new ReservationTransactionIdDetailPage();
    if (isVisible && (await reservationTransactionIdDetailPage.pageTitle.isDisplayed())) {
      expect(await reservationTransactionIdDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await reservationTransactionIdDetailPage.getIdInput()).toEqual(id);

      expect(await reservationTransactionIdDetailPage.getTransactionDepositIdInput()).toEqual(transactionDepositId);

      expect(await reservationTransactionIdDetailPage.getTransactionIdInput()).toEqual(transactionId);
    }
  });

  it('should delete last ReservationTransactionId', async () => {
    reservationTransactionIdDetailPage = new ReservationTransactionIdDetailPage();
    if (isVisible && (await reservationTransactionIdDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await reservationTransactionIdDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(reservationTransactionIdComponentsPage.title), 3000);
      expect(await reservationTransactionIdComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await reservationTransactionIdComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish ReservationTransactionIds tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
