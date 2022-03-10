import { element, by, browser, ElementFinder } from 'protractor';

export class ReservationComponentsPage {
  createButton = element(by.css('ion-fab-button'));
  viewButtons = element.all(by.css('ion-item'));
  title = element.all(by.css('ion-title')).get(2);
  noResult = element(by.cssContainingText('ion-label', 'No Reservations found.'));
  entities = element.all(by.css('page-reservation ion-item'));

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

export class ReservationUpdatePage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  saveButton = element.all(by.css('ion-button')).get(1);

  idInput = element(by.css('ion-input[formControlName="id"] input'));
  tdTxIdInput = element(by.css('ion-input[formControlName="tdTxId"] input'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }
  async setTdTxIdInput(tdTxId: string): Promise<void> {
    await this.tdTxIdInput.sendKeys(tdTxId);
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }
}

export class ReservationDetailPage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  deleteButton = element(by.css('ion-button[color="danger"]'));
  idInput = element.all(by.css('span')).get(1);

  tdTxIdInput = element.all(by.css('span')).get(6);

  async getIdInput(): Promise<string> {
    return await this.idInput.getText();
  }

  async getTdTxIdInput(): Promise<string> {
    return await this.tdTxIdInput.getText();
  }

  async clickOnDeleteButton(): Promise<void> {
    await this.deleteButton.click();
  }

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }
}
