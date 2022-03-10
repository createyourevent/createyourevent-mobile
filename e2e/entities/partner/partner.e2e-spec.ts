import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { PartnerComponentsPage, PartnerDetailPage, PartnerUpdatePage } from './partner.po';

describe('Partner e2e test', () => {
  let loginPage: LoginPage;
  let partnerComponentsPage: PartnerComponentsPage;
  let partnerUpdatePage: PartnerUpdatePage;
  let partnerDetailPage: PartnerDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Partners';
  const SUBCOMPONENT_TITLE = 'Partner';
  let lastElement: any;
  let isVisible = false;

  const id = '10';
  const name = 'name';
  const address = 'address';
  const phone = 'phone';
  const mail = 'mail';
  const webaddress = 'webaddress';
  const sponsorshipAmount = '10';

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

  it('should load Partners', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'Partner')
      .first()
      .click();

    partnerComponentsPage = new PartnerComponentsPage();
    await browser.wait(ec.visibilityOf(partnerComponentsPage.title), 5000);
    expect(await partnerComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(ec.visibilityOf(partnerComponentsPage.entities.get(0)), ec.visibilityOf(partnerComponentsPage.noResult)),
      5000
    );
  });

  it('should create Partner', async () => {
    initNumberOfEntities = await partnerComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(partnerComponentsPage.createButton), 5000);
    await partnerComponentsPage.clickOnCreateButton();
    partnerUpdatePage = new PartnerUpdatePage();
    await browser.wait(ec.visibilityOf(partnerUpdatePage.pageTitle), 3000);
    expect(await partnerUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await partnerUpdatePage.setNameInput(name);
    await partnerUpdatePage.setAddressInput(address);
    await partnerUpdatePage.setPhoneInput(phone);
    await partnerUpdatePage.setLogoInput(logo);
    await partnerUpdatePage.setMailInput(mail);
    await partnerUpdatePage.setWebaddressInput(webaddress);
    await partnerUpdatePage.setSponsorshipAmountInput(sponsorshipAmount);

    await partnerUpdatePage.save();
    await browser.wait(ec.visibilityOf(partnerComponentsPage.title), 3000);
    expect(await partnerComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await partnerComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last Partner', async () => {
    partnerComponentsPage = new PartnerComponentsPage();
    await browser.wait(ec.visibilityOf(partnerComponentsPage.title), 5000);
    lastElement = await partnerComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last Partner', async () => {
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

  it('should view the last Partner', async () => {
    partnerDetailPage = new PartnerDetailPage();
    if (isVisible && (await partnerDetailPage.pageTitle.isDisplayed())) {
      expect(await partnerDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await partnerDetailPage.getIdInput()).toEqual(id);

      expect(await partnerDetailPage.getNameInput()).toEqual(name);

      expect(await partnerDetailPage.getAddressInput()).toEqual(address);

      expect(await partnerDetailPage.getPhoneInput()).toEqual(phone);

      expect(await partnerDetailPage.getLogoInput()).toEqual(logo);

      expect(await partnerDetailPage.getMailInput()).toEqual(mail);

      expect(await partnerDetailPage.getWebaddressInput()).toEqual(webaddress);

      expect(await partnerDetailPage.getSponsorshipAmountInput()).toEqual(sponsorshipAmount);
    }
  });

  it('should delete last Partner', async () => {
    partnerDetailPage = new PartnerDetailPage();
    if (isVisible && (await partnerDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await partnerDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(partnerComponentsPage.title), 3000);
      expect(await partnerComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await partnerComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish Partners tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
