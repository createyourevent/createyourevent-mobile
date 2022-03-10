import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { HotelComponentsPage, HotelDetailPage, HotelUpdatePage } from './hotel.po';

describe('Hotel e2e test', () => {
  let loginPage: LoginPage;
  let hotelComponentsPage: HotelComponentsPage;
  let hotelUpdatePage: HotelUpdatePage;
  let hotelDetailPage: HotelDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Hotels';
  const SUBCOMPONENT_TITLE = 'Hotel';
  let lastElement: any;
  let isVisible = false;

  const id = '10';
  const menu = 'menu';
  const placesToSleep = '10';

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

  it('should load Hotels', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'Hotel')
      .first()
      .click();

    hotelComponentsPage = new HotelComponentsPage();
    await browser.wait(ec.visibilityOf(hotelComponentsPage.title), 5000);
    expect(await hotelComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(ec.or(ec.visibilityOf(hotelComponentsPage.entities.get(0)), ec.visibilityOf(hotelComponentsPage.noResult)), 5000);
  });

  it('should create Hotel', async () => {
    initNumberOfEntities = await hotelComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(hotelComponentsPage.createButton), 5000);
    await hotelComponentsPage.clickOnCreateButton();
    hotelUpdatePage = new HotelUpdatePage();
    await browser.wait(ec.visibilityOf(hotelUpdatePage.pageTitle), 3000);
    expect(await hotelUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await hotelUpdatePage.setMenuInput(menu);
    await hotelUpdatePage.setPlacesToSleepInput(placesToSleep);

    await hotelUpdatePage.save();
    await browser.wait(ec.visibilityOf(hotelComponentsPage.title), 3000);
    expect(await hotelComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await hotelComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last Hotel', async () => {
    hotelComponentsPage = new HotelComponentsPage();
    await browser.wait(ec.visibilityOf(hotelComponentsPage.title), 5000);
    lastElement = await hotelComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last Hotel', async () => {
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

  it('should view the last Hotel', async () => {
    hotelDetailPage = new HotelDetailPage();
    if (isVisible && (await hotelDetailPage.pageTitle.isDisplayed())) {
      expect(await hotelDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await hotelDetailPage.getIdInput()).toEqual(id);

      expect(await hotelDetailPage.getMenuInput()).toEqual(menu);

      expect(await hotelDetailPage.getPlacesToSleepInput()).toEqual(placesToSleep);
    }
  });

  it('should delete last Hotel', async () => {
    hotelDetailPage = new HotelDetailPage();
    if (isVisible && (await hotelDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await hotelDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(hotelComponentsPage.title), 3000);
      expect(await hotelComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await hotelComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish Hotels tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
