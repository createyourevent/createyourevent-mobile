import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import {
  UserPointAssociationComponentsPage,
  UserPointAssociationDetailPage,
  UserPointAssociationUpdatePage,
} from './user-point-association.po';

describe('UserPointAssociation e2e test', () => {
  let loginPage: LoginPage;
  let userPointAssociationComponentsPage: UserPointAssociationComponentsPage;
  let userPointAssociationUpdatePage: UserPointAssociationUpdatePage;
  let userPointAssociationDetailPage: UserPointAssociationDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'User Point Associations';
  const SUBCOMPONENT_TITLE = 'User Point Association';
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

  it('should load UserPointAssociations', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'UserPointAssociation')
      .first()
      .click();

    userPointAssociationComponentsPage = new UserPointAssociationComponentsPage();
    await browser.wait(ec.visibilityOf(userPointAssociationComponentsPage.title), 5000);
    expect(await userPointAssociationComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(
        ec.visibilityOf(userPointAssociationComponentsPage.entities.get(0)),
        ec.visibilityOf(userPointAssociationComponentsPage.noResult)
      ),
      5000
    );
  });

  it('should create UserPointAssociation', async () => {
    initNumberOfEntities = await userPointAssociationComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(userPointAssociationComponentsPage.createButton), 5000);
    await userPointAssociationComponentsPage.clickOnCreateButton();
    userPointAssociationUpdatePage = new UserPointAssociationUpdatePage();
    await browser.wait(ec.visibilityOf(userPointAssociationUpdatePage.pageTitle), 3000);
    expect(await userPointAssociationUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await userPointAssociationUpdatePage.save();
    await browser.wait(ec.visibilityOf(userPointAssociationComponentsPage.title), 3000);
    expect(await userPointAssociationComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await userPointAssociationComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last UserPointAssociation', async () => {
    userPointAssociationComponentsPage = new UserPointAssociationComponentsPage();
    await browser.wait(ec.visibilityOf(userPointAssociationComponentsPage.title), 5000);
    lastElement = await userPointAssociationComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last UserPointAssociation', async () => {
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

  it('should view the last UserPointAssociation', async () => {
    userPointAssociationDetailPage = new UserPointAssociationDetailPage();
    if (isVisible && (await userPointAssociationDetailPage.pageTitle.isDisplayed())) {
      expect(await userPointAssociationDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await userPointAssociationDetailPage.getIdInput()).toEqual(id);
    }
  });

  it('should delete last UserPointAssociation', async () => {
    userPointAssociationDetailPage = new UserPointAssociationDetailPage();
    if (isVisible && (await userPointAssociationDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await userPointAssociationDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(userPointAssociationComponentsPage.title), 3000);
      expect(await userPointAssociationComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await userPointAssociationComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish UserPointAssociations tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
