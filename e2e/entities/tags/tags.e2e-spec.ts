import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { TagsComponentsPage, TagsDetailPage, TagsUpdatePage } from './tags.po';

describe('Tags e2e test', () => {
  let loginPage: LoginPage;
  let tagsComponentsPage: TagsComponentsPage;
  let tagsUpdatePage: TagsUpdatePage;
  let tagsDetailPage: TagsDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Tags';
  const SUBCOMPONENT_TITLE = 'Tags';
  let lastElement: any;
  let isVisible = false;

  const id = '10';
  const tag = 'tag';

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

  it('should load Tags', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'Tags')
      .first()
      .click();

    tagsComponentsPage = new TagsComponentsPage();
    await browser.wait(ec.visibilityOf(tagsComponentsPage.title), 5000);
    expect(await tagsComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(ec.or(ec.visibilityOf(tagsComponentsPage.entities.get(0)), ec.visibilityOf(tagsComponentsPage.noResult)), 5000);
  });

  it('should create Tags', async () => {
    initNumberOfEntities = await tagsComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(tagsComponentsPage.createButton), 5000);
    await tagsComponentsPage.clickOnCreateButton();
    tagsUpdatePage = new TagsUpdatePage();
    await browser.wait(ec.visibilityOf(tagsUpdatePage.pageTitle), 3000);
    expect(await tagsUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await tagsUpdatePage.setTagInput(tag);

    await tagsUpdatePage.save();
    await browser.wait(ec.visibilityOf(tagsComponentsPage.title), 3000);
    expect(await tagsComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await tagsComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last Tags', async () => {
    tagsComponentsPage = new TagsComponentsPage();
    await browser.wait(ec.visibilityOf(tagsComponentsPage.title), 5000);
    lastElement = await tagsComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last Tags', async () => {
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

  it('should view the last Tags', async () => {
    tagsDetailPage = new TagsDetailPage();
    if (isVisible && (await tagsDetailPage.pageTitle.isDisplayed())) {
      expect(await tagsDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await tagsDetailPage.getIdInput()).toEqual(id);

      expect(await tagsDetailPage.getTagInput()).toEqual(tag);
    }
  });

  it('should delete last Tags', async () => {
    tagsDetailPage = new TagsDetailPage();
    if (isVisible && (await tagsDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await tagsDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(tagsComponentsPage.title), 3000);
      expect(await tagsComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await tagsComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish Tags tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
