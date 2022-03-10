import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { ServiceLikeDislikeComponentsPage, ServiceLikeDislikeDetailPage, ServiceLikeDislikeUpdatePage } from './service-like-dislike.po';

describe('ServiceLikeDislike e2e test', () => {
  let loginPage: LoginPage;
  let serviceLikeDislikeComponentsPage: ServiceLikeDislikeComponentsPage;
  let serviceLikeDislikeUpdatePage: ServiceLikeDislikeUpdatePage;
  let serviceLikeDislikeDetailPage: ServiceLikeDislikeDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Service Like Dislikes';
  const SUBCOMPONENT_TITLE = 'Service Like Dislike';
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

  it('should load ServiceLikeDislikes', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'ServiceLikeDislike')
      .first()
      .click();

    serviceLikeDislikeComponentsPage = new ServiceLikeDislikeComponentsPage();
    await browser.wait(ec.visibilityOf(serviceLikeDislikeComponentsPage.title), 5000);
    expect(await serviceLikeDislikeComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(ec.visibilityOf(serviceLikeDislikeComponentsPage.entities.get(0)), ec.visibilityOf(serviceLikeDislikeComponentsPage.noResult)),
      5000
    );
  });

  it('should create ServiceLikeDislike', async () => {
    initNumberOfEntities = await serviceLikeDislikeComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(serviceLikeDislikeComponentsPage.createButton), 5000);
    await serviceLikeDislikeComponentsPage.clickOnCreateButton();
    serviceLikeDislikeUpdatePage = new ServiceLikeDislikeUpdatePage();
    await browser.wait(ec.visibilityOf(serviceLikeDislikeUpdatePage.pageTitle), 3000);
    expect(await serviceLikeDislikeUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await serviceLikeDislikeUpdatePage.setLikeInput(like);
    await serviceLikeDislikeUpdatePage.setDislikeInput(dislike);
    await serviceLikeDislikeUpdatePage.setCommentInput(comment);

    await serviceLikeDislikeUpdatePage.save();
    await browser.wait(ec.visibilityOf(serviceLikeDislikeComponentsPage.title), 3000);
    expect(await serviceLikeDislikeComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await serviceLikeDislikeComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last ServiceLikeDislike', async () => {
    serviceLikeDislikeComponentsPage = new ServiceLikeDislikeComponentsPage();
    await browser.wait(ec.visibilityOf(serviceLikeDislikeComponentsPage.title), 5000);
    lastElement = await serviceLikeDislikeComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last ServiceLikeDislike', async () => {
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

  it('should view the last ServiceLikeDislike', async () => {
    serviceLikeDislikeDetailPage = new ServiceLikeDislikeDetailPage();
    if (isVisible && (await serviceLikeDislikeDetailPage.pageTitle.isDisplayed())) {
      expect(await serviceLikeDislikeDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await serviceLikeDislikeDetailPage.getIdInput()).toEqual(id);

      expect(await serviceLikeDislikeDetailPage.getLikeInput()).toEqual(like);

      expect(await serviceLikeDislikeDetailPage.getDislikeInput()).toEqual(dislike);

      expect(await serviceLikeDislikeDetailPage.getCommentInput()).toEqual(comment);
    }
  });

  it('should delete last ServiceLikeDislike', async () => {
    serviceLikeDislikeDetailPage = new ServiceLikeDislikeDetailPage();
    if (isVisible && (await serviceLikeDislikeDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await serviceLikeDislikeDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(serviceLikeDislikeComponentsPage.title), 3000);
      expect(await serviceLikeDislikeComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await serviceLikeDislikeComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish ServiceLikeDislikes tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
