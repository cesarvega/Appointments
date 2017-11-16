import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AppointmentService } from "./appointment.service";
import { Appointment } from "./appointment.model";

import { Telephony } from 'nativescript-telephony';
import { MapView, Marker, Position } from 'nativescript-google-maps-sdk';
import * as camera from "nativescript-camera";
import { registerElement } from 'nativescript-angular/element-registry';
import * as elementRegistryModule from 'nativescript-angular/element-registry';
elementRegistryModule.registerElement("CardView", () => require("nativescript-cardview").CardView);
import { isEnabled, enableLocationRequest, getCurrentLocation, watchLocation, distance, clearWatch } from "nativescript-geolocation";
import { resetCSSProperties } from "tns-core-modules/ui/frame/frame";
registerElement('MapView', () => MapView);
import { fromAsset, fromData } from "tns-core-modules/image-source/image-source";
// import { android } from "tns-core-modules/application/application";
declare var BitmapFactory: any
declare var android;
declare var ByteArrayOutputStream;
declare var Bitmap;
@Component({
    selector: "ns-details",
    moduleId: module.id,
    templateUrl: "./appointment-detail.component.html",
    styleUrls: ['./appointment-detail.css']
})
export class AppointmentDetailComponent implements OnInit {
    private appointment: Appointment;
    private latitude = 25.773338;
    private longitude = -80.190072;
    private zoom = 13;
    private bearing = 0;
    private tilt = 0;
    private CurrentLocation;
    private padding = [40, 40, 40, 40];
    private mapView: MapView;
    private phoneNumber: any;
    private amount: any;
    private expenseType: any;
    private image : string;
    private imagebase : string;
    // private image: any = "https://play.nativescript.org/dist/assets/img/NativeScript_logo.png";

    lastCamera: String;

    constructor(
        private appointmentService: AppointmentService,
        private route: ActivatedRoute) {
        this.appointment = <Appointment>JSON.parse(this.route.snapshot.params["appointment"]);
        camera.requestPermissions();
        // <DEPRECATED-CODE>
        // getCurrentLocation({ desiredAccuracy: 3, updateDistance: 1, maximumAge: 20000, timeout: 20000 }).
        //     then(loc => {
        //         if (loc) {                 
        //             var marker = new Marker();
        //             this.latitude = loc.latitude;
        //             this.longitude = loc.longitude;
        //             marker.position = Position.positionFromLatLng(this.latitude, this.longitude);
        //             marker.title = "current location";
        //             marker.snippet = "Usa";
        //             marker.userData = { index: 1 };
        //             this.mapView.addMarker(marker);
        //             this.zoom = 13;                   
        //         }
        //     });
    }

    ngOnInit(): void {
        let address = this.appointment.cliAddress1 +' '+ this.appointment.cliCity +' '+  this.appointment.cliState +' '+ this.appointment.cliZip;
        // this.appointmentService.getAppointmentLocation(address).subscribe((res : any) =>{
        //     // console.log("geoquery: "+ res);
        //     console.dir(res);
        //     // console.dir(res.results[0].geometry.location.lng);
        //     let locationLatitud = res.results
        //     var marker = new Marker();
        //     this.latitude = res.results[0].geometry.location.lat;
        //     this.longitude = res.results[0].geometry.location.lng;
        //     marker.position = Position.positionFromLatLng(this.latitude, this.longitude);
        //     marker.title = res.results[0].formatted_address;
        //     marker.snippet = "";
        //     marker.userData = { index: 1 };
        //     this.mapView.addMarker(marker);
        //     this.zoom = 18;
        // })
        // this.appointmentService.getExpensesByAppointmentId(this.appointment.AppId.toString()).subscribe( res => {
        // console.log("res: " +res);
        // console.dir(res);
        // });
    }

    addExpense() {
        var options = { width: 80, height: 80, keepAspectRatio: false, saveToGallery: false };
        camera.takePicture(options)
            .then((imageAsset: any) => {                  
                fromAsset(imageAsset).then(res => {                   
                    var base64 = res.toBase64String("jpeg", 100);
                    this.imagebase = base64;
                    console.log("base64: " + base64.toString());                  
                    this.image = "data:image/png;base64," + base64;
                })
            }).catch((err) => {
                console.log("Error -> " + err.message);
            });
    }

    saveExpense() {
        this.appointmentService.saveExpense(this.appointment, this.imagebase, this.expenseType, this.amount).catch(err =>  { 
            console.dir(err);            
            return err; // observable needs to be returned or exception raised
         }).subscribe(res => {
            console.dir(res);
        }), err => {
            console.log("error: " + err.message);
            console.dir(err);
        }
    }

    checkinLocation(): any {
        getCurrentLocation({ desiredAccuracy: 3, updateDistance: 1, maximumAge: 20000, timeout: 20000 }).
            then(loc => {
                if (loc) {
                    console.log("Current location is: ");
                    console.dir(loc);
                    var marker = new Marker();
                    this.latitude = loc.latitude;
                    this.longitude = loc.longitude;
                    marker.position = Position.positionFromLatLng(this.latitude, this.longitude);
                    marker.title = "Miami";
                    marker.snippet = "Usa";
                    marker.userData = { index: 1 };
                    this.mapView.addMarker(marker);
                    this.zoom = 18;
                    this.appointmentService.setGeoLocation(loc, this.appointment).subscribe(res => {
                        console.log(res);
                    }, err => {
                        console.log(err);
                    });
                }
            }, (e) => {
                console.log("Error: " + e.message);
            });
    }

    onMapReady(event) {    
        this.mapView = event.object;
        this.mapView.settings.zoomGesturesEnabled = true;
        this.mapView.settings.myLocationButtonEnabled = true;
        this.mapView.settings.scrollGesturesEnabled = true;
    }

    onCoordinateTapped(args) {
        console.log("Coordinate Tapped, Lat: " + args.position.latitude + ", Lon: " + args.position.longitude, args);
    }

    onMarkerEvent(args) {
        console.log("Marker Event: '" + args.eventName
            + "' triggered on: " + args.marker.title
            + ", Lat: " + args.marker.position.latitude + ", Lon: " + args.marker.position.longitude, args);
    }

    onCameraChanged(args) {
        console.log("Camera changed: " + JSON.stringify(args.camera), JSON.stringify(args.camera) === this.lastCamera);
        this.lastCamera = JSON.stringify(args.camera);
    }


}
