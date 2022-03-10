import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { OrganizationCommentComponentsPage, OrganizationCommentDetailPage, OrganizationCommentUpdatePage } from './organization-comment.po';

describe('OrganizationComment e2e test', () => {
  let loginPage: LoginPage;
  let organizationCommentComponentsPage: OrganizationCommentComponentsPage;
  let organizationCommentUpdatePage: OrganizationCommentUpdatePage;
  let organizationCommentDetailPage: OrganizationCommentDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Organization Comments';
  const SUBCOMPONENT_TITLE = 'Organization Comment';
  let lastElement: any;
  let isVisible = false;

  const id = '10';
  const comment = 'comment';

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

  it('should load OrganizationComments', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'OrganizationComment')
      .first()
      .click();

    organizationCommentComponentsPage = new OrganizationCommentComponentsPage();
    await browser.wait(ec.visibilityOf(organizationCommentComponentsPage.title), 5000);
    expect(await organizationCommentComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(
        ec.visibilityOf(organizationCommentComponentsPage.entities.get(0)),
        ec.visibilityOf(organizationCommentComponentsPage.noResult)
      ),
      5000
    );
  });

  it('should create OrganizationComment', async () => {
    initNumberOfEntities = await organizationCommentComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(organizationCommentComponentsPage.createButton), 5000);
    await organizationCommentComponentsPage.clickOnCreateButton();
    organizationCommentUpdatePage = new OrganizationCommentUpdatePage();
    await browser.wait(ec.visibilityOf(organizationCommentUpdatePage.pageTitle), 3000);
    expect(await organizationCommentUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await organizationCommentUpdatePage.setCommentInput(comment);

    await organizationCommentUpdatePage.save();
    await browser.wait(ec.visibilityOf(organizationCommentComponentsPage.title), 3000);
    expect(await organizationCommentComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await organizationCommentComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last OrganizationComment', async () => {
    organizationCommentComponentsPage = new OrganizationCommentComponentsPage();
    await browser.wait(ec.visibilityOf(organizationCommentComponentsPage.title), 5000);
    lastElement = await organizationCommentComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last OrganizationComment', async () => {
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

  it('should view the last OrganizationComment', async () => {
    organizationCommentDetailPage = new OrganizationCommentDetailPage();
    if (isVisible && (await organizationCommentDetailPage.pageTitle.isDisplayed())) {
      expect(await organizationCommentDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await organizationCommentDetailPage.getIdInput()).toEqual(id);

      expect(await organizationCommentDetailPage.getCommentInput()).toEqual(comment);
    }
  });

  it('should delete last OrganizationComment', async () => {
    organizationCommentDetailPage = new OrganizationCommentDetailPage();
    if (isVisible && (await organizationCommentDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await organizationCommentDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(organizationCommentComponentsPage.title), 3000);
      expect(await organizationCommentComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await organizationCommentComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish OrganizationComments tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
