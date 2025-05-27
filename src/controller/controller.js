import { component } from "../component/component.js";
import { services } from "../services/service.js";
import { models } from "../models/models.js";
import { list } from "postcss";

const nouveau = document.querySelector("#nouveau");
const messages = document.querySelector("#Messages");
const listeGroupe = document.querySelector("#Groupe");
const listeMessages = document.querySelector("#listMessage");
const enteteDiscu = document.querySelector("#entetDiscussion");
const btnArchive = document.querySelector("#archiver");
const nomActive = document.querySelector("#nomActive");
const Archive = document.querySelector("#ARCHIVE");

const ajouter = function() {
    listeMessages.innerHTML = component.ajoutContact()
    const btnSaveContact = document.querySelector("#enregistrerContact");
    const nomComplet = document.querySelector("#nomComplet")
    const numeroTelephone = document.querySelector("#numeroTelephone")


    if (btnSaveContact) {
        btnSaveContact.addEventListener("click", () => {

            saveNewContact()
        });
    }
}

const afficherContact = function(element) {
    nomActive.innerHTML = element.nom;
}

const allMessages = function() {
    listeMessages.innerHTML = component.listeMessage();
    const amis = models.listerContact();

    amis.forEach(element => {
        const div = document.createElement("div");
        div.innerHTML = component.message(element);
        listeMessages.prepend(div);
        div.addEventListener("click", () => afficherContact(element));
        btnArchive.addEventListener("click", () => {
            models.archiverContact(element.nom, amis);
            allArchive();
        });

    });
}

const allArchive = function() {
    listeMessages.innerHTML = component.listeMessage();
    const amis = models.listerArchive();

    amis.forEach(element => {
        const div = document.createElement("div");
        div.innerHTML = component.message(element);
        listeMessages.prepend(div);
        const etat = document.querySelector("#etat");
        etat.innerHTML = "Desarchiver";
        etat.addEventListener("click", () => {
            models.desarchiverContact(element.nom, amis);
            allMessages()
        });
        div.addEventListener("click", () => {
            afficherContact(element)
        });
        btnArchive.addEventListener("click", () => { models.archiverContact(element.nom, amis) });

    });
}


const afficherAllContact = function() {
    const allContact = models.listerContact();
    const ul = document.createElement("ul");
    allContact.forEach(element => {
        const li = document.createElement("li");
        li.textContent = `${element.nom}: ${element.numero}`;
        ul.appendChild(li);
        if (services.isNumValid(element.numero)) {
            listeMessages.innerHTML = "";
            listeMessages.appendChild(ul);
        }
    });

}



const afficherMembre = function(element) {
    const allMembers = models.listeMembre(element.nom);
    console.log(allMembers);

    if (Array.isArray(allMembers) && allMembers.length > 0) {
        const membresStr = allMembers.join(", ");

        const listMember = document.createElement("div");
        listMember.innerHTML = component.membreGroupe(membresStr);
        nomActive.innerHTML = element.nom;
        enteteDiscu.appendChild(listMember);

    } else {
        console.warn(`Aucun membre trouvé pour le groupe ${element.nom}`);
    }
};

let groupe = [];

function recupererDonneesGroupe() {
    const nom = document.querySelector("#nomGroupe").value.trim();
    const membres = document.querySelector("#membresGroupe").value.trim();
    const mem = membres
        .split(",")
        .map(m => m.trim())
        .filter(m => m !== "");
    if (mem.length < 2) {
        afficherMessageError("le groupe  doit contenir au moins 2 personnes")
        return
    }
    return { nom, membres };
}

function construireGroupe({ nom, membres }) {
    if (!nom) return null;

    const nouveauGroupe = { nom };

    if (membres) {
        const membresArray = membres
            .split(",")
            .map(m => m.trim())
            .filter(m => m !== "");

        if (membresArray.length > 1) {
            nouveauGroupe.membres = membresArray;
        }
    }

    return nouveauGroupe;
}

function ajouterGroupe(nouveauGroupe) {
    models.ajoutGroupe(nouveauGroupe);

}


function reinitialiserFormulaireGroupe() {
    document.querySelector("#nomGroupe").value = "";
    document.querySelector("#membresGroupe").value = "";
}


function afficherMessageSucces(messageTexte) {
    const message = document.createElement("small");
    message.textContent = messageTexte;
    message.className = "text-green-600 text-[10px]";
    listeMessages.appendChild(message);
}

function afficherMessageError(messageTexte) {
    const message = document.createElement("small");
    message.textContent = messageTexte;
    message.className = "text-red-600 text-[10px]";
    listeMessages.appendChild(message);
}


function creerGroupe() {
    listeMessages.innerHTML = component.ajoutGroupe();

    const btnAdd = document.querySelector("#enregistrerGroupe");

    btnAdd.addEventListener("click", () => {
        const donnees = recupererDonneesGroupe();
        const nouveauGroupe = construireGroupe(donnees);

        if (!nouveauGroupe) {
            alert("Le nom du groupe est obligatoire !");
            return;
        }

        ajouterGroupe(nouveauGroupe);
        reinitialiserFormulaireGroupe();
        afficherMessageSucces("Groupe ajouté avec succès.");
        afficherListeGroupe();
    });
}


const afMemb = function(groupe) {
    if (groupe.length > 0) {
        groupe.forEach(element => {
            const div = document.createElement("div");
            div.innerHTML = component.listeGroupe(element);
            listeMessages.appendChild(div);
            div.addEventListener("click", () => afficherMembre(element))
        });
    }
}

const btnAddGroup = function() {
    const btnCreer = document.createElement("div")
    btnCreer.innerHTML = `<div class="flex w-[150px] h-[40px] justify-center items-center bg-yellow-500"> creer groupe </div>`
    listeMessages.appendChild(btnCreer)
    btnCreer.addEventListener("click", creerGroupe)

}

const afficherListeGroupe = function() {
    listeMessages.innerHTML = "";
    const groupe = models.listerGroupe();

    afMemb(groupe)
    btnAddGroup()

};


const saveNewContact = function() {
    const newContact = {}
    newContact["nom"] = nomComplet.value;
    newContact["numero"] = numeroTelephone.value;
    const groupe = models.listerContact()
    console.log(groupe)

    const bool = services.numExiste(groupe, newContact.numero)
    if (bool) {
        afficherMessageError("ce numero existe deja !");
        return
    }
    const messageSt = models.ajoutContact(newContact);
    const messageStatut = document.createElement("small");
    messageStatut.innerHTML = messageSt;
    listeMessages.prepend(messageStatut);
    nomComplet.value = "";
    numeroTelephone.value = "";
    afficherAllContact();
}




nouveau.addEventListener("click", ajouter);

messages.addEventListener("click", allMessages);

listeGroupe.addEventListener("click", afficherListeGroupe)

Archive.addEventListener("click", allArchive)