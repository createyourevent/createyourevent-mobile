import { element, by, browser, ElementFinder } from 'protractor';

export class PropertyComponentsPage {
  createButton = element(by.css('ion-fab-button'));
  viewButtons = element.all(by.css('ion-item'));
  title = element.all(by.css('ion-title')).get(2);
  noResult = element(by.cssContainingText('ion-label', 'No Properties found.'));
  entities = element.all(by.css('page-property ion-item'));

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

export class PropertyUpdatePage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  saveButton = element.all(by.css('ion-button')).get(1);

  idInput = element(by.css('ion-input[formControlName="id"] input'));
  keyInput = element(by.css('ion-input[formControlName="key"] input'));
  valueInput = element(by.css('ion-input[formControlName="value"] input'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }
  async setKeyInput(key: string): Promise<void> {
    await this.keyInput.sendKeys(key);
  }
  async setValueInput(value: string): Promise<void> {
    await this.valueInput.sendKeys(value);
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }
}

export class PropertyDetailPage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  deleteButton = element(by.css('ion-button[color="danger"]'));
  idInput = element.all(by.css('span')).get(1);

  keyInput = element.all(by.css('span')).get(2);

  valueInput = element.all(by.css('span')).get(3);

  async getIdInput(): Promise<string> {
    return await this.idInput.getText();
  }

  async getKeyInput(): Promise<string> {
    return await this.keyInput.getText();
  }

  async getValueInput(): Promise<string> {
    return await this.valueInput.getText();
  }

  async clickOnDeleteButton(): Promise<void> {
    await this.deleteButton.click();
  }

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }
}
