import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { ServiceMapComponentsPage, ServiceMapDetailPage, ServiceMapUpdatePage } from './service-map.po';

describe('ServiceMap e2e test', () => {
  let loginPage: LoginPage;
  let serviceMapComponentsPage: ServiceMapComponentsPage;
  let serviceMapUpdatePage: ServiceMapUpdatePage;
  let serviceMapDetailPage: ServiceMapDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Service Maps';
  const SUBCOMPONENT_TITLE = 'Service Map';
  let lastElement: any;
  let isVisible = false;

  const id = '10';
  const title = 'title';

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

  it('should load ServiceMaps', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'ServiceMap')
      .first()
      .click();

    serviceMapComponentsPage = new ServiceMapComponentsPage();
    await browser.wait(ec.visibilityOf(serviceMapComponentsPage.title), 5000);
    expect(await serviceMapComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(ec.visibilityOf(serviceMapComponentsPage.entities.get(0)), ec.visibilityOf(serviceMapComponentsPage.noResult)),
      5000
    );
  });

  it('should create ServiceMap', async () => {
    initNumberOfEntities = await serviceMapComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(serviceMapComponentsPage.createButton), 5000);
    await serviceMapComponentsPage.clickOnCreateButton();
    serviceMapUpdatePage = new ServiceMapUpdatePage();
    await browser.wait(ec.visibilityOf(serviceMapUpdatePage.pageTitle), 3000);
    expect(await serviceMapUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await serviceMapUpdatePage.setTitleInput(title);

    await serviceMapUpdatePage.save();
    await browser.wait(ec.visibilityOf(serviceMapComponentsPage.title), 3000);
    expect(await serviceMapComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await serviceMapComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last ServiceMap', async () => {
    serviceMapComponentsPage = new ServiceMapComponentsPage();
    await browser.wait(ec.visibilityOf(serviceMapComponentsPage.title), 5000);
    lastElement = await serviceMapComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last ServiceMap', async () => {
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

  it('should view the last ServiceMap', async () => {
    serviceMapDetailPage = new ServiceMapDetailPage();
    if (isVisible && (await serviceMapDetailPage.pageTitle.isDisplayed())) {
      expect(await serviceMapDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await serviceMapDetailPage.getIdInput()).toEqual(id);

      expect(await serviceMapDetailPage.getTitleInput()).toEqual(title);
    }
  });

  it('should delete last ServiceMap', async () => {
    serviceMapDetailPage = new ServiceMapDetailPage();
    if (isVisible && (await serviceMapDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await serviceMapDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(serviceMapComponentsPage.title), 3000);
      expect(await serviceMapComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await serviceMapComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish ServiceMaps tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
