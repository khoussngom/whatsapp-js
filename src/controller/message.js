import { component } from "../component/component.js";
import { services } from "../services/service.js";
import { models } from "../models/models.js";
import { btEnvoie, recupererMessage, EnvoyerMessage, voirMessage } from "./controller.js";

const listeMessages = document.querySelector("#listMessage");
const diffusion = document.querySelector("#diffusions");
const expedition = document.querySelector("#expediteur");

let contactActif = null;

export let Allcheck = [];
export let isDiffusionMode = false;

export const diff = function() {
    diffusion.addEventListener("click", () => {
        isDiffusionMode = true;
        affTemplate();

        btEnvoie.addEventListener("click", handleDiffusion);
    });
};

const handleDiffusion = () => {
    const message = recupererMessage();
    if (message && message.trim() !== "") {
        if (isDiffusionMode && Allcheck.length > 0) {
            Allcheck.forEach(element => {
                const msgSpan = EnvoyerMessage(message);
                expedition.appendChild(msgSpan.cloneNode(true));

                if (!element.messages) {
                    element.messages = [];
                }
                element.messages.push(msgSpan);
            });

            isDiffusionMode = false;
            Allcheck = [];

            btEnvoie.removeEventListener("click", handleDiffusion);

            listeMessages.innerHTML = "Message envoyé aux contacts sélectionnés";
            setTimeout(() => {
                affTemplate();
            }, 2000);
        }
    }
};

const affTemplate = function() {
    const amis = models.listerContact();

    if (amis.length < 1) {
        listeMessages.innerHTML = "pas de contact disponible !";
        return;
    }

    listeMessages.innerHTML = "";
    Allcheck = [];

    amis.forEach((element, key) => {
        const div = document.createElement("div");
        div.innerHTML = component.listeDiffusion(element, key);
        listeMessages.prepend(div);

        const pp = div.querySelector(`#pp${key}`);
        const span = document.createElement("span");
        span.classList.add("flex", "flex-row", "rounded-full", "w-[40px]", "h-[40px]", "justify-center", "items-center");
        span.innerHTML = `<span class="flex justify-center items-center text-[30px] text-white w-full h-full">${element.nom.charAt(0).toUpperCase()}</span>`;
        pp.appendChild(span);

        const checkbox = div.querySelector(`#addMember${key}`);
        checkbox.addEventListener("change", () => {
            if (checkbox.checked) {
                Allcheck.push(element);
            } else {
                Allcheck = Allcheck.filter(e => e !== element);
            }
        });
    });
};