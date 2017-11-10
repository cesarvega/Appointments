"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var appointment_service_1 = require("./appointment.service");
var element_registry_1 = require("nativescript-angular/element-registry");
var router_1 = require("@angular/router");
element_registry_1.registerElement('Emoji', function () { return require('nativescript-emoji').Emoji; });
var AppointmentComponent = (function () {
    function AppointmentComponent(_router, appointmentService) {
        this._router = _router;
        this.appointmentService = appointmentService;
    }
    AppointmentComponent.prototype.ngOnInit = function () {
        this.appointments = this.appointmentService.getAppointments();
        // let context = android.context
        // let phoneNumber = android.context.
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
        __metadata("design:paramtypes", [router_1.Router, appointment_service_1.AppointmentService])
    ], AppointmentComponent);
    return AppointmentComponent;
}());
exports.AppointmentComponent = AppointmentComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwb2ludG1lbnQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXBwb2ludG1lbnQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQWtEO0FBQ2xELDZEQUEyRDtBQUMzRCwwRUFBd0U7QUFHeEUsMENBQTJEO0FBRTNELGtDQUFlLENBQUMsT0FBTyxFQUFHLGNBQU0sT0FBQSxPQUFPLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxLQUFLLEVBQW5DLENBQW1DLENBQUMsQ0FBQztBQVFyRTtJQUVJLDhCQUFvQixPQUFlLEVBQVMsa0JBQXNDO1FBQTlELFlBQU8sR0FBUCxPQUFPLENBQVE7UUFBUyx1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW9CO0lBQUksQ0FBQztJQUN2Rix1Q0FBUSxHQUFSO1FBQ0ksSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDOUQsZ0NBQWdDO1FBQ2hDLHFDQUFxQztJQUN6QyxDQUFDO0lBQ00sa0RBQW1CLEdBQTFCLFVBQTJCLFdBQXdCO1FBQ3ZDLElBQUksZUFBZSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDOUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxjQUFjLEVBQUUsZUFBZSxDQUFDLENBQUMsQ0FBQztJQUNqRSxDQUFDO0lBWEEsb0JBQW9CO1FBTmhDLGdCQUFTLENBQUM7WUFDUCxRQUFRLEVBQUUsVUFBVTtZQUNwQixRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7WUFDbkIsU0FBUyxFQUFFLENBQUMsaUJBQWlCLENBQUM7WUFDOUIsV0FBVyxFQUFFLDRCQUE0QjtTQUM1QyxDQUFDO3lDQUcrQixlQUFNLEVBQTZCLHdDQUFrQjtPQUZ6RSxvQkFBb0IsQ0FZaEM7SUFBRCwyQkFBQztDQUFBLEFBWkQsSUFZQztBQVpZLG9EQUFvQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0IH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IEFwcG9pbnRtZW50U2VydmljZSB9IGZyb20gXCIuL2FwcG9pbnRtZW50LnNlcnZpY2VcIjtcbmltcG9ydCB7IHJlZ2lzdGVyRWxlbWVudCB9IGZyb20gJ25hdGl2ZXNjcmlwdC1hbmd1bGFyL2VsZW1lbnQtcmVnaXN0cnknO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMvJztcbmltcG9ydCB7IEFwcG9pbnRtZW50IH0gZnJvbSBcIi4vYXBwb2ludG1lbnQubW9kZWxcIjtcbmltcG9ydCB7IE5hdmlnYXRpb25FeHRyYXMsIFJvdXRlciB9IGZyb20gXCJAYW5ndWxhci9yb3V0ZXJcIjtcbmltcG9ydCB7IGFuZHJvaWQgfSBmcm9tIFwidG5zLWNvcmUtbW9kdWxlcy9hcHBsaWNhdGlvbi9hcHBsaWNhdGlvblwiO1xucmVnaXN0ZXJFbGVtZW50KCdFbW9qaScgLCAoKSA9PiByZXF1aXJlKCduYXRpdmVzY3JpcHQtZW1vamknKS5FbW9qaSk7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiBcIm5zLWl0ZW1zXCIsXG4gICAgbW9kdWxlSWQ6IG1vZHVsZS5pZCxcbiAgICBzdHlsZVVybHM6IFtcImFwcG9pbnRtZW50LmNzc1wiXSxcbiAgICB0ZW1wbGF0ZVVybDogXCJhcHBvaW50bWVudC5jb21wb25lbnQuaHRtbFwiXG59KVxuZXhwb3J0IGNsYXNzIEFwcG9pbnRtZW50Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgICBwcml2YXRlIGFwcG9pbnRtZW50czogT2JzZXJ2YWJsZTxBcHBvaW50bWVudFtdPjsgXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBfcm91dGVyOiBSb3V0ZXIscHJpdmF0ZSBhcHBvaW50bWVudFNlcnZpY2U6IEFwcG9pbnRtZW50U2VydmljZSkgeyB9XG4gICAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuYXBwb2ludG1lbnRzID0gdGhpcy5hcHBvaW50bWVudFNlcnZpY2UuZ2V0QXBwb2ludG1lbnRzKCk7XG4gICAgICAgIC8vIGxldCBjb250ZXh0ID0gYW5kcm9pZC5jb250ZXh0XG4gICAgICAgIC8vIGxldCBwaG9uZU51bWJlciA9IGFuZHJvaWQuY29udGV4dC5cbiAgICB9XG4gICAgcHVibGljIG9uTmF2aWdhdGlvbkl0ZW1UYXAoYXBwb2ludG1lbnQ6IEFwcG9pbnRtZW50KSB7XG4gICAgICAgICAgICAgICAgbGV0IGFwcG9pbnRtZW50ZGF0YSA9IEpTT04uc3RyaW5naWZ5KGFwcG9pbnRtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcm91dGVyLm5hdmlnYXRlKFsnL2FwcG9pbnRtZW50JywgYXBwb2ludG1lbnRkYXRhXSk7ICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH1cbn0iXX0=