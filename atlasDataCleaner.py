import csv, json, re

csvFileName = "data.csv"
jsonFileName = "data.json"
format = "pretty"
regex = re.compile('[^a-zA-Z]')

def clean(s):
    return regex.sub('', s)
    # return s.translate(None, "$#[]/.")

def truncate(s):
    return s[:150]

# Convert CSV to JSON
csvRows = {}
reader = csv.DictReader(open(csvFileName), delimiter=",")
titles = reader.fieldnames
cleanTitles = [clean(t) for t in titles]
# print titles
for row in reader:
    # print row
    orgName = row[titles[0]]
    orgName = clean(orgName)
    orgName = truncate(orgName)

    csvRows[orgName] = {
        cleanTitles[i]:row[titles[i]] for i in range(len(titles))}

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
