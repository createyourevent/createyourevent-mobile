import { NgModule } from '@angular/core';
import { GradientDirective } from '../directive/gradient.directive';
import { SafeHtmlPipe } from '../pipe/safeHtml.pipe';

@NgModule({
  imports: [],
  declarations: [GradientDirective, SafeHtmlPipe],
  exports: [GradientDirective, SafeHtmlPipe],
})
export class SharedModule {}
