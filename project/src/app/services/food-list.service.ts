import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FoodListService {
 
  private basUrl='http://localhost:8002/food'
  constructor(private http:HttpClient) { }

  getAllFood(){
 return this.http.get(`${this.basUrl}/allFood`)
  }
}
