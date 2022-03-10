import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { SlotListClockComponentsPage, SlotListClockDetailPage, SlotListClockUpdatePage } from './slot-list-clock.po';

describe('SlotListClock e2e test', () => {
  let loginPage: LoginPage;
  let slotListClockComponentsPage: SlotListClockComponentsPage;
  let slotListClockUpdatePage: SlotListClockUpdatePage;
  let slotListClockDetailPage: SlotListClockDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Slot List Clocks';
  const SUBCOMPONENT_TITLE = 'Slot List Clock';
  let lastElement: any;
  let isVisible = false;

  const id = '10';
  const coupons = 'coupons';

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

  it('should load SlotListClocks', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'SlotListClock')
      .first()
      .click();

    slotListClockComponentsPage = new SlotListClockComponentsPage();
    await browser.wait(ec.visibilityOf(slotListClockComponentsPage.title), 5000);
    expect(await slotListClockComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(ec.visibilityOf(slotListClockComponentsPage.entities.get(0)), ec.visibilityOf(slotListClockComponentsPage.noResult)),
      5000
    );
  });

  it('should create SlotListClock', async () => {
    initNumberOfEntities = await slotListClockComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(slotListClockComponentsPage.createButton), 5000);
    await slotListClockComponentsPage.clickOnCreateButton();
    slotListClockUpdatePage = new SlotListClockUpdatePage();
    await browser.wait(ec.visibilityOf(slotListClockUpdatePage.pageTitle), 3000);
    expect(await slotListClockUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await slotListClockUpdatePage.setCouponsInput(coupons);

    await slotListClockUpdatePage.save();
    await browser.wait(ec.visibilityOf(slotListClockComponentsPage.title), 3000);
    expect(await slotListClockComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await slotListClockComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last SlotListClock', async () => {
    slotListClockComponentsPage = new SlotListClockComponentsPage();
    await browser.wait(ec.visibilityOf(slotListClockComponentsPage.title), 5000);
    lastElement = await slotListClockComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last SlotListClock', async () => {
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

  it('should view the last SlotListClock', async () => {
    slotListClockDetailPage = new SlotListClockDetailPage();
    if (isVisible && (await slotListClockDetailPage.pageTitle.isDisplayed())) {
      expect(await slotListClockDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await slotListClockDetailPage.getIdInput()).toEqual(id);

      expect(await slotListClockDetailPage.getCouponsInput()).toEqual(coupons);
    }
  });

  it('should delete last SlotListClock', async () => {
    slotListClockDetailPage = new SlotListClockDetailPage();
    if (isVisible && (await slotListClockDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await slotListClockDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(slotListClockComponentsPage.title), 3000);
      expect(await slotListClockComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await slotListClockComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish SlotListClocks tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
