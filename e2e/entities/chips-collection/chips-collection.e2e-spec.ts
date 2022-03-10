import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { ChipsCollectionComponentsPage, ChipsCollectionDetailPage, ChipsCollectionUpdatePage } from './chips-collection.po';

describe('ChipsCollection e2e test', () => {
  let loginPage: LoginPage;
  let chipsCollectionComponentsPage: ChipsCollectionComponentsPage;
  let chipsCollectionUpdatePage: ChipsCollectionUpdatePage;
  let chipsCollectionDetailPage: ChipsCollectionDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Chips Collections';
  const SUBCOMPONENT_TITLE = 'Chips Collection';
  let lastElement: any;
  let isVisible = false;

  const id = '10';

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

  it('should load ChipsCollections', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'ChipsCollection')
      .first()
      .click();

    chipsCollectionComponentsPage = new ChipsCollectionComponentsPage();
    await browser.wait(ec.visibilityOf(chipsCollectionComponentsPage.title), 5000);
    expect(await chipsCollectionComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(ec.visibilityOf(chipsCollectionComponentsPage.entities.get(0)), ec.visibilityOf(chipsCollectionComponentsPage.noResult)),
      5000
    );
  });

  it('should create ChipsCollection', async () => {
    initNumberOfEntities = await chipsCollectionComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(chipsCollectionComponentsPage.createButton), 5000);
    await chipsCollectionComponentsPage.clickOnCreateButton();
    chipsCollectionUpdatePage = new ChipsCollectionUpdatePage();
    await browser.wait(ec.visibilityOf(chipsCollectionUpdatePage.pageTitle), 3000);
    expect(await chipsCollectionUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await chipsCollectionUpdatePage.save();
    await browser.wait(ec.visibilityOf(chipsCollectionComponentsPage.title), 3000);
    expect(await chipsCollectionComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await chipsCollectionComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last ChipsCollection', async () => {
    chipsCollectionComponentsPage = new ChipsCollectionComponentsPage();
    await browser.wait(ec.visibilityOf(chipsCollectionComponentsPage.title), 5000);
    lastElement = await chipsCollectionComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last ChipsCollection', async () => {
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

  it('should view the last ChipsCollection', async () => {
    chipsCollectionDetailPage = new ChipsCollectionDetailPage();
    if (isVisible && (await chipsCollectionDetailPage.pageTitle.isDisplayed())) {
      expect(await chipsCollectionDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await chipsCollectionDetailPage.getIdInput()).toEqual(id);
    }
  });

  it('should delete last ChipsCollection', async () => {
    chipsCollectionDetailPage = new ChipsCollectionDetailPage();
    if (isVisible && (await chipsCollectionDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await chipsCollectionDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(chipsCollectionComponentsPage.title), 3000);
      expect(await chipsCollectionComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await chipsCollectionComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish ChipsCollections tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
