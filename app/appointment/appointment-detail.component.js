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
        this.latitude = 25.773338;
        this.longitude = -80.190072;
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
            var marker = new nativescript_google_maps_sdk_1.Marker();
            _this.latitude = res.results[0].geometry.location.lat;
            _this.longitude = res.results[0].geometry.location.lng;
            marker.position = nativescript_google_maps_sdk_1.Position.positionFromLatLng(_this.latitude, _this.longitude);
            marker.title = res.results[0].formatted_address;
            marker.snippet = "";
            marker.userData = { index: 1 };
            _this.mapView.addMarker(marker);
            _this.zoom = 13;
        });
        // this.appointmentService.loopGetAppiontments().catch(err =>  { 
        //     console.dir(err);            
        //     return err; // observable needs to be returned or exception raised
        //  }).subscribe(res => {
        //     console.dir("appointmentsloop : "+res);
        // })
        this.appointmentService.getExpensesByAppointmentId(this.appointment.AppId.toString()).subscribe(function (res) {
            // console.log("res: " + res);
            // console.dir(res);
            // if (res.length > 0) {                
            //     this.expenses = res.map( obj =>  {
            //         obj.img.replace(/\-/g,'+');
            //     });
            // }
            _this.expenses = res;
        });
    };
    AppointmentDetailComponent.prototype.addExpense = function () {
        var _this = this;
        var options = { width: 300, height: 300, keepAspectRatio: true, saveToGallery: false };
        this.imagebase = '';
        this.image = '';
        camera.takePicture(options)
            .then(function (imageAsset) {
            // var file = new java.io.File(imageAsset.android);
            // var size = file.length();
            // var bytes = new byte[size];
            // try {
            //      var buf = new java.io.BufferedInputStream(new java.io.FileInputStream(file));
            //      buf.read(bytes, 0, bytes.length);
            //      //do something
            //      buf.close();
            // } catch (ex) {
            //      console.log(ex);
            // }
            // let bm = android.graphics.BitmapFactory.decodeFile(imageAsset.android);
            // let baos = new java.io.ByteArrayOutputStream();
            // bm.compress(android.graphics.Bitmap.CompressFormat.JPEG, 100, baos);
            // let  b = baos.toByteArray();
            // let encImage =android.util.Base64.encodeToString(b,  android.util.Base64.NO_WRAP)
            // this.imagebase = encImage;
            // this.image = "data:image/png;base64," + this.imagebase;
            // this.imagebase = this.imagebase.replace(/\+/g,'-');
            // this.imagebase = this.imagebase.replace('/', 'AC');
            // this.imagebase = this.imagebase.replace()
            // const data = file.getBytes("UTF-8");
            // const base64 = android.util.Base64.encodeToString(data,  android.util.Base64.NO_WRAP);               
            image_source_1.fromAsset(imageAsset).then(function (res) {
                // this.imagebase = android.util.Base64.decode(res, android.util.Base64.DEFAULT);
                _this.imagebase = res.toBase64String("jpg");
                _this.image = "data:image/png;base64," + _this.imagebase;
                _this.imagebase = _this.imagebase.replace(/\+/g, '-');
                // console.log("base64: " + base64.toString());                  
            });
        }).catch(function (err) {
            console.log("Error -> " + err.message);
        });
    };
    AppointmentDetailComponent.prototype.saveExpense = function () {
        this.appointmentService.saveExpense(this.appointment, this.imagebase, this.expenseType, this.amount).catch(function (err) {
            console.dir(err);
            return err; // observable needs to be returned or exception raised
        }).subscribe(function (res) {
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
                console.log("Current location is: ");
                console.dir(loc);
                var marker = new nativescript_google_maps_sdk_1.Marker();
                _this.latitude = loc.latitude;
                _this.longitude = loc.longitude;
                marker.position = nativescript_google_maps_sdk_1.Position.positionFromLatLng(_this.latitude, _this.longitude);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwb2ludG1lbnQtZGV0YWlsLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwcG9pbnRtZW50LWRldGFpbC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBNkQ7QUFDN0QsMENBQWlEO0FBQ2pELDZEQUEyRDtBQUkzRCw2RUFBeUU7QUFDekUsNENBQThDO0FBQzlDLDBFQUF3RTtBQUN4RSw2RUFBK0U7QUFDL0UscUJBQXFCLENBQUMsZUFBZSxDQUFDLFVBQVUsRUFBRSxjQUFNLE9BQUEsT0FBTyxDQUFDLHVCQUF1QixDQUFDLENBQUMsUUFBUSxFQUF6QyxDQUF5QyxDQUFDLENBQUM7QUFDbkcscUVBQXFJO0FBRXJJLGtDQUFlLENBQUMsU0FBUyxFQUFFLGNBQU0sT0FBQSxzQ0FBTyxFQUFQLENBQU8sQ0FBQyxDQUFDO0FBQzFDLDJFQUFpRjtBQWVqRjtJQW9CSSxvQ0FDWSxrQkFBc0MsRUFDdEMsS0FBcUI7UUFEckIsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUFvQjtRQUN0QyxVQUFLLEdBQUwsS0FBSyxDQUFnQjtRQW5CekIsYUFBUSxHQUFHLFNBQVMsQ0FBQztRQUNyQixjQUFTLEdBQUcsQ0FBQyxTQUFTLENBQUM7UUFDdkIsU0FBSSxHQUFHLEVBQUUsQ0FBQztRQUNWLFlBQU8sR0FBRyxDQUFDLENBQUM7UUFDWixTQUFJLEdBQUcsQ0FBQyxDQUFDO1FBRVQsWUFBTyxHQUFHLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFHM0IsV0FBTSxHQUFRLEVBQUUsQ0FBQztRQUNqQixnQkFBVyxHQUFRLEVBQUUsQ0FBQztRQVUxQixJQUFJLENBQUMsV0FBVyxHQUFnQixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO1FBQ3RGLE1BQU0sQ0FBQyxrQkFBa0Is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IHsgQ29tcG9uZW50LCBPbkluaXQsIFZpZXdDaGlsZCB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBBY3RpdmF0ZWRSb3V0ZSB9IGZyb20gXCJAYW5ndWxhci9yb3V0ZXJcIjtcbmltcG9ydCB7IEFwcG9pbnRtZW50U2VydmljZSB9IGZyb20gXCIuL2FwcG9pbnRtZW50LnNlcnZpY2VcIjtcbmltcG9ydCB7IEFwcG9pbnRtZW50IH0gZnJvbSBcIi4vYXBwb2ludG1lbnQubW9kZWxcIjtcblxuaW1wb3J0IHsgVGVsZXBob255IH0gZnJvbSAnbmF0aXZlc2NyaXB0LXRlbGVwaG9ueSc7XG5pbXBvcnQgeyBNYXBWaWV3LCBNYXJrZXIsIFBvc2l0aW9uIH0gZnJvbSAnbmF0aXZlc2NyaXB0LWdvb2dsZS1tYXBzLXNkayc7XG5pbXBvcnQgKiBhcyBjYW1lcmEgZnJvbSBcIm5hdGl2ZXNjcmlwdC1jYW1lcmFcIjtcbmltcG9ydCB7IHJlZ2lzdGVyRWxlbWVudCB9IGZyb20gJ25hdGl2ZXNjcmlwdC1hbmd1bGFyL2VsZW1lbnQtcmVnaXN0cnknO1xuaW1wb3J0ICogYXMgZWxlbWVudFJlZ2lzdHJ5TW9kdWxlIGZyb20gJ25hdGl2ZXNjcmlwdC1hbmd1bGFyL2VsZW1lbnQtcmVnaXN0cnknO1xuZWxlbWVudFJlZ2lzdHJ5TW9kdWxlLnJlZ2lzdGVyRWxlbWVudChcIkNhcmRWaWV3XCIsICgpID0+IHJlcXVpcmUoXCJuYXRpdmVzY3JpcHQtY2FyZHZpZXdcIikuQ2FyZFZpZXcpO1xuaW1wb3J0IHsgaXNFbmFibGVkLCBlbmFibGVMb2NhdGlvblJlcXVlc3QsIGdldEN1cnJlbnRMb2NhdGlvbiwgd2F0Y2hMb2NhdGlvbiwgZGlzdGFuY2UsIGNsZWFyV2F0Y2ggfSBmcm9tIFwibmF0aXZlc2NyaXB0LWdlb2xvY2F0aW9uXCI7XG5pbXBvcnQgeyByZXNldENTU1Byb3BlcnRpZXMgfSBmcm9tIFwidG5zLWNvcmUtbW9kdWxlcy91aS9mcmFtZS9mcmFtZVwiO1xucmVnaXN0ZXJFbGVtZW50KCdNYXBWaWV3JywgKCkgPT4gTWFwVmlldyk7XG5pbXBvcnQgeyBmcm9tQXNzZXQsIGZyb21EYXRhIH0gZnJvbSBcInRucy1jb3JlLW1vZHVsZXMvaW1hZ2Utc291cmNlL2ltYWdlLXNvdXJjZVwiO1xuaW1wb3J0IHsgTG9vcEFwcG9pbnRtZW50IH0gZnJvbSBcIi4vbG9vcC9sb29wLWFwcG9pbnRtZW50Lm1vZGVsXCI7XG4vLyBpbXBvcnQgeyBhbmRyb2lkIH0gZnJvbSBcInRucy1jb3JlLW1vZHVsZXMvYXBwbGljYXRpb24vYXBwbGljYXRpb25cIjtcbi8vIGRlY2xhcmUgdmFyIEJpdG1hcEZhY3Rvcnk6IGFueVxuZGVjbGFyZSB2YXIgYW5kcm9pZDtcbmRlY2xhcmUgdmFyIGphdmE7XG5kZWNsYXJlIHZhciBieXRlO1xuZGVjbGFyZSB2YXIgQnl0ZUFycmF5T3V0cHV0U3RyZWFtO1xuZGVjbGFyZSB2YXIgQml0bWFwO1xuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6IFwibnMtZGV0YWlsc1wiLFxuICAgIG1vZHVsZUlkOiBtb2R1bGUuaWQsXG4gICAgdGVtcGxhdGVVcmw6IFwiLi9hcHBvaW50bWVudC1kZXRhaWwuY29tcG9uZW50Lmh0bWxcIixcbiAgICBzdHlsZVVybHM6IFsnLi9hcHBvaW50bWVudC1kZXRhaWwuY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgQXBwb2ludG1lbnREZXRhaWxDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICAgIHByaXZhdGUgYXBwb2ludG1lbnQ6IEFwcG9pbnRtZW50O1xuICAgIHByaXZhdGUgZXhwZW5zZXM6IEFycmF5PG9iamVjdD47XG4gICAgcHJpdmF0ZSBsYXRpdHVkZSA9IDI1Ljc3MzMzODtcbiAgICBwcml2YXRlIGxvbmdpdHVkZSA9IC04MC4xOTAwNzI7XG4gICAgcHJpdmF0ZSB6b29tID0gMTY7XG4gICAgcHJpdmF0ZSBiZWFyaW5nID0gMDtcbiAgICBwcml2YXRlIHRpbHQgPSAwO1xuICAgIHByaXZhdGUgQ3VycmVudExvY2F0aW9uO1xuICAgIHByaXZhdGUgcGFkZGluZyA9IFs0MCwgNDAsIDQwLCA0MF07XG4gICAgcHJpdmF0ZSBtYXBWaWV3OiBNYXBWaWV3O1xuICAgIHByaXZhdGUgcGhvbmVOdW1iZXI6IGFueTtcbiAgICBwcml2YXRlIGFtb3VudDogYW55ID0gJyc7XG4gICAgcHJpdmF0ZSBleHBlbnNlVHlwZTogYW55ID0gJyc7XG4gICAgcHJpdmF0ZSBpbWFnZTogc3RyaW5nO1xuICAgIHByaXZhdGUgaW1hZ2ViYXNlOiBzdHJpbmc7XG4gICAgLy8gcHJpdmF0ZSBpbWFnZTogYW55ID0gXCJodHRwczovL3BsYXkubmF0aXZlc2NyaXB0Lm9yZy9kaXN0L2Fzc2V0cy9pbWcvTmF0aXZlU2NyaXB0X2xvZ28ucG5nXCI7XG5cbiAgICBsYXN0Q2FtZXJhOiBTdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJpdmF0ZSBhcHBvaW50bWVudFNlcnZpY2U6IEFwcG9pbnRtZW50U2VydmljZSxcbiAgICAgICAgcHJpdmF0ZSByb3V0ZTogQWN0aXZhdGVkUm91dGUpIHtcbiAgICAgICAgdGhpcy5hcHBvaW50bWVudCA9IDxBcHBvaW50bWVudD5KU09OLnBhcnNlKHRoaXMucm91dGUuc25hcHNob3QucGFyYW1zW1wiYXBwb2ludG1lbnRcIl0pO1xuICAgICAgICBjYW1lcmEucmVxdWVzdFBlcm1pc3Npb25zKCk7XG4gICAgfVxuXG4gICAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgICAgIGxldCBhZGRyZXNzID0gdGhpcy5hcHBvaW50bWVudC5jbGlBZGRyZXNzMSArICcgJyArIHRoaXMuYXBwb2ludG1lbnQuY2xpQ2l0eSArICcgJyArIHRoaXMuYXBwb2ludG1lbnQuY2xpU3RhdGUgKyAnICcgKyB0aGlzLmFwcG9pbnRtZW50LmNsaVppcDtcbiAgICAgICAgdGhpcy5hcHBvaW50bWVudFNlcnZpY2UuZ2V0QXBwb2ludG1lbnRMb2NhdGlvbihhZGRyZXNzKS5zdWJzY3JpYmUoKHJlczogYW55KSA9PiB7XG4gICAgICAgICAgICB2YXIgbWFya2VyID0gbmV3IE1hcmtlcigpO1xuICAgICAgICAgICAgdGhpcy5sYXRpdHVkZSA9IHJlcy5yZXN1bHRzWzBdLmdlb21ldHJ5LmxvY2F0aW9uLmxhdDtcbiAgICAgICAgICAgIHRoaXMubG9uZ2l0dWRlID0gcmVzLnJlc3VsdHNbMF0uZ2VvbWV0cnkubG9jYXRpb24ubG5nO1xuICAgICAgICAgICAgbWFya2VyLnBvc2l0aW9uID0gUG9zaXRpb24ucG9zaXRpb25Gcm9tTGF0TG5nKHRoaXMubGF0aXR1ZGUsIHRoaXMubG9uZ2l0dWRlKTtcbiAgICAgICAgICAgIG1hcmtlci50aXRsZSA9IHJlcy5yZXN1bHRzWzBdLmZvcm1hdHRlZF9hZGRyZXNzO1xuICAgICAgICAgICAgbWFya2VyLnNuaXBwZXQgPSBcIlwiO1xuICAgICAgICAgICAgbWFya2VyLnVzZXJEYXRhID0geyBpbmRleDogMSB9O1xuICAgICAgICAgICAgdGhpcy5tYXBWaWV3LmFkZE1hcmtlcihtYXJrZXIpO1xuICAgICAgICAgICAgdGhpcy56b29tID0gMTM7XG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gdGhpcy5hcHBvaW50bWVudFNlcnZpY2UubG9vcEdldEFwcGlvbnRtZW50cygpLmNhdGNoKGVyciA9PiAgeyBcbiAgICAgICAgLy8gICAgIGNvbnNvbGUuZGlyKGVycik7ICAgICAgICAgICAgXG4gICAgICAgIC8vICAgICByZXR1cm4gZXJyOyAvLyBvYnNlcnZhYmxlIG5lZWRzIHRvIGJlIHJldHVybmVkIG9yIGV4Y2VwdGlvbiByYWlzZWRcbiAgICAgICAgLy8gIH0pLnN1YnNjcmliZShyZXMgPT4ge1xuICAgICAgICAvLyAgICAgY29uc29sZS5kaXIoXCJhcHBvaW50bWVudHNsb29wIDogXCIrcmVzKTtcblxuICAgICAgICAvLyB9KVxuXG4gICAgICAgIHRoaXMuYXBwb2ludG1lbnRTZXJ2aWNlLmdldEV4cGVuc2VzQnlBcHBvaW50bWVudElkKHRoaXMuYXBwb2ludG1lbnQuQXBwSWQudG9TdHJpbmcoKSkuc3Vic2NyaWJlKHJlcyA9PiB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcInJlczogXCIgKyByZXMpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5kaXIocmVzKTtcbiAgICAgICAgICAgIC8vIGlmIChyZXMubGVuZ3RoID4gMCkgeyAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIC8vICAgICB0aGlzLmV4cGVuc2VzID0gcmVzLm1hcCggb2JqID0+ICB7XG4gICAgICAgICAgICAvLyAgICAgICAgIG9iai5pbWcucmVwbGFjZSgvXFwtL2csJysnKTtcbiAgICAgICAgICAgIC8vICAgICB9KTtcbiAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgIHRoaXMuZXhwZW5zZXMgPSByZXM7XG4gICAgICAgIH0pO1xuICAgIH1cblxuXG4gICAgYWRkRXhwZW5zZSgpIHtcblxuICAgICAgICB2YXIgb3B0aW9ucyA9IHsgd2lkdGg6IDMwMCwgaGVpZ2h0OiAzMDAsIGtlZXBBc3BlY3RSYXRpbzogdHJ1ZSwgc2F2ZVRvR2FsbGVyeTogZmFsc2UgfTtcbiAgICAgICAgdGhpcy5pbWFnZWJhc2UgPSAnJztcbiAgICAgICAgdGhpcy5pbWFnZSA9ICcnO1xuICAgICAgICBjYW1lcmEudGFrZVBpY3R1cmUob3B0aW9ucylcbiAgICAgICAgICAgIC50aGVuKChpbWFnZUFzc2V0OiBhbnkpID0+IHtcblxuICAgICAgICAgICAgICAgIC8vIHZhciBmaWxlID0gbmV3IGphdmEuaW8uRmlsZShpbWFnZUFzc2V0LmFuZHJvaWQpO1xuICAgICAgICAgICAgICAgIC8vIHZhciBzaXplID0gZmlsZS5sZW5ndGgoKTtcbiAgICAgICAgICAgICAgICAvLyB2YXIgYnl0ZXMgPSBuZXcgYnl0ZVtzaXplXTtcbiAgICAgICAgICAgICAgICAvLyB0cnkge1xuICAgICAgICAgICAgICAgIC8vICAgICAgdmFyIGJ1ZiA9IG5ldyBqYXZhLmlvLkJ1ZmZlcmVkSW5wdXRTdHJlYW0obmV3IGphdmEuaW8uRmlsZUlucHV0U3RyZWFtKGZpbGUpKTtcbiAgICAgICAgICAgICAgICAvLyAgICAgIGJ1Zi5yZWFkKGJ5dGVzLCAwLCBieXRlcy5sZW5ndGgpO1xuICAgICAgICAgICAgICAgIC8vICAgICAgLy9kbyBzb21ldGhpbmdcbiAgICAgICAgICAgICAgICAvLyAgICAgIGJ1Zi5jbG9zZSgpO1xuICAgICAgICAgICAgICAgIC8vIH0gY2F0Y2ggKGV4KSB7XG4gICAgICAgICAgICAgICAgLy8gICAgICBjb25zb2xlLmxvZyhleCk7XG4gICAgICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIGxldCBibSA9IGFuZHJvaWQuZ3JhcGhpY3MuQml0bWFwRmFjdG9yeS5kZWNvZGVGaWxlKGltYWdlQXNzZXQuYW5kcm9pZCk7XG4gICAgICAgICAgICAgICAgLy8gbGV0IGJhb3MgPSBuZXcgamF2YS5pby5CeXRlQXJyYXlPdXRwdXRTdHJlYW0oKTtcbiAgICAgICAgICAgICAgICAvLyBibS5jb21wcmVzcyhhbmRyb2lkLmdyYXBoaWNzLkJpdG1hcC5Db21wcmVzc0Zvcm1hdC5KUEVHLCAxMDAsIGJhb3MpO1xuXG4gICAgICAgICAgICAgICAgLy8gbGV0ICBiID0gYmFvcy50b0J5dGVBcnJheSgpO1xuICAgICAgICAgICAgICAgIC8vIGxldCBlbmNJbWFnZSA9YW5kcm9pZC51dGlsLkJhc2U2NC5lbmNvZGVUb1N0cmluZyhiLCAgYW5kcm9pZC51dGlsLkJhc2U2NC5OT19XUkFQKVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIHRoaXMuaW1hZ2ViYXNlID0gZW5jSW1hZ2U7XG4gICAgICAgICAgICAgICAgLy8gdGhpcy5pbWFnZSA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LFwiICsgdGhpcy5pbWFnZWJhc2U7XG5cbiAgICAgICAgICAgICAgICAvLyB0aGlzLmltYWdlYmFzZSA9IHRoaXMuaW1hZ2ViYXNlLnJlcGxhY2UoL1xcKy9nLCctJyk7XG5cblxuICAgICAgICAgICAgICAgIC8vIHRoaXMuaW1hZ2ViYXNlID0gdGhpcy5pbWFnZWJhc2UucmVwbGFjZSgnLycsICdBQycpO1xuICAgICAgICAgICAgICAgIC8vIHRoaXMuaW1hZ2ViYXNlID0gdGhpcy5pbWFnZWJhc2UucmVwbGFjZSgpXG4gICAgICAgICAgICAgICAgLy8gY29uc3QgZGF0YSA9IGZpbGUuZ2V0Qnl0ZXMoXCJVVEYtOFwiKTtcbiAgICAgICAgICAgICAgICAvLyBjb25zdCBiYXNlNjQgPSBhbmRyb2lkLnV0aWwuQmFzZTY0LmVuY29kZVRvU3RyaW5nKGRhdGEsICBhbmRyb2lkLnV0aWwuQmFzZTY0Lk5PX1dSQVApOyAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGZyb21Bc3NldChpbWFnZUFzc2V0KS50aGVuKHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHRoaXMuaW1hZ2ViYXNlID0gYW5kcm9pZC51dGlsLkJhc2U2NC5kZWNvZGUocmVzLCBhbmRyb2lkLnV0aWwuQmFzZTY0LkRFRkFVTFQpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmltYWdlYmFzZSA9IHJlcy50b0Jhc2U2NFN0cmluZyhcImpwZ1wiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbWFnZSA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LFwiICsgdGhpcy5pbWFnZWJhc2U7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW1hZ2ViYXNlID0gdGhpcy5pbWFnZWJhc2UucmVwbGFjZSgvXFwrL2csJy0nKTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiYmFzZTY0OiBcIiArIGJhc2U2NC50b1N0cmluZygpKTsgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRXJyb3IgLT4gXCIgKyBlcnIubWVzc2FnZSk7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cblxuXG4gICAgc2F2ZUV4cGVuc2UoKSB7XG4gICAgICAgIHRoaXMuYXBwb2ludG1lbnRTZXJ2aWNlLnNhdmVFeHBlbnNlKHRoaXMuYXBwb2ludG1lbnQsIHRoaXMuaW1hZ2ViYXNlLCB0aGlzLmV4cGVuc2VUeXBlLCB0aGlzLmFtb3VudCkuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUuZGlyKGVycik7XG4gICAgICAgICAgICByZXR1cm4gZXJyOyAvLyBvYnNlcnZhYmxlIG5lZWRzIHRvIGJlIHJldHVybmVkIG9yIGV4Y2VwdGlvbiByYWlzZWRcbiAgICAgICAgfSkuc3Vic2NyaWJlKHJlcyA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmRpcihyZXMpO1xuICAgICAgICB9KSwgZXJyID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3I6IFwiICsgZXJyLm1lc3NhZ2UpO1xuICAgICAgICAgICAgY29uc29sZS5kaXIoZXJyKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNoZWNraW5Mb2NhdGlvbigpOiBhbnkge1xuICAgICAgICBnZXRDdXJyZW50TG9jYXRpb24oeyBkZXNpcmVkQWNjdXJhY3k6IDMsIHVwZGF0ZURpc3RhbmNlOiAxLCBtYXhpbXVtQWdlOiAyMDAwMCwgdGltZW91dDogMjAwMDAgfSkuXG4gICAgICAgICAgICB0aGVuKGxvYyA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGxvYykge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkN1cnJlbnQgbG9jYXRpb24gaXM6IFwiKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5kaXIobG9jKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG1hcmtlciA9IG5ldyBNYXJrZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sYXRpdHVkZSA9IGxvYy5sYXRpdHVkZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb25naXR1ZGUgPSBsb2MubG9uZ2l0dWRlO1xuICAgICAgICAgICAgICAgICAgICBtYXJrZXIucG9zaXRpb24gPSBQb3NpdGlvbi5wb3NpdGlvbkZyb21MYXRMbmcodGhpcy5sYXRpdHVkZSwgdGhpcy5sb25naXR1ZGUpO1xuICAgICAgICAgICAgICAgICAgICBtYXJrZXIudGl0bGUgPSBcIk1pYW1pXCI7XG4gICAgICAgICAgICAgICAgICAgIG1hcmtlci5zbmlwcGV0ID0gXCJVc2FcIjtcbiAgICAgICAgICAgICAgICAgICAgbWFya2VyLnVzZXJEYXRhID0geyBpbmRleDogMSB9O1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm1hcFZpZXcuYWRkTWFya2VyKG1hcmtlcik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuem9vbSA9IDE2O1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFwcG9pbnRtZW50U2VydmljZS5zZXRHZW9Mb2NhdGlvbihsb2MsIHRoaXMuYXBwb2ludG1lbnQpLnN1YnNjcmliZShyZXMgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzKTtcbiAgICAgICAgICAgICAgICAgICAgfSwgZXJyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJFcnJvcjogXCIgKyBlLm1lc3NhZ2UpO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgb25NYXBSZWFkeShldmVudCkge1xuICAgICAgICB0aGlzLm1hcFZpZXcgPSBldmVudC5vYmplY3Q7XG4gICAgICAgIHRoaXMubWFwVmlldy5zZXR0aW5ncy56b29tR2VzdHVyZXNFbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5tYXBWaWV3LnNldHRpbmdzLm15TG9jYXRpb25CdXR0b25FbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5tYXBWaWV3LnNldHRpbmdzLnNjcm9sbEdlc3R1cmVzRW5hYmxlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgb25Db29yZGluYXRlVGFwcGVkKGFyZ3MpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJDb29yZGluYXRlIFRhcHBlZCwgTGF0OiBcIiArIGFyZ3MucG9zaXRpb24ubGF0aXR1ZGUgKyBcIiwgTG9uOiBcIiArIGFyZ3MucG9zaXRpb24ubG9uZ2l0dWRlLCBhcmdzKTtcbiAgICB9XG5cbiAgICBvbk1hcmtlckV2ZW50KGFyZ3MpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJNYXJrZXIgRXZlbnQ6ICdcIiArIGFyZ3MuZXZlbnROYW1lXG4gICAgICAgIC8vICAgICArIFwiJyB0cmlnZ2VyZWQgb246IFwiICsgYXJncy5tYXJrZXIudGl0bGVcbiAgICAgICAgLy8gICAgICsgXCIsIExhdDogXCIgKyBhcmdzLm1hcmtlci5wb3NpdGlvbi5sYXRpdHVkZSArIFwiLCBMb246IFwiICsgYXJncy5tYXJrZXIucG9zaXRpb24ubG9uZ2l0dWRlLCBhcmdzKTtcbiAgICB9XG5cbiAgICBvbkNhbWVyYUNoYW5nZWQoYXJncykge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkNhbWVyYSBjaGFuZ2VkOiBcIiArIEpTT04uc3RyaW5naWZ5KGFyZ3MuY2FtZXJhKSwgSlNPTi5zdHJpbmdpZnkoYXJncy5jYW1lcmEpID09PSB0aGlzLmxhc3RDYW1lcmEpO1xuICAgICAgICAvLyB0aGlzLmxhc3RDYW1lcmEgPSBKU09OLnN0cmluZ2lmeShhcmdzLmNhbWVyYSk7XG4gICAgfVxuXG5cbn1cbiJdfQ==