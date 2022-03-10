import { element, by, browser, ElementFinder } from 'protractor';

export class ChipsComponentsPage {
  createButton = element(by.css('ion-fab-button'));
  viewButtons = element.all(by.css('ion-item'));
  title = element.all(by.css('ion-title')).get(2);
  noResult = element(by.cssContainingText('ion-label', 'No Chips found.'));
  entities = element.all(by.css('page-chips ion-item'));

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

export class ChipsUpdatePage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  saveButton = element.all(by.css('ion-button')).get(1);

  idInput = element(by.css('ion-input[formControlName="id"] input'));
  pointsInput = element(by.css('ion-input[formControlName="points"] input'));
  websiteInput = element(by.css('ion-input[formControlName="website"] input'));
  xInput = element(by.css('ion-input[formControlName="x"] input'));
  yInput = element(by.css('ion-input[formControlName="y"] input'));
  imageInput = element(by.css('ion-input[formControlName="image"] input'));
  colorInput = element(by.css('ion-input[formControlName="color"] input'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }
  async setPointsInput(points: string): Promise<void> {
    await this.pointsInput.sendKeys(points);
  }
  async setWebsiteInput(website: string): Promise<void> {
    await this.websiteInput.sendKeys(website);
  }
  async setXInput(x: string): Promise<void> {
    await this.xInput.sendKeys(x);
  }
  async setYInput(y: string): Promise<void> {
    await this.yInput.sendKeys(y);
  }
  async setImageInput(image: string): Promise<void> {
    await this.imageInput.sendKeys(image);
  }
  async setColorInput(color: string): Promise<void> {
    await this.colorInput.sendKeys(color);
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }
}

export class ChipsDetailPage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  deleteButton = element(by.css('ion-button[color="danger"]'));
  idInput = element.all(by.css('span')).get(1);

  pointsInput = element.all(by.css('span')).get(2);

  websiteInput = element.all(by.css('span')).get(3);

  xInput = element.all(by.css('span')).get(4);

  yInput = element.all(by.css('span')).get(5);

  imageInput = element.all(by.css('span')).get(6);

  colorInput = element.all(by.css('span')).get(7);

  async getIdInput(): Promise<string> {
    return await this.idInput.getText();
  }

  async getPointsInput(): Promise<string> {
    return await this.pointsInput.getText();
  }

  async getWebsiteInput(): Promise<string> {
    return await this.websiteInput.getText();
  }

  async getXInput(): Promise<string> {
    return await this.xInput.getText();
  }

  async getYInput(): Promise<string> {
    return await this.yInput.getText();
  }

  async getImageInput(): Promise<string> {
    return await this.imageInput.getText();
  }

  async getColorInput(): Promise<string> {
    return await this.colorInput.getText();
  }

  async clickOnDeleteButton(): Promise<void> {
    await this.deleteButton.click();
  }

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }
}
