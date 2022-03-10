import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { EventStarRatingComponentsPage, EventStarRatingDetailPage, EventStarRatingUpdatePage } from './event-star-rating.po';

describe('EventStarRating e2e test', () => {
  let loginPage: LoginPage;
  let eventStarRatingComponentsPage: EventStarRatingComponentsPage;
  let eventStarRatingUpdatePage: EventStarRatingUpdatePage;
  let eventStarRatingDetailPage: EventStarRatingDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Event Star Ratings';
  const SUBCOMPONENT_TITLE = 'Event Star Rating';
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

  it('should load EventStarRatings', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'EventStarRating')
      .first()
      .click();

    eventStarRatingComponentsPage = new EventStarRatingComponentsPage();
    await browser.wait(ec.visibilityOf(eventStarRatingComponentsPage.title), 5000);
    expect(await eventStarRatingComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(ec.visibilityOf(eventStarRatingComponentsPage.entities.get(0)), ec.visibilityOf(eventStarRatingComponentsPage.noResult)),
      5000
    );
  });

  it('should create EventStarRating', async () => {
    initNumberOfEntities = await eventStarRatingComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(eventStarRatingComponentsPage.createButton), 5000);
    await eventStarRatingComponentsPage.clickOnCreateButton();
    eventStarRatingUpdatePage = new EventStarRatingUpdatePage();
    await browser.wait(ec.visibilityOf(eventStarRatingUpdatePage.pageTitle), 3000);
    expect(await eventStarRatingUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await eventStarRatingUpdatePage.setStarsInput(stars);
    await eventStarRatingUpdatePage.setCommentInput(comment);

    await eventStarRatingUpdatePage.save();
    await browser.wait(ec.visibilityOf(eventStarRatingComponentsPage.title), 3000);
    expect(await eventStarRatingComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await eventStarRatingComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last EventStarRating', async () => {
    eventStarRatingComponentsPage = new EventStarRatingComponentsPage();
    await browser.wait(ec.visibilityOf(eventStarRatingComponentsPage.title), 5000);
    lastElement = await eventStarRatingComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last EventStarRating', async () => {
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

  it('should view the last EventStarRating', async () => {
    eventStarRatingDetailPage = new EventStarRatingDetailPage();
    if (isVisible && (await eventStarRatingDetailPage.pageTitle.isDisplayed())) {
      expect(await eventStarRatingDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await eventStarRatingDetailPage.getIdInput()).toEqual(id);

      expect(await eventStarRatingDetailPage.getStarsInput()).toEqual(stars);

      expect(await eventStarRatingDetailPage.getCommentInput()).toEqual(comment);
    }
  });

  it('should delete last EventStarRating', async () => {
    eventStarRatingDetailPage = new EventStarRatingDetailPage();
    if (isVisible && (await eventStarRatingDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await eventStarRatingDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(eventStarRatingComponentsPage.title), 3000);
      expect(await eventStarRatingComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await eventStarRatingComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish EventStarRatings tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
