import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { CouponComponentsPage, CouponDetailPage, CouponUpdatePage } from './coupon.po';

describe('Coupon e2e test', () => {
  let loginPage: LoginPage;
  let couponComponentsPage: CouponComponentsPage;
  let couponUpdatePage: CouponUpdatePage;
  let couponDetailPage: CouponDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Coupons';
  const SUBCOMPONENT_TITLE = 'Coupon';
  let lastElement: any;
  let isVisible = false;

  const id = '10';
  const title = 'title';
  const value = '10';
  const description = 'description';
  const couponNr = 'couponNr';

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

  it('should load Coupons', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'Coupon')
      .first()
      .click();

    couponComponentsPage = new CouponComponentsPage();
    await browser.wait(ec.visibilityOf(couponComponentsPage.title), 5000);
    expect(await couponComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(ec.or(ec.visibilityOf(couponComponentsPage.entities.get(0)), ec.visibilityOf(couponComponentsPage.noResult)), 5000);
  });

  it('should create Coupon', async () => {
    initNumberOfEntities = await couponComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(couponComponentsPage.createButton), 5000);
    await couponComponentsPage.clickOnCreateButton();
    couponUpdatePage = new CouponUpdatePage();
    await browser.wait(ec.visibilityOf(couponUpdatePage.pageTitle), 3000);
    expect(await couponUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await couponUpdatePage.setTitleInput(title);
    await couponUpdatePage.setValueInput(value);
    await couponUpdatePage.setDescriptionInput(description);
    await couponUpdatePage.setCouponNrInput(couponNr);

    await couponUpdatePage.save();
    await browser.wait(ec.visibilityOf(couponComponentsPage.title), 3000);
    expect(await couponComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await couponComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last Coupon', async () => {
    couponComponentsPage = new CouponComponentsPage();
    await browser.wait(ec.visibilityOf(couponComponentsPage.title), 5000);
    lastElement = await couponComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last Coupon', async () => {
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

  it('should view the last Coupon', async () => {
    couponDetailPage = new CouponDetailPage();
    if (isVisible && (await couponDetailPage.pageTitle.isDisplayed())) {
      expect(await couponDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await couponDetailPage.getIdInput()).toEqual(id);

      expect(await couponDetailPage.getTitleInput()).toEqual(title);

      expect(await couponDetailPage.getValueInput()).toEqual(value);

      expect(await couponDetailPage.getDescriptionInput()).toEqual(description);

      expect(await couponDetailPage.getCouponNrInput()).toEqual(couponNr);
    }
  });

  it('should delete last Coupon', async () => {
    couponDetailPage = new CouponDetailPage();
    if (isVisible && (await couponDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await couponDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(couponComponentsPage.title), 3000);
      expect(await couponComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await couponComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish Coupons tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
