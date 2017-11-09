export class Appointment {
   public AppId: number;
   public AppDate: string;
   public cliCompany: string;
   public cliContact: string;
   public cliAddress1: string;
   public cliAddress2: string;
   public cliCity: string;
   public cliState: string;
   public cliZip: string;
   public cliCountry: string;
   public cliPhone: string;
   public cliNotes: string;
   public appType: string;
   public project: string;
   public meetingType: string;
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}