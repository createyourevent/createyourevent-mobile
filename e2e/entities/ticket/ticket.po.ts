import { element, by, browser, ElementFinder } from 'protractor';

export class TicketComponentsPage {
  createButton = element(by.css('ion-fab-button'));
  viewButtons = element.all(by.css('ion-item'));
  title = element.all(by.css('ion-title')).get(2);
  noResult = element(by.cssContainingText('ion-label', 'No Tickets found.'));
  entities = element.all(by.css('page-ticket ion-item'));

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

export class TicketUpdatePage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  saveButton = element.all(by.css('ion-button')).get(1);

  idInput = element(by.css('ion-input[formControlName="id"] input'));
  amountInput = element(by.css('ion-input[formControlName="amount"] input'));
  totalInput = element(by.css('ion-input[formControlName="total"] input'));
  refNoInput = element(by.css('ion-input[formControlName="refNo"] input'));
  ticketsUsedInput = element(by.css('ion-input[formControlName="ticketsUsed"] input'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }
  async setAmountInput(amount: string): Promise<void> {
    await this.amountInput.sendKeys(amount);
  }
  async setTotalInput(total: string): Promise<void> {
    await this.totalInput.sendKeys(total);
  }
  async setRefNoInput(refNo: string): Promise<void> {
    await this.refNoInput.sendKeys(refNo);
  }
  async setTicketsUsedInput(ticketsUsed: string): Promise<void> {
    await this.ticketsUsedInput.sendKeys(ticketsUsed);
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }
}

export class TicketDetailPage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  deleteButton = element(by.css('ion-button[color="danger"]'));
  idInput = element.all(by.css('span')).get(1);

  amountInput = element.all(by.css('span')).get(2);

  totalInput = element.all(by.css('span')).get(3);

  refNoInput = element.all(by.css('span')).get(5);

  ticketsUsedInput = element.all(by.css('span')).get(7);

  async getIdInput(): Promise<string> {
    return await this.idInput.getText();
  }

  async getAmountInput(): Promise<string> {
    return await this.amountInput.getText();
  }

  async getTotalInput(): Promise<string> {
    return await this.totalInput.getText();
  }

  async getRefNoInput(): Promise<string> {
    return await this.refNoInput.getText();
  }

  async getTicketsUsedInput(): Promise<string> {
    return await this.ticketsUsedInput.getText();
  }

  async clickOnDeleteButton(): Promise<void> {
    await this.deleteButton.click();
  }

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }
}
