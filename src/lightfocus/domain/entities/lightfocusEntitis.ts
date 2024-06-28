export class LightfocusEntities {
    idLightfocus: number;
    namelightfocus: string;
    status: string;
    userName: string;
    userRole: string;
    timeTurnedOn: Date | null;
    timeTurnedOff: Date | null;
    userId: number;

    constructor(idLightfocus: number,namelightfocus: string,status: string,userName: string,userRole: string,userId: number,timeTurnedOn: Date | null = null,timeTurnedOff: Date | null = null) 
    {
        this.idLightfocus = idLightfocus;
        this.namelightfocus = namelightfocus;
        this.status = status;
        this.userName = userName;
        this.userRole = userRole;
        this.userId = userId;
        this.timeTurnedOn = timeTurnedOn;
        this.timeTurnedOff = timeTurnedOff;
    }
}
