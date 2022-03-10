import { element, by, browser, ElementFinder } from 'protractor';

export class WorksheetComponentsPage {
  createButton = element(by.css('ion-fab-button'));
  viewButtons = element.all(by.css('ion-item'));
  title = element.all(by.css('ion-title')).get(2);
  noResult = element(by.cssContainingText('ion-label', 'No Worksheets found.'));
  entities = element.all(by.css('page-worksheet ion-item'));

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

export class WorksheetUpdatePage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  saveButton = element.all(by.css('ion-button')).get(1);

  idInput = element(by.css('ion-input[formControlName="id"] input'));
  descriptionInput = element(by.css('ion-input[formControlName="description"] input'));
  costHourInput = element(by.css('ion-input[formControlName="costHour"] input'));
  totalInput = element(by.css('ion-input[formControlName="total"] input'));
  billingTypeSelect = element(by.css('ion-select[formControlName="billingType"]'));
  userTypeSelect = element(by.css('ion-select[formControlName="userType"]'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }
  async setDescriptionInput(description: string): Promise<void> {
    await this.descriptionInput.sendKeys(description);
  }
  async setCostHourInput(costHour: string): Promise<void> {
    await this.costHourInput.sendKeys(costHour);
  }
  async setTotalInput(total: string): Promise<void> {
    await this.totalInput.sendKeys(total);
  }
  async billingTypeSelectLastOption(): Promise<void> {
    await this.billingTypeSelect.click();
    await browser.sleep(500);
    await element.all(by.className('alert-radio')).last().click();
    await element.all(by.className('alert-button')).last().click();
  }
  async userTypeSelectLastOption(): Promise<void> {
    await this.userTypeSelect.click();
    await browser.sleep(500);
    await element.all(by.className('alert-radio')).last().click();
    await element.all(by.className('alert-button')).last().click();
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }
}

export class WorksheetDetailPage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  deleteButton = element(by.css('ion-button[color="danger"]'));
  idInput = element.all(by.css('span')).get(1);

  descriptionInput = element.all(by.css('span')).get(2);

  costHourInput = element.all(by.css('span')).get(5);

  totalInput = element.all(by.css('span')).get(6);

  async getIdInput(): Promise<string> {
    return await this.idInput.getText();
  }

  async getDescriptionInput(): Promise<string> {
    return await this.descriptionInput.getText();
  }

  async getCostHourInput(): Promise<string> {
    return await this.costHourInput.getText();
  }

  async getTotalInput(): Promise<string> {
    return await this.totalInput.getText();
  }

  async clickOnDeleteButton(): Promise<void> {
    await this.deleteButton.click();
  }

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }
}
