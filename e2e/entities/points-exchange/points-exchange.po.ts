import { element, by, browser, ElementFinder } from 'protractor';

export class PointsExchangeComponentsPage {
  createButton = element(by.css('ion-fab-button'));
  viewButtons = element.all(by.css('ion-item'));
  title = element.all(by.css('ion-title')).get(2);
  noResult = element(by.cssContainingText('ion-label', 'No Points Exchanges found.'));
  entities = element.all(by.css('page-points-exchange ion-item'));

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

export class PointsExchangeUpdatePage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  saveButton = element.all(by.css('ion-button')).get(1);

  idInput = element(by.css('ion-input[formControlName="id"] input'));
  pointsTotalInput = element(by.css('ion-input[formControlName="pointsTotal"] input'));
  bondPointsTotalInput = element(by.css('ion-input[formControlName="bondPointsTotal"] input'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }
  async setPointsTotalInput(pointsTotal: string): Promise<void> {
    await this.pointsTotalInput.sendKeys(pointsTotal);
  }
  async setBondPointsTotalInput(bondPointsTotal: string): Promise<void> {
    await this.bondPointsTotalInput.sendKeys(bondPointsTotal);
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }
}

export class PointsExchangeDetailPage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  deleteButton = element(by.css('ion-button[color="danger"]'));
  idInput = element.all(by.css('span')).get(1);

  pointsTotalInput = element.all(by.css('span')).get(2);

  bondPointsTotalInput = element.all(by.css('span')).get(3);

  async getIdInput(): Promise<string> {
    return await this.idInput.getText();
  }

  async getPointsTotalInput(): Promise<string> {
    return await this.pointsTotalInput.getText();
  }

  async getBondPointsTotalInput(): Promise<string> {
    return await this.bondPointsTotalInput.getText();
  }

  async clickOnDeleteButton(): Promise<void> {
    await this.deleteButton.click();
  }

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }
}
