import { Component, OnInit } from '@angular/core';
import { JhiDataUtils } from 'src/app/services/utils/data-util.service';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Bond } from './bond.model';
import { BondService } from './bond.service';
import { User } from '../../../services/user/user.model';
import { UserService } from '../../../services/user/user.service';
import { PointsExchange, PointsExchangeService } from '../points-exchange';

@Component({
  selector: 'page-bond-update',
  templateUrl: 'bond-update.html',
})
export class BondUpdatePage implements OnInit {
  bond: Bond;
  users: User[];
  pointsExchanges: PointsExchange[];
  creationDate: string;
  redemptionDate: string;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    name: [null, []],
    description: [null, []],
    code: [null, []],
    points: [null, []],
    creationDate: [null, []],
    redemptionDate: [null, []],
    user: [null, []],
    pointsExchange: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private dataUtils: JhiDataUtils,
    private userService: UserService,
    private pointsExchangeService: PointsExchangeService,
    private bondService: BondService
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
    this.pointsExchangeService.query().subscribe(
      (data) => {
        this.pointsExchanges = data.body;
      },
      (error) => this.onError(error)
    );
    this.activatedRoute.data.subscribe((response) => {
      this.bond = response.data;
      this.isNew = this.bond.id === null || this.bond.id === undefined;
      this.updateForm(this.bond);
    });
  }

  updateForm(bond: Bond) {
    this.form.patchValue({
      id: bond.id,
      name: bond.name,
      description: bond.description,
      code: bond.code,
      points: bond.points,
      creationDate: this.isNew ? new Date().toISOString() : bond.creationDate,
      redemptionDate: this.isNew ? new Date().toISOString() : bond.redemptionDate,
      user: bond.user,
      pointsExchange: bond.pointsExchange,
    });
  }

  save() {
    this.isSaving = true;
    const bond = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.bondService.update(bond));
    } else {
      this.subscribeToSaveResponse(this.bondService.create(bond));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Bond>>) {
    result.subscribe(
      (res: HttpResponse<Bond>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `Bond ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/bond');
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

  private createFromForm(): Bond {
    return {
      ...new Bond(),
      id: this.form.get(['id']).value,
      name: this.form.get(['name']).value,
      description: this.form.get(['description']).value,
      code: this.form.get(['code']).value,
      points: this.form.get(['points']).value,
      creationDate: new Date(this.form.get(['creationDate']).value),
      redemptionDate: new Date(this.form.get(['redemptionDate']).value),
      user: this.form.get(['user']).value,
      pointsExchange: this.form.get(['pointsExchange']).value,
    };
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }

  setFileData(event, field, isImage) {
    this.dataUtils.loadFileToForm(event, this.form, field, isImage).subscribe();
  }

  compareUser(first: User, second: User): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackUserById(index: number, item: User) {
    return item.id;
  }
  comparePointsExchange(first: PointsExchange, second: PointsExchange): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackPointsExchangeById(index: number, item: PointsExchange) {
    return item.id;
  }
}
