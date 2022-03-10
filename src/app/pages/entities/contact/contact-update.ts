import { Component, OnInit } from '@angular/core';
import { JhiDataUtils } from 'src/app/services/utils/data-util.service';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Contact } from './contact.model';
import { ContactService } from './contact.service';

@Component({
  selector: 'page-contact-update',
  templateUrl: 'contact-update.html',
})
export class ContactUpdatePage implements OnInit {
  contact: Contact;
  date: string;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    name: [null, [Validators.required]],
    email: [null, [Validators.required]],
    message: [null, [Validators.required]],
    date: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private dataUtils: JhiDataUtils,
    private contactService: ContactService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe((response) => {
      this.contact = response.data;
      this.isNew = this.contact.id === null || this.contact.id === undefined;
      this.updateForm(this.contact);
    });
  }

  updateForm(contact: Contact) {
    this.form.patchValue({
      id: contact.id,
      name: contact.name,
      email: contact.email,
      message: contact.message,
      date: this.isNew ? new Date().toISOString() : contact.date,
    });
  }

  save() {
    this.isSaving = true;
    const contact = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.contactService.update(contact));
    } else {
      this.subscribeToSaveResponse(this.contactService.create(contact));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Contact>>) {
    result.subscribe(
      (res: HttpResponse<Contact>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `Contact ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/contact');
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

  private createFromForm(): Contact {
    return {
      ...new Contact(),
      id: this.form.get(['id']).value,
      name: this.form.get(['name']).value,
      email: this.form.get(['email']).value,
      message: this.form.get(['message']).value,
      date: new Date(this.form.get(['date']).value),
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
