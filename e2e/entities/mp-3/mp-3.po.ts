import { element, by, browser, ElementFinder } from 'protractor';

export class Mp3ComponentsPage {
  createButton = element(by.css('ion-fab-button'));
  viewButtons = element.all(by.css('ion-item'));
  title = element.all(by.css('ion-title')).get(2);
  noResult = element(by.cssContainingText('ion-label', 'No Mp 3 S found.'));
  entities = element.all(by.css('page-mp-3 ion-item'));

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

export class Mp3UpdatePage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  saveButton = element.all(by.css('ion-button')).get(1);

  idInput = element(by.css('ion-input[formControlName="id"] input'));
  titleInput = element(by.css('ion-input[formControlName="title"] input'));
  artistsInput = element(by.css('ion-input[formControlName="artists"] input'));
  durationInput = element(by.css('ion-input[formControlName="duration"] input'));
  urlInput = element(by.css('ion-input[formControlName="url"] input'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }
  async setTitleInput(title: string): Promise<void> {
    await this.titleInput.sendKeys(title);
  }
  async setArtistsInput(artists: string): Promise<void> {
    await this.artistsInput.sendKeys(artists);
  }
  async setDurationInput(duration: string): Promise<void> {
    await this.durationInput.sendKeys(duration);
  }
  async setUrlInput(url: string): Promise<void> {
    await this.urlInput.sendKeys(url);
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }
}

export class Mp3DetailPage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  deleteButton = element(by.css('ion-button[color="danger"]'));
  idInput = element.all(by.css('span')).get(1);

  titleInput = element.all(by.css('span')).get(2);

  artistsInput = element.all(by.css('span')).get(3);

  durationInput = element.all(by.css('span')).get(4);

  urlInput = element.all(by.css('span')).get(5);

  async getIdInput(): Promise<string> {
    return await this.idInput.getText();
  }

  async getTitleInput(): Promise<string> {
    return await this.titleInput.getText();
  }

  async getArtistsInput(): Promise<string> {
    return await this.artistsInput.getText();
  }

  async getDurationInput(): Promise<string> {
    return await this.durationInput.getText();
  }

  async getUrlInput(): Promise<string> {
    return await this.urlInput.getText();
  }

  async clickOnDeleteButton(): Promise<void> {
    await this.deleteButton.click();
  }

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }
}
