import { Component } from '@angular/core';
import { UserDetailService } from '../../services/user-detail.service';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FoodService } from '../../services/food.service';
import { FormsModule } from '@angular/forms';
import { ActivityService } from '../../services/activity.service';
import { FoodListService } from '../../services/food-list.service';
import { DailyLogService } from '../../services/daily-log.service';


@Component({
  selector: 'app-user-list',
  imports: [CommonModule,RouterLink,RouterOutlet,FormsModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent {
 users:any[]=[];
 selectedUserId: string = '';

foodList:any[]=[];
 foodData:any={
  userId:this.selectedUserId,
  foodName:"",
  mealType:"",
  portion:"",
  foodGroup:"" ,
  date:""
}

activityData:any={
  userId:localStorage.getItem("userId"),
  activityName:'',
  date:'',
  duration:'',
  description:'',
  METvalue:'',

}
  uniqueFoodGroups: any;


 constructor(private userDetailService:UserDetailService,
  private FoodService:FoodService,private AcitivityService:ActivityService,private FoodListService:FoodListService , private DailyLogService:DailyLogService){}

  onSelectUser(user: any) {
    this.selectedUserId = user.id;
    console.log(" Selected User ID:", this.selectedUserId);
  }
  

createDailyLog() {
  if (!this.selectedUserId) {
    alert("Please select a user before logging!");
    return;
  }

  const payload = {
    userId: this.selectedUserId,
    date: this.foodData.date,
    foodLog: [
      {
        foodId: this.foodData.foodId,
        portion: this.foodData.portion,
        time: this.foodData.time || '', // optional
      }
    ]
  };

  console.log("📤 Sending payload:", payload);

  this.DailyLogService.createLog(payload).subscribe({
    next: (res: any) => {
      console.log("✅ Log created successfully", res);
      alert("Log created successfully");
    },
    error: (err: any) => {
      console.error("❌ Error while creating log", err);
    }
  });
}

  
  
  

  onSaveFood(){
    console.log("foodData before saving", this.foodData); // debug log
    this.foodData.userId = this.selectedUserId;
    this.FoodService.addFood(this.foodData).subscribe({
      next:(res)=>{
        console.log("food added",res);
        alert("food added")
        this.createDailyLog()
      },
      error:(err)=>{
        console.log("error adding food",err);
      }
    })
  }

  onSaveActivity(){
    console.log("activityData before saving", this.activityData); 
    this.AcitivityService.addActivity(this.activityData).subscribe({
      next:(res)=>{
        console.log("activity added",res);
        this.activityData={};
        alert("activity added")
      },

     error:(err)=>{
        console.log("error adding activity",err);
      }
    })
  }
 ngOnInit(){ // lifecycle hook return automatically when component is loaded
  this.userDetailService.getAllUsers().subscribe({
    next:(res:any)=>{
      this.users=res?.users || [] //if res?.users exists then res.users else []
      console.log(this.users,"users coming")
    },
    error:(err)=>{
      console.log("error fetching users",err)
    }
  })
  this.FoodListService.getAllFood().subscribe({
    next: (res: any) => {
      console.log("fetched foodList", res);
  
      const allFoods = res.data || [];
      this.foodList = allFoods;
  
      const foodGroupSet = new Set<string>();
      allFoods.forEach((food: { foodGroup: string; }) => {
        if (food.foodGroup) {
          foodGroupSet.add(food.foodGroup);
        }
      });
  
      //  Set unique food groups only once
      this.uniqueFoodGroups = Array.from(foodGroupSet);
    },
    error: (err) => {
      console.log("error fetching foodList", err);
    }
  });
  
 }
 
}
