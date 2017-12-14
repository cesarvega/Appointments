"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var appointment_service_1 = require("./appointment.service");
var Toast = require("nativescript-toast");
var nativescript_google_maps_sdk_1 = require("nativescript-google-maps-sdk");
var camera = require("nativescript-camera");
var element_registry_1 = require("nativescript-angular/element-registry");
var elementRegistryModule = require("nativescript-angular/element-registry");
elementRegistryModule.registerElement("CardView", function () { return require("nativescript-cardview").CardView; });
var nativescript_geolocation_1 = require("nativescript-geolocation");
element_registry_1.registerElement('MapView', function () { return require("nativescript-google-maps-sdk").MapView; });
var image_source_1 = require("tns-core-modules/image-source/image-source");
var AppointmentDetailComponent = (function () {
    function AppointmentDetailComponent(appointmentService, route) {
        this.appointmentService = appointmentService;
        this.route = route;
        this.latitude = 25.769490;
        this.longitude = -80.195224;
        this.latitude2 = 25.769859;
        this.longitude2 = -80.19230;
        // private latitude2 = 25.774394;
        // private longitude2 = -80.141852;
        this.zoom = 16;
        this.bearing = 0;
        this.tilt = 0;
        this.padding = [40, 40, 40, 40];
        this.amount = '';
        this.expenseType = '';
        this.appointment = JSON.parse(this.route.snapshot.params["appointment"]);
        camera.requestPermissions();
    }
    AppointmentDetailComponent.prototype.ngOnInit = function () {
    };
    AppointmentDetailComponent.prototype.showToast = function (message) {
        Toast.makeText(message, "long").show();
    };
    AppointmentDetailComponent.prototype.addExpense = function () {
        var _this = this;
        var options = { width: 150, height: 150, keepAspectRatio: true, saveToGallery: false };
        this.imagebase = '';
        this.image = '';
        camera.takePicture(options)
            .then(function (imageAsset) {
            image_source_1.fromAsset(imageAsset).then(function (res) {
                _this.imagebase = res.toBase64String("jpg");
                _this.image = "data:image/png;base64," + _this.imagebase;
                _this.imagebase = _this.imagebase.replace(/\+/g, '-');
            });
        }).catch(function (err) {
            console.log("Error -> " + err.message);
            _this.showToast('Something went wrong please try again : ' + err.message);
        });
    };
    AppointmentDetailComponent.prototype.saveExpense = function () {
        var _this = this;
        this.appointmentService.saveExpense(this.appointment, this.imagebase, this.expenseType, this.amount).catch(function (err) {
            console.dir(err);
            return err; // observable needs to be returned or exception raised
        }).subscribe(function (res) {
            _this.imagebase = null;
            _this.showToast('The Expense was sucessfully add it');
            console.dir(res);
        }), function (err) {
            console.log("error: " + err.message);
            _this.showToast('Something went wrong please try again : ' + err.message);
            console.dir(err);
        };
    };
    AppointmentDetailComponent.prototype.checkinLocation = function () {
        var _this = this;
        nativescript_geolocation_1.getCurrentLocation({ desiredAccuracy: 3, updateDistance: 1, maximumAge: 20000, timeout: 20000 }).
            then(function (loc) {
            if (loc) {
                var marker = new nativescript_google_maps_sdk_1.Marker();
                // var appointmentPosition = Position.positionFromLatLng(25.773694, -80.285451);
                var appointmentPosition = nativescript_google_maps_sdk_1.Position.positionFromLatLng(_this.latitude, _this.longitude);
                _this.latitude = loc.latitude;
                _this.longitude = loc.longitude;
                // marker.position = Position.positionFromLatLng(43.362684, -71.103530);
                marker.position = nativescript_google_maps_sdk_1.Position.positionFromLatLng(loc.latitude, loc.longitude);
                var distance = _this.calculatDistanceBetweenpoints(marker.position, appointmentPosition);
                marker.title = "Current Position";
                marker.snippet = "Usa";
                marker.userData = { index: 1 };
                marker.color = 'green';
                _this.zoom = _this.zoomDistance(distance);
                // this.zoom = 13;
                if (distance < 804.672) {
                    _this.appointmentService.setGeoLocation(marker.position, _this.appointment).subscribe(function (res) {
                        // this.appointmentService.setGeoLocation(loc, this.appointment).subscribe(res => {
                        _this.mapView.addMarker(marker);
                        _this.showToast('Your location has been chekin');
                    }, function (err) {
                        console.log(err);
                    });
                }
                else {
                    marker.title = "Far from appointment location";
                    marker.snippet = "Usa";
                    marker.userData = { index: 1 };
                    marker.color = 'yellow';
                    _this.mapView.addMarker(marker);
                    // this.zoom = 13;
                    _this.showToast('Your are too far from check in location address');
                }
            }
        }, function (e) {
            console.log("Error: " + e.message);
        });
    };
    AppointmentDetailComponent.prototype.onMapReady = function (event) {
        var _this = this;
        this.mapView = event.object;
        this.mapView.settings.zoomGesturesEnabled = true;
        this.mapView.settings.compassEnabled = true;
        this.mapView.settings.indoorLevelPickerEnabled = true;
        this.mapView.settings.mapToolbarEnabled = true;
        this.mapView.settings.myLocationButtonEnabled = true;
        this.mapView.settings.rotateGesturesEnabled = true;
        this.mapView.settings.scrollGesturesEnabled = true;
        this.mapView.settings.tiltGesturesEnabled = true;
        this.mapView.settings.zoomControlsEnabled = true;
        var address = this.appointment.cliAddress1 + ' ' + this.appointment.cliCity + ' ' + this.appointment.cliState + ' ' + this.appointment.cliZip;
        this.appointmentService.getAppointmentLocation(address).subscribe(function (res) {
            var marker = new nativescript_google_maps_sdk_1.Marker();
            _this.latitude = res.results[0].geometry.location.lat;
            _this.longitude = res.results[0].geometry.location.lng;
            // this.latitude = 25.854050;            
            // this.longitude = -80.233266;
            marker.position = nativescript_google_maps_sdk_1.Position.positionFromLatLng(_this.latitude, _this.longitude);
            // console.dir(marker.position);
            marker.title = res.results[0].formatted_address;
            marker.snippet = "";
            marker.color = 'blue';
            marker.userData = { index: 1 };
            _this.zoom = 10;
            // var marker2 = new Marker();
            // marker2.position = Position.positionFromLatLng(43.362684, -71.103530);
            // marker2.title = "Custom";
            // // marker2.icon = 'https://chart.apis.google.com/chart?chst=d_map_pin_icon&chld=bus|FFFF00';
            // marker2.snippet = "customized";
            // // marker2.color= 'red'
            // marker2.userData = { index: 1 };
            // this.mapView.addMarker(marker, marker2);
            _this.mapView.addMarker(marker);
        });
        // this.appointmentService.loopGetAppiontments().catch(err =>  { 
        //     console.dir(err);            
        //     return err; // observable needs to be returned or exception raised
        //  }).subscribe(res => {
        //     console.dir("appointmentsloop : "+res);
        // })
        this.appointmentService.getExpensesByAppointmentId(this.appointment.AppId.toString()).subscribe(function (res) {
            _this.expenses = res;
        });
    };
    AppointmentDetailComponent.prototype.onCoordinateTapped = function (args) {
        // console.log("Coordinate Tapped, Lat: " + args.position.latitude + ", Lon: " + args.position.longitude, args);
    };
    AppointmentDetailComponent.prototype.onMarkerEvent = function (args) {
        // console.log("Marker Event: '" + args.eventName
        //     + "' triggered on: " + args.marker.title
        //     + ", Lat: " + args.marker.position.latitude + ", Lon: " + args.marker.position.longitude, args);
    };
    AppointmentDetailComponent.prototype.onCameraChanged = function (args) {
        // console.log("Camera changed: " + JSON.stringify(args.camera), JSON.stringify(args.camera) === this.lastCamera);
        // this.lastCamera = JSON.stringify(args.camera);
    };
    AppointmentDetailComponent.prototype.calculatDistanceBetweenpoints = function (p1, p2) {
        var rad = function (x) {
            return x * Math.PI / 180;
        };
        var R = 6378137; // Earth’s mean radius in meter
        var dLat = rad(p2.latitude - p1.latitude);
        var dLong = rad(p2.longitude - p1.longitude);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(rad(p1.latitude)) * Math.cos(rad(p2.latitude)) *
                Math.sin(dLong / 2) * Math.sin(dLong / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return d; // returns the distance in meter          
    };
    AppointmentDetailComponent.prototype.zoomDistance = function (distance) {
        var zoom = 13;
        var factor = 5;
        switch (true) {
            case (distance < 1128.497220):
                zoom = 20 - factor;
                break;
            case (distance < 2256.994440):
                zoom = 19 - factor;
                break;
            case (distance < 4513.988880):
                zoom = 18 - factor;
                break;
            case (distance < 9027.977761):
                zoom = 17 - factor;
                break;
            case (distance < 18055.955520):
                zoom = 16 - factor;
                break;
            case (distance < 36111.911040):
                zoom = 15 - factor;
                break;
            case (distance < 72223.822090):
                zoom = 14 - factor;
                break;
            case (distance < 144447.644200):
                zoom = 13 - factor;
                break;
            case (distance < 288895.288400):
                zoom = 12 - factor;
                break;
            case (distance < 577790.576700):
                zoom = 11 - factor;
                break;
            case (distance < 1155581.153000):
                zoom = 10 - factor;
                break;
            case (distance < 2311162.307000):
                zoom = 9 - factor;
                break;
            case (distance < 4622324.614000):
                zoom = 8 - factor;
                break;
            case (distance < 9244649.227000):
                zoom = 7 - factor;
                break;
            case (distance < 18489298.450000):
                zoom = 6 - factor;
                break;
            case (distance < 36978596.910000):
                zoom = 5;
                break;
            case (distance < 73957193.820000):
                zoom = 4;
                break;
            case (distance < 147914387.600000):
                zoom = 3;
                break;
            case (distance < 295828775.300000):
                zoom = 2;
                break;
            case (distance < 591657550.500000):
                zoom = 1;
                break;
            default:
                break;
        }
        return zoom;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwb2ludG1lbnQtZGV0YWlsLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwcG9pbnRtZW50LWRldGFpbC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBNkQ7QUFDN0QsMENBQWlEO0FBQ2pELDZEQUEyRDtBQUUzRCwwQ0FBNEM7QUFFNUMsNkVBQXlFO0FBQ3pFLDRDQUE4QztBQUM5QywwRUFBd0U7QUFDeEUsNkVBQStFO0FBQy9FLHFCQUFxQixDQUFDLGVBQWUsQ0FBQyxVQUFVLEVBQUUsY0FBTSxPQUFBLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLFFBQVEsRUFBekMsQ0FBeUMsQ0FBQyxDQUFDO0FBQ25HLHFFQUFxSTtBQUVySSxrQ0FBZSxDQUFDLFNBQVMsRUFBRSxjQUFNLE9BQUEsT0FBTyxDQUFDLDhCQUE4QixDQUFDLENBQUMsT0FBTyxFQUEvQyxDQUErQyxDQUFDLENBQUM7QUFDbEYsMkVBQWlGO0FBZWpGO0lBd0JJLG9DQUNZLGtCQUFzQyxFQUN0QyxLQUFxQjtRQURyQix1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW9CO1FBQ3RDLFVBQUssR0FBTCxLQUFLLENBQWdCO1FBdkJ6QixhQUFRLEdBQUcsU0FBUyxDQUFDO1FBQ3JCLGNBQVMsR0FBRyxDQUFDLFNBQVMsQ0FBQztRQUN2QixjQUFTLEdBQUcsU0FBUyxDQUFDO1FBQ3RCLGVBQVUsR0FBRyxDQUFDLFFBQVEsQ0FBQztRQUMvQixpQ0FBaUM7UUFDakMsbUNBQW1DO1FBQzNCLFNBQUksR0FBRyxFQUFFLENBQUM7UUFDVixZQUFPLEdBQUcsQ0FBQyxDQUFDO1FBQ1osU0FBSSxHQUFHLENBQUMsQ0FBQztRQUVULFlBQU8sR0FBRyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRzNCLFdBQU0sR0FBUSxFQUFFLENBQUM7UUFDakIsZ0JBQVcsR0FBUSxFQUFFLENBQUM7UUFVMUIs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QUFJLEdBQUcsQ0FBQyxDQUFFO2dCQUNWLEtBQUssQ0FBQztZQUVWO2dCQUNJLEtBQUssQ0FBQztRQUNkLENBQUM7UUFFRCxNQUFNLENBQUMsSUFBSSxDQUFBO0lBQ2YsQ0FBQztJQXhSUSwwQkFBMEI7UUFOdEMsZ0JBQVMsQ0FBQztZQUNQLFFBQVEsRUFBRSxZQUFZO1lBQ3RCLFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtZQUNuQixXQUFXLEVBQUUscUNBQXFDO1lBQ2xELFNBQVMsRUFBRSxDQUFDLDBCQUEwQixDQUFDO1NBQzFDLENBQUM7eUNBMEJrQyx3Q0FBa0I7WUFDL0IsdUJBQWM7T0ExQnhCLDBCQUEwQixDQTBSdEM7SUFBRCxpQ0FBQztDQUFBLEFBMVJELElBMFJDO0FBMVJZLGdFQUEwQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBWaWV3Q2hpbGQgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgQWN0aXZhdGVkUm91dGUgfSBmcm9tIFwiQGFuZ3VsYXIvcm91dGVyXCI7XG5pbXBvcnQgeyBBcHBvaW50bWVudFNlcnZpY2UgfSBmcm9tIFwiLi9hcHBvaW50bWVudC5zZXJ2aWNlXCI7XG5pbXBvcnQgeyBBcHBvaW50bWVudCB9IGZyb20gXCIuL2FwcG9pbnRtZW50Lm1vZGVsXCI7XG5pbXBvcnQgKiBhcyBUb2FzdCBmcm9tIFwibmF0aXZlc2NyaXB0LXRvYXN0XCI7XG5pbXBvcnQgeyBUZWxlcGhvbnkgfSBmcm9tICduYXRpdmVzY3JpcHQtdGVsZXBob255JztcbmltcG9ydCB7IE1hcFZpZXcsIE1hcmtlciwgUG9zaXRpb24gfSBmcm9tICduYXRpdmVzY3JpcHQtZ29vZ2xlLW1hcHMtc2RrJztcbmltcG9ydCAqIGFzIGNhbWVyYSBmcm9tIFwibmF0aXZlc2NyaXB0LWNhbWVyYVwiO1xuaW1wb3J0IHsgcmVnaXN0ZXJFbGVtZW50IH0gZnJvbSAnbmF0aXZlc2NyaXB0LWFuZ3VsYXIvZWxlbWVudC1yZWdpc3RyeSc7XG5pbXBvcnQgKiBhcyBlbGVtZW50UmVnaXN0cnlNb2R1bGUgZnJvbSAnbmF0aXZlc2NyaXB0LWFuZ3VsYXIvZWxlbWVudC1yZWdpc3RyeSc7XG5lbGVtZW50UmVnaXN0cnlNb2R1bGUucmVnaXN0ZXJFbGVtZW50KFwiQ2FyZFZpZXdcIiwgKCkgPT4gcmVxdWlyZShcIm5hdGl2ZXNjcmlwdC1jYXJkdmlld1wiKS5DYXJkVmlldyk7XG5pbXBvcnQgeyBpc0VuYWJsZWQsIGVuYWJsZUxvY2F0aW9uUmVxdWVzdCwgZ2V0Q3VycmVudExvY2F0aW9uLCB3YXRjaExvY2F0aW9uLCBkaXN0YW5jZSwgY2xlYXJXYXRjaCB9IGZyb20gXCJuYXRpdmVzY3JpcHQtZ2VvbG9jYXRpb25cIjtcbmltcG9ydCB7IHJlc2V0Q1NTUHJvcGVydGllcyB9IGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL3VpL2ZyYW1lL2ZyYW1lXCI7XG5yZWdpc3RlckVsZW1lbnQoJ01hcFZpZXcnLCAoKSA9PiByZXF1aXJlKFwibmF0aXZlc2NyaXB0LWdvb2dsZS1tYXBzLXNka1wiKS5NYXBWaWV3KTtcbmltcG9ydCB7IGZyb21Bc3NldCwgZnJvbURhdGEgfSBmcm9tIFwidG5zLWNvcmUtbW9kdWxlcy9pbWFnZS1zb3VyY2UvaW1hZ2Utc291cmNlXCI7XG5pbXBvcnQgeyBMb29wQXBwb2ludG1lbnQgfSBmcm9tIFwiLi9sb29wL2xvb3AtYXBwb2ludG1lbnQubW9kZWxcIjtcbi8vIGltcG9ydCB7IGFuZHJvaWQgfSBmcm9tIFwidG5zLWNvcmUtbW9kdWxlcy9hcHBsaWNhdGlvbi9hcHBsaWNhdGlvblwiO1xuLy8gZGVjbGFyZSB2YXIgQml0bWFwRmFjdG9yeTogYW55XG5kZWNsYXJlIHZhciBhbmRyb2lkO1xuZGVjbGFyZSB2YXIgamF2YTtcbmRlY2xhcmUgdmFyIGJ5dGU7XG5kZWNsYXJlIHZhciBCeXRlQXJyYXlPdXRwdXRTdHJlYW07XG5kZWNsYXJlIHZhciBCaXRtYXA7XG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogXCJucy1kZXRhaWxzXCIsXG4gICAgbW9kdWxlSWQ6IG1vZHVsZS5pZCxcbiAgICB0ZW1wbGF0ZVVybDogXCIuL2FwcG9pbnRtZW50LWRldGFpbC5jb21wb25lbnQuaHRtbFwiLFxuICAgIHN0eWxlVXJsczogWycuL2FwcG9pbnRtZW50LWRldGFpbC5jc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBBcHBvaW50bWVudERldGFpbENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gICAgcHJpdmF0ZSBhcHBvaW50bWVudDogQXBwb2ludG1lbnQ7XG4gICAgcHJpdmF0ZSBleHBlbnNlczogQXJyYXk8b2JqZWN0PjtcbiAgICBwcml2YXRlIGxhdGl0dWRlID0gMjUuNzY5NDkwO1xuICAgIHByaXZhdGUgbG9uZ2l0dWRlID0gLTgwLjE5NTIyNDtcbiAgICBwcml2YXRlIGxhdGl0dWRlMiA9IDI1Ljc2OTg1OTtcbiAgICBwcml2YXRlIGxvbmdpdHVkZTIgPSAtODAuMTkyMzA7XG4gICAgLy8gcHJpdmF0ZSBsYXRpdHVkZTIgPSAyNS43NzQzOTQ7XG4gICAgLy8gcHJpdmF0ZSBsb25naXR1ZGUyID0gLTgwLjE0MTg1MjtcbiAgICBwcml2YXRlIHpvb20gPSAxNjtcbiAgICBwcml2YXRlIGJlYXJpbmcgPSAwO1xuICAgIHByaXZhdGUgdGlsdCA9IDA7XG4gICAgcHJpdmF0ZSBDdXJyZW50TG9jYXRpb247XG4gICAgcHJpdmF0ZSBwYWRkaW5nID0gWzQwLCA0MCwgNDAsIDQwXTtcbiAgICBwcml2YXRlIG1hcFZpZXc6IE1hcFZpZXc7XG4gICAgcHJpdmF0ZSBwaG9uZU51bWJlcjogYW55O1xuICAgIHByaXZhdGUgYW1vdW50OiBhbnkgPSAnJztcbiAgICBwcml2YXRlIGV4cGVuc2VUeXBlOiBhbnkgPSAnJztcbiAgICBwcml2YXRlIGltYWdlOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBpbWFnZWJhc2U6IHN0cmluZztcbiAgICAvLyBwcml2YXRlIGltYWdlOiBhbnkgPSBcImh0dHBzOi8vcGxheS5uYXRpdmVzY3JpcHQub3JnL2Rpc3QvYXNzZXRzL2ltZy9OYXRpdmVTY3JpcHRfbG9nby5wbmdcIjtcblxuICAgIGxhc3RDYW1lcmE6IFN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcml2YXRlIGFwcG9pbnRtZW50U2VydmljZTogQXBwb2ludG1lbnRTZXJ2aWNlLFxuICAgICAgICBwcml2YXRlIHJvdXRlOiBBY3RpdmF0ZWRSb3V0ZSkge1xuICAgICAgICB0aGlzLmFwcG9pbnRtZW50ID0gPEFwcG9pbnRtZW50PkpTT04ucGFyc2UodGhpcy5yb3V0ZS5zbmFwc2hvdC5wYXJhbXNbXCJhcHBvaW50bWVudFwiXSk7XG4gICAgICAgIGNhbWVyYS5yZXF1ZXN0UGVybWlzc2lvbnMoKTtcbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpOiB2b2lkIHtcblxuICAgIH1cblxuICAgIHNob3dUb2FzdChtZXNzYWdlOiBzdHJpbmcpIHtcbiAgICAgICAgVG9hc3QubWFrZVRleHQobWVzc2FnZSwgXCJsb25nXCIpLnNob3coKTtcbiAgICB9XG5cbiAgICBhZGRFeHBlbnNlKCkge1xuICAgICAgICB2YXIgb3B0aW9ucyA9IHsgd2lkdGg6IDE1MCwgaGVpZ2h0OiAxNTAsIGtlZXBBc3BlY3RSYXRpbzogdHJ1ZSwgc2F2ZVRvR2FsbGVyeTogZmFsc2UgfTtcbiAgICAgICAgdGhpcy5pbWFnZWJhc2UgPSAnJztcbiAgICAgICAgdGhpcy5pbWFnZSA9ICcnO1xuICAgICAgICBjYW1lcmEudGFrZVBpY3R1cmUob3B0aW9ucylcbiAgICAgICAgICAgIC50aGVuKChpbWFnZUFzc2V0OiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICBmcm9tQXNzZXQoaW1hZ2VBc3NldCkudGhlbihyZXMgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmltYWdlYmFzZSA9IHJlcy50b0Jhc2U2NFN0cmluZyhcImpwZ1wiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbWFnZSA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LFwiICsgdGhpcy5pbWFnZWJhc2U7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW1hZ2ViYXNlID0gdGhpcy5pbWFnZWJhc2UucmVwbGFjZSgvXFwrL2csICctJyk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yIC0+IFwiICsgZXJyLm1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2hvd1RvYXN0KCdTb21ldGhpbmcgd2VudCB3cm9uZyBwbGVhc2UgdHJ5IGFnYWluIDogJyArIGVyci5tZXNzYWdlKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIHNhdmVFeHBlbnNlKCkge1xuICAgICAgICB0aGlzLmFwcG9pbnRtZW50U2VydmljZS5zYXZlRXhwZW5zZSh0aGlzLmFwcG9pbnRtZW50LCB0aGlzLmltYWdlYmFzZSwgdGhpcy5leHBlbnNlVHlwZSwgdGhpcy5hbW91bnQpLmNhdGNoKGVyciA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmRpcihlcnIpO1xuICAgICAgICAgICAgcmV0dXJuIGVycjsgLy8gb2JzZXJ2YWJsZSBuZWVkcyB0byBiZSByZXR1cm5lZCBvciBleGNlcHRpb24gcmFpc2VkXG4gICAgICAgIH0pLnN1YnNjcmliZShyZXMgPT4ge1xuICAgICAgICAgICAgdGhpcy5pbWFnZWJhc2UgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5zaG93VG9hc3QoJ1RoZSBFeHBlbnNlIHdhcyBzdWNlc3NmdWxseSBhZGQgaXQnKTtcbiAgICAgICAgICAgIGNvbnNvbGUuZGlyKHJlcyk7XG4gICAgICAgIH0pLCBlcnIgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvcjogXCIgKyBlcnIubWVzc2FnZSk7XG4gICAgICAgICAgICB0aGlzLnNob3dUb2FzdCgnU29tZXRoaW5nIHdlbnQgd3JvbmcgcGxlYXNlIHRyeSBhZ2FpbiA6ICcgKyBlcnIubWVzc2FnZSk7XG4gICAgICAgICAgICBjb25zb2xlLmRpcihlcnIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2hlY2tpbkxvY2F0aW9uKCk6IGFueSB7XG4gICAgICAgIGdldEN1cnJlbnRMb2NhdGlvbih7IGRlc2lyZWRBY2N1cmFjeTogMywgdXBkYXRlRGlzdGFuY2U6IDEsIG1heGltdW1BZ2U6IDIwMDAwLCB0aW1lb3V0OiAyMDAwMCB9KS5cbiAgICAgICAgICAgIHRoZW4obG9jID0+IHtcbiAgICAgICAgICAgICAgICBpZiAobG9jKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBtYXJrZXIgPSBuZXcgTWFya2VyKCk7XG4gICAgICAgICAgICAgICAgICAgIC8vIHZhciBhcHBvaW50bWVudFBvc2l0aW9uID0gUG9zaXRpb24ucG9zaXRpb25Gcm9tTGF0TG5nKDI1Ljc3MzY5NCwgLTgwLjI4NTQ1MSk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhcHBvaW50bWVudFBvc2l0aW9uID0gUG9zaXRpb24ucG9zaXRpb25Gcm9tTGF0TG5nKHRoaXMubGF0aXR1ZGUsIHRoaXMubG9uZ2l0dWRlKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sYXRpdHVkZSA9IGxvYy5sYXRpdHVkZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb25naXR1ZGUgPSBsb2MubG9uZ2l0dWRlO1xuICAgICAgICAgICAgICAgICAgICAvLyBtYXJrZXIucG9zaXRpb24gPSBQb3NpdGlvbi5wb3NpdGlvbkZyb21MYXRMbmcoNDMuMzYyNjg0LCAtNzEuMTAzNTMwKTtcbiAgICAgICAgICAgICAgICAgICAgbWFya2VyLnBvc2l0aW9uID0gUG9zaXRpb24ucG9zaXRpb25Gcm9tTGF0TG5nKGxvYy5sYXRpdHVkZSwgbG9jLmxvbmdpdHVkZSk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBkaXN0YW5jZSA9IHRoaXMuY2FsY3VsYXREaXN0YW5jZUJldHdlZW5wb2ludHMobWFya2VyLnBvc2l0aW9uLCBhcHBvaW50bWVudFBvc2l0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgbWFya2VyLnRpdGxlID0gXCJDdXJyZW50IFBvc2l0aW9uXCI7XG4gICAgICAgICAgICAgICAgICAgIG1hcmtlci5zbmlwcGV0ID0gXCJVc2FcIjtcbiAgICAgICAgICAgICAgICAgICAgbWFya2VyLnVzZXJEYXRhID0geyBpbmRleDogMSB9O1xuICAgICAgICAgICAgICAgICAgICBtYXJrZXIuY29sb3IgPSAnZ3JlZW4nO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuem9vbSA9IHRoaXMuem9vbURpc3RhbmNlKGRpc3RhbmNlKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLnpvb20gPSAxMztcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRpc3RhbmNlIDwgODA0LjY3Mikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hcHBvaW50bWVudFNlcnZpY2Uuc2V0R2VvTG9jYXRpb24obWFya2VyLnBvc2l0aW9uLCB0aGlzLmFwcG9pbnRtZW50KS5zdWJzY3JpYmUocmVzID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLmFwcG9pbnRtZW50U2VydmljZS5zZXRHZW9Mb2NhdGlvbihsb2MsIHRoaXMuYXBwb2ludG1lbnQpLnN1YnNjcmliZShyZXMgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubWFwVmlldy5hZGRNYXJrZXIobWFya2VyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNob3dUb2FzdCgnWW91ciBsb2NhdGlvbiBoYXMgYmVlbiBjaGVraW4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIGVyciA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWFya2VyLnRpdGxlID0gXCJGYXIgZnJvbSBhcHBvaW50bWVudCBsb2NhdGlvblwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgbWFya2VyLnNuaXBwZXQgPSBcIlVzYVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgbWFya2VyLnVzZXJEYXRhID0geyBpbmRleDogMSB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgbWFya2VyLmNvbG9yID0gJ3llbGxvdyc7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1hcFZpZXcuYWRkTWFya2VyKG1hcmtlcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLnpvb20gPSAxMztcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2hvd1RvYXN0KCdZb3VyIGFyZSB0b28gZmFyIGZyb20gY2hlY2sgaW4gbG9jYXRpb24gYWRkcmVzcycpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgKGUpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yOiBcIiArIGUubWVzc2FnZSk7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBvbk1hcFJlYWR5KGV2ZW50KSB7XG4gICAgICAgIHRoaXMubWFwVmlldyA9IGV2ZW50Lm9iamVjdDtcblxuICAgICAgICB0aGlzLm1hcFZpZXcuc2V0dGluZ3Muem9vbUdlc3R1cmVzRW5hYmxlZCA9IHRydWU7XG5cbiAgICAgICAgdGhpcy5tYXBWaWV3LnNldHRpbmdzLmNvbXBhc3NFbmFibGVkID0gdHJ1ZTtcblxuICAgICAgICB0aGlzLm1hcFZpZXcuc2V0dGluZ3MuaW5kb29yTGV2ZWxQaWNrZXJFbmFibGVkID0gdHJ1ZTtcblxuICAgICAgICB0aGlzLm1hcFZpZXcuc2V0dGluZ3MubWFwVG9vbGJhckVuYWJsZWQgPSB0cnVlO1xuXG4gICAgICAgIHRoaXMubWFwVmlldy5zZXR0aW5ncy5teUxvY2F0aW9uQnV0dG9uRW5hYmxlZCA9IHRydWU7XG5cbiAgICAgICAgdGhpcy5tYXBWaWV3LnNldHRpbmdzLnJvdGF0ZUdlc3R1cmVzRW5hYmxlZCA9IHRydWU7XG5cbiAgICAgICAgdGhpcy5tYXBWaWV3LnNldHRpbmdzLnNjcm9sbEdlc3R1cmVzRW5hYmxlZCA9IHRydWU7XG5cbiAgICAgICAgdGhpcy5tYXBWaWV3LnNldHRpbmdzLnRpbHRHZXN0dXJlc0VuYWJsZWQgPSB0cnVlO1xuXG4gICAgICAgIHRoaXMubWFwVmlldy5zZXR0aW5ncy56b29tQ29udHJvbHNFbmFibGVkID0gdHJ1ZTtcblxuICAgICAgICBsZXQgYWRkcmVzcyA9IHRoaXMuYXBwb2ludG1lbnQuY2xpQWRkcmVzczEgKyAnICcgKyB0aGlzLmFwcG9pbnRtZW50LmNsaUNpdHkgKyAnICcgKyB0aGlzLmFwcG9pbnRtZW50LmNsaVN0YXRlICsgJyAnICsgdGhpcy5hcHBvaW50bWVudC5jbGlaaXA7XG4gICAgICAgIHRoaXMuYXBwb2ludG1lbnRTZXJ2aWNlLmdldEFwcG9pbnRtZW50TG9jYXRpb24oYWRkcmVzcykuc3Vic2NyaWJlKChyZXM6IGFueSkgPT4ge1xuICAgICAgICAgICAgdmFyIG1hcmtlciA9IG5ldyBNYXJrZXIoKTtcbiAgICAgICAgICAgIHRoaXMubGF0aXR1ZGUgPSByZXMucmVzdWx0c1swXS5nZW9tZXRyeS5sb2NhdGlvbi5sYXQ7XG4gICAgICAgICAgICB0aGlzLmxvbmdpdHVkZSA9IHJlcy5yZXN1bHRzWzBdLmdlb21ldHJ5LmxvY2F0aW9uLmxuZztcbiAgICAgICAgICAgIC8vIHRoaXMubGF0aXR1ZGUgPSAyNS44NTQwNTA7ICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyB0aGlzLmxvbmdpdHVkZSA9IC04MC4yMzMyNjY7XG4gICAgICAgICAgICBtYXJrZXIucG9zaXRpb24gPSBQb3NpdGlvbi5wb3NpdGlvbkZyb21MYXRMbmcodGhpcy5sYXRpdHVkZSwgdGhpcy5sb25naXR1ZGUpO1xuXG4gICAgICAgICAgICAvLyBjb25zb2xlLmRpcihtYXJrZXIucG9zaXRpb24pO1xuXG4gICAgICAgICAgICBtYXJrZXIudGl0bGUgPSByZXMucmVzdWx0c1swXS5mb3JtYXR0ZWRfYWRkcmVzcztcbiAgICAgICAgICAgIG1hcmtlci5zbmlwcGV0ID0gXCJcIjtcblxuICAgICAgICAgICAgbWFya2VyLmNvbG9yID0gJ2JsdWUnXG4gICAgICAgICAgICBtYXJrZXIudXNlckRhdGEgPSB7IGluZGV4OiAxIH07XG5cbiAgICAgICAgICAgIHRoaXMuem9vbSA9IDEwO1xuXG4gICAgICAgICAgICAvLyB2YXIgbWFya2VyMiA9IG5ldyBNYXJrZXIoKTtcbiAgICAgICAgICAgIC8vIG1hcmtlcjIucG9zaXRpb24gPSBQb3NpdGlvbi5wb3NpdGlvbkZyb21MYXRMbmcoNDMuMzYyNjg0LCAtNzEuMTAzNTMwKTtcbiAgICAgICAgICAgIC8vIG1hcmtlcjIudGl0bGUgPSBcIkN1c3RvbVwiO1xuICAgICAgICAgICAgLy8gLy8gbWFya2VyMi5pY29uID0gJ2h0dHBzOi8vY2hhcnQuYXBpcy5nb29nbGUuY29tL2NoYXJ0P2Noc3Q9ZF9tYXBfcGluX2ljb24mY2hsZD1idXN8RkZGRjAwJztcbiAgICAgICAgICAgIC8vIG1hcmtlcjIuc25pcHBldCA9IFwiY3VzdG9taXplZFwiO1xuICAgICAgICAgICAgLy8gLy8gbWFya2VyMi5jb2xvcj0gJ3JlZCdcbiAgICAgICAgICAgIC8vIG1hcmtlcjIudXNlckRhdGEgPSB7IGluZGV4OiAxIH07XG4gICAgICAgICAgICAvLyB0aGlzLm1hcFZpZXcuYWRkTWFya2VyKG1hcmtlciwgbWFya2VyMik7XG4gICAgICAgICAgICB0aGlzLm1hcFZpZXcuYWRkTWFya2VyKG1hcmtlcik7XG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gdGhpcy5hcHBvaW50bWVudFNlcnZpY2UubG9vcEdldEFwcGlvbnRtZW50cygpLmNhdGNoKGVyciA9PiAgeyBcbiAgICAgICAgLy8gICAgIGNvbnNvbGUuZGlyKGVycik7ICAgICAgICAgICAgXG4gICAgICAgIC8vICAgICByZXR1cm4gZXJyOyAvLyBvYnNlcnZhYmxlIG5lZWRzIHRvIGJlIHJldHVybmVkIG9yIGV4Y2VwdGlvbiByYWlzZWRcbiAgICAgICAgLy8gIH0pLnN1YnNjcmliZShyZXMgPT4ge1xuICAgICAgICAvLyAgICAgY29uc29sZS5kaXIoXCJhcHBvaW50bWVudHNsb29wIDogXCIrcmVzKTtcblxuICAgICAgICAvLyB9KVxuXG4gICAgICAgIHRoaXMuYXBwb2ludG1lbnRTZXJ2aWNlLmdldEV4cGVuc2VzQnlBcHBvaW50bWVudElkKHRoaXMuYXBwb2ludG1lbnQuQXBwSWQudG9TdHJpbmcoKSkuc3Vic2NyaWJlKHJlcyA9PiB7XG4gICAgICAgICAgICB0aGlzLmV4cGVuc2VzID0gcmVzO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBvbkNvb3JkaW5hdGVUYXBwZWQoYXJncykge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkNvb3JkaW5hdGUgVGFwcGVkLCBMYXQ6IFwiICsgYXJncy5wb3NpdGlvbi5sYXRpdHVkZSArIFwiLCBMb246IFwiICsgYXJncy5wb3NpdGlvbi5sb25naXR1ZGUsIGFyZ3MpO1xuICAgIH1cblxuICAgIG9uTWFya2VyRXZlbnQoYXJncykge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIk1hcmtlciBFdmVudDogJ1wiICsgYXJncy5ldmVudE5hbWVcbiAgICAgICAgLy8gICAgICsgXCInIHRyaWdnZXJlZCBvbjogXCIgKyBhcmdzLm1hcmtlci50aXRsZVxuICAgICAgICAvLyAgICAgKyBcIiwgTGF0OiBcIiArIGFyZ3MubWFya2VyLnBvc2l0aW9uLmxhdGl0dWRlICsgXCIsIExvbjogXCIgKyBhcmdzLm1hcmtlci5wb3NpdGlvbi5sb25naXR1ZGUsIGFyZ3MpO1xuICAgIH1cblxuICAgIG9uQ2FtZXJhQ2hhbmdlZChhcmdzKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiQ2FtZXJhIGNoYW5nZWQ6IFwiICsgSlNPTi5zdHJpbmdpZnkoYXJncy5jYW1lcmEpLCBKU09OLnN0cmluZ2lmeShhcmdzLmNhbWVyYSkgPT09IHRoaXMubGFzdENhbWVyYSk7XG4gICAgICAgIC8vIHRoaXMubGFzdENhbWVyYSA9IEpTT04uc3RyaW5naWZ5KGFyZ3MuY2FtZXJhKTtcbiAgICB9XG5cbiAgICBjYWxjdWxhdERpc3RhbmNlQmV0d2VlbnBvaW50cyhwMSwgcDIpIHtcbiAgICAgICAgdmFyIHJhZCA9IGZ1bmN0aW9uICh4KSB7XG4gICAgICAgICAgICByZXR1cm4geCAqIE1hdGguUEkgLyAxODA7XG4gICAgICAgIH07XG4gICAgICAgIHZhciBSID0gNjM3ODEzNzsgLy8gRWFydGjigJlzIG1lYW4gcmFkaXVzIGluIG1ldGVyXG4gICAgICAgIHZhciBkTGF0ID0gcmFkKHAyLmxhdGl0dWRlIC0gcDEubGF0aXR1ZGUpO1xuICAgICAgICB2YXIgZExvbmcgPSByYWQocDIubG9uZ2l0dWRlIC0gcDEubG9uZ2l0dWRlKTtcbiAgICAgICAgdmFyIGEgPSBNYXRoLnNpbihkTGF0IC8gMikgKiBNYXRoLnNpbihkTGF0IC8gMikgK1xuICAgICAgICAgICAgTWF0aC5jb3MocmFkKHAxLmxhdGl0dWRlKSkgKiBNYXRoLmNvcyhyYWQocDIubGF0aXR1ZGUpKSAqXG4gICAgICAgICAgICBNYXRoLnNpbihkTG9uZyAvIDIpICogTWF0aC5zaW4oZExvbmcgLyAyKTtcbiAgICAgICAgdmFyIGMgPSAyICogTWF0aC5hdGFuMihNYXRoLnNxcnQoYSksIE1hdGguc3FydCgxIC0gYSkpO1xuICAgICAgICB2YXIgZCA9IFIgKiBjO1xuICAgICAgICByZXR1cm4gZDsgLy8gcmV0dXJucyB0aGUgZGlzdGFuY2UgaW4gbWV0ZXIgICAgICAgICAgXG4gICAgfVxuXG5cbiAgICB6b29tRGlzdGFuY2UoZGlzdGFuY2UpIHtcbiAgICAgICAgbGV0IHpvb20gPSAxMztcbiAgICAgICAgbGV0IGZhY3RvciA9IDU7XG4gICAgICAgIHN3aXRjaCAodHJ1ZSkge1xuXG4gICAgICAgICAgICBjYXNlICAoZGlzdGFuY2UgPCAxMTI4LjQ5NzIyMCkgOlxuICAgICAgICAgICAgICAgIHpvb20gPSAyMCAtICBmYWN0b3I7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICAoZGlzdGFuY2UgPCAyMjU2Ljk5NDQ0MCkgOlxuICAgICAgICAgICAgICAgIHpvb20gPSAxOSAtICBmYWN0b3I7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICAoZGlzdGFuY2UgPCA0NTEzLjk4ODg4MCkgOlxuICAgICAgICAgICAgICAgIHpvb20gPSAxOCAtICBmYWN0b3I7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICAoZGlzdGFuY2UgPCA5MDI3Ljk3Nzc2MSkgOlxuICAgICAgICAgICAgICAgIHpvb20gPSAxNyAtICBmYWN0b3I7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICAoZGlzdGFuY2UgPCAxODA1NS45NTU1MjApIDpcbiAgICAgICAgICAgICAgICB6b29tID0gMTYgLSAgZmFjdG9yO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAgKGRpc3RhbmNlIDwgMzYxMTEuOTExMDQwKSA6XG4gICAgICAgICAgICAgICAgem9vbSA9IDE1IC0gIGZhY3RvcjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgIChkaXN0YW5jZSA8IDcyMjIzLjgyMjA5MCkgOlxuICAgICAgICAgICAgICAgIHpvb20gPSAxNCAtICBmYWN0b3I7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICAoZGlzdGFuY2UgPCAxNDQ0NDcuNjQ0MjAwKSA6XG4gICAgICAgICAgICAgICAgem9vbSA9IDEzIC0gIGZhY3RvcjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgIChkaXN0YW5jZSA8IDI4ODg5NS4yODg0MDApIDpcbiAgICAgICAgICAgICAgICB6b29tID0gMTIgLSAgZmFjdG9yO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAgKGRpc3RhbmNlIDwgNTc3NzkwLjU3NjcwMCkgOlxuICAgICAgICAgICAgICAgIHpvb20gPSAxMSAtICBmYWN0b3I7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICAoZGlzdGFuY2UgPCAxMTU1NTgxLjE1MzAwMCkgOlxuICAgICAgICAgICAgICAgIHpvb20gPSAxMCAtICBmYWN0b3I7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICAoZGlzdGFuY2UgPCAyMzExMTYyLjMwNzAwMCkgOlxuICAgICAgICAgICAgICAgIHpvb20gPSA5IC0gIGZhY3RvcjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgIChkaXN0YW5jZSA8IDQ2MjIzMjQuNjE0MDAwKSA6XG4gICAgICAgICAgICAgICAgem9vbSA9IDggLSAgZmFjdG9yO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAgKGRpc3RhbmNlIDwgOTI0NDY0OS4yMjcwMDApIDpcbiAgICAgICAgICAgICAgICB6b29tID0gNyAtICBmYWN0b3I7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICAoZGlzdGFuY2UgPCAxODQ4OTI5OC40NTAwMDApIDpcbiAgICAgICAgICAgICAgICB6b29tID0gNiAtICBmYWN0b3I7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICAoZGlzdGFuY2UgPCAzNjk3ODU5Ni45MTAwMDApIDpcbiAgICAgICAgICAgICAgICB6b29tID0gNSA7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICAoZGlzdGFuY2UgPCA3Mzk1NzE5My44MjAwMDApIDpcbiAgICAgICAgICAgICAgICB6b29tID0gNCA7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICAoZGlzdGFuY2UgPCAxNDc5MTQzODcuNjAwMDAwKSA6XG4gICAgICAgICAgICAgICAgem9vbSA9IDMgO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAgKGRpc3RhbmNlIDwgMjk1ODI4Nzc1LjMwMDAwMCkgOlxuICAgICAgICAgICAgICAgIHpvb20gPSAyIDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgIChkaXN0YW5jZSA8IDU5MTY1NzU1MC41MDAwMDApIDpcbiAgICAgICAgICAgICAgICB6b29tID0gMSA7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gem9vbVxuICAgIH1cblxufVxuIl19