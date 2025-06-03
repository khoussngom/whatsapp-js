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

    ajoutMembre(groupe, membres) {
        groupe.membres = membres;
        return groupe
    },

    listerGroupe() {
        return groupe
    },

    listeMembre(nom) {
        const groupeTrouve = groupe.find(element => element.nom === nom.nom);
        return groupeTrouve ? groupeTrouve.membres || [] : [];
    },

    archiverContact(nom, contacts) {
        const index = contacts.findIndex(contact => contact.nom === nom);
        if (index !== -1) {
            const contactArchive = contacts.splice(index, 1)[0];
            archiveContact.push(contactArchive);
            return true;
        }
        return false;
    },

    listerArchive() {
        return archiveContact
    },

    desarchiverContact(nom) {
        const index = archiveContact.findIndex(c => c.nom === nom);
        if (index !== -1) {
            const contactDesarchive = archiveContact.splice(index, 1)[0];
            contact.push(contactDesarchive);
            return true;
        }
        return false;
    },

    rechercherContact(contactList, cle) {
        if (!cle || cle === "*") {
            return contactList.sort((a, b) => a.nom.localeCompare(b.nom));
        }

        return contactList.filter(element =>
            element.nom.toLowerCase().includes(cle) ||
            element.numero.toLowerCase().includes(cle)
        );
    }

}))()