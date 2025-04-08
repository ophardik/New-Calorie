// import { Component } from '@angular/core';
// import { UserDetailService } from '../../services/user-detail.service';
// import { ActivatedRoute } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { UserService } from '../../services/user.service';
// import { DailyLogService } from '../../services/daily-log.service';

// @Component({
//   selector: 'app-user-data',
//   standalone:true,
//   imports: [CommonModule,FormsModule],
//   templateUrl: './user-data.component.html',
//   styleUrl: './user-data.component.css'
// })
// export class UserDataComponent {
  
//   user:any={}
//   allLogs:any=[]
//   userId:string | null=null
//   constructor(private route:ActivatedRoute ,private userDetailService:UserDetailService,dailyLogService:DailyLogService){}


//   ngOnInit(): void {
//     this.userId = this.route.snapshot.paramMap.get('id') || localStorage.getItem("userId");

//     if(this.dailyLogService.allDailyLog(this.userId).subscribe(res=>{this.allLogs=res}))

//     if (this.userId) {
//       this.userDetailService.getSingleUser(this.userId).subscribe({
//         next: (res: any) => {
//           this.user = res.user;
//           console.log("Fetched user:", this.user);
//         },
//         error: (err) => {
//           console.log("Error fetching user", err);
//         }
//       });
//     }
   
//   }
  

// }



import { Component, OnInit } from '@angular/core';
import { UserDetailService } from '../../services/user-detail.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DailyLogService } from '../../services/daily-log.service';

@Component({
  selector: 'app-user-data',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-data.component.html',
  styleUrl: './user-data.component.css'
})
export class UserDataComponent implements OnInit {

  user: any = {};
  allLogs: any[] = [];
  userId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private userDetailService: UserDetailService,
    private dailyLogService: DailyLogService
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
   console.log("userId",this.userId)
    if (this.userId) {
      // Get all logs for the user
      this.dailyLogService.allDailyLog(this.userId).subscribe({
        next: (res: any) => {
          this.allLogs = res.data || [];
          console.log("Fetched all logs:", this.allLogs);
          console.log("Fetched all logs:", this.allLogs);
        },
        error: (err) => {
          console.error("Error fetching logs:", err);
        }
      });

      // Get user details
      // this.userDetailService.getSingleUser(this.userId).subscribe({
      //   next: (res: any) => {
      //     this.user = res.user;
      //     console.log("Fetched user:", this.user);
      //   },
      //   error: (err) => {
      //     console.log("Error fetching user", err);
      //   }
      // });
    }
  }
}

