import { Component, OnInit } from "@angular/core";
import { AppointmentService } from "./appointment.service";
import { registerElement } from 'nativescript-angular/element-registry';
import { Observable } from 'rxjs/';
import { Appointment } from "./appointment.model";
import { NavigationExtras, Router } from "@angular/router";
import { android } from "tns-core-modules/application/application";
import { Telephony } from "nativescript-telephony";
registerElement('Emoji', () => require('nativescript-emoji').Emoji);
import 'nativescript-localstorage'
import { LoopAppointmentService } from "./loop/loop-appointment.service";
import { LoopAppointment } from "./loop/loop-appointment.model";


import { DatePicker } from "ui/date-picker";
import { EventData } from "data/observable";

@Component({
    selector: "ns-items",
    moduleId: module.id,
    styleUrls: ["appointment.css"],
    templateUrl: "appointment.component.html"
})

export class AppointmentComponent implements OnInit {
    private stringDate: string;
    private appointments: Observable<Appointment[]>;
    // private appointments:  Observable<LoopAppointment[]>; 
    private isItemVisible = false;
    constructor(private _router: Router, private appointmentService: AppointmentService, private loopAppointmentService: LoopAppointmentService) { 
        Telephony().then(function (resolved) {
            localStorage.setItem('phoneNumber', (resolved.phoneNumber)?resolved.phoneNumber:'15555218135');
        }).catch(function (error) {
            console.error('error >', error)
            console.dir(error);
        });          
    }

    ngOnInit(): void {  
        // this.loopAppointmentService.loopGetAppiontments().catch(err =>  { 
        //     console.dir(err);            
        //     return err; // observable needs to be returned or exception raised
        //  }).subscribe((res: Observable<Array<LoopAppointment>>) => {
        //     console.dir(res);
        //     this.appointments = res;            
        // });
        
        let date =  new Date();      
        this.setAppointmentDate(date);           
    }

    setAppointmentDate(date : Date){
        if (localStorage.getItem('phoneNumber') === null) {
            Telephony().then(function (resolved) {
                localStorage.setItem('phoneNumber', (resolved.phoneNumber)?resolved.phoneNumber:'15555218135');
            }).catch(function (error) {
                console.error('error >', error)
                console.dir(error);
            });  
        };    

        let day = date.getDate();
        let month = date.getMonth() + 1;// from 0 - 11
        let year = date.getFullYear();
        this.stringDate = month.toString() + "/" + day.toString() + "/" + year.toString();
        this.appointments = this.appointmentService.getAppointments(this.stringDate);
    }

    onNavigationItemTap(appointment: Appointment) {
        let appointmentdata = JSON.stringify(appointment);
        this._router.navigate(['/appointment', appointmentdata]);
    }

    setDate() {        
        this.isItemVisible = (this.isItemVisible)? false : true;
    }

    onPickerLoaded(args) {
        let datePicker = <DatePicker>args.object;
        datePicker.date =  new Date(Date.now());
        datePicker.minDate = new Date(1975, 0, 29);
        datePicker.maxDate = new Date(2045, 4, 12);
    }

    onDateChanged(args) {
        console.log("Date changed");
        console.log("New value: " + args.value);
        // console.log("Old value: " + args.oldValue);
        this.setAppointmentDate(args.value);
    }

    onDayChanged(args) {
        // console.log("Day changed");
        // console.log("New value: " + args.value);
        // console.log("Old value: " + args.oldValue);
    }

    onMonthChanged(args) {
        // console.log("Month changed");
        // console.log("New value: " + args.value);
        // console.log("Old value: " + args.oldValue);
    }

    onYearChanged(args) {
        // console.log("Year changed");
        // console.log("New value: " + args.value);
        // console.log("Old value: " + args.oldValue);
    }

}