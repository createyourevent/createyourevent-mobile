import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { OrderComponentsPage, OrderDetailPage, OrderUpdatePage } from './order.po';

describe('Order e2e test', () => {
  let loginPage: LoginPage;
  let orderComponentsPage: OrderComponentsPage;
  let orderUpdatePage: OrderUpdatePage;
  let orderDetailPage: OrderDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Orders';
  const SUBCOMPONENT_TITLE = 'Order';
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

  it('should load Orders', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'Order')
      .first()
      .click();

    orderComponentsPage = new OrderComponentsPage();
    await browser.wait(ec.visibilityOf(orderComponentsPage.title), 5000);
    expect(await orderComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(ec.or(ec.visibilityOf(orderComponentsPage.entities.get(0)), ec.visibilityOf(orderComponentsPage.noResult)), 5000);
  });

  it('should create Order', async () => {
    initNumberOfEntities = await orderComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(orderComponentsPage.createButton), 5000);
    await orderComponentsPage.clickOnCreateButton();
    orderUpdatePage = new OrderUpdatePage();
    await browser.wait(ec.visibilityOf(orderUpdatePage.pageTitle), 3000);
    expect(await orderUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await orderUpdatePage.statusSelectLastOption();

    await orderUpdatePage.save();
    await browser.wait(ec.visibilityOf(orderComponentsPage.title), 3000);
    expect(await orderComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await orderComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last Order', async () => {
    orderComponentsPage = new OrderComponentsPage();
    await browser.wait(ec.visibilityOf(orderComponentsPage.title), 5000);
    lastElement = await orderComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last Order', async () => {
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

  it('should view the last Order', async () => {
    orderDetailPage = new OrderDetailPage();
    if (isVisible && (await orderDetailPage.pageTitle.isDisplayed())) {
      expect(await orderDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await orderDetailPage.getIdInput()).toEqual(id);
    }
  });

  it('should delete last Order', async () => {
    orderDetailPage = new OrderDetailPage();
    if (isVisible && (await orderDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await orderDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(orderComponentsPage.title), 3000);
      expect(await orderComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await orderComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish Orders tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
