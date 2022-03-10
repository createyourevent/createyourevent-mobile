import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { ShopCommentComponentsPage, ShopCommentDetailPage, ShopCommentUpdatePage } from './shop-comment.po';

describe('ShopComment e2e test', () => {
  let loginPage: LoginPage;
  let shopCommentComponentsPage: ShopCommentComponentsPage;
  let shopCommentUpdatePage: ShopCommentUpdatePage;
  let shopCommentDetailPage: ShopCommentDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Shop Comments';
  const SUBCOMPONENT_TITLE = 'Shop Comment';
  let lastElement: any;
  let isVisible = false;

  const id = '10';
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

  it('should load ShopComments', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'ShopComment')
      .first()
      .click();

    shopCommentComponentsPage = new ShopCommentComponentsPage();
    await browser.wait(ec.visibilityOf(shopCommentComponentsPage.title), 5000);
    expect(await shopCommentComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(ec.visibilityOf(shopCommentComponentsPage.entities.get(0)), ec.visibilityOf(shopCommentComponentsPage.noResult)),
      5000
    );
  });

  it('should create ShopComment', async () => {
    initNumberOfEntities = await shopCommentComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(shopCommentComponentsPage.createButton), 5000);
    await shopCommentComponentsPage.clickOnCreateButton();
    shopCommentUpdatePage = new ShopCommentUpdatePage();
    await browser.wait(ec.visibilityOf(shopCommentUpdatePage.pageTitle), 3000);
    expect(await shopCommentUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await shopCommentUpdatePage.setCommentInput(comment);

    await shopCommentUpdatePage.save();
    await browser.wait(ec.visibilityOf(shopCommentComponentsPage.title), 3000);
    expect(await shopCommentComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await shopCommentComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last ShopComment', async () => {
    shopCommentComponentsPage = new ShopCommentComponentsPage();
    await browser.wait(ec.visibilityOf(shopCommentComponentsPage.title), 5000);
    lastElement = await shopCommentComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last ShopComment', async () => {
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

  it('should view the last ShopComment', async () => {
    shopCommentDetailPage = new ShopCommentDetailPage();
    if (isVisible && (await shopCommentDetailPage.pageTitle.isDisplayed())) {
      expect(await shopCommentDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await shopCommentDetailPage.getIdInput()).toEqual(id);

      expect(await shopCommentDetailPage.getCommentInput()).toEqual(comment);
    }
  });

  it('should delete last ShopComment', async () => {
    shopCommentDetailPage = new ShopCommentDetailPage();
    if (isVisible && (await shopCommentDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await shopCommentDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(shopCommentComponentsPage.title), 3000);
      expect(await shopCommentComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await shopCommentComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish ShopComments tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
