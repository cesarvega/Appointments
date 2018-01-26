"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var http_2 = require("@angular/http");
var _1 = require("rxjs/");
var AppointmentService = (function () {
    function AppointmentService(http) {
        this.http = http;
        this.url = "https://tools.brandinstitute.com/wsbi/bimobile.asmx/";
        this.urlGetAppointments = "getAppointments";
        this.urlSetGeoLocation = "addGeoLocation";
        this.getExpensesByAppId = "getExpensesByAppointmentId";
        this._appointments = new _1.BehaviorSubject([]);
        // private latitude = 25.773338;
        // private longitude = -80.190072;
        this.monthNames = ["Jan", "Febr", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
        this._appointments = new _1.BehaviorSubject([]);
        this.appointments = this._appointments.asObservable();
    }
    AppointmentService.prototype.getAppointments = function (date) {
        var _this = this;
        var headers = new http_1.Headers({ 'content-type': 'application/x-www-form-urlencoded' });
        var body = new http_2.URLSearchParams();
        body.set('phoneId', localStorage.getItem('phoneNumber'));
        body.set('phoneIdType', "1");
        body.set('selDate', date);
        return this.http.post(this.url + this.urlGetAppointments, body.toString(), { headers: headers }).map(function (res) {
            var data = res.json();
            res.json().map(function (obj) {
                var dateTime = new Date(obj.AppDate);
                var hours = obj.AppDate.split('T')[1].toString();
                var time = hours.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [obj.AppDate];
                if (time.length > 1) {
                    time = time.slice(1); // Remove full string match value
                    time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
                    time[0] = +time[0] % 12 || 12; // Adjust hours
                }
                var temp = dateTime.getDate().toString() + ',' + _this.monthNames[dateTime.getMonth()].toString() + '-' + time.join('');
                obj.AppDate = temp;
            });
            return data;
        });
    };
    AppointmentService.prototype.getAppointmentLocation = function (appointmentAddress) {
        return this.http.get("http://maps.googleapis.com/maps/api/geocode/json?address=" + appointmentAddress).map(function (res) { return res.json(); });
    };
    AppointmentService.prototype.setGeoLocation = function (location, appointment) {
        var dateTime = new Date();
        var dateahora = dateTime.getFullYear().toString() + '-' + (dateTime.getMonth() + 1).toString() + '-' + dateTime.getDate().toString() + ' ' +
            +dateTime.getHours().toString() + ':' + dateTime.getMinutes().toString() + ':' + dateTime.getSeconds().toString();
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        var body = new http_2.URLSearchParams();
        body.set('phoneId', localStorage.getItem('phoneNumber'));
        body.set('phoneIdType', "1");
        body.set('geoDate', dateahora);
        body.set('appId', appointment.AppId.toString());
        body.set('geoLatitude', location.latitude.toString());
        body.set('geoLongitude', location.longitude.toString());
        return this.http.post(this.url + 'addGeoLocation', body.toString(), { headers: headers }).map(function (res) { return res.json(); });
    };
    AppointmentService.prototype.saveExpense = function (appointment, imageBase64, recType, recTotal) {
        var headers = new http_1.Headers({ 'content-type': 'application/x-www-form-urlencoded' });
        var body = new http_2.URLSearchParams();
        body.set('phoneId', localStorage.getItem('phoneNumber'));
        body.set('phoneIdType', "1");
        body.set('appId', appointment.AppId.toString());
        // body.set('recType', recType);  use when real values in number come from dropdown
        body.set('recType', '1');
        body.set('recTotal', recTotal);
        body.set('imgType', 'base64');
        body.set('img', imageBase64);
        return this.http.post(this.url + 'addAppReceiptString', body.toString(), { headers: headers }).map(function (res) {
            res.json();
            imageBase64 = null;
        });
    };
    AppointmentService.prototype.getExpensesByAppointmentId = function (appid) {
        var headers = new http_1.Headers({ 'content-type': 'application/x-www-form-urlencoded' });
        var body = new http_2.URLSearchParams();
        body.set('phoneId', localStorage.getItem('phoneNumber'));
        body.set('phoneIdType', "1");
        body.set('appid', appid);
        return this.http.post(this.url + 'getExpensesByAppointmentId', body.toString(), { headers: headers }).map(function (res) { return res.json(); });
    };
    AppointmentService.prototype.testService = function (location, appointment) {
        // android.app.Activity.extend("com.tns.activities.NotificationActivity", {
        //     onCreate: function(bundle) {
        //         _super.prototype.onCreate.call(this, bundle);
        //     }
        // });
        android.app.job.JobService.extend("com.tns.notifications.MyJobService", {
            onStartJob: function (params) {
                console.log("Job execution ...");
                var dateTime = new Date();
                var dateahora = dateTime.getFullYear().toString() + '-' + (dateTime.getMonth() + 1).toString() + '-' + dateTime.getDate().toString() + ' ' +
                    +dateTime.getHours().toString() + ':' + dateTime.getMinutes().toString() + ':' + dateTime.getSeconds().toString();
                var headers = new http_1.Headers();
                headers.append('Content-Type', 'application/x-www-form-urlencoded');
                var body = new http_2.URLSearchParams();
                body.set('phoneId', localStorage.getItem('phoneNumber'));
                body.set('phoneIdType', "1");
                body.set('geoDate', dateahora);
                body.set('appId', appointment.AppId.toString());
                body.set('geoLatitude', location.latitude.toString());
                body.set('geoLongitude', location.longitude.toString());
                var url = "https://tools.brandinstitute.com/wsbi/bimobile.asmx/";
                var NAMESPACE = "http://brandpoll.brandinstitute.com/BIGeoLocation/";
                var METHOD_NAME = "addGEO";
                var request = new SoapObject(NAMESPACE, METHOD_NAME);
                // this.http.post(url + 'addGeoLocation', body.toString(), { headers: headers }).map(res => res.json());
                // android.app.Service.jobFinished(params, true)
                return false;
            },
            onStopJob: function () {
                console.log("Stopping job ...");
            },
            jobFinished: function (params, needsReschedule) {
                console.log("reschedule job ...");
            }
        });
        function scheduleJob() {
            var utils = require("utils/utils");
            var context = utils.ad.getApplicationContext(); // get a reference to the application context in Android
            var component = new android.content.ComponentName(context, com.tns.notifications.MyJobService.class);
            // Set the id of the job to something meaningful for you
            var builder = new android.app.job.JobInfo.Builder(1, component);
            // Optional: Set how often the task should be triggered. The minimum is 15min.
            builder.setPeriodic(15 * 60 * 1000);
            // Optional: Set additional requirements under what conditions your job should be triggered
            builder.setRequiresCharging(true);
            var jobScheduler = context.getSystemService(android.content.Context.JOB_SCHEDULER_SERVICE);
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
    ;
    AppointmentService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http])
    ], AppointmentService);
    return AppointmentService;
}());
exports.AppointmentService = AppointmentService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwb2ludG1lbnQuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwcG9pbnRtZW50LnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBMEM7QUFDMUMsc0NBQXdEO0FBQ3hELHNDQUErQztBQUMvQywwQkFBb0Q7QUFZcEQ7SUFrQkksNEJBQW9CLElBQVU7UUFBVixTQUFJLEdBQUosSUFBSSxDQUFNO1FBakJ0QixRQUFHLEdBQUcsc0RBQXNELENBQUE7UUFDNUQsdUJBQWtCLEdBQUcsaUJBQWlCLENBQUE7UUFDdEMsc0JBQWlCLEdBQUcsZ0JBQWdCLENBQUE7UUFDcEMsdUJBQWtCLEdBQUcsNEJBQTRCLENBQUE7UUFJakQsa0JBQWEsR0FBbUMsSUFBSSxrQkFBZSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBSWhGLGdDQUFnQztRQUNoQyxrQ0FBa0M7UUFDMUIsZUFBVSxHQUFHLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLO1lBQzNELEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSztTQUMzQyxDQUFDO1FBR0UsSUFBSSxDQUFDLGFBQWEsR0FBbUMsSUFBSSxrQkFBZSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzdFLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUMxRCxDQUFDO0lBRUQsNENBQWUsR0FBZixVQUFnQixJQUFZO1FBQTVCLGlCQXNCQztRQXJCRyxJQUFJLE9BQU8sR0FBRyxJQUFJLGNBQU8sQ0FBQyxFQUFFLGNBQWMsRUFBRSxtQ0FBbUMsRUFBRSxDQUFDLENBQUM7UUFDbkYsSUFBSSxJQUFJLEdBQUcsSUFBSSxzQkFBZSxFQUFFLENBQUM7UUFDakMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsWUFBWSxDQUFDLE9BQU8s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QUFTO1FBRVQsNERBQTREO1FBQzVELCtCQUErQjtRQUMvQiw4Q0FBOEM7UUFDOUMsMERBQTBEO1FBQzFELDhGQUE4RjtRQUM5Riw0REFBNEQ7UUFDNUQsOEJBQThCO1FBQzlCLG9EQUFvRDtRQUVwRCxtRkFBbUY7UUFDbkYsMkJBQTJCO1FBQzNCLHdGQUF3RjtRQUN4Riw0QkFBNEI7UUFDNUIsU0FBUztJQUVULENBQUM7SUFBQSxDQUFDO0lBeFFPLGtCQUFrQjtRQUQ5QixpQkFBVSxFQUFFO3lDQW1CaUIsV0FBSTtPQWxCckIsa0JBQWtCLENBNlE5QjtJQUFELHlCQUFDO0NBQUEsQUE3UUQsSUE2UUM7QUE3UVksZ0RBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCJcbmltcG9ydCB7IEh0dHAsIFJlc3BvbnNlLCBIZWFkZXJzIH0gZnJvbSBcIkBhbmd1bGFyL2h0dHBcIjtcbmltcG9ydCB7IFVSTFNlYXJjaFBhcmFtcyB9IGZyb20gXCJAYW5ndWxhci9odHRwXCJcbmltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCwgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMvJztcbmltcG9ydCB7IEFwcG9pbnRtZW50IH0gZnJvbSBcIi4vYXBwb2ludG1lbnQubW9kZWxcIjtcbmltcG9ydCAqIGFzIFRvYXN0IGZyb20gXCJuYXRpdmVzY3JpcHQtdG9hc3RcIjtcbmltcG9ydCAqIGFzIGFwcGxpY2F0aW9uIGZyb20gJ2FwcGxpY2F0aW9uJ1xuaW1wb3J0IHsgTG9vcEFwcG9pbnRtZW50IH0gZnJvbSBcIi4vbG9vcC9sb29wLWFwcG9pbnRtZW50Lm1vZGVsXCI7XG5pbXBvcnQgeyBzZXRBY3Rpdml0eUNhbGxiYWNrcywgQW5kcm9pZEFjdGl2aXR5Q2FsbGJhY2tzIH0gZnJvbSBcInVpL2ZyYW1lXCI7XG5kZWNsYXJlIGxldCBjb206IGFueTtcbmRlY2xhcmUgbGV0IGFuZHJvaWQ6IGFueVxuZGVjbGFyZSBsZXQgX3N1cGVyOiBhbnlcbmRlY2xhcmUgbGV0IFNvYXBPYmplY3Q6IGFueVxuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQXBwb2ludG1lbnRTZXJ2aWNlIHtcbiAgICBwcml2YXRlIHVybCA9IFwiaHR0cHM6Ly90b29scy5icmFuZGluc3RpdHV0ZS5jb20vd3NiaS9iaW1vYmlsZS5hc214L1wiXG4gICAgcHJpdmF0ZSB1cmxHZXRBcHBvaW50bWVudHMgPSBcImdldEFwcG9pbnRtZW50c1wiXG4gICAgcHJpdmF0ZSB1cmxTZXRHZW9Mb2NhdGlvbiA9IFwiYWRkR2VvTG9jYXRpb25cIlxuICAgIHByaXZhdGUgZ2V0RXhwZW5zZXNCeUFwcElkID0gXCJnZXRFeHBlbnNlc0J5QXBwb2ludG1lbnRJZFwiXG4gICAgcHJpdmF0ZSBwaG9uZU51bWJlcjogT2JzZXJ2YWJsZTxhbnk+O1xuXG4gICAgcHVibGljIGFwcG9pbnRtZW50czogT2JzZXJ2YWJsZTxBcHBvaW50bWVudFtdPjtcbiAgICBwcml2YXRlIF9hcHBvaW50bWVudHMgPSA8QmVoYXZpb3JTdWJqZWN0PEFwcG9pbnRtZW50W10+Pm5ldyBCZWhhdmlvclN1YmplY3QoW10pO1xuICAgIHByaXZhdGUgZGF0YVN0b3JlOiB7XG4gICAgICAgIGFwcG9pbnRtZW50czogQXBwb2ludG1lbnRbXVxuICAgIH07XG4gICAgLy8gcHJpdmF0ZSBsYXRpdHVkZSA9IDI1Ljc3MzMzODtcbiAgICAvLyBwcml2YXRlIGxvbmdpdHVkZSA9IC04MC4xOTAwNzI7XG4gICAgcHJpdmF0ZSBtb250aE5hbWVzID0gW1wiSmFuXCIsIFwiRmViclwiLCBcIk1hclwiLCBcIkFwclwiLCBcIk1heVwiLCBcIkp1blwiLFxuICAgICAgICBcIkp1bFwiLCBcIkF1Z1wiLCBcIlNlcFwiLCBcIk9jdFwiLCBcIk5vdlwiLCBcIkRlY1wiXG4gICAgXTtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgaHR0cDogSHR0cCkge1xuICAgICAgICB0aGlzLl9hcHBvaW50bWVudHMgPSA8QmVoYXZpb3JTdWJqZWN0PEFwcG9pbnRtZW50W10+Pm5ldyBCZWhhdmlvclN1YmplY3QoW10pO1xuICAgICAgICB0aGlzLmFwcG9pbnRtZW50cyA9IHRoaXMuX2FwcG9pbnRtZW50cy5hc09ic2VydmFibGUoKTtcbiAgICB9XG5cbiAgICBnZXRBcHBvaW50bWVudHMoZGF0ZTogc3RyaW5nKTogT2JzZXJ2YWJsZTxBcnJheTxBcHBvaW50bWVudD4+IHtcbiAgICAgICAgbGV0IGhlYWRlcnMgPSBuZXcgSGVhZGVycyh7ICdjb250ZW50LXR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyB9KTtcbiAgICAgICAgbGV0IGJvZHkgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKCk7XG4gICAgICAgIGJvZHkuc2V0KCdwaG9uZUlkJywgbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3Bob25lTnVtYmVyJykpO1xuICAgICAgICBib2R5LnNldCgncGhvbmVJZFR5cGUnLCBcIjFcIik7XG4gICAgICAgIGJvZHkuc2V0KCdzZWxEYXRlJywgZGF0ZSk7XG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAucG9zdCh0aGlzLnVybCArIHRoaXMudXJsR2V0QXBwb2ludG1lbnRzLCBib2R5LnRvU3RyaW5nKCksIHsgaGVhZGVyczogaGVhZGVycyB9KS5tYXAocmVzID0+IHtcbiAgICAgICAgICAgIGxldCBkYXRhID0gcmVzLmpzb24oKTtcbiAgICAgICAgICAgIHJlcy5qc29uKCkubWFwKChvYmo6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBkYXRlVGltZSA9IG5ldyBEYXRlKG9iai5BcHBEYXRlKTtcbiAgICAgICAgICAgICAgICB2YXIgaG91cnMgPSBvYmouQXBwRGF0ZS5zcGxpdCgnVCcpWzFdLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgdmFyIHRpbWUgPSBob3Vycy50b1N0cmluZygpLm1hdGNoKC9eKFswMV1cXGR8MlswLTNdKSg6KShbMC01XVxcZCkoOlswLTVdXFxkKT8kLykgfHwgW29iai5BcHBEYXRlXTtcbiAgICAgICAgICAgICAgICBpZiAodGltZS5sZW5ndGggPiAxKSB7IC8vIElmIHRpbWUgZm9ybWF0IGNvcnJlY3RcbiAgICAgICAgICAgICAgICAgICAgdGltZSA9IHRpbWUuc2xpY2UoMSk7ICAvLyBSZW1vdmUgZnVsbCBzdHJpbmcgbWF0Y2ggdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgdGltZVs1XSA9ICt0aW1lWzBdIDwgMTIgPyAnQU0nIDogJ1BNJzsgLy8gU2V0IEFNL1BNXG4gICAgICAgICAgICAgICAgICAgIHRpbWVbMF0gPSArdGltZVswXSAlIDEyIHx8IDEyOyAvLyBBZGp1c3QgaG91cnNcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIHRlbXAgPSBkYXRlVGltZS5nZXREYXRlKCkudG9TdHJpbmcoKSArICcsJyArIHRoaXMubW9udGhOYW1lc1tkYXRlVGltZS5nZXRNb250aCgpXS50b1N0cmluZygpICsgJy0nICsgdGltZS5qb2luKCcnKTtcbiAgICAgICAgICAgICAgICBvYmouQXBwRGF0ZSA9IHRlbXA7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBnZXRBcHBvaW50bWVudExvY2F0aW9uKGFwcG9pbnRtZW50QWRkcmVzcyk6IE9ic2VydmFibGU8QXJyYXk8QXBwb2ludG1lbnQ+PiB7XG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KFwiaHR0cDovL21hcHMuZ29vZ2xlYXBpcy5jb20vbWFwcy9hcGkvZ2VvY29kZS9qc29uP2FkZHJlc3M9XCIgKyBhcHBvaW50bWVudEFkZHJlc3MpLm1hcChyZXMgPT4gcmVzLmpzb24oKSk7XG4gICAgfVxuXG4gICAgc2V0R2VvTG9jYXRpb24obG9jYXRpb246IGFueSwgYXBwb2ludG1lbnQ6IEFwcG9pbnRtZW50KTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICAgICAgbGV0IGRhdGVUaW1lID0gbmV3IERhdGUoKTtcbiAgICAgICAgbGV0IGRhdGVhaG9yYSA9IGRhdGVUaW1lLmdldEZ1bGxZZWFyKCkudG9TdHJpbmcoKSArICctJyArIChkYXRlVGltZS5nZXRNb250aCgpICsgMSkudG9TdHJpbmcoKSArICctJyArIGRhdGVUaW1lLmdldERhdGUoKS50b1N0cmluZygpICsgJyAnICtcbiAgICAgICAgICAgICsgZGF0ZVRpbWUuZ2V0SG91cnMoKS50b1N0cmluZygpICsgJzonICsgZGF0ZVRpbWUuZ2V0TWludXRlcygpLnRvU3RyaW5nKCkgKyAnOicgKyBkYXRlVGltZS5nZXRTZWNvbmRzKCkudG9TdHJpbmcoKTtcbiAgICAgICAgY29uc3QgaGVhZGVycyA9IG5ldyBIZWFkZXJzKCk7XG4gICAgICAgIGhlYWRlcnMuYXBwZW5kKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyk7XG4gICAgICAgIGNvbnN0IGJvZHkgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKCk7XG4gICAgICAgIGJvZHkuc2V0KCdwaG9uZUlkJywgbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3Bob25lTnVtYmVyJykpO1xuICAgICAgICBib2R5LnNldCgncGhvbmVJZFR5cGUnLCBcIjFcIik7XG4gICAgICAgIGJvZHkuc2V0KCdnZW9EYXRlJywgZGF0ZWFob3JhKTtcbiAgICAgICAgYm9keS5zZXQoJ2FwcElkJywgYXBwb2ludG1lbnQuQXBwSWQudG9TdHJpbmcoKSk7XG4gICAgICAgIGJvZHkuc2V0KCdnZW9MYXRpdHVkZScsIGxvY2F0aW9uLmxhdGl0dWRlLnRvU3RyaW5nKCkpO1xuICAgICAgICBib2R5LnNldCgnZ2VvTG9uZ2l0dWRlJywgbG9jYXRpb24ubG9uZ2l0dWRlLnRvU3RyaW5nKCkpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAucG9zdCh0aGlzLnVybCArICdhZGRHZW9Mb2NhdGlvbicsIGJvZHkudG9TdHJpbmcoKSwgeyBoZWFkZXJzOiBoZWFkZXJzIH0pLm1hcChyZXMgPT4gcmVzLmpzb24oKSk7XG4gICAgfVxuXG4gICAgc2F2ZUV4cGVuc2UoYXBwb2ludG1lbnQ6IEFwcG9pbnRtZW50LCBpbWFnZUJhc2U2NDogYW55LCByZWNUeXBlOiBzdHJpbmcsIHJlY1RvdGFsOiBzdHJpbmcpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgICAgICBsZXQgaGVhZGVycyA9IG5ldyBIZWFkZXJzKHsgJ2NvbnRlbnQtdHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnIH0pO1xuICAgICAgICBjb25zdCBib2R5ID0gbmV3IFVSTFNlYXJjaFBhcmFtcygpO1xuICAgICAgICBib2R5LnNldCgncGhvbmVJZCcsIGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdwaG9uZU51bWJlcicpKTtcbiAgICAgICAgYm9keS5zZXQoJ3Bob25lSWRUeXBlJywgXCIxXCIpO1xuICAgICAgICBib2R5LnNldCgnYXBwSWQnLCBhcHBvaW50bWVudC5BcHBJZC50b1N0cmluZygpKTtcbiAgICAgICAgLy8gYm9keS5zZXQoJ3JlY1R5cGUnLCByZWNUeXBlKTsgIHVzZSB3aGVuIHJlYWwgdmFsdWVzIGluIG51bWJlciBjb21lIGZyb20gZHJvcGRvd25cbiAgICAgICAgYm9keS5zZXQoJ3JlY1R5cGUnLCAnMScpO1xuICAgICAgICBib2R5LnNldCgncmVjVG90YWwnLCByZWNUb3RhbCk7XG4gICAgICAgIGJvZHkuc2V0KCdpbWdUeXBlJywgJ2Jhc2U2NCcpO1xuICAgICAgICBib2R5LnNldCgnaW1nJywgaW1hZ2VCYXNlNjQpO1xuICAgICAgICByZXR1cm4gdGhpcy5odHRwLnBvc3QodGhpcy51cmwgKyAnYWRkQXBwUmVjZWlwdFN0cmluZycsIGJvZHkudG9TdHJpbmcoKSwgeyBoZWFkZXJzOiBoZWFkZXJzIH0pLm1hcChyZXMgPT4ge1xuICAgICAgICAgICAgcmVzLmpzb24oKTtcbiAgICAgICAgICAgIGltYWdlQmFzZTY0ID0gbnVsbDtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZ2V0RXhwZW5zZXNCeUFwcG9pbnRtZW50SWQoYXBwaWQ6IHN0cmluZykge1xuICAgICAgICBsZXQgaGVhZGVycyA9IG5ldyBIZWFkZXJzKHsgJ2NvbnRlbnQtdHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnIH0pO1xuICAgICAgICBsZXQgYm9keSA9IG5ldyBVUkxTZWFyY2hQYXJhbXMoKTtcbiAgICAgICAgYm9keS5zZXQoJ3Bob25lSWQnLCBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncGhvbmVOdW1iZXInKSk7XG4gICAgICAgIGJvZHkuc2V0KCdwaG9uZUlkVHlwZScsIFwiMVwiKTtcbiAgICAgICAgYm9keS5zZXQoJ2FwcGlkJywgYXBwaWQpO1xuICAgICAgICByZXR1cm4gdGhpcy5odHRwLnBvc3QodGhpcy51cmwgKyAnZ2V0RXhwZW5zZXNCeUFwcG9pbnRtZW50SWQnLCBib2R5LnRvU3RyaW5nKCksIHsgaGVhZGVyczogaGVhZGVycyB9KS5tYXAocmVzID0+IHJlcy5qc29uKCkpO1xuICAgIH1cblxuICAgIFxuICAgIHRlc3RTZXJ2aWNlKGxvY2F0aW9uOiBhbnksIGFwcG9pbnRtZW50OiBBcHBvaW50bWVudCkge1xuXG4gICAgICAgIC8vIGFuZHJvaWQuYXBwLkFjdGl2aXR5LmV4dGVuZChcImNvbS50bnMuYWN0aXZpdGllcy5Ob3RpZmljYXRpb25BY3Rpdml0eVwiLCB7XG4gICAgICAgIC8vICAgICBvbkNyZWF0ZTogZnVuY3Rpb24oYnVuZGxlKSB7XG4gICAgICAgIC8vICAgICAgICAgX3N1cGVyLnByb3RvdHlwZS5vbkNyZWF0ZS5jYWxsKHRoaXMsIGJ1bmRsZSk7XG4gICAgICAgIC8vICAgICB9XG4gICAgICAgIC8vIH0pO1xuXG5cbiAgICAgICAgYW5kcm9pZC5hcHAuam9iLkpvYlNlcnZpY2UuZXh0ZW5kKFwiY29tLnRucy5ub3RpZmljYXRpb25zLk15Sm9iU2VydmljZVwiLCB7XG4gICAgICAgICAgICBvblN0YXJ0Sm9iOiBmdW5jdGlvbihwYXJhbXMpIHsgICAgICAgXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJKb2IgZXhlY3V0aW9uIC4uLlwiKTtcbiAgICAgICAgICAgICAgICBsZXQgZGF0ZVRpbWUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgICAgIGxldCBkYXRlYWhvcmEgPSBkYXRlVGltZS5nZXRGdWxsWWVhcigpLnRvU3RyaW5nKCkgKyAnLScgKyAoZGF0ZVRpbWUuZ2V0TW9udGgoKSArIDEpLnRvU3RyaW5nKCkgKyAnLScgKyBkYXRlVGltZS5nZXREYXRlKCkudG9TdHJpbmcoKSArICcgJyArXG4gICAgICAgICAgICAgICAgICAgICsgZGF0ZVRpbWUuZ2V0SG91cnMoKS50b1N0cmluZygpICsgJzonICsgZGF0ZVRpbWUuZ2V0TWludXRlcygpLnRvU3RyaW5nKCkgKyAnOicgKyBkYXRlVGltZS5nZXRTZWNvbmRzKCkudG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICBjb25zdCBoZWFkZXJzID0gbmV3IEhlYWRlcnMoKTtcbiAgICAgICAgICAgICAgICBoZWFkZXJzLmFwcGVuZCgnQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGJvZHkgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKCk7XG4gICAgICAgICAgICAgICAgYm9keS5zZXQoJ3Bob25lSWQnLCBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncGhvbmVOdW1iZXInKSk7XG4gICAgICAgICAgICAgICAgYm9keS5zZXQoJ3Bob25lSWRUeXBlJywgXCIxXCIpO1xuICAgICAgICAgICAgICAgIGJvZHkuc2V0KCdnZW9EYXRlJywgZGF0ZWFob3JhKTtcbiAgICAgICAgICAgICAgICBib2R5LnNldCgnYXBwSWQnLCBhcHBvaW50bWVudC5BcHBJZC50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICBib2R5LnNldCgnZ2VvTGF0aXR1ZGUnLCBsb2NhdGlvbi5sYXRpdHVkZS50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICBib2R5LnNldCgnZ2VvTG9uZ2l0dWRlJywgbG9jYXRpb24ubG9uZ2l0dWRlLnRvU3RyaW5nKCkpOyAgIFxuICAgICAgICAgICAgICAgIHZhciB1cmwgPSBcImh0dHBzOi8vdG9vbHMuYnJhbmRpbnN0aXR1dGUuY29tL3dzYmkvYmltb2JpbGUuYXNteC9cIjtcbiAgICAgICAgICAgICAgICB2YXIgTkFNRVNQQUNFID0gXCJodHRwOi8vYnJhbmRwb2xsLmJyYW5kaW5zdGl0dXRlLmNvbS9CSUdlb0xvY2F0aW9uL1wiO1xuICAgICAgICAgICAgICAgIHZhciBNRVRIT0RfTkFNRSA9IFwiYWRkR0VPXCI7XG4gICAgICAgICAgICAgICAgdmFyIHJlcXVlc3QgPSBuZXcgU29hcE9iamVjdChOQU1FU1BBQ0UsIE1FVEhPRF9OQU1FKTtcblxuICAgICAgICAgICAgICAgIC8vIHRoaXMuaHR0cC5wb3N0KHVybCArICdhZGRHZW9Mb2NhdGlvbicsIGJvZHkudG9TdHJpbmcoKSwgeyBoZWFkZXJzOiBoZWFkZXJzIH0pLm1hcChyZXMgPT4gcmVzLmpzb24oKSk7XG4gICAgICAgICAgICAgICAgLy8gYW5kcm9pZC5hcHAuU2VydmljZS5qb2JGaW5pc2hlZChwYXJhbXMsIHRydWUpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgb25TdG9wSm9iOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlN0b3BwaW5nIGpvYiAuLi5cIik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgam9iRmluaXNoZWQocGFyYW1zLCBuZWVkc1Jlc2NoZWR1bGUpe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicmVzY2hlZHVsZSBqb2IgLi4uXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIGZ1bmN0aW9uIHNjaGVkdWxlSm9iKCkge1xuXG4gICAgICAgICAgICB2YXIgdXRpbHMgPSByZXF1aXJlKFwidXRpbHMvdXRpbHNcIik7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgY29udGV4dCA9IHV0aWxzLmFkLmdldEFwcGxpY2F0aW9uQ29udGV4dCgpOyAvLyBnZXQgYSByZWZlcmVuY2UgdG8gdGhlIGFwcGxpY2F0aW9uIGNvbnRleHQgaW4gQW5kcm9pZFxuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgY29tcG9uZW50ID0gbmV3IGFuZHJvaWQuY29udGVudC5Db21wb25lbnROYW1lKGNvbnRleHQsIGNvbS50bnMubm90aWZpY2F0aW9ucy5NeUpvYlNlcnZpY2UuY2xhc3MpO1xuICAgICAgICBcbiAgICAgICAgICAgIC8vIFNldCB0aGUgaWQgb2YgdGhlIGpvYiB0byBzb21ldGhpbmcgbWVhbmluZ2Z1bCBmb3IgeW91XG4gICAgICAgICAgICBjb25zdCBidWlsZGVyID0gbmV3IGFuZHJvaWQuYXBwLmpvYi5Kb2JJbmZvLkJ1aWxkZXIoMSwgY29tcG9uZW50KTtcbiAgICAgICAgXG4gICAgICAgICAgICAvLyBPcHRpb25hbDogU2V0IGhvdyBvZnRlbiB0aGUgdGFzayBzaG91bGQgYmUgdHJpZ2dlcmVkLiBUaGUgbWluaW11bSBpcyAxNW1pbi5cbiAgICAgICAgICAgIGJ1aWxkZXIuc2V0UGVyaW9kaWMoMTUgKiA2MCAqIDEwMDApO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBPcHRpb25hbDogU2V0IGFkZGl0aW9uYWwgcmVxdWlyZW1lbnRzIHVuZGVyIHdoYXQgY29uZGl0aW9ucyB5b3VyIGpvYiBzaG91bGQgYmUgdHJpZ2dlcmVkXG4gICAgICAgICAgICBidWlsZGVyLnNldFJlcXVpcmVzQ2hhcmdpbmcodHJ1ZSk7XG4gICAgICAgIFxuICAgICAgICAgICAgY29uc3Qgam9iU2NoZWR1bGVyID0gY29udGV4dC5nZXRTeXN0ZW1TZXJ2aWNlKGFuZHJvaWQuY29udGVudC5Db250ZXh0LkpPQl9TQ0hFRFVMRVJfU0VSVklDRSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkpvYiBTY2hlZHVsZWQ6IFwiICsgam9iU2NoZWR1bGVyLnNjaGVkdWxlKGJ1aWxkZXIuYnVpbGQoKSkpO1xuICAgICAgICB9XG5cblxuICAgICAgICBzY2hlZHVsZUpvYigpO1xuICAgICAgICBcblxuICAgICAgICAvLyBjb20ucGlwM3I0by5hbmRyb2lkLmFwcC5JbnRlbnRTZXJ2aWNlLmV4dGVuZChcImNvbS50bnMubm90aWZpY2F0aW9ucy5Ob3RpZmljYXRpb25JbnRlbnRTZXJ2aWNlXCIgLyogZ2l2ZSB5b3VyIGNsYXNzIGEgdmFsaWQgbmFtZSBhcyBpdCB3aWxsIG5lZWQgdG8gYmUgZGVjbGFyZWQgaW4gdGhlIEFuZHJvaWRNYW5pZmVzdCBsYXRlciAqLywge1xuICAgICAgICAvLyAgICAgb25IYW5kbGVJbnRlbnQ6IGZ1bmN0aW9uIChpbnRlbnQpIHtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgLy8gICAgICAgICB2YXIgYWN0aW9uID0gaW50ZW50LmdldEFjdGlvbigpO1xuICAgICAgICAvLyAgICAgICAgIGlmIChcIkFDVElPTl9TVEFSVFwiID09IGFjdGlvbikge1xuICAgICAgICAvLyAgICAgICAgICAgICBwb3N0Tm90aWZpY2F0aW9uKCk7XG4gICAgICAgIC8vICAgICAgICAgfSBlbHNlIGlmICgnQUNUSU9OX1NUT1AnID09IGFjdGlvbikge1xuICAgICAgICAvLyAgICAgICAgICAvKiBnZXQgdGhlIHN5c3RlbSBhbGFybSBtYW5hZ2VyIGFuZCBjYW5jZWwgYWxsIHBlbmRpbmcgYWxhcm1zLCB3aGljaCB3aWxsIHN0b3AgdGhlIHNlcnZpY2UgZnJvbSBleGVjdXRpbmcgcGVyaW9kaWNhbGx5ICAqL1xuICAgICAgICAvLyAgICAgICAgIH1cbiAgICAgICAgLy8gICAgICAgICBhbmRyb2lkLnN1cHBvcnQudjQuY29udGVudC5XYWtlZnVsQnJvYWRjYXN0UmVjZWl2ZXIuY29tcGxldGVXYWtlZnVsSW50ZW50KGludGVudCk7ICBcbiAgICAgICAgLy8gICAgIH0gICAgICAgICAgIFxuICAgICAgICAvLyAgfSk7XG5cbiAgICAgICAgLy8gIGZ1bmN0aW9uIHBvc3ROb3RpZmljYXRpb24oKSB7XG4gICAgICAgIC8vICAgICAvLyBEbyBzb21ldGhpbmcuIEZvciBleGFtcGxlLCBmZXRjaCBmcmVzaCBkYXRhIGZyb20gYmFja2VuZCB0byBjcmVhdGUgYSByaWNoIG5vdGlmaWNhdGlvbj9cbiAgICAgICAgLy8gICAgIHZhciB1dGlscyA9IHJlcXVpcmUoXCJ1dGlscy91dGlsc1wiKTtcbiAgICAgICAgLy8gICAgIHZhciBjb250ZXh0ID0gdXRpbHMuYWQuZ2V0QXBwbGljYXRpb25Db250ZXh0KCk7IC8vIGdldCBhIHJlZmVyZW5jZSB0byB0aGUgYXBwbGljYXRpb24gY29udGV4dCBpbiBBbmRyb2lkXG4gICAgICAgIC8vICAgICB2YXIgYnVpbGRlciA9IG5ldyBhbmRyb2lkLmFwcC5Ob3RpZmljYXRpb24uQnVpbGRlcihjb250ZXh0KTtcbiAgICAgICAgLy8gICAgIGJ1aWxkZXIuc2V0Q29udGVudFRpdGxlKFwiU2NoZWR1bGVkIE5vdGlmaWNhdGlvblwiKVxuICAgICAgICAvLyAgICAgICAgIC5zZXRBdXRvQ2FuY2VsKHRydWUpXG4gICAgICAgIC8vICAgICAgICAgLnNldENvbG9yKGFuZHJvaWQuUi5jb2xvci5ob2xvX3B1cnBsZSkgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgICAgICAuc2V0Q29udGVudFRleHQoXCJUaGlzIG5vdGlmaWNhdGlvbiBoYXMgYmVlbiB0cmlnZ2VyZWQgYnkgTm90aWZpY2F0aW9uIFNlcnZpY2VcIilcbiAgICAgICAgLy8gICAgICAgICAuc2V0VmlicmF0ZShbMTAwLCAyMDAsIDEwMF0pIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgICAgICAgLnNldFNtYWxsSWNvbihhbmRyb2lkLlIuZHJhd2FibGUuYnRuX3N0YXJfYmlnX29uKTtcbiAgICAgICAgLy8gICAgICAgICAvLyB3aWxsIG9wZW4gbWFpbiBOYXRpdmVTY3JpcHQgYWN0aXZpdHkgd2hlbiB0aGUgbm90aWZpY2F0aW9uIGlzIHByZXNzZWRcbiAgICAgICAgLy8gICAgIHZhciBtYWluSW50ZW50ID0gbmV3IGFuZHJvaWQuY29udGVudC5JbnRlbnQoY29udGV4dCwgY29tLnRucy5OYXRpdmVTY3JpcHRBY3Rpdml0eS5jbGFzcyk7XG4gICAgICAgIC8vICAgICB2YXIgcGVuZGluZ0ludGVudCA9IGFuZHJvaWQuYXBwLlBlbmRpbmdJbnRlbnQuZ2V0QWN0aXZpdHkoY29udGV4dCxcbiAgICAgICAgLy8gICAgICAgICAxLFxuICAgICAgICAvLyAgICAgICAgIG1haW5JbnRlbnQsXG4gICAgICAgIC8vICAgICAgICAgYW5kcm9pZC5hcHAuUGVuZGluZ0ludGVudC5GTEFHX1VQREFURV9DVVJSRU5UKTtcbiAgICAgICAgLy8gICAgIGJ1aWxkZXIuc2V0Q29udGVudEludGVudChwZW5kaW5nSW50ZW50KTtcbiAgICAgICAgLy8gICAgIGJ1aWxkZXIuc2V0RGVsZXRlSW50ZW50KGdldERlbGV0ZUludGVudChjb250ZXh0KSk7XG4gICAgICAgIC8vICAgICB2YXIgbWFuYWdlciA9IGNvbnRleHQuZ2V0U3lzdGVtU2VydmljZShhbmRyb2lkLmNvbnRlbnQuQ29udGV4dC5OT1RJRklDQVRJT05fU0VSVklDRSk7XG4gICAgICAgIC8vICAgICBtYW5hZ2VyLm5vdGlmeSgxLCBidWlsZGVyLmJ1aWxkKCkpO1xuICAgICAgICAvLyAgfVxuXG4gICAgICAgIC8vICAvKiBvbmx5IG5lY2Vzc2FyeSBmb3IgZGlzbWlzc2luZyB0aGUgbm90aWZpY2F0aW9uIGZyb20gdGhlIE5vdGlmaWNhdGlvbnMgU2NyZWVuICovXG4gICAgICAgIC8vICBmdW5jdGlvbiBnZXREZWxldGVJbnRlbnQoY29udGV4dCkge1xuICAgICAgICAvLyAgICAgICAgIHZhciBpbnRlbnQgPSBuZXcgYW5kcm9pZC5jb250ZW50LkludGVudChjb250ZXh0LCBjb20udG5zLmJyb2FkY2FzdHJlY2VpdmVycy5Ob3RpZmljYXRpb25FdmVudFJlY2VpdmVyLmNsYXNzKTtcbiAgICAgICAgLy8gICAgICAgICBpbnRlbnQuc2V0QWN0aW9uKFwiQUNUSU9OX0RFTEVURV9OT1RJRklDQVRJT05cIik7XG4gICAgICAgIC8vICAgICAgICAgcmV0dXJuIGFuZHJvaWQuYXBwLlBlbmRpbmdJbnRlbnQuZ2V0QnJvYWRjYXN0KGNvbnRleHQsIDAsIGludGVudCwgYW5kcm9pZC5hcHAuUGVuZGluZ0ludGVudC5GTEFHX1VQREFURV9DVVJSRU5UKTtcbiAgICAgICAgLy8gIH1cbiAgICAgICBcbiAgICAgICAgLy9CUk9BRENBU1RFUlxuICAgICBcbiAgICAgICAgIFxuICAgIC8vICAgICAgYW5kcm9pZC5zdXBwb3J0LnY0LmNvbnRlbnQuV2FrZWZ1bEJyb2FkY2FzdFJlY2VpdmVyLmV4dGVuZChcImNvbS50bnMuYnJvYWRjYXN0cmVjZWl2ZXJzLk5vdGlmaWNhdGlvbkV2ZW50UmVjZWl2ZXJcIiwgeyAgICAgICBcbiAgICAvLyAgICAgICAgIG9uUmVjZWl2ZTogZnVuY3Rpb24oY29udGV4dCwgaW50ZW50KXtcbiAgICAvLyAgICAgICAgICAgICB2YXIgYWN0aW9uID0gaW50ZW50LmdldEFjdGlvbigpO1xuICAgIC8vICAgICAgICAgICAgIHZhciBzZXJ2aWNlSW50ZW50ID0gbnVsbDtcbiAgICAvLyAgICAgICAgICAgICBpZiAoXCJBQ1RJT05fU1RBUlRfTk9USUZJQ0FUSU9OX1NFUlZJQ0VcIiA9PSBhY3Rpb24pIHtcbiAgICAvLyAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJvblJlY2VpdmUgZnJvbSBhbGFybSwgc3RhcnRpbmcgbm90aWZpY2F0aW9uIHNlcnZpY2UhIHRocmVhZDogXCIpO1xuICAgIC8vICAgICAgICAgICAgICAgICBzZXJ2aWNlSW50ZW50ID0gY3JlYXRlSW50ZW50U3RhcnROb3RpZmljYXRpb25TZXJ2aWNlKGNvbnRleHQpO1xuICAgIC8vICAgICAgICAgICAgIH0gZWxzZSBpZiAoXCJBQ1RJT05fREVMRVRFX05PVElGSUNBVElPTlwiID09IGFjdGlvbikge1xuICAgIC8vICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIm9uUmVjZWl2ZSBkZWxldGUgbm90aWZpY2F0aW9uIGFjdGlvbiwgc3RhcnRpbmcgbm90aWZpY2F0aW9uIHNlcnZpY2UgdG8gaGFuZGxlIGRlbGV0ZVwiKTtcbiAgICAvLyAgICAgICAgICAgICAgICAgc2VydmljZUludGVudCA9IGNyZWF0ZUludGVudERlbGV0ZU5vdGlmaWNhdGlvbihjb250ZXh0KTtcbiAgICAvLyAgICAgICAgICAgICB9ICAgICAgICBcbiAgICAvLyAgICAgICAgICAgICBpZiAoc2VydmljZUludGVudCkge1xuICAgIC8vICAgICAgICAgICAgICAgICBhbmRyb2lkLnN1cHBvcnQudjQuY29udGVudC5XYWtlZnVsQnJvYWRjYXN0UmVjZWl2ZXIuc3RhcnRXYWtlZnVsU2VydmljZShjb250ZXh0LCBzZXJ2aWNlSW50ZW50KTtcbiAgICAvLyAgICAgICAgICAgICB9XG4gICAgLy8gICAgICAgICB9XG4gICAgLy8gICAgICB9KVxuXG5cbiAgICAvLyAgICAgIHZhciBJbnRlbnQgPSBhbmRyb2lkLmNvbnRlbnQuSW50ZW50O1xuICAgIC8vICAgICAgZnVuY3Rpb24gY3JlYXRlSW50ZW50U3RhcnROb3RpZmljYXRpb25TZXJ2aWNlKGNvbnRleHQpIHtcbiAgICAvLyAgICAgICAgIHZhciBpbnRlbnQgPSBuZXcgSW50ZW50KGNvbnRleHQsIGNvbS50bnMubm90aWZpY2F0aW9ucy5Ob3RpZmljYXRpb25JbnRlbnRTZXJ2aWNlLmNsYXNzKTtcbiAgICAvLyAgICAgICAgIGludGVudC5zZXRBY3Rpb24oXCJBQ1RJT05fU1RBUlRcIik7XG4gICAgLy8gICAgICAgICByZXR1cm4gaW50ZW50O1xuICAgIC8vICAgICAgfVxuXG4gICAgLy8gICAgICBmdW5jdGlvbiBjcmVhdGVJbnRlbnREZWxldGVOb3RpZmljYXRpb24oY29udGV4dCkge1xuICAgIC8vICAgICAgICAgdmFyIGludGVudCA9IG5ldyBJbnRlbnQoY29udGV4dCwgY29tLnRucy5ub3RpZmljYXRpb25zLk5vdGlmaWNhdGlvbkludGVudFNlcnZpY2UuY2xhc3MpO1xuICAgIC8vICAgICAgICAgaW50ZW50LnNldEFjdGlvbihcIkFDVElPTl9ERUxFVEVcIik7XG4gICAgLy8gICAgICAgICByZXR1cm4gaW50ZW50O1xuICAgIC8vICAgICAgfVxuXG4gICAgLy8gICAgIC8vIFNldCBUaGUgQWxhcm0gYW5kIHRoZSBpbnRldCB0byBwYXNzIFxuXG5cblxuICAgIC8vICAgICAgZnVuY3Rpb24gZ2V0U3RhcnRQZW5kaW5nSW50ZW50KGNvbnRleHQpIHtcbiAgICAvLyAgICAgICAgIHZhciBhbGFybUludGVudCA9IG5ldyBhbmRyb2lkLmNvbnRlbnQuSW50ZW50KGNvbnRleHQsIGNvbS50bnMuYnJvYWRjYXN0cmVjZWl2ZXJzLk5vdGlmaWNhdGlvbkV2ZW50UmVjZWl2ZXIuY2xhc3MpO1xuICAgIC8vICAgICAgICAgYWxhcm1JbnRlbnQuc2V0QWN0aW9uKFwiQUNUSU9OX1NUQVJUX05PVElGSUNBVElPTl9TRVJWSUNFXCIpO1xuICAgIC8vICAgICAgICAgcmV0dXJuIGFuZHJvaWQuYXBwLlBlbmRpbmdJbnRlbnQuZ2V0QnJvYWRjYXN0KGNvbnRleHQsIDAsIGFsYXJtSW50ZW50LCBhbmRyb2lkLmFwcC5QZW5kaW5nSW50ZW50LkZMQUdfVVBEQVRFX0NVUlJFTlQpO1xuICAgIC8vICAgICAgfVxuXG4gICAgLy8gICAgICBzZXR1cEFsYXJtKCk7Ly8gY2FsbCBzZXRVcEFscm0gdG8gYmVnaW5nIHRoZSBJbnRlbnQgXG4gICAgLy8gICAgICBmdW5jdGlvbiBzZXR1cEFsYXJtKCkge1xuICAgIC8vICAgICAgICAgdmFyIHV0aWxzID0gcmVxdWlyZShcInV0aWxzL3V0aWxzXCIpO1xuICAgIC8vICAgICAgICAgdmFyIGNvbnRleHQgPSB1dGlscy5hZC5nZXRBcHBsaWNhdGlvbkNvbnRleHQoKTtcbiAgICAvLyAgICAgICAgIHZhciBhbGFybU1hbmFnZXIgPSBjb250ZXh0LmdldFN5c3RlbVNlcnZpY2UoYW5kcm9pZC5jb250ZW50LkNvbnRleHQuQUxBUk1fU0VSVklDRSk7XG4gICAgLy8gICAgICAgICB2YXIgYWxhcm1JbnRlbnQgPSBnZXRTdGFydFBlbmRpbmdJbnRlbnQoY29udGV4dCk7XG4gICAgLy8gICAgICAgICB2YXIgZCA9IG5ldyBEYXRlKCk7XG4gICAgLy8gICAgICAgICB2YXIgY3VycmVudFRpbWUgPSBkLmdldFRpbWUoKTsgICAgICAgICAgIFxuXG4gICAgLy8gICAgICAgICBhbGFybU1hbmFnZXIuc2V0UmVwZWF0aW5nKGFuZHJvaWQuYXBwLkFsYXJtTWFuYWdlci5SVENfV0FLRVVQLCAgICAgICAgICBcbiAgICAvLyAgICAgICAgICAgICBjdXJyZW50VGltZSxcbiAgICAvLyAgICAgICAgICAgICAxMDAwICAqIDMsIC8qIGFsYXJtIHdpbGwgc2VuZCB0aGUgYGFsYXJtSW50ZW50YCBvYmplY3QgZXZlcnkgMyBzZWNvbmRzICovXG4gICAgLy8gICAgICAgICAgICAgYWxhcm1JbnRlbnQpO1xuICAgIC8vICAgICAgfVxuICAgICAgICBcbiAgICB9O1xuXG5cbiAgICBcblxufVxuXG4iXX0=