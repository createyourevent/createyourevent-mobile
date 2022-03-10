import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { Mp3ComponentsPage, Mp3DetailPage, Mp3UpdatePage } from './mp-3.po';

describe('Mp3 e2e test', () => {
  let loginPage: LoginPage;
  let mp3ComponentsPage: Mp3ComponentsPage;
  let mp3UpdatePage: Mp3UpdatePage;
  let mp3DetailPage: Mp3DetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Mp 3 S';
  const SUBCOMPONENT_TITLE = 'Mp 3';
  let lastElement: any;
  let isVisible = false;

  const id = '10';
  const title = 'title';
  const artists = 'artists';
  const duration = '10';
  const url = 'url';

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

  it('should load Mp3s', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'Mp3')
      .first()
      .click();

    mp3ComponentsPage = new Mp3ComponentsPage();
    await browser.wait(ec.visibilityOf(mp3ComponentsPage.title), 5000);
    expect(await mp3ComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(ec.or(ec.visibilityOf(mp3ComponentsPage.entities.get(0)), ec.visibilityOf(mp3ComponentsPage.noResult)), 5000);
  });

  it('should create Mp3', async () => {
    initNumberOfEntities = await mp3ComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(mp3ComponentsPage.createButton), 5000);
    await mp3ComponentsPage.clickOnCreateButton();
    mp3UpdatePage = new Mp3UpdatePage();
    await browser.wait(ec.visibilityOf(mp3UpdatePage.pageTitle), 3000);
    expect(await mp3UpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await mp3UpdatePage.setTitleInput(title);
    await mp3UpdatePage.setArtistsInput(artists);
    await mp3UpdatePage.setDurationInput(duration);
    await mp3UpdatePage.setUrlInput(url);

    await mp3UpdatePage.save();
    await browser.wait(ec.visibilityOf(mp3ComponentsPage.title), 3000);
    expect(await mp3ComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await mp3ComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last Mp3', async () => {
    mp3ComponentsPage = new Mp3ComponentsPage();
    await browser.wait(ec.visibilityOf(mp3ComponentsPage.title), 5000);
    lastElement = await mp3ComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last Mp3', async () => {
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

  it('should view the last Mp3', async () => {
    mp3DetailPage = new Mp3DetailPage();
    if (isVisible && (await mp3DetailPage.pageTitle.isDisplayed())) {
      expect(await mp3DetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await mp3DetailPage.getIdInput()).toEqual(id);

      expect(await mp3DetailPage.getTitleInput()).toEqual(title);

      expect(await mp3DetailPage.getArtistsInput()).toEqual(artists);

      expect(await mp3DetailPage.getDurationInput()).toEqual(duration);

      expect(await mp3DetailPage.getUrlInput()).toEqual(url);
    }
  });

  it('should delete last Mp3', async () => {
    mp3DetailPage = new Mp3DetailPage();
    if (isVisible && (await mp3DetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await mp3DetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(mp3ComponentsPage.title), 3000);
      expect(await mp3ComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await mp3ComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish Mp3s tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
