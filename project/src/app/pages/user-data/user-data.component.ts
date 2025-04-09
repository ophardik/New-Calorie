import { Component, OnInit } from '@angular/core';
import { UserDetailService } from '../../services/user-detail.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DailyLogService } from '../../services/daily-log.service';
import { UserSpecificComponent } from '../user-specific/user-specific.component';

@Component({
  selector: 'app-user-data',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './user-data.component.html',
  styleUrl: './user-data.component.css'
})


export class UserDataComponent implements OnInit {
  selectedUserId: string = '';
  user: any = {};
  allLogs: any[] = [];
  filteredLogs: any[] = [];  // ✅ to control what's shown in table
  userId: string | null = null;
  selectedDate: string = '';
  fetchedLog: any = null;

  constructor(
    private route: ActivatedRoute,
    private userDetailService: UserDetailService,
    private dailyLogService: DailyLogService
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    if (this.userId) {
      this.dailyLogService.allDailyLog(this.userId).subscribe({
        next: (res: any) => {
          this.allLogs = res.data || [];
          console.log()
          this.filteredLogs = [...this.allLogs]; // ✅ show all initially
        },
        error: (err) => {
          console.error("Error fetching logs:", err);
        }
      });
    }
  }

  fetchLogByDate() {
    if (!this.selectedDate) {
      this.filteredLogs = [...this.allLogs]; // ✅ reset to all logs
      return;
    }

    const filtered = this.allLogs.filter((log) => {
      const logDate = new Date(log.date).toISOString().split('T')[0];
      return logDate === this.selectedDate;
    });

    this.filteredLogs = filtered;
  }
}
