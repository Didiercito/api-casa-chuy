// import { Validate } from "class-validator";
// import { LightfocusEntities } from "../entities/lightfocusEntitis";

// export class LightfocusValidator {
//     public credentials: LightfocusEntities;
//     public Listerrors: any[];

//     constructor(credentials: LightfocusEntities){
//         this.credentials = credentials;
//         this.Listerrors = [];
//     }

//     public async invalidHasErrors(){
//         await this.validate();

//         if (!this.foundedErrors()) {
//             return;
//         }

//         throw {
//             http_status: 422,
//             validations: this.errors()
//         };
//     }

//     protected async validate() {
//         this.Listerrors = await Validate(this.credentials);
//     }

//     protected errors(): any[] {
//         return this.Listerrors.map((error) => {
//             let property = error.property;
//             let errorMessages = Object.values(error.constraints);
//             return {
//                 property,
//                 errorMessages
//             };
//         });
//     }

//     protected foundedErrors(): boolean {
//         return this.Listerrors.length > 0;
//     }
// }