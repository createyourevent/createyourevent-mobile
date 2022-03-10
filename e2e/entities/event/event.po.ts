import { element, by, browser, ElementFinder } from 'protractor';

export class EventComponentsPage {
  createButton = element(by.css('ion-fab-button'));
  viewButtons = element.all(by.css('ion-item'));
  title = element.all(by.css('ion-title')).get(2);
  noResult = element(by.cssContainingText('ion-label', 'No Events found.'));
  entities = element.all(by.css('page-event ion-item'));

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

export class EventUpdatePage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  saveButton = element.all(by.css('ion-button')).get(1);

  idInput = element(by.css('ion-input[formControlName="id"] input'));
  nameInput = element(by.css('ion-input[formControlName="name"] input'));
  descriptionInput = element(by.css('ion-textarea[formControlName="description"] textarea'));
  categorySelect = element(by.css('ion-select[formControlName="category"]'));
  priceInput = element(by.css('ion-input[formControlName="price"] input'));
  flyerInput = element(by.css('ion-input[formControlName="flyer"] input'));
  youtubeInput = element(by.css('ion-input[formControlName="youtube"] input'));
  privateOrPublicInput = element(by.css('ion-input[formControlName="privateOrPublic"] input'));
  minPlacenumberInput = element(by.css('ion-input[formControlName="minPlacenumber"] input'));
  placenumberInput = element(by.css('ion-input[formControlName="placenumber"] input'));
  investmentInput = element(by.css('ion-input[formControlName="investment"] input'));
  statusSelect = element(by.css('ion-select[formControlName="status"]'));
  mottoInput = element(by.css('ion-input[formControlName="motto"] input'));
  starsInput = element(by.css('ion-input[formControlName="stars"] input'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }
  async setNameInput(name: string): Promise<void> {
    await this.nameInput.sendKeys(name);
  }
  async setDescriptionInput(description: string): Promise<void> {
    await this.descriptionInput.sendKeys(description);
  }
  async categorySelectLastOption(): Promise<void> {
    await this.categorySelect.click();
    await browser.sleep(500);
    await element.all(by.className('alert-radio')).last().click();
    await element.all(by.className('alert-button')).last().click();
  }
  async setPriceInput(price: string): Promise<void> {
    await this.priceInput.sendKeys(price);
  }
  async setFlyerInput(flyer: string): Promise<void> {
    await this.flyerInput.sendKeys(flyer);
  }
  async setYoutubeInput(youtube: string): Promise<void> {
    await this.youtubeInput.sendKeys(youtube);
  }
  async setPrivateOrPublicInput(privateOrPublic: string): Promise<void> {
    await this.privateOrPublicInput.sendKeys(privateOrPublic);
  }
  async setMinPlacenumberInput(minPlacenumber: string): Promise<void> {
    await this.minPlacenumberInput.sendKeys(minPlacenumber);
  }
  async setPlacenumberInput(placenumber: string): Promise<void> {
    await this.placenumberInput.sendKeys(placenumber);
  }
  async setInvestmentInput(investment: string): Promise<void> {
    await this.investmentInput.sendKeys(investment);
  }
  async statusSelectLastOption(): Promise<void> {
    await this.statusSelect.click();
    await browser.sleep(500);
    await element.all(by.className('alert-radio')).last().click();
    await element.all(by.className('alert-button')).last().click();
  }
  async setMottoInput(motto: string): Promise<void> {
    await this.mottoInput.sendKeys(motto);
  }
  async setStarsInput(stars: string): Promise<void> {
    await this.starsInput.sendKeys(stars);
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }
}

export class EventDetailPage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  deleteButton = element(by.css('ion-button[color="danger"]'));
  idInput = element.all(by.css('span')).get(1);

  nameInput = element.all(by.css('span')).get(2);

  descriptionInput = element.all(by.css('span')).get(3);

  priceInput = element.all(by.css('span')).get(7);

  flyerInput = element.all(by.css('span')).get(8);

  youtubeInput = element.all(by.css('span')).get(9);

  privateOrPublicInput = element.all(by.css('span')).get(10);

  minPlacenumberInput = element.all(by.css('span')).get(12);

  placenumberInput = element.all(by.css('span')).get(13);

  investmentInput = element.all(by.css('span')).get(14);

  mottoInput = element.all(by.css('span')).get(17);

  starsInput = element.all(by.css('span')).get(19);

  async getIdInput(): Promise<string> {
    return await this.idInput.getText();
  }

  async getNameInput(): Promise<string> {
    return await this.nameInput.getText();
  }

  async getDescriptionInput(): Promise<string> {
    return await this.descriptionInput.getText();
  }

  async getPriceInput(): Promise<string> {
    return await this.priceInput.getText();
  }

  async getFlyerInput(): Promise<string> {
    return await this.flyerInput.getText();
  }

  async getYoutubeInput(): Promise<string> {
    return await this.youtubeInput.getText();
  }

  async getPrivateOrPublicInput(): Promise<string> {
    return await this.privateOrPublicInput.getText();
  }

  async getMinPlacenumberInput(): Promise<string> {
    return await this.minPlacenumberInput.getText();
  }

  async getPlacenumberInput(): Promise<string> {
    return await this.placenumberInput.getText();
  }

  async getInvestmentInput(): Promise<string> {
    return await this.investmentInput.getText();
  }

  async getMottoInput(): Promise<string> {
    return await this.mottoInput.getText();
  }

  async getStarsInput(): Promise<string> {
    return await this.starsInput.getText();
  }

  async clickOnDeleteButton(): Promise<void> {
    await this.deleteButton.click();
  }

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }
}
