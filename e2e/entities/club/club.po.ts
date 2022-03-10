import { element, by, browser, ElementFinder } from 'protractor';

export class ClubComponentsPage {
  createButton = element(by.css('ion-fab-button'));
  viewButtons = element.all(by.css('ion-item'));
  title = element.all(by.css('ion-title')).get(2);
  noResult = element(by.cssContainingText('ion-label', 'No Clubs found.'));
  entities = element.all(by.css('page-club ion-item'));

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

export class ClubUpdatePage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  saveButton = element.all(by.css('ion-button')).get(1);

  idInput = element(by.css('ion-input[formControlName="id"] input'));
  priceCardInput = element(by.css('ion-textarea[formControlName="priceCard"] textarea'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }
  async setPriceCardInput(priceCard: string): Promise<void> {
    await this.priceCardInput.sendKeys(priceCard);
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }
}

export class ClubDetailPage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  deleteButton = element(by.css('ion-button[color="danger"]'));
  idInput = element.all(by.css('span')).get(1);

  priceCardInput = element.all(by.css('span')).get(2);

  async getIdInput(): Promise<string> {
    return await this.idInput.getText();
  }

  async getPriceCardInput(): Promise<string> {
    return await this.priceCardInput.getText();
  }

  async clickOnDeleteButton(): Promise<void> {
    await this.deleteButton.click();
  }

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }
}
