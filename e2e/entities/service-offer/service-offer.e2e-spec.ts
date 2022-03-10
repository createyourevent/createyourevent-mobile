import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { ServiceOfferComponentsPage, ServiceOfferDetailPage, ServiceOfferUpdatePage } from './service-offer.po';

describe('ServiceOffer e2e test', () => {
  let loginPage: LoginPage;
  let serviceOfferComponentsPage: ServiceOfferComponentsPage;
  let serviceOfferUpdatePage: ServiceOfferUpdatePage;
  let serviceOfferDetailPage: ServiceOfferDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Service Offers';
  const SUBCOMPONENT_TITLE = 'Service Offer';
  let lastElement: any;
  let isVisible = false;

  const id = '10';
  const title = 'title';
  const description = 'description';
  const costHour = '10';

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

  it('should load ServiceOffers', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'ServiceOffer')
      .first()
      .click();

    serviceOfferComponentsPage = new ServiceOfferComponentsPage();
    await browser.wait(ec.visibilityOf(serviceOfferComponentsPage.title), 5000);
    expect(await serviceOfferComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(ec.visibilityOf(serviceOfferComponentsPage.entities.get(0)), ec.visibilityOf(serviceOfferComponentsPage.noResult)),
      5000
    );
  });

  it('should create ServiceOffer', async () => {
    initNumberOfEntities = await serviceOfferComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(serviceOfferComponentsPage.createButton), 5000);
    await serviceOfferComponentsPage.clickOnCreateButton();
    serviceOfferUpdatePage = new ServiceOfferUpdatePage();
    await browser.wait(ec.visibilityOf(serviceOfferUpdatePage.pageTitle), 3000);
    expect(await serviceOfferUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await serviceOfferUpdatePage.setTitleInput(title);
    await serviceOfferUpdatePage.setDescriptionInput(description);
    await serviceOfferUpdatePage.setCostHourInput(costHour);

    await serviceOfferUpdatePage.save();
    await browser.wait(ec.visibilityOf(serviceOfferComponentsPage.title), 3000);
    expect(await serviceOfferComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await serviceOfferComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last ServiceOffer', async () => {
    serviceOfferComponentsPage = new ServiceOfferComponentsPage();
    await browser.wait(ec.visibilityOf(serviceOfferComponentsPage.title), 5000);
    lastElement = await serviceOfferComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last ServiceOffer', async () => {
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

  it('should view the last ServiceOffer', async () => {
    serviceOfferDetailPage = new ServiceOfferDetailPage();
    if (isVisible && (await serviceOfferDetailPage.pageTitle.isDisplayed())) {
      expect(await serviceOfferDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await serviceOfferDetailPage.getIdInput()).toEqual(id);

      expect(await serviceOfferDetailPage.getTitleInput()).toEqual(title);

      expect(await serviceOfferDetailPage.getDescriptionInput()).toEqual(description);

      expect(await serviceOfferDetailPage.getCostHourInput()).toEqual(costHour);
    }
  });

  it('should delete last ServiceOffer', async () => {
    serviceOfferDetailPage = new ServiceOfferDetailPage();
    if (isVisible && (await serviceOfferDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await serviceOfferDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(serviceOfferComponentsPage.title), 3000);
      expect(await serviceOfferComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await serviceOfferComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish ServiceOffers tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
