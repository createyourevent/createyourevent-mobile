import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { ProductLikeDislikeComponentsPage, ProductLikeDislikeDetailPage, ProductLikeDislikeUpdatePage } from './product-like-dislike.po';

describe('ProductLikeDislike e2e test', () => {
  let loginPage: LoginPage;
  let productLikeDislikeComponentsPage: ProductLikeDislikeComponentsPage;
  let productLikeDislikeUpdatePage: ProductLikeDislikeUpdatePage;
  let productLikeDislikeDetailPage: ProductLikeDislikeDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Product Like Dislikes';
  const SUBCOMPONENT_TITLE = 'Product Like Dislike';
  let lastElement: any;
  let isVisible = false;

  const id = '10';
  const like = '10';
  const dislike = '10';
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

  it('should load ProductLikeDislikes', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'ProductLikeDislike')
      .first()
      .click();

    productLikeDislikeComponentsPage = new ProductLikeDislikeComponentsPage();
    await browser.wait(ec.visibilityOf(productLikeDislikeComponentsPage.title), 5000);
    expect(await productLikeDislikeComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(ec.visibilityOf(productLikeDislikeComponentsPage.entities.get(0)), ec.visibilityOf(productLikeDislikeComponentsPage.noResult)),
      5000
    );
  });

  it('should create ProductLikeDislike', async () => {
    initNumberOfEntities = await productLikeDislikeComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(productLikeDislikeComponentsPage.createButton), 5000);
    await productLikeDislikeComponentsPage.clickOnCreateButton();
    productLikeDislikeUpdatePage = new ProductLikeDislikeUpdatePage();
    await browser.wait(ec.visibilityOf(productLikeDislikeUpdatePage.pageTitle), 3000);
    expect(await productLikeDislikeUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await productLikeDislikeUpdatePage.setLikeInput(like);
    await productLikeDislikeUpdatePage.setDislikeInput(dislike);
    await productLikeDislikeUpdatePage.setCommentInput(comment);

    await productLikeDislikeUpdatePage.save();
    await browser.wait(ec.visibilityOf(productLikeDislikeComponentsPage.title), 3000);
    expect(await productLikeDislikeComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await productLikeDislikeComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last ProductLikeDislike', async () => {
    productLikeDislikeComponentsPage = new ProductLikeDislikeComponentsPage();
    await browser.wait(ec.visibilityOf(productLikeDislikeComponentsPage.title), 5000);
    lastElement = await productLikeDislikeComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last ProductLikeDislike', async () => {
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

  it('should view the last ProductLikeDislike', async () => {
    productLikeDislikeDetailPage = new ProductLikeDislikeDetailPage();
    if (isVisible && (await productLikeDislikeDetailPage.pageTitle.isDisplayed())) {
      expect(await productLikeDislikeDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await productLikeDislikeDetailPage.getIdInput()).toEqual(id);

      expect(await productLikeDislikeDetailPage.getLikeInput()).toEqual(like);

      expect(await productLikeDislikeDetailPage.getDislikeInput()).toEqual(dislike);

      expect(await productLikeDislikeDetailPage.getCommentInput()).toEqual(comment);
    }
  });

  it('should delete last ProductLikeDislike', async () => {
    productLikeDislikeDetailPage = new ProductLikeDislikeDetailPage();
    if (isVisible && (await productLikeDislikeDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await productLikeDislikeDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(productLikeDislikeComponentsPage.title), 3000);
      expect(await productLikeDislikeComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await productLikeDislikeComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish ProductLikeDislikes tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
