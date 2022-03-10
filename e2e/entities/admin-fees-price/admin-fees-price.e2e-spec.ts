import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { AdminFeesPriceComponentsPage, AdminFeesPriceDetailPage, AdminFeesPriceUpdatePage } from './admin-fees-price.po';

describe('AdminFeesPrice e2e test', () => {
  let loginPage: LoginPage;
  let adminFeesPriceComponentsPage: AdminFeesPriceComponentsPage;
  let adminFeesPriceUpdatePage: AdminFeesPriceUpdatePage;
  let adminFeesPriceDetailPage: AdminFeesPriceDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Admin Fees Prices';
  const SUBCOMPONENT_TITLE = 'Admin Fees Price';
  let lastElement: any;
  let isVisible = false;

  const id = '10';
  const feesOrganisator = '10';
  const feesSupplier = '10';
  const feesService = '10';
  const feesOrganizations = '10';

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

  it('should load AdminFeesPrices', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'AdminFeesPrice')
      .first()
      .click();

    adminFeesPriceComponentsPage = new AdminFeesPriceComponentsPage();
    await browser.wait(ec.visibilityOf(adminFeesPriceComponentsPage.title), 5000);
    expect(await adminFeesPriceComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(ec.visibilityOf(adminFeesPriceComponentsPage.entities.get(0)), ec.visibilityOf(adminFeesPriceComponentsPage.noResult)),
      5000
    );
  });

  it('should create AdminFeesPrice', async () => {
    initNumberOfEntities = await adminFeesPriceComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(adminFeesPriceComponentsPage.createButton), 5000);
    await adminFeesPriceComponentsPage.clickOnCreateButton();
    adminFeesPriceUpdatePage = new AdminFeesPriceUpdatePage();
    await browser.wait(ec.visibilityOf(adminFeesPriceUpdatePage.pageTitle), 3000);
    expect(await adminFeesPriceUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await adminFeesPriceUpdatePage.setFeesOrganisatorInput(feesOrganisator);
    await adminFeesPriceUpdatePage.setFeesSupplierInput(feesSupplier);
    await adminFeesPriceUpdatePage.setFeesServiceInput(feesService);
    await adminFeesPriceUpdatePage.setFeesOrganizationsInput(feesOrganizations);

    await adminFeesPriceUpdatePage.save();
    await browser.wait(ec.visibilityOf(adminFeesPriceComponentsPage.title), 3000);
    expect(await adminFeesPriceComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await adminFeesPriceComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last AdminFeesPrice', async () => {
    adminFeesPriceComponentsPage = new AdminFeesPriceComponentsPage();
    await browser.wait(ec.visibilityOf(adminFeesPriceComponentsPage.title), 5000);
    lastElement = await adminFeesPriceComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last AdminFeesPrice', async () => {
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

  it('should view the last AdminFeesPrice', async () => {
    adminFeesPriceDetailPage = new AdminFeesPriceDetailPage();
    if (isVisible && (await adminFeesPriceDetailPage.pageTitle.isDisplayed())) {
      expect(await adminFeesPriceDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await adminFeesPriceDetailPage.getIdInput()).toEqual(id);

      expect(await adminFeesPriceDetailPage.getFeesOrganisatorInput()).toEqual(feesOrganisator);

      expect(await adminFeesPriceDetailPage.getFeesSupplierInput()).toEqual(feesSupplier);

      expect(await adminFeesPriceDetailPage.getFeesServiceInput()).toEqual(feesService);

      expect(await adminFeesPriceDetailPage.getFeesOrganizationsInput()).toEqual(feesOrganizations);
    }
  });

  it('should delete last AdminFeesPrice', async () => {
    adminFeesPriceDetailPage = new AdminFeesPriceDetailPage();
    if (isVisible && (await adminFeesPriceDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await adminFeesPriceDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(adminFeesPriceComponentsPage.title), 3000);
      expect(await adminFeesPriceComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await adminFeesPriceComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish AdminFeesPrices tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
