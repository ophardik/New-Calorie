import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';
import { UserListComponent } from '../user-list/user-list.component';

@Component({
  selector: 'app-signup',
  imports: [FormsModule,UserListComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
user={
  name:"",
  email:"",
  weight:"",
  height:"",
  gender:"",
  age:""
}

constructor(private userService:UserService){}

submitUser(){
  this.userService.createUser(this.user).subscribe({
    next:()=>{
      console.log("User created");
      alert("User Created")
    },
    error:()=>{
      console.log("Error creating user");
    }
  })
}
}
