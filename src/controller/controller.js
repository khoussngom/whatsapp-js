import { component } from "../component/component.js";
import { services } from "../services/service.js";
import { models } from "../models/models.js";
import { diff, isDiffusionMode, Allcheck } from "./message.js";
import { afficherListeGroupe } from "./groupe.js";

const nouveau = document.querySelector("#nouveau");
const messages = document.querySelector("#Messages");
export const listeGroupe = document.querySelector("#Groupe");
export const listeMessages = document.querySelector("#listMessage");
export const enteteDiscu = document.querySelector("#entetDiscussion");
const btnArchive = document.querySelector("#archiver");
const nomActive = document.querySelector("#nomActive");
const Archive = document.querySelector("#ARCHIVE");
export const profil = document.querySelector("#pp");
const textMessage = document.querySelector("#textMessage");
export const btEnvoie = document.querySelector("#btnEnvoie");
export const expedition = document.querySelector("#expediteur");
export const reception = document.querySelector("#recepteur");
const zoneMessage = document.querySelector("#zoneMessage");
const recherche = document.querySelector("#recherche")
const loginPopup = document.querySelector("#loginPopup");
const loginForm = document.querySelector("#loginForm");

diff();

const handleMessage = () => {
    const message = recupererMessage();
    if (message && message.trim() !== "") {
        if (isDiffusionMode && Allcheck.length > 0) {

            Allcheck.forEach(element => {
                const span = EnvoyerMessage(message);
                expedition.appendChild(span);
                if (!element.messages) {
                    element.messages = [];
                }
                element.messages.push(span);
            });

            Allcheck.length = 0;
        } else if (contactActif) {

            const span = EnvoyerMessage(message);
            voirMessage(span, contactActif);
        }
    }
};



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

export const recupererMessage = function() {
    const messSend = textMessage.value
    textMessage.value = ""
    return messSend
}

export const EnvoyerMessage = function(messSend) {
    const span = document.createElement("span");
    span.className = `flex flex-row justify-end items-end  w-max  rounded-xl rounded-l-xl  m-3 p-3 h-min text-white bg-green-600`;
    span.textContent = messSend;
    return span

}

export const voirMessage = function(span, element) {
    if (!Array.isArray(element.message)) {
        element.message = [];
    }

    element.message = [...element.message, span];

    const tabMessage = element.message;
    tabMessage.forEach(message => expedition.appendChild(message))
}


let contactActif = null;

export const afficherContact = function(element) {
    contactActif = element;

    nomActive.innerHTML = element.nom;
    profil.innerHTML = "";
    expedition.innerHTML = "";
    reception.innerHTML = ""

    if (element.messages) {
        element.messages.forEach(message => expedition.appendChild(message));
    }

    const span = document.createElement("span");
    span.classList.add("flex", "flex-row", "rounded-full", "w-[40px]", "h-[40px]", "justify-center", "items-center");
    span.innerHTML = `<span class="flex flex-row justify-center items-center text-center text-[30px] text-white w-full h-full">${element.nom.charAt(0).toUpperCase()}</span>`;
    profil.appendChild(span);
};

const colorierElemnt = function(div, element) {

    div.addEventListener("click", () => {
        afficherContact(element);

        document.querySelectorAll(".selectionner").forEach(el => {
            el.classList.remove("selectionner");

        });

        div.classList.add("selectionner");
        const tabMessage = element.message;
        tabMessage.forEach(message => zoneMessage.appendChild(message))
    });


}

let valFiltre = [];




recherche.addEventListener("keyup", () => {
    const contacts = models.listerContact();
    const cle = recherche.value.trim().toLowerCase();

    valFiltre = models.rechercherContact(contacts, cle === '' ? '*' : cle);

    if (valFiltre.length < 1) {
        listeMessages.innerHTML = "pas de contact avec ce nom ou ce numero !";
        return;
    }
    allMessages();
});


const allMessages = function() {
    listeMessages.innerHTML = component.listeMessage();

    const amis = (valFiltre.length < 1) ? models.listerContact() : valFiltre;

    if (!amis || amis.length < 1) {
        listeMessages.innerHTML = "pas de contact disponible !";
        return;
    }
    listeMessages.innerHTML = "";
    amis.forEach((element, key) => {
        const div = document.createElement("div");
        div.innerHTML = component.message(element, key);

        listeMessages.appendChild(div);
        const pp = document.querySelector(`#pp${key}`);

        const span = document.createElement("span");
        span.classList.add("flex", "flex-row", "rounded-full", "w-[40px]", "h-[40px]", "justify-center", "items-center");
        span.innerHTML = `<span class=" flex flex-row justify-center items-center text-cente text-[30px] text-white w-full h-full">${element.nom.charAt(0).toUpperCase()
        }</span>`;

        pp.appendChild(span);

        colorierElemnt(div, element);

    });
}
const allArchive = function() {
    listeMessages.innerHTML = component.listeMessage();
    const amis = models.listerArchive();

    amis.forEach((element, id) => {
        const div = document.createElement("div");
        div.innerHTML = component.message(element, id);
        listeMessages.prepend(div);
        const etat = document.querySelector("#etat");
        etat.innerHTML = "<i class='bx  bxs-archive-arrow-up'  style='color:#000000'></i>";
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


export function afficherMessageSucces(messageTexte) {
    const message = document.createElement("small");
    message.textContent = messageTexte;
    message.className = "text-green-600 text-[14px]";
    listeMessages.appendChild(message);
}

export function afficherMessageError(messageTexte) {
    const message = document.createElement("small");
    message.textContent = messageTexte;
    message.className = "text-red-600 text-[14px]";
    listeMessages.appendChild(message);
}

const afficherMessage = function(newContact) {
    const messageSt = models.ajoutContact(newContact);
    const messageStatut = document.createElement("small");
    messageStatut.innerHTML = messageSt;
    listeMessages.prepend(messageStatut);

    nomComplet.value = "";
    numeroTelephone.value = "";
    afficherAllContact();
}

const saveNewContact = function() {
    const newContact = {}
    newContact["nom"] = nomComplet.value;
    newContact["numero"] = numeroTelephone.value;

    const groupe = models.listerContact()
    console.log(groupe)
    afficherMessage(newContact);
}

nouveau.addEventListener("click", ajouter);

messages.addEventListener("click", allMessages);

listeGroupe.addEventListener("click", afficherListeGroupe)

Archive.addEventListener("click", allArchive)

btEnvoie.addEventListener("click", handleMessage);


const handleLogin = (e) => {
    e.preventDefault();
    const username = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;


    if (username && password) {

        loginPopup.classList.add('hidden');
    }
};


const checkLogin = () => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    if (isLoggedIn) {
        loginPopup.classList.add('hidden');
    }
};


loginForm.addEventListener('submit', handleLogin);


document.addEventListener('DOMContentLoaded', checkLogin);