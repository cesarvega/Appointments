import { Injectable } from "@angular/core"
import { Http, Response, Headers } from "@angular/http";
import { URLSearchParams } from "@angular/http"
import { BehaviorSubject, Observable } from 'rxjs/';
import { Appointment } from "./appointment.model";
import * as Toast from "nativescript-toast";
import * as application from 'application'
import { LoopAppointment } from "./loop/loop-appointment.model";
import { setActivityCallbacks, AndroidActivityCallbacks } from "ui/frame";
declare let com: any;
declare let android: any
declare let _super: any
declare let HttpPost: any

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
                var hours = obj.AppDate.split('T')[1].toString();
                var time = hours.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [obj.AppDate];
                if (time.length > 1) { // If time format correct
                    time = time.slice(1);  // Remove full string match value
                    time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
                    time[0] = +time[0] % 12 || 12; // Adjust hours
                }
                var temp = dateTime.getDate().toString() + ',' + this.monthNames[dateTime.getMonth()].toString() + '-' + time.join('');
                obj.AppDate = temp;
            });
            return data;
        });
    }

    getAppointmentLocation(appointmentAddress): Observable<Array<Appointment>> {
        return this.http.get("http://maps.googleapis.com/maps/api/geocode/json?address=" + appointmentAddress).map(res => res.json());
    }

    setGeoLocation(location: any, appointment: Appointment): Observable<any> {
        let dateTime = new Date();
        let dateahora = dateTime.getFullYear().toString() + '-' + (dateTime.getMonth() + 1).toString() + '-' + dateTime.getDate().toString() + ' ' +
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

    
    testService(location: any, appointment: Appointment) {

        // android.app.Activity.extend("com.tns.activities.NotificationActivity", {
        //     onCreate: function(bundle) {
        //         _super.prototype.onCreate.call(this, bundle);
        //     }
        // });


        android.app.job.JobService.extend("com.tns.notifications.MyJobService", {
            onStartJob: function(params) {       
                console.log("Job execution ...");
                let dateTime = new Date();
                let dateahora = dateTime.getFullYear().toString() + '-' + (dateTime.getMonth() + 1).toString() + '-' + dateTime.getDate().toString() + ' ' +
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
                var url = "https://tools.brandinstitute.com/wsbi/bimobile.asmx/";
                var NAMESPACE = "http://brandpoll.brandinstitute.com/BIGeoLocation/";
                var METHOD_NAME = "addGEO";
                // var request = new SoapObject(NAMESPACE, METHOD_NAME);
                // HttpPost httpPost = new HttpPost(myURL);

                // this.http.post(url + 'addGeoLocation', body.toString(), { headers: headers }).map(res => res.json());
                // android.app.Service.jobFinished(params, true)
                return false;
            },
            
            onStopJob: function() {
                console.log("Stopping job ...");
            },
            jobFinished(params, needsReschedule){
                console.log("reschedule job ...");
            }
        });
        
        function scheduleJob() {

            var utils = require("utils/utils");
                
            var context = utils.ad.getApplicationContext(); // get a reference to the application context in Android
            
            var component = new android.content.ComponentName(context, com.tns.notifications.MyJobService.class);
        
            // Set the id of the job to something meaningful for you
            const builder = new android.app.job.JobInfo.Builder(1, component);
        
            // Optional: Set how often the task should be triggered. The minimum is 15min.
            builder.setPeriodic(15 * 60 * 1000);
            
            // Optional: Set additional requirements under what conditions your job should be triggered
            builder.setRequiresCharging(true);
        
            const jobScheduler = context.getSystemService(android.content.Context.JOB_SCHEDULER_SERVICE);
            console.log("Job Scheduled: " + jobScheduler.schedule(builder.build()));
        }


        scheduleJob();
        

        // com.pip3r4o.android.app.IntentService.extend("com.tns.notifications.NotificationIntentService" /* give your class a valid name as it will need to be declared in the AndroidManifest later */, {
        //     onHandleIntent: function (intent) {
                
        //         var action = intent.getAction();
        //         if ("ACTION_START" == action) {
        //             postNotification();
        //         } else if ('ACTION_STOP' == action) {
        //          /* get the system alarm manager and cancel all pending alarms, which will stop the service from executing periodically  */
        //         }
        //         android.support.v4.content.WakefulBroadcastReceiver.completeWakefulIntent(intent);  
        //     }           
        //  });

        //  function postNotification() {
        //     // Do something. For example, fetch fresh data from backend to create a rich notification?
        //     var utils = require("utils/utils");
        //     var context = utils.ad.getApplicationContext(); // get a reference to the application context in Android
        //     var builder = new android.app.Notification.Builder(context);
        //     builder.setContentTitle("Scheduled Notification")
        //         .setAutoCancel(true)
        //         .setColor(android.R.color.holo_purple) // optional
        //         .setContentText("This notification has been triggered by Notification Service")
        //         .setVibrate([100, 200, 100]) // optional
        //         .setSmallIcon(android.R.drawable.btn_star_big_on);
        //         // will open main NativeScript activity when the notification is pressed
        //     var mainIntent = new android.content.Intent(context, com.tns.NativeScriptActivity.class);
        //     var pendingIntent = android.app.PendingIntent.getActivity(context,
        //         1,
        //         mainIntent,
        //         android.app.PendingIntent.FLAG_UPDATE_CURRENT);
        //     builder.setContentIntent(pendingIntent);
        //     builder.setDeleteIntent(getDeleteIntent(context));
        //     var manager = context.getSystemService(android.content.Context.NOTIFICATION_SERVICE);
        //     manager.notify(1, builder.build());
        //  }

        //  /* only necessary for dismissing the notification from the Notifications Screen */
        //  function getDeleteIntent(context) {
        //         var intent = new android.content.Intent(context, com.tns.broadcastreceivers.NotificationEventReceiver.class);
        //         intent.setAction("ACTION_DELETE_NOTIFICATION");
        //         return android.app.PendingIntent.getBroadcast(context, 0, intent, android.app.PendingIntent.FLAG_UPDATE_CURRENT);
        //  }
       
        //BROADCASTER
     
         
    //      android.support.v4.content.WakefulBroadcastReceiver.extend("com.tns.broadcastreceivers.NotificationEventReceiver", {       
    //         onReceive: function(context, intent){
    //             var action = intent.getAction();
    //             var serviceIntent = null;
    //             if ("ACTION_START_NOTIFICATION_SERVICE" == action) {
    //                 console.log("onReceive from alarm, starting notification service! thread: ");
    //                 serviceIntent = createIntentStartNotificationService(context);
    //             } else if ("ACTION_DELETE_NOTIFICATION" == action) {
    //                 console.log("onReceive delete notification action, starting notification service to handle delete");
    //                 serviceIntent = createIntentDeleteNotification(context);
    //             }        
    //             if (serviceIntent) {
    //                 android.support.v4.content.WakefulBroadcastReceiver.startWakefulService(context, serviceIntent);
    //             }
    //         }
    //      })


    //      var Intent = android.content.Intent;
    //      function createIntentStartNotificationService(context) {
    //         var intent = new Intent(context, com.tns.notifications.NotificationIntentService.class);
    //         intent.setAction("ACTION_START");
    //         return intent;
    //      }

    //      function createIntentDeleteNotification(context) {
    //         var intent = new Intent(context, com.tns.notifications.NotificationIntentService.class);
    //         intent.setAction("ACTION_DELETE");
    //         return intent;
    //      }

    //     // Set The Alarm and the intet to pass 



    //      function getStartPendingIntent(context) {
    //         var alarmIntent = new android.content.Intent(context, com.tns.broadcastreceivers.NotificationEventReceiver.class);
    //         alarmIntent.setAction("ACTION_START_NOTIFICATION_SERVICE");
    //         return android.app.PendingIntent.getBroadcast(context, 0, alarmIntent, android.app.PendingIntent.FLAG_UPDATE_CURRENT);
    //      }

    //      setupAlarm();// call setUpAlrm to beging the Intent 
    //      function setupAlarm() {
    //         var utils = require("utils/utils");
    //         var context = utils.ad.getApplicationContext();
    //         var alarmManager = context.getSystemService(android.content.Context.ALARM_SERVICE);
    //         var alarmIntent = getStartPendingIntent(context);
    //         var d = new Date();
    //         var currentTime = d.getTime();           

    //         alarmManager.setRepeating(android.app.AlarmManager.RTC_WAKEUP,          
    //             currentTime,
    //             1000  * 3, /* alarm will send the `alarmIntent` object every 3 seconds */
    //             alarmIntent);
    //      }
        
    };


    

}

