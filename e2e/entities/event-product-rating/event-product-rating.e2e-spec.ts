import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { EventProductRatingComponentsPage, EventProductRatingDetailPage, EventProductRatingUpdatePage } from './event-product-rating.po';

describe('EventProductRating e2e test', () => {
  let loginPage: LoginPage;
  let eventProductRatingComponentsPage: EventProductRatingComponentsPage;
  let eventProductRatingUpdatePage: EventProductRatingUpdatePage;
  let eventProductRatingDetailPage: EventProductRatingDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Event Product Ratings';
  const SUBCOMPONENT_TITLE = 'Event Product Rating';
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

  it('should load EventProductRatings', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'EventProductRating')
      .first()
      .click();

    eventProductRatingComponentsPage = new EventProductRatingComponentsPage();
    await browser.wait(ec.visibilityOf(eventProductRatingComponentsPage.title), 5000);
    expect(await eventProductRatingComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(ec.visibilityOf(eventProductRatingComponentsPage.entities.get(0)), ec.visibilityOf(eventProductRatingComponentsPage.noResult)),
      5000
    );
  });

  it('should create EventProductRating', async () => {
    initNumberOfEntities = await eventProductRatingComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(eventProductRatingComponentsPage.createButton), 5000);
    await eventProductRatingComponentsPage.clickOnCreateButton();
    eventProductRatingUpdatePage = new EventProductRatingUpdatePage();
    await browser.wait(ec.visibilityOf(eventProductRatingUpdatePage.pageTitle), 3000);
    expect(await eventProductRatingUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await eventProductRatingUpdatePage.setLikeInput(like);
    await eventProductRatingUpdatePage.setDislikeInput(dislike);
    await eventProductRatingUpdatePage.setCommentInput(comment);

    await eventProductRatingUpdatePage.save();
    await browser.wait(ec.visibilityOf(eventProductRatingComponentsPage.title), 3000);
    expect(await eventProductRatingComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await eventProductRatingComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last EventProductRating', async () => {
    eventProductRatingComponentsPage = new EventProductRatingComponentsPage();
    await browser.wait(ec.visibilityOf(eventProductRatingComponentsPage.title), 5000);
    lastElement = await eventProductRatingComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last EventProductRating', async () => {
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

  it('should view the last EventProductRating', async () => {
    eventProductRatingDetailPage = new EventProductRatingDetailPage();
    if (isVisible && (await eventProductRatingDetailPage.pageTitle.isDisplayed())) {
      expect(await eventProductRatingDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await eventProductRatingDetailPage.getIdInput()).toEqual(id);

      expect(await eventProductRatingDetailPage.getLikeInput()).toEqual(like);

      expect(await eventProductRatingDetailPage.getDislikeInput()).toEqual(dislike);

      expect(await eventProductRatingDetailPage.getCommentInput()).toEqual(comment);
    }
  });

  it('should delete last EventProductRating', async () => {
    eventProductRatingDetailPage = new EventProductRatingDetailPage();
    if (isVisible && (await eventProductRatingDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await eventProductRatingDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(eventProductRatingComponentsPage.title), 3000);
      expect(await eventProductRatingComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await eventProductRatingComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish EventProductRatings tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
