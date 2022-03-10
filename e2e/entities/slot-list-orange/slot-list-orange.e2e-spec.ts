import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { SlotListOrangeComponentsPage, SlotListOrangeDetailPage, SlotListOrangeUpdatePage } from './slot-list-orange.po';

describe('SlotListOrange e2e test', () => {
  let loginPage: LoginPage;
  let slotListOrangeComponentsPage: SlotListOrangeComponentsPage;
  let slotListOrangeUpdatePage: SlotListOrangeUpdatePage;
  let slotListOrangeDetailPage: SlotListOrangeDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Slot List Oranges';
  const SUBCOMPONENT_TITLE = 'Slot List Orange';
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

  it('should load SlotListOranges', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'SlotListOrange')
      .first()
      .click();

    slotListOrangeComponentsPage = new SlotListOrangeComponentsPage();
    await browser.wait(ec.visibilityOf(slotListOrangeComponentsPage.title), 5000);
    expect(await slotListOrangeComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(ec.visibilityOf(slotListOrangeComponentsPage.entities.get(0)), ec.visibilityOf(slotListOrangeComponentsPage.noResult)),
      5000
    );
  });

  it('should create SlotListOrange', async () => {
    initNumberOfEntities = await slotListOrangeComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(slotListOrangeComponentsPage.createButton), 5000);
    await slotListOrangeComponentsPage.clickOnCreateButton();
    slotListOrangeUpdatePage = new SlotListOrangeUpdatePage();
    await browser.wait(ec.visibilityOf(slotListOrangeUpdatePage.pageTitle), 3000);
    expect(await slotListOrangeUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await slotListOrangeUpdatePage.setCouponsInput(coupons);

    await slotListOrangeUpdatePage.save();
    await browser.wait(ec.visibilityOf(slotListOrangeComponentsPage.title), 3000);
    expect(await slotListOrangeComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await slotListOrangeComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last SlotListOrange', async () => {
    slotListOrangeComponentsPage = new SlotListOrangeComponentsPage();
    await browser.wait(ec.visibilityOf(slotListOrangeComponentsPage.title), 5000);
    lastElement = await slotListOrangeComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last SlotListOrange', async () => {
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

  it('should view the last SlotListOrange', async () => {
    slotListOrangeDetailPage = new SlotListOrangeDetailPage();
    if (isVisible && (await slotListOrangeDetailPage.pageTitle.isDisplayed())) {
      expect(await slotListOrangeDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await slotListOrangeDetailPage.getIdInput()).toEqual(id);

      expect(await slotListOrangeDetailPage.getCouponsInput()).toEqual(coupons);
    }
  });

  it('should delete last SlotListOrange', async () => {
    slotListOrangeDetailPage = new SlotListOrangeDetailPage();
    if (isVisible && (await slotListOrangeDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await slotListOrangeDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(slotListOrangeComponentsPage.title), 3000);
      expect(await slotListOrangeComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await slotListOrangeComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish SlotListOranges tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
