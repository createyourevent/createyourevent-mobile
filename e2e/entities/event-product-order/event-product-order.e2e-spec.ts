import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { EventProductOrderComponentsPage, EventProductOrderDetailPage, EventProductOrderUpdatePage } from './event-product-order.po';

describe('EventProductOrder e2e test', () => {
  let loginPage: LoginPage;
  let eventProductOrderComponentsPage: EventProductOrderComponentsPage;
  let eventProductOrderUpdatePage: EventProductOrderUpdatePage;
  let eventProductOrderDetailPage: EventProductOrderDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Event Product Orders';
  const SUBCOMPONENT_TITLE = 'Event Product Order';
  let lastElement: any;
  let isVisible = false;

  const id = '10';
  const amount = '10';
  const total = '10';
  const rentalPeriod = '10';
  const sellingPrice = '10';

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

  it('should load EventProductOrders', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'EventProductOrder')
      .first()
      .click();

    eventProductOrderComponentsPage = new EventProductOrderComponentsPage();
    await browser.wait(ec.visibilityOf(eventProductOrderComponentsPage.title), 5000);
    expect(await eventProductOrderComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(ec.visibilityOf(eventProductOrderComponentsPage.entities.get(0)), ec.visibilityOf(eventProductOrderComponentsPage.noResult)),
      5000
    );
  });

  it('should create EventProductOrder', async () => {
    initNumberOfEntities = await eventProductOrderComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(eventProductOrderComponentsPage.createButton), 5000);
    await eventProductOrderComponentsPage.clickOnCreateButton();
    eventProductOrderUpdatePage = new EventProductOrderUpdatePage();
    await browser.wait(ec.visibilityOf(eventProductOrderUpdatePage.pageTitle), 3000);
    expect(await eventProductOrderUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await eventProductOrderUpdatePage.setAmountInput(amount);
    await eventProductOrderUpdatePage.setTotalInput(total);
    await eventProductOrderUpdatePage.setRentalPeriodInput(rentalPeriod);
    await eventProductOrderUpdatePage.statusSelectLastOption();
    await eventProductOrderUpdatePage.setSellingPriceInput(sellingPrice);

    await eventProductOrderUpdatePage.save();
    await browser.wait(ec.visibilityOf(eventProductOrderComponentsPage.title), 3000);
    expect(await eventProductOrderComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await eventProductOrderComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last EventProductOrder', async () => {
    eventProductOrderComponentsPage = new EventProductOrderComponentsPage();
    await browser.wait(ec.visibilityOf(eventProductOrderComponentsPage.title), 5000);
    lastElement = await eventProductOrderComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last EventProductOrder', async () => {
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

  it('should view the last EventProductOrder', async () => {
    eventProductOrderDetailPage = new EventProductOrderDetailPage();
    if (isVisible && (await eventProductOrderDetailPage.pageTitle.isDisplayed())) {
      expect(await eventProductOrderDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await eventProductOrderDetailPage.getIdInput()).toEqual(id);

      expect(await eventProductOrderDetailPage.getAmountInput()).toEqual(amount);

      expect(await eventProductOrderDetailPage.getTotalInput()).toEqual(total);

      expect(await eventProductOrderDetailPage.getRentalPeriodInput()).toEqual(rentalPeriod);

      expect(await eventProductOrderDetailPage.getSellingPriceInput()).toEqual(sellingPrice);
    }
  });

  it('should delete last EventProductOrder', async () => {
    eventProductOrderDetailPage = new EventProductOrderDetailPage();
    if (isVisible && (await eventProductOrderDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await eventProductOrderDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(eventProductOrderComponentsPage.title), 3000);
      expect(await eventProductOrderComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await eventProductOrderComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish EventProductOrders tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
