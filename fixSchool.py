# -*- coding: utf-8 -*-

import requests
import json

arq = open("table.csv")
lines = arq.readlines()

subObject = {}
subObject["school"] = {"name": "Instituto Ensinar Brasil",
                       "cnpj": "19322494001716", "studentsNumber": 23}
subObject["teachers"] = [{
    "name": "FÁBIO CYSNE BARRETO",
    "cpf": "073.435.417-73",
    "rg": "1.171.827",
    "email": "admfabiocysne@uol.com.br",
    "cellphone": "(27) 99970-0408"
}]

studentsObject = []

for i in range(7, 30):
    lines[i] = lines[i].rstrip()
    info = lines[i].split(',')

    newStudent = {
        "name": info[0],
        "cpf": info[1],
        "email": info[2],
        "cellphone": info[3],
        "year": info[4],
        "necessity": info[5]
    }

    studentsObject.append(newStudent)

subObject["students"] = studentsObject

toJson = json.dumps(subObject, ensure_ascii=False)

print(toJson)
