import { element, by, browser, ElementFinder } from 'protractor';

export class ServiceLikeDislikeComponentsPage {
  createButton = element(by.css('ion-fab-button'));
  viewButtons = element.all(by.css('ion-item'));
  title = element.all(by.css('ion-title')).get(2);
  noResult = element(by.cssContainingText('ion-label', 'No Service Like Dislikes found.'));
  entities = element.all(by.css('page-service-like-dislike ion-item'));

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

export class ServiceLikeDislikeUpdatePage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  saveButton = element.all(by.css('ion-button')).get(1);

  idInput = element(by.css('ion-input[formControlName="id"] input'));
  likeInput = element(by.css('ion-input[formControlName="like"] input'));
  dislikeInput = element(by.css('ion-input[formControlName="dislike"] input'));
  commentInput = element(by.css('ion-input[formControlName="comment"] input'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }
  async setLikeInput(like: string): Promise<void> {
    await this.likeInput.sendKeys(like);
  }
  async setDislikeInput(dislike: string): Promise<void> {
    await this.dislikeInput.sendKeys(dislike);
  }
  async setCommentInput(comment: string): Promise<void> {
    await this.commentInput.sendKeys(comment);
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }
}

export class ServiceLikeDislikeDetailPage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  deleteButton = element(by.css('ion-button[color="danger"]'));
  idInput = element.all(by.css('span')).get(1);

  likeInput = element.all(by.css('span')).get(2);

  dislikeInput = element.all(by.css('span')).get(3);

  commentInput = element.all(by.css('span')).get(5);

  async getIdInput(): Promise<string> {
    return await this.idInput.getText();
  }

  async getLikeInput(): Promise<string> {
    return await this.likeInput.getText();
  }

  async getDislikeInput(): Promise<string> {
    return await this.dislikeInput.getText();
  }

  async getCommentInput(): Promise<string> {
    return await this.commentInput.getText();
  }

  async clickOnDeleteButton(): Promise<void> {
    await this.deleteButton.click();
  }

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }
}
