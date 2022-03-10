import { element, by, browser, ElementFinder } from 'protractor';

export class PartnerComponentsPage {
  createButton = element(by.css('ion-fab-button'));
  viewButtons = element.all(by.css('ion-item'));
  title = element.all(by.css('ion-title')).get(2);
  noResult = element(by.cssContainingText('ion-label', 'No Partners found.'));
  entities = element.all(by.css('page-partner ion-item'));

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

export class PartnerUpdatePage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  saveButton = element.all(by.css('ion-button')).get(1);

  idInput = element(by.css('ion-input[formControlName="id"] input'));
  nameInput = element(by.css('ion-input[formControlName="name"] input'));
  addressInput = element(by.css('ion-input[formControlName="address"] input'));
  phoneInput = element(by.css('ion-input[formControlName="phone"] input'));
  logoInput = element(by.css('ion-input[formControlName="logo"] input'));
  mailInput = element(by.css('ion-input[formControlName="mail"] input'));
  webaddressInput = element(by.css('ion-input[formControlName="webaddress"] input'));
  sponsorshipAmountInput = element(by.css('ion-input[formControlName="sponsorshipAmount"] input'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }
  async setNameInput(name: string): Promise<void> {
    await this.nameInput.sendKeys(name);
  }
  async setAddressInput(address: string): Promise<void> {
    await this.addressInput.sendKeys(address);
  }
  async setPhoneInput(phone: string): Promise<void> {
    await this.phoneInput.sendKeys(phone);
  }
  async setLogoInput(logo: string): Promise<void> {
    await this.logoInput.sendKeys(logo);
  }
  async setMailInput(mail: string): Promise<void> {
    await this.mailInput.sendKeys(mail);
  }
  async setWebaddressInput(webaddress: string): Promise<void> {
    await this.webaddressInput.sendKeys(webaddress);
  }
  async setSponsorshipAmountInput(sponsorshipAmount: string): Promise<void> {
    await this.sponsorshipAmountInput.sendKeys(sponsorshipAmount);
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }
}

export class PartnerDetailPage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  deleteButton = element(by.css('ion-button[color="danger"]'));
  idInput = element.all(by.css('span')).get(1);

  nameInput = element.all(by.css('span')).get(2);

  addressInput = element.all(by.css('span')).get(3);

  phoneInput = element.all(by.css('span')).get(4);

  logoInput = element.all(by.css('span')).get(5);

  mailInput = element.all(by.css('span')).get(6);

  webaddressInput = element.all(by.css('span')).get(7);

  sponsorshipAmountInput = element.all(by.css('span')).get(8);

  async getIdInput(): Promise<string> {
    return await this.idInput.getText();
  }

  async getNameInput(): Promise<string> {
    return await this.nameInput.getText();
  }

  async getAddressInput(): Promise<string> {
    return await this.addressInput.getText();
  }

  async getPhoneInput(): Promise<string> {
    return await this.phoneInput.getText();
  }

  async getLogoInput(): Promise<string> {
    return await this.logoInput.getText();
  }

  async getMailInput(): Promise<string> {
    return await this.mailInput.getText();
  }

  async getWebaddressInput(): Promise<string> {
    return await this.webaddressInput.getText();
  }

  async getSponsorshipAmountInput(): Promise<string> {
    return await this.sponsorshipAmountInput.getText();
  }

  async clickOnDeleteButton(): Promise<void> {
    await this.deleteButton.click();
  }

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }
}
