import { NgModule } from "@angular/core";
import { LoginComponent } from "./login/login.component";
import { SignUpComponent } from "./signup/signup.component";
import { AngularMaterialModule } from '../angular-material.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthRoutingModule } from './auth-routing.module';

@NgModule({
   declarations: [
     LoginComponent,
     SignUpComponent
   ],
   imports: [
     CommonModule,
     FormsModule,
     AngularMaterialModule,
     AuthRoutingModule
   ]
})
export class AuthModule {}
