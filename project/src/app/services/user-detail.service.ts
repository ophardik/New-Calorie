import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserDetailService {

  private baseUrl="http://localhost:8002/user"

  constructor(private http:HttpClient) { }

  getAllUsers():Observable<any>{
    return this.http.get(`${this.baseUrl}/allUsers`)
  }

  getSingleUser(id:string):Observable<any>{
    return this.http.get(`${this.baseUrl}/singleUser/${id}`)
  }
}
