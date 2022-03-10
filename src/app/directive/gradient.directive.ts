import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[gradient]',
})
export class GradientDirective {
  constructor(private element: ElementRef, private renderer: Renderer2) {
    renderer.addClass(this.element.nativeElement, 'gradient_' + this.getRandomInt(1, 30));
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
