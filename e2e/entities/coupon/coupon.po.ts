import { element, by, browser, ElementFinder } from 'protractor';

export class CouponComponentsPage {
  createButton = element(by.css('ion-fab-button'));
  viewButtons = element.all(by.css('ion-item'));
  title = element.all(by.css('ion-title')).get(2);
  noResult = element(by.cssContainingText('ion-label', 'No Coupons found.'));
  entities = element.all(by.css('page-coupon ion-item'));

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

export class CouponUpdatePage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  saveButton = element.all(by.css('ion-button')).get(1);

  idInput = element(by.css('ion-input[formControlName="id"] input'));
  titleInput = element(by.css('ion-input[formControlName="title"] input'));
  valueInput = element(by.css('ion-input[formControlName="value"] input'));
  descriptionInput = element(by.css('ion-textarea[formControlName="description"] textarea'));
  couponNrInput = element(by.css('ion-input[formControlName="couponNr"] input'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }
  async setTitleInput(title: string): Promise<void> {
    await this.titleInput.sendKeys(title);
  }
  async setValueInput(value: string): Promise<void> {
    await this.valueInput.sendKeys(value);
  }
  async setDescriptionInput(description: string): Promise<void> {
    await this.descriptionInput.sendKeys(description);
  }
  async setCouponNrInput(couponNr: string): Promise<void> {
    await this.couponNrInput.sendKeys(couponNr);
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }
}

export class CouponDetailPage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  deleteButton = element(by.css('ion-button[color="danger"]'));
  idInput = element.all(by.css('span')).get(1);

  titleInput = element.all(by.css('span')).get(2);

  valueInput = element.all(by.css('span')).get(3);

  descriptionInput = element.all(by.css('span')).get(4);

  couponNrInput = element.all(by.css('span')).get(5);

  async getIdInput(): Promise<string> {
    return await this.idInput.getText();
  }

  async getTitleInput(): Promise<string> {
    return await this.titleInput.getText();
  }

  async getValueInput(): Promise<string> {
    return await this.valueInput.getText();
  }

  async getDescriptionInput(): Promise<string> {
    return await this.descriptionInput.getText();
  }

  async getCouponNrInput(): Promise<string> {
    return await this.couponNrInput.getText();
  }

  async clickOnDeleteButton(): Promise<void> {
    await this.deleteButton.click();
  }

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }
}
