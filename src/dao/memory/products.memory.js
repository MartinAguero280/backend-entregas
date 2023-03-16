export default class Products {
    constructor() {
        this.data = []
    }

    getNextID = () => {
        const count = this.data.length 
        const nextID = (count > 0) ? this.data[count-1].id + 1 : 1

        return nextID
    }

    find = () => {
        return this.data
    }

    create = data => {
        data.id = this.getNextID()

        this.data.push(data)

        return true
    }
}