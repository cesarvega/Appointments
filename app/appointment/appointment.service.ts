import { Injectable } from "@angular/core"
import { Http, Response, Headers } from "@angular/http";
import { URLSearchParams } from "@angular/http"
import { BehaviorSubject, Observable } from 'rxjs/';
import { Appointment } from "./appointment.model";
import { intl } from "nativescript-intl";

import * as application from 'application'
import { LoopAppointment } from "./loop/loop-appointment.model";

declare let android: any
@Injectable()
export class AppointmentService {
    private url = "https://tools.brandinstitute.com/wsbi/bimobile.asmx/"
    private urlGetAppointments = "getAppointments"
    private urlSetGeoLocation = "addGeoLocation"
    private getExpensesByAppId = "getExpensesByAppointmentId"
    private phoneNumber: Observable<any>;

    public appointments: Observable<Appointment[]>;
    private _appointments = <BehaviorSubject<Appointment[]>>new BehaviorSubject([]);
    private dataStore: {
        appointments: Appointment[]
    };
    // private latitude = 25.773338;
    // private longitude = -80.190072;
    private monthNames = ["Jan", "Febr", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    constructor(private http: Http) {
        this._appointments = <BehaviorSubject<Appointment[]>>new BehaviorSubject([]);
        this.appointments = this._appointments.asObservable();
    }

    getAppointments(date: string): Observable<Array<Appointment>> {
        let headers = new Headers({ 'content-type': 'application/x-www-form-urlencoded' });
        let body = new URLSearchParams();
        body.set('phoneId', localStorage.getItem('phoneNumber'));
        body.set('phoneIdType', "1");
        body.set('selDate', date);

        return this.http.post(this.url + this.urlGetAppointments, body.toString(), { headers: headers }).map(res => {
            let data = res.json();
            res.json().map((obj: any) => {
                let dateTime = new Date(obj.AppDate);

                var dateFormat = new intl.DateTimeFormat('en-US', {'year': 'numeric', 'month': 'short', 'day': 'numeric'}).format(new Date(obj.AppDate));
                var numberFormat = new intl.NumberFormat('en-US', {'style': 'currency', 'currency': 'USD', 'currencyDisplay': 'symbol'}).format(123456.789);
                 
                console.log("dateFormat: " + dateFormat);
                console.log("numberFormat: " + numberFormat);
                // prints Mar 23, 2016
                // $123456.79

                var d = new Date(obj.AppDate);
                var n = dateTime.getHours();
                obj.AppDate = dateTime.getDate().toString() + ',' + this.monthNames[dateTime.getMonth()].toString() + '-' +
                    + (( n+5 + 24 - 2) % 24).toString() + ':'
                    + dateTime.getMinutes().toString() + ((dateTime.getHours() >= 12) ? " PM" : " AM").toString();
            });
            return data;
        });
    }

    getAppointmentLocation(appointmentAddress): Observable<Array<Appointment>> {
        return this.http.get("http://maps.googleapis.com/maps/api/geocode/json?address=" + appointmentAddress).map(res => res.json());
    }

    setGeoLocation(location: any, appointment: Appointment): Observable<any> {
        let dateTime = new Date();
        let dateahora = dateTime.getFullYear().toString() + '-' + dateTime.getMonth().toString() + '-' + dateTime.getDate().toString() + ' ' +
            + dateTime.getHours().toString() + ':' + dateTime.getMinutes().toString() + ':' + dateTime.getSeconds().toString();
        const headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        const body = new URLSearchParams();
        body.set('phoneId', localStorage.getItem('phoneNumber'));
        body.set('phoneIdType', "1");
        body.set('geoDate', dateahora);
        body.set('appId', appointment.AppId.toString());
        body.set('geoLatitude', location.latitude.toString());
        body.set('geoLongitude', location.longitude.toString());

        return this.http.post(this.url + 'addGeoLocation', body.toString(), { headers: headers }).map(res => res.json());
    }

    saveExpense(appointment: Appointment, imageBase64: any, recType: string, recTotal: string): Observable<any> {
        let headers = new Headers({ 'content-type': 'application/x-www-form-urlencoded' });
        const body = new URLSearchParams();
        body.set('phoneId', localStorage.getItem('phoneNumber'));
        body.set('phoneIdType', "1");
        body.set('appId', appointment.AppId.toString());
        // body.set('recType', recType);  use when real values in number come from dropdown
        body.set('recType', '1');
        body.set('recTotal', recTotal);
        body.set('imgType', 'base64');
        body.set('img', imageBase64);
        return this.http.post(this.url + 'addAppReceiptString', body.toString(), { headers: headers }).map(res => {
            res.json();
            imageBase64 = null;
        });
    }

    getExpensesByAppointmentId(appid: string) {
        let headers = new Headers({ 'content-type': 'application/x-www-form-urlencoded' });
        let body = new URLSearchParams();
        body.set('phoneId', localStorage.getItem('phoneNumber'));
        body.set('phoneIdType', "1");
        body.set('appid', appid);
        return this.http.post(this.url + 'getExpensesByAppointmentId', body.toString(), { headers: headers }).map(res => res.json());
    }

}

