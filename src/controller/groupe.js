import { component } from "../component/component.js";
import { services } from "../services/service.js";
import { models } from "../models/models.js";
import { diff, isDiffusionMode, Allcheck } from "./message.js";
import { afficherContact, enteteDiscu, reception, expedition, profil, afficherMessageError, afficherMessageSucces, listeMessages, listeGroupe, btEnvoie, recupererMessage, EnvoyerMessage, voirMessage } from "./controller.js";

let contactActif = null;

const creer_listMembre = function(membresStr, element) {
    const listMember = document.createElement("div");
    listMember.classList.add("list-member");
    listMember.innerHTML = component.membreGroupe(membresStr);

    nomActive.innerHTML = element.nom;

    enteteDiscu.appendChild(listMember);
}
const afficherMembre = function(element) {
    const allMembers = models.listeMembre(element);
    console.log("Membres récupérés :", allMembers);

    contactActif = element;

    nomActive.innerHTML = element.nom;
    profil.innerHTML = "";
    expedition.innerHTML = "";
    reception.innerHTML = "";

    if (element.messages) {
        element.messages.forEach(message => expedition.appendChild(message));
    }

    if (Array.isArray(allMembers) && allMembers.length > 0) {
        const membresStr = allMembers.map(m => m.nom).join(", ");

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


const listeAttrMembre = function(groupe) {
    listeMessages.innerHTML = component.listeMessage();

    const amis = models.listerContact();
    console.log("groupe:", groupe);

    amis.forEach((element, id) => {
        const membre = groupe.membres.find(mmbr => mmbr.nom === element.nom);
        if (membre) {
            const div = document.createElement("div");
            div.innerHTML = component.mmbrDuGroupe(element, id);
            listeMessages.prepend(div);

            const etat = div.querySelector("#etat");
            const PasserAdm = div.querySelector("#PasserAdm");

            if (membre.role && membre.role.toLowerCase() === "admin") {
                etat.classList.remove("hidden");
                etat.classList.add("flex");
                etat.addEventListener("click", () => {
                    membre.role = "";
                    console.log(`${membre.nom} n'est plus admin`);

                    setTimeout(() => {
                        listeAttrMembre(groupe);
                    }, 300);
                });
            } else {
                PasserAdm.classList.remove("hidden");
                PasserAdm.classList.add("flex");
                PasserAdm.addEventListener("click", () => {
                    membre.role = "admin";
                    console.log(`${membre.nom} est maintenant admin`);


                    setTimeout(() => {
                        listeAttrMembre(groupe);
                    }, 300);
                });
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

            nomActive.innerHTML = element.membres.map(m => m.nom).join(", ");
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