import { Component } from '@angular/core';
import { UserDetailService } from '../../services/user-detail.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-data',
  standalone:true,
  imports: [CommonModule,FormsModule],
  templateUrl: './user-data.component.html',
  styleUrl: './user-data.component.css'
})
export class UserDataComponent {
  
  user:any
  
  constructor(private route:ActivatedRoute ,private userDetailService:UserDetailService){}


   

}
