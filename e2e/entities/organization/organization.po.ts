import { element, by, browser, ElementFinder } from 'protractor';

export class OrganizationComponentsPage {
  createButton = element(by.css('ion-fab-button'));
  viewButtons = element.all(by.css('ion-item'));
  title = element.all(by.css('ion-title')).get(2);
  noResult = element(by.cssContainingText('ion-label', 'No Organizations found.'));
  entities = element.all(by.css('page-organization ion-item'));

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

export class OrganizationUpdatePage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  saveButton = element.all(by.css('ion-button')).get(1);

  idInput = element(by.css('ion-input[formControlName="id"] input'));
  nameInput = element(by.css('ion-input[formControlName="name"] input'));
  organizationTypeSelect = element(by.css('ion-select[formControlName="organizationType"]'));
  logoInput = element(by.css('ion-input[formControlName="logo"] input'));
  descriptionInput = element(by.css('ion-textarea[formControlName="description"] textarea'));
  addressInput = element(by.css('ion-input[formControlName="address"] input'));
  mottoInput = element(by.css('ion-input[formControlName="motto"] input'));
  phoneInput = element(by.css('ion-input[formControlName="phone"] input'));
  webAddressInput = element(by.css('ion-input[formControlName="webAddress"] input'));
  placeNumberInput = element(by.css('ion-input[formControlName="placeNumber"] input'));
  priceInput = element(by.css('ion-input[formControlName="price"] input'));
  rentTypeSelect = element(by.css('ion-select[formControlName="rentType"]'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }
  async setNameInput(name: string): Promise<void> {
    await this.nameInput.sendKeys(name);
  }
  async organizationTypeSelectLastOption(): Promise<void> {
    await this.organizationTypeSelect.click();
    await browser.sleep(500);
    await element.all(by.className('alert-radio')).last().click();
    await element.all(by.className('alert-button')).last().click();
  }
  async setLogoInput(logo: string): Promise<void> {
    await this.logoInput.sendKeys(logo);
  }
  async setDescriptionInput(description: string): Promise<void> {
    await this.descriptionInput.sendKeys(description);
  }
  async setAddressInput(address: string): Promise<void> {
    await this.addressInput.sendKeys(address);
  }
  async setMottoInput(motto: string): Promise<void> {
    await this.mottoInput.sendKeys(motto);
  }
  async setPhoneInput(phone: string): Promise<void> {
    await this.phoneInput.sendKeys(phone);
  }
  async setWebAddressInput(webAddress: string): Promise<void> {
    await this.webAddressInput.sendKeys(webAddress);
  }
  async setPlaceNumberInput(placeNumber: string): Promise<void> {
    await this.placeNumberInput.sendKeys(placeNumber);
  }
  async setPriceInput(price: string): Promise<void> {
    await this.priceInput.sendKeys(price);
  }
  async rentTypeSelectLastOption(): Promise<void> {
    await this.rentTypeSelect.click();
    await browser.sleep(500);
    await element.all(by.className('alert-radio')).last().click();
    await element.all(by.className('alert-button')).last().click();
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }
}

export class OrganizationDetailPage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  deleteButton = element(by.css('ion-button[color="danger"]'));
  idInput = element.all(by.css('span')).get(1);

  nameInput = element.all(by.css('span')).get(2);

  logoInput = element.all(by.css('span')).get(4);

  descriptionInput = element.all(by.css('span')).get(7);

  addressInput = element.all(by.css('span')).get(8);

  mottoInput = element.all(by.css('span')).get(9);

  phoneInput = element.all(by.css('span')).get(10);

  webAddressInput = element.all(by.css('span')).get(11);

  placeNumberInput = element.all(by.css('span')).get(12);

  priceInput = element.all(by.css('span')).get(13);

  async getIdInput(): Promise<string> {
    return await this.idInput.getText();
  }

  async getNameInput(): Promise<string> {
    return await this.nameInput.getText();
  }

  async getLogoInput(): Promise<string> {
    return await this.logoInput.getText();
  }

  async getDescriptionInput(): Promise<string> {
    return await this.descriptionInput.getText();
  }

  async getAddressInput(): Promise<string> {
    return await this.addressInput.getText();
  }

  async getMottoInput(): Promise<string> {
    return await this.mottoInput.getText();
  }

  async getPhoneInput(): Promise<string> {
    return await this.phoneInput.getText();
  }

  async getWebAddressInput(): Promise<string> {
    return await this.webAddressInput.getText();
  }

  async getPlaceNumberInput(): Promise<string> {
    return await this.placeNumberInput.getText();
  }

  async getPriceInput(): Promise<string> {
    return await this.priceInput.getText();
  }

  async clickOnDeleteButton(): Promise<void> {
    await this.deleteButton.click();
  }

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }
}
