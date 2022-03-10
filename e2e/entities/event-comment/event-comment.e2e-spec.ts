import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { EventCommentComponentsPage, EventCommentDetailPage, EventCommentUpdatePage } from './event-comment.po';

describe('EventComment e2e test', () => {
  let loginPage: LoginPage;
  let eventCommentComponentsPage: EventCommentComponentsPage;
  let eventCommentUpdatePage: EventCommentUpdatePage;
  let eventCommentDetailPage: EventCommentDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Event Comments';
  const SUBCOMPONENT_TITLE = 'Event Comment';
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

  it('should load EventComments', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'EventComment')
      .first()
      .click();

    eventCommentComponentsPage = new EventCommentComponentsPage();
    await browser.wait(ec.visibilityOf(eventCommentComponentsPage.title), 5000);
    expect(await eventCommentComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(ec.visibilityOf(eventCommentComponentsPage.entities.get(0)), ec.visibilityOf(eventCommentComponentsPage.noResult)),
      5000
    );
  });

  it('should create EventComment', async () => {
    initNumberOfEntities = await eventCommentComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(eventCommentComponentsPage.createButton), 5000);
    await eventCommentComponentsPage.clickOnCreateButton();
    eventCommentUpdatePage = new EventCommentUpdatePage();
    await browser.wait(ec.visibilityOf(eventCommentUpdatePage.pageTitle), 3000);
    expect(await eventCommentUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await eventCommentUpdatePage.setCommentInput(comment);

    await eventCommentUpdatePage.save();
    await browser.wait(ec.visibilityOf(eventCommentComponentsPage.title), 3000);
    expect(await eventCommentComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await eventCommentComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last EventComment', async () => {
    eventCommentComponentsPage = new EventCommentComponentsPage();
    await browser.wait(ec.visibilityOf(eventCommentComponentsPage.title), 5000);
    lastElement = await eventCommentComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last EventComment', async () => {
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

  it('should view the last EventComment', async () => {
    eventCommentDetailPage = new EventCommentDetailPage();
    if (isVisible && (await eventCommentDetailPage.pageTitle.isDisplayed())) {
      expect(await eventCommentDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await eventCommentDetailPage.getIdInput()).toEqual(id);

      expect(await eventCommentDetailPage.getCommentInput()).toEqual(comment);
    }
  });

  it('should delete last EventComment', async () => {
    eventCommentDetailPage = new EventCommentDetailPage();
    if (isVisible && (await eventCommentDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await eventCommentDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(eventCommentComponentsPage.title), 3000);
      expect(await eventCommentComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await eventCommentComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish EventComments tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
