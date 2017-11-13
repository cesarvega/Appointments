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
            console.log('resolved >', resolved);
            console.dir(resolved);
            localStorage.setItem('phoneNumber', resolved.phoneNumber);
        }).catch(function (error) {
            console.error('error >', error);
            console.dir(error);
        });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwb2ludG1lbnQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXBwb2ludG1lbnQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQWtEO0FBQ2xELDZEQUEyRDtBQUMzRCwwRUFBd0U7QUFHeEUsMENBQTJEO0FBRTNELGlFQUFtRDtBQUNuRCxrQ0FBZSxDQUFDLE9BQU8sRUFBRyxjQUFNLE9BQUEsT0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQUMsS0FBSyxFQUFuQyxDQUFtQyxDQUFDLENBQUM7QUFDckUscUNBQWtDO0FBT2xDO0lBRUksOEJBQW9CLE9BQWUsRUFBUyxrQkFBc0M7UUFBOUQsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUFTLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBb0I7UUFHOUUsa0NBQVMsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFTLFFBQVE7WUFDOUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsUUFBUSxDQUFDLENBQUE7WUFDbkMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN0QixZQUFZLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDOUQsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVMsS0FBSztZQUNuQixPQUFPLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQTtZQUMvQixPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3ZCLENBQUMsQ0FBQyxDQUFBO0lBRUwsQ0FBQztJQUNGLHVDQUFRLEdBQVI7UUFDSSxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUM5RCxnQ0FBZ0M7UUFDaEMscUNBQXFDO0lBQ3pDLENBQUM7SUFDTSxrREFBbUIsR0FBMUIsVUFBMkIsV0FBd0I7UUFDdkMsSUFBSSxlQUFlLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUM5QyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLGNBQWMsRUFBRSxlQUFlLENBQUMsQ0FBQyxDQUFDO0lBQ2pFLENBQUM7SUF2QkEsb0JBQW9CO1FBTmhDLGdCQUFTLENBQUM7WUFDUCxRQUFRLEVBQUUsVUFBVTtZQUNwQixRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7WUFDbkIsU0FBUyxFQUFFLENBQUMsaUJBQWlCLENBQUM7WUFDOUIsV0FBVyxFQUFFLDRCQUE0QjtTQUM1QyxDQUFDO3lDQUcrQixlQUFNLEVBQTZCLHdDQUFrQjtPQUZ6RSxvQkFBb0IsQ0F3QmhDO0lBQUQsMkJBQUM7Q0FBQSxBQXhCRCxJQXdCQztBQXhCWSxvREFBb0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBBcHBvaW50bWVudFNlcnZpY2UgfSBmcm9tIFwiLi9hcHBvaW50bWVudC5zZXJ2aWNlXCI7XG5pbXBvcnQgeyByZWdpc3RlckVsZW1lbnQgfSBmcm9tICduYXRpdmVzY3JpcHQtYW5ndWxhci9lbGVtZW50LXJlZ2lzdHJ5JztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzLyc7XG5pbXBvcnQgeyBBcHBvaW50bWVudCB9IGZyb20gXCIuL2FwcG9pbnRtZW50Lm1vZGVsXCI7XG5pbXBvcnQgeyBOYXZpZ2F0aW9uRXh0cmFzLCBSb3V0ZXIgfSBmcm9tIFwiQGFuZ3VsYXIvcm91dGVyXCI7XG5pbXBvcnQgeyBhbmRyb2lkIH0gZnJvbSBcInRucy1jb3JlLW1vZHVsZXMvYXBwbGljYXRpb24vYXBwbGljYXRpb25cIjtcbmltcG9ydCB7IFRlbGVwaG9ueSB9IGZyb20gXCJuYXRpdmVzY3JpcHQtdGVsZXBob255XCI7XG5yZWdpc3RlckVsZW1lbnQoJ0Vtb2ppJyAsICgpID0+IHJlcXVpcmUoJ25hdGl2ZXNjcmlwdC1lbW9qaScpLkVtb2ppKTtcbmltcG9ydCAnbmF0aXZlc2NyaXB0LWxvY2Fsc3RvcmFnZSdcbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiBcIm5zLWl0ZW1zXCIsXG4gICAgbW9kdWxlSWQ6IG1vZHVsZS5pZCxcbiAgICBzdHlsZVVybHM6IFtcImFwcG9pbnRtZW50LmNzc1wiXSxcbiAgICB0ZW1wbGF0ZVVybDogXCJhcHBvaW50bWVudC5jb21wb25lbnQuaHRtbFwiXG59KVxuZXhwb3J0IGNsYXNzIEFwcG9pbnRtZW50Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgICBwcml2YXRlIGFwcG9pbnRtZW50czogT2JzZXJ2YWJsZTxBcHBvaW50bWVudFtdPjsgXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBfcm91dGVyOiBSb3V0ZXIscHJpdmF0ZSBhcHBvaW50bWVudFNlcnZpY2U6IEFwcG9pbnRtZW50U2VydmljZSkge1xuXG5cbiAgICAgICAgVGVsZXBob255KCkudGhlbihmdW5jdGlvbihyZXNvbHZlZCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ3Jlc29sdmVkID4nLCByZXNvbHZlZClcbiAgICAgICAgICAgIGNvbnNvbGUuZGlyKHJlc29sdmVkKTtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdwaG9uZU51bWJlcicsIHJlc29sdmVkLnBob25lTnVtYmVyKTtcbiAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ2Vycm9yID4nLCBlcnJvcilcbiAgICAgICAgICAgIGNvbnNvbGUuZGlyKGVycm9yKTtcbiAgICAgICAgfSlcblxuICAgICB9XG4gICAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuYXBwb2ludG1lbnRzID0gdGhpcy5hcHBvaW50bWVudFNlcnZpY2UuZ2V0QXBwb2ludG1lbnRzKCk7XG4gICAgICAgIC8vIGxldCBjb250ZXh0ID0gYW5kcm9pZC5jb250ZXh0XG4gICAgICAgIC8vIGxldCBwaG9uZU51bWJlciA9IGFuZHJvaWQuY29udGV4dC5cbiAgICB9XG4gICAgcHVibGljIG9uTmF2aWdhdGlvbkl0ZW1UYXAoYXBwb2ludG1lbnQ6IEFwcG9pbnRtZW50KSB7XG4gICAgICAgICAgICAgICAgbGV0IGFwcG9pbnRtZW50ZGF0YSA9IEpTT04uc3RyaW5naWZ5KGFwcG9pbnRtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcm91dGVyLm5hdmlnYXRlKFsnL2FwcG9pbnRtZW50JywgYXBwb2ludG1lbnRkYXRhXSk7ICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH1cbn0iXX0=