import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import {
  EventProductRatingCommentComponentsPage,
  EventProductRatingCommentDetailPage,
  EventProductRatingCommentUpdatePage,
} from './event-product-rating-comment.po';

describe('EventProductRatingComment e2e test', () => {
  let loginPage: LoginPage;
  let eventProductRatingCommentComponentsPage: EventProductRatingCommentComponentsPage;
  let eventProductRatingCommentUpdatePage: EventProductRatingCommentUpdatePage;
  let eventProductRatingCommentDetailPage: EventProductRatingCommentDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Event Product Rating Comments';
  const SUBCOMPONENT_TITLE = 'Event Product Rating Comment';
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

  it('should load EventProductRatingComments', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'EventProductRatingComment')
      .first()
      .click();

    eventProductRatingCommentComponentsPage = new EventProductRatingCommentComponentsPage();
    await browser.wait(ec.visibilityOf(eventProductRatingCommentComponentsPage.title), 5000);
    expect(await eventProductRatingCommentComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(
        ec.visibilityOf(eventProductRatingCommentComponentsPage.entities.get(0)),
        ec.visibilityOf(eventProductRatingCommentComponentsPage.noResult)
      ),
      5000
    );
  });

  it('should create EventProductRatingComment', async () => {
    initNumberOfEntities = await eventProductRatingCommentComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(eventProductRatingCommentComponentsPage.createButton), 5000);
    await eventProductRatingCommentComponentsPage.clickOnCreateButton();
    eventProductRatingCommentUpdatePage = new EventProductRatingCommentUpdatePage();
    await browser.wait(ec.visibilityOf(eventProductRatingCommentUpdatePage.pageTitle), 3000);
    expect(await eventProductRatingCommentUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await eventProductRatingCommentUpdatePage.setCommentInput(comment);

    await eventProductRatingCommentUpdatePage.save();
    await browser.wait(ec.visibilityOf(eventProductRatingCommentComponentsPage.title), 3000);
    expect(await eventProductRatingCommentComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await eventProductRatingCommentComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last EventProductRatingComment', async () => {
    eventProductRatingCommentComponentsPage = new EventProductRatingCommentComponentsPage();
    await browser.wait(ec.visibilityOf(eventProductRatingCommentComponentsPage.title), 5000);
    lastElement = await eventProductRatingCommentComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last EventProductRatingComment', async () => {
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

  it('should view the last EventProductRatingComment', async () => {
    eventProductRatingCommentDetailPage = new EventProductRatingCommentDetailPage();
    if (isVisible && (await eventProductRatingCommentDetailPage.pageTitle.isDisplayed())) {
      expect(await eventProductRatingCommentDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await eventProductRatingCommentDetailPage.getIdInput()).toEqual(id);

      expect(await eventProductRatingCommentDetailPage.getCommentInput()).toEqual(comment);
    }
  });

  it('should delete last EventProductRatingComment', async () => {
    eventProductRatingCommentDetailPage = new EventProductRatingCommentDetailPage();
    if (isVisible && (await eventProductRatingCommentDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await eventProductRatingCommentDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(eventProductRatingCommentComponentsPage.title), 3000);
      expect(await eventProductRatingCommentComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await eventProductRatingCommentComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish EventProductRatingComments tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
