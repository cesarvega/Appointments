"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var nativescript_module_1 = require("nativescript-angular/nativescript.module");
var http_1 = require("nativescript-angular/http");
var app_routing_1 = require("./app.routing");
var app_component_1 = require("./app.component");
var appointment_component_1 = require("./appointment/appointment.component");
var appointment_detail_component_1 = require("./appointment/appointment-detail.component");
var appointment_service_1 = require("./appointment/appointment.service");
var loop_appointment_service_1 = require("./appointment/loop/loop-appointment.service");
var angular_1 = require("nativescript-drop-down/angular");
var platform = require("platform");
// Uncomment and add to NgModule imports if you need to use two-way binding
var forms_1 = require("nativescript-angular/forms");
// Uncomment and add to NgModule imports  if you need to use the HTTP wrapper
if (platform.isIOS) {
    GMSServices.provideAPIKey("AIzaSyAtRVvG3Be3xXiZFR7xp-K-9hy4nZ4hMFs");
}
var AppModule = (function () {
    /*
    Pass your application module to the bootstrapModule function located in main.ts to start your app
    */
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            bootstrap: [
                app_component_1.AppComponent
            ],
            imports: [
                nativescript_module_1.NativeScriptModule,
                http_1.NativeScriptHttpModule,
                app_routing_1.AppRoutingModule,
                forms_1.NativeScriptFormsModule,
                angular_1.DropDownModule
            ],
            declarations: [
                app_component_1.AppComponent,
                appointment_component_1.AppointmentComponent,
                appointment_detail_component_1.AppointmentDetailComponent,
            ],
            providers: [
                appointment_service_1.AppointmentService,
                loop_appointment_service_1.LoopAppointmentService
            ],
            schemas: [
                core_1.NO_ERRORS_SCHEMA
            ]
        })
        /*
        Pass your application module to the bootstrapModule function located in main.ts to start your app
        */
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwcC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBMkQ7QUFDM0QsZ0ZBQThFO0FBQzlFLGtEQUFtRTtBQUNuRSw2Q0FBaUQ7QUFDakQsaURBQStDO0FBRS9DLDZFQUEyRTtBQUMzRSwyRkFBd0Y7QUFDeEYseUVBQXVFO0FBQ3ZFLHdGQUFxRjtBQUNyRiwwREFBZ0U7QUFDaEUsbUNBQXFDO0FBR3JDLDJFQUEyRTtBQUMzRSxvREFBcUU7QUFFckUsNkVBQTZFO0FBRzdFLEVBQUUsQ0FBQSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ2hCLFdBQVcsQ0FBQyxhQUFhLENBQUMseUNBQXlDLENBQUMsQ0FBQztBQUN6RSxDQUFDO0FBNkJEO0lBSEE7O01BRUU7SUFDRjtJQUF5QixDQUFDO0lBQWIsU0FBUztRQTNCckIsZUFBUSxDQUFDO1lBQ04sU0FBUyxFQUFFO2dCQUNQLDRCQUFZO2FBQ2Y7WUFDRCxPQUFPLEVBQUU7Z0JBQ0wsd0NBQWtCO2dCQUNsQiw2QkFBc0I7Z0JBQ3RCLDhCQUFnQjtnQkFDaEIsK0JBQXVCO2dCQUN2Qix3QkFBYzthQUNqQjtZQUNELFlBQVksRUFBRTtnQkFDViw0QkFBWTtnQkFDWiw0Q0FBb0I7Z0JBQ3BCLHlEQUEwQjthQUM3QjtZQUNELFNBQVMsRUFBRTtnQkFDUCx3Q0FBa0I7Z0JBQ2xCLGlEQUFzQjthQUN6QjtZQUNELE9BQU8sRUFBRTtnQkFDTCx1QkFBZ0I7YUFDbkI7U0FDSixDQUFDO1FBQ0Y7O1VBRUU7T0FDVyxTQUFTLENBQUk7SUFBRCxnQkFBQztDQUFBLEFBQTFCLElBQTBCO0FBQWIsOEJBQVMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSwgTk9fRVJST1JTX1NDSEVNQSB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBOYXRpdmVTY3JpcHRNb2R1bGUgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvbmF0aXZlc2NyaXB0Lm1vZHVsZVwiO1xuaW1wb3J0IHsgTmF0aXZlU2NyaXB0SHR0cE1vZHVsZSB9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9odHRwXCI7XG5pbXBvcnQgeyBBcHBSb3V0aW5nTW9kdWxlIH0gZnJvbSBcIi4vYXBwLnJvdXRpbmdcIjtcbmltcG9ydCB7IEFwcENvbXBvbmVudCB9IGZyb20gXCIuL2FwcC5jb21wb25lbnRcIjtcblxuaW1wb3J0IHsgQXBwb2ludG1lbnRDb21wb25lbnQgfSBmcm9tIFwiLi9hcHBvaW50bWVudC9hcHBvaW50bWVudC5jb21wb25lbnRcIjtcbmltcG9ydCB7IEFwcG9pbnRtZW50RGV0YWlsQ29tcG9uZW50IH0gZnJvbSBcIi4vYXBwb2ludG1lbnQvYXBwb2ludG1lbnQtZGV0YWlsLmNvbXBvbmVudFwiO1xuaW1wb3J0IHsgQXBwb2ludG1lbnRTZXJ2aWNlIH0gZnJvbSBcIi4vYXBwb2ludG1lbnQvYXBwb2ludG1lbnQuc2VydmljZVwiO1xuaW1wb3J0IHsgTG9vcEFwcG9pbnRtZW50U2VydmljZSB9IGZyb20gXCIuL2FwcG9pbnRtZW50L2xvb3AvbG9vcC1hcHBvaW50bWVudC5zZXJ2aWNlXCI7XG5pbXBvcnQgeyBEcm9wRG93bk1vZHVsZSB9IGZyb20gXCJuYXRpdmVzY3JpcHQtZHJvcC1kb3duL2FuZ3VsYXJcIjtcbmltcG9ydCAqIGFzIHBsYXRmb3JtIGZyb20gXCJwbGF0Zm9ybVwiO1xuZGVjbGFyZSB2YXIgR01TU2VydmljZXM6IGFueTtcblxuLy8gVW5jb21tZW50IGFuZCBhZGQgdG8gTmdNb2R1bGUgaW1wb3J0cyBpZiB5b3UgbmVlZCB0byB1c2UgdHdvLXdheSBiaW5kaW5nXG5pbXBvcnQgeyBOYXRpdmVTY3JpcHRGb3Jtc01vZHVsZSB9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9mb3Jtc1wiO1xuXG4vLyBVbmNvbW1lbnQgYW5kIGFkZCB0byBOZ01vZHVsZSBpbXBvcnRzICBpZiB5b3UgbmVlZCB0byB1c2UgdGhlIEhUVFAgd3JhcHBlclxuXG5cbmlmKHBsYXRmb3JtLmlzSU9TKSB7XG4gICAgR01TU2VydmljZXMucHJvdmlkZUFQSUtleShcIkFJemFTeUF0UlZ2RzNCZTN4WGlaRlI3eHAtSy05aHk0blo0aE1Gc1wiKTtcbn1cblxuQE5nTW9kdWxlKHtcbiAgICBib290c3RyYXA6IFtcbiAgICAgICAgQXBwQ29tcG9uZW50XG4gICAgXSxcbiAgICBpbXBvcnRzOiBbXG4gICAgICAgIE5hdGl2ZVNjcmlwdE1vZHVsZSxcbiAgICAgICAgTmF0aXZlU2NyaXB0SHR0cE1vZHVsZSxcbiAgICAgICAgQXBwUm91dGluZ01vZHVsZSxcbiAgICAgICAgTmF0aXZlU2NyaXB0Rm9ybXNNb2R1bGUsXG4gICAgICAgIERyb3BEb3duTW9kdWxlXG4gICAgXSxcbiAgICBkZWNsYXJhdGlvbnM6IFtcbiAgICAgICAgQXBwQ29tcG9uZW50LFxuICAgICAgICBBcHBvaW50bWVudENvbXBvbmVudCxcbiAgICAgICAgQXBwb2ludG1lbnREZXRhaWxDb21wb25lbnQsXG4gICAgXSxcbiAgICBwcm92aWRlcnM6IFtcbiAgICAgICAgQXBwb2ludG1lbnRTZXJ2aWNlLFxuICAgICAgICBMb29wQXBwb2ludG1lbnRTZXJ2aWNlXG4gICAgXSxcbiAgICBzY2hlbWFzOiBbXG4gICAgICAgIE5PX0VSUk9SU19TQ0hFTUFcbiAgICBdXG59KVxuLypcblBhc3MgeW91ciBhcHBsaWNhdGlvbiBtb2R1bGUgdG8gdGhlIGJvb3RzdHJhcE1vZHVsZSBmdW5jdGlvbiBsb2NhdGVkIGluIG1haW4udHMgdG8gc3RhcnQgeW91ciBhcHBcbiovXG5leHBvcnQgY2xhc3MgQXBwTW9kdWxlIHsgfVxuIl19