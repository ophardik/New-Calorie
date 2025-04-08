import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  private baseUrl='http://localhost:8002/userActivity'
  constructor(private http:HttpClient) { }

  addActivity(data:any){
    return this.http.post(`${this.baseUrl}/addUserActivity`,data)
  }

  getAllActivity(){
    return this.http.get("http://localhost:8002/activity/allActivity")
  }
}
