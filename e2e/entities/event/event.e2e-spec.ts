import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { EventComponentsPage, EventDetailPage, EventUpdatePage } from './event.po';

describe('Event e2e test', () => {
  let loginPage: LoginPage;
  let eventComponentsPage: EventComponentsPage;
  let eventUpdatePage: EventUpdatePage;
  let eventDetailPage: EventDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Events';
  const SUBCOMPONENT_TITLE = 'Event';
  let lastElement: any;
  let isVisible = false;

  const id = '10';
  const name = 'name';
  const description = 'description';
  const price = '10';
  const youtube = 'youtube';
  const privateOrPublic = 'privateOrPublic';
  const minPlacenumber = '10';
  const placenumber = '10';
  const investment = '10';
  const motto = 'motto';
  const stars = '10';

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

  it('should load Events', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'Event')
      .first()
      .click();

    eventComponentsPage = new EventComponentsPage();
    await browser.wait(ec.visibilityOf(eventComponentsPage.title), 5000);
    expect(await eventComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(ec.or(ec.visibilityOf(eventComponentsPage.entities.get(0)), ec.visibilityOf(eventComponentsPage.noResult)), 5000);
  });

  it('should create Event', async () => {
    initNumberOfEntities = await eventComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(eventComponentsPage.createButton), 5000);
    await eventComponentsPage.clickOnCreateButton();
    eventUpdatePage = new EventUpdatePage();
    await browser.wait(ec.visibilityOf(eventUpdatePage.pageTitle), 3000);
    expect(await eventUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await eventUpdatePage.setNameInput(name);
    await eventUpdatePage.setDescriptionInput(description);
    await eventUpdatePage.categorySelectLastOption();
    await eventUpdatePage.setPriceInput(price);
    await eventUpdatePage.setFlyerInput(flyer);
    await eventUpdatePage.setYoutubeInput(youtube);
    await eventUpdatePage.setPrivateOrPublicInput(privateOrPublic);
    await eventUpdatePage.setMinPlacenumberInput(minPlacenumber);
    await eventUpdatePage.setPlacenumberInput(placenumber);
    await eventUpdatePage.setInvestmentInput(investment);
    await eventUpdatePage.statusSelectLastOption();
    await eventUpdatePage.setMottoInput(motto);
    await eventUpdatePage.setStarsInput(stars);

    await eventUpdatePage.save();
    await browser.wait(ec.visibilityOf(eventComponentsPage.title), 3000);
    expect(await eventComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await eventComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last Event', async () => {
    eventComponentsPage = new EventComponentsPage();
    await browser.wait(ec.visibilityOf(eventComponentsPage.title), 5000);
    lastElement = await eventComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last Event', async () => {
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

  it('should view the last Event', async () => {
    eventDetailPage = new EventDetailPage();
    if (isVisible && (await eventDetailPage.pageTitle.isDisplayed())) {
      expect(await eventDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await eventDetailPage.getIdInput()).toEqual(id);

      expect(await eventDetailPage.getNameInput()).toEqual(name);

      expect(await eventDetailPage.getDescriptionInput()).toEqual(description);

      expect(await eventDetailPage.getPriceInput()).toEqual(price);

      expect(await eventDetailPage.getFlyerInput()).toEqual(flyer);

      expect(await eventDetailPage.getYoutubeInput()).toEqual(youtube);

      expect(await eventDetailPage.getPrivateOrPublicInput()).toEqual(privateOrPublic);

      expect(await eventDetailPage.getMinPlacenumberInput()).toEqual(minPlacenumber);

      expect(await eventDetailPage.getPlacenumberInput()).toEqual(placenumber);

      expect(await eventDetailPage.getInvestmentInput()).toEqual(investment);

      expect(await eventDetailPage.getMottoInput()).toEqual(motto);

      expect(await eventDetailPage.getStarsInput()).toEqual(stars);
    }
  });

  it('should delete last Event', async () => {
    eventDetailPage = new EventDetailPage();
    if (isVisible && (await eventDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await eventDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(eventComponentsPage.title), 3000);
      expect(await eventComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await eventComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish Events tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
