"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var appointment_service_1 = require("./appointment.service");
var nativescript_google_maps_sdk_1 = require("nativescript-google-maps-sdk");
var camera = require("nativescript-camera");
var element_registry_1 = require("nativescript-angular/element-registry");
var elementRegistryModule = require("nativescript-angular/element-registry");
elementRegistryModule.registerElement("CardView", function () { return require("nativescript-cardview").CardView; });
var nativescript_geolocation_1 = require("nativescript-geolocation");
element_registry_1.registerElement('MapView', function () { return nativescript_google_maps_sdk_1.MapView; });
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
        var _this = this;
        var address = this.appointment.cliAddress1 + ' ' + this.appointment.cliCity + ' ' + this.appointment.cliState + ' ' + this.appointment.cliZip;
        this.appointmentService.getAppointmentLocation(address).subscribe(function (res) {
            var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
            var marker = new nativescript_google_maps_sdk_1.Marker();
            _this.latitude = res.results[0].geometry.location.lat;
            _this.longitude = res.results[0].geometry.location.lng;
            marker.position = nativescript_google_maps_sdk_1.Position.positionFromLatLng(_this.latitude, _this.longitude);
            marker.title = res.results[0].formatted_address;
            marker.snippet = "";
            // marker.icon = "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png";
            marker.userData = { index: 1 };
            _this.mapView.addMarker(marker);
            _this.zoom = 13;
            // var marker2 = new Marker();
            // marker2.position = Position.positionFromLatLng(this.latitude, this.longitude);
            // marker2.title = "Custom";
            // // marker2.icon = 'https://chart.apis.google.com/chart?chst=d_map_pin_icon&chld=bus|FFFF00';
            // marker2.snippet = "customized";
            // marker2.userData = { index: 1 };
            // this.mapView.addMarker(marker2);
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
        });
    };
    AppointmentDetailComponent.prototype.saveExpense = function () {
        var _this = this;
        this.appointmentService.saveExpense(this.appointment, this.imagebase, this.expenseType, this.amount).catch(function (err) {
            console.dir(err);
            return err; // observable needs to be returned or exception raised
        }).subscribe(function (res) {
            _this.imagebase = null;
            console.dir(res);
        }), function (err) {
            console.log("error: " + err.message);
            console.dir(err);
        };
    };
    AppointmentDetailComponent.prototype.checkinLocation = function () {
        var _this = this;
        nativescript_geolocation_1.getCurrentLocation({ desiredAccuracy: 3, updateDistance: 1, maximumAge: 20000, timeout: 20000 }).
            then(function (loc) {
            if (loc) {
                var marker = new nativescript_google_maps_sdk_1.Marker();
                var appointmentPosition = nativescript_google_maps_sdk_1.Position.positionFromLatLng(_this.latitude2, _this.longitude2);
                _this.latitude = loc.latitude;
                _this.longitude = loc.longitude;
                marker.position = nativescript_google_maps_sdk_1.Position.positionFromLatLng(_this.latitude, _this.longitude);
                var distance = _this.calculatDistanceBetweenpoints(marker.position, appointmentPosition);
                if (distance < 804.672) {
                    marker.title = "Miami";
                    marker.snippet = "Usa";
                    marker.userData = { index: 1 };
                    _this.mapView.addMarker(marker);
                    _this.zoom = 16;
                    _this.appointmentService.setGeoLocation(loc, _this.appointment).subscribe(function (res) {
                        console.log(res);
                    }, function (err) {
                        console.log(err);
                    });
                }
            }
        }, function (e) {
            console.log("Error: " + e.message);
        });
    };
    AppointmentDetailComponent.prototype.onMapReady = function (event) {
        this.mapView = event.object;
        this.mapView.settings.zoomGesturesEnabled = true;
        this.mapView.settings.myLocationButtonEnabled = true;
        this.mapView.settings.scrollGesturesEnabled = true;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwb2ludG1lbnQtZGV0YWlsLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwcG9pbnRtZW50LWRldGFpbC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBNkQ7QUFDN0QsMENBQWlEO0FBQ2pELDZEQUEyRDtBQUkzRCw2RUFBeUU7QUFDekUsNENBQThDO0FBQzlDLDBFQUF3RTtBQUN4RSw2RUFBK0U7QUFDL0UscUJBQXFCLENBQUMsZUFBZSxDQUFDLFVBQVUsRUFBRSxjQUFNLE9BQUEsT0FBTyxDQUFDLHVCQUF1QixDQUFDLENBQUMsUUFBUSxFQUF6QyxDQUF5QyxDQUFDLENBQUM7QUFDbkcscUVBQXFJO0FBRXJJLGtDQUFlLENBQUMsU0FBUyxFQUFFLGNBQU0sT0FBQSxzQ0FBTyxFQUFQLENBQU8sQ0FBQyxDQUFDO0FBQzFDLDJFQUFpRjtBQWVqRjtJQXdCSSxvQ0FDWSxrQkFBc0MsRUFDdEMsS0FBcUI7UUFEckIsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUFvQjtRQUN0QyxVQUFLLEdBQUwsS0FBSyxDQUFnQjtRQXZCekIsYUFBUSxHQUFHLFNBQVMsQ0FBQTtRQUNwQixjQUFTLEdBQUcsQ0FBQyxTQUFTLENBQUE7UUFDdEIsY0FBUyxHQUFHLFNBQVMsQ0FBQztRQUN0QixlQUFVLEdBQUcsQ0FBQyxRQUFRLENBQUM7UUFDL0IsaUNBQWlDO1FBQ2pDLG1DQUFtQztRQUMzQixTQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ1YsWUFBTyxHQUFHLENBQUMsQ0FBQztRQUNaLFNBQUksR0FBRyxDQUFDLENBQUM7UUFFVCxZQUFPLEdBQUcsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUczQixXQUFNLEdBQVEsRUFBRSxDQUFDO1FBQ2pCLGdCQUFXLEdBQVEsRUFBRSxDQUFDO1FBVTFCLElBQUksQ0FBQyxXQUFXLEdBQWdCLElBQUksQ0FBQyxLQUFLLENBQUMs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b25lbnQsIE9uSW5pdCwgVmlld0NoaWxkIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IEFjdGl2YXRlZFJvdXRlIH0gZnJvbSBcIkBhbmd1bGFyL3JvdXRlclwiO1xuaW1wb3J0IHsgQXBwb2ludG1lbnRTZXJ2aWNlIH0gZnJvbSBcIi4vYXBwb2ludG1lbnQuc2VydmljZVwiO1xuaW1wb3J0IHsgQXBwb2ludG1lbnQgfSBmcm9tIFwiLi9hcHBvaW50bWVudC5tb2RlbFwiO1xuXG5pbXBvcnQgeyBUZWxlcGhvbnkgfSBmcm9tICduYXRpdmVzY3JpcHQtdGVsZXBob255JztcbmltcG9ydCB7IE1hcFZpZXcsIE1hcmtlciwgUG9zaXRpb24gfSBmcm9tICduYXRpdmVzY3JpcHQtZ29vZ2xlLW1hcHMtc2RrJztcbmltcG9ydCAqIGFzIGNhbWVyYSBmcm9tIFwibmF0aXZlc2NyaXB0LWNhbWVyYVwiO1xuaW1wb3J0IHsgcmVnaXN0ZXJFbGVtZW50IH0gZnJvbSAnbmF0aXZlc2NyaXB0LWFuZ3VsYXIvZWxlbWVudC1yZWdpc3RyeSc7XG5pbXBvcnQgKiBhcyBlbGVtZW50UmVnaXN0cnlNb2R1bGUgZnJvbSAnbmF0aXZlc2NyaXB0LWFuZ3VsYXIvZWxlbWVudC1yZWdpc3RyeSc7XG5lbGVtZW50UmVnaXN0cnlNb2R1bGUucmVnaXN0ZXJFbGVtZW50KFwiQ2FyZFZpZXdcIiwgKCkgPT4gcmVxdWlyZShcIm5hdGl2ZXNjcmlwdC1jYXJkdmlld1wiKS5DYXJkVmlldyk7XG5pbXBvcnQgeyBpc0VuYWJsZWQsIGVuYWJsZUxvY2F0aW9uUmVxdWVzdCwgZ2V0Q3VycmVudExvY2F0aW9uLCB3YXRjaExvY2F0aW9uLCBkaXN0YW5jZSwgY2xlYXJXYXRjaCB9IGZyb20gXCJuYXRpdmVzY3JpcHQtZ2VvbG9jYXRpb25cIjtcbmltcG9ydCB7IHJlc2V0Q1NTUHJvcGVydGllcyB9IGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL3VpL2ZyYW1lL2ZyYW1lXCI7XG5yZWdpc3RlckVsZW1lbnQoJ01hcFZpZXcnLCAoKSA9PiBNYXBWaWV3KTtcbmltcG9ydCB7IGZyb21Bc3NldCwgZnJvbURhdGEgfSBmcm9tIFwidG5zLWNvcmUtbW9kdWxlcy9pbWFnZS1zb3VyY2UvaW1hZ2Utc291cmNlXCI7XG5pbXBvcnQgeyBMb29wQXBwb2ludG1lbnQgfSBmcm9tIFwiLi9sb29wL2xvb3AtYXBwb2ludG1lbnQubW9kZWxcIjtcbi8vIGltcG9ydCB7IGFuZHJvaWQgfSBmcm9tIFwidG5zLWNvcmUtbW9kdWxlcy9hcHBsaWNhdGlvbi9hcHBsaWNhdGlvblwiO1xuLy8gZGVjbGFyZSB2YXIgQml0bWFwRmFjdG9yeTogYW55XG5kZWNsYXJlIHZhciBhbmRyb2lkO1xuZGVjbGFyZSB2YXIgamF2YTtcbmRlY2xhcmUgdmFyIGJ5dGU7XG5kZWNsYXJlIHZhciBCeXRlQXJyYXlPdXRwdXRTdHJlYW07XG5kZWNsYXJlIHZhciBCaXRtYXA7XG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogXCJucy1kZXRhaWxzXCIsXG4gICAgbW9kdWxlSWQ6IG1vZHVsZS5pZCxcbiAgICB0ZW1wbGF0ZVVybDogXCIuL2FwcG9pbnRtZW50LWRldGFpbC5jb21wb25lbnQuaHRtbFwiLFxuICAgIHN0eWxlVXJsczogWycuL2FwcG9pbnRtZW50LWRldGFpbC5jc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBBcHBvaW50bWVudERldGFpbENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gICAgcHJpdmF0ZSBhcHBvaW50bWVudDogQXBwb2ludG1lbnQ7XG4gICAgcHJpdmF0ZSBleHBlbnNlczogQXJyYXk8b2JqZWN0PjtcbiAgICBwcml2YXRlIGxhdGl0dWRlID0gMjUuNzY5NDkwXG4gICAgcHJpdmF0ZSBsb25naXR1ZGUgPSAtODAuMTk1MjI0XG4gICAgcHJpdmF0ZSBsYXRpdHVkZTIgPSAyNS43Njk4NTk7XG4gICAgcHJpdmF0ZSBsb25naXR1ZGUyID0gLTgwLjE5MjMwO1xuICAgIC8vIHByaXZhdGUgbGF0aXR1ZGUyID0gMjUuNzc0Mzk0O1xuICAgIC8vIHByaXZhdGUgbG9uZ2l0dWRlMiA9IC04MC4xNDE4NTI7XG4gICAgcHJpdmF0ZSB6b29tID0gMTY7XG4gICAgcHJpdmF0ZSBiZWFyaW5nID0gMDtcbiAgICBwcml2YXRlIHRpbHQgPSAwO1xuICAgIHByaXZhdGUgQ3VycmVudExvY2F0aW9uO1xuICAgIHByaXZhdGUgcGFkZGluZyA9IFs0MCwgNDAsIDQwLCA0MF07XG4gICAgcHJpdmF0ZSBtYXBWaWV3OiBNYXBWaWV3O1xuICAgIHByaXZhdGUgcGhvbmVOdW1iZXI6IGFueTtcbiAgICBwcml2YXRlIGFtb3VudDogYW55ID0gJyc7XG4gICAgcHJpdmF0ZSBleHBlbnNlVHlwZTogYW55ID0gJyc7XG4gICAgcHJpdmF0ZSBpbWFnZTogc3RyaW5nO1xuICAgIHByaXZhdGUgaW1hZ2ViYXNlOiBzdHJpbmc7XG4gICAgLy8gcHJpdmF0ZSBpbWFnZTogYW55ID0gXCJodHRwczovL3BsYXkubmF0aXZlc2NyaXB0Lm9yZy9kaXN0L2Fzc2V0cy9pbWcvTmF0aXZlU2NyaXB0X2xvZ28ucG5nXCI7XG5cbiAgICBsYXN0Q2FtZXJhOiBTdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJpdmF0ZSBhcHBvaW50bWVudFNlcnZpY2U6IEFwcG9pbnRtZW50U2VydmljZSxcbiAgICAgICAgcHJpdmF0ZSByb3V0ZTogQWN0aXZhdGVkUm91dGUpIHtcbiAgICAgICAgdGhpcy5hcHBvaW50bWVudCA9IDxBcHBvaW50bWVudD5KU09OLnBhcnNlKHRoaXMucm91dGUuc25hcHNob3QucGFyYW1zW1wiYXBwb2ludG1lbnRcIl0pO1xuICAgICAgICBjYW1lcmEucmVxdWVzdFBlcm1pc3Npb25zKCk7XG4gICAgfVxuXG4gICAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgICAgIGxldCBhZGRyZXNzID0gdGhpcy5hcHBvaW50bWVudC5jbGlBZGRyZXNzMSArICcgJyArIHRoaXMuYXBwb2ludG1lbnQuY2xpQ2l0eSArICcgJyArIHRoaXMuYXBwb2ludG1lbnQuY2xpU3RhdGUgKyAnICcgKyB0aGlzLmFwcG9pbnRtZW50LmNsaVppcDtcbiAgICAgICAgdGhpcy5hcHBvaW50bWVudFNlcnZpY2UuZ2V0QXBwb2ludG1lbnRMb2NhdGlvbihhZGRyZXNzKS5zdWJzY3JpYmUoKHJlczogYW55KSA9PiB7XG5cbiAgICAgICAgICAgIHZhciBpY29uQmFzZSA9ICdodHRwczovL21hcHMuZ29vZ2xlLmNvbS9tYXBmaWxlcy9rbWwvc2hhcGVzLyc7XG5cbiAgICAgICAgICAgIHZhciBtYXJrZXIgPSBuZXcgTWFya2VyKCk7XG4gICAgICAgICAgICB0aGlzLmxhdGl0dWRlID0gcmVzLnJlc3VsdHNbMF0uZ2VvbWV0cnkubG9jYXRpb24ubGF0O1xuICAgICAgICAgICAgdGhpcy5sb25naXR1ZGUgPSByZXMucmVzdWx0c1swXS5nZW9tZXRyeS5sb2NhdGlvbi5sbmc7XG4gICAgICAgICAgICBtYXJrZXIucG9zaXRpb24gPSBQb3NpdGlvbi5wb3NpdGlvbkZyb21MYXRMbmcodGhpcy5sYXRpdHVkZSwgdGhpcy5sb25naXR1ZGUpO1xuICAgICAgICAgICAgbWFya2VyLnRpdGxlID0gcmVzLnJlc3VsdHNbMF0uZm9ybWF0dGVkX2FkZHJlc3M7XG4gICAgICAgICAgICBtYXJrZXIuc25pcHBldCA9IFwiXCI7XG4gICAgICAgICAgICAvLyBtYXJrZXIuaWNvbiA9IFwiaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvZXhhbXBsZXMvZnVsbC9pbWFnZXMvYmVhY2hmbGFnLnBuZ1wiO1xuICAgICAgICAgICAgbWFya2VyLnVzZXJEYXRhID0geyBpbmRleDogMSB9O1xuICAgICAgICAgICAgdGhpcy5tYXBWaWV3LmFkZE1hcmtlcihtYXJrZXIpO1xuICAgICAgICAgICAgdGhpcy56b29tID0gMTM7XG5cbiAgICAgICAgICAgIC8vIHZhciBtYXJrZXIyID0gbmV3IE1hcmtlcigpO1xuICAgICAgICAgICAgLy8gbWFya2VyMi5wb3NpdGlvbiA9IFBvc2l0aW9uLnBvc2l0aW9uRnJvbUxhdExuZyh0aGlzLmxhdGl0dWRlLCB0aGlzLmxvbmdpdHVkZSk7XG4gICAgICAgICAgICAvLyBtYXJrZXIyLnRpdGxlID0gXCJDdXN0b21cIjtcbiAgICAgICAgICAgIC8vIC8vIG1hcmtlcjIuaWNvbiA9ICdodHRwczovL2NoYXJ0LmFwaXMuZ29vZ2xlLmNvbS9jaGFydD9jaHN0PWRfbWFwX3Bpbl9pY29uJmNobGQ9YnVzfEZGRkYwMCc7XG4gICAgICAgICAgICAvLyBtYXJrZXIyLnNuaXBwZXQgPSBcImN1c3RvbWl6ZWRcIjtcbiAgICAgICAgICAgIC8vIG1hcmtlcjIudXNlckRhdGEgPSB7IGluZGV4OiAxIH07XG4gICAgICAgICAgICAvLyB0aGlzLm1hcFZpZXcuYWRkTWFya2VyKG1hcmtlcjIpO1xuICAgICAgICB9KVxuXG4gICAgICAgIC8vIHRoaXMuYXBwb2ludG1lbnRTZXJ2aWNlLmxvb3BHZXRBcHBpb250bWVudHMoKS5jYXRjaChlcnIgPT4gIHsgXG4gICAgICAgIC8vICAgICBjb25zb2xlLmRpcihlcnIpOyAgICAgICAgICAgIFxuICAgICAgICAvLyAgICAgcmV0dXJuIGVycjsgLy8gb2JzZXJ2YWJsZSBuZWVkcyB0byBiZSByZXR1cm5lZCBvciBleGNlcHRpb24gcmFpc2VkXG4gICAgICAgIC8vICB9KS5zdWJzY3JpYmUocmVzID0+IHtcbiAgICAgICAgLy8gICAgIGNvbnNvbGUuZGlyKFwiYXBwb2ludG1lbnRzbG9vcCA6IFwiK3Jlcyk7XG5cbiAgICAgICAgLy8gfSlcblxuICAgICAgICB0aGlzLmFwcG9pbnRtZW50U2VydmljZS5nZXRFeHBlbnNlc0J5QXBwb2ludG1lbnRJZCh0aGlzLmFwcG9pbnRtZW50LkFwcElkLnRvU3RyaW5nKCkpLnN1YnNjcmliZShyZXMgPT4ge1xuICAgICAgICAgICAgdGhpcy5leHBlbnNlcyA9IHJlcztcbiAgICAgICAgfSk7XG4gICAgfVxuXG5cbiAgICBhZGRFeHBlbnNlKCkge1xuICAgICAgICB2YXIgb3B0aW9ucyA9IHsgd2lkdGg6IDE1MCwgaGVpZ2h0OiAxNTAsIGtlZXBBc3BlY3RSYXRpbzogdHJ1ZSwgc2F2ZVRvR2FsbGVyeTogZmFsc2UgfTtcbiAgICAgICAgdGhpcy5pbWFnZWJhc2UgPSAnJztcbiAgICAgICAgdGhpcy5pbWFnZSA9ICcnO1xuICAgICAgICBjYW1lcmEudGFrZVBpY3R1cmUob3B0aW9ucylcbiAgICAgICAgICAgIC50aGVuKChpbWFnZUFzc2V0OiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICBmcm9tQXNzZXQoaW1hZ2VBc3NldCkudGhlbihyZXMgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmltYWdlYmFzZSA9IHJlcy50b0Jhc2U2NFN0cmluZyhcImpwZ1wiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbWFnZSA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LFwiICsgdGhpcy5pbWFnZWJhc2U7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW1hZ2ViYXNlID0gdGhpcy5pbWFnZWJhc2UucmVwbGFjZSgvXFwrL2csICctJyk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yIC0+IFwiICsgZXJyLm1lc3NhZ2UpO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG5cblxuICAgIHNhdmVFeHBlbnNlKCkge1xuICAgICAgICB0aGlzLmFwcG9pbnRtZW50U2VydmljZS5zYXZlRXhwZW5zZSh0aGlzLmFwcG9pbnRtZW50LCB0aGlzLmltYWdlYmFzZSwgdGhpcy5leHBlbnNlVHlwZSwgdGhpcy5hbW91bnQpLmNhdGNoKGVyciA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmRpcihlcnIpO1xuICAgICAgICAgICAgcmV0dXJuIGVycjsgLy8gb2JzZXJ2YWJsZSBuZWVkcyB0byBiZSByZXR1cm5lZCBvciBleGNlcHRpb24gcmFpc2VkXG4gICAgICAgIH0pLnN1YnNjcmliZShyZXMgPT4ge1xuICAgICAgICAgICAgdGhpcy5pbWFnZWJhc2UgPSBudWxsO1xuICAgICAgICAgICAgY29uc29sZS5kaXIocmVzKTtcbiAgICAgICAgfSksIGVyciA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yOiBcIiArIGVyci5tZXNzYWdlKTtcbiAgICAgICAgICAgIGNvbnNvbGUuZGlyKGVycik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjaGVja2luTG9jYXRpb24oKTogYW55IHtcbiAgICAgICAgZ2V0Q3VycmVudExvY2F0aW9uKHsgZGVzaXJlZEFjY3VyYWN5OiAzLCB1cGRhdGVEaXN0YW5jZTogMSwgbWF4aW11bUFnZTogMjAwMDAsIHRpbWVvdXQ6IDIwMDAwIH0pLlxuICAgICAgICAgICAgdGhlbihsb2MgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChsb2MpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG1hcmtlciA9IG5ldyBNYXJrZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFwcG9pbnRtZW50UG9zaXRpb24gPSBQb3NpdGlvbi5wb3NpdGlvbkZyb21MYXRMbmcodGhpcy5sYXRpdHVkZTIsIHRoaXMubG9uZ2l0dWRlMik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGF0aXR1ZGUgPSBsb2MubGF0aXR1ZGU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9uZ2l0dWRlID0gbG9jLmxvbmdpdHVkZTtcbiAgICAgICAgICAgICAgICAgICAgbWFya2VyLnBvc2l0aW9uID0gUG9zaXRpb24ucG9zaXRpb25Gcm9tTGF0TG5nKHRoaXMubGF0aXR1ZGUsIHRoaXMubG9uZ2l0dWRlKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRpc3RhbmNlID0gdGhpcy5jYWxjdWxhdERpc3RhbmNlQmV0d2VlbnBvaW50cyhtYXJrZXIucG9zaXRpb24sIGFwcG9pbnRtZW50UG9zaXRpb24pO1xuICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGlmIChkaXN0YW5jZSA8IDgwNC42NzIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcmtlci50aXRsZSA9IFwiTWlhbWlcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcmtlci5zbmlwcGV0ID0gXCJVc2FcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcmtlci51c2VyRGF0YSA9IHsgaW5kZXg6IDEgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubWFwVmlldy5hZGRNYXJrZXIobWFya2VyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuem9vbSA9IDE2O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFwcG9pbnRtZW50U2VydmljZS5zZXRHZW9Mb2NhdGlvbihsb2MsIHRoaXMuYXBwb2ludG1lbnQpLnN1YnNjcmliZShyZXMgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBlcnIgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgKGUpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yOiBcIiArIGUubWVzc2FnZSk7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBvbk1hcFJlYWR5KGV2ZW50KSB7XG4gICAgICAgIHRoaXMubWFwVmlldyA9IGV2ZW50Lm9iamVjdDtcbiAgICAgICAgdGhpcy5tYXBWaWV3LnNldHRpbmdzLnpvb21HZXN0dXJlc0VuYWJsZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLm1hcFZpZXcuc2V0dGluZ3MubXlMb2NhdGlvbkJ1dHRvbkVuYWJsZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLm1hcFZpZXcuc2V0dGluZ3Muc2Nyb2xsR2VzdHVyZXNFbmFibGVkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBvbkNvb3JkaW5hdGVUYXBwZWQoYXJncykge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkNvb3JkaW5hdGUgVGFwcGVkLCBMYXQ6IFwiICsgYXJncy5wb3NpdGlvbi5sYXRpdHVkZSArIFwiLCBMb246IFwiICsgYXJncy5wb3NpdGlvbi5sb25naXR1ZGUsIGFyZ3MpO1xuICAgIH1cblxuICAgIG9uTWFya2VyRXZlbnQoYXJncykge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIk1hcmtlciBFdmVudDogJ1wiICsgYXJncy5ldmVudE5hbWVcbiAgICAgICAgLy8gICAgICsgXCInIHRyaWdnZXJlZCBvbjogXCIgKyBhcmdzLm1hcmtlci50aXRsZVxuICAgICAgICAvLyAgICAgKyBcIiwgTGF0OiBcIiArIGFyZ3MubWFya2VyLnBvc2l0aW9uLmxhdGl0dWRlICsgXCIsIExvbjogXCIgKyBhcmdzLm1hcmtlci5wb3NpdGlvbi5sb25naXR1ZGUsIGFyZ3MpO1xuICAgIH1cblxuICAgIG9uQ2FtZXJhQ2hhbmdlZChhcmdzKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiQ2FtZXJhIGNoYW5nZWQ6IFwiICsgSlNPTi5zdHJpbmdpZnkoYXJncy5jYW1lcmEpLCBKU09OLnN0cmluZ2lmeShhcmdzLmNhbWVyYSkgPT09IHRoaXMubGFzdENhbWVyYSk7XG4gICAgICAgIC8vIHRoaXMubGFzdENhbWVyYSA9IEpTT04uc3RyaW5naWZ5KGFyZ3MuY2FtZXJhKTtcbiAgICB9XG5cbiAgICBjYWxjdWxhdERpc3RhbmNlQmV0d2VlbnBvaW50cyhwMSwgcDIpIHtcbiAgICAgICAgdmFyIHJhZCA9IGZ1bmN0aW9uICh4KSB7XG4gICAgICAgICAgICByZXR1cm4geCAqIE1hdGguUEkgLyAxODA7XG4gICAgICAgIH07XG4gICAgICAgIHZhciBSID0gNjM3ODEzNzsgLy8gRWFydGjigJlzIG1lYW4gcmFkaXVzIGluIG1ldGVyXG4gICAgICAgIHZhciBkTGF0ID0gcmFkKHAyLmxhdGl0dWRlIC0gcDEubGF0aXR1ZGUpO1xuICAgICAgICB2YXIgZExvbmcgPSByYWQocDIubG9uZ2l0dWRlIC0gcDEubG9uZ2l0dWRlKTtcbiAgICAgICAgdmFyIGEgPSBNYXRoLnNpbihkTGF0IC8gMikgKiBNYXRoLnNpbihkTGF0IC8gMikgK1xuICAgICAgICAgICAgTWF0aC5jb3MocmFkKHAxLmxhdGl0dWRlKSkgKiBNYXRoLmNvcyhyYWQocDIubGF0aXR1ZGUpKSAqXG4gICAgICAgICAgICBNYXRoLnNpbihkTG9uZyAvIDIpICogTWF0aC5zaW4oZExvbmcgLyAyKTtcbiAgICAgICAgdmFyIGMgPSAyICogTWF0aC5hdGFuMihNYXRoLnNxcnQoYSksIE1hdGguc3FydCgxIC0gYSkpO1xuICAgICAgICB2YXIgZCA9IFIgKiBjO1xuICAgICAgICByZXR1cm4gZDsgLy8gcmV0dXJucyB0aGUgZGlzdGFuY2UgaW4gbWV0ZXIgICAgICAgICAgXG4gICAgfVxuXG59XG4iXX0=