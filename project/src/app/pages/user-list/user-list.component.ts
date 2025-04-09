// import { Component } from '@angular/core';
// import { UserDetailService } from '../../services/user-detail.service';
// import { CommonModule } from '@angular/common';
// import { RouterLink, RouterOutlet } from '@angular/router';
// import { FoodService } from '../../services/food.service';
// import { FormsModule } from '@angular/forms';
// import { ActivityService } from '../../services/activity.service';
// import { FoodListService } from '../../services/food-list.service';
// import { DailyLogService } from '../../services/daily-log.service';
// @Component({
//   selector: 'app-user-list',
//   imports: [CommonModule,RouterLink,RouterOutlet,FormsModule],
//   templateUrl: './user-list.component.html',
//   styleUrl: './user-list.component.css'
// })
// export class UserListComponent {
//  users:any[]=[];
//  selectedUserId: string = '';

// foodList:any[]=[];
// activityList: any[]=[];

//  foodData:any={
//   userId:this.selectedUserId,
//   foodId:"",
//   foodName:"",
//   mealType:"",
//   portion:"",
//   foodGroup:"" ,
//   date:""
// }

// activityData:any={
//   userId:this.selectedUserId,
//   activityName:'',
//   date:'',
//   duration:'',
//   description:'',
//   METvalue:'',

// }
//   uniqueFoodGroups: any;
//   uniqueActivityGroups:any


//  constructor(private userDetailService:UserDetailService,
//   private FoodService:FoodService,private AcitivityService:ActivityService,private FoodListService:FoodListService , private DailyLogService:DailyLogService){}

//   onSelectUser(user: any) {
//     this.selectedUserId = user.id;
//     console.log(" Selected User ID:", this.selectedUserId);
//   }
  
//   createDailyLog() {  
//     if (!this.selectedUserId) {
//       alert("Please select a user before logging!");
//       return;
//     }
  
//     const payload = {
//       userId: this.selectedUserId,
//       date: this.foodData.date,
//       foodLog: [
//         {
//           foodId: this.foodData.foodId,
//           portion: this.foodData.portion,
//           time: this.foodData.time || '',
//         }
//       ]
//     };
  
//     console.log("📤 Sending payload:", payload);
  
//     this.DailyLogService.createLog(payload).subscribe({
//       next: (res: any) => {
//         console.log("✅ Log created successfully", res);
//         alert("Log created successfully");
  
//         // ✅ Show totalCaloriesIn on HTML side
//       },
//       error: (err: any) => {
//         console.error("❌ Error while creating log", err);
//       }
//     });
//   }
 
//   onFoodChange() {
//     const selectedFood = this.foodList.find(f => f._id === this.foodData.foodId);
//     if (selectedFood) {
//       this.foodData.foodName = selectedFood.foodName;
//     }
//   }
//   onAcitivityChange() {
//     const selectedActivity = this.activityList.find(
//       (a: any) => a._id === this.activityData.activityId
//     );
//     if (selectedActivity) {
//       this.activityData.activityName = selectedActivity.activityName;
//       this.activityData.METvalue = selectedActivity.METs;
//       console.log("Activity selected:", selectedActivity);
//     }
//   }
//   onSaveFood(){
//     console.log("foodData before saving", this.foodData); // debug log
//     this.foodData.userId = this.selectedUserId;
//     this.FoodService.addFood(this.foodData).subscribe({
//       next:(res)=>{
//         console.log("food added",res);
//         alert("food added")
//         this.createDailyLog()
//       },
//       error:(err)=>{
//         console.log("error adding food",err);
//       }
//     })
//   }
//   onSaveActivity() {
//     console.log("activityData before saving", this.activityData);
//   this.activityData.userId=this.selectedUserId
//     // 1. Get user weight (from users array using selected userId)
//     const selectedUser = this.users.find(user => user.id === this.activityData.userId);
//     console.log("selectedUser",selectedUser)
//     const weight = selectedUser?.weight || 0;
  
//     // 2. Convert duration (hh:mm) to hours
//     const [hours, minutes] = this.activityData.duration.split(':').map(Number);
//     const durationInHours = hours + (minutes / 60);
  
//     // 3. Calculate caloriesOut
//     const caloriesOut = this.activityData.METvalue * weight * durationInHours;
  
