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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwb2ludG1lbnQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXBwb2ludG1lbnQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQWtEO0FBQ2xELDZEQUEyRDtBQUMzRCwwRUFBd0U7QUFHeEUsMENBQTJEO0FBRTNELGlFQUFtRDtBQUNuRCxrQ0FBZSxDQUFDLE9BQU8sRUFBRSxjQUFNLE9BQUEsT0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQUMsS0FBSyxFQUFuQyxDQUFtQyxDQUFDLENBQUM7QUFDcEUscUNBQWtDO0FBQ2xDLDRFQUF5RTtBQWN6RTtJQUtJLDhCQUFvQixPQUFlLEVBQVUsa0JBQXNDLEVBQVUsc0JBQThDO1FBQXZILFlBQU8sR0FBUCxPQUFPLENBQVE7UUFBVSx1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW9CO1FBQVUsMkJBQXNCLEdBQXRCLHNCQUFzQixDQUF3QjtRQUYzSSx5REFBeUQ7UUFDakQsa0JBQWEsR0FBRyxLQUFLLENBQUM7SUFDaUgsQ0FBQztJQUVoSix1Q0FBUSxHQUFSO1FBQ0ksa0NBQVMsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLFFBQVE7WUFDL0IsWUFBWSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQzlELENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLEtBQUs7WUFDcEIsT0FBTyxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUE7WUFDL0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN2QixDQUFDLENBQUMsQ0FBQTtRQUNGLHFFQUFxRTtRQUNyRSxvQ0FBb0M7UUFDcEMseUVBQXlFO1FBQ3pFLCtEQUErRDtRQUMvRCx3QkFBd0I7UUFDeEIsMkNBQTJDO1FBQzNDLE1BQU07UUFDTixJQUFJLElBQUksR0FBSSxJQUFJLElBQUksRUFBRSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBRUQsaURBQWtCLEdBQWxCLFVBQW1CLElBQVc7UUFDMUIsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ3pCLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQSxjQUFjO1FBQzlDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUM5QixJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQyxRQUFRLEVBQUUsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLFFBQVEsRUFBRSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDbEYsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNqRixDQUFDO0lBRUQsa0RBQW1CLEdBQW5CLFVBQW9CLFdBQXdCO1FBQ3hDLElBQUksZUFBZSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDbEQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxjQUFjLEVBQUUsZUFBZSxDQUFDLENBQUMsQ0FBQztJQUM3RCxDQUFDO0lBRUQsc0NBQU8sR0FBUDtRQUNJLElBQUksQ0FBQyxhQUFhLEdBQUcsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUUsS0FBSyxHQUFHLElBQUksQ0FBQztJQUM1RCxDQUFDO0lBRUQsNkNBQWMsR0FBZCxVQUFlLElBQUk7UUFDZixJQUFJLFVBQVUsR0FBZSxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQ3pDLFVBQVUsQ0FBQyxJQUFJLEdBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDeEMsVUFBVSxDQUFDLE9BQU8sR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzNDLFVBQVUsQ0FBQyxPQUFPLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRUQsNENBQWEsR0FBYixVQUFjLElBQUk7UUFDZCxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQzVCLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN4Qyw4Q0FBOEM7UUFDOUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN4QyxDQUFDO0lBRUQsMkNBQVksR0FBWixVQUFhLElBQUk7UUFDYiw4QkFBOEI7UUFDOUIsMkNBQTJDO1FBQzNDLDhDQUE4QztJQUNsRCxDQUFDO0lBRUQsNkNBQWMsR0FBZCxVQUFlLElBQUk7UUFDZixnQ0FBZ0M7UUFDaEMsMkNBQTJDO1FBQzNDLDhDQUE4QztJQUNsRCxDQUFDO0lBRUQsNENBQWEsR0FBYixVQUFjLElBQUk7UUFDZCwrQkFBK0I7UUFDL0IsMkNBQTJDO1FBQzNDLDhDQUE4QztJQUNsRCxDQUFDO0lBeEVRLG9CQUFvQjtRQVBoQyxnQkFBUyxDQUFDO1lBQ1AsUUFBUSxFQUFFLFVBQVU7WUFDcEIsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFO1lBQ25CLFNBQVMsRUFBRSxDQUFDLGlCQUFpQixDQUFDO1lBQzlCLFdBQVcsRUFBRSw0QkFBNEI7U0FDNUMsQ0FBQzt5Q0FPK0IsZUFBTSxFQUE4Qix3Q0FBa0IsRUFBa0MsaURBQXNCO09BTGxJLG9CQUFvQixDQTBFaEM7SUFBRCwyQkFBQztDQUFBLEFBMUVELElBMEVDO0FBMUVZLG9EQUFvQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0IH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IEFwcG9pbnRtZW50U2VydmljZSB9IGZyb20gXCIuL2FwcG9pbnRtZW50LnNlcnZpY2VcIjtcbmltcG9ydCB7IHJlZ2lzdGVyRWxlbWVudCB9IGZyb20gJ25hdGl2ZXNjcmlwdC1hbmd1bGFyL2VsZW1lbnQtcmVnaXN0cnknO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMvJztcbmltcG9ydCB7IEFwcG9pbnRtZW50IH0gZnJvbSBcIi4vYXBwb2ludG1lbnQubW9kZWxcIjtcbmltcG9ydCB7IE5hdmlnYXRpb25FeHRyYXMsIFJvdXRlciB9IGZyb20gXCJAYW5ndWxhci9yb3V0ZXJcIjtcbmltcG9ydCB7IGFuZHJvaWQgfSBmcm9tIFwidG5zLWNvcmUtbW9kdWxlcy9hcHBsaWNhdGlvbi9hcHBsaWNhdGlvblwiO1xuaW1wb3J0IHsgVGVsZXBob255IH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC10ZWxlcGhvbnlcIjtcbnJlZ2lzdGVyRWxlbWVudCgnRW1vamknLCAoKSA9PiByZXF1aXJlKCduYXRpdmVzY3JpcHQtZW1vamknKS5FbW9qaSk7XG5pbXBvcnQgJ25hdGl2ZXNjcmlwdC1sb2NhbHN0b3JhZ2UnXG5pbXBvcnQgeyBMb29wQXBwb2ludG1lbnRTZXJ2aWNlIH0gZnJvbSBcIi4vbG9vcC9sb29wLWFwcG9pbnRtZW50LnNlcnZpY2VcIjtcbmltcG9ydCB7IExvb3BBcHBvaW50bWVudCB9IGZyb20gXCIuL2xvb3AvbG9vcC1hcHBvaW50bWVudC5tb2RlbFwiO1xuXG5cbmltcG9ydCB7IERhdGVQaWNrZXIgfSBmcm9tIFwidWkvZGF0ZS1waWNrZXJcIjtcbmltcG9ydCB7IEV2ZW50RGF0YSB9IGZyb20gXCJkYXRhL29ic2VydmFibGVcIjtcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6IFwibnMtaXRlbXNcIixcbiAgICBtb2R1bGVJZDogbW9kdWxlLmlkLFxuICAgIHN0eWxlVXJsczogW1wiYXBwb2ludG1lbnQuY3NzXCJdLFxuICAgIHRlbXBsYXRlVXJsOiBcImFwcG9pbnRtZW50LmNvbXBvbmVudC5odG1sXCJcbn0pXG5cbmV4cG9ydCBjbGFzcyBBcHBvaW50bWVudENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gICAgcHJpdmF0ZSBzdHJpbmdEYXRlOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBhcHBvaW50bWVudHM6IE9ic2VydmFibGU8QXBwb2ludG1lbnRbXT47XG4gICAgLy8gcHJpdmF0ZSBhcHBvaW50bWVudHM6ICBPYnNlcnZhYmxlPExvb3BBcHBvaW50bWVudFtdPjsgXG4gICAgcHJpdmF0ZSBpc0l0ZW1WaXNpYmxlID0gZmFsc2U7XG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBfcm91dGVyOiBSb3V0ZXIsIHByaXZhdGUgYXBwb2ludG1lbnRTZXJ2aWNlOiBBcHBvaW50bWVudFNlcnZpY2UsIHByaXZhdGUgbG9vcEFwcG9pbnRtZW50U2VydmljZTogTG9vcEFwcG9pbnRtZW50U2VydmljZSkgeyB9XG5cbiAgICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICAgICAgVGVsZXBob255KCkudGhlbihmdW5jdGlvbiAocmVzb2x2ZWQpIHtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdwaG9uZU51bWJlcicsIHJlc29sdmVkLnBob25lTnVtYmVyKTtcbiAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdlcnJvciA+JywgZXJyb3IpXG4gICAgICAgICAgICBjb25zb2xlLmRpcihlcnJvcik7XG4gICAgICAgIH0pXG4gICAgICAgIC8vIHRoaXMubG9vcEFwcG9pbnRtZW50U2VydmljZS5sb29wR2V0QXBwaW9udG1lbnRzKCkuY2F0Y2goZXJyID0+ICB7IFxuICAgICAgICAvLyAgICAgY29uc29sZS5kaXIoZXJyKTsgICAgICAgICAgICBcbiAgICAgICAgLy8gICAgIHJldHVybiBlcnI7IC8vIG9ic2VydmFibGUgbmVlZHMgdG8gYmUgcmV0dXJuZWQgb3IgZXhjZXB0aW9uIHJhaXNlZFxuICAgICAgICAvLyAgfSkuc3Vic2NyaWJlKChyZXM6IE9ic2VydmFibGU8QXJyYXk8TG9vcEFwcG9pbnRtZW50Pj4pID0+IHtcbiAgICAgICAgLy8gICAgIGNvbnNvbGUuZGlyKHJlcyk7XG4gICAgICAgIC8vICAgICB0aGlzLmFwcG9pbnRtZW50cyA9IHJlczsgICAgICAgICAgICBcbiAgICAgICAgLy8gfSk7XG4gICAgICAgIGxldCBkYXRlID0gIG5ldyBEYXRlKCk7ICAgICAgXG4gICAgICAgIHRoaXMuc2V0QXBwb2ludG1lbnREYXRlKGRhdGUpOyAgICAgICAgICAgXG4gICAgfVxuXG4gICAgc2V0QXBwb2ludG1lbnREYXRlKGRhdGUgOiBEYXRlKXtcbiAgICAgICAgbGV0IGRheSA9IGRhdGUuZ2V0RGF0ZSgpO1xuICAgICAgICBsZXQgbW9udGggPSBkYXRlLmdldE1vbnRoKCkgKyAxOy8vIGZyb20gMCAtIDExXG4gICAgICAgIGxldCB5ZWFyID0gZGF0ZS5nZXRGdWxsWWVhcigpO1xuICAgICAgICB0aGlzLnN0cmluZ0RhdGUgPSBtb250aC50b1N0cmluZygpICsgXCIvXCIgKyBkYXkudG9TdHJpbmcoKSArIFwiL1wiICsgeWVhci50b1N0cmluZygpO1xuICAgICAgICB0aGlzLmFwcG9pbnRtZW50cyA9IHRoaXMuYXBwb2ludG1lbnRTZXJ2aWNlLmdldEFwcG9pbnRtZW50cyh0aGlzLnN0cmluZ0RhdGUpO1xuICAgIH1cblxuICAgIG9uTmF2aWdhdGlvbkl0ZW1UYXAoYXBwb2ludG1lbnQ6IEFwcG9pbnRtZW50KSB7XG4gICAgICAgIGxldCBhcHBvaW50bWVudGRhdGEgPSBKU09OLnN0cmluZ2lmeShhcHBvaW50bWVudCk7XG4gICAgICAgIHRoaXMuX3JvdXRlci5uYXZpZ2F0ZShbJy9hcHBvaW50bWVudCcsIGFwcG9pbnRtZW50ZGF0YV0pO1xuICAgIH1cblxuICAgIHNldERhdGUoKSB7ICAgICAgICBcbiAgICAgICAgdGhpcy5pc0l0ZW1WaXNpYmxlID0gKHRoaXMuaXNJdGVtVmlzaWJsZSk/IGZhbHNlIDogdHJ1ZTtcbiAgICB9XG5cbiAgICBvblBpY2tlckxvYWRlZChhcmdzKSB7XG4gICAgICAgIGxldCBkYXRlUGlja2VyID0gPERhdGVQaWNrZXI+YXJncy5vYmplY3Q7XG4gICAgICAgIGRhdGVQaWNrZXIuZGF0ZSA9ICBuZXcgRGF0ZShEYXRlLm5vdygpKTtcbiAgICAgICAgZGF0ZVBpY2tlci5taW5EYXRlID0gbmV3IERhdGUoMTk3NSwgMCwgMjkpO1xuICAgICAgICBkYXRlUGlja2VyLm1heERhdGUgPSBuZXcgRGF0ZSgyMDQ1LCA0LCAxMik7XG4gICAgfVxuXG4gICAgb25EYXRlQ2hhbmdlZChhcmdzKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiRGF0ZSBjaGFuZ2VkXCIpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIk5ldyB2YWx1ZTogXCIgKyBhcmdzLnZhbHVlKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJPbGQgdmFsdWU6IFwiICsgYXJncy5vbGRWYWx1ZSk7XG4gICAgICAgIHRoaXMuc2V0QXBwb2ludG1lbnREYXRlKGFyZ3MudmFsdWUpO1xuICAgIH1cblxuICAgIG9uRGF5Q2hhbmdlZChhcmdzKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiRGF5IGNoYW5nZWRcIik7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiTmV3IHZhbHVlOiBcIiArIGFyZ3MudmFsdWUpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIk9sZCB2YWx1ZTogXCIgKyBhcmdzLm9sZFZhbHVlKTtcbiAgICB9XG5cbiAgICBvbk1vbnRoQ2hhbmdlZChhcmdzKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiTW9udGggY2hhbmdlZFwiKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJOZXcgdmFsdWU6IFwiICsgYXJncy52YWx1ZSk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiT2xkIHZhbHVlOiBcIiArIGFyZ3Mub2xkVmFsdWUpO1xuICAgIH1cblxuICAgIG9uWWVhckNoYW5nZWQoYXJncykge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlllYXIgY2hhbmdlZFwiKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJOZXcgdmFsdWU6IFwiICsgYXJncy52YWx1ZSk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiT2xkIHZhbHVlOiBcIiArIGFyZ3Mub2xkVmFsdWUpO1xuICAgIH1cblxufSJdfQ==