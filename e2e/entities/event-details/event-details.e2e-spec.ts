import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { EventDetailsComponentsPage, EventDetailsDetailPage, EventDetailsUpdatePage } from './event-details.po';

describe('EventDetails e2e test', () => {
  let loginPage: LoginPage;
  let eventDetailsComponentsPage: EventDetailsComponentsPage;
  let eventDetailsUpdatePage: EventDetailsUpdatePage;
  let eventDetailsDetailPage: EventDetailsDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Event Details';
  const SUBCOMPONENT_TITLE = 'Event Details';
  let lastElement: any;
  let isVisible = false;

  const id = '10';
  const totalEntranceFee = '10';

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

  it('should load EventDetails', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'EventDetails')
      .first()
      .click();

    eventDetailsComponentsPage = new EventDetailsComponentsPage();
    await browser.wait(ec.visibilityOf(eventDetailsComponentsPage.title), 5000);
    expect(await eventDetailsComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(ec.visibilityOf(eventDetailsComponentsPage.entities.get(0)), ec.visibilityOf(eventDetailsComponentsPage.noResult)),
      5000
    );
  });

  it('should create EventDetails', async () => {
    initNumberOfEntities = await eventDetailsComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(eventDetailsComponentsPage.createButton), 5000);
    await eventDetailsComponentsPage.clickOnCreateButton();
    eventDetailsUpdatePage = new EventDetailsUpdatePage();
    await browser.wait(ec.visibilityOf(eventDetailsUpdatePage.pageTitle), 3000);
    expect(await eventDetailsUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await eventDetailsUpdatePage.setTotalEntranceFeeInput(totalEntranceFee);

    await eventDetailsUpdatePage.save();
    await browser.wait(ec.visibilityOf(eventDetailsComponentsPage.title), 3000);
    expect(await eventDetailsComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await eventDetailsComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last EventDetails', async () => {
    eventDetailsComponentsPage = new EventDetailsComponentsPage();
    await browser.wait(ec.visibilityOf(eventDetailsComponentsPage.title), 5000);
    lastElement = await eventDetailsComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last EventDetails', async () => {
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

  it('should view the last EventDetails', async () => {
    eventDetailsDetailPage = new EventDetailsDetailPage();
    if (isVisible && (await eventDetailsDetailPage.pageTitle.isDisplayed())) {
      expect(await eventDetailsDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await eventDetailsDetailPage.getIdInput()).toEqual(id);

      expect(await eventDetailsDetailPage.getTotalEntranceFeeInput()).toEqual(totalEntranceFee);
    }
  });

  it('should delete last EventDetails', async () => {
    eventDetailsDetailPage = new EventDetailsDetailPage();
    if (isVisible && (await eventDetailsDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await eventDetailsDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(eventDetailsComponentsPage.title), 3000);
      expect(await eventDetailsComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await eventDetailsComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish EventDetails tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
