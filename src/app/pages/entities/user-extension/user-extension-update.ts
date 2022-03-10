import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { UserExtension } from './user-extension.model';
import { UserExtensionService } from './user-extension.service';
import { User } from '../../../services/user/user.model';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'page-user-extension-update',
  templateUrl: 'user-extension-update.html',
})
export class UserExtensionUpdatePage implements OnInit {
  userExtension: UserExtension;
  users: User[];
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    address: [null, []],
    phone: [null, []],
    loggedIn: ['false', []],
    points: [null, []],
    user: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private userService: UserService,
    private userExtensionService: UserExtensionService
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
      this.userExtension = response.data;
      this.isNew = this.userExtension.id === null || this.userExtension.id === undefined;
      this.updateForm(this.userExtension);
    });
  }

  updateForm(userExtension: UserExtension) {
    this.form.patchValue({
      id: userExtension.id,
      address: userExtension.address,
      phone: userExtension.phone,
      loggedIn: userExtension.loggedIn,
      points: userExtension.points,
      user: userExtension.user,
    });
  }

  save() {
    this.isSaving = true;
    const userExtension = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.userExtensionService.update(userExtension));
    } else {
      this.subscribeToSaveResponse(this.userExtensionService.create(userExtension));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<UserExtension>>) {
    result.subscribe(
      (res: HttpResponse<UserExtension>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `UserExtension ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/user-extension');
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

  private createFromForm(): UserExtension {
    return {
      ...new UserExtension(),
      id: this.form.get(['id']).value,
      address: this.form.get(['address']).value,
      phone: this.form.get(['phone']).value,
      loggedIn: this.form.get(['loggedIn']).value,
      points: this.form.get(['points']).value,
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
