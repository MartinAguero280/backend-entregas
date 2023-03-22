
// Products
export const createProductInfo = product => {
    return `Uno o mas propiedades estan incompletos o son invalidos.
    Lista de propiedades obligatorios:
        * Title: Necesita ser un string, recibio ${product.title}
        * Description: Necesita ser un string, recibio ${product.description}
        * Price: Necesita ser un number, recibio ${product.price}
        * Stock: Necesita ser un number, recibio ${product.stock}
        * Category: Necesita ser un string, recibio ${product.category}
    `
}