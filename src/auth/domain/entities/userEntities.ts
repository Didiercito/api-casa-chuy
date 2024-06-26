export class userEntities {

    public id: number;

    public name: string;

    public rol : string;

    public password: string;

    public email: string;

    constructor(id: number, name: string, rol: string, password: string, email: string){
        this.id = id;
        this.name = name; 
        this.rol = rol;
        this.password = password;
        this.email = email;
    }

}