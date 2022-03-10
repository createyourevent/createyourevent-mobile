import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { GiftComponentsPage, GiftDetailPage, GiftUpdatePage } from './gift.po';

describe('Gift e2e test', () => {
  let loginPage: LoginPage;
  let giftComponentsPage: GiftComponentsPage;
  let giftUpdatePage: GiftUpdatePage;
  let giftDetailPage: GiftDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Gifts';
  const SUBCOMPONENT_TITLE = 'Gift';
  let lastElement: any;
  let isVisible = false;

  const id = '10';
  const title = 'title';
  const description = 'description';
  const points = '10';
  const stock = '10';

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

  it('should load Gifts', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'Gift')
      .first()
      .click();

    giftComponentsPage = new GiftComponentsPage();
    await browser.wait(ec.visibilityOf(giftComponentsPage.title), 5000);
    expect(await giftComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(ec.or(ec.visibilityOf(giftComponentsPage.entities.get(0)), ec.visibilityOf(giftComponentsPage.noResult)), 5000);
  });

  it('should create Gift', async () => {
    initNumberOfEntities = await giftComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(giftComponentsPage.createButton), 5000);
    await giftComponentsPage.clickOnCreateButton();
    giftUpdatePage = new GiftUpdatePage();
    await browser.wait(ec.visibilityOf(giftUpdatePage.pageTitle), 3000);
    expect(await giftUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await giftUpdatePage.setTitleInput(title);
    await giftUpdatePage.setDescriptionInput(description);
    await giftUpdatePage.setPhotoInput(photo);
    await giftUpdatePage.setPointsInput(points);
    await giftUpdatePage.setStockInput(stock);

    await giftUpdatePage.save();
    await browser.wait(ec.visibilityOf(giftComponentsPage.title), 3000);
    expect(await giftComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await giftComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last Gift', async () => {
    giftComponentsPage = new GiftComponentsPage();
    await browser.wait(ec.visibilityOf(giftComponentsPage.title), 5000);
    lastElement = await giftComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last Gift', async () => {
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

  it('should view the last Gift', async () => {
    giftDetailPage = new GiftDetailPage();
    if (isVisible && (await giftDetailPage.pageTitle.isDisplayed())) {
      expect(await giftDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await giftDetailPage.getIdInput()).toEqual(id);

      expect(await giftDetailPage.getTitleInput()).toEqual(title);

      expect(await giftDetailPage.getDescriptionInput()).toEqual(description);

      expect(await giftDetailPage.getPhotoInput()).toEqual(photo);

      expect(await giftDetailPage.getPointsInput()).toEqual(points);

      expect(await giftDetailPage.getStockInput()).toEqual(stock);
    }
  });

  it('should delete last Gift', async () => {
    giftDetailPage = new GiftDetailPage();
    if (isVisible && (await giftDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await giftDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(giftComponentsPage.title), 3000);
      expect(await giftComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await giftComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish Gifts tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
