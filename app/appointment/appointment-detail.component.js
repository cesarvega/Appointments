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
        this.selectedIndex = 1;
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
        this.options = ["1. Billable Travel Meals         ▾",
            "2. Billable Travel Non-Meals     ▾",
            "3. Non-Billable Travel Meals     ▾",
            "4. Non-Billable Travel Non-Meals ▾"];
        this.appointment = JSON.parse(this.route.snapshot.params["appointment"]);
        camera.requestPermissions();
    }
    AppointmentDetailComponent.prototype.ngOnInit = function () {
        this.saveLocation();
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
        this.appointmentService.saveExpense(this.appointment, this.imagebase, this.selectedIndex.toString(), this.amount).catch(function (err) {
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
                    _this.appointmentService.setGeoLocation(marker.position, _this.appointment).subscribe(function (res) {
                        // this.appointmentService.setGeoLocation(loc, this.appointment).subscribe(res => {
                        console.log('bad checked in happening ');
                    }, function (err) {
                        console.log(err);
                    });
                }
                marker.showInfoWindow();
            }
        }, function (e) {
            console.log("Error: " + e.message);
        });
    };
    AppointmentDetailComponent.prototype.saveLocation = function () {
        var _this = this;
        nativescript_geolocation_1.getCurrentLocation({ desiredAccuracy: 3, updateDistance: 1, maximumAge: 20000, timeout: 20000 }).
            then(function (loc) {
            if (loc) {
                var marker = new nativescript_google_maps_sdk_1.Marker();
                var appointmentPosition = nativescript_google_maps_sdk_1.Position.positionFromLatLng(_this.latitude, _this.longitude);
                _this.latitude = loc.latitude;
                _this.longitude = loc.longitude;
                marker.position = nativescript_google_maps_sdk_1.Position.positionFromLatLng(loc.latitude, loc.longitude);
                var distance = _this.calculatDistanceBetweenpoints(marker.position, appointmentPosition);
                _this.appointmentService.testService(marker.position, _this.appointment);
                _this.appointmentService.setGeoLocation(marker.position, _this.appointment).subscribe(function (res) {
                    console.log('location stored on server');
                }, function (err) {
                    console.log(err);
                });
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
            res.forEach(function (element) {
                element.recType = _this.options[element.recType];
            });
            _this.expenses = res;
        });
    };
    AppointmentDetailComponent.prototype.onchange = function (args) {
        console.log("Drop Down selected index changed from " + args.oldIndex + " to " + args.newIndex);
    };
    AppointmentDetailComponent.prototype.onopen = function () {
        console.log("Drop Down opened.");
    };
    AppointmentDetailComponent.prototype.onclose = function () {
        console.log("Drop Down closed.");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwb2ludG1lbnQtZGV0YWlsLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwcG9pbnRtZW50LWRldGFpbC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBNkQ7QUFDN0QsMENBQWlEO0FBQ2pELDZEQUEyRDtBQUUzRCwwQ0FBNEM7QUFFNUMsNkVBQXlFO0FBQ3pFLDRDQUE4QztBQUM5QywwRUFBd0U7QUFDeEUsNkVBQStFO0FBQy9FLHFCQUFxQixDQUFDLGVBQWUsQ0FBQyxVQUFVLEVBQUUsY0FBTSxPQUFBLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLFFBQVEsRUFBekMsQ0FBeUMsQ0FBQyxDQUFDO0FBQ25HLHFFQUFxSTtBQUVySSxrQ0FBZSxDQUFDLFNBQVMsRUFBRSxjQUFNLE9BQUEsT0FBTyxDQUFDLDhCQUE4QixDQUFDLENBQUMsT0FBTyxFQUEvQyxDQUErQyxDQUFDLENBQUM7QUFDbEYsMkVBQWlGO0FBbUJqRjtJQWlDSSxvQ0FDWSxrQkFBc0MsRUFDdEMsS0FBcUI7UUFEckIsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUFvQjtRQUN0QyxVQUFLLEdBQUwsS0FBSyxDQUFnQjtRQWpDekIsa0JBQWEsR0FBRyxDQUFDLENBQUM7UUFHbEIsYUFBUSxHQUFHLFNBQVMsQ0FBQztRQUNyQixjQUFTLEdBQUcsQ0FBQyxTQUFTLENBQUM7UUFDdkIsY0FBUyxHQUFHLFNBQVMsQ0FBQztRQUN0QixlQUFVLEdBQUcsQ0FBQyxRQUFRLENBQUM7UUFDL0IsaUNBQWlDO1FBQ2pDLG1DQUFtQztRQUMzQixTQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ1YsWUFBTyxHQUFHLENBQUMsQ0FBQztRQUNaLFNBQUksR0FBRyxDQUFDLENBQUM7UUFFVCxZQUFPLEdBQUcsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUczQixXQUFNLEdBQVEsRUFBRSxDQUFDO1FBQ2pC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QVJHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQywwQkFBMEIsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxVQUFBLEdBQUc7WUFFaEcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxVQUFBLE9BQU87Z0JBQ2YsT0FBTyxDQUFDLE9BQU8sR0FBRyxLQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNwRCxDQUFDLENBQUMsQ0FBQztZQUVGLEtBQUksQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDO1FBQ3hCLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVBLDZDQUFRLEdBQVIsVUFBUyxJQUFtQztRQUMxQyxPQUFPLENBQUMsR0FBRyxDQUFDLDJDQUF5QyxJQUFJLENBQUMsUUFBUSxZQUFPLElBQUksQ0FBQyxRQUFVLENBQUMsQ0FBQztJQUM5RixDQUFDO0lBRUEsMkNBQU0sR0FBTjtRQUNHLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBRUEsNENBQU8sR0FBUDtRQUNHLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBeFZRLDBCQUEwQjtRQU50QyxnQkFBUyxDQUFDO1lBQ1AsUUFBUSxFQUFFLFlBQVk7WUFDdEIsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFO1lBQ25CLFdBQVcsRUFBRSxxQ0FBcUM7WUFDbEQsU0FBUyxFQUFFLENBQUMsMEJBQTBCLENBQUM7U0FDMUMsQ0FBQzt5Q0FtQ2tDLHdDQUFrQjtZQUMvQix1QkFBYztPQW5DeEIsMEJBQTBCLENBeVZ0QztJQUFELGlDQUFDO0NBQUEsQUF6VkQsSUF5VkM7QUF6VlksZ0VBQTBCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIFZpZXdDaGlsZCB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBBY3RpdmF0ZWRSb3V0ZSB9IGZyb20gXCJAYW5ndWxhci9yb3V0ZXJcIjtcbmltcG9ydCB7IEFwcG9pbnRtZW50U2VydmljZSB9IGZyb20gXCIuL2FwcG9pbnRtZW50LnNlcnZpY2VcIjtcbmltcG9ydCB7IEFwcG9pbnRtZW50IH0gZnJvbSBcIi4vYXBwb2ludG1lbnQubW9kZWxcIjtcbmltcG9ydCAqIGFzIFRvYXN0IGZyb20gXCJuYXRpdmVzY3JpcHQtdG9hc3RcIjtcbmltcG9ydCB7IFRlbGVwaG9ueSB9IGZyb20gJ25hdGl2ZXNjcmlwdC10ZWxlcGhvbnknO1xuaW1wb3J0IHsgTWFwVmlldywgTWFya2VyLCBQb3NpdGlvbiB9IGZyb20gJ25hdGl2ZXNjcmlwdC1nb29nbGUtbWFwcy1zZGsnO1xuaW1wb3J0ICogYXMgY2FtZXJhIGZyb20gXCJuYXRpdmVzY3JpcHQtY2FtZXJhXCI7XG5pbXBvcnQgeyByZWdpc3RlckVsZW1lbnQgfSBmcm9tICduYXRpdmVzY3JpcHQtYW5ndWxhci9lbGVtZW50LXJlZ2lzdHJ5JztcbmltcG9ydCAqIGFzIGVsZW1lbnRSZWdpc3RyeU1vZHVsZSBmcm9tICduYXRpdmVzY3JpcHQtYW5ndWxhci9lbGVtZW50LXJlZ2lzdHJ5JztcbmVsZW1lbnRSZWdpc3RyeU1vZHVsZS5yZWdpc3RlckVsZW1lbnQoXCJDYXJkVmlld1wiLCAoKSA9PiByZXF1aXJlKFwibmF0aXZlc2NyaXB0LWNhcmR2aWV3XCIpLkNhcmRWaWV3KTtcbmltcG9ydCB7IGlzRW5hYmxlZCwgZW5hYmxlTG9jYXRpb25SZXF1ZXN0LCBnZXRDdXJyZW50TG9jYXRpb24sIHdhdGNoTG9jYXRpb24sIGRpc3RhbmNlLCBjbGVhcldhdGNoIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1nZW9sb2NhdGlvblwiO1xuaW1wb3J0IHsgcmVzZXRDU1NQcm9wZXJ0aWVzIH0gZnJvbSBcInRucy1jb3JlLW1vZHVsZXMvdWkvZnJhbWUvZnJhbWVcIjtcbnJlZ2lzdGVyRWxlbWVudCgnTWFwVmlldycsICgpID0+IHJlcXVpcmUoXCJuYXRpdmVzY3JpcHQtZ29vZ2xlLW1hcHMtc2RrXCIpLk1hcFZpZXcpO1xuaW1wb3J0IHsgZnJvbUFzc2V0LCBmcm9tRGF0YSB9IGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL2ltYWdlLXNvdXJjZS9pbWFnZS1zb3VyY2VcIjtcbmltcG9ydCB7IExvb3BBcHBvaW50bWVudCB9IGZyb20gXCIuL2xvb3AvbG9vcC1hcHBvaW50bWVudC5tb2RlbFwiO1xuLy8gaW1wb3J0IHsgRHJvcERvd24gfSBmcm9tICduYXRpdmVzY3JpcHQtZHJvcC1kb3duJztcbmltcG9ydCB7IFZhbHVlTGlzdCB9IGZyb20gXCJuYXRpdmVzY3JpcHQtZHJvcC1kb3duXCI7XG5pbXBvcnQgeyBTZWxlY3RlZEluZGV4Q2hhbmdlZEV2ZW50RGF0YSB9IGZyb20gXCJuYXRpdmVzY3JpcHQtZHJvcC1kb3duXCI7XG5pbXBvcnQgeyBmb3JFYWNoIH0gZnJvbSBcIkBhbmd1bGFyL3JvdXRlci9zcmMvdXRpbHMvY29sbGVjdGlvblwiO1xuLy8gaW1wb3J0IHsgYW5kcm9pZCB9IGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL2FwcGxpY2F0aW9uL2FwcGxpY2F0aW9uXCI7XG4vLyBkZWNsYXJlIHZhciBCaXRtYXBGYWN0b3J5OiBhbnlcbmRlY2xhcmUgdmFyIGFuZHJvaWQ7XG5kZWNsYXJlIHZhciBqYXZhO1xuZGVjbGFyZSB2YXIgYnl0ZTtcbmRlY2xhcmUgdmFyIEJ5dGVBcnJheU91dHB1dFN0cmVhbTtcbmRlY2xhcmUgdmFyIEJpdG1hcDtcbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiBcIm5zLWRldGFpbHNcIixcbiAgICBtb2R1bGVJZDogbW9kdWxlLmlkLFxuICAgIHRlbXBsYXRlVXJsOiBcIi4vYXBwb2ludG1lbnQtZGV0YWlsLmNvbXBvbmVudC5odG1sXCIsXG4gICAgc3R5bGVVcmxzOiBbJy4vYXBwb2ludG1lbnQtZGV0YWlsLmNzcyddXG59KVxuZXhwb3J0IGNsYXNzIEFwcG9pbnRtZW50RGV0YWlsQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgICBcbiAgICBwdWJsaWMgIHNlbGVjdGVkSW5kZXggPSAxO1xuICAgIHByaXZhdGUgYXBwb2ludG1lbnQ6IEFwcG9pbnRtZW50O1xuICAgIHByaXZhdGUgZXhwZW5zZXM6IEFycmF5PG9iamVjdD47XG4gICAgcHJpdmF0ZSBsYXRpdHVkZSA9IDI1Ljc2OTQ5MDtcbiAgICBwcml2YXRlIGxvbmdpdHVkZSA9IC04MC4xOTUyMjQ7XG4gICAgcHJpdmF0ZSBsYXRpdHVkZTIgPSAyNS43Njk4NTk7XG4gICAgcHJpdmF0ZSBsb25naXR1ZGUyID0gLTgwLjE5MjMwO1xuICAgIC8vIHByaXZhdGUgbGF0aXR1ZGUyID0gMjUuNzc0Mzk0O1xuICAgIC8vIHByaXZhdGUgbG9uZ2l0dWRlMiA9IC04MC4xNDE4NTI7XG4gICAgcHJpdmF0ZSB6b29tID0gMTY7XG4gICAgcHJpdmF0ZSBiZWFyaW5nID0gMDtcbiAgICBwcml2YXRlIHRpbHQgPSAwO1xuICAgIHByaXZhdGUgQ3VycmVudExvY2F0aW9uO1xuICAgIHByaXZhdGUgcGFkZGluZyA9IFs0MCwgNDAsIDQwLCA0MF07XG4gICAgcHJpdmF0ZSBtYXBWaWV3OiBNYXBWaWV3O1xuICAgIHByaXZhdGUgcGhvbmVOdW1iZXI6IGFueTtcbiAgICBwcml2YXRlIGFtb3VudDogYW55ID0gJyc7XG4gICAgcHJpdmF0ZSBleHBlbnNlVHlwZTogYW55ID0gJyc7XG4gICAgcHJpdmF0ZSBpbWFnZTogc3RyaW5nO1xuICAgIHByaXZhdGUgaW1hZ2ViYXNlOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBpc0V4cGVuc2VBZGRlZDogYm9vbGVhbiA9IHRydWU7XG4gICAgcHJpdmF0ZSBvcHRpb25zID0gWyBcIjEuIEJpbGxhYmxlIFRyYXZlbCBNZWFscyAgICAgICAgIOKWvlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCIyLiBCaWxsYWJsZSBUcmF2ZWwgTm9uLU1lYWxzICAgICDilr5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiMy4gTm9uLUJpbGxhYmxlIFRyYXZlbCBNZWFscyAgICAg4pa+XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIjQuIE5vbi1CaWxsYWJsZSBUcmF2ZWwgTm9uLU1lYWxzIOKWvlwiXTtcblxuICAgICAgICAgICBcbiAgICBcbiAgICAvLyBwcml2YXRlIGltYWdlOiBhbnkgPSBcImh0dHBzOi8vcGxheS5uYXRpdmVzY3JpcHQub3JnL2Rpc3QvYXNzZXRzL2ltZy9OYXRpdmVTY3JpcHRfbG9nby5wbmdcIjtcbiAgICBsYXN0Q2FtZXJhOiBTdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJpdmF0ZSBhcHBvaW50bWVudFNlcnZpY2U6IEFwcG9pbnRtZW50U2VydmljZSxcbiAgICAgICAgcHJpdmF0ZSByb3V0ZTogQWN0aXZhdGVkUm91dGUpIHtcbiAgICAgICAgdGhpcy5hcHBvaW50bWVudCA9IDxBcHBvaW50bWVudD5KU09OLnBhcnNlKHRoaXMucm91dGUuc25hcHNob3QucGFyYW1zW1wiYXBwb2ludG1lbnRcIl0pO1xuICAgICAgICBjYW1lcmEucmVxdWVzdFBlcm1pc3Npb25zKCk7ICAgICAgICBcbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICAgICB0aGlzLnNhdmVMb2NhdGlvbigpO1xuICAgIH1cblxuICAgIHNob3dUb2FzdChtZXNzYWdlOiBzdHJpbmcpIHtcbiAgICAgICAgVG9hc3QubWFrZVRleHQobWVzc2FnZSwgXCJsb25nXCIpLnNob3coKTtcbiAgICB9XG5cbiAgICBhZGRFeHBlbnNlKCkge1xuICAgICAgICB2YXIgb3B0aW9ucyA9IHsgd2lkdGg6IDE1MCwgaGVpZ2h0OiAxNTAsIGtlZXBBc3BlY3RSYXRpbzogdHJ1ZSwgc2F2ZVRvR2FsbGVyeTogZmFsc2UgfTtcbiAgICAgICAgdGhpcy5pbWFnZWJhc2UgPSAnJztcbiAgICAgICAgdGhpcy5pbWFnZSA9ICcnO1xuICAgICAgICBjYW1lcmEudGFrZVBpY3R1cmUob3B0aW9ucylcbiAgICAgICAgICAgIC50aGVuKChpbWFnZUFzc2V0OiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICBmcm9tQXNzZXQoaW1hZ2VBc3NldCkudGhlbihyZXMgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmltYWdlYmFzZSA9IHJlcy50b0Jhc2U2NFN0cmluZyhcImpwZ1wiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbWFnZSA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LFwiICsgdGhpcy5pbWFnZWJhc2U7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW1hZ2ViYXNlID0gdGhpcy5pbWFnZWJhc2UucmVwbGFjZSgvXFwrL2csICctJyk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yIC0+IFwiICsgZXJyLm1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2hvd1RvYXN0KCdTb21ldGhpbmcgd2VudCB3cm9uZyBwbGVhc2UgdHJ5IGFnYWluIDogJyArIGVyci5tZXNzYWdlKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLmlzRXhwZW5zZUFkZGVkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBzYXZlRXhwZW5zZSgpIHtcbiAgICAgICAgdGhpcy5hcHBvaW50bWVudFNlcnZpY2Uuc2F2ZUV4cGVuc2UodGhpcy5hcHBvaW50bWVudCwgdGhpcy5pbWFnZWJhc2UsIHRoaXMuc2VsZWN0ZWRJbmRleC50b1N0cmluZygpLCB0aGlzLmFtb3VudCkuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUuZGlyKGVycik7XG4gICAgICAgICAgICByZXR1cm4gZXJyOyAvLyBvYnNlcnZhYmxlIG5lZWRzIHRvIGJlIHJldHVybmVkIG9yIGV4Y2VwdGlvbiByYWlzZWRcbiAgICAgICAgfSkuc3Vic2NyaWJlKHJlcyA9PiB7XG4gICAgICAgICAgICB0aGlzLmltYWdlYmFzZSA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLnNob3dUb2FzdCgnVGhlIEV4cGVuc2Ugd2FzIHN1Y2Nlc3NmdWxseSBhZGQgaXQnKTtcbiAgICAgICAgICAgIHRoaXMuaXNFeHBlbnNlQWRkZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuZ2V0RXhwZW5zZXMoKTtcbiAgICAgICAgICAgIGNvbnNvbGUuZGlyKHJlcyk7XG4gICAgICAgIH0pLCBlcnIgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnJvcjogXCIgKyBlcnIubWVzc2FnZSk7XG4gICAgICAgICAgICB0aGlzLnNob3dUb2FzdCgnU29tZXRoaW5nIHdlbnQgd3JvbmcgcGxlYXNlIHRyeSBhZ2FpbiA6ICcgKyBlcnIubWVzc2FnZSk7XG4gICAgICAgICAgICBjb25zb2xlLmRpcihlcnIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2hlY2tpbkxvY2F0aW9uKCk6IGFueSB7XG4gICAgICAgIGdldEN1cnJlbnRMb2NhdGlvbih7IGRlc2lyZWRBY2N1cmFjeTogMywgdXBkYXRlRGlzdGFuY2U6IDEsIG1heGltdW1BZ2U6IDIwMDAwLCB0aW1lb3V0OiAyMDAwMCB9KS5cbiAgICAgICAgICAgIHRoZW4obG9jID0+IHtcbiAgICAgICAgICAgICAgICBpZiAobG9jKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBtYXJrZXIgPSBuZXcgTWFya2VyKCk7XG4gICAgICAgICAgICAgICAgICAgIC8vIHZhciBhcHBvaW50bWVudFBvc2l0aW9uID0gUG9zaXRpb24ucG9zaXRpb25Gcm9tTGF0TG5nKDI1Ljc3MzY5NCwgLTgwLjI4NTQ1MSk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhcHBvaW50bWVudFBvc2l0aW9uID0gUG9zaXRpb24ucG9zaXRpb25Gcm9tTGF0TG5nKHRoaXMubGF0aXR1ZGUsIHRoaXMubG9uZ2l0dWRlKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sYXRpdHVkZSA9IGxvYy5sYXRpdHVkZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb25naXR1ZGUgPSBsb2MubG9uZ2l0dWRlO1xuICAgICAgICAgICAgICAgICAgICAvLyBtYXJrZXIucG9zaXRpb24gPSBQb3NpdGlvbi5wb3NpdGlvbkZyb21MYXRMbmcoNDMuMzYyNjg0LCAtNzEuMTAzNTMwKTtcbiAgICAgICAgICAgICAgICAgICAgbWFya2VyLnBvc2l0aW9uID0gUG9zaXRpb24ucG9zaXRpb25Gcm9tTGF0TG5nKGxvYy5sYXRpdHVkZSwgbG9jLmxvbmdpdHVkZSk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBkaXN0YW5jZSA9IHRoaXMuY2FsY3VsYXREaXN0YW5jZUJldHdlZW5wb2ludHMobWFya2VyLnBvc2l0aW9uLCBhcHBvaW50bWVudFBvc2l0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgbWFya2VyLnRpdGxlID0gXCJDdXJyZW50IFBvc2l0aW9uXCI7XG4gICAgICAgICAgICAgICAgICAgIG1hcmtlci5zbmlwcGV0ID0gXCJVc2FcIjtcbiAgICAgICAgICAgICAgICAgICAgbWFya2VyLnVzZXJEYXRhID0geyBpbmRleDogMSB9O1xuICAgICAgICAgICAgICAgICAgICBtYXJrZXIuY29sb3IgPSAnZ3JlZW4nO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuem9vbSA9IHRoaXMuem9vbURpc3RhbmNlKGRpc3RhbmNlKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLnpvb20gPSAxMztcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRpc3RhbmNlIDwgODA0LjY3Mikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hcHBvaW50bWVudFNlcnZpY2Uuc2V0R2VvTG9jYXRpb24obWFya2VyLnBvc2l0aW9uLCB0aGlzLmFwcG9pbnRtZW50KS5zdWJzY3JpYmUocmVzID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLmFwcG9pbnRtZW50U2VydmljZS5zZXRHZW9Mb2NhdGlvbihsb2MsIHRoaXMuYXBwb2ludG1lbnQpLnN1YnNjcmliZShyZXMgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubWFwVmlldy5hZGRNYXJrZXIobWFya2VyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNob3dUb2FzdCgnIFlvdSBoYXZlIHN1Y2Nlc3NmdWxseSBjaGVja2VkIGluIHlvdXIgbG9jYXRpb24nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIGVyciA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWFya2VyLnRpdGxlID0gXCJZb3VyIGFyZSB0b28gZmFyIGF3YXkgZnJvbSB0aGUgY2hlY2sgaW4gbG9jYXRpb24gYWRkcmVzc1wiO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbWFya2VyLnNuaXBwZXQgPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgbWFya2VyLnVzZXJEYXRhID0geyBpbmRleDogMSB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgbWFya2VyLmNvbG9yID0gJ3llbGxvdyc7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1hcFZpZXcuYWRkTWFya2VyKG1hcmtlcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLnpvb20gPSAxMztcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2hvd1RvYXN0KCdZb3VyIGFyZSB0b28gZmFyIGF3YXkgZnJvbSBjaGVjayBpbiBsb2NhdGlvbiBhZGRyZXNzJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYXBwb2ludG1lbnRTZXJ2aWNlLnNldEdlb0xvY2F0aW9uKG1hcmtlci5wb3NpdGlvbiwgdGhpcy5hcHBvaW50bWVudCkuc3Vic2NyaWJlKHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhpcy5hcHBvaW50bWVudFNlcnZpY2Uuc2V0R2VvTG9jYXRpb24obG9jLCB0aGlzLmFwcG9pbnRtZW50KS5zdWJzY3JpYmUocmVzID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2JhZCBjaGVja2VkIGluIGhhcHBlbmluZyAnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIGVyciA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBtYXJrZXIuc2hvd0luZm9XaW5kb3coKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCAoZSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRXJyb3I6IFwiICsgZS5tZXNzYWdlKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIHNhdmVMb2NhdGlvbigpOiBhbnkge1xuICAgICAgICBnZXRDdXJyZW50TG9jYXRpb24oeyBkZXNpcmVkQWNjdXJhY3k6IDMsIHVwZGF0ZURpc3RhbmNlOiAxLCBtYXhpbXVtQWdlOiAyMDAwMCwgdGltZW91dDogMjAwMDAgfSkuXG4gICAgICAgICAgICB0aGVuKGxvYyA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGxvYykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbWFya2VyID0gbmV3IE1hcmtlcigpOyAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHZhciBhcHBvaW50bWVudFBvc2l0aW9uID0gUG9zaXRpb24ucG9zaXRpb25Gcm9tTGF0TG5nKHRoaXMubGF0aXR1ZGUsIHRoaXMubG9uZ2l0dWRlKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sYXRpdHVkZSA9IGxvYy5sYXRpdHVkZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb25naXR1ZGUgPSBsb2MubG9uZ2l0dWRlOyAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIG1hcmtlci5wb3NpdGlvbiA9IFBvc2l0aW9uLnBvc2l0aW9uRnJvbUxhdExuZyhsb2MubGF0aXR1ZGUsIGxvYy5sb25naXR1ZGUpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZGlzdGFuY2UgPSB0aGlzLmNhbGN1bGF0RGlzdGFuY2VCZXR3ZWVucG9pbnRzKG1hcmtlci5wb3NpdGlvbiwgYXBwb2ludG1lbnRQb3NpdGlvbik7ICBcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcHBvaW50bWVudFNlcnZpY2UudGVzdFNlcnZpY2UobWFya2VyLnBvc2l0aW9uLCB0aGlzLmFwcG9pbnRtZW50KTsgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYXBwb2ludG1lbnRTZXJ2aWNlLnNldEdlb0xvY2F0aW9uKG1hcmtlci5wb3NpdGlvbiwgdGhpcy5hcHBvaW50bWVudCkuc3Vic2NyaWJlKHJlcyA9PiB7ICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdsb2NhdGlvbiBzdG9yZWQgb24gc2VydmVyJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBlcnIgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTsgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgKGUpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yOiBcIiArIGUubWVzc2FnZSk7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBvbk1hcFJlYWR5KGV2ZW50KSB7XG4gICAgICAgIHRoaXMubWFwVmlldyA9IGV2ZW50Lm9iamVjdDtcblxuICAgICAgICB0aGlzLm1hcFZpZXcuc2V0dGluZ3Muem9vbUdlc3R1cmVzRW5hYmxlZCA9IHRydWU7XG5cbiAgICAgICAgdGhpcy5tYXBWaWV3LnNldHRpbmdzLmNvbXBhc3NFbmFibGVkID0gdHJ1ZTtcblxuICAgICAgICB0aGlzLm1hcFZpZXcuc2V0dGluZ3MuaW5kb29yTGV2ZWxQaWNrZXJFbmFibGVkID0gdHJ1ZTtcblxuICAgICAgICB0aGlzLm1hcFZpZXcuc2V0dGluZ3MubWFwVG9vbGJhckVuYWJsZWQgPSB0cnVlO1xuXG4gICAgICAgIHRoaXMubWFwVmlldy5zZXR0aW5ncy5teUxvY2F0aW9uQnV0dG9uRW5hYmxlZCA9IHRydWU7XG5cbiAgICAgICAgdGhpcy5tYXBWaWV3LnNldHRpbmdzLnJvdGF0ZUdlc3R1cmVzRW5hYmxlZCA9IHRydWU7XG5cbiAgICAgICAgdGhpcy5tYXBWaWV3LnNldHRpbmdzLnNjcm9sbEdlc3R1cmVzRW5hYmxlZCA9IHRydWU7XG5cbiAgICAgICAgdGhpcy5tYXBWaWV3LnNldHRpbmdzLnRpbHRHZXN0dXJlc0VuYWJsZWQgPSB0cnVlO1xuXG4gICAgICAgIHRoaXMubWFwVmlldy5zZXR0aW5ncy56b29tQ29udHJvbHNFbmFibGVkID0gdHJ1ZTtcblxuICAgICAgICBsZXQgYWRkcmVzcyA9IHRoaXMuYXBwb2ludG1lbnQuY2xpQWRkcmVzczEgKyAnICcgKyB0aGlzLmFwcG9pbnRtZW50LmNsaUNpdHkgKyAnICcgKyB0aGlzLmFwcG9pbnRtZW50LmNsaVN0YXRlICsgJyAnICsgdGhpcy5hcHBvaW50bWVudC5jbGlaaXA7XG4gICAgICAgIHRoaXMuYXBwb2ludG1lbnRTZXJ2aWNlLmdldEFwcG9pbnRtZW50TG9jYXRpb24oYWRkcmVzcykuc3Vic2NyaWJlKChyZXM6IGFueSkgPT4ge1xuICAgICAgICAgICAgdmFyIG1hcmtlciA9IG5ldyBNYXJrZXIoKTtcbiAgICAgICAgICAgIHRoaXMubGF0aXR1ZGUgPSByZXMucmVzdWx0c1swXS5nZW9tZXRyeS5sb2NhdGlvbi5sYXQ7XG4gICAgICAgICAgICB0aGlzLmxvbmdpdHVkZSA9IHJlcy5yZXN1bHRzWzBdLmdlb21ldHJ5LmxvY2F0aW9uLmxuZztcbiAgICAgICAgICAgIC8vIHRoaXMubGF0aXR1ZGUgPSAyNS44NTQwNTA7ICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyB0aGlzLmxvbmdpdHVkZSA9IC04MC4yMzMyNjY7XG4gICAgICAgICAgICBtYXJrZXIucG9zaXRpb24gPSBQb3NpdGlvbi5wb3NpdGlvbkZyb21MYXRMbmcodGhpcy5sYXRpdHVkZSwgdGhpcy5sb25naXR1ZGUpO1xuXG4gICAgICAgICAgICAvLyBjb25zb2xlLmRpcihtYXJrZXIucG9zaXRpb24pO1xuICAgICAgICAgICAgbWFya2VyLnRpdGxlID0gcmVzLnJlc3VsdHNbMF0uZm9ybWF0dGVkX2FkZHJlc3M7XG4gICAgICAgICAgICBtYXJrZXIuc25pcHBldCA9IFwiXCI7XG5cbiAgICAgICAgICAgIG1hcmtlci5jb2xvciA9ICdibHVlJ1xuICAgICAgICAgICAgbWFya2VyLnVzZXJEYXRhID0geyBpbmRleDogMSB9O1xuXG4gICAgICAgICAgICB0aGlzLnpvb20gPSAxMDtcblxuICAgICAgICAgICAgLy8gdmFyIG1hcmtlcjIgPSBuZXcgTWFya2VyKCk7XG4gICAgICAgICAgICAvLyBtYXJrZXIyLnBvc2l0aW9uID0gUG9zaXRpb24ucG9zaXRpb25Gcm9tTGF0TG5nKDQzLjM2MjY4NCwgLTcxLjEwMzUzMCk7XG4gICAgICAgICAgICAvLyBtYXJrZXIyLnRpdGxlID0gXCJDdXN0b21cIjtcbiAgICAgICAgICAgIC8vIC8vIG1hcmtlcjIuaWNvbiA9ICdodHRwczovL2NoYXJ0LmFwaXMuZ29vZ2xlLmNvbS9jaGFydD9jaHN0PWRfbWFwX3Bpbl9pY29uJmNobGQ9YnVzfEZGRkYwMCc7XG4gICAgICAgICAgICAvLyBtYXJrZXIyLnNuaXBwZXQgPSBcImN1c3RvbWl6ZWRcIjtcbiAgICAgICAgICAgIC8vIC8vIG1hcmtlcjIuY29sb3I9ICdyZWQnXG4gICAgICAgICAgICAvLyBtYXJrZXIyLnVzZXJEYXRhID0geyBpbmRleDogMSB9O1xuICAgICAgICAgICAgLy8gdGhpcy5tYXBWaWV3LmFkZE1hcmtlcihtYXJrZXIsIG1hcmtlcjIpO1xuICAgICAgICAgICAgdGhpcy5tYXBWaWV3LmFkZE1hcmtlcihtYXJrZXIpO1xuICAgICAgICAgICAgbWFya2VyLnNob3dJbmZvV2luZG93KCk7XG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gdGhpcy5hcHBvaW50bWVudFNlcnZpY2UubG9vcEdldEFwcGlvbnRtZW50cygpLmNhdGNoKGVyciA9PiAgeyBcbiAgICAgICAgLy8gICAgIGNvbnNvbGUuZGlyKGVycik7ICAgICAgICAgICAgXG4gICAgICAgIC8vICAgICByZXR1cm4gZXJyOyAvLyBvYnNlcnZhYmxlIG5lZWRzIHRvIGJlIHJldHVybmVkIG9yIGV4Y2VwdGlvbiByYWlzZWRcbiAgICAgICAgLy8gIH0pLnN1YnNjcmliZShyZXMgPT4ge1xuICAgICAgICAvLyAgICAgY29uc29sZS5kaXIoXCJhcHBvaW50bWVudHNsb29wIDogXCIrcmVzKTtcbiAgICAgICAgLy8gfSlcbiAgICAgICAgdGhpcy5nZXRFeHBlbnNlcygpO1xuICAgIH1cblxuICAgIG9uQ29vcmRpbmF0ZVRhcHBlZChhcmdzKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiQ29vcmRpbmF0ZSBUYXBwZWQsIExhdDogXCIgKyBhcmdzLnBvc2l0aW9uLmxhdGl0dWRlICsgXCIsIExvbjogXCIgKyBhcmdzLnBvc2l0aW9uLmxvbmdpdHVkZSwgYXJncyk7XG4gICAgfVxuXG4gICAgb25NYXJrZXJFdmVudChhcmdzKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiTWFya2VyIEV2ZW50OiAnXCIgKyBhcmdzLmV2ZW50TmFtZVxuICAgICAgICAgICAgKyBcIicgdHJpZ2dlcmVkIG9uOiBcIiArIGFyZ3MubWFya2VyLnRpdGxlXG4gICAgICAgICAgICArIFwiLCBMYXQ6IFwiICsgYXJncy5tYXJrZXIucG9zaXRpb24ubGF0aXR1ZGUgKyBcIiwgTG9uOiBcIiArIGFyZ3MubWFya2VyLnBvc2l0aW9uLmxvbmdpdHVkZSwgYXJncyk7XG4gICAgfVxuXG4gICAgb25DYW1lcmFDaGFuZ2VkKGFyZ3MpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJDYW1lcmEgY2hhbmdlZDogXCIgKyBKU09OLnN0cmluZ2lmeShhcmdzLmNhbWVyYSksIEpTT04uc3RyaW5naWZ5KGFyZ3MuY2FtZXJhKSA9PT0gdGhpcy5sYXN0Q2FtZXJhKTtcbiAgICAgICAgLy8gdGhpcy5sYXN0Q2FtZXJhID0gSlNPTi5zdHJpbmdpZnkoYXJncy5jYW1lcmEpO1xuICAgIH1cblxuICAgIGNhbGN1bGF0RGlzdGFuY2VCZXR3ZWVucG9pbnRzKHAxLCBwMikge1xuICAgICAgICB2YXIgcmFkID0gZnVuY3Rpb24gKHgpIHtcbiAgICAgICAgICAgIHJldHVybiB4ICogTWF0aC5QSSAvIDE4MDtcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIFIgPSA2Mzc4MTM3OyAvLyBFYXJ0aOKAmXMgbWVhbiByYWRpdXMgaW4gbWV0ZXJcbiAgICAgICAgdmFyIGRMYXQgPSByYWQocDIubGF0aXR1ZGUgLSBwMS5sYXRpdHVkZSk7XG4gICAgICAgIHZhciBkTG9uZyA9IHJhZChwMi5sb25naXR1ZGUgLSBwMS5sb25naXR1ZGUpO1xuICAgICAgICB2YXIgYSA9IE1hdGguc2luKGRMYXQgLyAyKSAqIE1hdGguc2luKGRMYXQgLyAyKSArXG4gICAgICAgICAgICBNYXRoLmNvcyhyYWQocDEubGF0aXR1ZGUpKSAqIE1hdGguY29zKHJhZChwMi5sYXRpdHVkZSkpICpcbiAgICAgICAgICAgIE1hdGguc2luKGRMb25nIC8gMikgKiBNYXRoLnNpbihkTG9uZyAvIDIpO1xuICAgICAgICB2YXIgYyA9IDIgKiBNYXRoLmF0YW4yKE1hdGguc3FydChhKSwgTWF0aC5zcXJ0KDEgLSBhKSk7XG4gICAgICAgIHZhciBkID0gUiAqIGM7XG4gICAgICAgIHJldHVybiBkOyAvLyByZXR1cm5zIHRoZSBkaXN0YW5jZSBpbiBtZXRlciAgICAgICAgICBcbiAgICB9XG5cblxuICAgIHpvb21EaXN0YW5jZShkaXN0YW5jZSkge1xuICAgICAgICBsZXQgem9vbSA9IDEzO1xuICAgICAgICBsZXQgZmFjdG9yID0gNTtcbiAgICAgICAgc3dpdGNoICh0cnVlKSB7XG5cbiAgICAgICAgICAgIGNhc2UgIChkaXN0YW5jZSA8IDExMjguNDk3MjIwKSA6XG4gICAgICAgICAgICAgICAgem9vbSA9IDIwIC0gIGZhY3RvcjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgIChkaXN0YW5jZSA8IDIyNTYuOTk0NDQwKSA6XG4gICAgICAgICAgICAgICAgem9vbSA9IDE5IC0gIGZhY3RvcjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgIChkaXN0YW5jZSA8IDQ1MTMuOTg4ODgwKSA6XG4gICAgICAgICAgICAgICAgem9vbSA9IDE4IC0gIGZhY3RvcjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgIChkaXN0YW5jZSA8IDkwMjcuOTc3NzYxKSA6XG4gICAgICAgICAgICAgICAgem9vbSA9IDE3IC0gIGZhY3RvcjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgIChkaXN0YW5jZSA8IDE4MDU1Ljk1NTUyMCkgOlxuICAgICAgICAgICAgICAgIHpvb20gPSAxNiAtICBmYWN0b3I7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICAoZGlzdGFuY2UgPCAzNjExMS45MTEwNDApIDpcbiAgICAgICAgICAgICAgICB6b29tID0gMTUgLSAgZmFjdG9yO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAgKGRpc3RhbmNlIDwgNzIyMjMuODIyMDkwKSA6XG4gICAgICAgICAgICAgICAgem9vbSA9IDE0IC0gIGZhY3RvcjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgIChkaXN0YW5jZSA8IDE0NDQ0Ny42NDQyMDApIDpcbiAgICAgICAgICAgICAgICB6b29tID0gMTMgLSAgZmFjdG9yO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAgKGRpc3RhbmNlIDwgMjg4ODk1LjI4ODQwMCkgOlxuICAgICAgICAgICAgICAgIHpvb20gPSAxMiAtICBmYWN0b3I7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICAoZGlzdGFuY2UgPCA1Nzc3OTAuNTc2NzAwKSA6XG4gICAgICAgICAgICAgICAgem9vbSA9IDExIC0gIGZhY3RvcjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgIChkaXN0YW5jZSA8IDExNTU1ODEuMTUzMDAwKSA6XG4gICAgICAgICAgICAgICAgem9vbSA9IDEwIC0gIGZhY3RvcjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgIChkaXN0YW5jZSA8IDIzMTExNjIuMzA3MDAwKSA6XG4gICAgICAgICAgICAgICAgem9vbSA9IDkgLSAgZmFjdG9yO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAgKGRpc3RhbmNlIDwgNDYyMjMyNC42MTQwMDApIDpcbiAgICAgICAgICAgICAgICB6b29tID0gOCAtICBmYWN0b3I7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICAoZGlzdGFuY2UgPCA5MjQ0NjQ5LjIyNzAwMCkgOlxuICAgICAgICAgICAgICAgIHpvb20gPSA3IC0gIGZhY3RvcjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgIChkaXN0YW5jZSA8IDE4NDg5Mjk4LjQ1MDAwMCkgOlxuICAgICAgICAgICAgICAgIHpvb20gPSA2IC0gIGZhY3RvcjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgIChkaXN0YW5jZSA8IDM2OTc4NTk2LjkxMDAwMCkgOlxuICAgICAgICAgICAgICAgIHpvb20gPSA1IDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgIChkaXN0YW5jZSA8IDczOTU3MTkzLjgyMDAwMCkgOlxuICAgICAgICAgICAgICAgIHpvb20gPSA0IDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgIChkaXN0YW5jZSA8IDE0NzkxNDM4Ny42MDAwMDApIDpcbiAgICAgICAgICAgICAgICB6b29tID0gMyA7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICAoZGlzdGFuY2UgPCAyOTU4Mjg3NzUuMzAwMDAwKSA6XG4gICAgICAgICAgICAgICAgem9vbSA9IDIgO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAgKGRpc3RhbmNlIDwgNTkxNjU3NTUwLjUwMDAwMCkgOlxuICAgICAgICAgICAgICAgIHpvb20gPSAxIDtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB6b29tXG4gICAgfVxuXG4gICAgZ2V0RXhwZW5zZXMoKTogYW55IHsgICAgXG4gICAgICAgICB0aGlzLmFwcG9pbnRtZW50U2VydmljZS5nZXRFeHBlbnNlc0J5QXBwb2ludG1lbnRJZCh0aGlzLmFwcG9pbnRtZW50LkFwcElkLnRvU3RyaW5nKCkpLnN1YnNjcmliZShyZXMgPT4ge1xuXG4gICAgICAgICAgICByZXMuZm9yRWFjaChlbGVtZW50ID0+IHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnJlY1R5cGUgPSB0aGlzLm9wdGlvbnNbZWxlbWVudC5yZWNUeXBlXTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgIHRoaXMuZXhwZW5zZXMgPSByZXM7XG4gICAgICAgICB9KTtcbiAgICAgfVxuXG4gICAgICBvbmNoYW5nZShhcmdzOiBTZWxlY3RlZEluZGV4Q2hhbmdlZEV2ZW50RGF0YSkge1xuICAgICAgICBjb25zb2xlLmxvZyhgRHJvcCBEb3duIHNlbGVjdGVkIGluZGV4IGNoYW5nZWQgZnJvbSAke2FyZ3Mub2xkSW5kZXh9IHRvICR7YXJncy5uZXdJbmRleH1gKTtcbiAgICB9XG5cbiAgICAgb25vcGVuKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkRyb3AgRG93biBvcGVuZWQuXCIpO1xuICAgIH1cblxuICAgICBvbmNsb3NlKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkRyb3AgRG93biBjbG9zZWQuXCIpO1xuICAgIH1cbn1cbiJdfQ==