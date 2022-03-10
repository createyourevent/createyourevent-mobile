import { element, by, browser, ElementFinder } from 'protractor';

export class EventProductOrderComponentsPage {
  createButton = element(by.css('ion-fab-button'));
  viewButtons = element.all(by.css('ion-item'));
  title = element.all(by.css('ion-title')).get(2);
  noResult = element(by.cssContainingText('ion-label', 'No Event Product Orders found.'));
  entities = element.all(by.css('page-event-product-order ion-item'));

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

export class EventProductOrderUpdatePage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  saveButton = element.all(by.css('ion-button')).get(1);

  idInput = element(by.css('ion-input[formControlName="id"] input'));
  amountInput = element(by.css('ion-input[formControlName="amount"] input'));
  totalInput = element(by.css('ion-input[formControlName="total"] input'));
  rentalPeriodInput = element(by.css('ion-input[formControlName="rentalPeriod"] input'));
  statusSelect = element(by.css('ion-select[formControlName="status"]'));
  sellingPriceInput = element(by.css('ion-input[formControlName="sellingPrice"] input'));

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
  async setRentalPeriodInput(rentalPeriod: string): Promise<void> {
    await this.rentalPeriodInput.sendKeys(rentalPeriod);
  }
  async statusSelectLastOption(): Promise<void> {
    await this.statusSelect.click();
    await browser.sleep(500);
    await element.all(by.className('alert-radio')).last().click();
    await element.all(by.className('alert-button')).last().click();
  }
  async setSellingPriceInput(sellingPrice: string): Promise<void> {
    await this.sellingPriceInput.sendKeys(sellingPrice);
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }
}

export class EventProductOrderDetailPage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  deleteButton = element(by.css('ion-button[color="danger"]'));
  idInput = element.all(by.css('span')).get(1);

  amountInput = element.all(by.css('span')).get(2);

  totalInput = element.all(by.css('span')).get(3);

  rentalPeriodInput = element.all(by.css('span')).get(5);

  sellingPriceInput = element.all(by.css('span')).get(12);

  async getIdInput(): Promise<string> {
    return await this.idInput.getText();
  }

  async getAmountInput(): Promise<string> {
    return await this.amountInput.getText();
  }

  async getTotalInput(): Promise<string> {
    return await this.totalInput.getText();
  }

  async getRentalPeriodInput(): Promise<string> {
    return await this.rentalPeriodInput.getText();
  }

  async getSellingPriceInput(): Promise<string> {
    return await this.sellingPriceInput.getText();
  }

  async clickOnDeleteButton(): Promise<void> {
    await this.deleteButton.click();
  }

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }
}
