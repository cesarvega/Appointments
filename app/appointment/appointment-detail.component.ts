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
import * as  base64 from "base-64";
import * as utf8 from "utf8";
import { fromAsset } from "tns-core-modules/image-source/image-source";

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
    private zoom = 8;
    private bearing = 0;
    private tilt = 0;
    private CurrentLocation;
    private padding = [40, 40, 40, 40];
    private mapView: MapView;
    private phoneNumber:any;
    private amount:any;
    private expenseType:any;
    private image:any= "https://play.nativescript.org/dist/assets/img/NativeScript_logo.png";

    lastCamera: String;

    constructor(
        private appointmentService: AppointmentService,
        private route: ActivatedRoute) {
        this.appointment = <Appointment>JSON.parse(this.route.snapshot.params["appointment"]);
       

    }
    ngOnInit(): void {
        camera.requestPermissions();
    }

 

    addExpense() {       
        var options = { width: 300, height: 300, keepAspectRatio: false, saveToGallery: false };
        camera.takePicture(options)
        .then((imageAsset) => {
            console.log("Result is an image asset instance"); 
            fromAsset(imageAsset).then(res => {
                var myImageSource : any = res;
                var base64 = myImageSource.toBase64String("jpeg", 100);
                this.image  = "data:image/png;base64," + base64;                
            })          
        }).catch((err) => {
            console.log("Error -> " + err.message);
        });      
    }

   
    saveExpense(){
        this.appointmentService.saveExpense(this.appointment, this.image, this.expenseType, this.amount).subscribe(res =>{
            console.log(res);            
        })
    }

    
    onMapReady(event) {
        // console.log('Map Ready');
        this.mapView = event.object;
        // console.log("Setting a marker...");
        var marker = new Marker();
        marker.position = Position.positionFromLatLng(25.773338, -80.190072);
        marker.title = "Miami";
        marker.snippet = "Usa";
        marker.userData = { index: 1 };
        this.mapView.addMarker(marker);
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


    checkinLocation():any{
        getCurrentLocation({ desiredAccuracy: 3, updateDistance: 10, maximumAge: 20000, timeout: 20000 }).
        then(loc => {
            if (loc) {
                console.log("Current location is: ");
                console.dir(loc);
                this.appointmentService.setGeoLocation(loc, this.appointment).subscribe(res => {
                    console.log(res);
                    ;
                }, err =>{
                    console.log(err);
                    
                });
            //   return loc;
            }
        }, (e) => {
            console.log("Error: " + e.message);            
        });
    } 

}
