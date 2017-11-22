import { Component, OnInit } from "@angular/core";
import { AppointmentService } from "./appointment.service";
import { registerElement } from 'nativescript-angular/element-registry';
import { Observable } from 'rxjs/';
import { Appointment } from "./appointment.model";
import { NavigationExtras, Router } from "@angular/router";
import { android } from "tns-core-modules/application/application";
import { Telephony } from "nativescript-telephony";
registerElement('Emoji' , () => require('nativescript-emoji').Emoji);
import 'nativescript-localstorage'
import { LoopAppointmentService } from "./loop/loop-appointment.service";
import { LoopAppointment } from "./loop/loop-appointment.model";
@Component({
    selector: "ns-items",
    moduleId: module.id,
    styleUrls: ["appointment.css"],
    templateUrl: "appointment.component.html"
})
export class AppointmentComponent implements OnInit {
    private appointments: Observable<Appointment[]>; 
    // private appointments:  Observable<LoopAppointment[]>; 
    constructor(private _router: Router,private appointmentService: AppointmentService,private loopAppointmentService: LoopAppointmentService) {}
  
    ngOnInit(): void {
        Telephony().then(function(resolved) {          
            localStorage.setItem('phoneNumber', resolved.phoneNumber);
        }).catch(function(error) {
            console.error('error >', error)
            console.dir(error);
        })
        // this.loopAppointmentService.loopGetAppiontments().catch(err =>  { 
        //     console.dir(err);            
        //     return err; // observable needs to be returned or exception raised
        //  }).subscribe((res: Observable<Array<LoopAppointment>>) => {
        //     console.dir(res);
        //     this.appointments = res;            
        // });
        this.appointments = this.appointmentService.getAppointments();
    }
    
    onNavigationItemTap(appointment: Appointment) {
                let appointmentdata = JSON.stringify(appointment);
                    this._router.navigate(['/appointment', appointmentdata]);                    
            }
}