import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes } from "@angular/router";

import { AppointmentComponent } from "./appointment/appointment.component";
import { AppointmentDetailComponent } from "./appointment/appointment-detail.component";

const routes: Routes = [
    { path: "", redirectTo: "/appointment", pathMatch: "full" },
    { path: "appointment", component: AppointmentComponent },
    { path: "appointment/:appointment", component: AppointmentDetailComponent },
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }