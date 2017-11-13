"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var appointment_service_1 = require("./appointment.service");
var element_registry_1 = require("nativescript-angular/element-registry");
var nativescript_google_maps_sdk_1 = require("nativescript-google-maps-sdk");
var elementRegistryModule = require("nativescript-angular/element-registry");
elementRegistryModule.registerElement("CardView", function () { return require("nativescript-cardview").CardView; });
var nativescript_geolocation_1 = require("nativescript-geolocation");
// Important - must register MapView plugin in order to use in Angular templates
element_registry_1.registerElement('MapView', function () { return nativescript_google_maps_sdk_1.MapView; });
var AppointmentDetailComponent = (function () {
    function AppointmentDetailComponent(appointmentService, route) {
        this.appointmentService = appointmentService;
        this.route = route;
        this.latitude = 25.773338;
        this.longitude = -80.190072;
        this.zoom = 8;
        this.bearing = 0;
        this.tilt = 0;
        this.padding = [40, 40, 40, 40];
        this.appointment = JSON.parse(this.route.snapshot.params["appointment"]);
    }
    AppointmentDetailComponent.prototype.ngOnInit = function () {
        // location services
        this.getlocation();
    };
    AppointmentDetailComponent.prototype.checkinLocation = function () {
        this.CurrentLocation = this.getlocation();
    };
    //Map events
    AppointmentDetailComponent.prototype.onMapReady = function (event) {
        console.log('Map Ready');
        this.mapView = event.object;
        console.log("Setting a marker...");
        var marker = new nativescript_google_maps_sdk_1.Marker();
        marker.position = nativescript_google_maps_sdk_1.Position.positionFromLatLng(25.773338, -80.190072);
        marker.title = "Miami";
        marker.snippet = "Usa";
        marker.userData = { index: 1 };
        this.mapView.addMarker(marker);
    };
    AppointmentDetailComponent.prototype.onCoordinateTapped = function (args) {
        console.log("Coordinate Tapped, Lat: " + args.position.latitude + ", Lon: " + args.position.longitude, args);
    };
    AppointmentDetailComponent.prototype.onMarkerEvent = function (args) {
        console.log("Marker Event: '" + args.eventName
            + "' triggered on: " + args.marker.title
            + ", Lat: " + args.marker.position.latitude + ", Lon: " + args.marker.position.longitude, args);
    };
    AppointmentDetailComponent.prototype.onCameraChanged = function (args) {
        console.log("Camera changed: " + JSON.stringify(args.camera), JSON.stringify(args.camera) === this.lastCamera);
        this.lastCamera = JSON.stringify(args.camera);
    };
    AppointmentDetailComponent.prototype.getlocation = function () {
        var _this = this;
        nativescript_geolocation_1.getCurrentLocation({ desiredAccuracy: 3, updateDistance: 10, maximumAge: 20000, timeout: 20000 }).
            then(function (loc) {
            if (loc) {
                console.log("Current location is: ");
                console.dir(loc);
                _this.appointmentService.setGeoLocation(loc, _this.appointment).subscribe(function (res) {
                    console.log(res);
                    ;
                }, function (err) {
                    console.log(err);
                });
                //   return loc;
            }
        }, function (e) {
            console.log("Error: " + e.message);
        });
    };
    AppointmentDetailComponent = __decorate([
        core_1.Component({
            selector: "ns-details",
            moduleId: module.id,
            templateUrl: "./appointment-detail.component.html",
            styleUrls: ['./appointment-detail.css']
        }),
        __metadata("design:paramtypes", [appointment_service_1.AppointmentService,
            router_1.ActivatedRoute])
    ], AppointmentDetailComponent);
    return AppointmentDetailComponent;
}());
exports.AppointmentDetailComponent = AppointmentDetailComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwb2ludG1lbnQtZGV0YWlsLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwcG9pbnRtZW50LWRldGFpbC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBNkQ7QUFDN0QsMENBQWlEO0FBQ2pELDZEQUEyRDtBQUczRCwwRUFBd0U7QUFDeEUsNkVBQXlFO0FBRXpFLDZFQUErRTtBQUMvRSxxQkFBcUIsQ0FBQyxlQUFlLENBQUMsVUFBVSxFQUFFLGNBQU0sT0FBQSxPQUFPLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxRQUFRLEVBQXpDLENBQXlDLENBQUMsQ0FBQztBQUNuRyxxRUFBcUk7QUFDckksZ0ZBQWdGO0FBQ2hGLGtDQUFlLENBQUMsU0FBUyxFQUFFLGNBQU0sT0FBQSxzQ0FBTyxFQUFQLENBQU8sQ0FBQyxDQUFDO0FBUzFDO0lBYUksb0NBQ1ksa0JBQXNDLEVBQ3RDLEtBQXFCO1FBRHJCLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBb0I7UUFDdEMsVUFBSyxHQUFMLEtBQUssQ0FBZ0I7UUFiekIsYUFBUSxHQUFHLFNBQVMsQ0FBQztRQUNyQixjQUFTLEdBQUcsQ0FBQyxTQUFTLENBQUM7UUFDdkIsU0FBSSxHQUFHLENBQUMsQ0FBQztRQUNULFlBQU8sR0FBRyxDQUFDLENBQUM7UUFDWixTQUFJLEdBQUcsQ0FBQyxDQUFDO1FBRVQsWUFBTyxHQUFHLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFRL0IsSUFBSSxDQUFDLFdBQVcsR0FBZ0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztJQUUxRixDQUFDO0lBQ0QsNkNBQVEsR0FBUjtRQUNJLG9CQUFvQjtRQUNwQixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDdkIsQ0FBQztJQUlELG9EQUFl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QUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDdkMsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBakZRLDBCQUEwQjtRQU50QyxnQkFBUyxDQUFDO1lBQ1AsUUFBUSxFQUFFLFlBQVk7WUFDdEIsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFO1lBQ25CLFdBQVcsRUFBRSxxQ0FBcUM7WUFDbEQsU0FBUyxFQUFFLENBQUMsMEJBQTBCLENBQUM7U0FDMUMsQ0FBQzt5Q0Fla0Msd0NBQWtCO1lBQy9CLHVCQUFjO09BZnhCLDBCQUEwQixDQW1GdEM7SUFBRCxpQ0FBQztDQUFBLEFBbkZELElBbUZDO0FBbkZZLGdFQUEwQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBWaWV3Q2hpbGQgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgQWN0aXZhdGVkUm91dGUgfSBmcm9tIFwiQGFuZ3VsYXIvcm91dGVyXCI7XG5pbXBvcnQgeyBBcHBvaW50bWVudFNlcnZpY2UgfSBmcm9tIFwiLi9hcHBvaW50bWVudC5zZXJ2aWNlXCI7XG5pbXBvcnQgeyBBcHBvaW50bWVudCB9IGZyb20gXCIuL2FwcG9pbnRtZW50Lm1vZGVsXCI7XG5cbmltcG9ydCB7IHJlZ2lzdGVyRWxlbWVudCB9IGZyb20gJ25hdGl2ZXNjcmlwdC1hbmd1bGFyL2VsZW1lbnQtcmVnaXN0cnknO1xuaW1wb3J0IHsgTWFwVmlldywgTWFya2VyLCBQb3NpdGlvbiB9IGZyb20gJ25hdGl2ZXNjcmlwdC1nb29nbGUtbWFwcy1zZGsnO1xuXG5pbXBvcnQgKiBhcyBlbGVtZW50UmVnaXN0cnlNb2R1bGUgZnJvbSAnbmF0aXZlc2NyaXB0LWFuZ3VsYXIvZWxlbWVudC1yZWdpc3RyeSc7XG5lbGVtZW50UmVnaXN0cnlNb2R1bGUucmVnaXN0ZXJFbGVtZW50KFwiQ2FyZFZpZXdcIiwgKCkgPT4gcmVxdWlyZShcIm5hdGl2ZXNjcmlwdC1jYXJkdmlld1wiKS5DYXJkVmlldyk7XG5pbXBvcnQgeyBpc0VuYWJsZWQsIGVuYWJsZUxvY2F0aW9uUmVxdWVzdCwgZ2V0Q3VycmVudExvY2F0aW9uLCB3YXRjaExvY2F0aW9uLCBkaXN0YW5jZSwgY2xlYXJXYXRjaCB9IGZyb20gXCJuYXRpdmVzY3JpcHQtZ2VvbG9jYXRpb25cIjtcbi8vIEltcG9ydGFudCAtIG11c3QgcmVnaXN0ZXIgTWFwVmlldyBwbHVnaW4gaW4gb3JkZXIgdG8gdXNlIGluIEFuZ3VsYXIgdGVtcGxhdGVzXG5yZWdpc3RlckVsZW1lbnQoJ01hcFZpZXcnLCAoKSA9PiBNYXBWaWV3KTtcblxuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogXCJucy1kZXRhaWxzXCIsXG4gICAgbW9kdWxlSWQ6IG1vZHVsZS5pZCxcbiAgICB0ZW1wbGF0ZVVybDogXCIuL2FwcG9pbnRtZW50LWRldGFpbC5jb21wb25lbnQuaHRtbFwiLFxuICAgIHN0eWxlVXJsczogWycuL2FwcG9pbnRtZW50LWRldGFpbC5jc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBBcHBvaW50bWVudERldGFpbENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gICAgcHJpdmF0ZSBhcHBvaW50bWVudDogQXBwb2ludG1lbnQ7XG4gICAgcHJpdmF0ZSBsYXRpdHVkZSA9IDI1Ljc3MzMzODtcbiAgICBwcml2YXRlIGxvbmdpdHVkZSA9IC04MC4xOTAwNzI7XG4gICAgcHJpdmF0ZSB6b29tID0gODtcbiAgICBwcml2YXRlIGJlYXJpbmcgPSAwO1xuICAgIHByaXZhdGUgdGlsdCA9IDA7XG4gICAgcHJpdmF0ZSBDdXJyZW50TG9jYXRpb247XG4gICAgcHJpdmF0ZSBwYWRkaW5nID0gWzQwLCA0MCwgNDAsIDQwXTtcbiAgICBwcml2YXRlIG1hcFZpZXc6IE1hcFZpZXc7XG5cbiAgICBsYXN0Q2FtZXJhOiBTdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJpdmF0ZSBhcHBvaW50bWVudFNlcnZpY2U6IEFwcG9pbnRtZW50U2VydmljZSxcbiAgICAgICAgcHJpdmF0ZSByb3V0ZTogQWN0aXZhdGVkUm91dGUpIHtcbiAgICAgICAgdGhpcy5hcHBvaW50bWVudCA9IDxBcHBvaW50bWVudD5KU09OLnBhcnNlKHRoaXMucm91dGUuc25hcHNob3QucGFyYW1zW1wiYXBwb2ludG1lbnRcIl0pO1xuXG4gICAgfVxuICAgIG5nT25Jbml0KCk6IHZvaWQge1xuICAgICAgICAvLyBsb2NhdGlvbiBzZXJ2aWNlc1xuICAgICAgICB0aGlzLmdldGxvY2F0aW9uKCk7XG4gICAgfVxuXG4gXG5cbiAgICBjaGVja2luTG9jYXRpb24oKSB7XG4gICAgICAgIHRoaXMuQ3VycmVudExvY2F0aW9uID0gIHRoaXMuZ2V0bG9jYXRpb24oKTsgICAgICAgIFxuICAgICAgXG4gICAgfVxuXG4gICAgLy9NYXAgZXZlbnRzXG4gICAgb25NYXBSZWFkeShldmVudCkge1xuICAgICAgICBjb25zb2xlLmxvZygnTWFwIFJlYWR5Jyk7XG5cbiAgICAgICAgdGhpcy5tYXBWaWV3ID0gZXZlbnQub2JqZWN0O1xuXG4gICAgICAgIGNvbnNvbGUubG9nKFwiU2V0dGluZyBhIG1hcmtlci4uLlwiKTtcblxuICAgICAgICB2YXIgbWFya2VyID0gbmV3IE1hcmtlcigpO1xuICAgICAgICBtYXJrZXIucG9zaXRpb24gPSBQb3NpdGlvbi5wb3NpdGlvbkZyb21MYXRMbmcoMjUuNzczMzM4LCAtODAuMTkwMDcyKTtcbiAgICAgICAgbWFya2VyLnRpdGxlID0gXCJNaWFtaVwiO1xuICAgICAgICBtYXJrZXIuc25pcHBldCA9IFwiVXNhXCI7XG4gICAgICAgIG1hcmtlci51c2VyRGF0YSA9IHsgaW5kZXg6IDEgfTtcbiAgICAgICAgdGhpcy5tYXBWaWV3LmFkZE1hcmtlcihtYXJrZXIpO1xuICAgIH1cblxuICAgIG9uQ29vcmRpbmF0ZVRhcHBlZChhcmdzKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiQ29vcmRpbmF0ZSBUYXBwZWQsIExhdDogXCIgKyBhcmdzLnBvc2l0aW9uLmxhdGl0dWRlICsgXCIsIExvbjogXCIgKyBhcmdzLnBvc2l0aW9uLmxvbmdpdHVkZSwgYXJncyk7XG4gICAgfVxuXG4gICAgb25NYXJrZXJFdmVudChhcmdzKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiTWFya2VyIEV2ZW50OiAnXCIgKyBhcmdzLmV2ZW50TmFtZVxuICAgICAgICAgICAgKyBcIicgdHJpZ2dlcmVkIG9uOiBcIiArIGFyZ3MubWFya2VyLnRpdGxlXG4gICAgICAgICAgICArIFwiLCBMYXQ6IFwiICsgYXJncy5tYXJrZXIucG9zaXRpb24ubGF0aXR1ZGUgKyBcIiwgTG9uOiBcIiArIGFyZ3MubWFya2VyLnBvc2l0aW9uLmxvbmdpdHVkZSwgYXJncyk7XG4gICAgfVxuXG4gICAgb25DYW1lcmFDaGFuZ2VkKGFyZ3MpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJDYW1lcmEgY2hhbmdlZDogXCIgKyBKU09OLnN0cmluZ2lmeShhcmdzLmNhbWVyYSksIEpTT04uc3RyaW5naWZ5KGFyZ3MuY2FtZXJhKSA9PT0gdGhpcy5sYXN0Q2FtZXJhKTtcbiAgICAgICAgdGhpcy5sYXN0Q2FtZXJhID0gSlNPTi5zdHJpbmdpZnkoYXJncy5jYW1lcmEpO1xuICAgIH1cblxuXG4gICAgZ2V0bG9jYXRpb24oKTphbnl7XG4gICAgICAgIGdldEN1cnJlbnRMb2NhdGlvbih7IGRlc2lyZWRBY2N1cmFjeTogMywgdXBkYXRlRGlzdGFuY2U6IDEwLCBtYXhpbXVtQWdlOiAyMDAwMCwgdGltZW91dDogMjAwMDAgfSkuXG4gICAgICAgIHRoZW4obG9jID0+IHtcbiAgICAgICAgICAgIGlmIChsb2MpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkN1cnJlbnQgbG9jYXRpb24gaXM6IFwiKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmRpcihsb2MpO1xuICAgICAgICAgICAgICAgIHRoaXMuYXBwb2ludG1lbnRTZXJ2aWNlLnNldEdlb0xvY2F0aW9uKGxvYywgdGhpcy5hcHBvaW50bWVudCkuc3Vic2NyaWJlKHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XG4gICAgICAgICAgICAgICAgICAgIDtcbiAgICAgICAgICAgICAgICB9LCBlcnIgPT57XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy8gICByZXR1cm4gbG9jO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCAoZSkgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJFcnJvcjogXCIgKyBlLm1lc3NhZ2UpOyAgICAgICAgICAgIFxuICAgICAgICB9KTtcbiAgICB9IFxuXG59XG4iXX0=