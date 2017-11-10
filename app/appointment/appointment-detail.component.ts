import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AppointmentService } from "./appointment.service";
import { Appointment } from "./appointment.model";

import { registerElement } from 'nativescript-angular/element-registry';
import { MapView, Marker, Position } from 'nativescript-google-maps-sdk';

import * as elementRegistryModule from 'nativescript-angular/element-registry';
elementRegistryModule.registerElement("CardView", () => require("nativescript-cardview").CardView);
import { isEnabled, enableLocationRequest, getCurrentLocation, watchLocation, distance, clearWatch } from "nativescript-geolocation";
// Important - must register MapView plugin in order to use in Angular templates
registerElement('MapView', () => MapView);


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

    lastCamera: String;

    constructor(
        private appointmentService: AppointmentService,
        private route: ActivatedRoute) {
        this.appointment = <Appointment>JSON.parse(this.route.snapshot.params["appointment"]);

    }
    ngOnInit(): void {
        // location services
        this.getlocation();
    }

 

    checkinLocation() {
        this.CurrentLocation =  this.getlocation();        
      
    }

    //Map events
    onMapReady(event) {
        console.log('Map Ready');

        this.mapView = event.object;

        console.log("Setting a marker...");

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


    getlocation():any{
        getCurrentLocation({ desiredAccuracy: 3, updateDistance: 10, maximumAge: 20000, timeout: 20000 }).
        then(loc => {
            if (loc) {
                console.log("Current location is: ");
                console.dir(loc);
                this.appointmentService.setGeoLocation(loc);
            //   return loc;
            }
        }, (e) => {
            console.log("Error: " + e.message);            
        });
    } 

}
