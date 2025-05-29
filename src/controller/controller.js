import { component } from "../component/component.js";
import { services } from "../services/service.js";
import { models } from "../models/models.js";
import { diff, isDiffusionMode, Allcheck } from "./message.js";

const nouveau = document.querySelector("#nouveau");
const messages = document.querySelector("#Messages");
const listeGroupe = document.querySelector("#Groupe");
const listeMessages = document.querySelector("#listMessage");
const enteteDiscu = document.querySelector("#entetDiscussion");
const btnArchive = document.querySelector("#archiver");
const nomActive = document.querySelector("#nomActive");
const Archive = document.querySelector("#ARCHIVE");
const profil = document.querySelector("#pp");
const textMessage = document.querySelector("#textMessage");
export const btEnvoie = document.querySelector("#btnEnvoie")
const expedition = document.querySelector("#expediteur")
const reception = document.querySelector("#recepteur")
const zoneMessage = document.querySelector("#zoneMessage")

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

const afficherContact = function(element) {
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

const allMessages = function() {
    listeMessages.innerHTML = component.listeMessage();
    const amis = models.listerContact();

    if (amis.length < 1) {
        listeMessages.innerHTML = "pas de contact disponible !"
        return
    }

    amis.forEach((element, key) => {
        const div = document.createElement("div");
        div.innerHTML = component.message(element, key);

        listeMessages.prepend(div);
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

const creer_listMembre = function(membresStr, element) {
    const listMember = document.createElement("div");
    listMember.classList.add("list-member");
    listMember.innerHTML = component.membreGroupe(membresStr);

    nomActive.innerHTML = element.nom;

    enteteDiscu.appendChild(listMember);
}

const afficherMembre = function(element) {
    const allMembers = models.listeMembre(element.nom);
    contactActif = element;

    nomActive.innerHTML = element.nom;
    profil.innerHTML = "";
    expedition.innerHTML = "";
    reception.innerHTML = ""

    if (element.messages) {
        element.messages.forEach(message => expedition.appendChild(message));
    }

    if (Array.isArray(allMembers) && allMembers.length > 0) {

        const membresStr = allMembers.join(", ");
        const ancienDiv = document.querySelector(".list-member");

        if (ancienDiv) {
            ancienDiv.remove();
        }
        creer_listMembre(membresStr, element);
    } else {
        console.warn(`Aucun membre trouvé pour le groupe ${element.nom}`);
    }
};


let groupe = [];

const user_to_tab = function(membres) {
    const mem = membres
        .split(",")
        .map(m => m.trim())
        .filter(m => m !== "");

    mem.push("khouss");
    return mem;
}

const verifier_numero_inContact = function(listeContact, mem) {
    for (let el of mem) {
        const existe = listeContact.find(contact => contact.nom === el);
        if (!existe) {
            afficherMessageError(`${el.charAt(0).toUpperCase() + el.slice(1)} n'est pas dans ton contact.`);
            console.log(`${el} n'est pas dans ton contact.`);
            return true;
        }
    }
}

function recupererDonneesGroupe() {
    const listeContact = models.listerContact();
    listeContact.push({ nom: "khouss", numero: "774730039" })
    const nom = document.querySelector("#nomGroupe").value.trim();
    const membres = document.querySelector("#membresGroupe").value.trim();

    const mem = user_to_tab(membres)

    if (mem.length < 2) {
        afficherMessageError("Le groupe doit contenir au moins 2 personnes.");
        return;
    }

    if (verifier_numero_inContact(listeContact, mem)) return;

    return { nom, membres: mem };
}

function construireGroupe(data) {
    if (!data || typeof data !== 'object') return null;

    const { nom, membres = [] } = data;

    if (!nom) return null;

    const nouveauGroupe = { nom };

    if (Array.isArray(membres) && membres.length > 1) {
        nouveauGroupe.membres = membres;
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
    message.className = "text-green-600 text-[14px]";
    listeMessages.appendChild(message);
}

function afficherMessageError(messageTexte) {
    const message = document.createElement("small");
    message.textContent = messageTexte;
    message.className = "text-red-600 text-[14px]";
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

const add_li_contact = function(li, groupe) {
    const membre = li.textContent;
    console.log(groupe.membres)
    groupe.membres.push(membre);
    li.innerHTML = "";
}

const parcourir_contact = function(contact, ul, groupe) {
    contact.forEach((element, key) => {
        const li = document.createElement("li");
        li.innerHTML = component.listeContact(element, key);
        li.addEventListener("click", () => {
            add_li_contact(li, groupe);
        })
        ul.appendChild(li);
    })
}

const choixMembre = function(groupe) {
    const contact = models.listerContact();
    const ul = document.createElement("ul");
    parcourir_contact(contact, ul, groupe);
    listeMessages.appendChild(ul);
}

const addMembre = function(groupe) {

    const add = document.querySelector("#addMember");
    add.addEventListener("click", () => { choixMembre(groupe) });
}

const afMemb = function(groupe) {
    if (!Array.isArray(groupe) || groupe.length === 0) return;

    groupe.forEach(element => {
        const div = document.createElement("div");
        div.innerHTML = component.listeGroupe(element);
        listeMessages.appendChild(div);

        div.addEventListener("click", () => {
            afficherMembre(element);
            contactActif = element;

            nomActive.innerHTML = element.nom;
            profil.innerHTML = "";
            expedition.innerHTML = "";
            reception.innerHTML = "";

            console.log("oui", element);

            if (Array.isArray(element.message)) {
                element.message.forEach(message => expedition.appendChild(message));
            }
        });

        addMembre(element);
        console.log(element);
    });
};

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
messages.addEventListener("click", allMessages);

listeGroupe.addEventListener("click", afficherListeGroupe)

Archive.addEventListener("click", allArchive)

btEnvoie.addEventListener("click", handleMessage);