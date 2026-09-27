/* Loup-Garou RPS — scripts du site (aucune dépendance). */

/* ----- À PERSONNALISER --------------------------------------------------
   Adresse qui reçoit les messages du formulaire de contact, et liens des
   canaux affichés sur la page Contact. */
const CONTACT = {
  email: "contact.lgrps@gmail.com",
  discord: "", // vide = carte grisée « Bientôt » ; mettre l'invitation quand le serveur existera
  depot: "https://github.com/VOTRE-COMPTE/loupgarou-rps/issues",
};
/* ----------------------------------------------------------------------- */

document.documentElement.classList.remove("no-js");

function lire(cle) { try { return localStorage.getItem(cle); } catch (e) { return null; } }
function ecrire(cle, val) { try { localStorage.setItem(cle, val); } catch (e) { /* stockage indisponible */ } }

/* Thème Jour / Nuit : appliqué avant l'affichage pour éviter un flash. */
(function () {
  const choix = lire("lg-theme");
  if (choix === "light" || choix === "dark") document.documentElement.dataset.theme = choix;
})();

function themeCourant() {
  const t = document.documentElement.dataset.theme;
  if (t) return t;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

document.addEventListener("DOMContentLoaded", () => {
  /* Bascule Jour / Nuit */
  document.querySelectorAll(".bascule").forEach((btn) => {
    const libelle = btn.querySelector(".libelle");
    const maj = () => {
      const nuit = themeCourant() === "dark";
      if (libelle) libelle.textContent = nuit ? "Nuit" : "Jour";
      btn.setAttribute("aria-label", nuit ? "Passer au tirage Jour" : "Passer au tirage Nuit");
    };
    maj();
    btn.addEventListener("click", () => {
      const suivant = themeCourant() === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = suivant;
      ecrire("lg-theme", suivant);
      maj();
    });
  });

  /* Menu mobile */
  const burger = document.querySelector(".burger");
  const nav = document.querySelector(".nav");
  if (burger && nav) {
    burger.addEventListener("click", () => {
      const ouvert = nav.classList.toggle("ouvert");
      burger.setAttribute("aria-expanded", String(ouvert));
      burger.textContent = ouvert ? "✕" : "☰";
    });
  }

  /* Révélation au défilement */
  const aReveler = document.querySelectorAll(".revele");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entrees) => {
      entrees.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("vu"); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    aReveler.forEach((el) => io.observe(el));
  } else {
    aReveler.forEach((el) => el.classList.add("vu"));
  }

  /* Chronologie de la nuit (accueil) */
  const onglets = document.querySelectorAll("[data-nuit]");
  onglets.forEach((btn) => btn.addEventListener("click", () => {
    onglets.forEach((b) => b.setAttribute("aria-selected", String(b === btn)));
    document.querySelectorAll(".chrono").forEach((liste) => {
      liste.hidden = liste.id !== btn.dataset.nuit;
    });
  }));

  /* Boutons « copier » sur les blocs de code */
  document.querySelectorAll("pre[data-copier]").forEach((pre) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "copier";
    b.textContent = "Copier";
    b.addEventListener("click", async () => {
      const texte = pre.querySelector("code").innerText;
      try { await navigator.clipboard.writeText(texte); b.textContent = "Copié !"; }
      catch (e) { b.textContent = "Sélectionne à la main"; }
      setTimeout(() => (b.textContent = "Copier"), 1800);
    });
    pre.appendChild(b);
  });

  /* Wiki : filtre du sommaire + section active */
  const recherche = document.querySelector("#recherche-wiki");
  if (recherche) {
    const sections = [...document.querySelectorAll(".article > section")];
    const liens = [...document.querySelectorAll(".sommaire a")];
    const vide = document.querySelector(".sommaire .vide");
    const normaliser = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
    recherche.addEventListener("input", () => {
      const q = normaliser(recherche.value.trim());
      let visibles = 0;
      sections.forEach((s) => {
        const ok = !q || normaliser(s.textContent).includes(q);
        s.hidden = !ok;
        const lien = liens.find((a) => a.getAttribute("href") === "#" + s.id);
        if (lien) lien.parentElement.hidden = !ok;
        if (ok) visibles++;
      });
      if (vide) vide.style.display = visibles ? "none" : "block";
    });
    if ("IntersectionObserver" in window) {
      const suivi = new IntersectionObserver((entrees) => {
        entrees.forEach((e) => {
          if (!e.isIntersecting) return;
          liens.forEach((a) => a.classList.toggle("actif", a.getAttribute("href") === "#" + e.target.id));
        });
      }, { rootMargin: "-20% 0px -70% 0px" });
      sections.forEach((s) => suivi.observe(s));
    }
  }

  /* Contact : liens des canaux + formulaire -> e-mail pré-rempli */
  document.querySelectorAll("[data-canal]").forEach((a) => {
    const cible = CONTACT[a.dataset.canal];
    if (!cible) {
      a.classList.add("desactive");
      a.removeAttribute("href");
      a.setAttribute("aria-disabled", "true");
      const sous = a.querySelector("span");
      if (sous) sous.textContent = "Bientôt — pas encore ouvert";
      return;
    }
    a.href = a.dataset.canal === "email" ? "mailto:" + cible : cible;
    const aff = a.querySelector(".adresse");
    if (aff) aff.textContent = a.dataset.canal === "email" ? cible : cible.replace(/^https?:\/\//, "");
  });
  const form = document.querySelector("#formulaire-contact");
  if (form) {
    form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      if (!form.reportValidity()) return;
      const d = new FormData(form);
      const sujet = `[Loup-Garou RPS] ${d.get("sujet")} — ${d.get("nom")}`;
      const corps = [
        d.get("message"),
        "",
        "—",
        `Nom : ${d.get("nom")}`,
        `E-mail : ${d.get("email")}`,
        d.get("serveur") ? `Serveur / version : ${d.get("serveur")}` : "",
      ].filter((l) => l !== null).join("\n");
      window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(sujet)}&body=${encodeURIComponent(corps)}`;
      form.querySelector(".retour").classList.add("visible");
    });
  }
});
