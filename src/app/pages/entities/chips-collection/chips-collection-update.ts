import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ChipsCollection } from './chips-collection.model';
import { ChipsCollectionService } from './chips-collection.service';
import { User } from '../../../services/user/user.model';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'page-chips-collection-update',
  templateUrl: 'chips-collection-update.html',
})
export class ChipsCollectionUpdatePage implements OnInit {
  chipsCollection: ChipsCollection;
  users: User[];
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    user: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private userService: UserService,
    private chipsCollectionService: ChipsCollectionService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.userService.findAll().subscribe(
      (data) => (this.users = data),
      (error) => this.onError(error)
    );
    this.activatedRoute.data.subscribe((response) => {
      this.chipsCollection = response.data;
      this.isNew = this.chipsCollection.id === null || this.chipsCollection.id === undefined;
      this.updateForm(this.chipsCollection);
    });
  }

  updateForm(chipsCollection: ChipsCollection) {
    this.form.patchValue({
      id: chipsCollection.id,
      user: chipsCollection.user,
    });
  }

  save() {
    this.isSaving = true;
    const chipsCollection = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.chipsCollectionService.update(chipsCollection));
    } else {
      this.subscribeToSaveResponse(this.chipsCollectionService.create(chipsCollection));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ChipsCollection>>) {
    result.subscribe(
      (res: HttpResponse<ChipsCollection>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `ChipsCollection ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/chips-collection');
  }

  previousState() {
    window.history.back();
  }

  async onError(error) {
    this.isSaving = false;
    console.error(error);
    const toast = await this.toastCtrl.create({ message: 'Failed to load data', duration: 2000, position: 'middle' });
    await toast.present();
  }

  private createFromForm(): ChipsCollection {
    return {
      ...new ChipsCollection(),
      id: this.form.get(['id']).value,
      user: this.form.get(['user']).value,
    };
  }

  compareUser(first: User, second: User): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackUserById(index: number, item: User) {
    return item.id;
  }
}
