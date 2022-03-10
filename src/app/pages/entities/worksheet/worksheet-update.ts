import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Worksheet } from './worksheet.model';
import { WorksheetService } from './worksheet.service';
import { User } from '../../../services/user/user.model';
import { UserService } from '../../../services/user/user.service';
import { Event, EventService } from '../event';
import { Product, ProductService } from '../product';

@Component({
  selector: 'page-worksheet-update',
  templateUrl: 'worksheet-update.html',
})
export class WorksheetUpdatePage implements OnInit {
  worksheet: Worksheet;
  users: User[];
  events: Event[];
  products: Product[];
  start: string;
  end: string;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    description: [null, [Validators.required]],
    start: [null, [Validators.required]],
    end: [null, [Validators.required]],
    costHour: [null, [Validators.required]],
    total: [null, [Validators.required]],
    billingType: [null, []],
    userType: [null, []],
    user: [null, []],
    event: [null, []],
    product: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private userService: UserService,
    private eventService: EventService,
    private productService: ProductService,
    private worksheetService: WorksheetService
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
    this.eventService.query().subscribe(
      (data) => {
        this.events = data.body;
      },
      (error) => this.onError(error)
    );
    this.productService.query().subscribe(
      (data) => {
        this.products = data.body;
      },
      (error) => this.onError(error)
    );
    this.activatedRoute.data.subscribe((response) => {
      this.worksheet = response.data;
      this.isNew = this.worksheet.id === null || this.worksheet.id === undefined;
      this.updateForm(this.worksheet);
    });
  }

  updateForm(worksheet: Worksheet) {
    this.form.patchValue({
      id: worksheet.id,
      description: worksheet.description,
      start: this.isNew ? new Date().toISOString() : worksheet.start,
      end: this.isNew ? new Date().toISOString() : worksheet.end,
      costHour: worksheet.costHour,
      total: worksheet.total,
      billingType: worksheet.billingType,
      userType: worksheet.userType,
      user: worksheet.user,
      event: worksheet.event,
      product: worksheet.product,
    });
  }

  save() {
    this.isSaving = true;
    const worksheet = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.worksheetService.update(worksheet));
    } else {
      this.subscribeToSaveResponse(this.worksheetService.create(worksheet));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Worksheet>>) {
    result.subscribe(
      (res: HttpResponse<Worksheet>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `Worksheet ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/worksheet');
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

  private createFromForm(): Worksheet {
    return {
      ...new Worksheet(),
      id: this.form.get(['id']).value,
      description: this.form.get(['description']).value,
      start: new Date(this.form.get(['start']).value),
      end: new Date(this.form.get(['end']).value),
      costHour: this.form.get(['costHour']).value,
      total: this.form.get(['total']).value,
      billingType: this.form.get(['billingType']).value,
      userType: this.form.get(['userType']).value,
      user: this.form.get(['user']).value,
      event: this.form.get(['event']).value,
      product: this.form.get(['product']).value,
    };
  }

  compareUser(first: User, second: User): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackUserById(index: number, item: User) {
    return item.id;
  }
  compareEvent(first: Event, second: Event): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackEventById(index: number, item: Event) {
    return item.id;
  }
  compareProduct(first: Product, second: Product): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackProductById(index: number, item: Product) {
    return item.id;
  }
}
