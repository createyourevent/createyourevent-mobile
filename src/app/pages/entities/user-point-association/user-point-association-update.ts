import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { UserPointAssociation } from './user-point-association.model';
import { UserPointAssociationService } from './user-point-association.service';
import { Point, PointService } from '../point';
import { User } from '../../../services/user/user.model';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'page-user-point-association-update',
  templateUrl: 'user-point-association-update.html',
})
export class UserPointAssociationUpdatePage implements OnInit {
  userPointAssociation: UserPointAssociation;
  points: Point[];
  users: User[];
  date: string;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    date: [null, []],
    points: [null, []],
    users: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private pointService: PointService,
    private userService: UserService,
    private userPointAssociationService: UserPointAssociationService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.pointService.query().subscribe(
      (data) => {
        this.points = data.body;
      },
      (error) => this.onError(error)
    );
    this.userService.findAll().subscribe(
      (data) => (this.users = data),
      (error) => this.onError(error)
    );
    this.activatedRoute.data.subscribe((response) => {
      this.userPointAssociation = response.data;
      this.isNew = this.userPointAssociation.id === null || this.userPointAssociation.id === undefined;
      this.updateForm(this.userPointAssociation);
    });
  }

  updateForm(userPointAssociation: UserPointAssociation) {
    this.form.patchValue({
      id: userPointAssociation.id,
      date: this.isNew ? new Date().toISOString() : userPointAssociation.date,
      points: userPointAssociation.points,
      users: userPointAssociation.users,
    });
  }

  save() {
    this.isSaving = true;
    const userPointAssociation = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.userPointAssociationService.update(userPointAssociation));
    } else {
      this.subscribeToSaveResponse(this.userPointAssociationService.create(userPointAssociation));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<UserPointAssociation>>) {
    result.subscribe(
      (res: HttpResponse<UserPointAssociation>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({
      message: `UserPointAssociation ${action} successfully.`,
      duration: 2000,
      position: 'middle',
    });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/user-point-association');
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

  private createFromForm(): UserPointAssociation {
    return {
      ...new UserPointAssociation(),
      id: this.form.get(['id']).value,
      date: new Date(this.form.get(['date']).value),
      points: this.form.get(['points']).value,
      users: this.form.get(['users']).value,
    };
  }

  comparePoint(first: Point, second: Point): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackPointById(index: number, item: Point) {
    return item.id;
  }
  compareUser(first: User, second: User): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackUserById(index: number, item: User) {
    return item.id;
  }
}
