import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { ClubComponentsPage, ClubDetailPage, ClubUpdatePage } from './club.po';

describe('Club e2e test', () => {
  let loginPage: LoginPage;
  let clubComponentsPage: ClubComponentsPage;
  let clubUpdatePage: ClubUpdatePage;
  let clubDetailPage: ClubDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Clubs';
  const SUBCOMPONENT_TITLE = 'Club';
  let lastElement: any;
  let isVisible = false;

  const id = '10';
  const priceCard = 'priceCard';

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

  it('should load Clubs', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'Club')
      .first()
      .click();

    clubComponentsPage = new ClubComponentsPage();
    await browser.wait(ec.visibilityOf(clubComponentsPage.title), 5000);
    expect(await clubComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(ec.or(ec.visibilityOf(clubComponentsPage.entities.get(0)), ec.visibilityOf(clubComponentsPage.noResult)), 5000);
  });

  it('should create Club', async () => {
    initNumberOfEntities = await clubComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(clubComponentsPage.createButton), 5000);
    await clubComponentsPage.clickOnCreateButton();
    clubUpdatePage = new ClubUpdatePage();
    await browser.wait(ec.visibilityOf(clubUpdatePage.pageTitle), 3000);
    expect(await clubUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await clubUpdatePage.setPriceCardInput(priceCard);

    await clubUpdatePage.save();
    await browser.wait(ec.visibilityOf(clubComponentsPage.title), 3000);
    expect(await clubComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await clubComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last Club', async () => {
    clubComponentsPage = new ClubComponentsPage();
    await browser.wait(ec.visibilityOf(clubComponentsPage.title), 5000);
    lastElement = await clubComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last Club', async () => {
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

  it('should view the last Club', async () => {
    clubDetailPage = new ClubDetailPage();
    if (isVisible && (await clubDetailPage.pageTitle.isDisplayed())) {
      expect(await clubDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await clubDetailPage.getIdInput()).toEqual(id);

      expect(await clubDetailPage.getPriceCardInput()).toEqual(priceCard);
    }
  });

  it('should delete last Club', async () => {
    clubDetailPage = new ClubDetailPage();
    if (isVisible && (await clubDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await clubDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(clubComponentsPage.title), 3000);
      expect(await clubComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await clubComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish Clubs tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
