from bs4 import BeautifulSoup  
import requests,json

base = "https://referensi.data.kemdikbud.go.id/"
base_target = base + "index11.php?kode=160300"


base_soup = BeautifulSoup(requests.get(base_target).text, "lxml")

schools = []

for tr in base_soup.findAll("tr"):
    for a in tr.findAll("a"):
        if a.text in ["SD Sederajat", "SMP Sederajat", "SMA Sederajat"] or  "kode" not in a.get("href") : continue
        target = base + a.get("href")
        soup = BeautifulSoup(requests.get(target).text, "lxml")



        for tr in soup.findAll("tr"):
            if len(tr.findAll("td")) < 6: continue
            tds = tr.findAll("td")
            idx = tds[0].text
            npsn = tds[1].text
            name = tds[2].text
            address = tds[3].text
            status = tds[4].text

            schools.append({
                "npsn": npsn,
                "name": name,
                "address": address,
                "status": status
            })


            print(f"appending {name}")


with open("schools.json", "w") as f:
    json.dump(schools, f)

