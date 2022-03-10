import { element, by, browser, ElementFinder } from 'protractor';

export class CartComponentsPage {
  createButton = element(by.css('ion-fab-button'));
  viewButtons = element.all(by.css('ion-item'));
  title = element.all(by.css('ion-title')).get(2);
  noResult = element(by.cssContainingText('ion-label', 'No Carts found.'));
  entities = element.all(by.css('page-cart ion-item'));

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

export class CartUpdatePage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  saveButton = element.all(by.css('ion-button')).get(1);

  idInput = element(by.css('ion-input[formControlName="id"] input'));
  totalCostsInput = element(by.css('ion-input[formControlName="totalCosts"] input'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }
  async setTotalCostsInput(totalCosts: string): Promise<void> {
    await this.totalCostsInput.sendKeys(totalCosts);
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }
}

export class CartDetailPage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  deleteButton = element(by.css('ion-button[color="danger"]'));
  idInput = element.all(by.css('span')).get(1);

  totalCostsInput = element.all(by.css('span')).get(3);

  async getIdInput(): Promise<string> {
    return await this.idInput.getText();
  }

  async getTotalCostsInput(): Promise<string> {
    return await this.totalCostsInput.getText();
  }

  async clickOnDeleteButton(): Promise<void> {
    await this.deleteButton.click();
  }

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }
}
