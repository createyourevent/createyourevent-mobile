import { element, by, browser, ElementFinder } from 'protractor';

export class ProductComponentsPage {
  createButton = element(by.css('ion-fab-button'));
  viewButtons = element.all(by.css('ion-item'));
  title = element.all(by.css('ion-title')).get(2);
  noResult = element(by.cssContainingText('ion-label', 'No Products found.'));
  entities = element.all(by.css('page-product ion-item'));

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

export class ProductUpdatePage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  saveButton = element.all(by.css('ion-button')).get(1);

  idInput = element(by.css('ion-input[formControlName="id"] input'));
  titleInput = element(by.css('ion-input[formControlName="title"] input'));
  keywordsInput = element(by.css('ion-input[formControlName="keywords"] input'));
  descriptionInput = element(by.css('ion-textarea[formControlName="description"] textarea'));
  priceTypeSelect = element(by.css('ion-select[formControlName="priceType"]'));
  rentTypeSelect = element(by.css('ion-select[formControlName="rentType"]'));
  priceInput = element(by.css('ion-input[formControlName="price"] input'));
  photoInput = element(by.css('ion-input[formControlName="photo"] input'));
  photo2Input = element(by.css('ion-input[formControlName="photo2"] input'));
  photo3Input = element(by.css('ion-input[formControlName="photo3"] input'));
  youtubeInput = element(by.css('ion-input[formControlName="youtube"] input'));
  stockInput = element(by.css('ion-input[formControlName="stock"] input'));
  productTypeSelect = element(by.css('ion-select[formControlName="productType"]'));
  itemNumberInput = element(by.css('ion-input[formControlName="itemNumber"] input'));
  statusSelect = element(by.css('ion-select[formControlName="status"]'));
  unitSelect = element(by.css('ion-select[formControlName="unit"]'));
  amountInput = element(by.css('ion-input[formControlName="amount"] input'));
  mottoInput = element(by.css('ion-input[formControlName="motto"] input'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }
  async setTitleInput(title: string): Promise<void> {
    await this.titleInput.sendKeys(title);
  }
  async setKeywordsInput(keywords: string): Promise<void> {
    await this.keywordsInput.sendKeys(keywords);
  }
  async setDescriptionInput(description: string): Promise<void> {
    await this.descriptionInput.sendKeys(description);
  }
  async priceTypeSelectLastOption(): Promise<void> {
    await this.priceTypeSelect.click();
    await browser.sleep(500);
    await element.all(by.className('alert-radio')).last().click();
    await element.all(by.className('alert-button')).last().click();
  }
  async rentTypeSelectLastOption(): Promise<void> {
    await this.rentTypeSelect.click();
    await browser.sleep(500);
    await element.all(by.className('alert-radio')).last().click();
    await element.all(by.className('alert-button')).last().click();
  }
  async setPriceInput(price: string): Promise<void> {
    await this.priceInput.sendKeys(price);
  }
  async setPhotoInput(photo: string): Promise<void> {
    await this.photoInput.sendKeys(photo);
  }
  async setPhoto2Input(photo2: string): Promise<void> {
    await this.photo2Input.sendKeys(photo2);
  }
  async setPhoto3Input(photo3: string): Promise<void> {
    await this.photo3Input.sendKeys(photo3);
  }
  async setYoutubeInput(youtube: string): Promise<void> {
    await this.youtubeInput.sendKeys(youtube);
  }
  async setStockInput(stock: string): Promise<void> {
    await this.stockInput.sendKeys(stock);
  }
  async productTypeSelectLastOption(): Promise<void> {
    await this.productTypeSelect.click();
    await browser.sleep(500);
    await element.all(by.className('alert-radio')).last().click();
    await element.all(by.className('alert-button')).last().click();
  }
  async setItemNumberInput(itemNumber: string): Promise<void> {
    await this.itemNumberInput.sendKeys(itemNumber);
  }
  async statusSelectLastOption(): Promise<void> {
    await this.statusSelect.click();
    await browser.sleep(500);
    await element.all(by.className('alert-radio')).last().click();
    await element.all(by.className('alert-button')).last().click();
  }
  async unitSelectLastOption(): Promise<void> {
    await this.unitSelect.click();
    await browser.sleep(500);
    await element.all(by.className('alert-radio')).last().click();
    await element.all(by.className('alert-button')).last().click();
  }
  async setAmountInput(amount: string): Promise<void> {
    await this.amountInput.sendKeys(amount);
  }
  async setMottoInput(motto: string): Promise<void> {
    await this.mottoInput.sendKeys(motto);
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }
}

export class ProductDetailPage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  deleteButton = element(by.css('ion-button[color="danger"]'));
  idInput = element.all(by.css('span')).get(1);

  titleInput = element.all(by.css('span')).get(2);

  keywordsInput = element.all(by.css('span')).get(3);

  descriptionInput = element.all(by.css('span')).get(4);

  priceInput = element.all(by.css('span')).get(9);

  photoInput = element.all(by.css('span')).get(10);

  photo2Input = element.all(by.css('span')).get(11);

  photo3Input = element.all(by.css('span')).get(12);

  youtubeInput = element.all(by.css('span')).get(13);

  stockInput = element.all(by.css('span')).get(15);

  itemNumberInput = element.all(by.css('span')).get(17);

  amountInput = element.all(by.css('span')).get(20);

  mottoInput = element.all(by.css('span')).get(21);

  async getIdInput(): Promise<string> {
    return await this.idInput.getText();
  }

  async getTitleInput(): Promise<string> {
    return await this.titleInput.getText();
  }

  async getKeywordsInput(): Promise<string> {
    return await this.keywordsInput.getText();
  }

  async getDescriptionInput(): Promise<string> {
    return await this.descriptionInput.getText();
  }

  async getPriceInput(): Promise<string> {
    return await this.priceInput.getText();
  }

  async getPhotoInput(): Promise<string> {
    return await this.photoInput.getText();
  }

  async getPhoto2Input(): Promise<string> {
    return await this.photo2Input.getText();
  }

  async getPhoto3Input(): Promise<string> {
    return await this.photo3Input.getText();
  }

  async getYoutubeInput(): Promise<string> {
    return await this.youtubeInput.getText();
  }

  async getStockInput(): Promise<string> {
    return await this.stockInput.getText();
  }

  async getItemNumberInput(): Promise<string> {
    return await this.itemNumberInput.getText();
  }

  async getAmountInput(): Promise<string> {
    return await this.amountInput.getText();
  }

  async getMottoInput(): Promise<string> {
    return await this.mottoInput.getText();
  }

  async clickOnDeleteButton(): Promise<void> {
    await this.deleteButton.click();
  }

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }
}
