"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var appointment_service_1 = require("./appointment.service");
var element_registry_1 = require("nativescript-angular/element-registry");
var router_1 = require("@angular/router");
var nativescript_telephony_1 = require("nativescript-telephony");
element_registry_1.registerElement('Emoji', function () { return require('nativescript-emoji').Emoji; });
require("nativescript-localstorage");
var AppointmentComponent = (function () {
    function AppointmentComponent(_router, appointmentService) {
        this._router = _router;
        this.appointmentService = appointmentService;
        nativescript_telephony_1.Telephony().then(function (resolved) {
            localStorage.setItem('phoneNumber', resolved.phoneNumber);
        }).catch(function (error) {
            console.error('error >', error);
            console.dir(error);
        });
    }
    AppointmentComponent.prototype.ngOnInit = function () {
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
        __metadata("design:paramtypes", [router_1.Router, appointment_service_1.AppointmentService])
    ], AppointmentComponent);
    return AppointmentComponent;
}());
exports.AppointmentComponent = AppointmentComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwb2ludG1lbnQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXBwb2ludG1lbnQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQWtEO0FBQ2xELDZEQUEyRDtBQUMzRCwwRUFBd0U7QUFHeEUsMENBQTJEO0FBRTNELGlFQUFtRDtBQUNuRCxrQ0FBZSxDQUFDLE9BQU8sRUFBRyxjQUFNLE9BQUEsT0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQUMsS0FBSyxFQUFuQyxDQUFtQyxDQUFDLENBQUM7QUFDckUscUNBQWtDO0FBT2xDO0lBRUksOEJBQW9CLE9BQWUsRUFBUyxrQkFBc0M7UUFBOUQsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUFTLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBb0I7UUFDOUUsa0NBQVMsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFTLFFBQVE7WUFDOUIsWUFBWSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQzlELENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFTLEtBQUs7WUFDbkIsT0FBTyxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUE7WUFDL0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN2QixDQUFDLENBQUMsQ0FBQTtJQUNMLENBQUM7SUFDRix1Q0FBUSxHQUFSO1FBQ0ksSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsZUFBZSxFQUFFLENBQUM7SUFDbEUsQ0FBQztJQUNNLGtEQUFtQixHQUExQixVQUEyQixXQUF3QjtRQUN2QyxJQUFJLGVBQWUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQzlDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsY0FBYyxFQUFFLGVBQWUsQ0FBQyxDQUFDLENBQUM7SUFDakUsQ0FBQztJQWhCQSxvQkFBb0I7UUFOaEMsZ0JBQVMsQ0FBQztZQUNQLFFBQVEsRUFBRSxVQUFVO1lBQ3BCLFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtZQUNuQixTQUFTLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQztZQUM5QixXQUFXLEVBQUUsNEJBQTRCO1NBQzVDLENBQUM7eUNBRytCLGVBQU0sRUFBNkIsd0NBQWtCO09BRnpFLG9CQUFvQixDQWlCaEM7SUFBRCwyQkFBQztDQUFBLEFBakJELElBaUJDO0FBakJZLG9EQUFvQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0IH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IEFwcG9pbnRtZW50U2VydmljZSB9IGZyb20gXCIuL2FwcG9pbnRtZW50LnNlcnZpY2VcIjtcbmltcG9ydCB7IHJlZ2lzdGVyRWxlbWVudCB9IGZyb20gJ25hdGl2ZXNjcmlwdC1hbmd1bGFyL2VsZW1lbnQtcmVnaXN0cnknO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMvJztcbmltcG9ydCB7IEFwcG9pbnRtZW50IH0gZnJvbSBcIi4vYXBwb2ludG1lbnQubW9kZWxcIjtcbmltcG9ydCB7IE5hdmlnYXRpb25FeHRyYXMsIFJvdXRlciB9IGZyb20gXCJAYW5ndWxhci9yb3V0ZXJcIjtcbmltcG9ydCB7IGFuZHJvaWQgfSBmcm9tIFwidG5zLWNvcmUtbW9kdWxlcy9hcHBsaWNhdGlvbi9hcHBsaWNhdGlvblwiO1xuaW1wb3J0IHsgVGVsZXBob255IH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC10ZWxlcGhvbnlcIjtcbnJlZ2lzdGVyRWxlbWVudCgnRW1vamknICwgKCkgPT4gcmVxdWlyZSgnbmF0aXZlc2NyaXB0LWVtb2ppJykuRW1vamkpO1xuaW1wb3J0ICduYXRpdmVzY3JpcHQtbG9jYWxzdG9yYWdlJ1xuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6IFwibnMtaXRlbXNcIixcbiAgICBtb2R1bGVJZDogbW9kdWxlLmlkLFxuICAgIHN0eWxlVXJsczogW1wiYXBwb2ludG1lbnQuY3NzXCJdLFxuICAgIHRlbXBsYXRlVXJsOiBcImFwcG9pbnRtZW50LmNvbXBvbmVudC5odG1sXCJcbn0pXG5leHBvcnQgY2xhc3MgQXBwb2ludG1lbnRDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICAgIHByaXZhdGUgYXBwb2ludG1lbnRzOiBPYnNlcnZhYmxlPEFwcG9pbnRtZW50W10+OyBcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9yb3V0ZXI6IFJvdXRlcixwcml2YXRlIGFwcG9pbnRtZW50U2VydmljZTogQXBwb2ludG1lbnRTZXJ2aWNlKSB7XG4gICAgICAgIFRlbGVwaG9ueSgpLnRoZW4oZnVuY3Rpb24ocmVzb2x2ZWQpIHsgICAgICAgICAgXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncGhvbmVOdW1iZXInLCByZXNvbHZlZC5waG9uZU51bWJlcik7XG4gICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdlcnJvciA+JywgZXJyb3IpXG4gICAgICAgICAgICBjb25zb2xlLmRpcihlcnJvcik7XG4gICAgICAgIH0pXG4gICAgIH1cbiAgICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5hcHBvaW50bWVudHMgPSB0aGlzLmFwcG9pbnRtZW50U2VydmljZS5nZXRBcHBvaW50bWVudHMoKTtcbiAgICB9XG4gICAgcHVibGljIG9uTmF2aWdhdGlvbkl0ZW1UYXAoYXBwb2ludG1lbnQ6IEFwcG9pbnRtZW50KSB7XG4gICAgICAgICAgICAgICAgbGV0IGFwcG9pbnRtZW50ZGF0YSA9IEpTT04uc3RyaW5naWZ5KGFwcG9pbnRtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcm91dGVyLm5hdmlnYXRlKFsnL2FwcG9pbnRtZW50JywgYXBwb2ludG1lbnRkYXRhXSk7ICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH1cbn0iXX0=