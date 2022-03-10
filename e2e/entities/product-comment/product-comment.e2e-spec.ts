import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { ProductCommentComponentsPage, ProductCommentDetailPage, ProductCommentUpdatePage } from './product-comment.po';

describe('ProductComment e2e test', () => {
  let loginPage: LoginPage;
  let productCommentComponentsPage: ProductCommentComponentsPage;
  let productCommentUpdatePage: ProductCommentUpdatePage;
  let productCommentDetailPage: ProductCommentDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Product Comments';
  const SUBCOMPONENT_TITLE = 'Product Comment';
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

  it('should load ProductComments', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'ProductComment')
      .first()
      .click();

    productCommentComponentsPage = new ProductCommentComponentsPage();
    await browser.wait(ec.visibilityOf(productCommentComponentsPage.title), 5000);
    expect(await productCommentComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(ec.visibilityOf(productCommentComponentsPage.entities.get(0)), ec.visibilityOf(productCommentComponentsPage.noResult)),
      5000
    );
  });

  it('should create ProductComment', async () => {
    initNumberOfEntities = await productCommentComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(productCommentComponentsPage.createButton), 5000);
    await productCommentComponentsPage.clickOnCreateButton();
    productCommentUpdatePage = new ProductCommentUpdatePage();
    await browser.wait(ec.visibilityOf(productCommentUpdatePage.pageTitle), 3000);
    expect(await productCommentUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await productCommentUpdatePage.setCommentInput(comment);

    await productCommentUpdatePage.save();
    await browser.wait(ec.visibilityOf(productCommentComponentsPage.title), 3000);
    expect(await productCommentComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await productCommentComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last ProductComment', async () => {
    productCommentComponentsPage = new ProductCommentComponentsPage();
    await browser.wait(ec.visibilityOf(productCommentComponentsPage.title), 5000);
    lastElement = await productCommentComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last ProductComment', async () => {
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

  it('should view the last ProductComment', async () => {
    productCommentDetailPage = new ProductCommentDetailPage();
    if (isVisible && (await productCommentDetailPage.pageTitle.isDisplayed())) {
      expect(await productCommentDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await productCommentDetailPage.getIdInput()).toEqual(id);

      expect(await productCommentDetailPage.getCommentInput()).toEqual(comment);
    }
  });

  it('should delete last ProductComment', async () => {
    productCommentDetailPage = new ProductCommentDetailPage();
    if (isVisible && (await productCommentDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await productCommentDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(productCommentComponentsPage.title), 3000);
      expect(await productCommentComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await productCommentComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish ProductComments tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
