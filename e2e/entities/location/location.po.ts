import { element, by, browser, ElementFinder } from 'protractor';

export class LocationComponentsPage {
  createButton = element(by.css('ion-fab-button'));
  viewButtons = element.all(by.css('ion-item'));
  title = element.all(by.css('ion-title')).get(2);
  noResult = element(by.cssContainingText('ion-label', 'No Locations found.'));
  entities = element.all(by.css('page-location ion-item'));

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

export class LocationUpdatePage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  saveButton = element.all(by.css('ion-button')).get(1);

  idInput = element(by.css('ion-input[formControlName="id"] input'));
  nameInput = element(by.css('ion-input[formControlName="name"] input'));
  descriptionInput = element(by.css('ion-textarea[formControlName="description"] textarea'));
  photoInput = element(by.css('ion-input[formControlName="photo"] input'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }
  async setNameInput(name: string): Promise<void> {
    await this.nameInput.sendKeys(name);
  }
  async setDescriptionInput(description: string): Promise<void> {
    await this.descriptionInput.sendKeys(description);
  }
  async setPhotoInput(photo: string): Promise<void> {
    await this.photoInput.sendKeys(photo);
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }
}

export class LocationDetailPage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  deleteButton = element(by.css('ion-button[color="danger"]'));
  idInput = element.all(by.css('span')).get(1);

  nameInput = element.all(by.css('span')).get(2);

  descriptionInput = element.all(by.css('span')).get(3);

  photoInput = element.all(by.css('span')).get(4);

  async getIdInput(): Promise<string> {
    return await this.idInput.getText();
  }

  async getNameInput(): Promise<string> {
    return await this.nameInput.getText();
  }

  async getDescriptionInput(): Promise<string> {
    return await this.descriptionInput.getText();
  }

  async getPhotoInput(): Promise<string> {
    return await this.photoInput.getText();
  }

  async clickOnDeleteButton(): Promise<void> {
    await this.deleteButton.click();
  }

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }
}
