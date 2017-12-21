import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AppointmentService } from "./appointment.service";
import { Appointment } from "./appointment.model";
import * as Toast from "nativescript-toast";
import { Telephony } from 'nativescript-telephony';
import { MapView, Marker, Position } from 'nativescript-google-maps-sdk';
import * as camera from "nativescript-camera";
import { registerElement } from 'nativescript-angular/element-registry';
import * as elementRegistryModule from 'nativescript-angular/element-registry';
elementRegistryModule.registerElement("CardView", () => require("nativescript-cardview").CardView);
import { isEnabled, enableLocationRequest, getCurrentLocation, watchLocation, distance, clearWatch } from "nativescript-geolocation";
import { resetCSSProperties } from "tns-core-modules/ui/frame/frame";
registerElement('MapView', () => require("nativescript-google-maps-sdk").MapView);
import { fromAsset, fromData } from "tns-core-modules/image-source/image-source";
import { LoopAppointment } from "./loop/loop-appointment.model";
// import { DropDown } from 'nativescript-drop-down';
import { ValueList } from "nativescript-drop-down";
import { SelectedIndexChangedEventData } from "nativescript-drop-down";
import { forEach } from "@angular/router/src/utils/collection";
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
    
    public  selectedIndex = 1;
    private appointment: Appointment;
    private expenses: Array<object>;
    private latitude = 25.769490;
    private longitude = -80.195224;
    private latitude2 = 25.769859;
    private longitude2 = -80.19230;
    // private latitude2 = 25.774394;
    // private longitude2 = -80.141852;
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
    private isExpenseAdded: boolean = true;
    private options = [ "Billable Travel Meals",
                        "Billable Travel Non-Meals",
                        "Non-Billable Travel Meals",
                        "Non-Billable Travel Non-Meals"];

           
    
    // private image: any = "https://play.nativescript.org/dist/assets/img/NativeScript_logo.png";

    lastCamera: String;

    constructor(
        private appointmentService: AppointmentService,
        private route: ActivatedRoute) {
        this.appointment = <Appointment>JSON.parse(this.route.snapshot.params["appointment"]);
        camera.requestPermissions();
        
    }

    ngOnInit(): void {
       
    }

    showToast(message: string) {
        Toast.makeText(message, "long").show();
    }

    addExpense() {
        var options = { width: 150, height: 150, keepAspectRatio: true, saveToGallery: false };
        this.imagebase = '';
        this.image = '';
        camera.takePicture(options)
            .then((imageAsset: any) => {
                fromAsset(imageAsset).then(res => {
                    this.imagebase = res.toBase64String("jpg");
                    this.image = "data:image/png;base64," + this.imagebase;
                    this.imagebase = this.imagebase.replace(/\+/g, '-');
                })
            }).catch((err) => {
                console.log("Error -> " + err.message);
                this.showToast('Something went wrong please try again : ' + err.message);
            });

            this.isExpenseAdded = true;
    }

    saveExpense() {
        this.appointmentService.saveExpense(this.appointment, this.imagebase, this.selectedIndex.toString(), this.amount).catch(err => {
            console.dir(err);
            return err; // observable needs to be returned or exception raised
        }).subscribe(res => {
            this.imagebase = null;
            this.showToast('The Expense was successfully add it');
            this.isExpenseAdded = false;
            this.getExpenses();
            console.dir(res);
        }), err => {
            console.log("error: " + err.message);
            this.showToast('Something went wrong please try again : ' + err.message);
            console.dir(err);
        }
    }

    checkinLocation(): any {
        getCurrentLocation({ desiredAccuracy: 3, updateDistance: 1, maximumAge: 20000, timeout: 20000 }).
            then(loc => {
                if (loc) {
                    var marker = new Marker();
                    // var appointmentPosition = Position.positionFromLatLng(25.773694, -80.285451);
                    var appointmentPosition = Position.positionFromLatLng(this.latitude, this.longitude);
                    this.latitude = loc.latitude;
                    this.longitude = loc.longitude;
                    // marker.position = Position.positionFromLatLng(43.362684, -71.103530);
                    marker.position = Position.positionFromLatLng(loc.latitude, loc.longitude);
                    var distance = this.calculatDistanceBetweenpoints(marker.position, appointmentPosition);
                    marker.title = "Current Position";
                    marker.snippet = "Usa";
                    marker.userData = { index: 1 };
                    marker.color = 'green';

                    this.zoom = this.zoomDistance(distance);

                    // this.zoom = 13;
                    if (distance < 804.672) {
                        this.appointmentService.setGeoLocation(marker.position, this.appointment).subscribe(res => {
                            // this.appointmentService.setGeoLocation(loc, this.appointment).subscribe(res => {
                            this.mapView.addMarker(marker);
                            this.showToast(' You have successfully checked in your location');
                        }, err => {
                            console.log(err);
                        });
                    } else {
                        marker.title = "Your are too far away from the check in location address";
                        // marker.snippet = "";
                        marker.userData = { index: 1 };
                        marker.color = 'yellow';
                        this.mapView.addMarker(marker);
                        // this.zoom = 13;
                        this.showToast('Your are too far away from check in location address');
                    }
                    marker.showInfoWindow();
                }
            }, (e) => {
                console.log("Error: " + e.message);
            });
    }

    onMapReady(event) {
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

        let address = this.appointment.cliAddress1 + ' ' + this.appointment.cliCity + ' ' + this.appointment.cliState + ' ' + this.appointment.cliZip;
        this.appointmentService.getAppointmentLocation(address).subscribe((res: any) => {
            var marker = new Marker();
            this.latitude = res.results[0].geometry.location.lat;
            this.longitude = res.results[0].geometry.location.lng;
            // this.latitude = 25.854050;            
            // this.longitude = -80.233266;
            marker.position = Position.positionFromLatLng(this.latitude, this.longitude);

            // console.dir(marker.position);

            marker.title = res.results[0].formatted_address;
            marker.snippet = "";

            marker.color = 'blue'
            marker.userData = { index: 1 };

            this.zoom = 10;

            // var marker2 = new Marker();
            // marker2.position = Position.positionFromLatLng(43.362684, -71.103530);
            // marker2.title = "Custom";
            // // marker2.icon = 'https://chart.apis.google.com/chart?chst=d_map_pin_icon&chld=bus|FFFF00';
            // marker2.snippet = "customized";
            // // marker2.color= 'red'
            // marker2.userData = { index: 1 };
            // this.mapView.addMarker(marker, marker2);
            this.mapView.addMarker(marker);
            marker.showInfoWindow();
        })

        // this.appointmentService.loopGetAppiontments().catch(err =>  { 
        //     console.dir(err);            
        //     return err; // observable needs to be returned or exception raised
        //  }).subscribe(res => {
        //     console.dir("appointmentsloop : "+res);

        // })
        this.getExpenses();
    }

    onCoordinateTapped(args) {
        // console.log("Coordinate Tapped, Lat: " + args.position.latitude + ", Lon: " + args.position.longitude, args);
    }

    onMarkerEvent(args) {
        console.log("Marker Event: '" + args.eventName
            + "' triggered on: " + args.marker.title
            + ", Lat: " + args.marker.position.latitude + ", Lon: " + args.marker.position.longitude, args);
    }

    onCameraChanged(args) {
        // console.log("Camera changed: " + JSON.stringify(args.camera), JSON.stringify(args.camera) === this.lastCamera);
        // this.lastCamera = JSON.stringify(args.camera);
    }

    calculatDistanceBetweenpoints(p1, p2) {
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
    }


    zoomDistance(distance) {
        let zoom = 13;
        let factor = 5;
        switch (true) {

            case  (distance < 1128.497220) :
                zoom = 20 -  factor;
                break;
            case  (distance < 2256.994440) :
                zoom = 19 -  factor;
                break;
            case  (distance < 4513.988880) :
                zoom = 18 -  factor;
                break;
            case  (distance < 9027.977761) :
                zoom = 17 -  factor;
                break;
            case  (distance < 18055.955520) :
                zoom = 16 -  factor;
                break;
            case  (distance < 36111.911040) :
                zoom = 15 -  factor;
                break;
            case  (distance < 72223.822090) :
                zoom = 14 -  factor;
                break;
            case  (distance < 144447.644200) :
                zoom = 13 -  factor;
                break;
            case  (distance < 288895.288400) :
                zoom = 12 -  factor;
                break;
            case  (distance < 577790.576700) :
                zoom = 11 -  factor;
                break;
            case  (distance < 1155581.153000) :
                zoom = 10 -  factor;
                break;
            case  (distance < 2311162.307000) :
                zoom = 9 -  factor;
                break;
            case  (distance < 4622324.614000) :
                zoom = 8 -  factor;
                break;
            case  (distance < 9244649.227000) :
                zoom = 7 -  factor;
                break;
            case  (distance < 18489298.450000) :
                zoom = 6 -  factor;
                break;
            case  (distance < 36978596.910000) :
                zoom = 5 ;
                break;
            case  (distance < 73957193.820000) :
                zoom = 4 ;
                break;
            case  (distance < 147914387.600000) :
                zoom = 3 ;
                break;
            case  (distance < 295828775.300000) :
                zoom = 2 ;
                break;
            case  (distance < 591657550.500000) :
                zoom = 1 ;
                break;

            default:
                break;
        }

        return zoom
    }

    getExpenses(): any {    
         this.appointmentService.getExpensesByAppointmentId(this.appointment.AppId.toString()).subscribe(res => {

            res.forEach(element => {
                element.recType = this.options[element.recType];
            });
                
             this.expenses = res;
         });
     }

      onchange(args: SelectedIndexChangedEventData) {
        console.log(`Drop Down selected index changed from ${args.oldIndex} to ${args.newIndex}`);
    }

     onopen() {
        console.log("Drop Down opened.");
    }

     onclose() {
        console.log("Drop Down closed.");
    }
}
