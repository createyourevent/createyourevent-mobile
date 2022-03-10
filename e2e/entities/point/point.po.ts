import { element, by, browser, ElementFinder } from 'protractor';

export class PointComponentsPage {
  createButton = element(by.css('ion-fab-button'));
  viewButtons = element.all(by.css('ion-item'));
  title = element.all(by.css('ion-title')).get(2);
  noResult = element(by.cssContainingText('ion-label', 'No Points found.'));
  entities = element.all(by.css('page-point ion-item'));

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

export class PointUpdatePage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  saveButton = element.all(by.css('ion-button')).get(1);

  idInput = element(by.css('ion-input[formControlName="id"] input'));
  keyInput = element(by.css('ion-input[formControlName="key"] input'));
  nameInput = element(by.css('ion-input[formControlName="name"] input'));
  keyNameInput = element(by.css('ion-input[formControlName="keyName"] input'));
  descriptionInput = element(by.css('ion-textarea[formControlName="description"] textarea'));
  keyDescriptionInput = element(by.css('ion-input[formControlName="keyDescription"] input'));
  categorySelect = element(by.css('ion-select[formControlName="category"]'));
  pointsInput = element(by.css('ion-input[formControlName="points"] input'));
  countPerDayInput = element(by.css('ion-input[formControlName="countPerDay"] input'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }
  async setKeyInput(key: string): Promise<void> {
    await this.keyInput.sendKeys(key);
  }
  async setNameInput(name: string): Promise<void> {
    await this.nameInput.sendKeys(name);
  }
  async setKeyNameInput(keyName: string): Promise<void> {
    await this.keyNameInput.sendKeys(keyName);
  }
  async setDescriptionInput(description: string): Promise<void> {
    await this.descriptionInput.sendKeys(description);
  }
  async setKeyDescriptionInput(keyDescription: string): Promise<void> {
    await this.keyDescriptionInput.sendKeys(keyDescription);
  }
  async categorySelectLastOption(): Promise<void> {
    await this.categorySelect.click();
    await browser.sleep(500);
    await element.all(by.className('alert-radio')).last().click();
    await element.all(by.className('alert-button')).last().click();
  }
  async setPointsInput(points: string): Promise<void> {
    await this.pointsInput.sendKeys(points);
  }
  async setCountPerDayInput(countPerDay: string): Promise<void> {
    await this.countPerDayInput.sendKeys(countPerDay);
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }
}

export class PointDetailPage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  deleteButton = element(by.css('ion-button[color="danger"]'));
  idInput = element.all(by.css('span')).get(1);

  keyInput = element.all(by.css('span')).get(2);

  nameInput = element.all(by.css('span')).get(3);

  keyNameInput = element.all(by.css('span')).get(4);

  descriptionInput = element.all(by.css('span')).get(5);

  keyDescriptionInput = element.all(by.css('span')).get(6);

  pointsInput = element.all(by.css('span')).get(8);

  countPerDayInput = element.all(by.css('span')).get(9);

  async getIdInput(): Promise<string> {
    return await this.idInput.getText();
  }

  async getKeyInput(): Promise<string> {
    return await this.keyInput.getText();
  }

  async getNameInput(): Promise<string> {
    return await this.nameInput.getText();
  }

  async getKeyNameInput(): Promise<string> {
    return await this.keyNameInput.getText();
  }

  async getDescriptionInput(): Promise<string> {
    return await this.descriptionInput.getText();
  }

  async getKeyDescriptionInput(): Promise<string> {
    return await this.keyDescriptionInput.getText();
  }

  async getPointsInput(): Promise<string> {
    return await this.pointsInput.getText();
  }

  async getCountPerDayInput(): Promise<string> {
    return await this.countPerDayInput.getText();
  }

  async clickOnDeleteButton(): Promise<void> {
    await this.deleteButton.click();
  }

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }
}
