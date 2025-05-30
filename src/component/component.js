export const component = (() => ({
    ajoutContact: () => {
        const ajout = `
    <div class="flex flex-col h-[50%] w-[90%] p-4 gap-6 border-2 justify-center items-center rounded-md border-amber-500">
        <div class="flex flex-col h-[40%] gap-5 w-full">
            <p>Nom Complet :</p>
            <input id="nomComplet" class="w-full h-[50%] rounded-2xl p-2 border-2 border-amber-200 hover:border-amber-500 focus:border-amber-500 focus:outline-none" placeholder="cheikh ndiaye khouss ngom">
        </div>

        <div class="flex flex-col h-[40%] gap-5 w-full">
            <p>Numéro de Téléphone :</p>
            <input id="numeroTelephone" class="w-full h-[50%] rounded-2xl p-2 border-2 border-amber-200 hover:border-amber-500 focus:border-amber-500 focus:outline-none" placeholder="77 473 00 39">  
        </div>

        <button id="enregistrerContact" class="w-full h-[20%] text-white bg-amber-500 rounded-md">Enregistrer</button>
    </div>
    `;
        return ajout;
    },

    listeMessage: () => {
        const message = `
            <div id="listMessage" class="flex flex-1 flex-col gap-3 w-full  justify-start items-start">
            </div>
        `;
        return message
    },

    messageEnvoyer: () => {
        const now = new Date();
        const heure = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');

        const message = `
            <div class="flex flex-col items-end">
                <div class="flex flex-row items-end gap-2">
                    <span id="messageEnvoyer" class="flex flex-row justify-end items-end w-max rounded-xl rounded-l-xl m-3 p-3 h-min text-white bg-green-600"></span>
                </div>
                <div class="flex flex-row items-center gap-1 mr-4 -mt-2">
                    <span class="text-[11px] text-gray-500">${heure}:${minutes}</span>
                    <span id="messageStatus" class="text-[16px]">
                        <i class="bx bx-check text-gray-400"></i>
                    </span>
                </div>
            </div>`;
        return message;
    },

    message: (amis, id) => {
        const dateTime = new Date();
        const mes = ` 
        <div id="mes-${amis.numero}" class="flex flex-row w-[500px] h-[60px] justify-between items-center">
            <div id="info" class="flex flex-row  items-center w-9/12 h-full">
                <div id="pp${id}" class="flex flex-row  rounded-full bg-gray-700 w-[40px] h-[40px] mr-3 ml-2"></div>
                <div id="amis" class="flex flex-col justify-center items-start ">
                    <div class="text-xl">${amis.nom}</div>
                    <div class="flex flex-row items-center">
                        <div class="text-xs/[14px]">${amis.numero}</div>
                    </div>
                </div>
            </div>

            <div id="etat" class="flex flex-col justify-between items-center w-3/12 h-full py-4 pt-4">
                <div class="rounded-full w-[4px] h-[4px] bg-green-600"></div>
                <div class="text-[12px] text-green-600">${dateTime.toLocaleDateString()}</div>
            </div>
        </div>`;
        return mes;
    },

    mmbrDuGroupe: (amis, id) => {
        const mes = ` <div id="mes" class="flex flex-row w-[500px] h-[60px] justify-between items-center">

                    <div id="info" class="flex flex-row  items-center w-9/12 h-full">
                        <div id="pp${id}" class="flex flex-row  rounded-full bg-gray-700 w-[40px] h-[40px] mr-3 ml-2"></div>
                        <div id="amis" class="flex flex-col justify-center items-start ">
                            <div class="text-xl">${amis.nom}</div>
                            <div class="text-xs/[14px]">${amis.numero}</div>
                        </div>
                    </div>

                    <div id="etat" class=" hidden flex-col justify-between items-center w-3/12 h-full py-4 pt-4">
                        <div class="admin text-[14px] text-green-600">Admin</div>
                    </div>

                    <div id="PasserAdm" class=" hidden flex-col justify-between items-center w-3/12 h-full py-4 pt-4">
                        <div class="admin text-[14px] text-green-600">Mettre Admin</div>
                    </div>


                    <div id="retirer" class=" flex flex-col justify-between items-center w-3/12 h-full py-4 pt-4">
                        <div class="admin text-[14px] text-red-600">Retirer</div>
                    </div>
                    
                </div>`
        return mes;
    },

    listeDiffusion: (ami, id) => {
        const dateTime = new Date();
        return `<div id="listMessage" class="flex flex-1 flex-col gap-3 w-[150px] justify-start items-start">
        <div id="mes" class="flex flex-row w-[500px] h-[60px] justify-between items-center">
            <div id="info" class="flex flex-row w-9/12 h-full">
                <div id="pp${id}" class="flex rounded-full bg-gray-700 w-[60px] h-[60px] mr-3"></div>
                <div id="amis" class="flex flex-col justify-between items-start py-3">
                    <div class="text-xl">${ami.nom}</div>
                    <div class="text-xs/[14px]">${ami.numero}</div>
                </div>
            </div>
            <div class="flex flex-col justify-between items-center w-3/12 h-full py-4 pt-4">
                <div class="rounded-full w-[4px] h-[4px] bg-green-600"></div>
                <div class="text-[12px] text-green-600">${dateTime.toLocaleDateString()}</div>
            </div>
            <input id="addMember${id}" type="checkbox">
        </div>
    </div>`;
    },



    listeGroupe: (nomGroupe) => {
        const dateTime = new Date();
        const groupe = `
            <div id="listMessage" class="flex flex-1 flex-col gap-3 w-[150px]  justify-start items-start">

                <div id="mes" class="flex flex-row w-[500px] h-[60px] justify-between items-center">

                    <div id="info" class="flex flex-row w-9/12 h-full">
                        <div id="pp" class="flex rounded-full bg-gray-700 w-[60px] h-[60px] mr-3"></div>
                        <div id="amis" class="flex flex-col justify-between items-start py-3">
                            <div class="text-xl">${nomGroupe.nom}</div>
                            <div class="text-xs/[14px]">hello world!</div>
                        </div>
                    </div>

                    <div class="flex flex-col justify-between items-center w-3/12 h-full py-4 pt-4">
                        <div class="rounded-full w-[4px] h-[4px] bg-green-600"></div>
                        <div class="text-[12px] text-green-600">${dateTime.toLocaleDateString()}</div>
                    </div>

                    <div id="addMember" class="text-[32px] text-green-600 mr-5 mb-3">+</div>

                </div>
            </div>
        `;
        return groupe
    },

    listeContact(contact, id) {
        const liste = `<li id="c${id}" class="text-[15px] ">${contact.nom}</li>`
        return liste
    },

    membreGroupe(liste) {
        const membre = `<small class="text-gray-600 text-[10px]">${liste}</small>`;
        return membre
    },

    ajoutGroupe: () => {
        const ajout = `
    <div class="flex flex-col h-[60%] w-[90%] p-4 gap-6 border-2 justify-center items-center rounded-md border-amber-500">
        <div class="flex flex-col h-[30%] gap-5 w-full">
            <p>Nom du Groupe :</p>
            <input id="nomGroupe" class="w-full h-[50%] rounded-2xl p-2 border-2 border-amber-200 hover:border-amber-500 focus:border-amber-500 focus:outline-none" placeholder="Ex : Kourel jalibatoul Marakhib">
        </div>

        <div class="flex flex-col h-[40%] gap-5 w-full">
            <p>Membres du groupe (séparés par des virgules) :</p>
            <input id="membresGroupe" class="w-full h-[50%] rounded-2xl p-2 border-2 border-amber-200 hover:border-amber-500 focus:border-amber-500 focus:outline-none" placeholder="Ex : Aliou, Khouss, Awa">
        </div>

        <button id="enregistrerGroupe" class="w-full h-[20%] text-white bg-amber-500 rounded-md">Enregistrer le Groupe</button>
    </div>
    `;
        return ajout;
    },

}))();