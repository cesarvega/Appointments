import { Injectable } from "@angular/core"
import { Http, Response, Headers } from "@angular/http";
import { URLSearchParams } from "@angular/http"
import { BehaviorSubject, Observable } from 'rxjs/';
import { Appointment } from "./appointment.model";

import * as application from 'application'

declare let android: any
@Injectable()
export class AppointmentService {
    private url = "https://tools.brandinstitute.com/wsbi/bimobile.asmx/"
    private urlGetAppointments = "getAppointments"
    private urlSetGeoLocation = "addGeoLocation"

    public appointments: Observable<Appointment[]>;
    private _appointments = <BehaviorSubject<Appointment[]>>new BehaviorSubject([]);
    private dataStore: {
        appointments: Appointment[]
    };
    private latitude = 25.773338;
    private longitude = -80.190072;
    private monthNames = ["Jan", "Febr", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    constructor(private http: Http) {
        this._appointments = <BehaviorSubject<Appointment[]>>new BehaviorSubject([]);
        this.appointments = this._appointments.asObservable();
    }

    getAppointments(): Observable<Array<Appointment>> {
        let headers = new Headers({ 'content-type': 'application/x-www-form-urlencoded' });
        let body = new URLSearchParams();
        body.set('phoneId', "3057427989");
        body.set('phoneIdType', "1111111111");
        body.set('selDate', "10/16/2017");

        return this.http.post(this.url + this.urlGetAppointments, body.toString(), { headers: headers }).map(res => {
            let data = res.json();
            res.json().map((obj: any) => {
                let dateTime = new Date(obj.AppDate);
                obj.AppDate = dateTime.getDate().toString() + ',' + this.monthNames[dateTime.getMonth()].toString() + '-' +
                    + ((dateTime.getHours() + 24 - 2) % 24).toString() + ':'
                    + dateTime.getMinutes().toString() + ((dateTime.getHours() >= 12) ? " PM" : " AM").toString();
            });
            return data;
        });
    }


    getUsersNumber(){



    }


    setGeoLocation(location : any , appointment : Appointment): Observable<any>{


        let dateTime = new Date();
        let dateahora = dateTime.getFullYear().toString() + '-' + dateTime.getMonth().toString() + '-' + dateTime.getDate().toString() + ' ' +
           + dateTime.getHours().toString() + ':' + dateTime.getMinutes().toString()  + ':'  + dateTime.getSeconds().toString();
        const headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        
        let dataNumber  = application.android.context.getSystemService(android.content.Context.TELEPHONY_SERVICE).getLine1Number();
        const body = new URLSearchParams();
        body.set('phoneId', "30574252");
        body.set('phoneIdType', "1");
        body.set('geoDate', dateahora);
        // body.set('geoDate', now.toString());
        body.set('appId', appointment.AppId.toString());
        body.set('geoLatitude', location.latitude.toString());
        body.set('geoLongitude', location.longitude.toString());
      
       return this.http.post('https://tools.brandinstitute.com/wsbi/bimobile.asmx/addGeoLocatio', body.toString(), {headers: headers}).map(res => res.json());
    }

    getAppointment(id: number): Appointment {
        return this.appointments.filter(appointment => appointment[0].AppDate === "10/16/2017")[0];
    }
}

