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
    // private appointments:  Observable<LoopAppointment[]>; 
    function AppointmentComponent(_router, appointmentService, loopAppointmentService) {
        this._router = _router;
        this.appointmentService = appointmentService;
        this.loopAppointmentService = loopAppointmentService;
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
        this.appointments = this.appointmentService.getAppointments();
    };
    AppointmentComponent.prototype.onNavigationItemTap = function (appointment) {
        var appointmentdata = JSON.stringify(appointment);
        this._router.navigate(['/appointment', appointmentdata]);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwb2ludG1lbnQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXBwb2ludG1lbnQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQWtEO0FBQ2xELDZEQUEyRDtBQUMzRCwwRUFBd0U7QUFHeEUsMENBQTJEO0FBRTNELGlFQUFtRDtBQUNuRCxrQ0FBZSxDQUFDLE9BQU8sRUFBRyxjQUFNLE9BQUEsT0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQUMsS0FBSyxFQUFuQyxDQUFtQyxDQUFDLENBQUM7QUFDckUscUNBQWtDO0FBQ2xDLDRFQUF5RTtBQVF6RTtJQUVJLHlEQUF5RDtJQUN6RCw4QkFBb0IsT0FBZSxFQUFTLGtCQUFzQyxFQUFTLHNCQUE4QztRQUFySCxZQUFPLEdBQVAsT0FBTyxDQUFRO1FBQVMsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUFvQjtRQUFTLDJCQUFzQixHQUF0QixzQkFBc0IsQ0FBd0I7SUFBRyxDQUFDO0lBRTdJLHVDQUFRLEdBQVI7UUFDSSxrQ0FBUyxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVMsUUFBUTtZQUM5QixZQUFZLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDOUQsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVMsS0FBSztZQUNuQixPQUFPLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQTtZQUMvQixPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3ZCLENBQUMsQ0FBQyxDQUFBO1FBQ0YscUVBQXFFO1FBQ3JFLG9DQUFvQztRQUNwQyx5RUFBeUU7UUFDekUsK0RBQStEO1FBQy9ELHdCQUF3QjtRQUN4QiwyQ0FBMkM7UUFDM0MsTUFBTTtRQUNOLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLGVBQWUsRUFBRSxDQUFDO0lBQ2xFLENBQUM7SUFFRCxrREFBbUIsR0FBbkIsVUFBb0IsV0FBd0I7UUFDaEMsSUFBSSxlQUFlLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUM5QyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLGNBQWMsRUFBRSxlQUFlLENBQUMsQ0FBQyxDQUFDO0lBQ2pFLENBQUM7SUF6QkEsb0JBQW9CO1FBTmhDLGdCQUFTLENBQUM7WUFDUCxRQUFRLEVBQUUsVUFBVTtZQUNwQixRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7WUFDbkIsU0FBUyxFQUFFLENBQUMsaUJBQWlCLENBQUM7WUFDOUIsV0FBVyxFQUFFLDRCQUE0QjtTQUM1QyxDQUFDO3lDQUkrQixlQUFNLEVBQTZCLHdDQUFrQixFQUFpQyxpREFBc0I7T0FIaEksb0JBQW9CLENBMEJoQztJQUFELDJCQUFDO0NBQUEsQUExQkQsSUEwQkM7QUExQlksb0RBQW9CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgQXBwb2ludG1lbnRTZXJ2aWNlIH0gZnJvbSBcIi4vYXBwb2ludG1lbnQuc2VydmljZVwiO1xuaW1wb3J0IHsgcmVnaXN0ZXJFbGVtZW50IH0gZnJvbSAnbmF0aXZlc2NyaXB0LWFuZ3VsYXIvZWxlbWVudC1yZWdpc3RyeSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcy8nO1xuaW1wb3J0IHsgQXBwb2ludG1lbnQgfSBmcm9tIFwiLi9hcHBvaW50bWVudC5tb2RlbFwiO1xuaW1wb3J0IHsgTmF2aWdhdGlvbkV4dHJhcywgUm91dGVyIH0gZnJvbSBcIkBhbmd1bGFyL3JvdXRlclwiO1xuaW1wb3J0IHsgYW5kcm9pZCB9IGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL2FwcGxpY2F0aW9uL2FwcGxpY2F0aW9uXCI7XG5pbXBvcnQgeyBUZWxlcGhvbnkgfSBmcm9tIFwibmF0aXZlc2NyaXB0LXRlbGVwaG9ueVwiO1xucmVnaXN0ZXJFbGVtZW50KCdFbW9qaScgLCAoKSA9PiByZXF1aXJlKCduYXRpdmVzY3JpcHQtZW1vamknKS5FbW9qaSk7XG5pbXBvcnQgJ25hdGl2ZXNjcmlwdC1sb2NhbHN0b3JhZ2UnXG5pbXBvcnQgeyBMb29wQXBwb2ludG1lbnRTZXJ2aWNlIH0gZnJvbSBcIi4vbG9vcC9sb29wLWFwcG9pbnRtZW50LnNlcnZpY2VcIjtcbmltcG9ydCB7IExvb3BBcHBvaW50bWVudCB9IGZyb20gXCIuL2xvb3AvbG9vcC1hcHBvaW50bWVudC5tb2RlbFwiO1xuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6IFwibnMtaXRlbXNcIixcbiAgICBtb2R1bGVJZDogbW9kdWxlLmlkLFxuICAgIHN0eWxlVXJsczogW1wiYXBwb2ludG1lbnQuY3NzXCJdLFxuICAgIHRlbXBsYXRlVXJsOiBcImFwcG9pbnRtZW50LmNvbXBvbmVudC5odG1sXCJcbn0pXG5leHBvcnQgY2xhc3MgQXBwb2ludG1lbnRDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICAgIHByaXZhdGUgYXBwb2ludG1lbnRzOiBPYnNlcnZhYmxlPEFwcG9pbnRtZW50W10+OyBcbiAgICAvLyBwcml2YXRlIGFwcG9pbnRtZW50czogIE9ic2VydmFibGU8TG9vcEFwcG9pbnRtZW50W10+OyBcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9yb3V0ZXI6IFJvdXRlcixwcml2YXRlIGFwcG9pbnRtZW50U2VydmljZTogQXBwb2ludG1lbnRTZXJ2aWNlLHByaXZhdGUgbG9vcEFwcG9pbnRtZW50U2VydmljZTogTG9vcEFwcG9pbnRtZW50U2VydmljZSkge31cbiAgXG4gICAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgICAgIFRlbGVwaG9ueSgpLnRoZW4oZnVuY3Rpb24ocmVzb2x2ZWQpIHsgICAgICAgICAgXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncGhvbmVOdW1iZXInLCByZXNvbHZlZC5waG9uZU51bWJlcik7XG4gICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdlcnJvciA+JywgZXJyb3IpXG4gICAgICAgICAgICBjb25zb2xlLmRpcihlcnJvcik7XG4gICAgICAgIH0pXG4gICAgICAgIC8vIHRoaXMubG9vcEFwcG9pbnRtZW50U2VydmljZS5sb29wR2V0QXBwaW9udG1lbnRzKCkuY2F0Y2goZXJyID0+ICB7IFxuICAgICAgICAvLyAgICAgY29uc29sZS5kaXIoZXJyKTsgICAgICAgICAgICBcbiAgICAgICAgLy8gICAgIHJldHVybiBlcnI7IC8vIG9ic2VydmFibGUgbmVlZHMgdG8gYmUgcmV0dXJuZWQgb3IgZXhjZXB0aW9uIHJhaXNlZFxuICAgICAgICAvLyAgfSkuc3Vic2NyaWJlKChyZXM6IE9ic2VydmFibGU8QXJyYXk8TG9vcEFwcG9pbnRtZW50Pj4pID0+IHtcbiAgICAgICAgLy8gICAgIGNvbnNvbGUuZGlyKHJlcyk7XG4gICAgICAgIC8vICAgICB0aGlzLmFwcG9pbnRtZW50cyA9IHJlczsgICAgICAgICAgICBcbiAgICAgICAgLy8gfSk7XG4gICAgICAgIHRoaXMuYXBwb2ludG1lbnRzID0gdGhpcy5hcHBvaW50bWVudFNlcnZpY2UuZ2V0QXBwb2ludG1lbnRzKCk7XG4gICAgfVxuICAgIFxuICAgIG9uTmF2aWdhdGlvbkl0ZW1UYXAoYXBwb2ludG1lbnQ6IEFwcG9pbnRtZW50KSB7XG4gICAgICAgICAgICAgICAgbGV0IGFwcG9pbnRtZW50ZGF0YSA9IEpTT04uc3RyaW5naWZ5KGFwcG9pbnRtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcm91dGVyLm5hdmlnYXRlKFsnL2FwcG9pbnRtZW50JywgYXBwb2ludG1lbnRkYXRhXSk7ICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH1cbn0iXX0=