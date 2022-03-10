import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { ChipsComponentsPage, ChipsDetailPage, ChipsUpdatePage } from './chips.po';

describe('Chips e2e test', () => {
  let loginPage: LoginPage;
  let chipsComponentsPage: ChipsComponentsPage;
  let chipsUpdatePage: ChipsUpdatePage;
  let chipsDetailPage: ChipsDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Chips';
  const SUBCOMPONENT_TITLE = 'Chips';
  let lastElement: any;
  let isVisible = false;

  const id = '10';
  const points = '10';
  const website = 'website';
  const x = '10';
  const y = '10';
  const color = 'color';

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

  it('should load Chips', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'Chips')
      .first()
      .click();

    chipsComponentsPage = new ChipsComponentsPage();
    await browser.wait(ec.visibilityOf(chipsComponentsPage.title), 5000);
    expect(await chipsComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(ec.or(ec.visibilityOf(chipsComponentsPage.entities.get(0)), ec.visibilityOf(chipsComponentsPage.noResult)), 5000);
  });

  it('should create Chips', async () => {
    initNumberOfEntities = await chipsComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(chipsComponentsPage.createButton), 5000);
    await chipsComponentsPage.clickOnCreateButton();
    chipsUpdatePage = new ChipsUpdatePage();
    await browser.wait(ec.visibilityOf(chipsUpdatePage.pageTitle), 3000);
    expect(await chipsUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await chipsUpdatePage.setPointsInput(points);
    await chipsUpdatePage.setWebsiteInput(website);
    await chipsUpdatePage.setXInput(x);
    await chipsUpdatePage.setYInput(y);
    await chipsUpdatePage.setImageInput(image);
    await chipsUpdatePage.setColorInput(color);

    await chipsUpdatePage.save();
    await browser.wait(ec.visibilityOf(chipsComponentsPage.title), 3000);
    expect(await chipsComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await chipsComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last Chips', async () => {
    chipsComponentsPage = new ChipsComponentsPage();
    await browser.wait(ec.visibilityOf(chipsComponentsPage.title), 5000);
    lastElement = await chipsComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last Chips', async () => {
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

  it('should view the last Chips', async () => {
    chipsDetailPage = new ChipsDetailPage();
    if (isVisible && (await chipsDetailPage.pageTitle.isDisplayed())) {
      expect(await chipsDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await chipsDetailPage.getIdInput()).toEqual(id);

      expect(await chipsDetailPage.getPointsInput()).toEqual(points);

      expect(await chipsDetailPage.getWebsiteInput()).toEqual(website);

      expect(await chipsDetailPage.getXInput()).toEqual(x);

      expect(await chipsDetailPage.getYInput()).toEqual(y);

      expect(await chipsDetailPage.getImageInput()).toEqual(image);

      expect(await chipsDetailPage.getColorInput()).toEqual(color);
    }
  });

  it('should delete last Chips', async () => {
    chipsDetailPage = new ChipsDetailPage();
    if (isVisible && (await chipsDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await chipsDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(chipsComponentsPage.title), 3000);
      expect(await chipsComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await chipsComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish Chips tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
