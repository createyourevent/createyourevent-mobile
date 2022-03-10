import { element, by, browser, ElementFinder } from 'protractor';

export class GiftComponentsPage {
  createButton = element(by.css('ion-fab-button'));
  viewButtons = element.all(by.css('ion-item'));
  title = element.all(by.css('ion-title')).get(2);
  noResult = element(by.cssContainingText('ion-label', 'No Gifts found.'));
  entities = element.all(by.css('page-gift ion-item'));

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

export class GiftUpdatePage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  saveButton = element.all(by.css('ion-button')).get(1);

  idInput = element(by.css('ion-input[formControlName="id"] input'));
  titleInput = element(by.css('ion-input[formControlName="title"] input'));
  descriptionInput = element(by.css('ion-textarea[formControlName="description"] textarea'));
  photoInput = element(by.css('ion-input[formControlName="photo"] input'));
  pointsInput = element(by.css('ion-input[formControlName="points"] input'));
  stockInput = element(by.css('ion-input[formControlName="stock"] input'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }
  async setTitleInput(title: string): Promise<void> {
    await this.titleInput.sendKeys(title);
  }
  async setDescriptionInput(description: string): Promise<void> {
    await this.descriptionInput.sendKeys(description);
  }
  async setPhotoInput(photo: string): Promise<void> {
    await this.photoInput.sendKeys(photo);
  }
  async setPointsInput(points: string): Promise<void> {
    await this.pointsInput.sendKeys(points);
  }
  async setStockInput(stock: string): Promise<void> {
    await this.stockInput.sendKeys(stock);
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }
}

export class GiftDetailPage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  deleteButton = element(by.css('ion-button[color="danger"]'));
  idInput = element.all(by.css('span')).get(1);

  titleInput = element.all(by.css('span')).get(2);

  descriptionInput = element.all(by.css('span')).get(3);

  photoInput = element.all(by.css('span')).get(4);

  pointsInput = element.all(by.css('span')).get(5);

  stockInput = element.all(by.css('span')).get(7);

  async getIdInput(): Promise<string> {
    return await this.idInput.getText();
  }

  async getTitleInput(): Promise<string> {
    return await this.titleInput.getText();
  }

  async getDescriptionInput(): Promise<string> {
    return await this.descriptionInput.getText();
  }

  async getPhotoInput(): Promise<string> {
    return await this.photoInput.getText();
  }

  async getPointsInput(): Promise<string> {
    return await this.pointsInput.getText();
  }

  async getStockInput(): Promise<string> {
    return await this.stockInput.getText();
  }

  async clickOnDeleteButton(): Promise<void> {
    await this.deleteButton.click();
  }

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }
}
