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
        // this.loopAppointmentService.loopGetAppiontments().catch(err =>  { 
        //     console.dir(err);            
        //     return err; // observable needs to be returned or exception raised
        //  }).subscribe((res: Observable<Array<LoopAppointment>>) => {
        //     console.dir(res);
        //     this.appointments = res;            
        // });
        nativescript_telephony_1.Telephony().then(function (resolved) {
            localStorage.setItem('phoneNumber', (resolved.phoneNumber) ? resolved.phoneNumber : '15555218135');
        }).catch(function (error) {
            console.error('error >', error);
            console.dir(error);
        });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwb2ludG1lbnQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXBwb2ludG1lbnQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQWtEO0FBQ2xELDZEQUEyRDtBQUMzRCwwRUFBd0U7QUFHeEUsMENBQTJEO0FBRTNELGlFQUFtRDtBQUNuRCxrQ0FBZSxDQUFDLE9BQU8sRUFBRSxjQUFNLE9BQUEsT0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQUMsS0FBSyxFQUFuQyxDQUFtQyxDQUFDLENBQUM7QUFDcEUscUNBQWtDO0FBQ2xDLDRFQUF5RTtBQWN6RTtJQUtJLDhCQUFvQixPQUFlLEVBQVUsa0JBQXNDLEVBQVUsc0JBQThDO1FBQXZILFlBQU8sR0FBUCxPQUFPLENBQVE7UUFBVSx1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW9CO1FBQVUsMkJBQXNCLEdBQXRCLHNCQUFzQixDQUF3QjtRQUYzSSx5REFBeUQ7UUFDakQsa0JBQWEsR0FBRyxLQUFLLENBQUM7SUFDaUgsQ0FBQztJQUVoSix1Q0FBUSxHQUFSO1FBRUkscUVBQXFFO1FBQ3JFLG9DQUFvQztRQUNwQyx5RUFBeUU7UUFDekUsK0RBQStEO1FBQy9ELHdCQUF3QjtRQUN4QiwyQ0FBMkM7UUFDM0MsTUFBTTtRQUNOLGtDQUFTLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVSxRQUFRO1lBQy9CLFlBQVksQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxHQUFDLFFBQVEsQ0FBQyxXQUFXLEdBQUMsYUFBYSxDQUFDLENBQUM7UUFDbkcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsS0FBSztZQUNwQixPQUFPLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQTtZQUMvQixPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3ZCLENBQUMsQ0FBQyxDQUFBO1FBQ0Ys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ci9jb3JlXCI7XG5pbXBvcnQgeyBBcHBvaW50bWVudFNlcnZpY2UgfSBmcm9tIFwiLi9hcHBvaW50bWVudC5zZXJ2aWNlXCI7XG5pbXBvcnQgeyByZWdpc3RlckVsZW1lbnQgfSBmcm9tICduYXRpdmVzY3JpcHQtYW5ndWxhci9lbGVtZW50LXJlZ2lzdHJ5JztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzLyc7XG5pbXBvcnQgeyBBcHBvaW50bWVudCB9IGZyb20gXCIuL2FwcG9pbnRtZW50Lm1vZGVsXCI7XG5pbXBvcnQgeyBOYXZpZ2F0aW9uRXh0cmFzLCBSb3V0ZXIgfSBmcm9tIFwiQGFuZ3VsYXIvcm91dGVyXCI7XG5pbXBvcnQgeyBhbmRyb2lkIH0gZnJvbSBcInRucy1jb3JlLW1vZHVsZXMvYXBwbGljYXRpb24vYXBwbGljYXRpb25cIjtcbmltcG9ydCB7IFRlbGVwaG9ueSB9IGZyb20gXCJuYXRpdmVzY3JpcHQtdGVsZXBob255XCI7XG5yZWdpc3RlckVsZW1lbnQoJ0Vtb2ppJywgKCkgPT4gcmVxdWlyZSgnbmF0aXZlc2NyaXB0LWVtb2ppJykuRW1vamkpO1xuaW1wb3J0ICduYXRpdmVzY3JpcHQtbG9jYWxzdG9yYWdlJ1xuaW1wb3J0IHsgTG9vcEFwcG9pbnRtZW50U2VydmljZSB9IGZyb20gXCIuL2xvb3AvbG9vcC1hcHBvaW50bWVudC5zZXJ2aWNlXCI7XG5pbXBvcnQgeyBMb29wQXBwb2ludG1lbnQgfSBmcm9tIFwiLi9sb29wL2xvb3AtYXBwb2ludG1lbnQubW9kZWxcIjtcblxuXG5pbXBvcnQgeyBEYXRlUGlja2VyIH0gZnJvbSBcInVpL2RhdGUtcGlja2VyXCI7XG5pbXBvcnQgeyBFdmVudERhdGEgfSBmcm9tIFwiZGF0YS9vYnNlcnZhYmxlXCI7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiBcIm5zLWl0ZW1zXCIsXG4gICAgbW9kdWxlSWQ6IG1vZHVsZS5pZCxcbiAgICBzdHlsZVVybHM6IFtcImFwcG9pbnRtZW50LmNzc1wiXSxcbiAgICB0ZW1wbGF0ZVVybDogXCJhcHBvaW50bWVudC5jb21wb25lbnQuaHRtbFwiXG59KVxuXG5leHBvcnQgY2xhc3MgQXBwb2ludG1lbnRDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICAgIHByaXZhdGUgc3RyaW5nRGF0ZTogc3RyaW5nO1xuICAgIHByaXZhdGUgYXBwb2ludG1lbnRzOiBPYnNlcnZhYmxlPEFwcG9pbnRtZW50W10+O1xuICAgIC8vIHByaXZhdGUgYXBwb2ludG1lbnRzOiAgT2JzZXJ2YWJsZTxMb29wQXBwb2ludG1lbnRbXT47IFxuICAgIHByaXZhdGUgaXNJdGVtVmlzaWJsZSA9IGZhbHNlO1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgX3JvdXRlcjogUm91dGVyLCBwcml2YXRlIGFwcG9pbnRtZW50U2VydmljZTogQXBwb2ludG1lbnRTZXJ2aWNlLCBwcml2YXRlIGxvb3BBcHBvaW50bWVudFNlcnZpY2U6IExvb3BBcHBvaW50bWVudFNlcnZpY2UpIHsgfVxuXG4gICAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgICAgXG4gICAgICAgIC8vIHRoaXMubG9vcEFwcG9pbnRtZW50U2VydmljZS5sb29wR2V0QXBwaW9udG1lbnRzKCkuY2F0Y2goZXJyID0+ICB7IFxuICAgICAgICAvLyAgICAgY29uc29sZS5kaXIoZXJyKTsgICAgICAgICAgICBcbiAgICAgICAgLy8gICAgIHJldHVybiBlcnI7IC8vIG9ic2VydmFibGUgbmVlZHMgdG8gYmUgcmV0dXJuZWQgb3IgZXhjZXB0aW9uIHJhaXNlZFxuICAgICAgICAvLyAgfSkuc3Vic2NyaWJlKChyZXM6IE9ic2VydmFibGU8QXJyYXk8TG9vcEFwcG9pbnRtZW50Pj4pID0+IHtcbiAgICAgICAgLy8gICAgIGNvbnNvbGUuZGlyKHJlcyk7XG4gICAgICAgIC8vICAgICB0aGlzLmFwcG9pbnRtZW50cyA9IHJlczsgICAgICAgICAgICBcbiAgICAgICAgLy8gfSk7XG4gICAgICAgIFRlbGVwaG9ueSgpLnRoZW4oZnVuY3Rpb24gKHJlc29sdmVkKSB7XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncGhvbmVOdW1iZXInLCAocmVzb2x2ZWQucGhvbmVOdW1iZXIpP3Jlc29sdmVkLnBob25lTnVtYmVyOicxNTU1NTIxODEzNScpO1xuICAgICAgICB9KS5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ2Vycm9yID4nLCBlcnJvcilcbiAgICAgICAgICAgIGNvbnNvbGUuZGlyKGVycm9yKTtcbiAgICAgICAgfSlcbiAgICAgICAgbGV0IGRhdGUgPSAgbmV3IERhdGUoKTsgICAgICBcbiAgICAgICAgdGhpcy5zZXRBcHBvaW50bWVudERhdGUoZGF0ZSk7ICAgICAgICAgICBcbiAgICB9XG5cbiAgICBzZXRBcHBvaW50bWVudERhdGUoZGF0ZSA6IERhdGUpe1xuICAgICAgICBsZXQgZGF5ID0gZGF0ZS5nZXREYXRlKCk7XG4gICAgICAgIGxldCBtb250aCA9IGRhdGUuZ2V0TW9udGgoKSArIDE7Ly8gZnJvbSAwIC0gMTFcbiAgICAgICAgbGV0IHllYXIgPSBkYXRlLmdldEZ1bGxZZWFyKCk7XG4gICAgICAgIHRoaXMuc3RyaW5nRGF0ZSA9IG1vbnRoLnRvU3RyaW5nKCkgKyBcIi9cIiArIGRheS50b1N0cmluZygpICsgXCIvXCIgKyB5ZWFyLnRvU3RyaW5nKCk7XG4gICAgICAgIHRoaXMuYXBwb2ludG1lbnRzID0gdGhpcy5hcHBvaW50bWVudFNlcnZpY2UuZ2V0QXBwb2ludG1lbnRzKHRoaXMuc3RyaW5nRGF0ZSk7XG4gICAgfVxuXG4gICAgb25OYXZpZ2F0aW9uSXRlbVRhcChhcHBvaW50bWVudDogQXBwb2ludG1lbnQpIHtcbiAgICAgICAgbGV0IGFwcG9pbnRtZW50ZGF0YSA9IEpTT04uc3RyaW5naWZ5KGFwcG9pbnRtZW50KTtcbiAgICAgICAgdGhpcy5fcm91dGVyLm5hdmlnYXRlKFsnL2FwcG9pbnRtZW50JywgYXBwb2ludG1lbnRkYXRhXSk7XG4gICAgfVxuXG4gICAgc2V0RGF0ZSgpIHsgICAgICAgIFxuICAgICAgICB0aGlzLmlzSXRlbVZpc2libGUgPSAodGhpcy5pc0l0ZW1WaXNpYmxlKT8gZmFsc2UgOiB0cnVlO1xuICAgIH1cblxuICAgIG9uUGlja2VyTG9hZGVkKGFyZ3MpIHtcbiAgICAgICAgbGV0IGRhdGVQaWNrZXIgPSA8RGF0ZVBpY2tlcj5hcmdzLm9iamVjdDtcbiAgICAgICAgZGF0ZVBpY2tlci5kYXRlID0gIG5ldyBEYXRlKERhdGUubm93KCkpO1xuICAgICAgICBkYXRlUGlja2VyLm1pbkRhdGUgPSBuZXcgRGF0ZSgxOTc1LCAwLCAyOSk7XG4gICAgICAgIGRhdGVQaWNrZXIubWF4RGF0ZSA9IG5ldyBEYXRlKDIwNDUsIDQsIDEyKTtcbiAgICB9XG5cbiAgICBvbkRhdGVDaGFuZ2VkKGFyZ3MpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJEYXRlIGNoYW5nZWRcIik7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiTmV3IHZhbHVlOiBcIiArIGFyZ3MudmFsdWUpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIk9sZCB2YWx1ZTogXCIgKyBhcmdzLm9sZFZhbHVlKTtcbiAgICAgICAgdGhpcy5zZXRBcHBvaW50bWVudERhdGUoYXJncy52YWx1ZSk7XG4gICAgfVxuXG4gICAgb25EYXlDaGFuZ2VkKGFyZ3MpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJEYXkgY2hhbmdlZFwiKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJOZXcgdmFsdWU6IFwiICsgYXJncy52YWx1ZSk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiT2xkIHZhbHVlOiBcIiArIGFyZ3Mub2xkVmFsdWUpO1xuICAgIH1cblxuICAgIG9uTW9udGhDaGFuZ2VkKGFyZ3MpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJNb250aCBjaGFuZ2VkXCIpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIk5ldyB2YWx1ZTogXCIgKyBhcmdzLnZhbHVlKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJPbGQgdmFsdWU6IFwiICsgYXJncy5vbGRWYWx1ZSk7XG4gICAgfVxuXG4gICAgb25ZZWFyQ2hhbmdlZChhcmdzKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiWWVhciBjaGFuZ2VkXCIpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIk5ldyB2YWx1ZTogXCIgKyBhcmdzLnZhbHVlKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJPbGQgdmFsdWU6IFwiICsgYXJncy5vbGRWYWx1ZSk7XG4gICAgfVxuXG59Il19