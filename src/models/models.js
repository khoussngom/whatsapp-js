import { services } from "../services/service.js";

let contact = [];
let groupe = [];
let archiveContact = [];

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
    },

    archiverContact(nom, groupe) {
        const contactTrouve = groupe.find(element => element.nom === nom);
        groupe = groupe.pop(contactTrouve);
        archiveContact = [contactTrouve, ...archiveContact];

        return archiveContact;
    },

    listerArchive() {
        return archiveContact
    },

    desarchiverContact(nom, archiveContact) {
        const contactTrouve = archiveContact.find(element => element.nom === nom);
        archiveContact = archiveContact.pop(contactTrouve);
        contact = [contactTrouve, ...contact];
        console.log(contact)
        return contact;
    },

}))()