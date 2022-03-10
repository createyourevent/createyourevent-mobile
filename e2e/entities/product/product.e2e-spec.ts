import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { ProductComponentsPage, ProductDetailPage, ProductUpdatePage } from './product.po';

describe('Product e2e test', () => {
  let loginPage: LoginPage;
  let productComponentsPage: ProductComponentsPage;
  let productUpdatePage: ProductUpdatePage;
  let productDetailPage: ProductDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Products';
  const SUBCOMPONENT_TITLE = 'Product';
  let lastElement: any;
  let isVisible = false;

  const id = '10';
  const title = 'title';
  const keywords = 'keywords';
  const description = 'description';
  const price = '10';
  const youtube = 'youtube';
  const stock = '10';
  const itemNumber = 'itemNumber';
  const amount = '10';
  const motto = 'motto';

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

  it('should load Products', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'Product')
      .first()
      .click();

    productComponentsPage = new ProductComponentsPage();
    await browser.wait(ec.visibilityOf(productComponentsPage.title), 5000);
    expect(await productComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(ec.visibilityOf(productComponentsPage.entities.get(0)), ec.visibilityOf(productComponentsPage.noResult)),
      5000
    );
  });

  it('should create Product', async () => {
    initNumberOfEntities = await productComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(productComponentsPage.createButton), 5000);
    await productComponentsPage.clickOnCreateButton();
    productUpdatePage = new ProductUpdatePage();
    await browser.wait(ec.visibilityOf(productUpdatePage.pageTitle), 3000);
    expect(await productUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await productUpdatePage.setTitleInput(title);
    await productUpdatePage.setKeywordsInput(keywords);
    await productUpdatePage.setDescriptionInput(description);
    await productUpdatePage.priceTypeSelectLastOption();
    await productUpdatePage.rentTypeSelectLastOption();
    await productUpdatePage.setPriceInput(price);
    await productUpdatePage.setPhotoInput(photo);
    await productUpdatePage.setPhoto2Input(photo2);
    await productUpdatePage.setPhoto3Input(photo3);
    await productUpdatePage.setYoutubeInput(youtube);
    await productUpdatePage.setStockInput(stock);
    await productUpdatePage.productTypeSelectLastOption();
    await productUpdatePage.setItemNumberInput(itemNumber);
    await productUpdatePage.statusSelectLastOption();
    await productUpdatePage.unitSelectLastOption();
    await productUpdatePage.setAmountInput(amount);
    await productUpdatePage.setMottoInput(motto);

    await productUpdatePage.save();
    await browser.wait(ec.visibilityOf(productComponentsPage.title), 3000);
    expect(await productComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await productComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last Product', async () => {
    productComponentsPage = new ProductComponentsPage();
    await browser.wait(ec.visibilityOf(productComponentsPage.title), 5000);
    lastElement = await productComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last Product', async () => {
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

  it('should view the last Product', async () => {
    productDetailPage = new ProductDetailPage();
    if (isVisible && (await productDetailPage.pageTitle.isDisplayed())) {
      expect(await productDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await productDetailPage.getIdInput()).toEqual(id);

      expect(await productDetailPage.getTitleInput()).toEqual(title);

      expect(await productDetailPage.getKeywordsInput()).toEqual(keywords);

      expect(await productDetailPage.getDescriptionInput()).toEqual(description);

      expect(await productDetailPage.getPriceInput()).toEqual(price);

      expect(await productDetailPage.getPhotoInput()).toEqual(photo);

      expect(await productDetailPage.getPhoto2Input()).toEqual(photo2);

      expect(await productDetailPage.getPhoto3Input()).toEqual(photo3);

      expect(await productDetailPage.getYoutubeInput()).toEqual(youtube);

      expect(await productDetailPage.getStockInput()).toEqual(stock);

      expect(await productDetailPage.getItemNumberInput()).toEqual(itemNumber);

      expect(await productDetailPage.getAmountInput()).toEqual(amount);

      expect(await productDetailPage.getMottoInput()).toEqual(motto);
    }
  });

  it('should delete last Product', async () => {
    productDetailPage = new ProductDetailPage();
    if (isVisible && (await productDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await productDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(productComponentsPage.title), 3000);
      expect(await productComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await productComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish Products tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
