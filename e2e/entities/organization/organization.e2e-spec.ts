import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { OrganizationComponentsPage, OrganizationDetailPage, OrganizationUpdatePage } from './organization.po';

describe('Organization e2e test', () => {
  let loginPage: LoginPage;
  let organizationComponentsPage: OrganizationComponentsPage;
  let organizationUpdatePage: OrganizationUpdatePage;
  let organizationDetailPage: OrganizationDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Organizations';
  const SUBCOMPONENT_TITLE = 'Organization';
  let lastElement: any;
  let isVisible = false;

  const id = '10';
  const name = 'name';
  const description = 'description';
  const address = 'address';
  const motto = 'motto';
  const phone = 'phone';
  const webAddress = 'webAddress';
  const placeNumber = '10';
  const price = '10';

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

  it('should load Organizations', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'Organization')
      .first()
      .click();

    organizationComponentsPage = new OrganizationComponentsPage();
    await browser.wait(ec.visibilityOf(organizationComponentsPage.title), 5000);
    expect(await organizationComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(ec.visibilityOf(organizationComponentsPage.entities.get(0)), ec.visibilityOf(organizationComponentsPage.noResult)),
      5000
    );
  });

  it('should create Organization', async () => {
    initNumberOfEntities = await organizationComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(organizationComponentsPage.createButton), 5000);
    await organizationComponentsPage.clickOnCreateButton();
    organizationUpdatePage = new OrganizationUpdatePage();
    await browser.wait(ec.visibilityOf(organizationUpdatePage.pageTitle), 3000);
    expect(await organizationUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await organizationUpdatePage.setNameInput(name);
    await organizationUpdatePage.organizationTypeSelectLastOption();
    await organizationUpdatePage.setLogoInput(logo);
    await organizationUpdatePage.setDescriptionInput(description);
    await organizationUpdatePage.setAddressInput(address);
    await organizationUpdatePage.setMottoInput(motto);
    await organizationUpdatePage.setPhoneInput(phone);
    await organizationUpdatePage.setWebAddressInput(webAddress);
    await organizationUpdatePage.setPlaceNumberInput(placeNumber);
    await organizationUpdatePage.setPriceInput(price);
    await organizationUpdatePage.rentTypeSelectLastOption();

    await organizationUpdatePage.save();
    await browser.wait(ec.visibilityOf(organizationComponentsPage.title), 3000);
    expect(await organizationComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await organizationComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last Organization', async () => {
    organizationComponentsPage = new OrganizationComponentsPage();
    await browser.wait(ec.visibilityOf(organizationComponentsPage.title), 5000);
    lastElement = await organizationComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last Organization', async () => {
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

  it('should view the last Organization', async () => {
    organizationDetailPage = new OrganizationDetailPage();
    if (isVisible && (await organizationDetailPage.pageTitle.isDisplayed())) {
      expect(await organizationDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await organizationDetailPage.getIdInput()).toEqual(id);

      expect(await organizationDetailPage.getNameInput()).toEqual(name);

      expect(await organizationDetailPage.getLogoInput()).toEqual(logo);

      expect(await organizationDetailPage.getDescriptionInput()).toEqual(description);

      expect(await organizationDetailPage.getAddressInput()).toEqual(address);

      expect(await organizationDetailPage.getMottoInput()).toEqual(motto);

      expect(await organizationDetailPage.getPhoneInput()).toEqual(phone);

      expect(await organizationDetailPage.getWebAddressInput()).toEqual(webAddress);

      expect(await organizationDetailPage.getPlaceNumberInput()).toEqual(placeNumber);

      expect(await organizationDetailPage.getPriceInput()).toEqual(price);
    }
  });

  it('should delete last Organization', async () => {
    organizationDetailPage = new OrganizationDetailPage();
    if (isVisible && (await organizationDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await organizationDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(organizationComponentsPage.title), 3000);
      expect(await organizationComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await organizationComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish Organizations tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
