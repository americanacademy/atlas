import csv, json, re

csvFileName = "organizations.csv"
jsonFileName = "organizations.json"
format = "pretty"
regex = re.compile('[^a-zA-Z]')

def clean(s):
    return regex.sub('', s)
    # return s.translate(None, "$#[]/.")

def truncate(s):
    return s[:40]

def truncateLong(s):
    return s[:300]

# Convert CSV to JSON
csvRows = {}
reader = csv.DictReader(open(csvFileName), delimiter=",")
titles = reader.fieldnames
titles = filter(None, titles)
cleanTitles = [truncate(clean(t)) for t in titles]
# print titles
i = 0
for row in reader:
    # print row
    orgName = row[titles[0]]
    orgName = clean(orgName)
    orgName = truncate(orgName)

    i += 1
    csvRows[orgName] = {
        cleanTitles[i]:truncateLong(row[titles[i]]) for i in range(len(titles))}

    if i == 3000:
        break

with open(jsonFileName, "w") as f:
    if format == "pretty":
        f.write(json.dumps(csvRows,
                           sort_keys=False,
                           indent=4,
                           separators=(',', ': '),
                           encoding="utf-8",
                           ensure_ascii=False))
    else:
        f.write(json.dumps(csvRows))
