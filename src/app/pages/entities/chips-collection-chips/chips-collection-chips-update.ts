import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ChipsCollectionChips } from './chips-collection-chips.model';
import { ChipsCollectionChipsService } from './chips-collection-chips.service';
import { ChipsCollection, ChipsCollectionService } from '../chips-collection';
import { Chips, ChipsService } from '../chips';

@Component({
  selector: 'page-chips-collection-chips-update',
  templateUrl: 'chips-collection-chips-update.html',
})
export class ChipsCollectionChipsUpdatePage implements OnInit {
  chipsCollectionChips: ChipsCollectionChips;
  chipsCollections: ChipsCollection[];
  chips: Chips[];
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    chipsCollection: [null, []],
    chips: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private chipsCollectionService: ChipsCollectionService,
    private chipsService: ChipsService,
    private chipsCollectionChipsService: ChipsCollectionChipsService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.chipsCollectionService.query().subscribe(
      (data) => {
        this.chipsCollections = data.body;
      },
      (error) => this.onError(error)
    );
    this.chipsService.query().subscribe(
      (data) => {
        this.chips = data.body;
      },
      (error) => this.onError(error)
    );
    this.activatedRoute.data.subscribe((response) => {
      this.chipsCollectionChips = response.data;
      this.isNew = this.chipsCollectionChips.id === null || this.chipsCollectionChips.id === undefined;
      this.updateForm(this.chipsCollectionChips);
    });
  }

  updateForm(chipsCollectionChips: ChipsCollectionChips) {
    this.form.patchValue({
      id: chipsCollectionChips.id,
      chipsCollection: chipsCollectionChips.chipsCollection,
      chips: chipsCollectionChips.chips,
    });
  }

  save() {
    this.isSaving = true;
    const chipsCollectionChips = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.chipsCollectionChipsService.update(chipsCollectionChips));
    } else {
      this.subscribeToSaveResponse(this.chipsCollectionChipsService.create(chipsCollectionChips));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ChipsCollectionChips>>) {
    result.subscribe(
      (res: HttpResponse<ChipsCollectionChips>) => this.onSaveSuccess(res),
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
      message: `ChipsCollectionChips ${action} successfully.`,
      duration: 2000,
      position: 'middle',
    });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/chips-collection-chips');
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

  private createFromForm(): ChipsCollectionChips {
    return {
      ...new ChipsCollectionChips(),
      id: this.form.get(['id']).value,
      chipsCollection: this.form.get(['chipsCollection']).value,
      chips: this.form.get(['chips']).value,
    };
  }

  compareChipsCollection(first: ChipsCollection, second: ChipsCollection): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackChipsCollectionById(index: number, item: ChipsCollection) {
    return item.id;
  }
  compareChips(first: Chips, second: Chips): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackChipsById(index: number, item: Chips) {
    return item.id;
  }
}
