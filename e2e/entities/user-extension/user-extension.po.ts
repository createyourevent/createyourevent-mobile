import { element, by, browser, ElementFinder } from 'protractor';

export class UserExtensionComponentsPage {
  createButton = element(by.css('ion-fab-button'));
  viewButtons = element.all(by.css('ion-item'));
  title = element.all(by.css('ion-title')).get(2);
  noResult = element(by.cssContainingText('ion-label', 'No User Extensions found.'));
  entities = element.all(by.css('page-user-extension ion-item'));

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

export class UserExtensionUpdatePage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  saveButton = element.all(by.css('ion-button')).get(1);

  idInput = element(by.css('ion-input[formControlName="id"] input'));
  addressInput = element(by.css('ion-input[formControlName="address"] input'));
  phoneInput = element(by.css('ion-input[formControlName="phone"] input'));
  pointsInput = element(by.css('ion-input[formControlName="points"] input'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }
  async setAddressInput(address: string): Promise<void> {
    await this.addressInput.sendKeys(address);
  }
  async setPhoneInput(phone: string): Promise<void> {
    await this.phoneInput.sendKeys(phone);
  }
  async setPointsInput(points: string): Promise<void> {
    await this.pointsInput.sendKeys(points);
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }
}

export class UserExtensionDetailPage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  deleteButton = element(by.css('ion-button[color="danger"]'));
  idInput = element.all(by.css('span')).get(1);

  addressInput = element.all(by.css('span')).get(2);

  phoneInput = element.all(by.css('span')).get(3);

  pointsInput = element.all(by.css('span')).get(5);

  async getIdInput(): Promise<string> {
    return await this.idInput.getText();
  }

  async getAddressInput(): Promise<string> {
    return await this.addressInput.getText();
  }

  async getPhoneInput(): Promise<string> {
    return await this.phoneInput.getText();
  }

  async getPointsInput(): Promise<string> {
    return await this.pointsInput.getText();
  }

  async clickOnDeleteButton(): Promise<void> {
    await this.deleteButton.click();
  }

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }
}
