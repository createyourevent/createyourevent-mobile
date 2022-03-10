import { element, by, browser, ElementFinder } from 'protractor';

export class EventServiceMapOrderComponentsPage {
  createButton = element(by.css('ion-fab-button'));
  viewButtons = element.all(by.css('ion-item'));
  title = element.all(by.css('ion-title')).get(2);
  noResult = element(by.cssContainingText('ion-label', 'No Event Service Map Orders found.'));
  entities = element.all(by.css('page-event-service-map-order ion-item'));

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

export class EventServiceMapOrderUpdatePage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  saveButton = element.all(by.css('ion-button')).get(1);

  idInput = element(by.css('ion-input[formControlName="id"] input'));
  costHourInput = element(by.css('ion-input[formControlName="costHour"] input'));
  rideCostsInput = element(by.css('ion-input[formControlName="rideCosts"] input'));
  totalInput = element(by.css('ion-input[formControlName="total"] input'));
  totalHoursInput = element(by.css('ion-input[formControlName="totalHours"] input'));
  kilometreInput = element(by.css('ion-input[formControlName="kilometre"] input'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }
  async setCostHourInput(costHour: string): Promise<void> {
    await this.costHourInput.sendKeys(costHour);
  }
  async setRideCostsInput(rideCosts: string): Promise<void> {
    await this.rideCostsInput.sendKeys(rideCosts);
  }
  async setTotalInput(total: string): Promise<void> {
    await this.totalInput.sendKeys(total);
  }
  async setTotalHoursInput(totalHours: string): Promise<void> {
    await this.totalHoursInput.sendKeys(totalHours);
  }
  async setKilometreInput(kilometre: string): Promise<void> {
    await this.kilometreInput.sendKeys(kilometre);
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }
}

export class EventServiceMapOrderDetailPage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  deleteButton = element(by.css('ion-button[color="danger"]'));
  idInput = element.all(by.css('span')).get(1);

  costHourInput = element.all(by.css('span')).get(5);

  rideCostsInput = element.all(by.css('span')).get(6);

  totalInput = element.all(by.css('span')).get(7);

  totalHoursInput = element.all(by.css('span')).get(8);

  kilometreInput = element.all(by.css('span')).get(9);

  async getIdInput(): Promise<string> {
    return await this.idInput.getText();
  }

  async getCostHourInput(): Promise<string> {
    return await this.costHourInput.getText();
  }

  async getRideCostsInput(): Promise<string> {
    return await this.rideCostsInput.getText();
  }

  async getTotalInput(): Promise<string> {
    return await this.totalInput.getText();
  }

  async getTotalHoursInput(): Promise<string> {
    return await this.totalHoursInput.getText();
  }

  async getKilometreInput(): Promise<string> {
    return await this.kilometreInput.getText();
  }

  async clickOnDeleteButton(): Promise<void> {
    await this.deleteButton.click();
  }

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }
}
