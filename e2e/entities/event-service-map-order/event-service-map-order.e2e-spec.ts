import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import {
  EventServiceMapOrderComponentsPage,
  EventServiceMapOrderDetailPage,
  EventServiceMapOrderUpdatePage,
} from './event-service-map-order.po';

describe('EventServiceMapOrder e2e test', () => {
  let loginPage: LoginPage;
  let eventServiceMapOrderComponentsPage: EventServiceMapOrderComponentsPage;
  let eventServiceMapOrderUpdatePage: EventServiceMapOrderUpdatePage;
  let eventServiceMapOrderDetailPage: EventServiceMapOrderDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Event Service Map Orders';
  const SUBCOMPONENT_TITLE = 'Event Service Map Order';
  let lastElement: any;
  let isVisible = false;

  const id = '10';
  const costHour = '10';
  const rideCosts = '10';
  const total = '10';
  const totalHours = 'totalHours';
  const kilometre = '10';

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

  it('should load EventServiceMapOrders', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'EventServiceMapOrder')
      .first()
      .click();

    eventServiceMapOrderComponentsPage = new EventServiceMapOrderComponentsPage();
    await browser.wait(ec.visibilityOf(eventServiceMapOrderComponentsPage.title), 5000);
    expect(await eventServiceMapOrderComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(
        ec.visibilityOf(eventServiceMapOrderComponentsPage.entities.get(0)),
        ec.visibilityOf(eventServiceMapOrderComponentsPage.noResult)
      ),
      5000
    );
  });

  it('should create EventServiceMapOrder', async () => {
    initNumberOfEntities = await eventServiceMapOrderComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(eventServiceMapOrderComponentsPage.createButton), 5000);
    await eventServiceMapOrderComponentsPage.clickOnCreateButton();
    eventServiceMapOrderUpdatePage = new EventServiceMapOrderUpdatePage();
    await browser.wait(ec.visibilityOf(eventServiceMapOrderUpdatePage.pageTitle), 3000);
    expect(await eventServiceMapOrderUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await eventServiceMapOrderUpdatePage.setCostHourInput(costHour);
    await eventServiceMapOrderUpdatePage.setRideCostsInput(rideCosts);
    await eventServiceMapOrderUpdatePage.setTotalInput(total);
    await eventServiceMapOrderUpdatePage.setTotalHoursInput(totalHours);
    await eventServiceMapOrderUpdatePage.setKilometreInput(kilometre);

    await eventServiceMapOrderUpdatePage.save();
    await browser.wait(ec.visibilityOf(eventServiceMapOrderComponentsPage.title), 3000);
    expect(await eventServiceMapOrderComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await eventServiceMapOrderComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last EventServiceMapOrder', async () => {
    eventServiceMapOrderComponentsPage = new EventServiceMapOrderComponentsPage();
    await browser.wait(ec.visibilityOf(eventServiceMapOrderComponentsPage.title), 5000);
    lastElement = await eventServiceMapOrderComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last EventServiceMapOrder', async () => {
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

  it('should view the last EventServiceMapOrder', async () => {
    eventServiceMapOrderDetailPage = new EventServiceMapOrderDetailPage();
    if (isVisible && (await eventServiceMapOrderDetailPage.pageTitle.isDisplayed())) {
      expect(await eventServiceMapOrderDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await eventServiceMapOrderDetailPage.getIdInput()).toEqual(id);

      expect(await eventServiceMapOrderDetailPage.getCostHourInput()).toEqual(costHour);

      expect(await eventServiceMapOrderDetailPage.getRideCostsInput()).toEqual(rideCosts);

      expect(await eventServiceMapOrderDetailPage.getTotalInput()).toEqual(total);

      expect(await eventServiceMapOrderDetailPage.getTotalHoursInput()).toEqual(totalHours);

      expect(await eventServiceMapOrderDetailPage.getKilometreInput()).toEqual(kilometre);
    }
  });

  it('should delete last EventServiceMapOrder', async () => {
    eventServiceMapOrderDetailPage = new EventServiceMapOrderDetailPage();
    if (isVisible && (await eventServiceMapOrderDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await eventServiceMapOrderDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(eventServiceMapOrderComponentsPage.title), 3000);
      expect(await eventServiceMapOrderComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await eventServiceMapOrderComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish EventServiceMapOrders tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
