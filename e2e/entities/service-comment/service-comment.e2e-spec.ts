import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { ServiceCommentComponentsPage, ServiceCommentDetailPage, ServiceCommentUpdatePage } from './service-comment.po';

describe('ServiceComment e2e test', () => {
  let loginPage: LoginPage;
  let serviceCommentComponentsPage: ServiceCommentComponentsPage;
  let serviceCommentUpdatePage: ServiceCommentUpdatePage;
  let serviceCommentDetailPage: ServiceCommentDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Service Comments';
  const SUBCOMPONENT_TITLE = 'Service Comment';
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

  it('should load ServiceComments', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'ServiceComment')
      .first()
      .click();

    serviceCommentComponentsPage = new ServiceCommentComponentsPage();
    await browser.wait(ec.visibilityOf(serviceCommentComponentsPage.title), 5000);
    expect(await serviceCommentComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(ec.visibilityOf(serviceCommentComponentsPage.entities.get(0)), ec.visibilityOf(serviceCommentComponentsPage.noResult)),
      5000
    );
  });

  it('should create ServiceComment', async () => {
    initNumberOfEntities = await serviceCommentComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(serviceCommentComponentsPage.createButton), 5000);
    await serviceCommentComponentsPage.clickOnCreateButton();
    serviceCommentUpdatePage = new ServiceCommentUpdatePage();
    await browser.wait(ec.visibilityOf(serviceCommentUpdatePage.pageTitle), 3000);
    expect(await serviceCommentUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await serviceCommentUpdatePage.setCommentInput(comment);

    await serviceCommentUpdatePage.save();
    await browser.wait(ec.visibilityOf(serviceCommentComponentsPage.title), 3000);
    expect(await serviceCommentComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await serviceCommentComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last ServiceComment', async () => {
    serviceCommentComponentsPage = new ServiceCommentComponentsPage();
    await browser.wait(ec.visibilityOf(serviceCommentComponentsPage.title), 5000);
    lastElement = await serviceCommentComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last ServiceComment', async () => {
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

  it('should view the last ServiceComment', async () => {
    serviceCommentDetailPage = new ServiceCommentDetailPage();
    if (isVisible && (await serviceCommentDetailPage.pageTitle.isDisplayed())) {
      expect(await serviceCommentDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await serviceCommentDetailPage.getIdInput()).toEqual(id);

      expect(await serviceCommentDetailPage.getCommentInput()).toEqual(comment);
    }
  });

  it('should delete last ServiceComment', async () => {
    serviceCommentDetailPage = new ServiceCommentDetailPage();
    if (isVisible && (await serviceCommentDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await serviceCommentDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(serviceCommentComponentsPage.title), 3000);
      expect(await serviceCommentComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await serviceCommentComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish ServiceComments tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
