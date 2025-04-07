import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FoodService {
 
  private baseUrl='http://localhost:8002/userFood'
  constructor(private http:HttpClient) { }

  addFood(data:any){
    return this.http.post(`${this.baseUrl}/addUserFood`,data)
  }
}
