import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { RestaurantComponentsPage, RestaurantDetailPage, RestaurantUpdatePage } from './restaurant.po';

describe('Restaurant e2e test', () => {
  let loginPage: LoginPage;
  let restaurantComponentsPage: RestaurantComponentsPage;
  let restaurantUpdatePage: RestaurantUpdatePage;
  let restaurantDetailPage: RestaurantDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Restaurants';
  const SUBCOMPONENT_TITLE = 'Restaurant';
  let lastElement: any;
  let isVisible = false;

  const id = '10';
  const menu = 'menu';

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

  it('should load Restaurants', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'Restaurant')
      .first()
      .click();

    restaurantComponentsPage = new RestaurantComponentsPage();
    await browser.wait(ec.visibilityOf(restaurantComponentsPage.title), 5000);
    expect(await restaurantComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(ec.visibilityOf(restaurantComponentsPage.entities.get(0)), ec.visibilityOf(restaurantComponentsPage.noResult)),
      5000
    );
  });

  it('should create Restaurant', async () => {
    initNumberOfEntities = await restaurantComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(restaurantComponentsPage.createButton), 5000);
    await restaurantComponentsPage.clickOnCreateButton();
    restaurantUpdatePage = new RestaurantUpdatePage();
    await browser.wait(ec.visibilityOf(restaurantUpdatePage.pageTitle), 3000);
    expect(await restaurantUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await restaurantUpdatePage.setMenuInput(menu);

    await restaurantUpdatePage.save();
    await browser.wait(ec.visibilityOf(restaurantComponentsPage.title), 3000);
    expect(await restaurantComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await restaurantComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last Restaurant', async () => {
    restaurantComponentsPage = new RestaurantComponentsPage();
    await browser.wait(ec.visibilityOf(restaurantComponentsPage.title), 5000);
    lastElement = await restaurantComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last Restaurant', async () => {
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

  it('should view the last Restaurant', async () => {
    restaurantDetailPage = new RestaurantDetailPage();
    if (isVisible && (await restaurantDetailPage.pageTitle.isDisplayed())) {
      expect(await restaurantDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await restaurantDetailPage.getIdInput()).toEqual(id);

      expect(await restaurantDetailPage.getMenuInput()).toEqual(menu);
    }
  });

  it('should delete last Restaurant', async () => {
    restaurantDetailPage = new RestaurantDetailPage();
    if (isVisible && (await restaurantDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await restaurantDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(restaurantComponentsPage.title), 3000);
      expect(await restaurantComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await restaurantComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish Restaurants tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
