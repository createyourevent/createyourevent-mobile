import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Building } from './building.model';
import { BuildingService } from './building.service';
import { Organization, OrganizationService } from '../organization';

@Component({
  selector: 'page-building-update',
  templateUrl: 'building-update.html',
})
export class BuildingUpdatePage implements OnInit {
  building: Building;
  organizations: Organization[];
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    surface: [null, []],
    organization: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private organizationService: OrganizationService,
    private buildingService: BuildingService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.organizationService.query({ filter: 'building-is-null' }).subscribe(
      (data) => {
        if (!this.building.organization || !this.building.organization.id) {
          this.organizations = data.body;
        } else {
          this.organizationService.find(this.building.organization.id).subscribe(
            (subData: HttpResponse<Organization>) => {
              this.organizations = [subData.body].concat(subData.body);
            },
            (error) => this.onError(error)
          );
        }
      },
      (error) => this.onError(error)
    );
    this.activatedRoute.data.subscribe((response) => {
      this.building = response.data;
      this.isNew = this.building.id === null || this.building.id === undefined;
      this.updateForm(this.building);
    });
  }

  updateForm(building: Building) {
    this.form.patchValue({
      id: building.id,
      surface: building.surface,
      organization: building.organization,
    });
  }

  save() {
    this.isSaving = true;
    const building = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.buildingService.update(building));
    } else {
      this.subscribeToSaveResponse(this.buildingService.create(building));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Building>>) {
    result.subscribe(
      (res: HttpResponse<Building>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `Building ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/building');
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

  private createFromForm(): Building {
    return {
      ...new Building(),
      id: this.form.get(['id']).value,
      surface: this.form.get(['surface']).value,
      organization: this.form.get(['organization']).value,
    };
  }

  compareOrganization(first: Organization, second: Organization): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackOrganizationById(index: number, item: Organization) {
    return item.id;
  }
}
