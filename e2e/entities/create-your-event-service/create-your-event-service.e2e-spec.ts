import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import {
  CreateYourEventServiceComponentsPage,
  CreateYourEventServiceDetailPage,
  CreateYourEventServiceUpdatePage,
} from './create-your-event-service.po';

describe('CreateYourEventService e2e test', () => {
  let loginPage: LoginPage;
  let createYourEventServiceComponentsPage: CreateYourEventServiceComponentsPage;
  let createYourEventServiceUpdatePage: CreateYourEventServiceUpdatePage;
  let createYourEventServiceDetailPage: CreateYourEventServiceDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Create Your Event Services';
  const SUBCOMPONENT_TITLE = 'Create Your Event Service';
  let lastElement: any;
  let isVisible = false;

  const id = '10';
  const name = 'name';
  const description = 'description';
  const address = 'address';
  const motto = 'motto';
  const phone = 'phone';
  const webAddress = 'webAddress';

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

  it('should load CreateYourEventServices', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'CreateYourEventService')
      .first()
      .click();

    createYourEventServiceComponentsPage = new CreateYourEventServiceComponentsPage();
    await browser.wait(ec.visibilityOf(createYourEventServiceComponentsPage.title), 5000);
    expect(await createYourEventServiceComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(
        ec.visibilityOf(createYourEventServiceComponentsPage.entities.get(0)),
        ec.visibilityOf(createYourEventServiceComponentsPage.noResult)
      ),
      5000
    );
  });

  it('should create CreateYourEventService', async () => {
    initNumberOfEntities = await createYourEventServiceComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(createYourEventServiceComponentsPage.createButton), 5000);
    await createYourEventServiceComponentsPage.clickOnCreateButton();
    createYourEventServiceUpdatePage = new CreateYourEventServiceUpdatePage();
    await browser.wait(ec.visibilityOf(createYourEventServiceUpdatePage.pageTitle), 3000);
    expect(await createYourEventServiceUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await createYourEventServiceUpdatePage.setNameInput(name);
    await createYourEventServiceUpdatePage.setLogoInput(logo);
    await createYourEventServiceUpdatePage.setDescriptionInput(description);
    await createYourEventServiceUpdatePage.setAddressInput(address);
    await createYourEventServiceUpdatePage.setMottoInput(motto);
    await createYourEventServiceUpdatePage.setPhoneInput(phone);
    await createYourEventServiceUpdatePage.setWebAddressInput(webAddress);
    await createYourEventServiceUpdatePage.categorySelectLastOption();

    await createYourEventServiceUpdatePage.save();
    await browser.wait(ec.visibilityOf(createYourEventServiceComponentsPage.title), 3000);
    expect(await createYourEventServiceComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await createYourEventServiceComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last CreateYourEventService', async () => {
    createYourEventServiceComponentsPage = new CreateYourEventServiceComponentsPage();
    await browser.wait(ec.visibilityOf(createYourEventServiceComponentsPage.title), 5000);
    lastElement = await createYourEventServiceComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last CreateYourEventService', async () => {
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

  it('should view the last CreateYourEventService', async () => {
    createYourEventServiceDetailPage = new CreateYourEventServiceDetailPage();
    if (isVisible && (await createYourEventServiceDetailPage.pageTitle.isDisplayed())) {
      expect(await createYourEventServiceDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await createYourEventServiceDetailPage.getIdInput()).toEqual(id);

      expect(await createYourEventServiceDetailPage.getNameInput()).toEqual(name);

      expect(await createYourEventServiceDetailPage.getLogoInput()).toEqual(logo);

      expect(await createYourEventServiceDetailPage.getDescriptionInput()).toEqual(description);

      expect(await createYourEventServiceDetailPage.getAddressInput()).toEqual(address);

      expect(await createYourEventServiceDetailPage.getMottoInput()).toEqual(motto);

      expect(await createYourEventServiceDetailPage.getPhoneInput()).toEqual(phone);

      expect(await createYourEventServiceDetailPage.getWebAddressInput()).toEqual(webAddress);
    }
  });

  it('should delete last CreateYourEventService', async () => {
    createYourEventServiceDetailPage = new CreateYourEventServiceDetailPage();
    if (isVisible && (await createYourEventServiceDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await createYourEventServiceDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(createYourEventServiceComponentsPage.title), 3000);
      expect(await createYourEventServiceComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await createYourEventServiceComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish CreateYourEventServices tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
