import { Component } from '@angular/core';
import { UserDetailService } from '../../services/user-detail.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-data',
  standalone:true,
  imports: [CommonModule,FormsModule],
  templateUrl: './user-data.component.html',
  styleUrl: './user-data.component.css'
})
export class UserDataComponent {
  
  user:any={}
  userId:string | null=null
  constructor(private route:ActivatedRoute ,private userDetailService:UserDetailService){}


  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id') || localStorage.getItem("userId");

    if (this.userId) {
      this.userDetailService.getSingleUser(this.userId).subscribe({
        next: (res: any) => {
          this.user = res.user;
          console.log("Fetched user:", this.user);
        },
        error: (err) => {
          console.log("Error fetching user", err);
        }
      });
    }
  }

}
