export const users = [
    {
        id: 1,
        name: "Juan ",
        lastname: "Perez",
        email: "juan@levelupgamer.com",
        password: "1234",
        phone: "987908756",
        address: {
            calle: "Quinta de Marte 21",
            departamento: "",
            region: "Region Metropolitana",
            comuna: "Recoleta",
            indicaciones: ""
        },
        role:"client" //claro que si tiene rol cliente
    },
    {
        id: 2,
        name: "Ana",
        lastname: "Gómez",
        email: "ana@mail.com",
        password: "1234",
        phone: "912345678",
        address: {
            calle: "Calle Falsa 456",
            departamento: "",
            region: "V",
            comuna: "Valparaíso",
            indicaciones: "Entregar en portería"

        },
        role:"admin" //claro que si tiene rol admin

    },
    {
        id: 3,
        name: "acaro",
        lastname: "Gómez",
        email: "chaveta@mail.com",
        password: "1",
        phone: "912345678",
        address: {
            calle: "Calle Falsa 456",
            departamento: "",
            region: "V",
            comuna: "Valparaíso",
            indicaciones: "Entregar en portería"
        },
        role: "admin" // <-- Administradora de prueba
    }
];