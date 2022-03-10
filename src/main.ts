import { LOCALE_ID } from '@angular/core';
import { enableProdMode, DEFAULT_CURRENCY_CODE  } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import localeDECH from '@angular/common/locales/de-CH';
import { CommonModule, registerLocaleData } from '@angular/common';


registerLocaleData(localeDECH);

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule, {
    providers: [
      { provide: LOCALE_ID, useValue: 'de-CH' },
      { provide: DEFAULT_CURRENCY_CODE, useValue: 'CHF' }
    ],
  })
  .catch((err) => console.log(err));
