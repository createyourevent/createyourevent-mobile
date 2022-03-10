import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ChipsAdmin } from './chips-admin.model';
import { ChipsAdminService } from './chips-admin.service';

@Component({
  selector: 'page-chips-admin-update',
  templateUrl: 'chips-admin-update.html',
})
export class ChipsAdminUpdatePage implements OnInit {
  chipsAdmin: ChipsAdmin;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    gameActive: ['false', []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private chipsAdminService: ChipsAdminService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe((response) => {
      this.chipsAdmin = response.data;
      this.isNew = this.chipsAdmin.id === null || this.chipsAdmin.id === undefined;
      this.updateForm(this.chipsAdmin);
    });
  }

  updateForm(chipsAdmin: ChipsAdmin) {
    this.form.patchValue({
      id: chipsAdmin.id,
      gameActive: chipsAdmin.gameActive,
    });
  }

  save() {
    this.isSaving = true;
    const chipsAdmin = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.chipsAdminService.update(chipsAdmin));
    } else {
      this.subscribeToSaveResponse(this.chipsAdminService.create(chipsAdmin));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ChipsAdmin>>) {
    result.subscribe(
      (res: HttpResponse<ChipsAdmin>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `ChipsAdmin ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/chips-admin');
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

  private createFromForm(): ChipsAdmin {
    return {
      ...new ChipsAdmin(),
      id: this.form.get(['id']).value,
      gameActive: this.form.get(['gameActive']).value,
    };
  }
}
