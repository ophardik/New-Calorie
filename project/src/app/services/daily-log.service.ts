import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DailyLogService {
  // addActivityLog(activityPayload: { userId: string; date: any; activityLog: { activityId: any; duration: any; METvalue: any; caloriesOut: number; }[]; }) {
  //   throw new Error('Method not implemented.');
  // }

  private baseUrl='http://localhost:8002/dailylog'
  constructor(private http:HttpClient) { }

  createLog(data:any){
    return this.http.post(`${this.baseUrl}/addLog`,data)  
  }
  allDailyLog(userId:string){
    return this.http.get(`http://localhost:8002/dailylog/allLogs`, {
      params: { userId: userId || '' }
    });  }
}
