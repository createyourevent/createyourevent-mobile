import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { ImageComponentsPage, ImageDetailPage, ImageUpdatePage } from './image.po';

describe('Image e2e test', () => {
  let loginPage: LoginPage;
  let imageComponentsPage: ImageComponentsPage;
  let imageUpdatePage: ImageUpdatePage;
  let imageDetailPage: ImageDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Images';
  const SUBCOMPONENT_TITLE = 'Image';
  let lastElement: any;
  let isVisible = false;

  const id = '10';
  const name = 'name';

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

  it('should load Images', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'Image')
      .first()
      .click();

    imageComponentsPage = new ImageComponentsPage();
    await browser.wait(ec.visibilityOf(imageComponentsPage.title), 5000);
    expect(await imageComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(ec.or(ec.visibilityOf(imageComponentsPage.entities.get(0)), ec.visibilityOf(imageComponentsPage.noResult)), 5000);
  });

  it('should create Image', async () => {
    initNumberOfEntities = await imageComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(imageComponentsPage.createButton), 5000);
    await imageComponentsPage.clickOnCreateButton();
    imageUpdatePage = new ImageUpdatePage();
    await browser.wait(ec.visibilityOf(imageUpdatePage.pageTitle), 3000);
    expect(await imageUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await imageUpdatePage.setNameInput(name);
    await imageUpdatePage.setImageInput(image);

    await imageUpdatePage.save();
    await browser.wait(ec.visibilityOf(imageComponentsPage.title), 3000);
    expect(await imageComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await imageComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last Image', async () => {
    imageComponentsPage = new ImageComponentsPage();
    await browser.wait(ec.visibilityOf(imageComponentsPage.title), 5000);
    lastElement = await imageComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last Image', async () => {
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

  it('should view the last Image', async () => {
    imageDetailPage = new ImageDetailPage();
    if (isVisible && (await imageDetailPage.pageTitle.isDisplayed())) {
      expect(await imageDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await imageDetailPage.getIdInput()).toEqual(id);

      expect(await imageDetailPage.getNameInput()).toEqual(name);

      expect(await imageDetailPage.getImageInput()).toEqual(image);
    }
  });

  it('should delete last Image', async () => {
    imageDetailPage = new ImageDetailPage();
    if (isVisible && (await imageDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await imageDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(imageComponentsPage.title), 3000);
      expect(await imageComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await imageComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish Images tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
