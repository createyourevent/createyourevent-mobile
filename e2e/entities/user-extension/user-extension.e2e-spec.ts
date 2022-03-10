import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { UserExtensionComponentsPage, UserExtensionDetailPage, UserExtensionUpdatePage } from './user-extension.po';

describe('UserExtension e2e test', () => {
  let loginPage: LoginPage;
  let userExtensionComponentsPage: UserExtensionComponentsPage;
  let userExtensionUpdatePage: UserExtensionUpdatePage;
  let userExtensionDetailPage: UserExtensionDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'User Extensions';
  const SUBCOMPONENT_TITLE = 'User Extension';
  let lastElement: any;
  let isVisible = false;

  const id = '10';
  const address = 'address';
  const phone = 'phone';
  const points = '10';

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

  it('should load UserExtensions', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'UserExtension')
      .first()
      .click();

    userExtensionComponentsPage = new UserExtensionComponentsPage();
    await browser.wait(ec.visibilityOf(userExtensionComponentsPage.title), 5000);
    expect(await userExtensionComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(ec.visibilityOf(userExtensionComponentsPage.entities.get(0)), ec.visibilityOf(userExtensionComponentsPage.noResult)),
      5000
    );
  });

  it('should create UserExtension', async () => {
    initNumberOfEntities = await userExtensionComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(userExtensionComponentsPage.createButton), 5000);
    await userExtensionComponentsPage.clickOnCreateButton();
    userExtensionUpdatePage = new UserExtensionUpdatePage();
    await browser.wait(ec.visibilityOf(userExtensionUpdatePage.pageTitle), 3000);
    expect(await userExtensionUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await userExtensionUpdatePage.setAddressInput(address);
    await userExtensionUpdatePage.setPhoneInput(phone);
    await userExtensionUpdatePage.setPointsInput(points);

    await userExtensionUpdatePage.save();
    await browser.wait(ec.visibilityOf(userExtensionComponentsPage.title), 3000);
    expect(await userExtensionComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await userExtensionComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last UserExtension', async () => {
    userExtensionComponentsPage = new UserExtensionComponentsPage();
    await browser.wait(ec.visibilityOf(userExtensionComponentsPage.title), 5000);
    lastElement = await userExtensionComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last UserExtension', async () => {
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

  it('should view the last UserExtension', async () => {
    userExtensionDetailPage = new UserExtensionDetailPage();
    if (isVisible && (await userExtensionDetailPage.pageTitle.isDisplayed())) {
      expect(await userExtensionDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await userExtensionDetailPage.getIdInput()).toEqual(id);

      expect(await userExtensionDetailPage.getAddressInput()).toEqual(address);

      expect(await userExtensionDetailPage.getPhoneInput()).toEqual(phone);

      expect(await userExtensionDetailPage.getPointsInput()).toEqual(points);
    }
  });

  it('should delete last UserExtension', async () => {
    userExtensionDetailPage = new UserExtensionDetailPage();
    if (isVisible && (await userExtensionDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await userExtensionDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(userExtensionComponentsPage.title), 3000);
      expect(await userExtensionComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await userExtensionComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish UserExtensions tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
