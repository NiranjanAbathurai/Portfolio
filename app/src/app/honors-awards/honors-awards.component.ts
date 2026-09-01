import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';

interface Award {
  id: number;
  title: string;
  issuer: string;
  date: string;
  description: string;
  icon: string;
  type: string;
  logo:string;
  certificate:string;
}

@Component({
  standalone: true,
  selector: 'app-honors-awards',
  templateUrl: './honors-awards.component.html',
  styleUrls: ['./honors-awards.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, TranslateModule]
})
export class HonorsAwardsComponent implements OnInit {
  awards: Award[] = [];
  /** Duplicated list for seamless infinite CSS scroll */
  displayAwards: Award[] = [];
  isBrowser: boolean;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.http.get<Award[]>('assets/data/honors-awards.json').subscribe({
      next: (data) => {
        this.awards = data;
        // Duplicate the array 3 times for seamless infinite CSS scroll
        this.displayAwards = [...data, ...data, ...data];
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Failed to load honors-awards.json', err)
    });
  }

  getIconClass(icon: string): string {
    const iconMap: Record<string, string> = {
      trophy: 'fa fa-trophy',
      certificate: 'fa fa-certificate',
      code: 'fa fa-code',
      star: 'fa fa-star'
    };
    return iconMap[icon] || 'fa fa-award';
  }

  getBadgeKey(type: string): string {
    switch (type) {
      case 'award': return 'HONORS_AWARDS.AWARD';
      case 'recommendation': return 'HONORS_AWARDS.RECOMMENDATION';
      case 'certification': return 'HONORS_AWARDS.CERTIFICATION';
      default: return 'HONORS_AWARDS.AWARD';
    }
  }
}
