import { element, by, browser, ElementFinder } from 'protractor';

export class HotelComponentsPage {
  createButton = element(by.css('ion-fab-button'));
  viewButtons = element.all(by.css('ion-item'));
  title = element.all(by.css('ion-title')).get(2);
  noResult = element(by.cssContainingText('ion-label', 'No Hotels found.'));
  entities = element.all(by.css('page-hotel ion-item'));

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

export class HotelUpdatePage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  saveButton = element.all(by.css('ion-button')).get(1);

  idInput = element(by.css('ion-input[formControlName="id"] input'));
  menuInput = element(by.css('ion-textarea[formControlName="menu"] textarea'));
  placesToSleepInput = element(by.css('ion-input[formControlName="placesToSleep"] input'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }
  async setMenuInput(menu: string): Promise<void> {
    await this.menuInput.sendKeys(menu);
  }
  async setPlacesToSleepInput(placesToSleep: string): Promise<void> {
    await this.placesToSleepInput.sendKeys(placesToSleep);
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }
}

export class HotelDetailPage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  deleteButton = element(by.css('ion-button[color="danger"]'));
  idInput = element.all(by.css('span')).get(1);

  menuInput = element.all(by.css('span')).get(2);

  placesToSleepInput = element.all(by.css('span')).get(3);

  async getIdInput(): Promise<string> {
    return await this.idInput.getText();
  }

  async getMenuInput(): Promise<string> {
    return await this.menuInput.getText();
  }

  async getPlacesToSleepInput(): Promise<string> {
    return await this.placesToSleepInput.getText();
  }

  async clickOnDeleteButton(): Promise<void> {
    await this.deleteButton.click();
  }

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }
}
