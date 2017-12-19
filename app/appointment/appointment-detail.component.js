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
            _this.showToast('The Expense was successfully add it');
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
                        _this.showToast(' You have successfully checked in your location');
                    }, function (err) {
                        console.log(err);
                    });
                }
                else {
                    marker.title = "Your are too far away from the check in location address";
                    // marker.snippet = "";
                    marker.userData = { index: 1 };
                    marker.color = 'yellow';
                    _this.mapView.addMarker(marker);
                    // this.zoom = 13;
                    _this.showToast('Your are too far away from check in location address');
                }
                marker.showInfoWindow();
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
            marker.showInfoWindow();
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
        console.log("Marker Event: '" + args.eventName
            + "' triggered on: " + args.marker.title
            + ", Lat: " + args.marker.position.latitude + ", Lon: " + args.marker.position.longitude, args);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwb2ludG1lbnQtZGV0YWlsLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwcG9pbnRtZW50LWRldGFpbC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBNkQ7QUFDN0QsMENBQWlEO0FBQ2pELDZEQUEyRDtBQUUzRCwwQ0FBNEM7QUFFNUMsNkVBQXlFO0FBQ3pFLDRDQUE4QztBQUM5QywwRUFBd0U7QUFDeEUsNkVBQStFO0FBQy9FLHFCQUFxQixDQUFDLGVBQWUsQ0FBQyxVQUFVLEVBQUUsY0FBTSxPQUFBLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLFFBQVEsRUFBekMsQ0FBeUMsQ0FBQyxDQUFDO0FBQ25HLHFFQUFxSTtBQUVySSxrQ0FBZSxDQUFDLFNBQVMsRUFBRSxjQUFNLE9BQUEsT0FBTyxDQUFDLDhCQUE4QixDQUFDLENBQUMsT0FBTyxFQUEvQyxDQUErQyxDQUFDLENBQUM7QUFDbEYsMkVBQWlGO0FBZWpGO0lBd0JJLG9DQUNZLGtCQUFzQyxFQUN0QyxLQUFxQjtRQURyQix1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW9CO1FBQ3RDLFVBQUssR0FBTCxLQUFLLENBQWdCO1FBdkJ6QixhQUFRLEdBQUcsU0FBUyxDQUFDO1FBQ3JCLGNBQVMsR0FBRyxDQUFDLFNBQVMsQ0FBQztRQUN2QixjQUFTLEdBQUcsU0FBUyxDQUFDO1FBQ3RCLGVBQVUsR0FBRyxDQUFDLFFBQVEsQ0FBQztRQUMvQixpQ0FBaUM7UUFDakMsbUNBQW1DO1FBQzNCLFNBQUksR0FBRyxFQUFFLENBQUM7UUFDVixZQUFPLEdBQUcsQ0FBQyxDQUFDO1FBQ1osU0FBSSxHQUFHLENBQUMsQ0FBQztRQUVULFlBQU8sR0FBRyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRzNCLFdBQU0sR0FBUSxFQUFFLENBQUM7UUFDakIsZ0JBQVcsR0FBUSxFQUFFLENBQUM7UUFVMUIsSUFBSSxDQUFDLFdBQVcsR0FBZ0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztRQUN0RixNQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztJQUNoQyxDQUFDO0lBRUQsNkNBQVEsR0FBUjtJQUVBLENBQUM7SUFFRCw4Q0FBUyxHQUFULFVBQVUsT0FBZTtRQUNyQixLQUFLLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUMzQyxDQUFDO0lBRUQsK0NBQVUsR0FBVjtRQUFBLGlCQWVDO1FBZEcsSUFBSSxPQUFPLEdBQUcsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsZUFBZSxFQUFFLElBQUksRUFBRSxhQUFhLEVBQUUsS0FBSyxFQUFFLENBQUM7UUFDdkYsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7UUFDcEIsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7UUFDaEIsTUFBTSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUM7YUFDdEIsSUFBSSxDQUFDLFVBQUMsVUFBZTtZQUNsQix3QkFBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLEdBQUc7Z0JBQzFCLEtBQUksQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDM0MsS0FBSSxDQUFDLEtBQUssR0FBRyx3QkFBd0IsR0FBRyxLQUFJLENBQUMsU0FBUyxDQUFDO2dCQUN2RCxLQUFJLENBQUMsU0FBUyxHQUFHLEtBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztZQUN4RCxDQUFDLENBQUMsQ0FBQTtRQUNOLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFDLEdBQUc7WUFDVCxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDdkMsS0FBSSxDQUFDLFNBQVMsQ0FBQywwQ0FBMEMsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDN0UsQ0FBQyxDQUFDLENBQUM7SUFDWCxDQUFDO0lBRUQsZ0RBQVcsR0FBWDtRQUFBLGlCQWFDO1FBWkcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQUEsR0FBRztZQUMxRyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2pCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxzREFBc0Q7UUFDdEUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLFVBQUEsR0FBRztZQUNaLEtBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1lBQ3RCLEtBQUksQ0FBQyxTQUFTLENBQUMscUNBQXFDLENBQUMsQ0FBQztZQUN0RCxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3JCLENBQUMsQ0FBQyxFQUFFLFVBQUEsR0FBRztZQUNILE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNyQyxLQUFJLENBQUMsU0FBUyxDQUFDLDBDQUEwQyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN6RSxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3JCLENBQUMsQ0FBQTtJQUNMLENBQUM7SUFFRCxvREFBZSxHQUFmO1FBQUEsaUJBMENDO1FBekNHLDZDQUFrQixDQUFDLEVBQUUsZUFBZSxFQUFFLENBQUMsRUFBRSxjQUFjLEVBQUUsQ0FBQyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFDO1lBQzVGLElBQUksQ0FBQyxVQUFBLEdBQUc7WUFDSixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNOLElBQUksTUFBTSxHQUFHLElBQUkscUNBQU0sRUFBRSxDQUFDO2dCQUMxQixnRkFBZ0Y7Z0JBQ2hGLElBQUksbUJBQW1CLEdBQUcsdUNBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxLQUFJLENBQUMsUUFBUSxFQUFFLEtBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDckYsS0FBSSxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUMsUUFBUSxDQUFDO2dCQUM3QixLQUFJLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUM7Z0JBQy9CLHdFQUF3RTtnQkFDeEUsTUFBTSxDQUFDLFFBQVEsR0FBRyx1Q0FBUSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUMzRSxJQUFJLFFBQVEsR0FBRyxLQUFJLENBQUMsNkJBQTZCLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO2dCQUN4RixNQUFNLENBQUMsS0FBSyxHQUFHLGtCQUFrQixDQUFDO2dCQUNsQyxNQUFNLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztnQkFDdkIsTUFBTSxDQUFDLFFBQVEsR0FBRyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsQ0FBQztnQkFDL0IsTUFBTSxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUM7Z0JBRXZCLEtBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFFeEMsa0JBQWtCO2dCQUNsQixFQUFFLENBQUMsQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQztvQkFDckIsS0FBSSxDQUFDLGtCQUFrQixDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLEtBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxTQUFTLENBQUMsVUFBQSxHQUFHO3dCQUNuRixtRkFBbUY7d0JBQ25GLEtBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO3dCQUMvQixLQUFJLENBQUMsU0FBUyxDQUFDLGlEQUFpRCxDQUFDLENBQUM7b0JBQ3RFLENBQUMsRUFBRSxVQUFBLEdBQUc7d0JBQ0YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDckIsQ0FBQyxDQUFDLENBQUM7Z0JBQ1AsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixNQUFNLENBQUMsS0FBSyxHQUFHLDBEQUEwRCxDQUFDO29CQUMxRSx1QkFBdUI7b0JBQ3ZCLE1BQU0sQ0FBQyxRQUFRLEdBQUcsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUM7b0JBQy9CLE1BQU0sQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDO29CQUN4QixLQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFDL0Isa0JBQWtCO29CQUNsQixLQUFJLENBQUMsU0FBUyxDQUFDLHNEQUFzRCxDQUFDLENBQUM7Z0JBQzNFLENBQUM7Z0JBQ0QsTUFBTSxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQzVCLENBQUM7UUFDTCxDQUFDLEVBQUUsVUFBQyxDQUFDO1lBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3ZDLENBQUMsQ0FBQyxDQUFDO0lBQ1gsQ0FBQztJQUVELCtDQUFVLEdBQVYsVUFBVyxLQUFLO1FBQWhCLGlCQStEQztRQTlERyxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUM7UUFFNUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDO1FBRWpELElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7UUFFNUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsd0JBQXdCLEdBQUcsSUFBSSxDQUFDO1FBRXRELElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQztRQUUvQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyx1QkFBdUIsR0FBRyxJQUFJLENBQUM7UUFFckQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMscUJBQXFCLEdBQUcsSUFBSSxDQUFDO1FBRW5ELElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLHFCQUFxQixHQUFHLElBQUksQ0FBQztRQUVuRCxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUM7UUFFakQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDO1FBRWpELElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDO1FBQzlJLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxzQkFBc0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsVUFBQyxHQUFRO1lBQ3ZFLElBQUksTUFBTSxHQUFHLElBQUkscUNBQU0sRUFBRSxDQUFDO1lBQzFCLEtBQUksQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQztZQUNyRCxLQUFJLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUM7WUFDdEQseUNBQXlDO1lBQ3pDLCtCQUErQjtZQUMvQixNQUFNLENBQUMsUUFBUSxHQUFHLHVDQUFRLENBQUMsa0JBQWtCLENBQUMsS0FBSSxDQUFDLFFBQVEsRUFBRSxLQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7WUFFN0UsZ0NBQWdDO1lBRWhDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQztZQUNoRCxNQUFNLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztZQUVwQixNQUFNLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQTtZQUNyQixNQUFNLENBQUMsUUFBUSxHQUFHLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDO1lBRS9CLEtBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO1lBRWYsOEJBQThCO1lBQzlCLHlFQUF5RTtZQUN6RSw0QkFBNEI7WUFDNUIsK0ZBQStGO1lBQy9GLGtDQUFrQztZQUNsQywwQkFBMEI7WUFDMUIsbUNBQW1DO1lBQ25DLDJDQUEyQztZQUMzQyxLQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUMvQixNQUFNLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDNUIsQ0FBQyxDQUFDLENBQUE7UUFFRixpRUFBaUU7UUFDakUsb0NBQW9DO1FBQ3BDLHlFQUF5RTtRQUN6RSx5QkFBeUI7UUFDekIsOENBQThDO1FBRTlDLEtBQUs7UUFFTCxJQUFJLENBQUMsa0JBQWtCLENBQUMsMEJBQTBCLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsVUFBQSxHQUFHO1lBQy9GLEtBQUksQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDO1FBQ3hCLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELHVEQUFrQixHQUFsQixVQUFtQixJQUFJO1FBQ25CLGdIQUFnSDtJQUNwSCxDQUFDO0lBRUQsa0RBQWEsR0FBYixVQUFjLElBQUk7UUFDZCxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQyxTQUFTO2NBQ3hDLGtCQUFrQixHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSztjQUN0QyxTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUSxHQUFHLFNBQVMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDeEcsQ0FBQztJQUVELG9EQUFlLEdBQWYsVUFBZ0IsSUFBSTtRQUNoQixrSEFBa0g7UUFDbEgsaURBQWlEO0lBQ3JELENBQUM7SUFFRCxrRUFBNkIsR0FBN0IsVUFBOEIsRUFBRSxFQUFFLEVBQUU7UUFDaEMsSUFBSSxHQUFHLEdBQUcsVUFBVSxDQUFDO1lBQ2pCLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUM7UUFDN0IsQ0FBQyxDQUFDO1FBQ0YsSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsK0JBQStCO1FBQ2hELElBQUksSUFBSSxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMxQyxJQUFJLEtBQUssR0FBRyxHQUFHLENBQUMsRUFBRSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDN0MsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO1lBQzNDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDdkQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDOUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZELElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDZCxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsMENBQTBDO0lBQ3hELENBQUM7SUFHRCxpREFBWSxHQUFaLFVBQWEsUUFBUTtRQUNqQixJQUFJLElBQUksR0FBRyxFQUFFLENBQUM7UUFDZCxJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUM7UUFDZixNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBRVgsS0FBTSxDQUFDLFFBQVEsR0FBRyxXQUFXLENBQUM7Z0JBQzFCLElBQUksR0FBRyxFQUFFLEdBQUksTUFBTSxDQUFDO2dCQUNwQixLQUFLLENBQUM7WUFDVixLQUFNLENBQUMsUUFBUSxHQUFHLFdBQVcsQ0FBQztnQkFDMUIsSUFBSSxHQUFHLEVBQUUsR0FBSSxNQUFNLENBQUM7Z0JBQ3BCLEtBQUssQ0FBQztZQUNWLEtBQU0sQ0FBQyxRQUFRLEdBQUcsV0FBVyxDQUFDO2dCQUMxQixJQUFJLEdBQUcsRUFBRSxHQUFJLE1BQU0sQ0FBQztnQkFDcEIsS0FBSyxDQUFDO1lBQ1YsS0FBTSxDQUFDLFFBQVEsR0FBRyxXQUFXLENBQUM7Z0JBQzFCLElBQUksR0FBRyxFQUFFLEdBQUksTUFBTSxDQUFDO2dCQUNwQixLQUFLLENBQUM7WUFDVixLQUFNLENBQUMsUUFBUSxHQUFHLFlBQVksQ0FBQztnQkFDM0IsSUFBSSxHQUFHLEVBQUUsR0FBSSxNQUFNLENBQUM7Z0JBQ3BCLEtBQUssQ0FBQztZQUNWLEtBQU0sQ0FBQyxRQUFRLEdBQUcsWUFBWSxDQUFDO2dCQUMzQixJQUFJLEdBQUcsRUFBRSxHQUFJLE1BQU0sQ0FBQztnQkFDcEIsS0FBSyxDQUFDO1lBQ1YsS0FBTSxDQUFDLFFBQVEsR0FBRyxZQUFZLENBQUM7Z0JBQzNCLElBQUksR0FBRyxFQUFFLEdBQUksTUFBTSxDQUFDO2dCQUNwQixLQUFLLENBQUM7WUFDVixLQUFNLENBQUMsUUFBUSxHQUFHLGFBQWEsQ0FBQztnQkFDNUIsSUFBSSxHQUFHLEVBQUUsR0FBSSxNQUFNLENBQUM7Z0JBQ3BCLEtBQUssQ0FBQztZQUNWLEtBQU0sQ0FBQyxRQUFRLEdBQUcsYUFBYSxDQUFDO2dCQUM1QixJQUFJLEdBQUcsRUFBRSxHQUFJLE1BQU0sQ0FBQztnQkFDcEIsS0FBSyxDQUFDO1lBQ1YsS0FBTSxDQUFDLFFBQVEsR0FBRyxhQUFhLENBQUM7Z0JBQzVCLElBQUksR0FBRyxFQUFFLEdBQUksTUFBTSxDQUFDO2dCQUNwQixLQUFLLENBQUM7WUFDVixLQUFNLENBQUMsUUFBUSxHQUFHLGNBQWMsQ0FBQztnQkFDN0IsSUFBSSxHQUFHLEVBQUUsR0FBSSxNQUFNLENBQUM7Z0JBQ3BCLEtBQUssQ0FBQztZQUNWLEtBQU0sQ0FBQyxRQUFRLEdBQUcsY0FBYyxDQUFDO2dCQUM3QixJQUFJLEdBQUcsQ0FBQyxHQUFJLE1BQU0sQ0FBQztnQkFDbkIsS0FBSyxDQUFDO1lBQ1YsS0FBTSxDQUFDLFFBQVEsR0FBRyxjQUFjLENBQUM7Z0JBQzdCLElBQUksR0FBRyxDQUFDLEdBQUksTUFBTSxDQUFDO2dCQUNuQixLQUFLLENBQUM7WUFDVixLQUFNLENBQUMsUUFBUSxHQUFHLGNBQWMsQ0FBQztnQkFDN0IsSUFBSSxHQUFHLENBQUMsR0FBSSxNQUFNLENBQUM7Z0JBQ25CLEtBQUssQ0FBQztZQUNWLEtBQU0sQ0FBQyxRQUFRLEdBQUcsZUFBZSxDQUFDO2dCQUM5QixJQUFJLEdBQUcsQ0FBQyxHQUFJLE1BQU0sQ0FBQztnQkFDbkIsS0FBSyxDQUFDO1lBQ1YsS0FBTSxDQUFDLFFBQVEsR0FBRyxlQUFlLENBQUM7Z0JBQzlCLElBQUksR0FBRyxDQUFDLENBQUU7Z0JBQ1YsS0FBSyxDQUFDO1lBQ1YsS0FBTSxDQUFDLFFBQVEsR0FBRyxlQUFlLENBQUM7Z0JBQzlCLElBQUksR0FBRyxDQUFDLENBQUU7Z0JBQ1YsS0FBSyxDQUFDO1lBQ1YsS0FBTSxDQUFDLFFBQVEsR0FBRyxnQkFBZ0IsQ0FBQztnQkFDL0IsSUFBSSxHQUFHLENBQUMsQ0FBRTtnQkFDVixLQUFLLENBQUM7WUFDVixLQUFNLENBQUMsUUFBUSxHQUFHLGdCQUFnQixDQUFDO2dCQUMvQixJQUFJLEdBQUcsQ0FBQyxDQUFFO2dCQUNWLEtBQUssQ0FBQztZQUNWLEtBQU0sQ0FBQyxRQUFRLEdBQUcsZ0JBQWdCLENBQUM7Z0JBQy9CLElBQUksR0FBRyxDQUFDLENBQUU7Z0JBQ1YsS0FBSyxDQUFDO1lBRVY7Z0JBQ0ksS0FBSyxDQUFDO1FBQ2QsQ0FBQztRQUVELE1BQU0sQ0FBQyxJQUFJLENBQUE7SUFDZixDQUFDO0lBMVJRLDBCQUEwQjtRQU50QyxnQkFBUyxDQUFDO1lBQ1AsUUFBUSxFQUFFLFlBQVk7WUFDdEIsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFO1lBQ25CLFdBQVcsRUFBRSxxQ0FBcUM7WUFDbEQsU0FBUyxFQUFFLENBQUMsMEJBQTBCLENBQUM7U0FDMUMsQ0FBQzt5Q0EwQmtDLHdDQUFrQjtZQUMvQix1QkFBYztPQTFCeEIsMEJBQTBCLENBNFJ0QztJQUFELGlDQUFDO0NBQUEsQUE1UkQsSUE0UkM7QUE1UlksZ0VBQTBCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIFZpZXdDaGlsZCB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBBY3RpdmF0ZWRSb3V0ZSB9IGZyb20gXCJAYW5ndWxhci9yb3V0ZXJcIjtcbmltcG9ydCB7IEFwcG9pbnRtZW50U2VydmljZSB9IGZyb20gXCIuL2FwcG9pbnRtZW50LnNlcnZpY2VcIjtcbmltcG9ydCB7IEFwcG9pbnRtZW50IH0gZnJvbSBcIi4vYXBwb2ludG1lbnQubW9kZWxcIjtcbmltcG9ydCAqIGFzIFRvYXN0IGZyb20gXCJuYXRpdmVzY3JpcHQtdG9hc3RcIjtcbmltcG9ydCB7IFRlbGVwaG9ueSB9IGZyb20gJ25hdGl2ZXNjcmlwdC10ZWxlcGhvbnknO1xuaW1wb3J0IHsgTWFwVmlldywgTWFya2VyLCBQb3NpdGlvbiB9IGZyb20gJ25hdGl2ZXNjcmlwdC1nb29nbGUtbWFwcy1zZGsnO1xuaW1wb3J0ICogYXMgY2FtZXJhIGZyb20gXCJuYXRpdmVzY3JpcHQtY2FtZXJhXCI7XG5pbXBvcnQgeyByZWdpc3RlckVsZW1lbnQgfSBmcm9tICduYXRpdmVzY3JpcHQtYW5ndWxhci9lbGVtZW50LXJlZ2lzdHJ5JztcbmltcG9ydCAqIGFzIGVsZW1lbnRSZWdpc3RyeU1vZHVsZSBmcm9tICduYXRpdmVzY3JpcHQtYW5ndWxhci9lbGVtZW50LXJlZ2lzdHJ5JztcbmVsZW1lbnRSZWdpc3RyeU1vZHVsZS5yZWdpc3RlckVsZW1lbnQoXCJDYXJkVmlld1wiLCAoKSA9PiByZXF1aXJlKFwibmF0aXZlc2NyaXB0LWNhcmR2aWV3XCIpLkNhcmRWaWV3KTtcbmltcG9ydCB7IGlzRW5hYmxlZCwgZW5hYmxlTG9jYXRpb25SZXF1ZXN0LCBnZXRDdXJyZW50TG9jYXRpb24sIHdhdGNoTG9jYXRpb24sIGRpc3RhbmNlLCBjbGVhcldhdGNoIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1nZW9sb2NhdGlvblwiO1xuaW1wb3J0IHsgcmVzZXRDU1NQcm9wZXJ0aWVzIH0gZnJvbSBcInRucy1jb3JlLW1vZHVsZXMvdWkvZnJhbWUvZnJhbWVcIjtcbnJlZ2lzdGVyRWxlbWVudCgnTWFwVmlldycsICgpID0+IHJlcXVpcmUoXCJuYXRpdmVzY3JpcHQtZ29vZ2xlLW1hcHMtc2RrXCIpLk1hcFZpZXcpO1xuaW1wb3J0IHsgZnJvbUFzc2V0LCBmcm9tRGF0YSB9IGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL2ltYWdlLXNvdXJjZS9pbWFnZS1zb3VyY2VcIjtcbmltcG9ydCB7IExvb3BBcHBvaW50bWVudCB9IGZyb20gXCIuL2xvb3AvbG9vcC1hcHBvaW50bWVudC5tb2RlbFwiO1xuLy8gaW1wb3J0IHsgYW5kcm9pZCB9IGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL2FwcGxpY2F0aW9uL2FwcGxpY2F0aW9uXCI7XG4vLyBkZWNsYXJlIHZhciBCaXRtYXBGYWN0b3J5OiBhbnlcbmRlY2xhcmUgdmFyIGFuZHJvaWQ7XG5kZWNsYXJlIHZhciBqYXZhO1xuZGVjbGFyZSB2YXIgYnl0ZTtcbmRlY2xhcmUgdmFyIEJ5dGVBcnJheU91dHB1dFN0cmVhbTtcbmRlY2xhcmUgdmFyIEJpdG1hcDtcbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiBcIm5zLWRldGFpbHNcIixcbiAgICBtb2R1bGVJZDogbW9kdWxlLmlkLFxuICAgIHRlbXBsYXRlVXJsOiBcIi4vYXBwb2ludG1lbnQtZGV0YWlsLmNvbXBvbmVudC5odG1sXCIsXG4gICAgc3R5bGVVcmxzOiBbJy4vYXBwb2ludG1lbnQtZGV0YWlsLmNzcyddXG59KVxuZXhwb3J0IGNsYXNzIEFwcG9pbnRtZW50RGV0YWlsQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgICBwcml2YXRlIGFwcG9pbnRtZW50OiBBcHBvaW50bWVudDtcbiAgICBwcml2YXRlIGV4cGVuc2VzOiBBcnJheTxvYmplY3Q+O1xuICAgIHByaXZhdGUgbGF0aXR1ZGUgPSAyNS43Njk0OTA7XG4gICAgcHJpdmF0ZSBsb25naXR1ZGUgPSAtODAuMTk1MjI0O1xuICAgIHByaXZhdGUgbGF0aXR1ZGUyID0gMjUuNzY5ODU5O1xuICAgIHByaXZhdGUgbG9uZ2l0dWRlMiA9IC04MC4xOTIzMDtcbiAgICAvLyBwcml2YXRlIGxhdGl0dWRlMiA9IDI1Ljc3NDM5NDtcbiAgICAvLyBwcml2YXRlIGxvbmdpdHVkZTIgPSAtODAuMTQxODUyO1xuICAgIHByaXZhdGUgem9vbSA9IDE2O1xuICAgIHByaXZhdGUgYmVhcmluZyA9IDA7XG4gICAgcHJpdmF0ZSB0aWx0ID0gMDtcbiAgICBwcml2YXRlIEN1cnJlbnRMb2NhdGlvbjtcbiAgICBwcml2YXRlIHBhZGRpbmcgPSBbNDAsIDQwLCA0MCwgNDBdO1xuICAgIHByaXZhdGUgbWFwVmlldzogTWFwVmlldztcbiAgICBwcml2YXRlIHBob25lTnVtYmVyOiBhbnk7XG4gICAgcHJpdmF0ZSBhbW91bnQ6IGFueSA9ICcnO1xuICAgIHByaXZhdGUgZXhwZW5zZVR5cGU6IGFueSA9ICcnO1xuICAgIHByaXZhdGUgaW1hZ2U6IHN0cmluZztcbiAgICBwcml2YXRlIGltYWdlYmFzZTogc3RyaW5nO1xuICAgIC8vIHByaXZhdGUgaW1hZ2U6IGFueSA9IFwiaHR0cHM6Ly9wbGF5Lm5hdGl2ZXNjcmlwdC5vcmcvZGlzdC9hc3NldHMvaW1nL05hdGl2ZVNjcmlwdF9sb2dvLnBuZ1wiO1xuXG4gICAgbGFzdENhbWVyYTogU3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByaXZhdGUgYXBwb2ludG1lbnRTZXJ2aWNlOiBBcHBvaW50bWVudFNlcnZpY2UsXG4gICAgICAgIHByaXZhdGUgcm91dGU6IEFjdGl2YXRlZFJvdXRlKSB7XG4gICAgICAgIHRoaXMuYXBwb2ludG1lbnQgPSA8QXBwb2ludG1lbnQ+SlNPTi5wYXJzZSh0aGlzLnJvdXRlLnNuYXBzaG90LnBhcmFtc1tcImFwcG9pbnRtZW50XCJdKTtcbiAgICAgICAgY2FtZXJhLnJlcXVlc3RQZXJtaXNzaW9ucygpO1xuICAgIH1cblxuICAgIG5nT25Jbml0KCk6IHZvaWQge1xuXG4gICAgfVxuXG4gICAgc2hvd1RvYXN0KG1lc3NhZ2U6IHN0cmluZykge1xuICAgICAgICBUb2FzdC5tYWtlVGV4dChtZXNzYWdlLCBcImxvbmdcIikuc2hvdygpO1xuICAgIH1cblxuICAgIGFkZEV4cGVuc2UoKSB7XG4gICAgICAgIHZhciBvcHRpb25zID0geyB3aWR0aDogMTUwLCBoZWlnaHQ6IDE1MCwga2VlcEFzcGVjdFJhdGlvOiB0cnVlLCBzYXZlVG9HYWxsZXJ5OiBmYWxzZSB9O1xuICAgICAgICB0aGlzLmltYWdlYmFzZSA9ICcnO1xuICAgICAgICB0aGlzLmltYWdlID0gJyc7XG4gICAgICAgIGNhbWVyYS50YWtlUGljdHVyZShvcHRpb25zKVxuICAgICAgICAgICAgLnRoZW4oKGltYWdlQXNzZXQ6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgIGZyb21Bc3NldChpbWFnZUFzc2V0KS50aGVuKHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW1hZ2ViYXNlID0gcmVzLnRvQmFzZTY0U3RyaW5nKFwianBnXCIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmltYWdlID0gXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsXCIgKyB0aGlzLmltYWdlYmFzZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbWFnZWJhc2UgPSB0aGlzLmltYWdlYmFzZS5yZXBsYWNlKC9cXCsvZywgJy0nKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRXJyb3IgLT4gXCIgKyBlcnIubWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5zaG93VG9hc3QoJ1NvbWV0aGluZyB3ZW50IHdyb25nIHBsZWFzZSB0cnkgYWdhaW4gOiAnICsgZXJyLm1lc3NhZ2UpO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgc2F2ZUV4cGVuc2UoKSB7XG4gICAgICAgIHRoaXMuYXBwb2ludG1lbnRTZXJ2aWNlLnNhdmVFeHBlbnNlKHRoaXMuYXBwb2ludG1lbnQsIHRoaXMuaW1hZ2ViYXNlLCB0aGlzLmV4cGVuc2VUeXBlLCB0aGlzLmFtb3VudCkuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUuZGlyKGVycik7XG4gICAgICAgICAgICByZXR1cm4gZXJyOyAvLyBvYnNlcnZhYmxlIG5lZWRzIHRvIGJlIHJldHVybmVkIG9yIGV4Y2VwdGlvbiByYWlzZWRcbiAgICAgICAgfSkuc3Vic2NyaWJlKHJlcyA9PiB7XG4gICAgICAgICAgICB0aGlzLmltYWdlYmFzZSA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLnNob3dUb2FzdCgnVGhlIEV4cGVuc2Ugd2FzIHN1Y2Nlc3NmdWxseSBhZGQgaXQnKTtcbiAgICAgICAgICAgIGNvbnNvbGUuZGlyKHJlcyk7XG4gICAgICAgIH0pLCBlcnIgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvcjogXCIgKyBlcnIubWVzc2FnZSk7XG4gICAgICAgICAgICB0aGlzLnNob3dUb2FzdCgnU29tZXRoaW5nIHdlbnQgd3JvbmcgcGxlYXNlIHRyeSBhZ2FpbiA6ICcgKyBlcnIubWVzc2FnZSk7XG4gICAgICAgICAgICBjb25zb2xlLmRpcihlcnIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2hlY2tpbkxvY2F0aW9uKCk6IGFueSB7XG4gICAgICAgIGdldEN1cnJlbnRMb2NhdGlvbih7IGRlc2lyZWRBY2N1cmFjeTogMywgdXBkYXRlRGlzdGFuY2U6IDEsIG1heGltdW1BZ2U6IDIwMDAwLCB0aW1lb3V0OiAyMDAwMCB9KS5cbiAgICAgICAgICAgIHRoZW4obG9jID0+IHtcbiAgICAgICAgICAgICAgICBpZiAobG9jKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBtYXJrZXIgPSBuZXcgTWFya2VyKCk7XG4gICAgICAgICAgICAgICAgICAgIC8vIHZhciBhcHBvaW50bWVudFBvc2l0aW9uID0gUG9zaXRpb24ucG9zaXRpb25Gcm9tTGF0TG5nKDI1Ljc3MzY5NCwgLTgwLjI4NTQ1MSk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhcHBvaW50bWVudFBvc2l0aW9uID0gUG9zaXRpb24ucG9zaXRpb25Gcm9tTGF0TG5nKHRoaXMubGF0aXR1ZGUsIHRoaXMubG9uZ2l0dWRlKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sYXRpdHVkZSA9IGxvYy5sYXRpdHVkZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb25naXR1ZGUgPSBsb2MubG9uZ2l0dWRlO1xuICAgICAgICAgICAgICAgICAgICAvLyBtYXJrZXIucG9zaXRpb24gPSBQb3NpdGlvbi5wb3NpdGlvbkZyb21MYXRMbmcoNDMuMzYyNjg0LCAtNzEuMTAzNTMwKTtcbiAgICAgICAgICAgICAgICAgICAgbWFya2VyLnBvc2l0aW9uID0gUG9zaXRpb24ucG9zaXRpb25Gcm9tTGF0TG5nKGxvYy5sYXRpdHVkZSwgbG9jLmxvbmdpdHVkZSk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBkaXN0YW5jZSA9IHRoaXMuY2FsY3VsYXREaXN0YW5jZUJldHdlZW5wb2ludHMobWFya2VyLnBvc2l0aW9uLCBhcHBvaW50bWVudFBvc2l0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgbWFya2VyLnRpdGxlID0gXCJDdXJyZW50IFBvc2l0aW9uXCI7XG4gICAgICAgICAgICAgICAgICAgIG1hcmtlci5zbmlwcGV0ID0gXCJVc2FcIjtcbiAgICAgICAgICAgICAgICAgICAgbWFya2VyLnVzZXJEYXRhID0geyBpbmRleDogMSB9O1xuICAgICAgICAgICAgICAgICAgICBtYXJrZXIuY29sb3IgPSAnZ3JlZW4nO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuem9vbSA9IHRoaXMuem9vbURpc3RhbmNlKGRpc3RhbmNlKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLnpvb20gPSAxMztcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRpc3RhbmNlIDwgODA0LjY3Mikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hcHBvaW50bWVudFNlcnZpY2Uuc2V0R2VvTG9jYXRpb24obWFya2VyLnBvc2l0aW9uLCB0aGlzLmFwcG9pbnRtZW50KS5zdWJzY3JpYmUocmVzID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLmFwcG9pbnRtZW50U2VydmljZS5zZXRHZW9Mb2NhdGlvbihsb2MsIHRoaXMuYXBwb2ludG1lbnQpLnN1YnNjcmliZShyZXMgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubWFwVmlldy5hZGRNYXJrZXIobWFya2VyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNob3dUb2FzdCgnIFlvdSBoYXZlIHN1Y2Nlc3NmdWxseSBjaGVja2VkIGluIHlvdXIgbG9jYXRpb24nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIGVyciA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWFya2VyLnRpdGxlID0gXCJZb3VyIGFyZSB0b28gZmFyIGF3YXkgZnJvbSB0aGUgY2hlY2sgaW4gbG9jYXRpb24gYWRkcmVzc1wiO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbWFya2VyLnNuaXBwZXQgPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgbWFya2VyLnVzZXJEYXRhID0geyBpbmRleDogMSB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgbWFya2VyLmNvbG9yID0gJ3llbGxvdyc7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1hcFZpZXcuYWRkTWFya2VyKG1hcmtlcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLnpvb20gPSAxMztcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2hvd1RvYXN0KCdZb3VyIGFyZSB0b28gZmFyIGF3YXkgZnJvbSBjaGVjayBpbiBsb2NhdGlvbiBhZGRyZXNzJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbWFya2VyLnNob3dJbmZvV2luZG93KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgKGUpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yOiBcIiArIGUubWVzc2FnZSk7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBvbk1hcFJlYWR5KGV2ZW50KSB7XG4gICAgICAgIHRoaXMubWFwVmlldyA9IGV2ZW50Lm9iamVjdDtcblxuICAgICAgICB0aGlzLm1hcFZpZXcuc2V0dGluZ3Muem9vbUdlc3R1cmVzRW5hYmxlZCA9IHRydWU7XG5cbiAgICAgICAgdGhpcy5tYXBWaWV3LnNldHRpbmdzLmNvbXBhc3NFbmFibGVkID0gdHJ1ZTtcblxuICAgICAgICB0aGlzLm1hcFZpZXcuc2V0dGluZ3MuaW5kb29yTGV2ZWxQaWNrZXJFbmFibGVkID0gdHJ1ZTtcblxuICAgICAgICB0aGlzLm1hcFZpZXcuc2V0dGluZ3MubWFwVG9vbGJhckVuYWJsZWQgPSB0cnVlO1xuXG4gICAgICAgIHRoaXMubWFwVmlldy5zZXR0aW5ncy5teUxvY2F0aW9uQnV0dG9uRW5hYmxlZCA9IHRydWU7XG5cbiAgICAgICAgdGhpcy5tYXBWaWV3LnNldHRpbmdzLnJvdGF0ZUdlc3R1cmVzRW5hYmxlZCA9IHRydWU7XG5cbiAgICAgICAgdGhpcy5tYXBWaWV3LnNldHRpbmdzLnNjcm9sbEdlc3R1cmVzRW5hYmxlZCA9IHRydWU7XG5cbiAgICAgICAgdGhpcy5tYXBWaWV3LnNldHRpbmdzLnRpbHRHZXN0dXJlc0VuYWJsZWQgPSB0cnVlO1xuXG4gICAgICAgIHRoaXMubWFwVmlldy5zZXR0aW5ncy56b29tQ29udHJvbHNFbmFibGVkID0gdHJ1ZTtcblxuICAgICAgICBsZXQgYWRkcmVzcyA9IHRoaXMuYXBwb2ludG1lbnQuY2xpQWRkcmVzczEgKyAnICcgKyB0aGlzLmFwcG9pbnRtZW50LmNsaUNpdHkgKyAnICcgKyB0aGlzLmFwcG9pbnRtZW50LmNsaVN0YXRlICsgJyAnICsgdGhpcy5hcHBvaW50bWVudC5jbGlaaXA7XG4gICAgICAgIHRoaXMuYXBwb2ludG1lbnRTZXJ2aWNlLmdldEFwcG9pbnRtZW50TG9jYXRpb24oYWRkcmVzcykuc3Vic2NyaWJlKChyZXM6IGFueSkgPT4ge1xuICAgICAgICAgICAgdmFyIG1hcmtlciA9IG5ldyBNYXJrZXIoKTtcbiAgICAgICAgICAgIHRoaXMubGF0aXR1ZGUgPSByZXMucmVzdWx0c1swXS5nZW9tZXRyeS5sb2NhdGlvbi5sYXQ7XG4gICAgICAgICAgICB0aGlzLmxvbmdpdHVkZSA9IHJlcy5yZXN1bHRzWzBdLmdlb21ldHJ5LmxvY2F0aW9uLmxuZztcbiAgICAgICAgICAgIC8vIHRoaXMubGF0aXR1ZGUgPSAyNS44NTQwNTA7ICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyB0aGlzLmxvbmdpdHVkZSA9IC04MC4yMzMyNjY7XG4gICAgICAgICAgICBtYXJrZXIucG9zaXRpb24gPSBQb3NpdGlvbi5wb3NpdGlvbkZyb21MYXRMbmcodGhpcy5sYXRpdHVkZSwgdGhpcy5sb25naXR1ZGUpO1xuXG4gICAgICAgICAgICAvLyBjb25zb2xlLmRpcihtYXJrZXIucG9zaXRpb24pO1xuXG4gICAgICAgICAgICBtYXJrZXIudGl0bGUgPSByZXMucmVzdWx0c1swXS5mb3JtYXR0ZWRfYWRkcmVzcztcbiAgICAgICAgICAgIG1hcmtlci5zbmlwcGV0ID0gXCJcIjtcblxuICAgICAgICAgICAgbWFya2VyLmNvbG9yID0gJ2JsdWUnXG4gICAgICAgICAgICBtYXJrZXIudXNlckRhdGEgPSB7IGluZGV4OiAxIH07XG5cbiAgICAgICAgICAgIHRoaXMuem9vbSA9IDEwO1xuXG4gICAgICAgICAgICAvLyB2YXIgbWFya2VyMiA9IG5ldyBNYXJrZXIoKTtcbiAgICAgICAgICAgIC8vIG1hcmtlcjIucG9zaXRpb24gPSBQb3NpdGlvbi5wb3NpdGlvbkZyb21MYXRMbmcoNDMuMzYyNjg0LCAtNzEuMTAzNTMwKTtcbiAgICAgICAgICAgIC8vIG1hcmtlcjIudGl0bGUgPSBcIkN1c3RvbVwiO1xuICAgICAgICAgICAgLy8gLy8gbWFya2VyMi5pY29uID0gJ2h0dHBzOi8vY2hhcnQuYXBpcy5nb29nbGUuY29tL2NoYXJ0P2Noc3Q9ZF9tYXBfcGluX2ljb24mY2hsZD1idXN8RkZGRjAwJztcbiAgICAgICAgICAgIC8vIG1hcmtlcjIuc25pcHBldCA9IFwiY3VzdG9taXplZFwiO1xuICAgICAgICAgICAgLy8gLy8gbWFya2VyMi5jb2xvcj0gJ3JlZCdcbiAgICAgICAgICAgIC8vIG1hcmtlcjIudXNlckRhdGEgPSB7IGluZGV4OiAxIH07XG4gICAgICAgICAgICAvLyB0aGlzLm1hcFZpZXcuYWRkTWFya2VyKG1hcmtlciwgbWFya2VyMik7XG4gICAgICAgICAgICB0aGlzLm1hcFZpZXcuYWRkTWFya2VyKG1hcmtlcik7XG4gICAgICAgICAgICBtYXJrZXIuc2hvd0luZm9XaW5kb3coKTtcbiAgICAgICAgfSlcblxuICAgICAgICAvLyB0aGlzLmFwcG9pbnRtZW50U2VydmljZS5sb29wR2V0QXBwaW9udG1lbnRzKCkuY2F0Y2goZXJyID0+ICB7IFxuICAgICAgICAvLyAgICAgY29uc29sZS5kaXIoZXJyKTsgICAgICAgICAgICBcbiAgICAgICAgLy8gICAgIHJldHVybiBlcnI7IC8vIG9ic2VydmFibGUgbmVlZHMgdG8gYmUgcmV0dXJuZWQgb3IgZXhjZXB0aW9uIHJhaXNlZFxuICAgICAgICAvLyAgfSkuc3Vic2NyaWJlKHJlcyA9PiB7XG4gICAgICAgIC8vICAgICBjb25zb2xlLmRpcihcImFwcG9pbnRtZW50c2xvb3AgOiBcIityZXMpO1xuXG4gICAgICAgIC8vIH0pXG5cbiAgICAgICAgdGhpcy5hcHBvaW50bWVudFNlcnZpY2UuZ2V0RXhwZW5zZXNCeUFwcG9pbnRtZW50SWQodGhpcy5hcHBvaW50bWVudC5BcHBJZC50b1N0cmluZygpKS5zdWJzY3JpYmUocmVzID0+IHtcbiAgICAgICAgICAgIHRoaXMuZXhwZW5zZXMgPSByZXM7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIG9uQ29vcmRpbmF0ZVRhcHBlZChhcmdzKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiQ29vcmRpbmF0ZSBUYXBwZWQsIExhdDogXCIgKyBhcmdzLnBvc2l0aW9uLmxhdGl0dWRlICsgXCIsIExvbjogXCIgKyBhcmdzLnBvc2l0aW9uLmxvbmdpdHVkZSwgYXJncyk7XG4gICAgfVxuXG4gICAgb25NYXJrZXJFdmVudChhcmdzKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiTWFya2VyIEV2ZW50OiAnXCIgKyBhcmdzLmV2ZW50TmFtZVxuICAgICAgICAgICAgKyBcIicgdHJpZ2dlcmVkIG9uOiBcIiArIGFyZ3MubWFya2VyLnRpdGxlXG4gICAgICAgICAgICArIFwiLCBMYXQ6IFwiICsgYXJncy5tYXJrZXIucG9zaXRpb24ubGF0aXR1ZGUgKyBcIiwgTG9uOiBcIiArIGFyZ3MubWFya2VyLnBvc2l0aW9uLmxvbmdpdHVkZSwgYXJncyk7XG4gICAgfVxuXG4gICAgb25DYW1lcmFDaGFuZ2VkKGFyZ3MpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJDYW1lcmEgY2hhbmdlZDogXCIgKyBKU09OLnN0cmluZ2lmeShhcmdzLmNhbWVyYSksIEpTT04uc3RyaW5naWZ5KGFyZ3MuY2FtZXJhKSA9PT0gdGhpcy5sYXN0Q2FtZXJhKTtcbiAgICAgICAgLy8gdGhpcy5sYXN0Q2FtZXJhID0gSlNPTi5zdHJpbmdpZnkoYXJncy5jYW1lcmEpO1xuICAgIH1cblxuICAgIGNhbGN1bGF0RGlzdGFuY2VCZXR3ZWVucG9pbnRzKHAxLCBwMikge1xuICAgICAgICB2YXIgcmFkID0gZnVuY3Rpb24gKHgpIHtcbiAgICAgICAgICAgIHJldHVybiB4ICogTWF0aC5QSSAvIDE4MDtcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIFIgPSA2Mzc4MTM3OyAvLyBFYXJ0aOKAmXMgbWVhbiByYWRpdXMgaW4gbWV0ZXJcbiAgICAgICAgdmFyIGRMYXQgPSByYWQocDIubGF0aXR1ZGUgLSBwMS5sYXRpdHVkZSk7XG4gICAgICAgIHZhciBkTG9uZyA9IHJhZChwMi5sb25naXR1ZGUgLSBwMS5sb25naXR1ZGUpO1xuICAgICAgICB2YXIgYSA9IE1hdGguc2luKGRMYXQgLyAyKSAqIE1hdGguc2luKGRMYXQgLyAyKSArXG4gICAgICAgICAgICBNYXRoLmNvcyhyYWQocDEubGF0aXR1ZGUpKSAqIE1hdGguY29zKHJhZChwMi5sYXRpdHVkZSkpICpcbiAgICAgICAgICAgIE1hdGguc2luKGRMb25nIC8gMikgKiBNYXRoLnNpbihkTG9uZyAvIDIpO1xuICAgICAgICB2YXIgYyA9IDIgKiBNYXRoLmF0YW4yKE1hdGguc3FydChhKSwgTWF0aC5zcXJ0KDEgLSBhKSk7XG4gICAgICAgIHZhciBkID0gUiAqIGM7XG4gICAgICAgIHJldHVybiBkOyAvLyByZXR1cm5zIHRoZSBkaXN0YW5jZSBpbiBtZXRlciAgICAgICAgICBcbiAgICB9XG5cblxuICAgIHpvb21EaXN0YW5jZShkaXN0YW5jZSkge1xuICAgICAgICBsZXQgem9vbSA9IDEzO1xuICAgICAgICBsZXQgZmFjdG9yID0gNTtcbiAgICAgICAgc3dpdGNoICh0cnVlKSB7XG5cbiAgICAgICAgICAgIGNhc2UgIChkaXN0YW5jZSA8IDExMjguNDk3MjIwKSA6XG4gICAgICAgICAgICAgICAgem9vbSA9IDIwIC0gIGZhY3RvcjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgIChkaXN0YW5jZSA8IDIyNTYuOTk0NDQwKSA6XG4gICAgICAgICAgICAgICAgem9vbSA9IDE5IC0gIGZhY3RvcjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgIChkaXN0YW5jZSA8IDQ1MTMuOTg4ODgwKSA6XG4gICAgICAgICAgICAgICAgem9vbSA9IDE4IC0gIGZhY3RvcjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgIChkaXN0YW5jZSA8IDkwMjcuOTc3NzYxKSA6XG4gICAgICAgICAgICAgICAgem9vbSA9IDE3IC0gIGZhY3RvcjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgIChkaXN0YW5jZSA8IDE4MDU1Ljk1NTUyMCkgOlxuICAgICAgICAgICAgICAgIHpvb20gPSAxNiAtICBmYWN0b3I7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICAoZGlzdGFuY2UgPCAzNjExMS45MTEwNDApIDpcbiAgICAgICAgICAgICAgICB6b29tID0gMTUgLSAgZmFjdG9yO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAgKGRpc3RhbmNlIDwgNzIyMjMuODIyMDkwKSA6XG4gICAgICAgICAgICAgICAgem9vbSA9IDE0IC0gIGZhY3RvcjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgIChkaXN0YW5jZSA8IDE0NDQ0Ny42NDQyMDApIDpcbiAgICAgICAgICAgICAgICB6b29tID0gMTMgLSAgZmFjdG9yO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAgKGRpc3RhbmNlIDwgMjg4ODk1LjI4ODQwMCkgOlxuICAgICAgICAgICAgICAgIHpvb20gPSAxMiAtICBmYWN0b3I7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICAoZGlzdGFuY2UgPCA1Nzc3OTAuNTc2NzAwKSA6XG4gICAgICAgICAgICAgICAgem9vbSA9IDExIC0gIGZhY3RvcjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgIChkaXN0YW5jZSA8IDExNTU1ODEuMTUzMDAwKSA6XG4gICAgICAgICAgICAgICAgem9vbSA9IDEwIC0gIGZhY3RvcjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgIChkaXN0YW5jZSA8IDIzMTExNjIuMzA3MDAwKSA6XG4gICAgICAgICAgICAgICAgem9vbSA9IDkgLSAgZmFjdG9yO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAgKGRpc3RhbmNlIDwgNDYyMjMyNC42MTQwMDApIDpcbiAgICAgICAgICAgICAgICB6b29tID0gOCAtICBmYWN0b3I7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICAoZGlzdGFuY2UgPCA5MjQ0NjQ5LjIyNzAwMCkgOlxuICAgICAgICAgICAgICAgIHpvb20gPSA3IC0gIGZhY3RvcjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgIChkaXN0YW5jZSA8IDE4NDg5Mjk4LjQ1MDAwMCkgOlxuICAgICAgICAgICAgICAgIHpvb20gPSA2IC0gIGZhY3RvcjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgIChkaXN0YW5jZSA8IDM2OTc4NTk2LjkxMDAwMCkgOlxuICAgICAgICAgICAgICAgIHpvb20gPSA1IDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgIChkaXN0YW5jZSA8IDczOTU3MTkzLjgyMDAwMCkgOlxuICAgICAgICAgICAgICAgIHpvb20gPSA0IDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgIChkaXN0YW5jZSA8IDE0NzkxNDM4Ny42MDAwMDApIDpcbiAgICAgICAgICAgICAgICB6b29tID0gMyA7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICAoZGlzdGFuY2UgPCAyOTU4Mjg3NzUuMzAwMDAwKSA6XG4gICAgICAgICAgICAgICAgem9vbSA9IDIgO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAgKGRpc3RhbmNlIDwgNTkxNjU3NTUwLjUwMDAwMCkgOlxuICAgICAgICAgICAgICAgIHpvb20gPSAxIDtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB6b29tXG4gICAgfVxuXG59XG4iXX0=