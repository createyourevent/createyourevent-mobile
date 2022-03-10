import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { ServiceStarRatingComponentsPage, ServiceStarRatingDetailPage, ServiceStarRatingUpdatePage } from './service-star-rating.po';

describe('ServiceStarRating e2e test', () => {
  let loginPage: LoginPage;
  let serviceStarRatingComponentsPage: ServiceStarRatingComponentsPage;
  let serviceStarRatingUpdatePage: ServiceStarRatingUpdatePage;
  let serviceStarRatingDetailPage: ServiceStarRatingDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Service Star Ratings';
  const SUBCOMPONENT_TITLE = 'Service Star Rating';
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

  it('should load ServiceStarRatings', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'ServiceStarRating')
      .first()
      .click();

    serviceStarRatingComponentsPage = new ServiceStarRatingComponentsPage();
    await browser.wait(ec.visibilityOf(serviceStarRatingComponentsPage.title), 5000);
    expect(await serviceStarRatingComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(ec.visibilityOf(serviceStarRatingComponentsPage.entities.get(0)), ec.visibilityOf(serviceStarRatingComponentsPage.noResult)),
      5000
    );
  });

  it('should create ServiceStarRating', async () => {
    initNumberOfEntities = await serviceStarRatingComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(serviceStarRatingComponentsPage.createButton), 5000);
    await serviceStarRatingComponentsPage.clickOnCreateButton();
    serviceStarRatingUpdatePage = new ServiceStarRatingUpdatePage();
    await browser.wait(ec.visibilityOf(serviceStarRatingUpdatePage.pageTitle), 3000);
    expect(await serviceStarRatingUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await serviceStarRatingUpdatePage.setStarsInput(stars);
    await serviceStarRatingUpdatePage.setCommentInput(comment);

    await serviceStarRatingUpdatePage.save();
    await browser.wait(ec.visibilityOf(serviceStarRatingComponentsPage.title), 3000);
    expect(await serviceStarRatingComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await serviceStarRatingComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last ServiceStarRating', async () => {
    serviceStarRatingComponentsPage = new ServiceStarRatingComponentsPage();
    await browser.wait(ec.visibilityOf(serviceStarRatingComponentsPage.title), 5000);
    lastElement = await serviceStarRatingComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last ServiceStarRating', async () => {
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

  it('should view the last ServiceStarRating', async () => {
    serviceStarRatingDetailPage = new ServiceStarRatingDetailPage();
    if (isVisible && (await serviceStarRatingDetailPage.pageTitle.isDisplayed())) {
      expect(await serviceStarRatingDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await serviceStarRatingDetailPage.getIdInput()).toEqual(id);

      expect(await serviceStarRatingDetailPage.getStarsInput()).toEqual(stars);

      expect(await serviceStarRatingDetailPage.getCommentInput()).toEqual(comment);
    }
  });

  it('should delete last ServiceStarRating', async () => {
    serviceStarRatingDetailPage = new ServiceStarRatingDetailPage();
    if (isVisible && (await serviceStarRatingDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await serviceStarRatingDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(serviceStarRatingComponentsPage.title), 3000);
      expect(await serviceStarRatingComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await serviceStarRatingComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish ServiceStarRatings tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
