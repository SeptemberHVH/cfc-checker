"""
CFC Pro Max Checker 2026 — Scraper automatique
1. Télécharge le dernier PDF du palmarès
2. Le sauvegarde dans le repo (palmares.pdf) via git
3. Cherche Alain Addor — envoie un mail si trouvé
"""

import os
import re
import shutil
import smtplib
import subprocess
import urllib.request
import unicodedata
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# ── Secrets GitHub Actions ────────────────────────────────────
GMAIL_USER     = os.environ.get("GMAIL_USER", "")
GMAIL_APP_PASS = os.environ.get("GMAIL_APP_PASS", "")
NOTIFY_TO      = os.environ.get("NOTIFY_TO", GMAIL_USER)

PRENOM = "Alyssa"
NOM    = "Robatel"

PAGE_URL = "https://www.citedesmetiers.ch/palmares2026/"
PDF_OUT  = "palmares.pdf"   # fichier sauvegardé dans le repo

# ── Normalisation ─────────────────────────────────────────────
def normalize(text):
    nfkd = unicodedata.normalize("NFD", text.lower())
    return "".join(c for c in nfkd if not unicodedata.combining(c))

# ── Trouver l'URL du PDF sur la page ──────────────────────────
def find_pdf_url():
    headers = {"User-Agent": "Mozilla/5.0 (compatible; CFC-Checker/1.0)"}
    req = urllib.request.Request(PAGE_URL, headers=headers)
    with urllib.request.urlopen(req, timeout=15) as resp:
        html = resp.read().decode("utf-8", errors="replace")
    matches = re.findall(r'https?://[^"\'>\s]+\.pdf', html, re.IGNORECASE)
    if not matches:
        raise RuntimeError("Aucun PDF trouvé sur la page.")
    print(f"PDF trouvé : {matches[0]}")
    return matches[0]

# ── Télécharger le PDF ────────────────────────────────────────
def download_pdf(url):
    headers = {"User-Agent": "Mozilla/5.0 (compatible; CFC-Checker/1.0)"}
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=30) as resp:
        data = resp.read()
    print(f"PDF téléchargé : {len(data)//1024} Ko")
    return data

# ── Sauvegarder le PDF dans le repo ──────────────────────────
def save_and_commit_pdf(data):
    with open(PDF_OUT, "wb") as f:
        f.write(data)
    print(f"PDF sauvegardé : {PDF_OUT}")

    # Config git pour le commit automatique
    subprocess.run(["git", "config", "user.email", "actions@github.com"], check=True)
    subprocess.run(["git", "config", "user.name",  "CFC Checker Bot"],    check=True)
    subprocess.run(["git", "add", PDF_OUT],                                check=True)

    # Vérifie s'il y a des changements à committer
    result = subprocess.run(["git", "diff", "--staged", "--quiet"])
    if result.returncode == 0:
        print("PDF inchangé depuis le dernier run — pas de commit.")
        return False
    else:
        subprocess.run(["git", "commit", "-m", "chore: mise à jour palmares.pdf"], check=True)
        subprocess.run(["git", "push"], check=True)
        print("PDF commité et pushé dans le repo.")
        return True

# ── Extraire le texte du PDF ──────────────────────────────────
def extract_text(pdf_bytes):
    import pypdf, io
    reader = pypdf.PdfReader(io.BytesIO(pdf_bytes))
    text = "\n".join(p.extract_text() or "" for p in reader.pages)
    print(f"Texte extrait : {len(text)} caractères, {text.count(chr(10))} lignes")
    return text

# ── Chercher le nom ───────────────────────────────────────────
def search_name(text, prenom, nom):
    lines = [l.strip() for l in text.split("\n") if l.strip()]
    p, nm = normalize(prenom), normalize(nom)
    return [l for l in lines if p in normalize(l) and nm in normalize(l)]

# ── Envoyer le mail ───────────────────────────────────────────
def send_mail(found_lines, pdf_url):
    if not GMAIL_USER or not GMAIL_APP_PASS:
        print("Secrets mail non configurés — pas de notification.")
        return

    subject = f"🏆 {PRENOM} {NOM} EST DANS LE PALMARÈS CFC 2026 !!!"
    body = f"""
ALAIN ADDOR VALIDÉ — CFC PRO MAX HUN EDITION
=============================================

{PRENOM} {NOM} apparaît dans le palmarès CFC 2026 !

Lignes trouvées :
{chr(10).join(f"  ▸ {l}" for l in found_lines)}

PDF officiel : {pdf_url}
Page officielle : {PAGE_URL}

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
        server.login(GMAIL_USER, GMAIL_APP_PASS.replace(" ", "").replace("\xa0", ""))
        server.sendmail(GMAIL_USER, NOTIFY_TO, msg.as_string())
    print(f"Mail envoyé à {NOTIFY_TO}")

# ── Main ──────────────────────────────────────────────────────
def main():
    print(f"=== CFC Pro Max Checker — {PRENOM} {NOM} ===")

    pdf_url   = find_pdf_url()
    pdf_bytes = download_pdf(pdf_url)

    # Sauvegarde dans le repo pour que le site puisse le charger
    save_and_commit_pdf(pdf_bytes)

    # Cherche le nom
    text    = extract_text(pdf_bytes)
    matches = search_name(text, PRENOM, NOM)

    if matches:
        print(f"TROUVÉ ! {len(matches)} ligne(s) :")
        for m in matches: print(f"  ▸ {m}")
        send_mail(matches, pdf_url)
    else:
        print(f"{PRENOM} {NOM} pas encore dans le palmarès.")

if __name__ == "__main__":
    main()
