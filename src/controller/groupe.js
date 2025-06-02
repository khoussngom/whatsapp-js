import { component } from "../component/component.js";
import { services } from "../services/service.js";
import { models } from "../models/models.js";
import { diff, isDiffusionMode, Allcheck } from "./message.js";
import { nomActive, afficherContact, enteteDiscu, reception, expedition, profil, afficherMessageError, afficherMessageSucces, listeMessages, listeGroupe, btEnvoie, recupererMessage, EnvoyerMessage, voirMessage } from "./controller.js";

let contactActif = null;

const creer_listMembre = function(membresStr, element) {
    const listMember = document.createElement("div");
    listMember.classList.add("list-member");
    listMember.innerHTML = component.membreGroupe(membresStr);

    nomActive.innerHTML = element.nom;


    enteteDiscu.appendChild(listMember);
}



const afficherMembre = function(element) {
    if (!element || !element.nom) {
        return;
    }

    contactActif = element;

    profil.innerHTML = "";
    expedition.innerHTML = "";
    reception.innerHTML = "";

    if (Array.isArray(element.messages)) {
        element.messages.forEach(message => {
            const messageClone = message.cloneNode(true);
            expedition.appendChild(messageClone);
        });
    }

    const allMembers = models.listeMembre(element);

    if (Array.isArray(allMembers) && allMembers.length > 0) {
        const ancienDiv = document.querySelector(".list-member");
        if (ancienDiv) {
            ancienDiv.remove();
        }

        const membresStr = allMembers
            .map(m => m.nom)
            .filter(Boolean)
            .join(", ");

        if (membresStr) {
            creer_listMembre(membresStr, element);
        }
    } else {
        console.warn(`Aucun membre trouvé pour le groupe ${element.nom}`);
        const messageVide = document.createElement("small");
        messageVide.textContent = "Aucun membre dans ce groupe";
        messageVide.className = "text-gray-500 text-sm";
        enteteDiscu.appendChild(messageVide);
    }
};


let groupe = [];

const user_to_tab = function(membres) {
    const mem = [
        { nom: "khouss", role: "admin" },
        ...membres
        .split(",")
        .map(m => m.trim())
        .filter(m => m !== "" && m !== "khouss")
        .map(m => ({
            nom: m,
            role: ""
        }))
    ];

    return mem;
};


const verifier_numero_inContact = function(listeContact, mem) {
    for (let el of mem) {
        const existe = listeContact.find(contact => contact.nom === el.nom);
        if (!existe) {
            afficherMessageError(`${el.nom.charAt(0).toUpperCase() + el.nom.slice(1)} n'est pas dans ton contact.`);
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


function creerGroupe() {
    listeMessages.innerHTML = component.ajoutGroupe();

    const btnAdd = document.querySelector("#enregistrerGroupe");

    btnAdd.addEventListener("click", () => {
        const donnees = recupererDonneesGroupe();
        const nouveauGroupe = construireGroupe(donnees);

        if (!nouveauGroupe) {
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


const changerRole = function(membre, groupe, role, ac) {
    role.classList.remove("hidden");
    role.classList.add("flex");
    role.addEventListener("click", () => {
        membre.role = ac;
        setTimeout(() => {
            listeAttrMembre(groupe);
        }, 300);
    });
}

const supprimerMembre = function(groupes, groupe, membre) {
    const del = document.querySelector("#retirer");
    del.addEventListener("click", () => {
        groupe.pop(membre);
        setTimeout(() => {
            listeAttrMembre(groupes)
        }, 300);
    })

}

const listeAttrMembre = function(groupe) {
    listeMessages.innerHTML = component.listeMessage();
    const amis = models.listerContact();

    amis.forEach((element, id) => {
        const membre = groupe.membres.find(mmbr => mmbr.nom === element.nom);
        if (membre) {
            const div = document.createElement("div");
            div.innerHTML = component.mmbrDuGroupe(element, id);
            listeMessages.prepend(div);

            const etat = div.querySelector("#etat");
            const PasserAdm = div.querySelector("#PasserAdm");

            if (membre.role && membre.role.toLowerCase() === "admin") {
                changerRole(membre, groupe, etat, "")
            } else {
                changerRole(membre, groupe, PasserAdm, "admin")
            }
            if (Object.keys(groupe.membres).length > 1) {
                supprimerMembre(groupe, groupe.membres, element);
            }

            div.addEventListener("click", () => {
                afficherContact(element);
            });
        }
    });
};



const afMemb = function(groupe) {
    if (!Array.isArray(groupe) || groupe.length === 0) return;

    groupe.forEach(element => {
        const div = document.createElement("div");
        div.innerHTML = component.listeGroupe(element);
        listeMessages.appendChild(div);

        const info = div.querySelector("#info");

        info.addEventListener("click", () => {
            console.log("element:", element);

            listeAttrMembre(element);
            afficherMembre(element);

            contactActif = element;

            profil.innerHTML = "";
            expedition.innerHTML = "";
            reception.innerHTML = "";

            if (Array.isArray(element.message)) {
                element.message.forEach(message => expedition.appendChild(message));
            }
        });

        addMembre(element);
    });
};


const btnAddGroup = function() {
    const btnCreer = document.createElement("div")
    btnCreer.innerHTML = `<div class="flex w-[150px] h-[40px] justify-center items-center bg-yellow-500"> creer groupe </div>`
    listeMessages.appendChild(btnCreer)
    btnCreer.addEventListener("click", creerGroupe)

}

export const afficherListeGroupe = function() {
    listeMessages.innerHTML = "";
    const groupe = models.listerGroupe();
    afMemb(groupe);
    btnAddGroup();

};