//     // 👇 Optionally attach to activityData for saving or displaying
//     this.activityData.caloriesOut = caloriesOut;
  
//     console.log("🔥 Calories Out:", caloriesOut);
  
//     this.AcitivityService.addActivity(this.activityData).subscribe({
//       next: (res) => {
//         console.log("activity added", res);
//         this.activityData = {};
//         alert("activity added");
//         this.createDailyLog()
//       },
//       error: (err) => {
//         console.log("error adding activity", err);
//       }
//     });
//   }
//   getCaloriesOut(): number {
//     const selectedUser = this.users.find(user => user._id === this.activityData.userId);
//     const weight = selectedUser?.weight || 0;
  
//     const [hours, minutes] = (this.activityData.duration || '0:0').split(':').map(Number);
//     const durationInHours = hours + (minutes / 60);
  
//     return this.activityData.METvalue * weight * durationInHours;
//   }
//    ngOnInit(){ // lifecycle hook return automatically when component is loaded
//   this.userDetailService.getAllUsers().subscribe({
//     next:(res:any)=>{
//       this.users=res?.users || [] //if res?.users exists then res.users else []
//       console.log(this.users,"users coming")
//     },
//     error:(err)=>{
//       console.log("error fetching users",err)
//     }
//   })
//   this.FoodListService.getAllFood().subscribe({
//     next: (res: any) => {
//       console.log("fetched foodList", res);
  
//       const allFoods = res.data || [];
//       this.foodList = allFoods;
  
//       const foodGroupSet = new Set<string>();
//       allFoods.forEach((food: { foodGroup: string; }) => {
//         if (food.foodGroup) {
//           foodGroupSet.add(food.foodGroup);
//         }
//       });
  
//       //  Set unique food groups only once
//       this.uniqueFoodGroups = Array.from(foodGroupSet);
//     },
//     error: (err) => {
//       console.log("error fetching foodList", err);
//     }
//   });
//   this.AcitivityService.getAllActivity().subscribe({
//     next: (res: any) => {
//       console.log("fetched activityList", res);
  
//       const allActivity = res.data || [];
  
//       // 🔁 Fix typo + filter unique activity names
//       const uniqueActivityMap = new Map<string, any>();
  
//       allActivity.forEach((activity: any) => {
//         // Fix the typo here
//         const activityName = activity.activityName || activity.acitivityName;
  
//         if (!uniqueActivityMap.has(activityName)) {
//           uniqueActivityMap.set(activityName, {
//             ...activity,
//             activityName // ensure corrected key exists
//           });
//         }
//       });
  
//       this.activityList = Array.from(uniqueActivityMap.values());
  
//       // Optional: extract unique activityGroup if you still need it
//       const activityGroupSet = new Set<string>();
//       this.activityList.forEach((activity: any) => {
//         if (activity.activityGroup) {
//           activityGroupSet.add(activity.activityGroup);
//         }
//       });
//       this.uniqueActivityGroups = Array.from(activityGroupSet);
  
//     },
//     error: (err) => {
//       console.log("error fetching activityList", err);
//     }
//   });
//  }  
 
