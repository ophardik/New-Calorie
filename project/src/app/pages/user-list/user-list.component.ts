import { Component } from '@angular/core';
import { UserDetailService } from '../../services/user-detail.service';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FoodService } from '../../services/food.service';
import { FormsModule } from '@angular/forms';
import { ActivityService } from '../../services/activity.service';
import { FoodListService } from '../../services/food-list.service';
import { DailyLogService } from '../../services/daily-log.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { Router } from '@angular/router';
@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule,  NgSelectModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent {
  users: any[] = [];
  foodList: any[] = [];
  activityList: any[] = [];
  selectedUserId: string = '';
  isFoodLoading: boolean = true;

  loadingUserId: string | null = null;

onViewClick(userId: string) {
  this.loadingUserId = userId;

  setTimeout(() => {
    this.router.navigate(['/user-data', userId]);
  }, 300);
}

  foodData: any = {
    userId: '',
    foodId: '',
    foodName: '',
    mealType: '',
    portion: '',
    foodGroup: '',
    date: '',
    time: ''
  };

  activityData: any = {
    userId: '',
    activityId: '',
    activityName: '',
    date: '',
    duration: '',
    description: '',
    METvalue: '',
    caloriesOut: 0
  };
  hasLoadedFoods = false;
  uniqueFoodGroups: any;
  uniqueActivityGroups: any;
isAddDataLoading = false;
loadingAddDataUserId: string | null = null;
  constructor(
    private userDetailService: UserDetailService,
    private FoodService: FoodService,
    private AcitivityService: ActivityService,
    private FoodListService: FoodListService,
    private DailyLogService: DailyLogService,
    private router: Router
  ) {}
  


  
  
  loadAllFoods() {
    if (this.hasLoadedFoods) return;
  
    this.FoodListService.getAllFood().subscribe({
      next: (res: any) => {
        const allFoods = res.data || [];
        console.log("food count",res?.data.length);
        this.foodList = allFoods;

        this.hasLoadedFoods = true;
  
        const foodGroupSet = new Set<string>();
        allFoods.forEach((food: { foodGroup: string }) => {
          if (food.foodGroup) {
            foodGroupSet.add(food.foodGroup);
          }
        });
        this.uniqueFoodGroups = Array.from(foodGroupSet);
      },
      error: (err) => console.log('error fetching foodList', err),
    });
  }
  
  
  ngOnInit() {
    this.getAllUsers();
    this.loadAllFoods();
 

    this.AcitivityService.getAllActivity().subscribe({
      next: (res: any) => {
        const allActivity = res.data || [];
        const uniqueActivityMap = new Map<string, any>();
        allActivity.forEach((activity: any) => {
          const activityName = activity.activityName || activity.acitivityName;
          if (!uniqueActivityMap.has(activityName)) {
            uniqueActivityMap.set(activityName, { ...activity, activityName });
          }
        });

        this.activityList = Array.from(uniqueActivityMap.values());

        const activityGroupSet = new Set<string>();
        this.activityList.forEach((activity: any) => {
          if (activity.activityGroup) {
            activityGroupSet.add(activity.activityGroup);
          }
        });
        this.uniqueActivityGroups = Array.from(activityGroupSet);
      },
      error: (err) => console.log('error fetching activityList', err),
    });
  }

  getAllUsers() {
    this.userDetailService.getAllUsers().subscribe({
      next: (res: any) => {
        this.users = res?.users || [];
        console.log(res)
      },
      error: (err) => console.log('error fetching users', err),
    });
  }

  // onSelectUser(user: any) {
  //   this.selectedUserId = user.id;
  //   this.foodData.userId = user.id;
  //   this.activityData.userId = user.id;
  // }
  onSelectUser(user: any) {
    this.loadingAddDataUserId = user.id;
  
    // Your existing logic
    this.selectedUserId = user.id;
    this.foodData.userId = user.id;
    this.activityData.userId = user.id;
  
    // Optional: Clear loading state after a short delay
    setTimeout(() => {
      this.loadingAddDataUserId = null;
    }, 500); // adjust time as needed
  }
  

  onFoodChange() {
    const selectedFood = this.foodList.find(f => f._id === this.foodData.foodId);
    if (selectedFood) {
      this.foodData.foodName = selectedFood.foodName;
    }
  }

  onActivityChange() {
    const selectedActivity = this.activityList.find(
      (a: any) => a._id === this.activityData.activityId
    );
    if (selectedActivity) {
      this.activityData.activityName = selectedActivity.activityName;
      this.activityData.METvalue = selectedActivity.METs;
    }
  }

  onSaveFood() {
    this.foodData.userId = this.selectedUserId;
    this.FoodService.addFood(this.foodData).subscribe({
      next: (res) => {
        alert('Food added');
        this.submitLog('food');
      },
      error: (err) => console.log('error adding food', err),
    });
  }

  onSaveActivity() {
    const selectedUser = this.users.find(user => user.id === this.activityData.userId);
    const weight = selectedUser?.weight || 0;

    const [hours, minutes] = this.activityData.duration.split(':').map(Number);
    const durationInHours = hours + (minutes / 60);
    const caloriesOut = this.activityData.METvalue * weight * durationInHours;

    this.activityData.caloriesOut = caloriesOut;

    this.AcitivityService.addActivity(this.activityData).subscribe({
      next: (res) => {
        alert('Activity added');
        this.submitLog('activity');
      },
      error: (err) => console.log('error adding activity', err),
    });
  }
  submitLog(type: 'food' | 'activity') {
    if (!this.selectedUserId) return alert("Please select a user");
  
    const date = type === 'food' ? this.foodData.date : this.activityData.date;
  
    const payload: any = {
      userId: this.selectedUserId,
      date
    };
  
    const selectedUser = this.users.find(u => u.id === this.selectedUserId);
  
  
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
      this.activityData.description = this.activityData.description || '';

      payload.activityLog = [this.activityData];
    }
  
    this.DailyLogService.createOrUpdateDailyLog(payload).subscribe({
      next: (res) => {
        console.log(`${type} log added`, res);
        alert(`${type === 'food' ? 'Food' : 'Activity'} added successfully`);
        
        if (type === 'food') {
          this.foodData = {};
        } else if (type === 'activity') {
          this.activityData = {};
        }
      },
      error: (err) => console.error(`Error adding ${type}`, err)
    });
  }

}
