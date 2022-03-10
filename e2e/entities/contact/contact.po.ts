import { element, by, browser, ElementFinder } from 'protractor';

export class ContactComponentsPage {
  createButton = element(by.css('ion-fab-button'));
  viewButtons = element.all(by.css('ion-item'));
  title = element.all(by.css('ion-title')).get(2);
  noResult = element(by.cssContainingText('ion-label', 'No Contacts found.'));
  entities = element.all(by.css('page-contact ion-item'));

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

export class ContactUpdatePage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  saveButton = element.all(by.css('ion-button')).get(1);

  idInput = element(by.css('ion-input[formControlName="id"] input'));
  nameInput = element(by.css('ion-input[formControlName="name"] input'));
  emailInput = element(by.css('ion-input[formControlName="email"] input'));
  messageInput = element(by.css('ion-textarea[formControlName="message"] textarea'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }
  async setNameInput(name: string): Promise<void> {
    await this.nameInput.sendKeys(name);
  }
  async setEmailInput(email: string): Promise<void> {
    await this.emailInput.sendKeys(email);
  }
  async setMessageInput(message: string): Promise<void> {
    await this.messageInput.sendKeys(message);
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }
}

export class ContactDetailPage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  deleteButton = element(by.css('ion-button[color="danger"]'));
  idInput = element.all(by.css('span')).get(1);

  nameInput = element.all(by.css('span')).get(2);

  emailInput = element.all(by.css('span')).get(3);

  messageInput = element.all(by.css('span')).get(4);

  async getIdInput(): Promise<string> {
    return await this.idInput.getText();
  }

  async getNameInput(): Promise<string> {
    return await this.nameInput.getText();
  }

  async getEmailInput(): Promise<string> {
    return await this.emailInput.getText();
  }

  async getMessageInput(): Promise<string> {
    return await this.messageInput.getText();
  }

  async clickOnDeleteButton(): Promise<void> {
    await this.deleteButton.click();
  }

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }
}
