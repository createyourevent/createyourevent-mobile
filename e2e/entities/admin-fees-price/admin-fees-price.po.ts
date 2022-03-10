import { element, by, browser, ElementFinder } from 'protractor';

export class AdminFeesPriceComponentsPage {
  createButton = element(by.css('ion-fab-button'));
  viewButtons = element.all(by.css('ion-item'));
  title = element.all(by.css('ion-title')).get(2);
  noResult = element(by.cssContainingText('ion-label', 'No Admin Fees Prices found.'));
  entities = element.all(by.css('page-admin-fees-price ion-item'));

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

export class AdminFeesPriceUpdatePage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  saveButton = element.all(by.css('ion-button')).get(1);

  idInput = element(by.css('ion-input[formControlName="id"] input'));
  feesOrganisatorInput = element(by.css('ion-input[formControlName="feesOrganisator"] input'));
  feesSupplierInput = element(by.css('ion-input[formControlName="feesSupplier"] input'));
  feesServiceInput = element(by.css('ion-input[formControlName="feesService"] input'));
  feesOrganizationsInput = element(by.css('ion-input[formControlName="feesOrganizations"] input'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }
  async setFeesOrganisatorInput(feesOrganisator: string): Promise<void> {
    await this.feesOrganisatorInput.sendKeys(feesOrganisator);
  }
  async setFeesSupplierInput(feesSupplier: string): Promise<void> {
    await this.feesSupplierInput.sendKeys(feesSupplier);
  }
  async setFeesServiceInput(feesService: string): Promise<void> {
    await this.feesServiceInput.sendKeys(feesService);
  }
  async setFeesOrganizationsInput(feesOrganizations: string): Promise<void> {
    await this.feesOrganizationsInput.sendKeys(feesOrganizations);
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }
}

export class AdminFeesPriceDetailPage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  deleteButton = element(by.css('ion-button[color="danger"]'));
  idInput = element.all(by.css('span')).get(1);

  feesOrganisatorInput = element.all(by.css('span')).get(2);

  feesSupplierInput = element.all(by.css('span')).get(3);

  feesServiceInput = element.all(by.css('span')).get(4);

  feesOrganizationsInput = element.all(by.css('span')).get(5);

  async getIdInput(): Promise<string> {
    return await this.idInput.getText();
  }

  async getFeesOrganisatorInput(): Promise<string> {
    return await this.feesOrganisatorInput.getText();
  }

  async getFeesSupplierInput(): Promise<string> {
    return await this.feesSupplierInput.getText();
  }

  async getFeesServiceInput(): Promise<string> {
    return await this.feesServiceInput.getText();
  }

  async getFeesOrganizationsInput(): Promise<string> {
    return await this.feesOrganizationsInput.getText();
  }

  async clickOnDeleteButton(): Promise<void> {
    await this.deleteButton.click();
  }

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }
}
