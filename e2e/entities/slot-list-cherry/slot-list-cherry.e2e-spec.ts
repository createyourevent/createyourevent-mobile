import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { SlotListCherryComponentsPage, SlotListCherryDetailPage, SlotListCherryUpdatePage } from './slot-list-cherry.po';

describe('SlotListCherry e2e test', () => {
  let loginPage: LoginPage;
  let slotListCherryComponentsPage: SlotListCherryComponentsPage;
  let slotListCherryUpdatePage: SlotListCherryUpdatePage;
  let slotListCherryDetailPage: SlotListCherryDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Slot List Cherries';
  const SUBCOMPONENT_TITLE = 'Slot List Cherry';
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

  it('should load SlotListCherries', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'SlotListCherry')
      .first()
      .click();

    slotListCherryComponentsPage = new SlotListCherryComponentsPage();
    await browser.wait(ec.visibilityOf(slotListCherryComponentsPage.title), 5000);
    expect(await slotListCherryComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(ec.visibilityOf(slotListCherryComponentsPage.entities.get(0)), ec.visibilityOf(slotListCherryComponentsPage.noResult)),
      5000
    );
  });

  it('should create SlotListCherry', async () => {
    initNumberOfEntities = await slotListCherryComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(slotListCherryComponentsPage.createButton), 5000);
    await slotListCherryComponentsPage.clickOnCreateButton();
    slotListCherryUpdatePage = new SlotListCherryUpdatePage();
    await browser.wait(ec.visibilityOf(slotListCherryUpdatePage.pageTitle), 3000);
    expect(await slotListCherryUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await slotListCherryUpdatePage.setCouponsInput(coupons);

    await slotListCherryUpdatePage.save();
    await browser.wait(ec.visibilityOf(slotListCherryComponentsPage.title), 3000);
    expect(await slotListCherryComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await slotListCherryComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last SlotListCherry', async () => {
    slotListCherryComponentsPage = new SlotListCherryComponentsPage();
    await browser.wait(ec.visibilityOf(slotListCherryComponentsPage.title), 5000);
    lastElement = await slotListCherryComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last SlotListCherry', async () => {
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

  it('should view the last SlotListCherry', async () => {
    slotListCherryDetailPage = new SlotListCherryDetailPage();
    if (isVisible && (await slotListCherryDetailPage.pageTitle.isDisplayed())) {
      expect(await slotListCherryDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await slotListCherryDetailPage.getIdInput()).toEqual(id);

      expect(await slotListCherryDetailPage.getCouponsInput()).toEqual(coupons);
    }
  });

  it('should delete last SlotListCherry', async () => {
    slotListCherryDetailPage = new SlotListCherryDetailPage();
    if (isVisible && (await slotListCherryDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await slotListCherryDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(slotListCherryComponentsPage.title), 3000);
      expect(await slotListCherryComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await slotListCherryComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish SlotListCherries tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
