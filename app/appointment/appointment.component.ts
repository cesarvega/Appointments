import { Component, OnInit } from "@angular/core";
import { AppointmentService } from "./appointment.service";
import { registerElement } from 'nativescript-angular/element-registry';
import { Observable } from 'rxjs/';
import { Appointment } from "./appointment.model";
import { NavigationExtras, Router } from "@angular/router";
import { android } from "tns-core-modules/application/application";
registerElement('Emoji' , () => require('nativescript-emoji').Emoji);

@Component({
    selector: "ns-items",
    moduleId: module.id,
    styleUrls: ["appointment.css"],
    templateUrl: "appointment.component.html"
})
export class AppointmentComponent implements OnInit {
    private appointments: Observable<Appointment[]>; 
    constructor(private _router: Router,private appointmentService: AppointmentService) { }
    ngOnInit(): void {
        this.appointments = this.appointmentService.getAppointments();
        // let context = android.context
        // let phoneNumber = android.context.
    }
    public onNavigationItemTap(appointment: Appointment) {
                let appointmentdata = JSON.stringify(appointment);
                    this._router.navigate(['/appointment', appointmentdata]);                    
            }
}