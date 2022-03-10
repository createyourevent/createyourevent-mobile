import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { ProductStarRatingComponentsPage, ProductStarRatingDetailPage, ProductStarRatingUpdatePage } from './product-star-rating.po';

describe('ProductStarRating e2e test', () => {
  let loginPage: LoginPage;
  let productStarRatingComponentsPage: ProductStarRatingComponentsPage;
  let productStarRatingUpdatePage: ProductStarRatingUpdatePage;
  let productStarRatingDetailPage: ProductStarRatingDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Product Star Ratings';
  const SUBCOMPONENT_TITLE = 'Product Star Rating';
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

  it('should load ProductStarRatings', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'ProductStarRating')
      .first()
      .click();

    productStarRatingComponentsPage = new ProductStarRatingComponentsPage();
    await browser.wait(ec.visibilityOf(productStarRatingComponentsPage.title), 5000);
    expect(await productStarRatingComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(ec.visibilityOf(productStarRatingComponentsPage.entities.get(0)), ec.visibilityOf(productStarRatingComponentsPage.noResult)),
      5000
    );
  });

  it('should create ProductStarRating', async () => {
    initNumberOfEntities = await productStarRatingComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(productStarRatingComponentsPage.createButton), 5000);
    await productStarRatingComponentsPage.clickOnCreateButton();
    productStarRatingUpdatePage = new ProductStarRatingUpdatePage();
    await browser.wait(ec.visibilityOf(productStarRatingUpdatePage.pageTitle), 3000);
    expect(await productStarRatingUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await productStarRatingUpdatePage.setStarsInput(stars);
    await productStarRatingUpdatePage.setCommentInput(comment);

    await productStarRatingUpdatePage.save();
    await browser.wait(ec.visibilityOf(productStarRatingComponentsPage.title), 3000);
    expect(await productStarRatingComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await productStarRatingComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last ProductStarRating', async () => {
    productStarRatingComponentsPage = new ProductStarRatingComponentsPage();
    await browser.wait(ec.visibilityOf(productStarRatingComponentsPage.title), 5000);
    lastElement = await productStarRatingComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last ProductStarRating', async () => {
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

  it('should view the last ProductStarRating', async () => {
    productStarRatingDetailPage = new ProductStarRatingDetailPage();
    if (isVisible && (await productStarRatingDetailPage.pageTitle.isDisplayed())) {
      expect(await productStarRatingDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await productStarRatingDetailPage.getIdInput()).toEqual(id);

      expect(await productStarRatingDetailPage.getStarsInput()).toEqual(stars);

      expect(await productStarRatingDetailPage.getCommentInput()).toEqual(comment);
    }
  });

  it('should delete last ProductStarRating', async () => {
    productStarRatingDetailPage = new ProductStarRatingDetailPage();
    if (isVisible && (await productStarRatingDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await productStarRatingDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(productStarRatingComponentsPage.title), 3000);
      expect(await productStarRatingComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await productStarRatingComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish ProductStarRatings tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
