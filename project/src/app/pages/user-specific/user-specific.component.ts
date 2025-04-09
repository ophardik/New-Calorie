import { Component, OnInit } from '@angular/core';
import { DailyLogService } from '../../services/daily-log.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-specific',
  imports: [CommonModule],
   templateUrl: './user-specific.component.html',
  styleUrls: ['./user-specific.component.css']  // ✅ Fix: it's `styleUrls` (plural), not `styleUrl`
})
export class UserSpecificComponent implements OnInit {  // ✅ Fix: implement OnInit to use ngOnInit

  logData: any;

  constructor(  // ✅ Fix: typo — should be `constructor` not `contructor`
    private route: ActivatedRoute,
    private dailyLogService: DailyLogService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
  
    if (id) {
      this.dailyLogService.getLogById(id).subscribe({
        next: (res: any) => {
          this.logData = res.data;  // ✅ Since your API returns { success, data }
        },
        error: (err) => {
          console.error('Failed to fetch log data:', err);
        }
      });
    }
  }
  
}