// }
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
  standalone: true,
  imports: [CommonModule,RouterLink,  FormsModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent {
  users: any[] = [];
  selectedUserId: string = '';

  foodList: any[] = [];
  activityList: any[] = [];

  foodData: any = {
    foodId: "",
    foodName: "",
    mealType: "",
    portion: "",
    foodGroup: "",
    date: "",
    time: ""
  };

  activityData: any = {
    activityId: '',
    activityName: '',
    date: '',
    duration: '',
    description: '',
    METvalue: ''
  };

  uniqueFoodGroups: string[] = [];
  uniqueActivityGroups: string[] = [];

  constructor(
    private userDetailService: UserDetailService,
    private foodService: FoodService,
    private activityService: ActivityService,
    private foodListService: FoodListService,
    private dailyLogService: DailyLogService
  ) {}

  ngOnInit() {
    this.userDetailService.getAllUsers().subscribe({
      next: (res: any) => this.users = res?.users || [],
      error: (err) => console.error("error fetching users", err)
    });

    this.foodListService.getAllFood().subscribe({
      next: (res: any) => {
        this.foodList = res.data || [];
        this.uniqueFoodGroups = Array.from(new Set(this.foodList.map(f => f.foodGroup).filter(Boolean)));
      },
      error: (err) => console.error("error fetching foodList", err)
    });

    this.activityService.getAllActivity().subscribe({
      next: (res: any) => {
        const activities = res.data || [];
        const uniqueMap = new Map();
        activities.forEach((a: any) => {
          const name = a.activityName || a.acitivityName;
          if (!uniqueMap.has(name)) uniqueMap.set(name, { ...a, activityName: name });
        });
        this.activityList = Array.from(uniqueMap.values());
        this.uniqueActivityGroups = Array.from(new Set(this.activityList.map(a => a.activityGroup).filter(Boolean)));
      },
      error: (err) => console.error("error fetching activityList", err)
    });
  }

  onSelectUser(user: any) {
    this.selectedUserId = user.id;
    console.log("Selected User ID:", this.selectedUserId);
  }

  onFoodChange() {
    const selectedFood = this.foodList.find(f => f._id === this.foodData.foodId);
    if (selectedFood) {
      this.foodData.foodName = selectedFood.foodName;
    }
  }

  onActivityChange() {
    const selectedActivity = this.activityList.find(a => a._id === this.activityData.activityId);
    if (selectedActivity) {
      this.activityData.activityName = selectedActivity.activityName;
      this.activityData.METvalue = selectedActivity.METs;
    }
  }

  // submitLog(type: 'food' | 'activity') {
  //   if (!this.selectedUserId) return alert("Please select a user");
  
  //   const date = type === 'food' ? this.foodData.date : this.activityData.date;
  
  //   const payload: any = {
  //     userId: this.selectedUserId,
  //     date
  //   };
  
  //   if (type === 'food') {
  //     const selectedFood = this.foodList.find(f => f._id === this.foodData.foodId);
  //     if (selectedFood) {
  //       this.foodData.foodName = selectedFood.foodName;
  //     }
  
  //     payload.foodLog = [this.foodData];
  //   }
  
  //   if (type === 'activity') {
  //     const selectedUser = this.users.find(u => u.id === this.selectedUserId);
  //     const weight = selectedUser?.weight || 70;
  
  //     const [hrs, mins] = (this.activityData.duration || '0:0').split(':').map(Number);
  //     const durationInHours = hrs + (mins / 60);
  //     const caloriesOut = this.activityData.METvalue * weight * durationInHours;
  
  //     this.activityData.caloriesOut = caloriesOut;
  
  //     payload.activityLog = [this.activityData];
  //   }
  
  //   this.dailyLogService.createOrUpdateDailyLog(payload).subscribe({
  //     next: (res) => {
  //       console.log(`${type} log added`, res);
  //       alert(`${type === 'food' ? 'Food' : 'Activity'} added successfully`);
  //     },
  //     error: (err) => console.error(`Error adding ${type}`, err)
  //   });
  // }

  submitLog(type: 'food' | 'activity') {
    if (!this.selectedUserId) return alert("Please select a user");
  
    const date = type === 'food' ? this.foodData.date : this.activityData.date;
  
    const payload: any = {
      userId: this.selectedUserId,
      date
    };
  
    const selectedUser = this.users.find(u => u.id === this.selectedUserId);
    // if (selectedUser) {
    //   payload.bmr = this.calculateBMR(selectedUser); // ✅ Add BMR to payload
    // }
  
    if (type === 'food') {
      const selectedFood = this.foodList.find(f => f._id === this.foodData.foodId);
      if (selectedFood) {
        this.foodData.foodName = selectedFood.foodName;
      }
  
      payload.foodLog = [this.foodData];
    }
  
    if (type === 'activity') {
      const weight = selectedUser?.weight || 70;
  
      const [hrs, mins] = (this.activityData.duration || '0:0').split(':').map(Number);
      const durationInHours = hrs + (mins / 60);
      const caloriesOut = this.activityData.METvalue * weight * durationInHours;
  
      this.activityData.caloriesOut = caloriesOut;
  
      payload.activityLog = [this.activityData];
    }
  
    this.dailyLogService.createOrUpdateDailyLog(payload).subscribe({
      next: (res) => {
        console.log(`${type} log added`, res);
        alert(`${type === 'food' ? 'Food' : 'Activity'} added successfully`);
      },
      error: (err) => console.error(`Error adding ${type}`, err)
    });
  }
  
 
  
  
  
}
