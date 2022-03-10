import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import {
  OrganizationReservationComponentsPage,
  OrganizationReservationDetailPage,
  OrganizationReservationUpdatePage,
} from './organization-reservation.po';

describe('OrganizationReservation e2e test', () => {
  let loginPage: LoginPage;
  let organizationReservationComponentsPage: OrganizationReservationComponentsPage;
  let organizationReservationUpdatePage: OrganizationReservationUpdatePage;
  let organizationReservationDetailPage: OrganizationReservationDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Organization Reservations';
  const SUBCOMPONENT_TITLE = 'Organization Reservation';
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

  it('should load OrganizationReservations', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'OrganizationReservation')
      .first()
      .click();

    organizationReservationComponentsPage = new OrganizationReservationComponentsPage();
    await browser.wait(ec.visibilityOf(organizationReservationComponentsPage.title), 5000);
    expect(await organizationReservationComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(
        ec.visibilityOf(organizationReservationComponentsPage.entities.get(0)),
        ec.visibilityOf(organizationReservationComponentsPage.noResult)
      ),
      5000
    );
  });

  it('should create OrganizationReservation', async () => {
    initNumberOfEntities = await organizationReservationComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(organizationReservationComponentsPage.createButton), 5000);
    await organizationReservationComponentsPage.clickOnCreateButton();
    organizationReservationUpdatePage = new OrganizationReservationUpdatePage();
    await browser.wait(ec.visibilityOf(organizationReservationUpdatePage.pageTitle), 3000);
    expect(await organizationReservationUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await organizationReservationUpdatePage.setTotalInput(total);

    await organizationReservationUpdatePage.save();
    await browser.wait(ec.visibilityOf(organizationReservationComponentsPage.title), 3000);
    expect(await organizationReservationComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await organizationReservationComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last OrganizationReservation', async () => {
    organizationReservationComponentsPage = new OrganizationReservationComponentsPage();
    await browser.wait(ec.visibilityOf(organizationReservationComponentsPage.title), 5000);
    lastElement = await organizationReservationComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last OrganizationReservation', async () => {
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

  it('should view the last OrganizationReservation', async () => {
    organizationReservationDetailPage = new OrganizationReservationDetailPage();
    if (isVisible && (await organizationReservationDetailPage.pageTitle.isDisplayed())) {
      expect(await organizationReservationDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await organizationReservationDetailPage.getIdInput()).toEqual(id);

      expect(await organizationReservationDetailPage.getTotalInput()).toEqual(total);
    }
  });

  it('should delete last OrganizationReservation', async () => {
    organizationReservationDetailPage = new OrganizationReservationDetailPage();
    if (isVisible && (await organizationReservationDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await organizationReservationDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(organizationReservationComponentsPage.title), 3000);
      expect(await organizationReservationComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await organizationReservationComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish OrganizationReservations tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
