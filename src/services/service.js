export const services = (() => ({

    isNumValid(numero) {
        if (!numero) {
            return false
        }
        return !isNaN(numero);
    },

    numExiste(groupe, numero) {
        console.log(numero)
        const numEx = groupe.find(element => element.numero === numero);

        return (numEx) ? true : false
    }

}))()