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
import { LoopAppointment } from "./loop/loop-appointment.model";
// import { android } from "tns-core-modules/application/application";
// declare var BitmapFactory: any
declare var android;
declare var java;
declare var byte;
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
    private expenses: Array<object>;
    private latitude = 25.773338;
    private longitude = -80.190072;
    private zoom = 16;
    private bearing = 0;
    private tilt = 0;
    private CurrentLocation;
    private padding = [40, 40, 40, 40];
    private mapView: MapView;
    private phoneNumber: any;
    private amount: any = '';
    private expenseType: any = '';
    private image: string;
    private imagebase: string;
    // private image: any = "https://play.nativescript.org/dist/assets/img/NativeScript_logo.png";

    lastCamera: String;

    constructor(
        private appointmentService: AppointmentService,
        private route: ActivatedRoute) {
        this.appointment = <Appointment>JSON.parse(this.route.snapshot.params["appointment"]);
        camera.requestPermissions();
    }

    ngOnInit(): void {
        let address = this.appointment.cliAddress1 + ' ' + this.appointment.cliCity + ' ' + this.appointment.cliState + ' ' + this.appointment.cliZip;
        this.appointmentService.getAppointmentLocation(address).subscribe((res: any) => {
            var marker = new Marker();
            this.latitude = res.results[0].geometry.location.lat;
            this.longitude = res.results[0].geometry.location.lng;
            marker.position = Position.positionFromLatLng(this.latitude, this.longitude);
            marker.title = res.results[0].formatted_address;
            marker.snippet = "";
            marker.userData = { index: 1 };
            this.mapView.addMarker(marker);
            this.zoom = 13;
        })

        // this.appointmentService.loopGetAppiontments().catch(err =>  { 
        //     console.dir(err);            
        //     return err; // observable needs to be returned or exception raised
        //  }).subscribe(res => {
        //     console.dir("appointmentsloop : "+res);

        // })

        this.appointmentService.getExpensesByAppointmentId(this.appointment.AppId.toString()).subscribe(res => {
            // console.log("res: " + res);
            // console.dir(res);
            // if (res.length > 0) {                
            //     this.expenses = res.map( obj =>  {
            //         obj.img.replace(/\-/g,'+');
            //     });
            // }
            this.expenses = res;
        });
    }


    addExpense() {

        var options = { width: 100, height: 100, keepAspectRatio: true, saveToGallery: false };
        this.imagebase = '';
        this.image = '';
        camera.takePicture(options)
            .then((imageAsset: any) => {

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
                fromAsset(imageAsset).then(res => {
                    // this.imagebase = android.util.Base64.decode(res, android.util.Base64.DEFAULT);
                    this.imagebase = res.toBase64String("jpg");
                    this.image = "data:image/png;base64," + this.imagebase;
                    this.imagebase = this.imagebase.replace(/\+/g,'-');
                    
                    // console.log("base64: " + base64.toString());                  
                })
            }).catch((err) => {
                console.log("Error -> " + err.message);
            });
    }



    saveExpense() {
        this.appointmentService.saveExpense(this.appointment, this.imagebase, this.expenseType, this.amount).catch(err => {
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
                    this.zoom = 16;
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
        // console.log("Coordinate Tapped, Lat: " + args.position.latitude + ", Lon: " + args.position.longitude, args);
    }

    onMarkerEvent(args) {
        // console.log("Marker Event: '" + args.eventName
        //     + "' triggered on: " + args.marker.title
        //     + ", Lat: " + args.marker.position.latitude + ", Lon: " + args.marker.position.longitude, args);
    }

    onCameraChanged(args) {
        // console.log("Camera changed: " + JSON.stringify(args.camera), JSON.stringify(args.camera) === this.lastCamera);
        // this.lastCamera = JSON.stringify(args.camera);
    }


}
