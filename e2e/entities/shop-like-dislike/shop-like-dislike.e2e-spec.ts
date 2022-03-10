import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { ShopLikeDislikeComponentsPage, ShopLikeDislikeDetailPage, ShopLikeDislikeUpdatePage } from './shop-like-dislike.po';

describe('ShopLikeDislike e2e test', () => {
  let loginPage: LoginPage;
  let shopLikeDislikeComponentsPage: ShopLikeDislikeComponentsPage;
  let shopLikeDislikeUpdatePage: ShopLikeDislikeUpdatePage;
  let shopLikeDislikeDetailPage: ShopLikeDislikeDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Shop Like Dislikes';
  const SUBCOMPONENT_TITLE = 'Shop Like Dislike';
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

  it('should load ShopLikeDislikes', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'ShopLikeDislike')
      .first()
      .click();

    shopLikeDislikeComponentsPage = new ShopLikeDislikeComponentsPage();
    await browser.wait(ec.visibilityOf(shopLikeDislikeComponentsPage.title), 5000);
    expect(await shopLikeDislikeComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(ec.visibilityOf(shopLikeDislikeComponentsPage.entities.get(0)), ec.visibilityOf(shopLikeDislikeComponentsPage.noResult)),
      5000
    );
  });

  it('should create ShopLikeDislike', async () => {
    initNumberOfEntities = await shopLikeDislikeComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(shopLikeDislikeComponentsPage.createButton), 5000);
    await shopLikeDislikeComponentsPage.clickOnCreateButton();
    shopLikeDislikeUpdatePage = new ShopLikeDislikeUpdatePage();
    await browser.wait(ec.visibilityOf(shopLikeDislikeUpdatePage.pageTitle), 3000);
    expect(await shopLikeDislikeUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await shopLikeDislikeUpdatePage.setLikeInput(like);
    await shopLikeDislikeUpdatePage.setDislikeInput(dislike);
    await shopLikeDislikeUpdatePage.setCommentInput(comment);

    await shopLikeDislikeUpdatePage.save();
    await browser.wait(ec.visibilityOf(shopLikeDislikeComponentsPage.title), 3000);
    expect(await shopLikeDislikeComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await shopLikeDislikeComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last ShopLikeDislike', async () => {
    shopLikeDislikeComponentsPage = new ShopLikeDislikeComponentsPage();
    await browser.wait(ec.visibilityOf(shopLikeDislikeComponentsPage.title), 5000);
    lastElement = await shopLikeDislikeComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last ShopLikeDislike', async () => {
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

  it('should view the last ShopLikeDislike', async () => {
    shopLikeDislikeDetailPage = new ShopLikeDislikeDetailPage();
    if (isVisible && (await shopLikeDislikeDetailPage.pageTitle.isDisplayed())) {
      expect(await shopLikeDislikeDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await shopLikeDislikeDetailPage.getIdInput()).toEqual(id);

      expect(await shopLikeDislikeDetailPage.getLikeInput()).toEqual(like);

      expect(await shopLikeDislikeDetailPage.getDislikeInput()).toEqual(dislike);

      expect(await shopLikeDislikeDetailPage.getCommentInput()).toEqual(comment);
    }
  });

  it('should delete last ShopLikeDislike', async () => {
    shopLikeDislikeDetailPage = new ShopLikeDislikeDetailPage();
    if (isVisible && (await shopLikeDislikeDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await shopLikeDislikeDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(shopLikeDislikeComponentsPage.title), 3000);
      expect(await shopLikeDislikeComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await shopLikeDislikeComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish ShopLikeDislikes tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
