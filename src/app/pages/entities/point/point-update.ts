import { Component, OnInit } from '@angular/core';
import { JhiDataUtils } from 'src/app/services/utils/data-util.service';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Point } from './point.model';
import { PointService } from './point.service';

@Component({
  selector: 'page-point-update',
  templateUrl: 'point-update.html',
})
export class PointUpdatePage implements OnInit {
  point: Point;
  creationDate: string;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    key: [null, []],
    name: [null, []],
    keyName: [null, []],
    description: [null, []],
    keyDescription: [null, []],
    category: [null, []],
    points: [null, []],
    countPerDay: [null, []],
    creationDate: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private dataUtils: JhiDataUtils,
    private pointService: PointService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe((response) => {
      this.point = response.data;
      this.isNew = this.point.id === null || this.point.id === undefined;
      this.updateForm(this.point);
    });
  }

  updateForm(point: Point) {
    this.form.patchValue({
      id: point.id,
      key: point.key,
      name: point.name,
      keyName: point.keyName,
      description: point.description,
      keyDescription: point.keyDescription,
      category: point.category,
      points: point.points,
      countPerDay: point.countPerDay,
      creationDate: this.isNew ? new Date().toISOString() : point.creationDate,
    });
  }

  save() {
    this.isSaving = true;
    const point = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.pointService.update(point));
    } else {
      this.subscribeToSaveResponse(this.pointService.create(point));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Point>>) {
    result.subscribe(
      (res: HttpResponse<Point>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `Point ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/point');
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

  private createFromForm(): Point {
    return {
      ...new Point(),
      id: this.form.get(['id']).value,
      key: this.form.get(['key']).value,
      name: this.form.get(['name']).value,
      keyName: this.form.get(['keyName']).value,
      description: this.form.get(['description']).value,
      keyDescription: this.form.get(['keyDescription']).value,
      category: this.form.get(['category']).value,
      points: this.form.get(['points']).value,
      countPerDay: this.form.get(['countPerDay']).value,
      creationDate: new Date(this.form.get(['creationDate']).value),
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
}
