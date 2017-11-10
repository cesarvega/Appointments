import { Injectable } from "@angular/core"
import { Http, Response, Headers } from "@angular/http";
import { URLSearchParams } from "@angular/http"
import { BehaviorSubject, Observable } from 'rxjs/';
import { Appointment } from "./appointment.model";

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



    setGeoLocation(geolaction: any): void {

        let headers = new Headers({ 'content-type': 'application/x-www-form-urlencoded' });
        let body = new URLSearchParams();
        body.set('phoneId', "3057427989");
        body.set('phoneIdType', "1111111111");
        body.set('geoDate', "10/16/2017");
        body.set('appId', "2222");
        body.set('geoLatitude', this.latitude.toString());
        body.set('geoLongitude', this.longitude.toString());

        this.http.post('https://tools.brandinstitute.com/wsbi/bimobile.asmx/addGeoLocation', body, { headers: headers }).map(res => {
            let data = res.json();
            console.dir(data);

            // res.json().map((obj : any) => {
            //     let dateTime = new Date(obj.AppDate);
            //     obj.AppDate = dateTime.getDate().toString() + ',' + this.monthNames[dateTime.getMonth()].toString() + '-' +
            //      + ((dateTime.getHours() + 24 - 2) % 24).toString() + ':' 
            //      + dateTime.getMinutes().toString() + ((dateTime.getHours() >= 12) ? " PM" : " AM").toString() ;            
            // });
            // return data;
        });
    }

    getAppointment(id: number): Appointment {
        return this.appointments.filter(appointment => appointment[0].AppDate === "10/16/2017")[0];
    }
}

