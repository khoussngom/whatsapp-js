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
const profil = document.querySelector("#pp");

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

    profil.innerHTML = "";

    const span = document.createElement("span");
    span.classList.add(
        "flex", "flex-row", "rounded-full",
        "w-[40px]", "h-[40px]", "justify-center", "items-center"
    );
    span.innerHTML = `<span class=" flex flex-row justify-center items-center text-cente text-[30px] text-white w-full h-full">${element.nom.charAt(0).toUpperCase()}
                        </span>`;

    profil.appendChild(span);
};


const allMessages = function() {
    listeMessages.innerHTML = component.listeMessage();
    const amis = models.listerContact();


    amis.forEach((element, key) => {
        const div = document.createElement("div");
        div.innerHTML = component.message(element, key);

        listeMessages.prepend(div);
        const pp = document.querySelector(`#pp${key}`);


        const span = document.createElement("span");
        span.classList.add(
            "flex", "flex-row", "rounded-full",
            "w-[40px]", "h-[40px]", "justify-center", "items-center"
        );
        span.innerHTML = `<span class=" flex flex-row justify-center items-center text-cente text-[30px] text-white w-full h-full">${element.nom.charAt(0).toUpperCase()
}</span>`;

        pp.appendChild(span);

        div.addEventListener("click", () => {
            afficherContact(element);

            document.querySelectorAll(".selectionner").forEach(el => {
                el.classList.remove("selectionner");
            });

            div.classList.add("selectionner");
        });


        btnArchive.addEventListener("click", () => {
            models.archiverContact(element.nom, amis);
            allArchive();
        });

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


const creer_listMembre = function(membresStr) {
    const listMember = document.createElement("div");
    listMember.classList.add("list-member");
    listMember.innerHTML = component.membreGroupe(membresStr);

    nomActive.innerHTML = element.nom;

    enteteDiscu.appendChild(listMember);
}

const afficherMembre = function(element) {
    const allMembers = models.listeMembre(element.nom);

    if (Array.isArray(allMembers) && allMembers.length > 0) {

        const membresStr = allMembers.join(", ");
        const ancienDiv = document.querySelector(".list-member");

        if (ancienDiv) {
            ancienDiv.remove();
        }
        creer_listMembre(membresStr);
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
            return;
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

    verifier_numero_inContact(listeContact, mem);

    return { nom, membres: mem };
}


function construireGroupe({ nom, membres }) {
    if (!nom) return null;

    const nouveauGroupe = { nom };
    if (membres) {
        const membresArray = membres;

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



const add_li_contact = function(li) {
    const membre = li.textContent;
    console.log(groupe.membres)
    groupe.membres.push(membre);
    li.innerHTML = "";
}



const parcourir_contact = function(contact) {
    contact.forEach((element, key) => {
        const li = document.createElement("li");
        li.innerHTML = component.listeContact(element, key);
        li.addEventListener("click", () => {
            add_li_contact(li);
        })
        ul.appendChild(li);
    })
}



const choixMembre = function(groupe) {
    const contact = models.listerContact();
    const ul = document.createElement("ul");
    parcourir_contact(contact);
    listeMessages.appendChild(ul);
}


const addMembre = function(groupe) {

    const add = document.querySelector("#addMember");
    add.addEventListener("click", () => { choixMembre(groupe) });
}

const afMemb = function(groupe) {
    if (groupe.length > 0) {
        groupe.forEach(element => {
            const div = document.createElement("div");
            div.innerHTML = component.listeGroupe(element);
            listeMessages.appendChild(div);
            div.addEventListener("click", () => afficherMembre(element))
            addMembre(element);
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

    const bool = services.numExiste(groupe, newContact.numero)
    if (bool) {
        afficherMessageError("ce numero existe deja !");
        return
    }

    afficherMessage(newContact);
}




nouveau.addEventListener("click", ajouter);

messages.addEventListener("click", allMessages);

listeGroupe.addEventListener("click", afficherListeGroupe)

Archive.addEventListener("click", allArchive)