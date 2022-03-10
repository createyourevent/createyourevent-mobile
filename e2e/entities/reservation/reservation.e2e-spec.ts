import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { ReservationComponentsPage, ReservationDetailPage, ReservationUpdatePage } from './reservation.po';

describe('Reservation e2e test', () => {
  let loginPage: LoginPage;
  let reservationComponentsPage: ReservationComponentsPage;
  let reservationUpdatePage: ReservationUpdatePage;
  let reservationDetailPage: ReservationDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Reservations';
  const SUBCOMPONENT_TITLE = 'Reservation';
  let lastElement: any;
  let isVisible = false;

  const id = '10';
  const tdTxId = 'tdTxId';

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

  it('should load Reservations', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'Reservation')
      .first()
      .click();

    reservationComponentsPage = new ReservationComponentsPage();
    await browser.wait(ec.visibilityOf(reservationComponentsPage.title), 5000);
    expect(await reservationComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(ec.visibilityOf(reservationComponentsPage.entities.get(0)), ec.visibilityOf(reservationComponentsPage.noResult)),
      5000
    );
  });

  it('should create Reservation', async () => {
    initNumberOfEntities = await reservationComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(reservationComponentsPage.createButton), 5000);
    await reservationComponentsPage.clickOnCreateButton();
    reservationUpdatePage = new ReservationUpdatePage();
    await browser.wait(ec.visibilityOf(reservationUpdatePage.pageTitle), 3000);
    expect(await reservationUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await reservationUpdatePage.setTdTxIdInput(tdTxId);

    await reservationUpdatePage.save();
    await browser.wait(ec.visibilityOf(reservationComponentsPage.title), 3000);
    expect(await reservationComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await reservationComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last Reservation', async () => {
    reservationComponentsPage = new ReservationComponentsPage();
    await browser.wait(ec.visibilityOf(reservationComponentsPage.title), 5000);
    lastElement = await reservationComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last Reservation', async () => {
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

  it('should view the last Reservation', async () => {
    reservationDetailPage = new ReservationDetailPage();
    if (isVisible && (await reservationDetailPage.pageTitle.isDisplayed())) {
      expect(await reservationDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await reservationDetailPage.getIdInput()).toEqual(id);

      expect(await reservationDetailPage.getTdTxIdInput()).toEqual(tdTxId);
    }
  });

  it('should delete last Reservation', async () => {
    reservationDetailPage = new ReservationDetailPage();
    if (isVisible && (await reservationDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await reservationDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(reservationComponentsPage.title), 3000);
      expect(await reservationComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await reservationComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish Reservations tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
