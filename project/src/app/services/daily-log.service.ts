import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DailyLogService {


  private baseUrl='http://localhost:8002/dailylog'
  constructor(private http:HttpClient) { }

  createOrUpdateDailyLog(data:any){
    return this.http.post(`${this.baseUrl}/addLog`,data)  
  }
  allDailyLog(userId:string){
    return this.http.get(`http://localhost:8002/dailylog/allLogs`, {
      params: { userId: userId || '' }
    }); 
   }
   getLogByDate(userId:string,date:string){
    return this.http.get(`${this.baseUrl}/getLogs/?userId=${userId}&date=${date}`)
   }
  getLogById(id:string):Observable<any>{
    return this.http.get(`${this.baseUrl}/getLogs/${id}`)
  }
}
