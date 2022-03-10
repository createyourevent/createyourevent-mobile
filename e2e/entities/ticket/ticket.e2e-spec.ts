import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { TicketComponentsPage, TicketDetailPage, TicketUpdatePage } from './ticket.po';

describe('Ticket e2e test', () => {
  let loginPage: LoginPage;
  let ticketComponentsPage: TicketComponentsPage;
  let ticketUpdatePage: TicketUpdatePage;
  let ticketDetailPage: TicketDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Tickets';
  const SUBCOMPONENT_TITLE = 'Ticket';
  let lastElement: any;
  let isVisible = false;

  const id = '10';
  const amount = '10';
  const total = '10';
  const refNo = 'refNo';
  const ticketsUsed = '10';

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

  it('should load Tickets', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'Ticket')
      .first()
      .click();

    ticketComponentsPage = new TicketComponentsPage();
    await browser.wait(ec.visibilityOf(ticketComponentsPage.title), 5000);
    expect(await ticketComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(ec.or(ec.visibilityOf(ticketComponentsPage.entities.get(0)), ec.visibilityOf(ticketComponentsPage.noResult)), 5000);
  });

  it('should create Ticket', async () => {
    initNumberOfEntities = await ticketComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(ticketComponentsPage.createButton), 5000);
    await ticketComponentsPage.clickOnCreateButton();
    ticketUpdatePage = new TicketUpdatePage();
    await browser.wait(ec.visibilityOf(ticketUpdatePage.pageTitle), 3000);
    expect(await ticketUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await ticketUpdatePage.setAmountInput(amount);
    await ticketUpdatePage.setTotalInput(total);
    await ticketUpdatePage.setRefNoInput(refNo);
    await ticketUpdatePage.setTicketsUsedInput(ticketsUsed);

    await ticketUpdatePage.save();
    await browser.wait(ec.visibilityOf(ticketComponentsPage.title), 3000);
    expect(await ticketComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await ticketComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last Ticket', async () => {
    ticketComponentsPage = new TicketComponentsPage();
    await browser.wait(ec.visibilityOf(ticketComponentsPage.title), 5000);
    lastElement = await ticketComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last Ticket', async () => {
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

  it('should view the last Ticket', async () => {
    ticketDetailPage = new TicketDetailPage();
    if (isVisible && (await ticketDetailPage.pageTitle.isDisplayed())) {
      expect(await ticketDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await ticketDetailPage.getIdInput()).toEqual(id);

      expect(await ticketDetailPage.getAmountInput()).toEqual(amount);

      expect(await ticketDetailPage.getTotalInput()).toEqual(total);

      expect(await ticketDetailPage.getRefNoInput()).toEqual(refNo);

      expect(await ticketDetailPage.getTicketsUsedInput()).toEqual(ticketsUsed);
    }
  });

  it('should delete last Ticket', async () => {
    ticketDetailPage = new TicketDetailPage();
    if (isVisible && (await ticketDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await ticketDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(ticketComponentsPage.title), 3000);
      expect(await ticketComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await ticketComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish Tickets tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
