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
        this.isExpenseAdded = true;
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
        this.isExpenseAdded = true;
    };
    AppointmentDetailComponent.prototype.saveExpense = function () {
        var _this = this;
        this.appointmentService.saveExpense(this.appointment, this.imagebase, this.expenseType, this.amount).catch(function (err) {
            console.dir(err);
            return err; // observable needs to be returned or exception raised
        }).subscribe(function (res) {
            _this.imagebase = null;
            _this.showToast('The Expense was successfully add it');
            _this.isExpenseAdded = false;
            _this.getExpenses();
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
        this.getExpenses();
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
    AppointmentDetailComponent.prototype.getExpenses = function () {
        var _this = this;
        this.appointmentService.getExpensesByAppointmentId(this.appointment.AppId.toString()).subscribe(function (res) {
            _this.expenses = res;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwb2ludG1lbnQtZGV0YWlsLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwcG9pbnRtZW50LWRldGFpbC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBNkQ7QUFDN0QsMENBQWlEO0FBQ2pELDZEQUEyRDtBQUUzRCwwQ0FBNEM7QUFFNUMsNkVBQXlFO0FBQ3pFLDRDQUE4QztBQUM5QywwRUFBd0U7QUFDeEUsNkVBQStFO0FBQy9FLHFCQUFxQixDQUFDLGVBQWUsQ0FBQyxVQUFVLEVBQUUsY0FBTSxPQUFBLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLFFBQVEsRUFBekMsQ0FBeUMsQ0FBQyxDQUFDO0FBQ25HLHFFQUFxSTtBQUVySSxrQ0FBZSxDQUFDLFNBQVMsRUFBRSxjQUFNLE9BQUEsT0FBTyxDQUFDLDhCQUE4QixDQUFDLENBQUMsT0FBTyxFQUEvQyxDQUErQyxDQUFDLENBQUM7QUFDbEYsMkVBQWlGO0FBZWpGO0lBMEJJLG9DQUNZLGtCQUFzQyxFQUN0QyxLQUFxQjtRQURyQix1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW9CO1FBQ3RDLFVBQUssR0FBTCxLQUFLLENBQWdCO1FBeEJ6QixhQUFRLEdBQUcsU0FBUyxDQUFDO1FBQ3JCLGNBQVMsR0FBRyxDQUFDLFNBQVMsQ0FBQztRQUN2QixjQUFTLEdBQUcsU0FBUyxDQUFDO1FBQ3RCLGVBQVUsR0FBRyxDQUFDLFFBQVEsQ0FBQztRQUMvQixpQ0FBaUM7UUFDakMsbUNBQW1DO1FBQzNCLFNBQUksR0FBRyxFQUFFLENBQUM7UUFDVixZQUFPLEdBQUcsQ0FBQyxDQUFDO1FBQ1osU0FBSSxHQUFHLENBQUMsQ0FBQztRQUVULFlBQU8sR0FBRyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRzNCLFdBQU0sR0FBUSxFQUFFLENBQUM7UUFDakIsZ0JBQVcsR0FBUSxFQUFFLENBQUM7UUFHdEIs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S0FBSyxDQUFDO1lBQ1YsS0FBTSxDQUFDLFFBQVEsR0FBRyxnQkFBZ0IsQ0FBQztnQkFDL0IsSUFBSSxHQUFHLENBQUMsQ0FBRTtnQkFDVixLQUFLLENBQUM7WUFDVixLQUFNLENBQUMsUUFBUSxHQUFHLGdCQUFnQixDQUFDO2dCQUMvQixJQUFJLEdBQUcsQ0FBQyxDQUFFO2dCQUNWLEtBQUssQ0FBQztZQUNWLEtBQU0sQ0FBQyxRQUFRLEdBQUcsZ0JBQWdCLENBQUM7Z0JBQy9CLElBQUksR0FBRyxDQUFDLENBQUU7Z0JBQ1YsS0FBSyxDQUFDO1lBRVY7Z0JBQ0ksS0FBSyxDQUFDO1FBQ2QsQ0FBQztRQUVELE1BQU0sQ0FBQyxJQUFJLENBQUE7SUFDZixDQUFDO0lBRUQsZ0RBQVcsR0FBWDtRQUFBLGlCQUlFO1FBSEcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLDBCQUEwQixDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLFVBQUEsR0FBRztZQUMvRixLQUFJLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQztRQUN4QixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFuU08sMEJBQTBCO1FBTnRDLGdCQUFTLENBQUM7WUFDUCxRQUFRLEVBQUUsWUFBWTtZQUN0QixRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7WUFDbkIsV0FBVyxFQUFFLHFDQUFxQztZQUNsRCxTQUFTLEVBQUUsQ0FBQywwQkFBMEIsQ0FBQztTQUMxQyxDQUFDO3lDQTRCa0Msd0NBQWtCO1lBQy9CLHVCQUFjO09BNUJ4QiwwQkFBMEIsQ0FxU3RDO0lBQUQsaUNBQUM7Q0FBQSxBQXJTRCxJQXFTQztBQXJTWSxnRUFBMEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgVmlld0NoaWxkIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IEFjdGl2YXRlZFJvdXRlIH0gZnJvbSBcIkBhbmd1bGFyL3JvdXRlclwiO1xuaW1wb3J0IHsgQXBwb2ludG1lbnRTZXJ2aWNlIH0gZnJvbSBcIi4vYXBwb2ludG1lbnQuc2VydmljZVwiO1xuaW1wb3J0IHsgQXBwb2ludG1lbnQgfSBmcm9tIFwiLi9hcHBvaW50bWVudC5tb2RlbFwiO1xuaW1wb3J0ICogYXMgVG9hc3QgZnJvbSBcIm5hdGl2ZXNjcmlwdC10b2FzdFwiO1xuaW1wb3J0IHsgVGVsZXBob255IH0gZnJvbSAnbmF0aXZlc2NyaXB0LXRlbGVwaG9ueSc7XG5pbXBvcnQgeyBNYXBWaWV3LCBNYXJrZXIsIFBvc2l0aW9uIH0gZnJvbSAnbmF0aXZlc2NyaXB0LWdvb2dsZS1tYXBzLXNkayc7XG5pbXBvcnQgKiBhcyBjYW1lcmEgZnJvbSBcIm5hdGl2ZXNjcmlwdC1jYW1lcmFcIjtcbmltcG9ydCB7IHJlZ2lzdGVyRWxlbWVudCB9IGZyb20gJ25hdGl2ZXNjcmlwdC1hbmd1bGFyL2VsZW1lbnQtcmVnaXN0cnknO1xuaW1wb3J0ICogYXMgZWxlbWVudFJlZ2lzdHJ5TW9kdWxlIGZyb20gJ25hdGl2ZXNjcmlwdC1hbmd1bGFyL2VsZW1lbnQtcmVnaXN0cnknO1xuZWxlbWVudFJlZ2lzdHJ5TW9kdWxlLnJlZ2lzdGVyRWxlbWVudChcIkNhcmRWaWV3XCIsICgpID0+IHJlcXVpcmUoXCJuYXRpdmVzY3JpcHQtY2FyZHZpZXdcIikuQ2FyZFZpZXcpO1xuaW1wb3J0IHsgaXNFbmFibGVkLCBlbmFibGVMb2NhdGlvblJlcXVlc3QsIGdldEN1cnJlbnRMb2NhdGlvbiwgd2F0Y2hMb2NhdGlvbiwgZGlzdGFuY2UsIGNsZWFyV2F0Y2ggfSBmcm9tIFwibmF0aXZlc2NyaXB0LWdlb2xvY2F0aW9uXCI7XG5pbXBvcnQgeyByZXNldENTU1Byb3BlcnRpZXMgfSBmcm9tIFwidG5zLWNvcmUtbW9kdWxlcy91aS9mcmFtZS9mcmFtZVwiO1xucmVnaXN0ZXJFbGVtZW50KCdNYXBWaWV3JywgKCkgPT4gcmVxdWlyZShcIm5hdGl2ZXNjcmlwdC1nb29nbGUtbWFwcy1zZGtcIikuTWFwVmlldyk7XG5pbXBvcnQgeyBmcm9tQXNzZXQsIGZyb21EYXRhIH0gZnJvbSBcInRucy1jb3JlLW1vZHVsZXMvaW1hZ2Utc291cmNlL2ltYWdlLXNvdXJjZVwiO1xuaW1wb3J0IHsgTG9vcEFwcG9pbnRtZW50IH0gZnJvbSBcIi4vbG9vcC9sb29wLWFwcG9pbnRtZW50Lm1vZGVsXCI7XG4vLyBpbXBvcnQgeyBhbmRyb2lkIH0gZnJvbSBcInRucy1jb3JlLW1vZHVsZXMvYXBwbGljYXRpb24vYXBwbGljYXRpb25cIjtcbi8vIGRlY2xhcmUgdmFyIEJpdG1hcEZhY3Rvcnk6IGFueVxuZGVjbGFyZSB2YXIgYW5kcm9pZDtcbmRlY2xhcmUgdmFyIGphdmE7XG5kZWNsYXJlIHZhciBieXRlO1xuZGVjbGFyZSB2YXIgQnl0ZUFycmF5T3V0cHV0U3RyZWFtO1xuZGVjbGFyZSB2YXIgQml0bWFwO1xuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6IFwibnMtZGV0YWlsc1wiLFxuICAgIG1vZHVsZUlkOiBtb2R1bGUuaWQsXG4gICAgdGVtcGxhdGVVcmw6IFwiLi9hcHBvaW50bWVudC1kZXRhaWwuY29tcG9uZW50Lmh0bWxcIixcbiAgICBzdHlsZVVybHM6IFsnLi9hcHBvaW50bWVudC1kZXRhaWwuY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgQXBwb2ludG1lbnREZXRhaWxDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICBcbiAgICBwcml2YXRlIGFwcG9pbnRtZW50OiBBcHBvaW50bWVudDtcbiAgICBwcml2YXRlIGV4cGVuc2VzOiBBcnJheTxvYmplY3Q+O1xuICAgIHByaXZhdGUgbGF0aXR1ZGUgPSAyNS43Njk0OTA7XG4gICAgcHJpdmF0ZSBsb25naXR1ZGUgPSAtODAuMTk1MjI0O1xuICAgIHByaXZhdGUgbGF0aXR1ZGUyID0gMjUuNzY5ODU5O1xuICAgIHByaXZhdGUgbG9uZ2l0dWRlMiA9IC04MC4xOTIzMDtcbiAgICAvLyBwcml2YXRlIGxhdGl0dWRlMiA9IDI1Ljc3NDM5NDtcbiAgICAvLyBwcml2YXRlIGxvbmdpdHVkZTIgPSAtODAuMTQxODUyO1xuICAgIHByaXZhdGUgem9vbSA9IDE2O1xuICAgIHByaXZhdGUgYmVhcmluZyA9IDA7XG4gICAgcHJpdmF0ZSB0aWx0ID0gMDtcbiAgICBwcml2YXRlIEN1cnJlbnRMb2NhdGlvbjtcbiAgICBwcml2YXRlIHBhZGRpbmcgPSBbNDAsIDQwLCA0MCwgNDBdO1xuICAgIHByaXZhdGUgbWFwVmlldzogTWFwVmlldztcbiAgICBwcml2YXRlIHBob25lTnVtYmVyOiBhbnk7XG4gICAgcHJpdmF0ZSBhbW91bnQ6IGFueSA9ICcnO1xuICAgIHByaXZhdGUgZXhwZW5zZVR5cGU6IGFueSA9ICcnO1xuICAgIHByaXZhdGUgaW1hZ2U6IHN0cmluZztcbiAgICBwcml2YXRlIGltYWdlYmFzZTogc3RyaW5nO1xuICAgIHByaXZhdGUgaXNFeHBlbnNlQWRkZWQ6IGJvb2xlYW4gPSB0cnVlO1xuICAgIC8vIHByaXZhdGUgaW1hZ2U6IGFueSA9IFwiaHR0cHM6Ly9wbGF5Lm5hdGl2ZXNjcmlwdC5vcmcvZGlzdC9hc3NldHMvaW1nL05hdGl2ZVNjcmlwdF9sb2dvLnBuZ1wiO1xuXG4gICAgbGFzdENhbWVyYTogU3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByaXZhdGUgYXBwb2ludG1lbnRTZXJ2aWNlOiBBcHBvaW50bWVudFNlcnZpY2UsXG4gICAgICAgIHByaXZhdGUgcm91dGU6IEFjdGl2YXRlZFJvdXRlKSB7XG4gICAgICAgIHRoaXMuYXBwb2ludG1lbnQgPSA8QXBwb2ludG1lbnQ+SlNPTi5wYXJzZSh0aGlzLnJvdXRlLnNuYXBzaG90LnBhcmFtc1tcImFwcG9pbnRtZW50XCJdKTtcbiAgICAgICAgY2FtZXJhLnJlcXVlc3RQZXJtaXNzaW9ucygpO1xuICAgIH1cblxuICAgIG5nT25Jbml0KCk6IHZvaWQge1xuICAgICAgIFxuICAgIH1cblxuICAgIHNob3dUb2FzdChtZXNzYWdlOiBzdHJpbmcpIHtcbiAgICAgICAgVG9hc3QubWFrZVRleHQobWVzc2FnZSwgXCJsb25nXCIpLnNob3coKTtcbiAgICB9XG5cbiAgICBhZGRFeHBlbnNlKCkge1xuICAgICAgICB2YXIgb3B0aW9ucyA9IHsgd2lkdGg6IDE1MCwgaGVpZ2h0OiAxNTAsIGtlZXBBc3BlY3RSYXRpbzogdHJ1ZSwgc2F2ZVRvR2FsbGVyeTogZmFsc2UgfTtcbiAgICAgICAgdGhpcy5pbWFnZWJhc2UgPSAnJztcbiAgICAgICAgdGhpcy5pbWFnZSA9ICcnO1xuICAgICAgICBjYW1lcmEudGFrZVBpY3R1cmUob3B0aW9ucylcbiAgICAgICAgICAgIC50aGVuKChpbWFnZUFzc2V0OiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICBmcm9tQXNzZXQoaW1hZ2VBc3NldCkudGhlbihyZXMgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmltYWdlYmFzZSA9IHJlcy50b0Jhc2U2NFN0cmluZyhcImpwZ1wiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbWFnZSA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LFwiICsgdGhpcy5pbWFnZWJhc2U7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW1hZ2ViYXNlID0gdGhpcy5pbWFnZWJhc2UucmVwbGFjZSgvXFwrL2csICctJyk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yIC0+IFwiICsgZXJyLm1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2hvd1RvYXN0KCdTb21ldGhpbmcgd2VudCB3cm9uZyBwbGVhc2UgdHJ5IGFnYWluIDogJyArIGVyci5tZXNzYWdlKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLmlzRXhwZW5zZUFkZGVkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBzYXZlRXhwZW5zZSgpIHtcbiAgICAgICAgdGhpcy5hcHBvaW50bWVudFNlcnZpY2Uuc2F2ZUV4cGVuc2UodGhpcy5hcHBvaW50bWVudCwgdGhpcy5pbWFnZWJhc2UsIHRoaXMuZXhwZW5zZVR5cGUsIHRoaXMuYW1vdW50KS5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5kaXIoZXJyKTtcbiAgICAgICAgICAgIHJldHVybiBlcnI7IC8vIG9ic2VydmFibGUgbmVlZHMgdG8gYmUgcmV0dXJuZWQgb3IgZXhjZXB0aW9uIHJhaXNlZFxuICAgICAgICB9KS5zdWJzY3JpYmUocmVzID0+IHtcbiAgICAgICAgICAgIHRoaXMuaW1hZ2ViYXNlID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuc2hvd1RvYXN0KCdUaGUgRXhwZW5zZSB3YXMgc3VjY2Vzc2Z1bGx5IGFkZCBpdCcpO1xuICAgICAgICAgICAgdGhpcy5pc0V4cGVuc2VBZGRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5nZXRFeHBlbnNlcygpO1xuICAgICAgICAgICAgY29uc29sZS5kaXIocmVzKTtcbiAgICAgICAgfSksIGVyciA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yOiBcIiArIGVyci5tZXNzYWdlKTtcbiAgICAgICAgICAgIHRoaXMuc2hvd1RvYXN0KCdTb21ldGhpbmcgd2VudCB3cm9uZyBwbGVhc2UgdHJ5IGFnYWluIDogJyArIGVyci5tZXNzYWdlKTtcbiAgICAgICAgICAgIGNvbnNvbGUuZGlyKGVycik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjaGVja2luTG9jYXRpb24oKTogYW55IHtcbiAgICAgICAgZ2V0Q3VycmVudExvY2F0aW9uKHsgZGVzaXJlZEFjY3VyYWN5OiAzLCB1cGRhdGVEaXN0YW5jZTogMSwgbWF4aW11bUFnZTogMjAwMDAsIHRpbWVvdXQ6IDIwMDAwIH0pLlxuICAgICAgICAgICAgdGhlbihsb2MgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChsb2MpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG1hcmtlciA9IG5ldyBNYXJrZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gdmFyIGFwcG9pbnRtZW50UG9zaXRpb24gPSBQb3NpdGlvbi5wb3NpdGlvbkZyb21MYXRMbmcoMjUuNzczNjk0LCAtODAuMjg1NDUxKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFwcG9pbnRtZW50UG9zaXRpb24gPSBQb3NpdGlvbi5wb3NpdGlvbkZyb21MYXRMbmcodGhpcy5sYXRpdHVkZSwgdGhpcy5sb25naXR1ZGUpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxhdGl0dWRlID0gbG9jLmxhdGl0dWRlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvbmdpdHVkZSA9IGxvYy5sb25naXR1ZGU7XG4gICAgICAgICAgICAgICAgICAgIC8vIG1hcmtlci5wb3NpdGlvbiA9IFBvc2l0aW9uLnBvc2l0aW9uRnJvbUxhdExuZyg0My4zNjI2ODQsIC03MS4xMDM1MzApO1xuICAgICAgICAgICAgICAgICAgICBtYXJrZXIucG9zaXRpb24gPSBQb3NpdGlvbi5wb3NpdGlvbkZyb21MYXRMbmcobG9jLmxhdGl0dWRlLCBsb2MubG9uZ2l0dWRlKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRpc3RhbmNlID0gdGhpcy5jYWxjdWxhdERpc3RhbmNlQmV0d2VlbnBvaW50cyhtYXJrZXIucG9zaXRpb24sIGFwcG9pbnRtZW50UG9zaXRpb24pO1xuICAgICAgICAgICAgICAgICAgICBtYXJrZXIudGl0bGUgPSBcIkN1cnJlbnQgUG9zaXRpb25cIjtcbiAgICAgICAgICAgICAgICAgICAgbWFya2VyLnNuaXBwZXQgPSBcIlVzYVwiO1xuICAgICAgICAgICAgICAgICAgICBtYXJrZXIudXNlckRhdGEgPSB7IGluZGV4OiAxIH07XG4gICAgICAgICAgICAgICAgICAgIG1hcmtlci5jb2xvciA9ICdncmVlbic7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy56b29tID0gdGhpcy56b29tRGlzdGFuY2UoZGlzdGFuY2UpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIHRoaXMuem9vbSA9IDEzO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGlzdGFuY2UgPCA4MDQuNjcyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFwcG9pbnRtZW50U2VydmljZS5zZXRHZW9Mb2NhdGlvbihtYXJrZXIucG9zaXRpb24sIHRoaXMuYXBwb2ludG1lbnQpLnN1YnNjcmliZShyZXMgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoaXMuYXBwb2ludG1lbnRTZXJ2aWNlLnNldEdlb0xvY2F0aW9uKGxvYywgdGhpcy5hcHBvaW50bWVudCkuc3Vic2NyaWJlKHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tYXBWaWV3LmFkZE1hcmtlcihtYXJrZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2hvd1RvYXN0KCcgWW91IGhhdmUgc3VjY2Vzc2Z1bGx5IGNoZWNrZWQgaW4geW91ciBsb2NhdGlvbicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgZXJyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYXJrZXIudGl0bGUgPSBcIllvdXIgYXJlIHRvbyBmYXIgYXdheSBmcm9tIHRoZSBjaGVjayBpbiBsb2NhdGlvbiBhZGRyZXNzXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBtYXJrZXIuc25pcHBldCA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYXJrZXIudXNlckRhdGEgPSB7IGluZGV4OiAxIH07XG4gICAgICAgICAgICAgICAgICAgICAgICBtYXJrZXIuY29sb3IgPSAneWVsbG93JztcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubWFwVmlldy5hZGRNYXJrZXIobWFya2VyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoaXMuem9vbSA9IDEzO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zaG93VG9hc3QoJ1lvdXIgYXJlIHRvbyBmYXIgYXdheSBmcm9tIGNoZWNrIGluIGxvY2F0aW9uIGFkZHJlc3MnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBtYXJrZXIuc2hvd0luZm9XaW5kb3coKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCAoZSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRXJyb3I6IFwiICsgZS5tZXNzYWdlKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIG9uTWFwUmVhZHkoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5tYXBWaWV3ID0gZXZlbnQub2JqZWN0O1xuXG4gICAgICAgIHRoaXMubWFwVmlldy5zZXR0aW5ncy56b29tR2VzdHVyZXNFbmFibGVkID0gdHJ1ZTtcblxuICAgICAgICB0aGlzLm1hcFZpZXcuc2V0dGluZ3MuY29tcGFzc0VuYWJsZWQgPSB0cnVlO1xuXG4gICAgICAgIHRoaXMubWFwVmlldy5zZXR0aW5ncy5pbmRvb3JMZXZlbFBpY2tlckVuYWJsZWQgPSB0cnVlO1xuXG4gICAgICAgIHRoaXMubWFwVmlldy5zZXR0aW5ncy5tYXBUb29sYmFyRW5hYmxlZCA9IHRydWU7XG5cbiAgICAgICAgdGhpcy5tYXBWaWV3LnNldHRpbmdzLm15TG9jYXRpb25CdXR0b25FbmFibGVkID0gdHJ1ZTtcblxuICAgICAgICB0aGlzLm1hcFZpZXcuc2V0dGluZ3Mucm90YXRlR2VzdHVyZXNFbmFibGVkID0gdHJ1ZTtcblxuICAgICAgICB0aGlzLm1hcFZpZXcuc2V0dGluZ3Muc2Nyb2xsR2VzdHVyZXNFbmFibGVkID0gdHJ1ZTtcblxuICAgICAgICB0aGlzLm1hcFZpZXcuc2V0dGluZ3MudGlsdEdlc3R1cmVzRW5hYmxlZCA9IHRydWU7XG5cbiAgICAgICAgdGhpcy5tYXBWaWV3LnNldHRpbmdzLnpvb21Db250cm9sc0VuYWJsZWQgPSB0cnVlO1xuXG4gICAgICAgIGxldCBhZGRyZXNzID0gdGhpcy5hcHBvaW50bWVudC5jbGlBZGRyZXNzMSArICcgJyArIHRoaXMuYXBwb2ludG1lbnQuY2xpQ2l0eSArICcgJyArIHRoaXMuYXBwb2ludG1lbnQuY2xpU3RhdGUgKyAnICcgKyB0aGlzLmFwcG9pbnRtZW50LmNsaVppcDtcbiAgICAgICAgdGhpcy5hcHBvaW50bWVudFNlcnZpY2UuZ2V0QXBwb2ludG1lbnRMb2NhdGlvbihhZGRyZXNzKS5zdWJzY3JpYmUoKHJlczogYW55KSA9PiB7XG4gICAgICAgICAgICB2YXIgbWFya2VyID0gbmV3IE1hcmtlcigpO1xuICAgICAgICAgICAgdGhpcy5sYXRpdHVkZSA9IHJlcy5yZXN1bHRzWzBdLmdlb21ldHJ5LmxvY2F0aW9uLmxhdDtcbiAgICAgICAgICAgIHRoaXMubG9uZ2l0dWRlID0gcmVzLnJlc3VsdHNbMF0uZ2VvbWV0cnkubG9jYXRpb24ubG5nO1xuICAgICAgICAgICAgLy8gdGhpcy5sYXRpdHVkZSA9IDI1Ljg1NDA1MDsgICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIHRoaXMubG9uZ2l0dWRlID0gLTgwLjIzMzI2NjtcbiAgICAgICAgICAgIG1hcmtlci5wb3NpdGlvbiA9IFBvc2l0aW9uLnBvc2l0aW9uRnJvbUxhdExuZyh0aGlzLmxhdGl0dWRlLCB0aGlzLmxvbmdpdHVkZSk7XG5cbiAgICAgICAgICAgIC8vIGNvbnNvbGUuZGlyKG1hcmtlci5wb3NpdGlvbik7XG5cbiAgICAgICAgICAgIG1hcmtlci50aXRsZSA9IHJlcy5yZXN1bHRzWzBdLmZvcm1hdHRlZF9hZGRyZXNzO1xuICAgICAgICAgICAgbWFya2VyLnNuaXBwZXQgPSBcIlwiO1xuXG4gICAgICAgICAgICBtYXJrZXIuY29sb3IgPSAnYmx1ZSdcbiAgICAgICAgICAgIG1hcmtlci51c2VyRGF0YSA9IHsgaW5kZXg6IDEgfTtcblxuICAgICAgICAgICAgdGhpcy56b29tID0gMTA7XG5cbiAgICAgICAgICAgIC8vIHZhciBtYXJrZXIyID0gbmV3IE1hcmtlcigpO1xuICAgICAgICAgICAgLy8gbWFya2VyMi5wb3NpdGlvbiA9IFBvc2l0aW9uLnBvc2l0aW9uRnJvbUxhdExuZyg0My4zNjI2ODQsIC03MS4xMDM1MzApO1xuICAgICAgICAgICAgLy8gbWFya2VyMi50aXRsZSA9IFwiQ3VzdG9tXCI7XG4gICAgICAgICAgICAvLyAvLyBtYXJrZXIyLmljb24gPSAnaHR0cHM6Ly9jaGFydC5hcGlzLmdvb2dsZS5jb20vY2hhcnQ/Y2hzdD1kX21hcF9waW5faWNvbiZjaGxkPWJ1c3xGRkZGMDAnO1xuICAgICAgICAgICAgLy8gbWFya2VyMi5zbmlwcGV0ID0gXCJjdXN0b21pemVkXCI7XG4gICAgICAgICAgICAvLyAvLyBtYXJrZXIyLmNvbG9yPSAncmVkJ1xuICAgICAgICAgICAgLy8gbWFya2VyMi51c2VyRGF0YSA9IHsgaW5kZXg6IDEgfTtcbiAgICAgICAgICAgIC8vIHRoaXMubWFwVmlldy5hZGRNYXJrZXIobWFya2VyLCBtYXJrZXIyKTtcbiAgICAgICAgICAgIHRoaXMubWFwVmlldy5hZGRNYXJrZXIobWFya2VyKTtcbiAgICAgICAgICAgIG1hcmtlci5zaG93SW5mb1dpbmRvdygpO1xuICAgICAgICB9KVxuXG4gICAgICAgIC8vIHRoaXMuYXBwb2ludG1lbnRTZXJ2aWNlLmxvb3BHZXRBcHBpb250bWVudHMoKS5jYXRjaChlcnIgPT4gIHsgXG4gICAgICAgIC8vICAgICBjb25zb2xlLmRpcihlcnIpOyAgICAgICAgICAgIFxuICAgICAgICAvLyAgICAgcmV0dXJuIGVycjsgLy8gb2JzZXJ2YWJsZSBuZWVkcyB0byBiZSByZXR1cm5lZCBvciBleGNlcHRpb24gcmFpc2VkXG4gICAgICAgIC8vICB9KS5zdWJzY3JpYmUocmVzID0+IHtcbiAgICAgICAgLy8gICAgIGNvbnNvbGUuZGlyKFwiYXBwb2ludG1lbnRzbG9vcCA6IFwiK3Jlcyk7XG5cbiAgICAgICAgLy8gfSlcbiAgICAgICAgdGhpcy5nZXRFeHBlbnNlcygpO1xuICAgIH1cblxuICAgIG9uQ29vcmRpbmF0ZVRhcHBlZChhcmdzKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiQ29vcmRpbmF0ZSBUYXBwZWQsIExhdDogXCIgKyBhcmdzLnBvc2l0aW9uLmxhdGl0dWRlICsgXCIsIExvbjogXCIgKyBhcmdzLnBvc2l0aW9uLmxvbmdpdHVkZSwgYXJncyk7XG4gICAgfVxuXG4gICAgb25NYXJrZXJFdmVudChhcmdzKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiTWFya2VyIEV2ZW50OiAnXCIgKyBhcmdzLmV2ZW50TmFtZVxuICAgICAgICAgICAgKyBcIicgdHJpZ2dlcmVkIG9uOiBcIiArIGFyZ3MubWFya2VyLnRpdGxlXG4gICAgICAgICAgICArIFwiLCBMYXQ6IFwiICsgYXJncy5tYXJrZXIucG9zaXRpb24ubGF0aXR1ZGUgKyBcIiwgTG9uOiBcIiArIGFyZ3MubWFya2VyLnBvc2l0aW9uLmxvbmdpdHVkZSwgYXJncyk7XG4gICAgfVxuXG4gICAgb25DYW1lcmFDaGFuZ2VkKGFyZ3MpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJDYW1lcmEgY2hhbmdlZDogXCIgKyBKU09OLnN0cmluZ2lmeShhcmdzLmNhbWVyYSksIEpTT04uc3RyaW5naWZ5KGFyZ3MuY2FtZXJhKSA9PT0gdGhpcy5sYXN0Q2FtZXJhKTtcbiAgICAgICAgLy8gdGhpcy5sYXN0Q2FtZXJhID0gSlNPTi5zdHJpbmdpZnkoYXJncy5jYW1lcmEpO1xuICAgIH1cblxuICAgIGNhbGN1bGF0RGlzdGFuY2VCZXR3ZWVucG9pbnRzKHAxLCBwMikge1xuICAgICAgICB2YXIgcmFkID0gZnVuY3Rpb24gKHgpIHtcbiAgICAgICAgICAgIHJldHVybiB4ICogTWF0aC5QSSAvIDE4MDtcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIFIgPSA2Mzc4MTM3OyAvLyBFYXJ0aOKAmXMgbWVhbiByYWRpdXMgaW4gbWV0ZXJcbiAgICAgICAgdmFyIGRMYXQgPSByYWQocDIubGF0aXR1ZGUgLSBwMS5sYXRpdHVkZSk7XG4gICAgICAgIHZhciBkTG9uZyA9IHJhZChwMi5sb25naXR1ZGUgLSBwMS5sb25naXR1ZGUpO1xuICAgICAgICB2YXIgYSA9IE1hdGguc2luKGRMYXQgLyAyKSAqIE1hdGguc2luKGRMYXQgLyAyKSArXG4gICAgICAgICAgICBNYXRoLmNvcyhyYWQocDEubGF0aXR1ZGUpKSAqIE1hdGguY29zKHJhZChwMi5sYXRpdHVkZSkpICpcbiAgICAgICAgICAgIE1hdGguc2luKGRMb25nIC8gMikgKiBNYXRoLnNpbihkTG9uZyAvIDIpO1xuICAgICAgICB2YXIgYyA9IDIgKiBNYXRoLmF0YW4yKE1hdGguc3FydChhKSwgTWF0aC5zcXJ0KDEgLSBhKSk7XG4gICAgICAgIHZhciBkID0gUiAqIGM7XG4gICAgICAgIHJldHVybiBkOyAvLyByZXR1cm5zIHRoZSBkaXN0YW5jZSBpbiBtZXRlciAgICAgICAgICBcbiAgICB9XG5cblxuICAgIHpvb21EaXN0YW5jZShkaXN0YW5jZSkge1xuICAgICAgICBsZXQgem9vbSA9IDEzO1xuICAgICAgICBsZXQgZmFjdG9yID0gNTtcbiAgICAgICAgc3dpdGNoICh0cnVlKSB7XG5cbiAgICAgICAgICAgIGNhc2UgIChkaXN0YW5jZSA8IDExMjguNDk3MjIwKSA6XG4gICAgICAgICAgICAgICAgem9vbSA9IDIwIC0gIGZhY3RvcjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgIChkaXN0YW5jZSA8IDIyNTYuOTk0NDQwKSA6XG4gICAgICAgICAgICAgICAgem9vbSA9IDE5IC0gIGZhY3RvcjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgIChkaXN0YW5jZSA8IDQ1MTMuOTg4ODgwKSA6XG4gICAgICAgICAgICAgICAgem9vbSA9IDE4IC0gIGZhY3RvcjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgIChkaXN0YW5jZSA8IDkwMjcuOTc3NzYxKSA6XG4gICAgICAgICAgICAgICAgem9vbSA9IDE3IC0gIGZhY3RvcjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgIChkaXN0YW5jZSA8IDE4MDU1Ljk1NTUyMCkgOlxuICAgICAgICAgICAgICAgIHpvb20gPSAxNiAtICBmYWN0b3I7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICAoZGlzdGFuY2UgPCAzNjExMS45MTEwNDApIDpcbiAgICAgICAgICAgICAgICB6b29tID0gMTUgLSAgZmFjdG9yO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAgKGRpc3RhbmNlIDwgNzIyMjMuODIyMDkwKSA6XG4gICAgICAgICAgICAgICAgem9vbSA9IDE0IC0gIGZhY3RvcjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgIChkaXN0YW5jZSA8IDE0NDQ0Ny42NDQyMDApIDpcbiAgICAgICAgICAgICAgICB6b29tID0gMTMgLSAgZmFjdG9yO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAgKGRpc3RhbmNlIDwgMjg4ODk1LjI4ODQwMCkgOlxuICAgICAgICAgICAgICAgIHpvb20gPSAxMiAtICBmYWN0b3I7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICAoZGlzdGFuY2UgPCA1Nzc3OTAuNTc2NzAwKSA6XG4gICAgICAgICAgICAgICAgem9vbSA9IDExIC0gIGZhY3RvcjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgIChkaXN0YW5jZSA8IDExNTU1ODEuMTUzMDAwKSA6XG4gICAgICAgICAgICAgICAgem9vbSA9IDEwIC0gIGZhY3RvcjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgIChkaXN0YW5jZSA8IDIzMTExNjIuMzA3MDAwKSA6XG4gICAgICAgICAgICAgICAgem9vbSA9IDkgLSAgZmFjdG9yO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAgKGRpc3RhbmNlIDwgNDYyMjMyNC42MTQwMDApIDpcbiAgICAgICAgICAgICAgICB6b29tID0gOCAtICBmYWN0b3I7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICAoZGlzdGFuY2UgPCA5MjQ0NjQ5LjIyNzAwMCkgOlxuICAgICAgICAgICAgICAgIHpvb20gPSA3IC0gIGZhY3RvcjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgIChkaXN0YW5jZSA8IDE4NDg5Mjk4LjQ1MDAwMCkgOlxuICAgICAgICAgICAgICAgIHpvb20gPSA2IC0gIGZhY3RvcjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgIChkaXN0YW5jZSA8IDM2OTc4NTk2LjkxMDAwMCkgOlxuICAgICAgICAgICAgICAgIHpvb20gPSA1IDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgIChkaXN0YW5jZSA8IDczOTU3MTkzLjgyMDAwMCkgOlxuICAgICAgICAgICAgICAgIHpvb20gPSA0IDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgIChkaXN0YW5jZSA8IDE0NzkxNDM4Ny42MDAwMDApIDpcbiAgICAgICAgICAgICAgICB6b29tID0gMyA7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICAoZGlzdGFuY2UgPCAyOTU4Mjg3NzUuMzAwMDAwKSA6XG4gICAgICAgICAgICAgICAgem9vbSA9IDIgO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAgKGRpc3RhbmNlIDwgNTkxNjU3NTUwLjUwMDAwMCkgOlxuICAgICAgICAgICAgICAgIHpvb20gPSAxIDtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB6b29tXG4gICAgfVxuXG4gICAgZ2V0RXhwZW5zZXMoKTogYW55IHsgICAgXG4gICAgICAgICB0aGlzLmFwcG9pbnRtZW50U2VydmljZS5nZXRFeHBlbnNlc0J5QXBwb2ludG1lbnRJZCh0aGlzLmFwcG9pbnRtZW50LkFwcElkLnRvU3RyaW5nKCkpLnN1YnNjcmliZShyZXMgPT4ge1xuICAgICAgICAgICAgIHRoaXMuZXhwZW5zZXMgPSByZXM7XG4gICAgICAgICB9KTtcbiAgICAgfVxuXG59XG4iXX0=