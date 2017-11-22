import { Injectable } from "@angular/core"
import { Http, Response, Headers } from "@angular/http";
import { URLSearchParams } from "@angular/http"
import { BehaviorSubject, Observable } from 'rxjs/';
import { Appointment } from "../appointment.model";

import * as application from 'application'
import { LoopAppointment } from "./loop-appointment.model";

declare let android: any
@Injectable()
export class LoopAppointmentService {
    
    private loopUrl = "https://appointments-ymudsebwqs.now.sh/api/"
    private api = "appointments"
    private urlSetGeoLocation = "addGeoLocation"
    private phoneNumber: Observable<any>;

    public appointments: Observable<LoopAppointment[]>;
    private _appointments = <BehaviorSubject<LoopAppointment[]>>new BehaviorSubject([]);
    private dataStore: {
        appointments: Appointment[]
    };

    constructor(private http: Http) {
        this._appointments = <BehaviorSubject<LoopAppointment[]>>new BehaviorSubject([]);
        this.appointments = this._appointments.asObservable();
    }
    
    loopGetAppiontments(): Observable<Array<LoopAppointment>>{
        return this.http.get(this.loopUrl + this.api).map(res => res.json());
    }
}

