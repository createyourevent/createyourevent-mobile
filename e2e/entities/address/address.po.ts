import { element, by, browser, ElementFinder } from 'protractor';

export class AddressComponentsPage {
  createButton = element(by.css('ion-fab-button'));
  viewButtons = element.all(by.css('ion-item'));
  title = element.all(by.css('ion-title')).get(2);
  noResult = element(by.cssContainingText('ion-label', 'No Addresses found.'));
  entities = element.all(by.css('page-address ion-item'));

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

export class AddressUpdatePage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  saveButton = element.all(by.css('ion-button')).get(1);

  idInput = element(by.css('ion-input[formControlName="id"] input'));
  addressInput = element(by.css('ion-input[formControlName="address"] input'));
  latInput = element(by.css('ion-input[formControlName="lat"] input'));
  lngInput = element(by.css('ion-input[formControlName="lng"] input'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }
  async setAddressInput(address: string): Promise<void> {
    await this.addressInput.sendKeys(address);
  }
  async setLatInput(lat: string): Promise<void> {
    await this.latInput.sendKeys(lat);
  }
  async setLngInput(lng: string): Promise<void> {
    await this.lngInput.sendKeys(lng);
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }
}

export class AddressDetailPage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  deleteButton = element(by.css('ion-button[color="danger"]'));
  idInput = element.all(by.css('span')).get(1);

  addressInput = element.all(by.css('span')).get(2);

  latInput = element.all(by.css('span')).get(3);

  lngInput = element.all(by.css('span')).get(4);

  async getIdInput(): Promise<string> {
    return await this.idInput.getText();
  }

  async getAddressInput(): Promise<string> {
    return await this.addressInput.getText();
  }

  async getLatInput(): Promise<string> {
    return await this.latInput.getText();
  }

  async getLngInput(): Promise<string> {
    return await this.lngInput.getText();
  }

  async clickOnDeleteButton(): Promise<void> {
    await this.deleteButton.click();
  }

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }
}
