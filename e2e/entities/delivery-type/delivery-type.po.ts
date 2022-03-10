import { element, by, browser, ElementFinder } from 'protractor';

export class DeliveryTypeComponentsPage {
  createButton = element(by.css('ion-fab-button'));
  viewButtons = element.all(by.css('ion-item'));
  title = element.all(by.css('ion-title')).get(2);
  noResult = element(by.cssContainingText('ion-label', 'No Delivery Types found.'));
  entities = element.all(by.css('page-delivery-type ion-item'));

  async clickOnCreateButton(): Promise<void> {
    await this.createButton.click();
  }

  async clickOnLastViewButton(): Promise<void> {
    await this.viewButtons.last().click();
  }

  async getTitle(): Promise<string> {
    return this.title.getText();
  }

  async getEntitiesNumber(): Promise<number> {
    return await this.entities.count();
  }
}

export class DeliveryTypeUpdatePage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  saveButton = element.all(by.css('ion-button')).get(1);

  idInput = element(by.css('ion-input[formControlName="id"] input'));
  deliveryTypeSelect = element(by.css('ion-select[formControlName="deliveryType"]'));
  minimumOrderQuantityInput = element(by.css('ion-input[formControlName="minimumOrderQuantity"] input'));
  priceInput = element(by.css('ion-input[formControlName="price"] input'));
  pricePerKilometreInput = element(by.css('ion-input[formControlName="pricePerKilometre"] input'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }
  async deliveryTypeSelectLastOption(): Promise<void> {
    await this.deliveryTypeSelect.click();
    await browser.sleep(500);
    await element.all(by.className('alert-radio')).last().click();
    await element.all(by.className('alert-button')).last().click();
  }
  async setMinimumOrderQuantityInput(minimumOrderQuantity: string): Promise<void> {
    await this.minimumOrderQuantityInput.sendKeys(minimumOrderQuantity);
  }
  async setPriceInput(price: string): Promise<void> {
    await this.priceInput.sendKeys(price);
  }
  async setPricePerKilometreInput(pricePerKilometre: string): Promise<void> {
    await this.pricePerKilometreInput.sendKeys(pricePerKilometre);
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }
}

export class DeliveryTypeDetailPage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  deleteButton = element(by.css('ion-button[color="danger"]'));
  idInput = element.all(by.css('span')).get(1);

  minimumOrderQuantityInput = element.all(by.css('span')).get(3);

  priceInput = element.all(by.css('span')).get(4);

  pricePerKilometreInput = element.all(by.css('span')).get(5);

  async getIdInput(): Promise<string> {
    return await this.idInput.getText();
  }

  async getMinimumOrderQuantityInput(): Promise<string> {
    return await this.minimumOrderQuantityInput.getText();
  }

  async getPriceInput(): Promise<string> {
    return await this.priceInput.getText();
  }

  async getPricePerKilometreInput(): Promise<string> {
    return await this.pricePerKilometreInput.getText();
  }

  async clickOnDeleteButton(): Promise<void> {
    await this.deleteButton.click();
  }

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }
}
