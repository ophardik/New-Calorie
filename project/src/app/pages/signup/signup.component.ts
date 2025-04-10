import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';
import { UserListComponent } from '../user-list/user-list.component';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [FormsModule,RouterLink],
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

constructor(private router:Router,private userService:UserService){}

submitUser(){
  this.userService.createUser(this.user).subscribe({
    next:(response:any)=>{
      console.log("User created");
      alert("User Created")
      localStorage.setItem('userId', response.user._id);

      this.router.navigate(['/user-list'])
    },
    error:()=>{
      console.log("Error creating user");
    }
  })
}
}
