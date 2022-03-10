import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { EventLikeDislikeComponentsPage, EventLikeDislikeDetailPage, EventLikeDislikeUpdatePage } from './event-like-dislike.po';

describe('EventLikeDislike e2e test', () => {
  let loginPage: LoginPage;
  let eventLikeDislikeComponentsPage: EventLikeDislikeComponentsPage;
  let eventLikeDislikeUpdatePage: EventLikeDislikeUpdatePage;
  let eventLikeDislikeDetailPage: EventLikeDislikeDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Event Like Dislikes';
  const SUBCOMPONENT_TITLE = 'Event Like Dislike';
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

  it('should load EventLikeDislikes', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'EventLikeDislike')
      .first()
      .click();

    eventLikeDislikeComponentsPage = new EventLikeDislikeComponentsPage();
    await browser.wait(ec.visibilityOf(eventLikeDislikeComponentsPage.title), 5000);
    expect(await eventLikeDislikeComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(ec.visibilityOf(eventLikeDislikeComponentsPage.entities.get(0)), ec.visibilityOf(eventLikeDislikeComponentsPage.noResult)),
      5000
    );
  });

  it('should create EventLikeDislike', async () => {
    initNumberOfEntities = await eventLikeDislikeComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(eventLikeDislikeComponentsPage.createButton), 5000);
    await eventLikeDislikeComponentsPage.clickOnCreateButton();
    eventLikeDislikeUpdatePage = new EventLikeDislikeUpdatePage();
    await browser.wait(ec.visibilityOf(eventLikeDislikeUpdatePage.pageTitle), 3000);
    expect(await eventLikeDislikeUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await eventLikeDislikeUpdatePage.setLikeInput(like);
    await eventLikeDislikeUpdatePage.setDislikeInput(dislike);
    await eventLikeDislikeUpdatePage.setCommentInput(comment);

    await eventLikeDislikeUpdatePage.save();
    await browser.wait(ec.visibilityOf(eventLikeDislikeComponentsPage.title), 3000);
    expect(await eventLikeDislikeComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await eventLikeDislikeComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last EventLikeDislike', async () => {
    eventLikeDislikeComponentsPage = new EventLikeDislikeComponentsPage();
    await browser.wait(ec.visibilityOf(eventLikeDislikeComponentsPage.title), 5000);
    lastElement = await eventLikeDislikeComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last EventLikeDislike', async () => {
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

  it('should view the last EventLikeDislike', async () => {
    eventLikeDislikeDetailPage = new EventLikeDislikeDetailPage();
    if (isVisible && (await eventLikeDislikeDetailPage.pageTitle.isDisplayed())) {
      expect(await eventLikeDislikeDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await eventLikeDislikeDetailPage.getIdInput()).toEqual(id);

      expect(await eventLikeDislikeDetailPage.getLikeInput()).toEqual(like);

      expect(await eventLikeDislikeDetailPage.getDislikeInput()).toEqual(dislike);

      expect(await eventLikeDislikeDetailPage.getCommentInput()).toEqual(comment);
    }
  });

  it('should delete last EventLikeDislike', async () => {
    eventLikeDislikeDetailPage = new EventLikeDislikeDetailPage();
    if (isVisible && (await eventLikeDislikeDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await eventLikeDislikeDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(eventLikeDislikeComponentsPage.title), 3000);
      expect(await eventLikeDislikeComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await eventLikeDislikeComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish EventLikeDislikes tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
