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
activityList: any[]=[];

 foodData:any={
  userId:this.selectedUserId,
  foodId:"",
  foodName:"",
  mealType:"",
  portion:"",
  foodGroup:"" ,
  date:""
}

activityData:any={
  userId:this.selectedUserId,
  activityName:'',
  date:'',
  duration:'',
  description:'',
  METvalue:'',

}
  uniqueFoodGroups: any;
  uniqueActivityGroups:any


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
          time: this.foodData.time || '',
        }
      ]
    };
  
    console.log("📤 Sending payload:", payload);
  
    this.DailyLogService.createLog(payload).subscribe({
      next: (res: any) => {
        console.log("✅ Log created successfully", res);
        alert("Log created successfully");
  
        // ✅ Show totalCaloriesIn on HTML side
      },
      error: (err: any) => {
        console.error("❌ Error while creating log", err);
      }
    });
  }
  

  
  
  onFoodChange() {
    const selectedFood = this.foodList.find(f => f._id === this.foodData.foodId);
    if (selectedFood) {
      this.foodData.foodName = selectedFood.foodName;
    }
  }
  onAcitivityChange() {
    const selectedActivity = this.activityList.find(
      (a: any) => a._id === this.activityData.activityId
    );
    if (selectedActivity) {
      this.activityData.activityName = selectedActivity.activityName;
      this.activityData.METvalue = selectedActivity.METs;
      console.log("Activity selected:", selectedActivity);
    }
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

  onSaveActivity() {
    console.log("activityData before saving", this.activityData);
  this.activityData.userId=this.selectedUserId
    // 1. Get user weight (from users array using selected userId)
    const selectedUser = this.users.find(user => user.id === this.activityData.userId);
    console.log("selectedUser",selectedUser)
    const weight = selectedUser?.weight || 0;
  
    // 2. Convert duration (hh:mm) to hours
    const [hours, minutes] = this.activityData.duration.split(':').map(Number);
    const durationInHours = hours + (minutes / 60);
  
    // 3. Calculate caloriesOut
    const caloriesOut = this.activityData.METvalue * weight * durationInHours;
  
    // 👇 Optionally attach to activityData for saving or displaying
    this.activityData.caloriesOut = caloriesOut;
  
    console.log("🔥 Calories Out:", caloriesOut);
  
    this.AcitivityService.addActivity(this.activityData).subscribe({
      next: (res) => {
        console.log("activity added", res);
        this.activityData = {};
        alert("activity added");
        this.createDailyLog()
      },
      error: (err) => {
        console.log("error adding activity", err);
      }
    });
  }
  getCaloriesOut(): number {
    const selectedUser = this.users.find(user => user._id === this.activityData.userId);
    const weight = selectedUser?.weight || 0;
  
    const [hours, minutes] = (this.activityData.duration || '0:0').split(':').map(Number);
    const durationInHours = hours + (minutes / 60);
  
    return this.activityData.METvalue * weight * durationInHours;
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
  this.AcitivityService.getAllActivity().subscribe({
    next: (res: any) => {
      console.log("fetched activityList", res);
  
      const allActivity = res.data || [];
  
      // 🔁 Fix typo + filter unique activity names
      const uniqueActivityMap = new Map<string, any>();
  
      allActivity.forEach((activity: any) => {
        // Fix the typo here
        const activityName = activity.activityName || activity.acitivityName;
  
        if (!uniqueActivityMap.has(activityName)) {
          uniqueActivityMap.set(activityName, {
            ...activity,
            activityName // ensure corrected key exists
          });
        }
      });
  
      this.activityList = Array.from(uniqueActivityMap.values());
  
      // Optional: extract unique activityGroup if you still need it
      const activityGroupSet = new Set<string>();
      this.activityList.forEach((activity: any) => {
        if (activity.activityGroup) {
          activityGroupSet.add(activity.activityGroup);
        }
      });
      this.uniqueActivityGroups = Array.from(activityGroupSet);
  
    },
    error: (err) => {
      console.log("error fetching activityList", err);
    }
  });
 }  
 
}
