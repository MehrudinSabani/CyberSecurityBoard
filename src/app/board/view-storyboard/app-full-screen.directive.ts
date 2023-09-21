import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[AppFullScreen]'
})
export class FullscreenDirective {
  private isFullscreen = false;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) { }

  @HostListener('click') onClick() {
    if (this.isFullscreen) {
      this.renderer.removeClass(this.el.nativeElement, 'fullscreen');
    } else {
      this.renderer.addClass(this.el.nativeElement, 'fullscreen');
    }

    this.isFullscreen = !this.isFullscreen;
  }
}