import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AppointmentService } from "./appointment.service";
import { Appointment } from "./appointment.model";
import * as elementRegistryModule from 'nativescript-angular/element-registry';
elementRegistryModule.registerElement("CardView", () => require("nativescript-cardview").CardView);
@Component({
    selector: "ns-details",
    moduleId: module.id,
    templateUrl: "./appointment-detail.component.html",
    styleUrls: ['./appointment-detail.css']
})
export class AppointmentDetailComponent implements OnInit {
    private appointment: Appointment;
    constructor(
        private appointmentService: AppointmentService,
        private route: ActivatedRoute) { 
       this.appointment = <Appointment>JSON.parse(this.route.snapshot.params["appointment"]);
     }
    ngOnInit(): void {        
    }
    
}
