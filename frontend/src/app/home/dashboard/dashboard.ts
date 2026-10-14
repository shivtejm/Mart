import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit, OnDestroy {

  userName = '';
  currentSlide = 0;

  images = [
    'assets/images/image1.png',
    'assets/images/image2.png',
    'assets/images/image3.png'
  ];

  private autoSlideTimer: ReturnType<typeof setInterval> | undefined;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const user = this.authService.currentUser();
    this.userName = user?.name || localStorage.getItem('userName') || 'User';

    this.autoSlideTimer = setInterval(() => {
      this.nextSlide();
    }, 4000);
  }

  ngOnDestroy(): void {
    if (this.autoSlideTimer) {
      clearInterval(this.autoSlideTimer);
    }
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.images.length;
    this.cdr.detectChanges();
  }

  previousSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.images.length) % this.images.length;
    this.cdr.detectChanges();
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
    this.cdr.detectChanges();
  }

  goToProfile(): void {
    this.router.navigate(['/home/profile']);
  }
}