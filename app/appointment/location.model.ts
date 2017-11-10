
class geolocationContainer {

    private phoneId:string;
    private phoneIdType:string;
    private geoDate:string;
    private appId:number;
    private geoLatitude:number;
    private geoLongitude:number;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}