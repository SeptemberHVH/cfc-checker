"""
CFC Pro Max Checker 2026 — Scraper automatique
Télécharge le PDF du palmarès, cherche le nom, envoie un mail si trouvé.
"""

import os
import re
import smtplib
import urllib.request
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# ── Paramètres (injectés via les secrets GitHub Actions) ──────
GMAIL_USER     = os.environ["GMAIL_USER"]      # ton adresse Gmail
GMAIL_APP_PASS = os.environ["GMAIL_APP_PASS"]  # mot de passe d'application
NOTIFY_TO      = os.environ.get("NOTIFY_TO", GMAIL_USER)  # destinataire (toi par défaut)

# Nom à chercher — modifie ici si besoin
PRENOM = "Alain"
NOM    = "Addor"

# Page officielle du palmarès
PAGE_URL = "https://www.citedesmetiers.ch/palmares2026/"

# ── Normalisation (accents, casse) ────────────────────────────
import unicodedata

def normalize(text):
    """Minuscules + suppression des accents."""
    nfkd = unicodedata.normalize("NFD", text.lower())
    return "".join(c for c in nfkd if not unicodedata.combining(c))

# ── Étape 1 : trouver l'URL du PDF sur la page ────────────────
def find_pdf_url():
    headers = {"User-Agent": "Mozilla/5.0 (compatible; CFC-Checker/1.0)"}
    req = urllib.request.Request(PAGE_URL, headers=headers)
    with urllib.request.urlopen(req, timeout=15) as resp:
        html = resp.read().decode("utf-8", errors="replace")

    # Cherche tous les liens .pdf dans la page
    matches = re.findall(r'https?://[^"\'>\s]+\.pdf', html, re.IGNORECASE)
    if not matches:
        raise RuntimeError("Aucun PDF trouvé sur la page du palmarès.")

    # Prend le premier (ou le plus récent si plusieurs)
    pdf_url = matches[0]
    print(f"PDF trouvé : {pdf_url}")
    return pdf_url

# ── Étape 2 : télécharger le PDF ─────────────────────────────
def download_pdf(url):
    headers = {"User-Agent": "Mozilla/5.0 (compatible; CFC-Checker/1.0)"}
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=30) as resp:
        data = resp.read()
    print(f"PDF téléchargé : {len(data)//1024} Ko")
    return data

# ── Étape 3 : extraire le texte du PDF ───────────────────────
def extract_text(pdf_bytes):
    try:
        import pypdf
        import io
        reader = pypdf.PdfReader(io.BytesIO(pdf_bytes))
        pages = []
        for page in reader.pages:
            pages.append(page.extract_text() or "")
        text = "\n".join(pages)
        print(f"Texte extrait : {len(text)} caractères, {text.count(chr(10))} lignes")
        return text
    except ImportError:
        raise RuntimeError("pypdf non installé — vérifie requirements.txt")

# ── Étape 4 : chercher le nom ─────────────────────────────────
def search_name(text, prenom, nom):
    lines = [l.strip() for l in text.split("\n") if l.strip()]
    p  = normalize(prenom)
    nm = normalize(nom)
    matches = []
    for line in lines:
        n = normalize(line)
        if p and nm and p in n and nm in n:
            matches.append(line)
        elif p and not nm and p in n:
            matches.append(line)
        elif nm and not p and nm in n:
            matches.append(line)
    return matches

# ── Étape 5 : envoyer le mail ─────────────────────────────────
def send_mail(found_lines, pdf_url):
    subject = f"🏆 {PRENOM} {NOM} EST DANS LE PALMARÈS CFC 2026 !!!"

    body_lines = "\n".join(f"  ▸ {l}" for l in found_lines)
    body = f"""
ALAIN ADDOR VALIDÉ — CFC PRO MAX HUN EDITION
=============================================

{PRENOM} {NOM} apparaît dans le palmarès CFC 2026 !

Lignes trouvées :
{body_lines}

PDF officiel :
{pdf_url}

Page officielle :
{PAGE_URL}

---
TUNG TUNG AH MAMA GUAVO 🥁
CFC Pro Max Checker 2026 — RC2 — HUN Edition
""".strip()

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"]    = GMAIL_USER
    msg["To"]      = NOTIFY_TO
    msg.attach(MIMEText(body, "plain", "utf-8"))

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(GMAIL_USER, GMAIL_APP_PASS)
        server.sendmail(GMAIL_USER, NOTIFY_TO, msg.as_string())

    print(f"Mail envoyé à {NOTIFY_TO}")

# ── Main ──────────────────────────────────────────────────────
def main():
    print(f"=== CFC Pro Max Checker — recherche de {PRENOM} {NOM} ===")

    pdf_url   = find_pdf_url()
    pdf_bytes = download_pdf(pdf_url)
    text      = extract_text(pdf_bytes)
    matches   = search_name(text, PRENOM, NOM)

    if matches:
        print(f"TROUVÉ ! {len(matches)} ligne(s) :")
        for m in matches:
            print(f"  ▸ {m}")
        send_mail(matches, pdf_url)
        print("Notification envoyée.")
    else:
        print(f"{PRENOM} {NOM} non trouvé dans le palmarès pour l'instant.")
        print("(Le script se relancera automatiquement dans 2h)")

if __name__ == "__main__":
    main()
