import { Component, OnInit } from '@angular/core';
import { UserDetailService } from '../../services/user-detail.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DailyLogService } from '../../services/daily-log.service';
import { UserSpecificComponent } from '../user-specific/user-specific.component';
import { FoodListService } from '../../services/food-list.service';
import { ActivityService } from '../../services/activity.service';

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
  users: any[] = [];
  allLogs: any[] = [];
  filteredLogs: any[] = []; 
  userId: string | null = null;
  selectedDate: string = '';
  fetchedLog: any = null;
  foodList: any[] = [];
  uniqueFoodGroups: string[] = [];
  activityList: any[] = [];
  uniqueActivityGroups: string[] = [];

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

  constructor(
    private route: ActivatedRoute,
    private userDetailService: UserDetailService,
    private dailyLogService: DailyLogService,
    private foodListService: FoodListService,
    private activityService: ActivityService,
    
  ) {}

  ngOnInit(): void {

    this.foodListService.getAllFood().subscribe({
      next: (res: any) => {
        this.foodList = res.data || [];
        this.uniqueFoodGroups = Array.from(new Set(this.foodList.map(f => f.foodGroup).filter(Boolean)));
      },
      error: (err) => console.error("error fetching foodList", err)
    });



    this.userId = this.route.snapshot.paramMap.get('id');
    if (this.userId) {
      this.dailyLogService.allDailyLog(this.userId).subscribe({
        next: (res: any) => {
          this.allLogs = res.data || [];
          console.log()
          this.filteredLogs = [...this.allLogs]; 
        },
        error: (err) => {
          console.error("Error fetching logs:", err);
        }
      });
    }
    
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
  onActivityChange() {
    const selectedActivity = this.activityList.find(a => a._id === this.activityData.activityId);
    if (selectedActivity) {
      this.activityData.activityName = selectedActivity.activityName;
      this.activityData.METvalue = selectedActivity.METs;
    }
  }
  onSelectUser(user: any) {
    const userIdFromRoute = this.route.snapshot.paramMap.get('id');
    console.log("Selected User ID from route:", userIdFromRoute);
    if (userIdFromRoute) {
      this.selectedUserId = userIdFromRoute;
      console.log("Selected User ID from route:", this.selectedUserId);
    } else {
      console.warn("No userId found in the route.");
    }
  }
  
  onFoodChange() {
    const selectedFood = this.foodList.find(f => f._id === this.foodData.foodId);
    if (selectedFood) {
      this.foodData.foodName = selectedFood.foodName;
    }
  }
  fetchLogByDate() {
    if (!this.selectedDate) {
      this.filteredLogs = [...this.allLogs]; 
      return;
    }

    const filtered = this.allLogs.filter((log) => {
      const logDate = new Date(log.date).toISOString().split('T')[0];
      return logDate === this.selectedDate;
    });

    this.filteredLogs = filtered;
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
  
    this.dailyLogService.createOrUpdateDailyLog(payload).subscribe({
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
