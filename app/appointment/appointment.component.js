"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var appointment_service_1 = require("./appointment.service");
var element_registry_1 = require("nativescript-angular/element-registry");
var router_1 = require("@angular/router");
var nativescript_telephony_1 = require("nativescript-telephony");
element_registry_1.registerElement('Emoji', function () { return require('nativescript-emoji').Emoji; });
require("nativescript-localstorage");
var loop_appointment_service_1 = require("./loop/loop-appointment.service");
var AppointmentComponent = (function () {
    function AppointmentComponent(_router, appointmentService, loopAppointmentService) {
        this._router = _router;
        this.appointmentService = appointmentService;
        this.loopAppointmentService = loopAppointmentService;
        // private appointments:  Observable<LoopAppointment[]>; 
        this.isItemVisible = false;
        nativescript_telephony_1.Telephony().then(function (resolved) {
            localStorage.setItem('phoneNumber', (resolved.phoneNumber) ? resolved.phoneNumber : '15555218135');
        }).catch(function (error) {
            console.error('error >', error);
            console.dir(error);
        });
    }
    AppointmentComponent.prototype.ngOnInit = function () {
        // this.loopAppointmentService.loopGetAppiontments().catch(err =>  { 
        //     console.dir(err);            
        //     return err; // observable needs to be returned or exception raised
        //  }).subscribe((res: Observable<Array<LoopAppointment>>) => {
        //     console.dir(res);
        //     this.appointments = res;            
        // });
        var date = new Date();
        this.setAppointmentDate(date);
    };
    AppointmentComponent.prototype.setAppointmentDate = function (date) {
        if (localStorage.getItem('phoneNumber') === null) {
            nativescript_telephony_1.Telephony().then(function (resolved) {
                localStorage.setItem('phoneNumber', (resolved.phoneNumber) ? resolved.phoneNumber : '15555218135');
            }).catch(function (error) {
                console.error('error >', error);
                console.dir(error);
            });
        }
        ;
        var day = date.getDate();
        var month = date.getMonth() + 1; // from 0 - 11
        var year = date.getFullYear();
        this.stringDate = month.toString() + "/" + day.toString() + "/" + year.toString();
        this.appointments = this.appointmentService.getAppointments(this.stringDate);
    };
    AppointmentComponent.prototype.onNavigationItemTap = function (appointment) {
        var appointmentdata = JSON.stringify(appointment);
        this._router.navigate(['/appointment', appointmentdata]);
    };
    AppointmentComponent.prototype.setDate = function () {
        this.isItemVisible = (this.isItemVisible) ? false : true;
    };
    AppointmentComponent.prototype.onPickerLoaded = function (args) {
        var datePicker = args.object;
        datePicker.date = new Date(Date.now());
        datePicker.minDate = new Date(1975, 0, 29);
        datePicker.maxDate = new Date(2045, 4, 12);
    };
    AppointmentComponent.prototype.onDateChanged = function (args) {
        console.log("Date changed");
        console.log("New value: " + args.value);
        // console.log("Old value: " + args.oldValue);
        this.setAppointmentDate(args.value);
    };
    AppointmentComponent.prototype.onDayChanged = function (args) {
        // console.log("Day changed");
        // console.log("New value: " + args.value);
        // console.log("Old value: " + args.oldValue);
    };
    AppointmentComponent.prototype.onMonthChanged = function (args) {
        // console.log("Month changed");
        // console.log("New value: " + args.value);
        // console.log("Old value: " + args.oldValue);
    };
    AppointmentComponent.prototype.onYearChanged = function (args) {
        // console.log("Year changed");
        // console.log("New value: " + args.value);
        // console.log("Old value: " + args.oldValue);
    };
    AppointmentComponent = __decorate([
        core_1.Component({
            selector: "ns-items",
            moduleId: module.id,
            styleUrls: ["appointment.css"],
            templateUrl: "appointment.component.html"
        }),
        __metadata("design:paramtypes", [router_1.Router, appointment_service_1.AppointmentService, loop_appointment_service_1.LoopAppointmentService])
    ], AppointmentComponent);
    return AppointmentComponent;
}());
exports.AppointmentComponent = AppointmentComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwb2ludG1lbnQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXBwb2ludG1lbnQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQWtEO0FBQ2xELDZEQUEyRDtBQUMzRCwwRUFBd0U7QUFHeEUsMENBQTJEO0FBRTNELGlFQUFtRDtBQUNuRCxrQ0FBZSxDQUFDLE9BQU8sRUFBRSxjQUFNLE9BQUEsT0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQUMsS0FBSyxFQUFuQyxDQUFtQyxDQUFDLENBQUM7QUFDcEUscUNBQWtDO0FBQ2xDLDRFQUF5RTtBQWN6RTtJQUtJLDhCQUFvQixPQUFlLEVBQVUsa0JBQXNDLEVBQVUsc0JBQThDO1FBQXZILFlBQU8sR0FBUCxPQUFPLENBQVE7UUFBVSx1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW9CO1FBQVUsMkJBQXNCLEdBQXRCLHNCQUFzQixDQUF3QjtRQUYzSSx5REFBeUQ7UUFDakQsa0JBQWEsR0FBRyxLQUFLLENBQUM7UUFFMUIsa0NBQVMsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLFFBQVE7WUFDL0IsWUFBWSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLEdBQUMsUUFBUSxDQUFDLFdBQVcsR0FBQyxhQUFhLENBQUMsQ0FBQztRQUNuRyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBVSxLQUFLO1lBQ3BCLE9BQU8sQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFBO1lBQy9CLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdkIsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsdUNBQVEsR0FBUjtRQUNJLHFFQUFxRTtRQUNyRSxvQ0FBb0M7UUFDcEMseUVBQXlFO1FBQ3pFLCtEQUErRDtRQUMvRCx3QkFBd0I7UUFDeEIsMkNBQTJDO1FBQzNDLE1BQU07UUFFTixJ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Q2xELENBQUM7SUFFRCw0Q0FBYSxHQUFiLFVBQWMsSUFBSTtRQUNkLCtCQUErQjtRQUMvQiwyQ0FBMkM7UUFDM0MsOENBQThDO0lBQ2xELENBQUM7SUFuRlEsb0JBQW9CO1FBUGhDLGdCQUFTLENBQUM7WUFDUCxRQUFRLEVBQUUsVUFBVTtZQUNwQixRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7WUFDbkIsU0FBUyxFQUFFLENBQUMsaUJBQWlCLENBQUM7WUFDOUIsV0FBVyxFQUFFLDRCQUE0QjtTQUM1QyxDQUFDO3lDQU8rQixlQUFNLEVBQThCLHdDQUFrQixFQUFrQyxpREFBc0I7T0FMbEksb0JBQW9CLENBcUZoQztJQUFELDJCQUFDO0NBQUEsQUFyRkQsSUFxRkM7QUFyRlksb0RBQW9CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgQXBwb2ludG1lbnRTZXJ2aWNlIH0gZnJvbSBcIi4vYXBwb2ludG1lbnQuc2VydmljZVwiO1xuaW1wb3J0IHsgcmVnaXN0ZXJFbGVtZW50IH0gZnJvbSAnbmF0aXZlc2NyaXB0LWFuZ3VsYXIvZWxlbWVudC1yZWdpc3RyeSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcy8nO1xuaW1wb3J0IHsgQXBwb2ludG1lbnQgfSBmcm9tIFwiLi9hcHBvaW50bWVudC5tb2RlbFwiO1xuaW1wb3J0IHsgTmF2aWdhdGlvbkV4dHJhcywgUm91dGVyIH0gZnJvbSBcIkBhbmd1bGFyL3JvdXRlclwiO1xuaW1wb3J0IHsgYW5kcm9pZCB9IGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL2FwcGxpY2F0aW9uL2FwcGxpY2F0aW9uXCI7XG5pbXBvcnQgeyBUZWxlcGhvbnkgfSBmcm9tIFwibmF0aXZlc2NyaXB0LXRlbGVwaG9ueVwiO1xucmVnaXN0ZXJFbGVtZW50KCdFbW9qaScsICgpID0+IHJlcXVpcmUoJ25hdGl2ZXNjcmlwdC1lbW9qaScpLkVtb2ppKTtcbmltcG9ydCAnbmF0aXZlc2NyaXB0LWxvY2Fsc3RvcmFnZSdcbmltcG9ydCB7IExvb3BBcHBvaW50bWVudFNlcnZpY2UgfSBmcm9tIFwiLi9sb29wL2xvb3AtYXBwb2ludG1lbnQuc2VydmljZVwiO1xuaW1wb3J0IHsgTG9vcEFwcG9pbnRtZW50IH0gZnJvbSBcIi4vbG9vcC9sb29wLWFwcG9pbnRtZW50Lm1vZGVsXCI7XG5cblxuaW1wb3J0IHsgRGF0ZVBpY2tlciB9IGZyb20gXCJ1aS9kYXRlLXBpY2tlclwiO1xuaW1wb3J0IHsgRXZlbnREYXRhIH0gZnJvbSBcImRhdGEvb2JzZXJ2YWJsZVwiO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogXCJucy1pdGVtc1wiLFxuICAgIG1vZHVsZUlkOiBtb2R1bGUuaWQsXG4gICAgc3R5bGVVcmxzOiBbXCJhcHBvaW50bWVudC5jc3NcIl0sXG4gICAgdGVtcGxhdGVVcmw6IFwiYXBwb2ludG1lbnQuY29tcG9uZW50Lmh0bWxcIlxufSlcblxuZXhwb3J0IGNsYXNzIEFwcG9pbnRtZW50Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgICBwcml2YXRlIHN0cmluZ0RhdGU6IHN0cmluZztcbiAgICBwcml2YXRlIGFwcG9pbnRtZW50czogT2JzZXJ2YWJsZTxBcHBvaW50bWVudFtdPjtcbiAgICAvLyBwcml2YXRlIGFwcG9pbnRtZW50czogIE9ic2VydmFibGU8TG9vcEFwcG9pbnRtZW50W10+OyBcbiAgICBwcml2YXRlIGlzSXRlbVZpc2libGUgPSBmYWxzZTtcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9yb3V0ZXI6IFJvdXRlciwgcHJpdmF0ZSBhcHBvaW50bWVudFNlcnZpY2U6IEFwcG9pbnRtZW50U2VydmljZSwgcHJpdmF0ZSBsb29wQXBwb2ludG1lbnRTZXJ2aWNlOiBMb29wQXBwb2ludG1lbnRTZXJ2aWNlKSB7IFxuICAgICAgICBUZWxlcGhvbnkoKS50aGVuKGZ1bmN0aW9uIChyZXNvbHZlZCkge1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3Bob25lTnVtYmVyJywgKHJlc29sdmVkLnBob25lTnVtYmVyKT9yZXNvbHZlZC5waG9uZU51bWJlcjonMTU1NTUyMTgxMzUnKTtcbiAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdlcnJvciA+JywgZXJyb3IpXG4gICAgICAgICAgICBjb25zb2xlLmRpcihlcnJvcik7XG4gICAgICAgIH0pOyAgICAgICAgICBcbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpOiB2b2lkIHsgIFxuICAgICAgICAvLyB0aGlzLmxvb3BBcHBvaW50bWVudFNlcnZpY2UubG9vcEdldEFwcGlvbnRtZW50cygpLmNhdGNoKGVyciA9PiAgeyBcbiAgICAgICAgLy8gICAgIGNvbnNvbGUuZGlyKGVycik7ICAgICAgICAgICAgXG4gICAgICAgIC8vICAgICByZXR1cm4gZXJyOyAvLyBvYnNlcnZhYmxlIG5lZWRzIHRvIGJlIHJldHVybmVkIG9yIGV4Y2VwdGlvbiByYWlzZWRcbiAgICAgICAgLy8gIH0pLnN1YnNjcmliZSgocmVzOiBPYnNlcnZhYmxlPEFycmF5PExvb3BBcHBvaW50bWVudD4+KSA9PiB7XG4gICAgICAgIC8vICAgICBjb25zb2xlLmRpcihyZXMpO1xuICAgICAgICAvLyAgICAgdGhpcy5hcHBvaW50bWVudHMgPSByZXM7ICAgICAgICAgICAgXG4gICAgICAgIC8vIH0pO1xuICAgICAgICBcbiAgICAgICAgbGV0IGRhdGUgPSAgbmV3IERhdGUoKTsgICAgICBcbiAgICAgICAgdGhpcy5zZXRBcHBvaW50bWVudERhdGUoZGF0ZSk7ICAgICAgICAgICBcbiAgICB9XG5cbiAgICBzZXRBcHBvaW50bWVudERhdGUoZGF0ZSA6IERhdGUpe1xuICAgICAgICBpZiAobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3Bob25lTnVtYmVyJykgPT09IG51bGwpIHtcbiAgICAgICAgICAgIFRlbGVwaG9ueSgpLnRoZW4oZnVuY3Rpb24gKHJlc29sdmVkKSB7XG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3Bob25lTnVtYmVyJywgKHJlc29sdmVkLnBob25lTnVtYmVyKT9yZXNvbHZlZC5waG9uZU51bWJlcjonMTU1NTUyMTgxMzUnKTtcbiAgICAgICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ2Vycm9yID4nLCBlcnJvcilcbiAgICAgICAgICAgICAgICBjb25zb2xlLmRpcihlcnJvcik7XG4gICAgICAgICAgICB9KTsgIFxuICAgICAgICB9OyAgICBcblxuICAgICAgICBsZXQgZGF5ID0gZGF0ZS5nZXREYXRlKCk7XG4gICAgICAgIGxldCBtb250aCA9IGRhdGUuZ2V0TW9udGgoKSArIDE7Ly8gZnJvbSAwIC0gMTFcbiAgICAgICAgbGV0IHllYXIgPSBkYXRlLmdldEZ1bGxZZWFyKCk7XG4gICAgICAgIHRoaXMuc3RyaW5nRGF0ZSA9IG1vbnRoLnRvU3RyaW5nKCkgKyBcIi9cIiArIGRheS50b1N0cmluZygpICsgXCIvXCIgKyB5ZWFyLnRvU3RyaW5nKCk7XG4gICAgICAgIHRoaXMuYXBwb2ludG1lbnRzID0gdGhpcy5hcHBvaW50bWVudFNlcnZpY2UuZ2V0QXBwb2ludG1lbnRzKHRoaXMuc3RyaW5nRGF0ZSk7XG4gICAgfVxuXG4gICAgb25OYXZpZ2F0aW9uSXRlbVRhcChhcHBvaW50bWVudDogQXBwb2ludG1lbnQpIHtcbiAgICAgICAgbGV0IGFwcG9pbnRtZW50ZGF0YSA9IEpTT04uc3RyaW5naWZ5KGFwcG9pbnRtZW50KTtcbiAgICAgICAgdGhpcy5fcm91dGVyLm5hdmlnYXRlKFsnL2FwcG9pbnRtZW50JywgYXBwb2ludG1lbnRkYXRhXSk7XG4gICAgfVxuXG4gICAgc2V0RGF0ZSgpIHsgICAgICAgIFxuICAgICAgICB0aGlzLmlzSXRlbVZpc2libGUgPSAodGhpcy5pc0l0ZW1WaXNpYmxlKT8gZmFsc2UgOiB0cnVlO1xuICAgIH1cblxuICAgIG9uUGlja2VyTG9hZGVkKGFyZ3MpIHtcbiAgICAgICAgbGV0IGRhdGVQaWNrZXIgPSA8RGF0ZVBpY2tlcj5hcmdzLm9iamVjdDtcbiAgICAgICAgZGF0ZVBpY2tlci5kYXRlID0gIG5ldyBEYXRlKERhdGUubm93KCkpO1xuICAgICAgICBkYXRlUGlja2VyLm1pbkRhdGUgPSBuZXcgRGF0ZSgxOTc1LCAwLCAyOSk7XG4gICAgICAgIGRhdGVQaWNrZXIubWF4RGF0ZSA9IG5ldyBEYXRlKDIwNDUsIDQsIDEyKTtcbiAgICB9XG5cbiAgICBvbkRhdGVDaGFuZ2VkKGFyZ3MpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJEYXRlIGNoYW5nZWRcIik7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiTmV3IHZhbHVlOiBcIiArIGFyZ3MudmFsdWUpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIk9sZCB2YWx1ZTogXCIgKyBhcmdzLm9sZFZhbHVlKTtcbiAgICAgICAgdGhpcy5zZXRBcHBvaW50bWVudERhdGUoYXJncy52YWx1ZSk7XG4gICAgfVxuXG4gICAgb25EYXlDaGFuZ2VkKGFyZ3MpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJEYXkgY2hhbmdlZFwiKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJOZXcgdmFsdWU6IFwiICsgYXJncy52YWx1ZSk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiT2xkIHZhbHVlOiBcIiArIGFyZ3Mub2xkVmFsdWUpO1xuICAgIH1cblxuICAgIG9uTW9udGhDaGFuZ2VkKGFyZ3MpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJNb250aCBjaGFuZ2VkXCIpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIk5ldyB2YWx1ZTogXCIgKyBhcmdzLnZhbHVlKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJPbGQgdmFsdWU6IFwiICsgYXJncy5vbGRWYWx1ZSk7XG4gICAgfVxuXG4gICAgb25ZZWFyQ2hhbmdlZChhcmdzKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiWWVhciBjaGFuZ2VkXCIpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIk5ldyB2YWx1ZTogXCIgKyBhcmdzLnZhbHVlKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJPbGQgdmFsdWU6IFwiICsgYXJncy5vbGRWYWx1ZSk7XG4gICAgfVxuXG59Il19