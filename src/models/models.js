import { services } from "../services/service.js";

let contact = [];
let groupe = [];

export const models = (() => ({
    ajoutContact(newContact) {
        if (services.isNumValid(newContact.numero)) {
            contact = [newContact, ...contact];
            return `<small class="text-green-600 text-[10px]">contact ajouter avec success</small>`
        } else {
            return `<small class="text-red-600 text-[10px]">contact incorrect</small>`
        }
    },

    listerContact() {
        return contact;
    },

    ajoutGroupe(newGroupe) {
        groupe = [newGroupe, ...groupe]
    },

    listerGroupe() {
        return groupe
    },

    listeMembre(nom) {
        const groupeTrouve = groupe.find(element => element.nom === nom);
        return groupeTrouve ? groupeTrouve.membres || [] : [];
    }

}))()