// import { Component } from '@angular/core';
// import { UserDetailService } from '../../services/user-detail.service';
// import { CommonModule } from '@angular/common';
// import { RouterLink, RouterOutlet } from '@angular/router';
// import { FoodService } from '../../services/food.service';
// import { FormsModule } from '@angular/forms';
// import { ActivityService } from '../../services/activity.service';

// @Component({
//   selector: 'app-user-list',
//   imports: [CommonModule,RouterLink,RouterOutlet,FormsModule],
//   templateUrl: './user-list.component.html',
//   styleUrl: './user-list.component.css'
// })
// export class UserListComponent {
//  users:any[]=[];

//  foodData:any={
//   userId:"661fd12ab3e1a3dce4b5f123",
//   foodName:"",
//   mealType:"",
//   portion:"",
//   foodGroup:"" ,
//   date:""
// }

// activityData:any={
//   userId:"661fd12ab3e1a3dce4b5f123",
//   activityName:'',
//   date:'',
//   duration:'',
//   description:'',
//   METvalue:'',

// }

//  constructor(private userDetailService:UserDetailService,
//   private FoodService:FoodService,private AcitivityService:ActivityService){}

//   onSaveFood(){
//     console.log("foodData before saving", this.foodData); // debug log

//     this.FoodService.addFood(this.foodData).subscribe({
//       next:(res)=>{
//         console.log("food added",res);
//         alert("food added")
//       },
//       error:(err)=>{
//         console.log("error adding food",err);
//       }
//     })
//   }

//   onSaveActivity(){
//     console.log("activityData before saving", this.activityData); 
//     this.AcitivityService.addActivity(this.activityData).subscribe({
//       next:(res)=>{
//         console.log("activity added",res);
//         this.activityData={};
//         alert("activity added")
//       },
//       error:(err)=>{
//         console.log("error adding activity",err);
//       }
//     })
//   }
//  ngOnInit(){ // lifecycle hook return automatically when component is loaded
//   this.userDetailService.getAllUsers().subscribe({
//     next:(res:any)=>{
//       this.users=res?.users || [] //if res?.users exists then res.users else []
//       console.log(this.users,"users coming")
//     },
//     error:(err)=>{
//       console.log("error fetching users",err)
//     }
//   })
//  }

 
// }




import { Component } from '@angular/core';
import { UserDetailService } from '../../services/user-detail.service';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FoodService } from '../../services/food.service';
import { FormsModule } from '@angular/forms';
import { ActivityService } from '../../services/activity.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, FormsModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent {
  users: any[] = [];

  selectedUserId: string = ''; // store currently selected user's ID

  foodData: any = {
    userId: '',
    foodName: '',
    mealType: '',
    portion: '',
    foodGroup: '',
    date: ''
  };

  activityData: any = {
    userId: '',
    activityName: '',
    date: '',
    duration: '',
    description: '',
    METvalue: ''
  };

  constructor(
    private userDetailService: UserDetailService,
    private FoodService: FoodService,
    private AcitivityService: ActivityService
  ) {}

  ngOnInit() {
    this.userDetailService.getAllUsers().subscribe({
      next: (res: any) => {
        this.users = res?.users || [];
        console.log(this.users, 'users coming');
      },
      error: (err) => {
        console.log('error fetching users', err);
      }
    });
  }

  selectUser(userId: string) {
    this.selectedUserId = userId;
    this.foodData.userId = userId;
    this.activityData.userId = userId;
    console.log("Selected userId set to:", userId);
  }

  onSaveFood() {
    if (!this.foodData.userId) {
      alert('Please select a user first.');
      return;
    }

    console.log('foodData before saving', this.foodData);

    this.FoodService.addFood(this.foodData).subscribe({
      next: (res) => {
        console.log('food added', res);
        alert('Food added');
      },
      error: (err) => {
        console.log('error adding food', err);
      }
    });
  }

  onSaveActivity() {
    if (!this.activityData.userId) {
      alert('Please select a user first.');
      return;
    }

    console.log('activityData before saving', this.activityData);

    this.AcitivityService.addActivity(this.activityData).subscribe({
      next: (res) => {
        console.log('activity added', res);
        this.activityData = {}; // reset if needed
        alert('Activity added');
      },
      error: (err) => {
        console.log('error adding activity', err);
      }
    });
  }
}
