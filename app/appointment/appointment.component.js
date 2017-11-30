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
    }
    AppointmentComponent.prototype.ngOnInit = function () {
        nativescript_telephony_1.Telephony().then(function (resolved) {
            localStorage.setItem('phoneNumber', resolved.phoneNumber);
        }).catch(function (error) {
            console.error('error >', error);
            console.dir(error);
        });
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
        var day = date.getDate();
        var month = date.getMonth() + 1;
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
        // datePicker.year = 1980;
        // datePicker.month = 2;
        // datePicker.day = 9;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwb2ludG1lbnQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXBwb2ludG1lbnQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQWtEO0FBQ2xELDZEQUEyRDtBQUMzRCwwRUFBd0U7QUFHeEUsMENBQTJEO0FBRTNELGlFQUFtRDtBQUNuRCxrQ0FBZSxDQUFDLE9BQU8sRUFBRSxjQUFNLE9BQUEsT0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQUMsS0FBSyxFQUFuQyxDQUFtQyxDQUFDLENBQUM7QUFDcEUscUNBQWtDO0FBQ2xDLDRFQUF5RTtBQWF6RTtJQUtJLDhCQUFvQixPQUFlLEVBQVUsa0JBQXNDLEVBQVUsc0JBQThDO1FBQXZILFlBQU8sR0FBUCxPQUFPLENBQVE7UUFBVSx1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW9CO1FBQVUsMkJBQXNCLEdBQXRCLHNCQUFzQixDQUF3QjtRQUYzSSx5REFBeUQ7UUFDakQsa0JBQWEsR0FBRyxLQUFLLENBQUM7SUFDaUgsQ0FBQztJQUVoSix1Q0FBUSxHQUFSO1FBQ0ksa0NBQVMsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLFFBQVE7WUFDL0IsWUFBWSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQzlELENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLEtBQUs7WUFDcEIsT0FBTyxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUE7WUFDL0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN2QixDQUFDLENBQUMsQ0FBQTtRQUNGLHFFQUFxRTtRQUNyRSxvQ0FBb0M7UUFDcEMseUVBQXlFO1FBQ3pFLCtEQUErRDtRQUMvRCx3QkFBd0I7UUFDeEIsMkNBQTJDO1FBQzNDLE1BQU07UUFDTixJQUFJLElBQUksR0FBSSxJQUFJLElBQUksRUFBRSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBRUQsaURBQWtCLEdBQWxCLFVBQW1CLElBQVc7UUFDMUIsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ3pCLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDaEMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQzlCLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDLFFBQVEsRUFBRSxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUMsUUFBUSxFQUFFLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNsRixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ2pGLENBQUM7SUFFRCxrREFBbUIsR0FBbkIsVUFBb0IsV0FBd0I7UUFDeEMsSUFBSSxlQUFlLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUNsRCxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLGNBQWMsRUFBRSxlQUFlLENBQUMsQ0FBQyxDQUFDO0lBQzdELENBQUM7SUFFRCxzQ0FBTyxHQUFQO1FBQ0ksSUFBSSxDQUFDLGFBQWEsR0FBRyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRSxLQUFLLEdBQUcsSUFBSSxDQUFDO0lBQzVELENBQUM7SUFFRCw2Q0FBYyxHQUFkLFVBQWUsSUFBSTtRQUNmLElBQUksVUFBVSxHQUFlLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDekMsVUFBVSxDQUFDLElBQUksR0FBSSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUN4QyxVQUFVLENBQUMsT0FBTyxHQUFHLElBQUksSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDM0MsVUFBVSxDQUFDLE9BQU8sR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRTNDLDBCQUEwQjtRQUMxQix3QkFBd0I7UUFDeEIsc0JBQXNCO0lBQzFCLENBQUM7SUFFRCw0Q0FBYSxHQUFiLFVBQWMsSUFBSTtRQUNkLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDNUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3hDLDhDQUE4QztRQUM5QyxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3hDLENBQUM7SUFFRCwyQ0FBWSxHQUFaLFVBQWEsSUFBSTtRQUNiLDhCQUE4QjtRQUM5QiwyQ0FBMkM7UUFDM0MsOENBQThDO0lBQ2xELENBQUM7SUFFRCw2Q0FBYyxHQUFkLFVBQWUsSUFBSTtRQUNmLGdDQUFnQztRQUNoQywyQ0FBMkM7UUFDM0MsOENBQThDO0lBQ2xELENBQUM7SUFFRCw0Q0FBYSxHQUFiLFVBQWMsSUFBSTtRQUNkLCtCQUErQjtRQUMvQiwyQ0FBMkM7UUFDM0MsOENBQThDO0lBQ2xELENBQUM7SUE1RVEsb0JBQW9CO1FBTmhDLGdCQUFTLENBQUM7WUFDUCxRQUFRLEVBQUUsVUFBVTtZQUNwQixRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7WUFDbkIsU0FBUyxFQUFFLENBQUMsaUJBQWlCLENBQUM7WUFDOUIsV0FBVyxFQUFFLDRCQUE0QjtTQUM1QyxDQUFDO3lDQU0rQixlQUFNLEVBQThCLHdDQUFrQixFQUFrQyxpREFBc0I7T0FMbEksb0JBQW9CLENBOEVoQztJQUFELDJCQUFDO0NBQUEsQUE5RUQsSUE4RUM7QUE5RVksb0RBQW9CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgQXBwb2ludG1lbnRTZXJ2aWNlIH0gZnJvbSBcIi4vYXBwb2ludG1lbnQuc2VydmljZVwiO1xuaW1wb3J0IHsgcmVnaXN0ZXJFbGVtZW50IH0gZnJvbSAnbmF0aXZlc2NyaXB0LWFuZ3VsYXIvZWxlbWVudC1yZWdpc3RyeSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcy8nO1xuaW1wb3J0IHsgQXBwb2ludG1lbnQgfSBmcm9tIFwiLi9hcHBvaW50bWVudC5tb2RlbFwiO1xuaW1wb3J0IHsgTmF2aWdhdGlvbkV4dHJhcywgUm91dGVyIH0gZnJvbSBcIkBhbmd1bGFyL3JvdXRlclwiO1xuaW1wb3J0IHsgYW5kcm9pZCB9IGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL2FwcGxpY2F0aW9uL2FwcGxpY2F0aW9uXCI7XG5pbXBvcnQgeyBUZWxlcGhvbnkgfSBmcm9tIFwibmF0aXZlc2NyaXB0LXRlbGVwaG9ueVwiO1xucmVnaXN0ZXJFbGVtZW50KCdFbW9qaScsICgpID0+IHJlcXVpcmUoJ25hdGl2ZXNjcmlwdC1lbW9qaScpLkVtb2ppKTtcbmltcG9ydCAnbmF0aXZlc2NyaXB0LWxvY2Fsc3RvcmFnZSdcbmltcG9ydCB7IExvb3BBcHBvaW50bWVudFNlcnZpY2UgfSBmcm9tIFwiLi9sb29wL2xvb3AtYXBwb2ludG1lbnQuc2VydmljZVwiO1xuaW1wb3J0IHsgTG9vcEFwcG9pbnRtZW50IH0gZnJvbSBcIi4vbG9vcC9sb29wLWFwcG9pbnRtZW50Lm1vZGVsXCI7XG5cblxuaW1wb3J0IHsgRGF0ZVBpY2tlciB9IGZyb20gXCJ1aS9kYXRlLXBpY2tlclwiO1xuaW1wb3J0IHsgRXZlbnREYXRhIH0gZnJvbSBcImRhdGEvb2JzZXJ2YWJsZVwiO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogXCJucy1pdGVtc1wiLFxuICAgIG1vZHVsZUlkOiBtb2R1bGUuaWQsXG4gICAgc3R5bGVVcmxzOiBbXCJhcHBvaW50bWVudC5jc3NcIl0sXG4gICAgdGVtcGxhdGVVcmw6IFwiYXBwb2ludG1lbnQuY29tcG9uZW50Lmh0bWxcIlxufSlcbmV4cG9ydCBjbGFzcyBBcHBvaW50bWVudENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gICAgcHJpdmF0ZSBzdHJpbmdEYXRlOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBhcHBvaW50bWVudHM6IE9ic2VydmFibGU8QXBwb2ludG1lbnRbXT47XG4gICAgLy8gcHJpdmF0ZSBhcHBvaW50bWVudHM6ICBPYnNlcnZhYmxlPExvb3BBcHBvaW50bWVudFtdPjsgXG4gICAgcHJpdmF0ZSBpc0l0ZW1WaXNpYmxlID0gZmFsc2U7XG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBfcm91dGVyOiBSb3V0ZXIsIHByaXZhdGUgYXBwb2ludG1lbnRTZXJ2aWNlOiBBcHBvaW50bWVudFNlcnZpY2UsIHByaXZhdGUgbG9vcEFwcG9pbnRtZW50U2VydmljZTogTG9vcEFwcG9pbnRtZW50U2VydmljZSkgeyB9XG5cbiAgICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICAgICAgVGVsZXBob255KCkudGhlbihmdW5jdGlvbiAocmVzb2x2ZWQpIHtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdwaG9uZU51bWJlcicsIHJlc29sdmVkLnBob25lTnVtYmVyKTtcbiAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdlcnJvciA+JywgZXJyb3IpXG4gICAgICAgICAgICBjb25zb2xlLmRpcihlcnJvcik7XG4gICAgICAgIH0pXG4gICAgICAgIC8vIHRoaXMubG9vcEFwcG9pbnRtZW50U2VydmljZS5sb29wR2V0QXBwaW9udG1lbnRzKCkuY2F0Y2goZXJyID0+ICB7IFxuICAgICAgICAvLyAgICAgY29uc29sZS5kaXIoZXJyKTsgICAgICAgICAgICBcbiAgICAgICAgLy8gICAgIHJldHVybiBlcnI7IC8vIG9ic2VydmFibGUgbmVlZHMgdG8gYmUgcmV0dXJuZWQgb3IgZXhjZXB0aW9uIHJhaXNlZFxuICAgICAgICAvLyAgfSkuc3Vic2NyaWJlKChyZXM6IE9ic2VydmFibGU8QXJyYXk8TG9vcEFwcG9pbnRtZW50Pj4pID0+IHtcbiAgICAgICAgLy8gICAgIGNvbnNvbGUuZGlyKHJlcyk7XG4gICAgICAgIC8vICAgICB0aGlzLmFwcG9pbnRtZW50cyA9IHJlczsgICAgICAgICAgICBcbiAgICAgICAgLy8gfSk7XG4gICAgICAgIGxldCBkYXRlID0gIG5ldyBEYXRlKCk7ICAgICAgXG4gICAgICAgIHRoaXMuc2V0QXBwb2ludG1lbnREYXRlKGRhdGUpOyAgICAgICAgICAgXG4gICAgfVxuXG4gICAgc2V0QXBwb2ludG1lbnREYXRlKGRhdGUgOiBEYXRlKXtcbiAgICAgICAgbGV0IGRheSA9IGRhdGUuZ2V0RGF0ZSgpO1xuICAgICAgICBsZXQgbW9udGggPSBkYXRlLmdldE1vbnRoKCkgKyAxO1xuICAgICAgICBsZXQgeWVhciA9IGRhdGUuZ2V0RnVsbFllYXIoKTtcbiAgICAgICAgdGhpcy5zdHJpbmdEYXRlID0gbW9udGgudG9TdHJpbmcoKSArIFwiL1wiICsgZGF5LnRvU3RyaW5nKCkgKyBcIi9cIiArIHllYXIudG9TdHJpbmcoKTtcbiAgICAgICAgdGhpcy5hcHBvaW50bWVudHMgPSB0aGlzLmFwcG9pbnRtZW50U2VydmljZS5nZXRBcHBvaW50bWVudHModGhpcy5zdHJpbmdEYXRlKTtcbiAgICB9XG5cbiAgICBvbk5hdmlnYXRpb25JdGVtVGFwKGFwcG9pbnRtZW50OiBBcHBvaW50bWVudCkge1xuICAgICAgICBsZXQgYXBwb2ludG1lbnRkYXRhID0gSlNPTi5zdHJpbmdpZnkoYXBwb2ludG1lbnQpO1xuICAgICAgICB0aGlzLl9yb3V0ZXIubmF2aWdhdGUoWycvYXBwb2ludG1lbnQnLCBhcHBvaW50bWVudGRhdGFdKTtcbiAgICB9XG5cbiAgICBzZXREYXRlKCkgeyAgICAgICAgXG4gICAgICAgIHRoaXMuaXNJdGVtVmlzaWJsZSA9ICh0aGlzLmlzSXRlbVZpc2libGUpPyBmYWxzZSA6IHRydWU7XG4gICAgfVxuXG4gICAgb25QaWNrZXJMb2FkZWQoYXJncykge1xuICAgICAgICBsZXQgZGF0ZVBpY2tlciA9IDxEYXRlUGlja2VyPmFyZ3Mub2JqZWN0O1xuICAgICAgICBkYXRlUGlja2VyLmRhdGUgPSAgbmV3IERhdGUoRGF0ZS5ub3coKSk7XG4gICAgICAgIGRhdGVQaWNrZXIubWluRGF0ZSA9IG5ldyBEYXRlKDE5NzUsIDAsIDI5KTtcbiAgICAgICAgZGF0ZVBpY2tlci5tYXhEYXRlID0gbmV3IERhdGUoMjA0NSwgNCwgMTIpO1xuXG4gICAgICAgIC8vIGRhdGVQaWNrZXIueWVhciA9IDE5ODA7XG4gICAgICAgIC8vIGRhdGVQaWNrZXIubW9udGggPSAyO1xuICAgICAgICAvLyBkYXRlUGlja2VyLmRheSA9IDk7XG4gICAgfVxuXG4gICAgb25EYXRlQ2hhbmdlZChhcmdzKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiRGF0ZSBjaGFuZ2VkXCIpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIk5ldyB2YWx1ZTogXCIgKyBhcmdzLnZhbHVlKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJPbGQgdmFsdWU6IFwiICsgYXJncy5vbGRWYWx1ZSk7XG4gICAgICAgIHRoaXMuc2V0QXBwb2ludG1lbnREYXRlKGFyZ3MudmFsdWUpO1xuICAgIH1cblxuICAgIG9uRGF5Q2hhbmdlZChhcmdzKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiRGF5IGNoYW5nZWRcIik7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiTmV3IHZhbHVlOiBcIiArIGFyZ3MudmFsdWUpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIk9sZCB2YWx1ZTogXCIgKyBhcmdzLm9sZFZhbHVlKTtcbiAgICB9XG5cbiAgICBvbk1vbnRoQ2hhbmdlZChhcmdzKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiTW9udGggY2hhbmdlZFwiKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJOZXcgdmFsdWU6IFwiICsgYXJncy52YWx1ZSk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiT2xkIHZhbHVlOiBcIiArIGFyZ3Mub2xkVmFsdWUpO1xuICAgIH1cblxuICAgIG9uWWVhckNoYW5nZWQoYXJncykge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlllYXIgY2hhbmdlZFwiKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJOZXcgdmFsdWU6IFwiICsgYXJncy52YWx1ZSk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiT2xkIHZhbHVlOiBcIiArIGFyZ3Mub2xkVmFsdWUpO1xuICAgIH1cblxufSJdfQ==