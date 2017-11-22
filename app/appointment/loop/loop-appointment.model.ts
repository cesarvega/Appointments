export class LoopAppointment {
    public id: number;
    public AppId: number;
    public AppDate: string;
    public cliCompany: string;
    public cliContact: string;
    public cliAddress1: string;
    public cliAddress2: string;
    public cliCity: string;
    public cliState: string;
    public cliZip: number;
    public cliCountry: string;
    public cliPhone: number;
    public cliNotes: string;
    public appType: string;
    public project: string;
    public meetingType: string;
     constructor(values: Object = {}) {
         Object.assign(this, values);
     }
 }