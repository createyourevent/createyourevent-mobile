import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { ContactComponentsPage, ContactDetailPage, ContactUpdatePage } from './contact.po';

describe('Contact e2e test', () => {
  let loginPage: LoginPage;
  let contactComponentsPage: ContactComponentsPage;
  let contactUpdatePage: ContactUpdatePage;
  let contactDetailPage: ContactDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Contacts';
  const SUBCOMPONENT_TITLE = 'Contact';
  let lastElement: any;
  let isVisible = false;

  const id = '10';
  const name = 'name';
  const email = 'email';
  const message = 'message';

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

  it('should load Contacts', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'Contact')
      .first()
      .click();

    contactComponentsPage = new ContactComponentsPage();
    await browser.wait(ec.visibilityOf(contactComponentsPage.title), 5000);
    expect(await contactComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(ec.visibilityOf(contactComponentsPage.entities.get(0)), ec.visibilityOf(contactComponentsPage.noResult)),
      5000
    );
  });

  it('should create Contact', async () => {
    initNumberOfEntities = await contactComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(contactComponentsPage.createButton), 5000);
    await contactComponentsPage.clickOnCreateButton();
    contactUpdatePage = new ContactUpdatePage();
    await browser.wait(ec.visibilityOf(contactUpdatePage.pageTitle), 3000);
    expect(await contactUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await contactUpdatePage.setNameInput(name);
    await contactUpdatePage.setEmailInput(email);
    await contactUpdatePage.setMessageInput(message);

    await contactUpdatePage.save();
    await browser.wait(ec.visibilityOf(contactComponentsPage.title), 3000);
    expect(await contactComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await contactComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last Contact', async () => {
    contactComponentsPage = new ContactComponentsPage();
    await browser.wait(ec.visibilityOf(contactComponentsPage.title), 5000);
    lastElement = await contactComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last Contact', async () => {
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

  it('should view the last Contact', async () => {
    contactDetailPage = new ContactDetailPage();
    if (isVisible && (await contactDetailPage.pageTitle.isDisplayed())) {
      expect(await contactDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await contactDetailPage.getIdInput()).toEqual(id);

      expect(await contactDetailPage.getNameInput()).toEqual(name);

      expect(await contactDetailPage.getEmailInput()).toEqual(email);

      expect(await contactDetailPage.getMessageInput()).toEqual(message);
    }
  });

  it('should delete last Contact', async () => {
    contactDetailPage = new ContactDetailPage();
    if (isVisible && (await contactDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await contactDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(contactComponentsPage.title), 3000);
      expect(await contactComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await contactComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish Contacts tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
