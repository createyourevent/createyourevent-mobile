import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { WorksheetComponentsPage, WorksheetDetailPage, WorksheetUpdatePage } from './worksheet.po';

describe('Worksheet e2e test', () => {
  let loginPage: LoginPage;
  let worksheetComponentsPage: WorksheetComponentsPage;
  let worksheetUpdatePage: WorksheetUpdatePage;
  let worksheetDetailPage: WorksheetDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Worksheets';
  const SUBCOMPONENT_TITLE = 'Worksheet';
  let lastElement: any;
  let isVisible = false;

  const id = '10';
  const description = 'description';
  const costHour = '10';
  const total = '10';

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

  it('should load Worksheets', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'Worksheet')
      .first()
      .click();

    worksheetComponentsPage = new WorksheetComponentsPage();
    await browser.wait(ec.visibilityOf(worksheetComponentsPage.title), 5000);
    expect(await worksheetComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(ec.visibilityOf(worksheetComponentsPage.entities.get(0)), ec.visibilityOf(worksheetComponentsPage.noResult)),
      5000
    );
  });

  it('should create Worksheet', async () => {
    initNumberOfEntities = await worksheetComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(worksheetComponentsPage.createButton), 5000);
    await worksheetComponentsPage.clickOnCreateButton();
    worksheetUpdatePage = new WorksheetUpdatePage();
    await browser.wait(ec.visibilityOf(worksheetUpdatePage.pageTitle), 3000);
    expect(await worksheetUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await worksheetUpdatePage.setDescriptionInput(description);
    await worksheetUpdatePage.setCostHourInput(costHour);
    await worksheetUpdatePage.setTotalInput(total);
    await worksheetUpdatePage.billingTypeSelectLastOption();
    await worksheetUpdatePage.userTypeSelectLastOption();

    await worksheetUpdatePage.save();
    await browser.wait(ec.visibilityOf(worksheetComponentsPage.title), 3000);
    expect(await worksheetComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await worksheetComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last Worksheet', async () => {
    worksheetComponentsPage = new WorksheetComponentsPage();
    await browser.wait(ec.visibilityOf(worksheetComponentsPage.title), 5000);
    lastElement = await worksheetComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last Worksheet', async () => {
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

  it('should view the last Worksheet', async () => {
    worksheetDetailPage = new WorksheetDetailPage();
    if (isVisible && (await worksheetDetailPage.pageTitle.isDisplayed())) {
      expect(await worksheetDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await worksheetDetailPage.getIdInput()).toEqual(id);

      expect(await worksheetDetailPage.getDescriptionInput()).toEqual(description);

      expect(await worksheetDetailPage.getCostHourInput()).toEqual(costHour);

      expect(await worksheetDetailPage.getTotalInput()).toEqual(total);
    }
  });

  it('should delete last Worksheet', async () => {
    worksheetDetailPage = new WorksheetDetailPage();
    if (isVisible && (await worksheetDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await worksheetDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(worksheetComponentsPage.title), 3000);
      expect(await worksheetComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await worksheetComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish Worksheets tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
