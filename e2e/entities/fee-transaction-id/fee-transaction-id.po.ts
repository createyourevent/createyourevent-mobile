import { element, by, browser, ElementFinder } from 'protractor';

export class FeeTransactionIdComponentsPage {
  createButton = element(by.css('ion-fab-button'));
  viewButtons = element.all(by.css('ion-item'));
  title = element.all(by.css('ion-title')).get(2);
  noResult = element(by.cssContainingText('ion-label', 'No Fee Transaction Ids found.'));
  entities = element.all(by.css('page-fee-transaction-id ion-item'));

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

export class FeeTransactionIdUpdatePage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  saveButton = element.all(by.css('ion-button')).get(1);

  idInput = element(by.css('ion-input[formControlName="id"] input'));
  transactionIdInput = element(by.css('ion-input[formControlName="transactionId"] input'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }
  async setTransactionIdInput(transactionId: string): Promise<void> {
    await this.transactionIdInput.sendKeys(transactionId);
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }
}

export class FeeTransactionIdDetailPage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  deleteButton = element(by.css('ion-button[color="danger"]'));
  idInput = element.all(by.css('span')).get(1);

  transactionIdInput = element.all(by.css('span')).get(2);

  async getIdInput(): Promise<string> {
    return await this.idInput.getText();
  }

  async getTransactionIdInput(): Promise<string> {
    return await this.transactionIdInput.getText();
  }

  async clickOnDeleteButton(): Promise<void> {
    await this.deleteButton.click();
  }

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }
}
