import csv, json, re

csvFileName = "organizations.csv"
jsonFileName = "organizations.json"
csvFileName2 = "collaborations.csv"
jsonFileName2 = "collaborations.json"
format = "pretty"
regex = re.compile('[^a-zA-Z]')

def clean(s):
    return regex.sub('', s)
    # return s.translate(None, "$#[]/.")

def truncate(s):
    return s[:40]

def truncateLong(s):
    return s[:300]

def convert(csv_file, json_file):
    # Convert CSV to JSON
    csvRows = {}
    file = open(csv_file, 'rt')
    reader = csv.reader(file)
    titles = next(reader)
    cleanTitles = [truncate(clean(t)) for t in titles]
    # print titles
    for row in reader:
        orgName = row[0]
        orgName = clean(orgName)
        orgName = truncate(orgName)

        if (orgName != ""):
            blob = {}
            for i in range(len(cleanTitles)):
                blob[cleanTitles[i]] = row[i]
            csvRows[orgName] = blob

    with open(json_file, "w") as f:
        if format == "pretty":
            f.write(json.dumps(csvRows,
                               sort_keys=False,
                               indent=4,
                               separators=(',', ': '),
                               encoding="utf-8",
                               ensure_ascii=False))
        else:
            f.write(json.dumps(csvRows))

convert(csvFileName, jsonFileName)
convert(csvFileName2, jsonFileName2)
