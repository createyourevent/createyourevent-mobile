import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import {
  OrganizationStarRatingComponentsPage,
  OrganizationStarRatingDetailPage,
  OrganizationStarRatingUpdatePage,
} from './organization-star-rating.po';

describe('OrganizationStarRating e2e test', () => {
  let loginPage: LoginPage;
  let organizationStarRatingComponentsPage: OrganizationStarRatingComponentsPage;
  let organizationStarRatingUpdatePage: OrganizationStarRatingUpdatePage;
  let organizationStarRatingDetailPage: OrganizationStarRatingDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Organization Star Ratings';
  const SUBCOMPONENT_TITLE = 'Organization Star Rating';
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

  it('should load OrganizationStarRatings', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'OrganizationStarRating')
      .first()
      .click();

    organizationStarRatingComponentsPage = new OrganizationStarRatingComponentsPage();
    await browser.wait(ec.visibilityOf(organizationStarRatingComponentsPage.title), 5000);
    expect(await organizationStarRatingComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(
        ec.visibilityOf(organizationStarRatingComponentsPage.entities.get(0)),
        ec.visibilityOf(organizationStarRatingComponentsPage.noResult)
      ),
      5000
    );
  });

  it('should create OrganizationStarRating', async () => {
    initNumberOfEntities = await organizationStarRatingComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(organizationStarRatingComponentsPage.createButton), 5000);
    await organizationStarRatingComponentsPage.clickOnCreateButton();
    organizationStarRatingUpdatePage = new OrganizationStarRatingUpdatePage();
    await browser.wait(ec.visibilityOf(organizationStarRatingUpdatePage.pageTitle), 3000);
    expect(await organizationStarRatingUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await organizationStarRatingUpdatePage.setStarsInput(stars);
    await organizationStarRatingUpdatePage.setCommentInput(comment);

    await organizationStarRatingUpdatePage.save();
    await browser.wait(ec.visibilityOf(organizationStarRatingComponentsPage.title), 3000);
    expect(await organizationStarRatingComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await organizationStarRatingComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last OrganizationStarRating', async () => {
    organizationStarRatingComponentsPage = new OrganizationStarRatingComponentsPage();
    await browser.wait(ec.visibilityOf(organizationStarRatingComponentsPage.title), 5000);
    lastElement = await organizationStarRatingComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last OrganizationStarRating', async () => {
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

  it('should view the last OrganizationStarRating', async () => {
    organizationStarRatingDetailPage = new OrganizationStarRatingDetailPage();
    if (isVisible && (await organizationStarRatingDetailPage.pageTitle.isDisplayed())) {
      expect(await organizationStarRatingDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await organizationStarRatingDetailPage.getIdInput()).toEqual(id);

      expect(await organizationStarRatingDetailPage.getStarsInput()).toEqual(stars);

      expect(await organizationStarRatingDetailPage.getCommentInput()).toEqual(comment);
    }
  });

  it('should delete last OrganizationStarRating', async () => {
    organizationStarRatingDetailPage = new OrganizationStarRatingDetailPage();
    if (isVisible && (await organizationStarRatingDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await organizationStarRatingDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(organizationStarRatingComponentsPage.title), 3000);
      expect(await organizationStarRatingComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await organizationStarRatingComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish OrganizationStarRatings tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
