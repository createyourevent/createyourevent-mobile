import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import {
  OrganizationLikeDislikeComponentsPage,
  OrganizationLikeDislikeDetailPage,
  OrganizationLikeDislikeUpdatePage,
} from './organization-like-dislike.po';

describe('OrganizationLikeDislike e2e test', () => {
  let loginPage: LoginPage;
  let organizationLikeDislikeComponentsPage: OrganizationLikeDislikeComponentsPage;
  let organizationLikeDislikeUpdatePage: OrganizationLikeDislikeUpdatePage;
  let organizationLikeDislikeDetailPage: OrganizationLikeDislikeDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Organization Like Dislikes';
  const SUBCOMPONENT_TITLE = 'Organization Like Dislike';
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

  it('should load OrganizationLikeDislikes', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'OrganizationLikeDislike')
      .first()
      .click();

    organizationLikeDislikeComponentsPage = new OrganizationLikeDislikeComponentsPage();
    await browser.wait(ec.visibilityOf(organizationLikeDislikeComponentsPage.title), 5000);
    expect(await organizationLikeDislikeComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(
        ec.visibilityOf(organizationLikeDislikeComponentsPage.entities.get(0)),
        ec.visibilityOf(organizationLikeDislikeComponentsPage.noResult)
      ),
      5000
    );
  });

  it('should create OrganizationLikeDislike', async () => {
    initNumberOfEntities = await organizationLikeDislikeComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(organizationLikeDislikeComponentsPage.createButton), 5000);
    await organizationLikeDislikeComponentsPage.clickOnCreateButton();
    organizationLikeDislikeUpdatePage = new OrganizationLikeDislikeUpdatePage();
    await browser.wait(ec.visibilityOf(organizationLikeDislikeUpdatePage.pageTitle), 3000);
    expect(await organizationLikeDislikeUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await organizationLikeDislikeUpdatePage.setLikeInput(like);
    await organizationLikeDislikeUpdatePage.setDislikeInput(dislike);
    await organizationLikeDislikeUpdatePage.setCommentInput(comment);

    await organizationLikeDislikeUpdatePage.save();
    await browser.wait(ec.visibilityOf(organizationLikeDislikeComponentsPage.title), 3000);
    expect(await organizationLikeDislikeComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await organizationLikeDislikeComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last OrganizationLikeDislike', async () => {
    organizationLikeDislikeComponentsPage = new OrganizationLikeDislikeComponentsPage();
    await browser.wait(ec.visibilityOf(organizationLikeDislikeComponentsPage.title), 5000);
    lastElement = await organizationLikeDislikeComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last OrganizationLikeDislike', async () => {
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

  it('should view the last OrganizationLikeDislike', async () => {
    organizationLikeDislikeDetailPage = new OrganizationLikeDislikeDetailPage();
    if (isVisible && (await organizationLikeDislikeDetailPage.pageTitle.isDisplayed())) {
      expect(await organizationLikeDislikeDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await organizationLikeDislikeDetailPage.getIdInput()).toEqual(id);

      expect(await organizationLikeDislikeDetailPage.getLikeInput()).toEqual(like);

      expect(await organizationLikeDislikeDetailPage.getDislikeInput()).toEqual(dislike);

      expect(await organizationLikeDislikeDetailPage.getCommentInput()).toEqual(comment);
    }
  });

  it('should delete last OrganizationLikeDislike', async () => {
    organizationLikeDislikeDetailPage = new OrganizationLikeDislikeDetailPage();
    if (isVisible && (await organizationLikeDislikeDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await organizationLikeDislikeDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(organizationLikeDislikeComponentsPage.title), 3000);
      expect(await organizationLikeDislikeComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await organizationLikeDislikeComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish OrganizationLikeDislikes tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
