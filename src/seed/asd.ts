// // //en este si nungun usuario a hecho una acción de encender o apagar 

// // {
// //     message: "No hay nada de registrado de los focos de luz",
// //     historiar : [
// //         //aca debe de ir las acciones si encendio o apado
// //     ]
// // }


// // //ahora este es un ejemplo cuando alguien hace una acción de encender y apargar un foco de luz

// // {
// //     message: "Se ha registrado una acción de encendido y apagado",
// //     historiar : [
// //         {
// //             name: "Cocina",
// //             status: "on",
// //             userName: "Juan",
// //             userRole: "Admin",
// //             userId: 1,
// //             timesTurnedOn: new Date()
// //         },
// //         {
// //             name: "Cocina",
// //             status: "off",
// //             userName: "Juan",
// //             userRole: "Admin",
// //             userId: 1,
// //             timesTurnedOn: new Date()
// //         }
// //     ]
// // }


//     -src
//         -auth
//             -application
//                 -use-case
//                     -authUseCase.ts
//             -domain
//                 -interface
//                     -authRepository.ts
//             -infrastructure
//                 -adapters
//                     -authMySQLAdapter.ts
//                 -controller
//                     -authController.ts
//                 -routes
//                     -authRoutes.ts
//             -index.ts   
//         -database
//             -connection.ts
//         -lightfocus
//             -application
//                 -use-case
//                     -lightfocusUseCase.ts
//             -domain
//                 -interface
//                     -lightfocusRepository.ts
//             -infrastructure
//                 -adapters
//                     -lightfocusMySQLAdapter.ts
//                 -controller
//                     -lightfocusController.ts
//                 -routes
//                     -lightfocusRoutes.ts
//             -seed
//                 -lightfocusSeed.ts
//         middleware
//             -jwt.ts

//             templete
//                 index.html
//             -index.ts