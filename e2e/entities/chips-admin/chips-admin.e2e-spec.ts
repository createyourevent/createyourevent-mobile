import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { ChipsAdminComponentsPage, ChipsAdminDetailPage, ChipsAdminUpdatePage } from './chips-admin.po';

describe('ChipsAdmin e2e test', () => {
  let loginPage: LoginPage;
  let chipsAdminComponentsPage: ChipsAdminComponentsPage;
  let chipsAdminUpdatePage: ChipsAdminUpdatePage;
  let chipsAdminDetailPage: ChipsAdminDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Chips Admins';
  const SUBCOMPONENT_TITLE = 'Chips Admin';
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

  it('should load ChipsAdmins', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'ChipsAdmin')
      .first()
      .click();

    chipsAdminComponentsPage = new ChipsAdminComponentsPage();
    await browser.wait(ec.visibilityOf(chipsAdminComponentsPage.title), 5000);
    expect(await chipsAdminComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(ec.visibilityOf(chipsAdminComponentsPage.entities.get(0)), ec.visibilityOf(chipsAdminComponentsPage.noResult)),
      5000
    );
  });

  it('should create ChipsAdmin', async () => {
    initNumberOfEntities = await chipsAdminComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(chipsAdminComponentsPage.createButton), 5000);
    await chipsAdminComponentsPage.clickOnCreateButton();
    chipsAdminUpdatePage = new ChipsAdminUpdatePage();
    await browser.wait(ec.visibilityOf(chipsAdminUpdatePage.pageTitle), 3000);
    expect(await chipsAdminUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await chipsAdminUpdatePage.save();
    await browser.wait(ec.visibilityOf(chipsAdminComponentsPage.title), 3000);
    expect(await chipsAdminComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await chipsAdminComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last ChipsAdmin', async () => {
    chipsAdminComponentsPage = new ChipsAdminComponentsPage();
    await browser.wait(ec.visibilityOf(chipsAdminComponentsPage.title), 5000);
    lastElement = await chipsAdminComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last ChipsAdmin', async () => {
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

  it('should view the last ChipsAdmin', async () => {
    chipsAdminDetailPage = new ChipsAdminDetailPage();
    if (isVisible && (await chipsAdminDetailPage.pageTitle.isDisplayed())) {
      expect(await chipsAdminDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await chipsAdminDetailPage.getIdInput()).toEqual(id);
    }
  });

  it('should delete last ChipsAdmin', async () => {
    chipsAdminDetailPage = new ChipsAdminDetailPage();
    if (isVisible && (await chipsAdminDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await chipsAdminDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(chipsAdminComponentsPage.title), 3000);
      expect(await chipsAdminComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await chipsAdminComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish ChipsAdmins tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
