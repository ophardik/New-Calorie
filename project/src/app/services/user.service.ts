import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
 
  private baseUrl="http://localhost:8002/user"
  constructor(private http:HttpClient) { }

  createUser(userData:any){
    return this.http.post(`${this.baseUrl}/addUser`,userData)
  }
}
