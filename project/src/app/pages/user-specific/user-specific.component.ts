import { Component, OnInit } from '@angular/core';
import { DailyLogService } from '../../services/daily-log.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-specific',
  imports: [CommonModule],
   templateUrl: './user-specific.component.html',
  styleUrls: ['./user-specific.component.css']  
})
export class UserSpecificComponent implements OnInit {  
  loading = true;
  logData: any;
  userName: any;

  constructor( 
    private route: ActivatedRoute,
    private dailyLogService: DailyLogService
  ) {}

  // ngOnInit(): void {
  //   const id = this.route.snapshot.paramMap.get('id');
  
  //   if (id) {
  //     this.dailyLogService.getLogById(id).subscribe({
  //       next: (res: any) => {
  //         this.logData = res.data;
  //         console.log(res.data, "res.data");
  
  //         const userId = res.data.userId;
  //         console.log(userId, "userId");
  
  //         this.dailyLogService.getUserById(userId).subscribe({
  //           next: (userRes: any) => {
  //             console.log(userRes, "User data");
  //             this.userName = userRes.data.name; 
  //           },
  //           error: (err) => {
  //             console.error('Failed to fetch user data:', err);
  //           }
  //         });
  //       },
  //       error: (err) => {
  //         console.error('Failed to fetch log data:', err);
  //       }
  //     });
  //   }
  // }
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
  
    if (id) {
      this.dailyLogService.getLogById(id).subscribe({
        next: (res: any) => {
          this.logData = res.data;
          const userId = res.data.userId;
  
          this.dailyLogService.getUserById(userId).subscribe({
            next: (userRes: any) => {
              this.userName = userRes.data.name;
              this.loading = false; // ✅ loading ends after both calls
            },
            error: (err) => {
              console.error('Failed to fetch user data:', err);
              this.loading = false;
            }
          });
        },
        error: (err) => {
          console.error('Failed to fetch log data:', err);
          this.loading = false;
        }
      });
    } else {
      this.loading = false;
    }
  }
  
  
}
