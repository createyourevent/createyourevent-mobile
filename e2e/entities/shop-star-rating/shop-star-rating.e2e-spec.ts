import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { ShopStarRatingComponentsPage, ShopStarRatingDetailPage, ShopStarRatingUpdatePage } from './shop-star-rating.po';

describe('ShopStarRating e2e test', () => {
  let loginPage: LoginPage;
  let shopStarRatingComponentsPage: ShopStarRatingComponentsPage;
  let shopStarRatingUpdatePage: ShopStarRatingUpdatePage;
  let shopStarRatingDetailPage: ShopStarRatingDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Shop Star Ratings';
  const SUBCOMPONENT_TITLE = 'Shop Star Rating';
  let lastElement: any;
  let isVisible = false;

  const id = '10';
  const stars = '10';
  const comment = 'comment';

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

  it('should load ShopStarRatings', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'ShopStarRating')
      .first()
      .click();

    shopStarRatingComponentsPage = new ShopStarRatingComponentsPage();
    await browser.wait(ec.visibilityOf(shopStarRatingComponentsPage.title), 5000);
    expect(await shopStarRatingComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(ec.visibilityOf(shopStarRatingComponentsPage.entities.get(0)), ec.visibilityOf(shopStarRatingComponentsPage.noResult)),
      5000
    );
  });

  it('should create ShopStarRating', async () => {
    initNumberOfEntities = await shopStarRatingComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(shopStarRatingComponentsPage.createButton), 5000);
    await shopStarRatingComponentsPage.clickOnCreateButton();
    shopStarRatingUpdatePage = new ShopStarRatingUpdatePage();
    await browser.wait(ec.visibilityOf(shopStarRatingUpdatePage.pageTitle), 3000);
    expect(await shopStarRatingUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await shopStarRatingUpdatePage.setStarsInput(stars);
    await shopStarRatingUpdatePage.setCommentInput(comment);

    await shopStarRatingUpdatePage.save();
    await browser.wait(ec.visibilityOf(shopStarRatingComponentsPage.title), 3000);
    expect(await shopStarRatingComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await shopStarRatingComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last ShopStarRating', async () => {
    shopStarRatingComponentsPage = new ShopStarRatingComponentsPage();
    await browser.wait(ec.visibilityOf(shopStarRatingComponentsPage.title), 5000);
    lastElement = await shopStarRatingComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last ShopStarRating', async () => {
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

  it('should view the last ShopStarRating', async () => {
    shopStarRatingDetailPage = new ShopStarRatingDetailPage();
    if (isVisible && (await shopStarRatingDetailPage.pageTitle.isDisplayed())) {
      expect(await shopStarRatingDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await shopStarRatingDetailPage.getIdInput()).toEqual(id);

      expect(await shopStarRatingDetailPage.getStarsInput()).toEqual(stars);

      expect(await shopStarRatingDetailPage.getCommentInput()).toEqual(comment);
    }
  });

  it('should delete last ShopStarRating', async () => {
    shopStarRatingDetailPage = new ShopStarRatingDetailPage();
    if (isVisible && (await shopStarRatingDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await shopStarRatingDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(shopStarRatingComponentsPage.title), 3000);
      expect(await shopStarRatingComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await shopStarRatingComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish ShopStarRatings tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
