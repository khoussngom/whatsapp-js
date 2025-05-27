export const services = (() => ({

    isNumValid(numero) {
        if (!numero) {
            return false
        }
        return !isNaN(numero);
    },

    numExiste(groupe, numero) {

    }

}))()