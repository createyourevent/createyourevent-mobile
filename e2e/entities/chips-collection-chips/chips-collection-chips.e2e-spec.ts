import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import {
  ChipsCollectionChipsComponentsPage,
  ChipsCollectionChipsDetailPage,
  ChipsCollectionChipsUpdatePage,
} from './chips-collection-chips.po';

describe('ChipsCollectionChips e2e test', () => {
  let loginPage: LoginPage;
  let chipsCollectionChipsComponentsPage: ChipsCollectionChipsComponentsPage;
  let chipsCollectionChipsUpdatePage: ChipsCollectionChipsUpdatePage;
  let chipsCollectionChipsDetailPage: ChipsCollectionChipsDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Chips Collection Chips';
  const SUBCOMPONENT_TITLE = 'Chips Collection Chips';
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

  it('should load ChipsCollectionChips', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'ChipsCollectionChips')
      .first()
      .click();

    chipsCollectionChipsComponentsPage = new ChipsCollectionChipsComponentsPage();
    await browser.wait(ec.visibilityOf(chipsCollectionChipsComponentsPage.title), 5000);
    expect(await chipsCollectionChipsComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(
        ec.visibilityOf(chipsCollectionChipsComponentsPage.entities.get(0)),
        ec.visibilityOf(chipsCollectionChipsComponentsPage.noResult)
      ),
      5000
    );
  });

  it('should create ChipsCollectionChips', async () => {
    initNumberOfEntities = await chipsCollectionChipsComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(chipsCollectionChipsComponentsPage.createButton), 5000);
    await chipsCollectionChipsComponentsPage.clickOnCreateButton();
    chipsCollectionChipsUpdatePage = new ChipsCollectionChipsUpdatePage();
    await browser.wait(ec.visibilityOf(chipsCollectionChipsUpdatePage.pageTitle), 3000);
    expect(await chipsCollectionChipsUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await chipsCollectionChipsUpdatePage.save();
    await browser.wait(ec.visibilityOf(chipsCollectionChipsComponentsPage.title), 3000);
    expect(await chipsCollectionChipsComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await chipsCollectionChipsComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last ChipsCollectionChips', async () => {
    chipsCollectionChipsComponentsPage = new ChipsCollectionChipsComponentsPage();
    await browser.wait(ec.visibilityOf(chipsCollectionChipsComponentsPage.title), 5000);
    lastElement = await chipsCollectionChipsComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last ChipsCollectionChips', async () => {
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

  it('should view the last ChipsCollectionChips', async () => {
    chipsCollectionChipsDetailPage = new ChipsCollectionChipsDetailPage();
    if (isVisible && (await chipsCollectionChipsDetailPage.pageTitle.isDisplayed())) {
      expect(await chipsCollectionChipsDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await chipsCollectionChipsDetailPage.getIdInput()).toEqual(id);
    }
  });

  it('should delete last ChipsCollectionChips', async () => {
    chipsCollectionChipsDetailPage = new ChipsCollectionChipsDetailPage();
    if (isVisible && (await chipsCollectionChipsDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await chipsCollectionChipsDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(chipsCollectionChipsComponentsPage.title), 3000);
      expect(await chipsCollectionChipsComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await chipsCollectionChipsComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish ChipsCollectionChips tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
