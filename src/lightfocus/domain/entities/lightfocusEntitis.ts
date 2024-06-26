export class LightfocusEntities {
    public idLightfocus: number;
    public namelightfocus: string;
    public status: string; //off
    public userName: string;
    public userRole: string
    public timesTurnedOn: number;
    public userId: number;  

    constructor(idLightfocus: number, namelightfocus: string, status: string, userName: string, userRole: string, timesTurnedOn: number, userId: number){
        this.idLightfocus = idLightfocus;
        this.namelightfocus = namelightfocus;
        this.status = status;
        this.userName = userName;
        this.userRole = userRole;
        this.timesTurnedOn = timesTurnedOn;
        this.userId = userId;
    }
}
