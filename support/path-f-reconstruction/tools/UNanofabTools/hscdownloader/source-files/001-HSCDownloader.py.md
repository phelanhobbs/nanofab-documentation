

# Source Reconstruction: UNanofabTools/HSCDownloader.py

## Breadcrumbs

[Path F Home](../../../../README.md) | [Navigator](../../../../NAVIGATOR.md) | [Troubleshooting Routes](../../../../TROUBLESHOOTING-ROUTES.md) | [Reconstruction Checklist](../../../../RECONSTRUCTION-CHECKLIST.md) | [First Hour](../../../../MAINTAINER-FIRST-HOUR.md) | [Glossary](../../../../GLOSSARY.md) | [Evidence Template](../../../../REBUILD-EVIDENCE-TEMPLATE.md) | [Fixture Index](../../../../FIXTURE-AND-EVIDENCE-INDEX.md) | [Tool Index](../../../INDEX.md) | [System Map](../../../00-system-map/README.md) | [Owning Tool README](../README.md)

If you opened this page directly from search, stop here first: read the owning tool README, then return to this source page only for implementation evidence.

- Repository: `UNanofabTools`
- Relative path: `HSCDownloader.py`
- Lines read: `1024`
- Dirty in working tree at generation time: `no`
- Untracked at generation time: `no`
- Sanitized SHA-256 prefix: `e86d901a604a86a7`
- Code fence language: `python`

## Reconstruction Purpose

This section is written so a maintainer can recreate the file's behavior without opening the source tree. The sanitized code excerpt preserves structure and names while removing secret-looking literal values. The line-by-line notes explain the operational reason for each line, the behavior that must survive a rewrite, and the edge cases to test.

## Python Structure Summary

- Imports: `import numpy`, `import requests`, `import schedule`, `import os`, `import pandas`, `import json`, `from io import StringIO`, `import logging`, `import time`, `import signal`, `import sys`
- Classes: none detected
- Functions: `downloadFile`, `ensureExists`, `changedData`, `retrieveData`, `shortenStr`, `combineCells`, `saveALD`, `saveEbeam`, `saveMOCVD`, `saveParylene`, `savePECVD`, `saveDenton635`, `saveDenton18`, `saveTMV`, `saveDRIE`, `saveIsotropic`, `savePlasmalab`, `savePlasmaTherm`, `saveTechnics`, `saveCleanOx`, `saveDopedOx`, `saveLTO`, `saveNitride`, `savePoly`, `saveAllwin`, `save`, `graceful_exit`, `runForever`
- Routes: none detected

## Sanitized Source Excerpt

```python
# Copyright (c) 2024 Phelan Hobbs
# All rights reserved.
#
# Version: 0.0.9
# Date: 2024-07-03
#
# This code was created to be used by the University of Utah Nanofab under the direction of Kathy Anderson and Jim Pierce


import numpy as np
import requests
import schedule
import os
import pandas as pd
import json
from io import StringIO
import logging
import time
import signal
import sys
breakLoop = 0

script_dir = os.path.dirname(__file__) #<-- absolute dir the script is in
DATA_DIR = os.path.join(script_dir, 'HSCDATA')
#DATA_DIR = "C:\\Users\\Phelan\\NMon\\HSCDATA"
AUTH = 'Bearer <redacted-secret-value>'
URLBASE = 'https://n8n.cores.utah.edu/webhook/custom_form_data_dump?service_ids='

# Setup basic logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')


def downloadFile(url):
    header = {'Authorization': AUTH}
    fullDataTable = requests.get(URLBASE + url, headers=header)
    readData = json.loads(fullDataTable.text)

    #print(json.dumps(readData, indent=4))
    DLed = pd.json_normalize(readData)
    return DLed

#Ensures that the files exist, if they don't, it creates them
def ensureExists(fileName):
    #ensures that the files both exist, if not, it creates them
    filePathFull = os.path.join(DATA_DIR, fileName)
    filePathSmall = os.path.join(DATA_DIR, 'small_' +fileName)
    if not os.path.exists(filePathFull):
        open(filePathFull, 'w').close()
    if not os.path.exists(filePathSmall):
        open(filePathSmall, 'w').close()


#TODO
def changedData(fileName, secondFile):
    #checks if the data has changed
    #if it has, it will return true
    #if it hasn't, it will return false
    return 1


#Retrieves the data from HSC, the deviceName selects which device to retrieve data from
def retrieveData(deviceName):
    #todo retrieve data from HSC
    #need to handle as case statement
    DLed = ''
    #Deposition tools first
    if (deviceName == 'ALD'):
        DLed = downloadFile('761')
        print("Retrieving Data from ALD")
    elif (deviceName == 'Ebeam'):
        DLed = downloadFile('764')
        print("Retrieving Data from Ebeam")
    elif (deviceName == 'MOCVD'):
        DLed = downloadFile('769')
        print("Retrieving Data from MOCVD")
    elif (deviceName == 'Parylene'):
        DLed = downloadFile('765')
        print("Retrieving Data from Parylene")
    elif (deviceName == 'PECVD'):
        DLed = downloadFile('770')
        print("Retrieving Data from PECVD")
    elif (deviceName == 'Denton635'):
        DLed = downloadFile('766')
        print("Retrieving Data from Denton635")
    elif (deviceName == 'Denton18'):
        DLed = downloadFile('771')
        print("Retrieving Data from Denton18")
    elif(deviceName == 'TMV'):
        DLed = downloadFile('772')
        print("Retrieving Data from TMV")
    #start of sputter tools
    elif (deviceName == 'DRIE'):
        DLed = downloadFile('767')
        print("Retrieving Data from DRIE")
    elif (deviceName == 'Isotropic'):
        DLed = downloadFile('775')
        print("Retrieving Data from Isotropic")
    elif (deviceName == 'PlasmaLab'):
        DLed = downloadFile('776')
        print("Retrieving Data from PlasmaLab")
    elif (deviceName == 'PlasmaTherm'):
        DLed = downloadFile('777')
        print("Retrieving Data from PlasmaTherm")
    elif (deviceName == 'Technics'):
        DLed = downloadFile('778')
        print("Retrieving Data from Technics")
        #Start of Furnace tools
    elif (deviceName == 'CleanOx'):
        DLed = downloadFile('779')
        print("Retrieving Data from CleanOx")
    elif (deviceName == 'DopedOx'):
        DLed = downloadFile('780')
        print("Retrieving Data from DopedOx")
    elif (deviceName == 'LTO'):
        DLed = downloadFile('762')
        print("Retrieving Data from LTO")
    elif (deviceName == 'Nitride'):
        DLed = downloadFile('763')
        print("Retrieving Data from Nitride")
    elif (deviceName == 'Poly'):
        DLed = downloadFile('781')
        print("Retrieving Data from Poly")
    elif (deviceName == 'Allwin'):
        DLed = downloadFile('801')
        print("Retrieving Data from Allwin")
    #Start of Laser Tools
    elif (deviceName == 'DPSS'):
        DLed = downloadFile('825')
        print("Retrieving Data from DPSS")
    #Start of Lithography Tools
    elif (deviceName == '100SC'):
        DLed = downloadFile('834')
        print("Retrieving Data from 100SC")
    elif (deviceName == '1800SC'):
        DLed = downloadFile('835')
        print("Retrieving Data from 1800SC")
    elif (deviceName == '9260SC'):
        DLed = downloadFile('836')
        print("Retrieving Data from 9260SC")
    elif (deviceName == 'EC101'):
        DLed = downloadFile('844')                      #CURRENTLY HAS NO DATA
        print("Retrieving Data from EC101")
    #Start of Microfluidics Tools
    elif (deviceName == 'PDMS'):
        DLed = downloadFile('845')                      #CURRENTLY HAS NO DATA
        print("Retrieving Data from PDMS")
    #Start of Patterning Tools
    elif (deviceName == 'DWL66'):
        DLed = downloadFile('782')
        print("Retrieving Data from DWL66")
    elif (deviceName == 'MicroPG'):
        DLed = downloadFile('785')
        print("Retrieving Data from MicroPG")
    elif (deviceName == 'MicroPGZP4'):
        DLed = downloadFile('787')
        print("Retrieving Data from MicroPGZP4")
    elif (deviceName == 'Nanoscribe'):
        DLed = downloadFile('827')
        print("Retrieving Data from Nanoscribe")
    elif (deviceName == 'NanoFrazor'):
        DLed = downloadFile('833')
        print("Retrieving Data from NanoFrazor")
    #Start of Misc Tools
    elif (deviceName == 'Maintainence'):
        DLed = downloadFile('843')
        print("Retrieving Data from Maintainence")
    else:
        print("Invalid Device Name")
        return
    return DLed

def shortenStr(fullStr, val):
    try:
        return fullStr[val:]
    except:
        return 'Unknown'

def combineCells(cell1, cell2):
    if cell1 == 'Other':
        if cell2 == '':
            return 'Unknown/Other'
        else:
            return cell2
    else:
        return cell1
#Saves and works with the ALD data
def saveALD():
    ensureExists('ALD_DataCollection.csv')
    #GET DATA FROM HSC

    ALDData = retrieveData('ALD')
    #CHECK IF DATA HAS CHANGED
    if changedData('ALD_DataCollection.csv', ALDData):
        #SAVE DATA
        ALDData.to_csv(os.path.join(DATA_DIR, 'ALD_DataCollection.csv'))
        #Creates a smaller, more easily managed version of the data
        columns_to_keep = ['submission_id','submitter_name','form_data.ALDFIJI_Film','form_data.ALDFIJI_Film_OtherText','form_data.ALDFIJI_DepMode','form_data.ALDFIJI_Recipe',
                           'form_data.ALDFIJI_ChuckTemp','form_data.ALDFIJI_PrecursorTemp','form_data.ALDFIJI_NoCycles','form_data.ALDFIJI_BasePress',
                           'form_data.ALDFIJI_Thick','form_data.ALDFIJI_ThickUnit']
        ALDDataSmall = ALDData[columns_to_keep]
        ALDDataSmall = ALDDataSmall.rename(columns={'form_data.ALDFIJI_Film': 'Film Deposited','form_data.ALDFIJI_Film_OtherText': 'Other Film',
                                                    'form_data.ALDFIJI_DepMode': 'Deposition Mode', 'form_data.ALDFIJI_Recipe': 'Recipe',
                                                    'form_data.ALDFIJI_ChuckTemp': 'Chuck Temperature (C)',
                                                    'form_data.ALDFIJI_PrecursorTemp': 'Precursor Temperature (C)', 'form_data.ALDFIJI_NoCycles': 'Number of Cycles',
                                                    'form_data.ALDFIJI_BasePress': 'Base Pressure', 'form_data.ALDFIJI_Thick': 'Measured Thickness (nm)',
                                                    'form_data.ALDFIJI_ThickUnit': 'Measured Unit'})

        #Iderates through the data to make necessary adjustments
        for index, row in ALDDataSmall.iterrows():

            #shortens the first chars of the film deposited
            film = shortenStr(row['Film Deposited'],13)
            #handles "other" film, if nothing is entered, it will be marked as unknown
            ALDDataSmall.at[index, 'Film Deposited'] = combineCells(film, row['Other Film'])


            #shortens first chars of Deposition Mode
            ALDDataSmall.at[index, 'Deposition Mode'] = shortenStr(row['Deposition Mode'],12)

            #converts thickness to nm
            if row['Measured Unit'] == 'ALDFIJI_ThickUnit_Ang':
                try:
                    thickness_value = row['Measured Thickness (nm)']
                    ALDDataSmall.at[index, 'Measured Thickness (nm)'] = int(thickness_value) / 10
                except ValueError as e:
                    # Upon failure, sets value to none (a.k.a not a number)
                    ALDDataSmall.at[index, 'Measured Thickness (nm)'] = None


        #delete other film and units column
        ALDDataSmall.drop(columns=['Other Film', 'Measured Unit'], inplace=True)


        ALDDataSmall.to_csv(os.path.join(DATA_DIR, 'small_ALD_DataCollection.csv'))
        #SHORTEN DATA



def saveEbeam():
    print('Saving Ebeam')
    ensureExists('Ebeam_DataCollection.csv')
    EbeamData = retrieveData('Ebeam')
    if changedData('Ebeam_DataCollection.csv', EbeamData):
        EbeamData.to_csv(os.path.join(DATA_DIR, 'Ebeam_DataCollection.csv'))
        columns_to_keep = ['submission_id','submitter_name','form_data.DENTONSJ20C_Substrate','form_data.DENTONSJ20C_SubOther','form_data.DENTONSJ20C_BasePress','form_data.DENTONSJ20C_BasePressUnit','form_data.DENTONSJ20C_PumpDownTime',
                           'form_data.DENTONSJ20C_Material1','form_data.DENTONSJ20C_Material1_MatOther','form_data.DENTONSJ20C_Material1_BeamVoltage','form_data.DENTONSJ20C_Material1_MaxCurrent','form_data.DENTONSJ20C_Material1_CrystalThick','form_data.DENTONSJ20C_Material1_MaxDepRate',
                           'form_data.DENTONSJ20C_Material2','form_data.DENTONSJ20C_Material2_MatOther','form_data.DENTONSJ20C_Material2_BeamVoltage','form_data.DENTONSJ20C_Material2_MaxCurrent','form_data.DENTONSJ20C_Material2_CrystalThick','form_data.DENTONSJ20C_Material2_MaxDepRate',
                           'form_data.DENTONSJ20C_Material3','form_data.DENTONSJ20C_Material3_MatOther','form_data.DENTONSJ20C_Material3_BeamVoltage','form_data.DENTONSJ20C_Material3_MaxCurrent','form_data.DENTONSJ20C_Material3_CrystalThick','form_data.DENTONSJ20C_Material3_MaxDepRate',
                           'form_data.DENTONSJ20C_Material4','form_data.DENTONSJ20C_Material4_MatOther','form_data.DENTONSJ20C_Material4_BeamVoltage','form_data.DENTONSJ20C_Material4_MaxCurrent','form_data.DENTONSJ20C_Material4_CrystalThick','form_data.DENTONSJ20C_Material4_MaxDepRate',
                           'form_data.DENTONSJ20C_TotalThick','form_data.DENTONSJ20C_TotalThickUnit','form_data.DENTONSJ20C_SheetRho', 'form_data.DENTONSJ20C_CryoTemp']
        EbeamDataSmall = EbeamData[columns_to_keep]
        EbeamDataSmall = EbeamDataSmall.rename(columns={'form_data.DENTONSJ20C_Substrate': 'Substrate','form_data.DENTONSJ20C_SubOther': 'Other Substrate',
                                                    'form_data.DENTONSJ20C_BasePress': 'Base Pressure', 'form_data.DENTONSJ20C_BasePressUnit': 'Base Pressure Unit',
                                                    'form_data.DENTONSJ20C_PumpDownTime': 'Pump Down Time (min)',
                                                    'form_data.DENTONSJ20C_Material1': 'Material Deposited 1', 'form_data.DENTONSJ20C_Material1_MatOther': 'Other Material 1',
                                                    'form_data.DENTONSJ20C_Material1_BeamVoltage': 'Beam Voltage 1', 'form_data.DENTONSJ20C_Material1_MaxCurrent': 'Max Beam Current 1',
                                                    'form_data.DENTONSJ20C_Material1_CrystalThick': 'Crystal Thickness 1', 'form_data.DENTONSJ20C_Material1_MaxDepRate': 'Max Deposition Rate 1',
                                                    'form_data.DENTONSJ20C_Material2': 'Material Deposited 2', 'form_data.DENTONSJ20C_Material2_MatOther': 'Other Material 2',
                                                    'form_data.DENTONSJ20C_Material2_BeamVoltage': 'Beam Voltage 2', 'form_data.DENTONSJ20C_Material2_MaxCurrent': 'Max Beam Current 2',
                                                    'form_data.DENTONSJ20C_Material2_CrystalThick': 'Crystal Thickness 2', 'form_data.DENTONSJ20C_Material2_MaxDepRate': 'Max Deposition Rate 2',
                                                    'form_data.DENTONSJ20C_Material3': 'Material Deposited 3', 'form_data.DENTONSJ20C_Material3_MatOther': 'Other Material 3',
                                                    'form_data.DENTONSJ20C_Material3_BeamVoltage': 'Beam Voltage 3', 'form_data.DENTONSJ20C_Material3_MaxCurrent': 'Max Beam Current 3',
                                                    'form_data.DENTONSJ20C_Material3_CrystalThick': 'Crystal Thickness 3', 'form_data.DENTONSJ20C_Material3_MaxDepRate': 'Max Deposition Rate 3',
                                                    'form_data.DENTONSJ20C_Material4': 'Material Deposited 4', 'form_data.DENTONSJ20C_Material4_MatOther': 'Other Material 4',
                                                    'form_data.DENTONSJ20C_Material4_BeamVoltage': 'Beam Voltage 4', 'form_data.DENTONSJ20C_Material4_MaxCurrent': 'Max Beam Current 4',
                                                    'form_data.DENTONSJ20C_Material4_CrystalThick': 'Crystal Thickness 4', 'form_data.DENTONSJ20C_Material4_MaxDepRate': 'Max Deposition Rate 4',
                                                    'form_data.DENTONSJ20C_TotalThick':'Total Thickness','form_data.DENTONSJ20C_TotalThickUnit' :'Thickness Unit','form_data.DENTONSJ20C_SheetRho': 'Sheet Resistivity (Ohm/sq)','form_data.DENTONSJ20C_CryoTemp':'Cryo Temp (C)'})
        #TODO manipulate data from the EBEAM
        for index, row in EbeamDataSmall.iterrows():
            #Shortens chars from substrate
            sub = shortenStr(row['Substrate'], 16)
            EbeamDataSmall.at[index, 'Substrate'] = combineCells(sub, row['Other Substrate'])


            #normalize pressure measurements around micro (-6)
            powerFactor = shortenStr(row['Base Pressure Unit'], 23)
            if powerFactor != 'Unknown' and powerFactor != '':
                EbeamDataSmall['Base Pressure'] = EbeamDataSmall['Base Pressure'].astype(float)
                EbeamDataSmall.at[index, 'Base Pressure'] = row['Base Pressure'] * 10**(int(powerFactor) +6)

            #Shortens chars from material deposited
            mat1 = shortenStr(row['Material Deposited 1'], 22)
            EbeamDataSmall.at[index, 'Material Deposited 1'] = combineCells(mat1, row['Other Material 1'])
            mat2 = shortenStr(row['Material Deposited 2'], 22)
            EbeamDataSmall.at[index, 'Material Deposited 2'] = combineCells(mat2, row['Other Material 2'])
            mat3 = shortenStr(row['Material Deposited 3'], 22)
            EbeamDataSmall.at[index, 'Material Deposited 3'] = combineCells(mat3, row['Other Material 3'])
            mat4 = shortenStr(row['Material Deposited 4'], 22)
            EbeamDataSmall.at[index, 'Material Deposited 4'] = combineCells(mat4, row['Other Material 4'])




        EbeamDataSmall.drop(columns=['Other Substrate', 'Base Pressure Unit', 'Other Material 1','Other Material 2','Other Material 3','Other Material 4'], inplace=True)

        EbeamDataSmall.to_csv(os.path.join(DATA_DIR, 'small_Ebeam_DataCollection.csv'))
    return

def saveMOCVD():
    print('Saving MOCVD')
    ensureExists('MOCVD_DataCollection.csv')
    MOCVDData = retrieveData('MOCVD')
    if changedData('MOCVD_DataCollection.csv', MOCVDData):
        MOCVDData.to_csv(os.path.join(DATA_DIR, 'MOCVD_DataCollection.csv'))
        columns_to_keep = ['submission_id','submitter_name','form_data.AGNITRON_Precursor','form_data.AGNITRON_Recipe','form_data.AGNITRON_RunTime']
        MOCVDDataSmall = MOCVDData[columns_to_keep]
        MOCVDDataSmall = MOCVDDataSmall.rename(columns={'form_data.AGNITRON_Precursor': 'Precursors Used', 'form_data.AGNITRON_Recipe': 'Recipe', 'form_data.AGNITRON_RunTime': 'Total Run Time'})

        for index, row in MOCVDDataSmall.iterrows():
            #Shortens chars from precursors used
            prec = shortenStr(row['Precursors Used'], 19)
            MOCVDDataSmall.at[index, 'Precursors Used'] = prec

            #TODO Normalize Runtime Maybe?

    MOCVDDataSmall.to_csv(os.path.join(DATA_DIR, 'small_MOCVD_DataCollection.csv'))

def saveParylene():
    print('Saving Parylene')
    ensureExists('Parylene_DataCollection.csv')
    ParyleneData = retrieveData('Parylene')
    if  (changedData('Parylene_DataCollection.csv', ParyleneData)):
        ParyleneData.to_csv(os.path.join(DATA_DIR, 'Parylene_DataCollection.csv'))
        columns_to_keep = ['submission_id','submitter_name','form_data.SCSPDS2010_Substrate','form_data.SCSPDS2010_SubstrateOth','form_data.SCSPDS2010_Adhesion','form_data.SCSPDS2010_Adhesion','form_data.SCSPDS2010_ThickUnit','form_data.SCSPDS2010_ThickTop','form_data.SCSPDS2010_ThickCenter']
        ParyleneDataSmall = ParyleneData[columns_to_keep]
        ParyleneDataSmall = ParyleneDataSmall.rename(columns={'form_data.SCSPDS2010_Substrate':'Substrate', 'form_data.SCSPDS2010_SubstrateOth': 'Other Substrate', 'form_data.SCSPDS2010_Adhesion': 'Adhesion', 'form_data.SCSPDS2010_ThickUnit': 'Thickness Unit', 'form_data.SCSPDS2010_ThickTop': 'Top Thickness', 'form_data.SCSPDS2010_ThickCenter': 'Center Thickness'})

        for index, row in ParyleneDataSmall.iterrows():
            #Shortens chars from substrate used
            sub = shortenStr(row['Substrate'],21)
            #handles "other" film, if nothing is entered, it will be marked as unknown
            ParyleneDataSmall.at[index, 'Substrate'] = combineCells(sub, row['Other Substrate'])

            #Shortens chars from adhesion
            adhesion = shortenStr(row['Adhesion'], 20)
            ParyleneDataSmall.at[index, 'Adhesion'] = adhesion

            #implement thickness measurements
            unit = shortenStr(row['Thickness Unit'], 21)
            ParyleneDataSmall.at[index, 'Thickness Top'] = str(ParyleneDataSmall.at[index, 'Top Thickness']) + unit
            ParyleneDataSmall.at[index, 'Thickness Center'] = str(ParyleneDataSmall.at[index, 'Center Thickness']) + unit

        ParyleneDataSmall.drop(columns=['Other Substrate', 'Thickness Unit'], inplace=True)
        ParyleneDataSmall.to_csv(os.path.join(DATA_DIR, 'small_Parylene_DataCollection.csv'))


def savePECVD():
    print('Saving PECVD')
    ensureExists('PECVD_DataCollection.csv')
    PECVDData = retrieveData('PECVD')
    if changedData('PECVD_DataCollection.csv', PECVDData):
        PECVDData.to_csv(os.path.join(DATA_DIR, 'PECVD_DataCollection.csv'))
        columns_to_keep = ['submission_id','submitter_name','form_data.OX80PECVD_Recipe','form_data.OX80PECVD_BasePress','form_data.OX80PECVD_ArFlow','form_data.OX80PECVD_DepPress',
                           'form_data.OX80PECVD_Power','form_data.OX80PECVD_EtchTime','form_data.OX80PECVD_ThickSite1','form_data.OX80PECVD_ThickUnit',
                           'form_data.OX80PECVD_NH3Flow','form_data.OX80PECVD_N2Flow','form_data.OX80PECVD_SiH4Flow','form_data.OX80PECVD_ThickSite2',
                           'form_data.OX80PECVD_ThickSite3','form_data.OX80PECVD_N2OFlow','form_data.OX80PECVD_O2Flow']
        PECVDDataSmall = PECVDData[columns_to_keep]
        PECVDDataSmall = PECVDDataSmall.rename(columns={'form_data.OX80PECVD_Recipe': 'Recipe', 'form_data.OX80PECVD_BasePress': 'Base Pressure', 'form_data.OX80PECVD_ArFlow': 'Argon Flow Rate',
                                                        'form_data.OX80PECVD_DepPress': 'Deposition Pressure', 'form_data.OX80PECVD_Power': 'Power', 'form_data.OX80PECVD_EtchTime': 'Etch Time',
                                                        'form_data.OX80PECVD_ThickSite1': 'Thickness Site 1', 'form_data.OX80PECVD_ThickSite2': 'Thickness Site 2', 'form_data.OX80PECVD_ThickSite3': 'Thickness Site 3',
                                                        'form_data.OX80PECVD_ThickUnit': 'Thickness Unit', 'form_data.OX80PECVD_NH3Flow': 'NH3 Flow Rate', 'form_data.OX80PECVD_N2Flow': 'N2 Flow Rate',
                                                        'form_data.OX80PECVD_SiH4Flow': 'SiH4 Flow Rate', 'form_data.OX80PECVD_N2OFlow': 'N2O Flow Rate', 'form_data.OX80PECVD_O2Flow': 'O2 Flow Rate'})

        for index, row in PECVDDataSmall.iterrows():
            #Normalize Thickness
                if row['Thickness Unit'] == 'OX80PECVD_ThickUnit_Ang':
                    PECVDData.at[index, 'Thickness Site 1'] = int(row['Thickness Site 1']) / 10
                    PECVDData.at[index, 'Thickness Site 2'] = int(row['Thickness Site 2']) / 10
                    PECVDData.at[index, 'Thickness Site 3'] = int(row['Thickness Site 3']) / 10

        #TODO FIX THE LOCATION OF THICKNESS SITE 1

        PECVDDataSmall.drop(columns=['Thickness Unit'], inplace=True)
        PECVDDataSmall.to_csv(os.path.join(DATA_DIR, 'small_PECVD_DataCollection.csv'))


def saveDenton635():
    print('Saving Denton635')
    ensureExists('Denton635_DataCollection.csv')
    Denton635Data = retrieveData('Denton635')
    if changedData('Denton635_DataCollection.csv', Denton635Data):
        Denton635Data.to_csv(os.path.join(DATA_DIR, 'Denton635_DataCollection.csv'))
        columns_to_keep = ['submission_id','submitter_name','form_data.DENTON635_Substrate','form_data.DENTON635_SubstrateOther', 'form_data.DENTON635_MasterRecipe','form_data.DENTON635_DuplicateRuns',
                           'form_data.DENTON635_BasePressVal','form_data.DENTON635_BasePressUnit','form_data.DENTON635_Clean_RFPower','form_data.DENTON635_Clean_RFTime',
                           'form_data.DENTON635_DepRecipe1','form_data.DENTON635_Mat1_Target','form_data.DENTON635_Mat1_OthTarget','form_data.DENTON635_Mat1_PreSputTime',
                           'form_data.DENTON635_Mat1_SputterTime','form_data.DENTON635_Mat1_SputterPower','form_data.DENTON635_Mat1_ChamberPress',
                           'form_data.DENTON635_Mat1_ArFlow','form_data.DENTON635_Mat1_N2Flow','form_data.DENTON635_Mat1_O2Flow',
                           'form_data.DENTON635_DepRecipe2','form_data.DENTON635_Mat2_Target','form_data.DENTON635_Mat2_OthTarget','form_data.DENTON635_Mat2_PreSputTime',
                           'form_data.DENTON635_Mat2_SputterTime','form_data.DENTON635_Mat2_SputterPower','form_data.DENTON635_Mat2_ChamberPress',
                           'form_data.DENTON635_Mat2_ArFlow','form_data.DENTON635_Mat2_N2Flow','form_data.DENTON635_Mat2_O2Flow',
                           'form_data.DENTON635_DepRecipe3','form_data.DENTON635_Mat3_Target','form_data.DENTON635_Mat3_OthTarget','form_data.DENTON635_Mat3_PreSputTime',
                           'form_data.DENTON635_Mat3_SputterTime','form_data.DENTON635_Mat3_SputterPower','form_data.DENTON635_Mat3_ChamberPress',
                           'form_data.DENTON635_Mat3_ArFlow','form_data.DENTON635_Mat3_N2Flow','form_data.DENTON635_Mat3_O2Flow',
                           'form_data.DENTON635_DepRecipe4','form_data.DENTON635_Mat4_Target','form_data.DENTON635_Mat4_OthTarget','form_data.DENTON635_Mat4_PreSputTime',
                           'form_data.DENTON635_Mat4_SputterTime','form_data.DENTON635_Mat4_SputterPower','form_data.DENTON635_Mat4_ChamberPress',
                           'form_data.DENTON635_Mat4_ArFlow','form_data.DENTON635_Ma4_N2Flow','form_data.DENTON635_Mat4_O2Flow',
                           'form_data.DENTON635_TotalThick','form_data.DENTON635_ThickUnit','form_data.DENTON635_Stress','form_data.DENTON635_SheetRho',
                           'form_data.DENTON635_CryoTemp','form_data.DENTON635_Mat1_PowerSupply','form_data.DENTON635_Mat2_PowerSupply','form_data.DENTON635_Mat3_PowerSupply',
                           'form_data.DENTON635_Mat4_PowerSupply','form_data.DENTON635_Resistivity']
        Denton635DataSmall = Denton635Data[columns_to_keep]
        Denton635DataSmall = Denton635DataSmall.rename(columns={'form_data.DENTON635_Substrate': 'Substrate', 'form_data.DENTON635_SubstrateOther': 'Other Substrate', 'form_data.DENTON635_MasterRecipe': 'Master Recipe',
                                                                'form_data.DENTON635_DuplicateRuns': 'Duplicate Runs','form_data.DENTON635_BasePressVal': 'Base Pressure', 'form_data.DENTON635_BasePressUnit': 'Base Pressure Unit',
                                                                'form_data.DENTON635_Clean_RFPower': 'Clean RF Power', 'form_data.DENTON635_Clean_RFTime': 'Clean RF Time',
                                                                'form_data.DENTON635_DepRecipe1': 'Deposition Recipe 1', 'form_data.DENTON635_Mat1_Target': 'Material 1 Target',
                                                                'form_data.DENTON635_Mat1_OthTarget': 'Other Material 1 Target', 'form_data.DENTON635_Mat1_PreSputTime': 'Material 1 Pre-Sputter Time',
                                                                'form_data.DENTON635_Mat1_SputterTime': 'Material 1 Sputter Time', 'form_data.DENTON635_Mat1_SputterPower': 'Material 1 Sputter Power',
                                                                'form_data.DENTON635_Mat1_ChamberPress': 'Material 1 Chamber Pressure','form_data.DENTON635_Mat1_ArFlow': 'Material 1 Argon Flow',
                                                                'form_data.DENTON635_Mat1_N2Flow': 'Material 1 Nitrogen Flow', 'form_data.DENTON635_Mat1_O2Flow': 'Material 1 Oxygen Flow',
                                                                'form_data.DENTON635_DepRecipe2': 'Deposition Recipe 2', 'form_data.DENTON635_Mat2_Target': 'Material 2 Target',
                                                                'form_data.DENTON635_Mat2_OthTarget': 'Other Material 2 Target', 'form_data.DENTON635_Mat2_PreSputTime': 'Material 2 Pre-Sputter Time',
                                                                'form_data.DENTON635_Mat2_SputterTime': 'Material 2 Sputter Time', 'form_data.DENTON635_Mat2_SputterPower': 'Material 2 Sputter Power',
                                                                'form_data.DENTON635_Mat2_ChamberPress': 'Material 2 Chamber Pressure', 'form_data.DENTON635_Mat2_ArFlow': 'Material 2 Argon Flow',
                                                                'form_data.DENTON635_Mat2_N2Flow': 'Material 2 Nitrogen', 'form_data.DENTON635_Mat2_O2Flow': 'Material 2 Oxygen Flow',
                                                                'form_data.DENTON635_DepRecipe3': 'Deposition Recipe 3','form_data.DENTON635_Mat3_Target': 'Material 3 Target',
                                                                'form_data.DENTON635_Mat3_OthTarget': 'Other Material 3 Target', 'form_data.DENTON635_Mat3_PreSputTime': 'Material 3 Pre-Sputter Time',
                                                                'form_data.DENTON635_Mat3_SputterTime': 'Material 3 Sputter Time', 'form_data.DENTON635_Mat3_SputterPower': 'Material 3 Sputter Power',
                                                                'form_data.DENTON635_Mat3_ChamberPress': 'Material 3 Chamber Pressure','form_data.DENTON635_Mat3_ArFlow': 'Material 3 Argon Flow',
                                                                'form_data.DENTON635_Mat3_N2Flow': 'Material 3 Nitrogen Flow', 'form_data.DENTON635_Mat3_O2Flow': 'Material 3 Oxygen Flow',
                                                                'form_data.DENTON635_DepRecipe4': 'Deposition Recipe 4','form_data.DENTON635_Mat4_Target': 'Material 4 Target',
                                                                'form_data.DENTON635_Mat4_OthTarget': 'Other Material 4 Target', 'form_data.DENTON635_Mat4_PreSputTime': 'Material 4 Pre-Sputter Time',
                                                                'form_data.DENTON635_Mat4_SputterTime': 'Material 4 Sputter Time', 'form_data.DENTON635_Mat4_SputterPower': 'Material 4 Sputter Power',
                                                                'form_data.DENTON635_Mat4_ChamberPress': 'Material 4 Chamber Pressure','form_data.DENTON635_Mat4_ArFlow': 'Material 4 Argon Flow',
                                                                'form_data.DENTON635_Ma4_N2Flow': 'Material 4 Nitrogen Flow', 'form_data.DENTON635_Mat4_O2Flow': 'Material 4 Oxygen Flow',
                                                                'form_data.DENTON635_TotalThick': 'Total Thickness', 'form_data.DENTON635_ThickUnit': 'Thickness Unit', 'form_data.DENTON635_Stress': 'Stress',
                                                                'form_data.DENTON635_SheetRho': 'Sheet Resistivity','form_data.DENTON635_CryoTemp': 'Cryo Temp',
                                                                'form_data.DENTON635_Mat1_PowerSupply': 'Material 1 Power Supply', 'form_data.DENTON635_Mat2_PowerSupply': 'Material 2 Power Supply',
                                                                'form_data.DENTON635_Mat3_PowerSupply': 'Material 3 Power Supply','form_data.DENTON635_Mat4_PowerSupply': 'Material 4 Power Supply',
                                                                'form_data.DENTON635_Resistivity': 'Resistivity'})
        #manipulate data from Denton635
        for index, row in Denton635DataSmall.iterrows():
            #Shortens chars from substrate used
            sub = shortenStr(row['Substrate'],20)
            #handles "other" film, if nothing is entered, it will be marked as unknown
            Denton635DataSmall.at[index, 'Substrate'] = combineCells(sub, row['Other Substrate'])

            #Normalize Pressure around -6
            powerFactor = shortenStr(row['Base Pressure Unit'], 25)
            if powerFactor != 'Unknown' and powerFactor != '':
                Denton635DataSmall['Base Pressure'] = Denton635DataSmall['Base Pressure'].astype(float)
                Denton635DataSmall.at[index, 'Base Pressure'] = row['Base Pressure'] * 10**(int(powerFactor) +6)

            #Shortens chars from material targets
            mat1 = shortenStr(row['Material 1 Target'], 18)
            Denton635DataSmall.at[index, 'Material 1 Target'] = combineCells(mat1, row['Other Material 1 Target'])
            mat2 = shortenStr(row['Material 2 Target'], 18)
            Denton635DataSmall.at[index, 'Material 2 Target'] = combineCells(mat2, row['Other Material 2 Target'])
            mat3 = shortenStr(row['Material 3 Target'], 18)
            Denton635DataSmall.at[index, 'Material 3 Target'] = combineCells(mat3, row['Other Material 3 Target'])
            mat4 = shortenStr(row['Material 4 Target'], 18)
            Denton635DataSmall.at[index, 'Material 4 Target'] = combineCells(mat4, row['Other Material 4 Target'])

            #Normalize Thickness on nm
            if row['Thickness Unit'] == 'DENTON635_ThickUnit_Ang':
                Denton635DataSmall.at[index, 'Total Thickness'] = int(row['Total Thickness']) / 10

            #Shorten Chars from Power Supply
            power1 = shortenStr(row['Material 1 Power Supply'], 27)
            Denton635DataSmall.at[index, 'Material 1 Power Supply'] = power1
            power2 = shortenStr(row['Material 2 Power Supply'], 27)
            Denton635DataSmall.at[index, 'Material 2 Power Supply'] = power2
            power3 = shortenStr(row['Material 3 Power Supply'], 27)
            Denton635DataSmall.at[index, 'Material 3 Power Supply'] = power3
            power4 = shortenStr(row['Material 4 Power Supply'], 27)
            Denton635DataSmall.at[index, 'Material 4 Power Supply'] = power4

        #remove unneeded columns and save
        Denton635DataSmall.drop(columns=['Other Substrate', 'Base Pressure Unit', 'Other Material 1 Target','Other Material 2 Target',
                                         'Other Material 3 Target','Other Material 4 Target'], inplace=True)
        Denton635DataSmall.to_csv(os.path.join(DATA_DIR, 'small_Denton635_DataCollection.csv'))

def saveDenton18():
    print('Saving Denton18')
    ensureExists('Denton18_DataCollection.csv')
    Denton18Data = retrieveData('Denton18')
    if changedData('Denton18_DataCollection.csv', Denton18Data):
        Denton18Data.to_csv(os.path.join(DATA_DIR, 'Denton18_DataCollection.csv'))
        columns_to_keep = ['submission_id','submitter_name','form_data.DENTON18_Substrate','form_data.DENTON18_SubstrateOther','form_data.DENTON18_TgtChng','form_data.DENTON18_NoRuns',
                           'form_data.DENTON18_CryoTemp','form_data.DENTON18_BasePressVal','form_data.DENTON18_BasePressUnit',
                           'form_data.DENTON18_Mat1_Target','form_data.DENTON18_Mat1_OthTarget','form_data.DENTON18_Mat1_PowerSupply','form_data.DENTON18_Mat1_SputPower','form_data.DENTON18_Mat1_PreSputTime',
                           'form_data.DENTON18_Mat1_SputTime','form_data.DENTON18_Mat1_ArSputPress','form_data.DENTON18_Mat1_ArFlow','form_data.DENTON18_Mat1_O2Flow',
                           'form_data.DENTON18_Mat2_Target','form_data.DENTON18_Mat2_OthTarget','form_data.DENTON18_Mat2_SputPower','form_data.DENTON18_Mat2_PreSputTime',
                           'form_data.DENTON18_Mat2_SputTime','form_data.DENTON18_Mat2_ArSputPress','form_data.DENTON18_Mat2_ArFlow','form_data.DENTON18_Mat2_O2Flow',
                           'form_data.DENTON18_Mat3_Target','form_data.DENTON18_Mat3_OthTarget','form_data.DENTON18_Mat3_SputPower','form_data.DENTON18_Mat3_PreSputTime',
                            'form_data.DENTON18_Mat3_SputTime','form_data.DENTON18_Mat3_ArSputPress','form_data.DENTON18_Mat3_ArFlow','form_data.DENTON18_Mat3_O2Flow',
                            'form_data.DENTON18_ThickUnit','form_data.DENTON18_Thick1','form_data.DENTON18_Thick2','form_data.DENTON18_Thick3','form_data.DENTON18_Thick4','form_data.DENTON18_Thick5',
                            'form_data.DENTON18_FilmStress','form_data.DENTON18_SheetRho1','form_data.DENTON18_SheetRho2','form_data.DENTON18_SheetRho3','form_data.DENTON18_SheetRho4','form_data.DENTON18_SheetRho5']
        Denton18DataSmall = Denton18Data[columns_to_keep]
        Denton18DataSmall = Denton18DataSmall.rename(columns={'form_data.DENTON18_Substrate': 'Substrate', 'form_data.DENTON18_SubstrateOther': 'Other Substrate', 'form_data.DENTON18_TgtChng': 'Target Change',
                                                            'form_data.DENTON18_NoRuns': 'Number of Runs', 'form_data.DENTON18_CryoTemp': 'Cryo Temp', 'form_data.DENTON18_BasePressVal': 'Base Pressure','form_data.DENTON18_BasePressUnit': 'Base Pressure Unit',
                                                            'form_data.DENTON18_Mat1_Target': 'Material 1 Target', 'form_data.DENTON18_Mat1_OthTarget': 'Other Material 1 Target','form_data.DENTON18_Mat1_PowerSupply': 'Material 1 Power Supply',
                                                            'form_data.DENTON18_Mat1_SputPower': 'Material 1 Sputter Power', 'form_data.DENTON18_Mat1_PreSputTime': 'Material 1 Pre-Sputter Time','form_data.DENTON18_Mat1_SputTime': 'Material 1 Sputter Time',
                                                            'form_data.DENTON18_Mat1_ArSputPress': 'Material 1 Argon Sputter Pressure', 'form_data.DENTON18_Mat1_ArFlow': 'Material 1 Argon Flow','form_data.DENTON18_Mat1_O2Flow': 'Material 1 Oxygen Flow',
                                                            'form_data.DENTON18_Mat2_Target': 'Material 2 Target', 'form_data.DENTON18_Mat2_OthTarget': 'Other Material 2 Target',
                                                            'form_data.DENTON18_Mat2_SputPower': 'Material 2 Sputter Power', 'form_data.DENTON18_Mat2_PreSputTime': 'Material 2 Pre-Sputter Time','form_data.DENTON18_Mat2_SputTime': 'Material 2 Sputter Time',
                                                            'form_data.DENTON18_Mat2_ArSputPress': 'Material 2 Argon Sputter Pressure', 'form_data.DENTON18_Mat2_ArFlow': 'Material 2 Argon Flow','form_data.DENTON18_Mat2_O2Flow': 'Material 2 Oxygen Flow',
                                                            'form_data.DENTON18_Mat3_Target': 'Material 3 Target', 'form_data.DENTON18_Mat3_OthTarget': 'Other Material 3 Target',
                                                            'form_data.DENTON18_Mat3_SputPower': 'Material 3 Sputter Power', 'form_data.DENTON18_Mat3_PreSputTime': 'Material 3 Pre-Sputter Time','form_data.DENTON18_Mat3_SputTime': 'Material 3 Sputter Time',
                                                            'form_data.DENTON18_Mat3_ArSputPress': 'Material 3 Argon Sputter Pressure', 'form_data.DENTON18_Mat3_ArFlow': 'Material 3 Argon Flow','form_data.DENTON18_Mat3_O2Flow': 'Material 3 Oxygen Flow',
                                                            'form_data.DENTON18_ThickUnit': 'Thickness Unit', 'form_data.DENTON18_Thick1': 'Thickness 1','form_data.DENTON18_Thick2': 'Thickness 2', 'form_data.DENTON18_Thick3': 'Thickness 3',
                                                            'form_data.DENTON18_Thick4': 'Thickness 4', 'form_data.DENTON18_Thick5': 'Thickness 5','form_data.DENTON18_FilmStress': 'Film Stress', 'form_data.DENTON18_SheetRho1': 'Sheet Resistivity 1',
                                                            'form_data.DENTON18_SheetRho2': 'Sheet Resistivity 2','form_data.DENTON18_SheetRho3': 'Sheet Resistivity 3', 'form_data.DENTON18_SheetRho4': 'Sheet Resistivity 4', 'form_data.DENTON18_SheetRho5': 'Sheet Resistivity 5'})
        #manipulate data from Denton18
        for index, row in Denton18DataSmall.iterrows():
            #Shortens chars from substrate used
            sub = shortenStr(row['Substrate'],19)
            #handles "other" film, if nothing is entered, it will be marked as unknown
            Denton18DataSmall.at[index, 'Substrate'] = combineCells(sub, row['Other Substrate'])

            #remove characters from target change
            target = shortenStr(row['Target Change'], 19)
            Denton18DataSmall.at[index, 'Target Change'] = target

            #Normalize Pressure around -6
            powerFactor = shortenStr(row['Base Pressure Unit'], 17)
            if powerFactor != 'Unknown' and powerFactor != '':
                #converts column if int
                Denton18DataSmall['Base Pressure'] = Denton18DataSmall['Base Pressure'].astype(float)
                Denton18DataSmall.at[index, 'Base Pressure'] = row['Base Pressure'] * 10**(int(powerFactor) +6)

            #Shortens chars from material targets
            mat1 = shortenStr(row['Material 1 Target'], 17)
            Denton18DataSmall.at[index, 'Material 1 Target'] = combineCells(mat1, row['Other Material 1 Target'])
            mat2 = shortenStr(row['Material 2 Target'], 17)
            Denton18DataSmall.at[index, 'Material 2 Target'] = combineCells(mat2, row['Other Material 2 Target'])
            mat3 = shortenStr(row['Material 3 Target'], 17)
            Denton18DataSmall.at[index, 'Material 3 Target'] = combineCells(mat3, row['Other Material 3 Target'])

            #Shorten Chars from Power Supply
            power1 = shortenStr(row['Material 1 Power Supply'], 26)
            Denton18DataSmall.at[index, 'Material 1 Power Supply'] = power1





            #Normalize Thickness on nm
            if row['Thickness Unit'] == 'DENTON18_ThickUnit_Ang':
                Denton18DataSmall.at[index, 'Thickness 1'] = (row['Thickness 1']) / 10
                #occasionally, the thickness is not a number. If it isn't, it will be marked as NaN
                #TODO VERIFY
                t1 = pd.to_numeric(row['Thickness 1'], errors='coerce')
                t2 = pd.to_numeric(row['Thickness 2'], errors='coerce')
                t3 = pd.to_numeric(row['Thickness 3'], errors='coerce')
                t4 = pd.to_numeric(row['Thickness 4'], errors='coerce')
                t5 = pd.to_numeric(row['Thickness 5'], errors='coerce')
                Denton18DataSmall.at[index, 'Thickness 1'] = t1 / 10 if pd.notna(t1) else np.nan
                Denton18DataSmall.at[index, 'Thickness 2'] = t2 / 10 if pd.notna(t2) else np.nan
                Denton18DataSmall.at[index, 'Thickness 3'] = t3 / 10 if pd.notna(t3) else np.nan
                Denton18DataSmall.at[index, 'Thickness 4'] = t4 / 10 if pd.notna(t4) else np.nan
                Denton18DataSmall.at[index, 'Thickness 5'] = t5 / 10 if pd.notna(t5) else np.nan



        #remove unneeded columns and save
        Denton18DataSmall.drop(columns=['Other Substrate', 'Base Pressure Unit', 'Other Material 1 Target','Other Material 2 Target','Other Material 3 Target','Thickness Unit'], inplace=True)
        Denton18DataSmall.to_csv(os.path.join(DATA_DIR, 'small_Denton18_DataCollection.csv'))


def saveTMV():
    print('Saving TMV')
    ensureExists('TMV_DataCollection.csv')
    TMVData = retrieveData('TMV')
    if changedData('TMV_DataCollection.csv', TMVData):
        TMVData.to_csv(os.path.join(DATA_DIR, 'TMV_DataCollection.csv'))
        columns_to_keep = ['submission_id','submitter_name','form_data.TMV_Substrate','form_data.TMV_OthSubstrate','form_data.TMV_SampleHolders','form_data.TMV_DupRuns',
                           'form_data.TMV_ChamberPumpTime','form_data.TMV_BasePressVal','form_data.TMV_BasePressUnit',
                           'form_data.TMV_S1Chuck','form_data.TMV_S1Material','form_data.TMV_S1PowerSupply','form_data.TMV_S1PreSputTime','form_data.TMV_S1PreSputPower',
                           'form_data.TMV_S1SputTime','form_data.TMV_S1SputPower','form_data.TMV_S1SputDepPress', 'form_data.TMV_S1ArgonFlow','form_data.TMV_S1O2Flow',
                           'form_data.TMV_S2Chuck','form_data.TMV_S2Material','form_data.TMV_S2PowerSupply','form_data.TMV_S2PreSputTime','form_data.TMV_S2PreSputPower',
                           'form_data.TMV_S2SputTime','form_data.TMV_S2SputPower','form_data.TMV_S2SputDepPress', 'form_data.TMV_S2ArgonFlow','form_data.TMV_S2O2Flow',
                           'form_data.TMV_S3Chuck','form_data.TMV_S3Material','form_data.TMV_S3PowerSupply','form_data.TMV_S3PreSputTime',
                           'form_data.TMV_S3SputTime','form_data.TMV_S3SputPower','form_data.TMV_S3SputDepPress', 'form_data.TMV_S3ArgonFlow','form_data.TMV_S3O2Flow',
                           'form_data.TMV_S4Material','form_data.TMV_S4PowerSupply','form_data.TMV_S4PreSputTime','form_data.TMV_S4SputTime',
                           'form_data.TMV_ThickUnit','form_data.TMV_Thick']

        TMVDataSmall = TMVData[columns_to_keep]
        TMVDataSmall = TMVDataSmall.rename(columns={'form_data.TMV_Substrate': 'Substrate', 'form_data.TMV_OthSubstrate': 'Other Substrate',
                                                    'form_data.TMV_SampleHolders': 'Sample Holders','form_data.TMV_DupRuns': 'Duplicate Runs',
                                                    'form_data.TMV_ChamberPumpTime': 'Chamber Pump Time', 'form_data.TMV_BasePressVal': 'Base Pressure',
                                                    'form_data.TMV_BasePressUnit': 'Base Pressure Unit',
                                                    'form_data.TMV_S1Chuck': 'Sample 1 Chuck', 'form_data.TMV_S1Material': 'Sample 1 Material','form_data.TMV_S1PowerSupply': 'Sample 1 Power Supply',
                                                    'form_data.TMV_S1PreSputTime': 'Sample 1 Pre-Sputter Time', 'form_data.TMV_S1PreSputPower': 'Sample 1 Pre-Sputter Power',
                                                    'form_data.TMV_S1SputTime': 'Sample 1 Sputter Time', 'form_data.TMV_S1SputPower': 'Sample 1 Sputter Power',
                                                    'form_data.TMV_S1SputDepPress': 'Sample 1 Sputter Deposition Pressure','form_data.TMV_S1ArgonFlow': 'Sample 1 Argon Flow', 'form_data.TMV_S1O2Flow': 'Sample 1 Oxygen Flow',
                                                    'form_data.TMV_S2Chuck': 'Sample 2 Chuck','form_data.TMV_S2Material': 'Sample 2 Material', 'form_data.TMV_S2PowerSupply': 'Sample 2 Power Supply',
                                                    'form_data.TMV_S2PreSputTime': 'Sample 2 Pre-Sputter Time','form_data.TMV_S2PreSputPower': 'Sample 2 Pre-Sputter Power',
                                                    'form_data.TMV_S2SputTime': 'Sample 2 Sputter Time', 'form_data.TMV_S2SputPower': 'Sample 2 Sputter Power',
                                                    'form_data.TMV_S2SputDepPress': 'Sample 2 Sputter Deposition Pressure', 'form_data.TMV_S2ArgonFlow': 'Sample 2 Argon Flow', 'form_data.TMV_S2O2Flow': 'Sample 2 Oxygen Flow',
                                                    'form_data.TMV_S3Chuck': 'Sample 3 Chuck', 'form_data.TMV_S3Material': 'Sample 3 Material', 'form_data.TMV_S3PowerSupply': 'Sample 3 Power Supply',
                                                    'form_data.TMV_S3PreSputTime': 'Sample 3 Pre-Sputter Time', 'form_data.TMV_S3PreSputPower': 'Sample 3 Pre-Sputter Power',
                                                    'form_data.TMV_S3SputTime': 'Sample 3 Sputter Time', 'form_data.TMV_S3SputPower': 'Sample 3 Sputter Power',
                                                    'form_data.TMV_S3SputDepPress': 'Sample 3 Sputter Deposition Pressure', 'form_data.TMV_S3ArgonFlow': 'Sample 3 Argon Flow','form_data.TMV_S3O2Flow': 'Sample 3 Oxygen Flow',
                                                    'form_data.TMV_S4Chuck': 'Sample 4 Chuck', 'form_data.TMV_S4Material': 'Sample 4 Material','form_data.TMV_S4PowerSupply': 'Sample 4 Power Supply',
                                                    'form_data.TMV_S4PreSputTime': 'Sample 4 Pre-Sputter Time', 'form_data.TMV_S4PreSputPower': 'Sample 4 Pre-Sputter Power',
                                                    'form_data.TMV_S4SputTime': 'Sample 4 Sputter Time', 'form_data.TMV_S4SputPower': 'Sample 4 Sputter Power',
                                                    'form_data.TMV_S4SputDepPress': 'Sample 4 Sputter Deposition Pressure','form_data.TMV_S4ArgonFlow': 'Sample 4 Argon Flow', 'form_data.TMV_S4O2Flow': 'Sample 4 Oxygen Flow',
                                                    'form_data.TMV_ThickUnit': 'Thickness Unit', 'form_data.TMV_Thick': 'Thickness'})

        #manipulate data from TMV

        for index, row in TMVDataSmall.iterrows():
            #shortens chars from substrate used
            sub = shortenStr(row['Substrate'], 14)
            #handles "other" film, if nothing is entered, it will be marked as unknown
            TMVDataSmall.at[index, 'Substrate'] = combineCells(sub, row['Other Substrate'])

            #normalize Pressure around -6
            powerFactor = shortenStr(row['Base Pressure Unit'], 19)
            if powerFactor != 'Unknown' and powerFactor != '':
                #converts pressure column to a float, it automatically resolves as an int for some reason
                TMVDataSmall['Base Pressure'] = TMVDataSmall['Base Pressure'].astype(float)
                TMVDataSmall['Sample 1 Sputter Deposition Pressure'] = TMVDataSmall['Sample 1 Sputter Deposition Pressure'].astype(float)
                TMVDataSmall['Sample 2 Sputter Deposition Pressure'] = TMVDataSmall['Sample 2 Sputter Deposition Pressure'].astype(float)
                TMVDataSmall['Sample 3 Sputter Deposition Pressure'] = TMVDataSmall['Sample 3 Sputter Deposition Pressure'].astype(float)

                TMVDataSmall.at[index, 'Base Pressure'] = row['Base Pressure'] * 10**(int(powerFactor) +6)
                TMVDataSmall.at[index, 'Sample 1 Sputter Deposition Pressure'] = row['Sample 1 Sputter Deposition Pressure'] * 10**(int(powerFactor) +6)
                TMVDataSmall.at[index, 'Sample 2 Sputter Deposition Pressure'] = row['Sample 2 Sputter Deposition Pressure'] * 10**(int(powerFactor) +6)
                TMVDataSmall.at[index, 'Sample 3 Sputter Deposition Pressure'] = row['Sample 3 Sputter Deposition Pressure'] * 10**(int(powerFactor) +6)

            #Shortens chars from material targets
            mat1 = shortenStr(row['Sample 1 Material'], 15)
            TMVDataSmall.at[index, 'Sample 1 Material'] = mat1
            mat2 = shortenStr(row['Sample 2 Material'], 15)
            TMVDataSmall.at[index, 'Sample 2 Material'] = mat2
            mat3 = shortenStr(row['Sample 3 Material'], 15)
            TMVDataSmall.at[index, 'Sample 3 Material'] = mat3
            mat4 = shortenStr(row['Sample 4 Material'], 15)
            TMVDataSmall.at[index, 'Sample 4 Material'] = mat4

            #Shorten Chars from Power Supply
            power1 = shortenStr(row['Sample 1 Power Supply'], 19)
            TMVDataSmall.at[index, 'Sample 1 Power Supply'] = power1
            power2 = shortenStr(row['Sample 2 Power Supply'], 19)
            TMVDataSmall.at[index, 'Sample 2 Power Supply'] = power2
            power3 = shortenStr(row['Sample 3 Power Supply'], 19)
            TMVDataSmall.at[index, 'Sample 3 Power Supply'] = power3
            power4 = shortenStr(row['Sample 4 Power Supply'], 19)
            TMVDataSmall.at[index, 'Sample 4 Power Supply'] = power4

            #Normalize Thickness on nm
            if row['Thickness Unit'] == 'TMV_ThickUnit_Ang':
                TMVDataSmall.at[index, 'Thickness'] = int(row['Thickness']) / 10

        #remove unneeded columns and save
        TMVDataSmall.drop(columns=['Other Substrate', 'Base Pressure Unit'], inplace=True)
        TMVDataSmall.to_csv(os.path.join(DATA_DIR, 'small_TMV_DataCollection.csv'))



def saveDRIE():
    print('Saving DRIE')
    ensureExists('DRIE_DataCollection.csv')
    DRIEData = retrieveData('DRIE')
    if changedData('DRIE_DataCollection.csv', DRIEData):
        DRIEData.to_csv(os.path.join(DATA_DIR, 'DRIE_DataCollection.csv'))

        columns_to_keep = ['submission_id','submitter_name','form_data.OXFORD100_Recipe','form_data.OXFORD100_SubstrateSize', 'form_data.OXFORD100_AreaEtched','form_data.OXFORD100_EtchPress','form_data.OXFORD100_HeBackPress',
                           'form_data.OXFORD100_CF4','form_data.OXFORD100_SF6','form_data.OXFORD100_DRIEDepTime','form_data.OXFORD100_DRIEEtchTime','form_data.OXFORD100_TotalEtchTime','form_data.OXFORD100_ICPForward',
                           'form_data.OXFORD100_RFCCP','form_data.OXFORD100_RFBias','form_data.OXFORD100_ChuckTemp','form_data.OXFORD100_ContPlasma','form_data.OXFORD100_EtchDepth1','form_data.OXFORD100_EtchDepth2',
                            'form_data.OXFORD100_EtchDepth3','form_data.OXFORD100_EtchDepth4','form_data.OXFORD100_EtchDepth5','form_data.OXFORD100_C4F8','form_data.OXFORD100_O2','form_data.OXFORD100_DRIECycles',
                            'form_data.OXFORD100_Helium','form_data.OXFORD100_PRPreThick','form_data.OXFORD100_PRPostThick','form_data.OXFORD100_N2','form_data.OXFORD100_Argon','form_data.OXFORD100_AspectRatio']
        DRIEDataSmall = DRIEData[columns_to_keep]
        DRIEDataSmall = DRIEDataSmall.rename(columns={'form_data.OXFORD100_Recipe': 'Recipe', 'form_data.OXFORD100_SubstrateSize': 'Substrate Size', 'form_data.OXFORD100_AreaEtched': 'Area Etched',
                                                      'form_data.OXFORD100_EtchPress': 'Etch Pressure', 'form_data.OXFORD100_HeBackPress': 'Helium Back Pressure', 'form_data.OXFORD100_CF4': 'CF4 Flow',
                                                      'form_data.OXFORD100_SF6': 'SF6 Flow', 'form_data.OXFORD100_DRIEDepTime': 'DRIE Deposition Time', 'form_data.OXFORD100_DRIEEtchTime': 'DRIE Etch Time',
                                                      'form_data.OXFORD100_TotalEtchTime': 'Total Etch Time', 'form_data.OXFORD100_ICPForward': 'ICP Forward Power', 'form_data.OXFORD100_RFCCP': 'RFC Bias',
                                                      'form_data.OXFORD100_RFBias': 'RF Bias', 'form_data.OXFORD100_ChuckTemp': 'Chuck Temp', 'form_data.OXFORD100_ContPlasma': 'Continuous Plasma',
                                                      'form_data.OXFORD100_EtchDepth1': 'Etch Depth 1', 'form_data.OXFORD100_EtchDepth2': 'Etch Depth 2', 'form_data.OXFORD100_EtchDepth3': 'Etch Depth 3',
                                                      'form_data.OXFORD100_EtchDepth4': 'Etch Depth 4', 'form_data.OXFORD100_EtchDepth5': 'Etch Depth 5', 'form_data.OXFORD100_C4F8': 'C4F8 Flow',
                                                      'form_data.OXFORD100_O2': 'O2 Flow', 'form_data.OXFORD100_DRIECycles': 'DRIE Cycles', 'form_data.OXFORD100_Helium': 'Helium Flow',
                                                      'form_data.OXFORD100_PRPreThick': 'PR Pre-Thick', 'form_data.OXFORD100_PRPostThick': 'PR Post-Thick', 'form_data.OXFORD100_N2': 'N2 Flow',
                                                      'form_data.OXFORD100_Argon': 'Argon Flow', 'form_data.OXFORD100_AspectRatio': 'Aspect Ratio'})

        #manipulate data from DRIE
        for index, row in DRIEDataSmall.iterrows():
            #shortens chars from substrate size and plasma
            sub = shortenStr(row['Substrate Size'], 24)
            DRIEDataSmall.at[index, 'Substrate Size'] = sub
            plasma = shortenStr(row['Continuous Plasma'], 20)
            DRIEDataSmall.at[index, 'Continuous Plasma'] = plasma

        DRIEDataSmall.to_csv(os.path.join(DATA_DIR, 'small_DRIE_DataCollection.csv'))

def saveIsotropic():
    print('Saving Isotropic')
    ensureExists('Isotropic_DataCollection.csv')
    IsotropicData = retrieveData('Isotropic')
    if changedData('Isotropic_DataCollection.csv', IsotropicData):
        IsotropicData.to_csv(os.path.join(DATA_DIR, 'Isotropic_DataCollection.csv'))
        columns_to_keep = ['submission_id', 'submitter_name', 'form_data.XACTIX_NoCycles']
        IsotropicDataSmall = IsotropicData[columns_to_keep]
        IsotropicDataSmall = IsotropicDataSmall.rename(columns={'form_data.XACTIX_NoCycles': 'Number of Cycles'})

        #nothing needs to be manipulated from Isotropic
        IsotropicDataSmall.to_csv(os.path.join(DATA_DIR, 'small_Isotropic_DataCollection.csv'))

def savePlasmalab():
    print('Saving Plasmalab')
    ensureExists('Plasmalab_DataCollection.csv')
    PlasmalabData = retrieveData('PlasmaLab')
    if changedData('Plasmalab_DataCollection.csv', PlasmalabData):
        PlasmalabData.to_csv(os.path.join(DATA_DIR, 'Plasmalab_DataCollection.csv'))

        columns_to_keep = ['submission_id','submitter_name','form_data.OX80RIE_Recipe','form_data.OX80RIE_MatrlEtched','form_data.OX80RIE_BasePress', 'form_data.OX80RIE_Argon', 'form_data.OX80RIE_Oxygen',
                           'form_data.OX80RIE_EtchPower', 'form_data.OX80RIE_EtchPress', 'form_data.OX80RIE_EtchTime', 'form_data.OX80RIE_EtchDepth1', 'form_data.OX80RIE_EtchDepth2',
                           'form_data.OX80RIE_EtchDepth3', 'form_data.OX80RIE_C4F8', 'form_data.OX80RIE_SF6']
        PlasmalabDataSmall = PlasmalabData[columns_to_keep]
        PlasmalabDataSmall = PlasmalabDataSmall.rename(columns={'form_data.OX80RIE_Recipe': 'Recipe', 'form_data.OX80RIE_MatrlEtched': 'Material Etched', 'form_data.OX80RIE_BasePress': 'Base Pressure',
                                                              'form_data.OX80RIE_Argon': 'Argon Flow', 'form_data.OX80RIE_Oxygen': 'Oxygen Flow', 'form_data.OX80RIE_EtchPower': 'Etch Power',
                                                              'form_data.OX80RIE_EtchPress': 'Etch Pressure', 'form_data.OX80RIE_EtchTime': 'Etch Time', 'form_data.OX80RIE_EtchDepth1': 'Etch Depth 1',
                                                              'form_data.OX80RIE_EtchDepth2': 'Etch Depth 2', 'form_data.OX80RIE_EtchDepth3': 'Etch Depth 3', 'form_data.OX80RIE_C4F8': 'C4F8 Flow',
                                                              'form_data.OX80RIE_SF6': 'SF6 Flow'})

        #dont need to manipulate data from PlasmaLab
        PlasmalabDataSmall.to_csv(os.path.join(DATA_DIR, 'small_Plasmalab_DataCollection.csv'))

def savePlasmaTherm():
    print('Saving PlasmaTherm')
    ensureExists('PlasmaTherm_DataCollection.csv')
    PlasmaThermData = retrieveData('PlasmaTherm')
    if changedData('PlasmaTherm_DataCollection.csv', PlasmaThermData):
        PlasmaThermData.to_csv(os.path.join(DATA_DIR, 'PlasmaTherm_DataCollection.csv'))

        columns_to_keep = ['submission_id','submitter_name','form_data.PTHERMMETAL_MatrlEtched','form_data.PTHERMMETAL_Handle','form_data.PTHERMMETAL_Batch','form_data.PTHERMMETAL_Duplicate']
        PlasmaThermDataSmall = PlasmaThermData[columns_to_keep]

        PlasmaThermDataSmall = PlasmaThermDataSmall.rename(columns={'form_data.PTHERMMETAL_MatrlEtched': 'Material Etched', 'form_data.PTHERMMETAL_Handle': 'Handle',
                                                                    'form_data.PTHERMMETAL_Batch': 'Batch', 'form_data.PTHERMMETAL_Duplicate': 'Duplicate'})

        #just need to shorten chars from handle
        for index, row in PlasmaThermDataSmall.iterrows():
            handle = shortenStr(row['Handle'], 19)
            PlasmaThermDataSmall.at[index, 'Handle'] = handle

        PlasmaThermDataSmall.to_csv(os.path.join(DATA_DIR, 'small_PlasmaTherm_DataCollection.csv'))

def saveTechnics():
    print('Saving Technics')
    ensureExists('Technics_DataCollection.csv')
    TechnicsData = retrieveData('Technics')
    if changedData('Technics_DataCollection.csv', TechnicsData):
        TechnicsData.to_csv(os.path.join(DATA_DIR, 'Technics_DataCollection.csv'))

        columns_to_keep = ['submission_id','submitter_name','form_data.TECHNICS_GenComment']
        TechnicsDataSmall = TechnicsData[columns_to_keep]
        TechnicsDataSmall = TechnicsDataSmall.rename(columns={'form_data.TECHNICS_GenComment': 'Recipe'})

        #nothing needs to be manipulated from Technics
        TechnicsDataSmall.to_csv(os.path.join(DATA_DIR, 'small_Technics_DataCollection.csv'))


def saveCleanOx():
    print('Saving CleanOx')
    ensureExists('CleanOx_DataCollection.csv')
    CleanOxData = retrieveData('CleanOx')
    if changedData('CleanOx_DataCollection.csv', CleanOxData):
        CleanOxData.to_csv(os.path.join(DATA_DIR, 'CleanOx_DataCollection.csv'))

        columns_to_keep = ['submission_id','submitter_name','form_data.PTEMPCLEAN_RecipeType','form_data.PTEMPCLEAN_RecipeTemp','form_data.PTEMPCLEAN_OxTime','form_data.PTEMPCLEAN_TargetThick',
                           'form_data.PTEMPCLEAN_NoSamples','form_data.PTEMPCLEAN_MonSlot','form_data.PTEMPCLEAN_MeasTool','form_data.PTEMPCLEAN_Thick1', 'form_data.PTEMPCLEAN_Thick2',
                           'form_data.PTEMPCLEAN_Thick3','form_data.PTEMPCLEAN_Thick4','form_data.PTEMPCLEAN_Thick5']
        CleanOxDataSmall = CleanOxData[columns_to_keep]
        CleanOxDataSmall = CleanOxDataSmall.rename(columns={'form_data.PTEMPCLEAN_RecipeType': 'Recipe Type', 'form_data.PTEMPCLEAN_RecipeTemp': 'Recipe Temp', 'form_data.PTEMPCLEAN_OxTime': 'Ox Time',
                                                            'form_data.PTEMPCLEAN_TargetThick': 'Target Thickness', 'form_data.PTEMPCLEAN_NoSamples': 'Number of Samples',
                                                            'form_data.PTEMPCLEAN_MonSlot': 'Mon Slot', 'form_data.PTEMPCLEAN_MeasTool': 'Measure Tool', 'form_data.PTEMPCLEAN_Thick1': 'Thickness 1',
                                                            'form_data.PTEMPCLEAN_Thick2': 'Thickness 2', 'form_data.PTEMPCLEAN_Thick3': 'Thickness 3', 'form_data.PTEMPCLEAN_Thick4': 'Thickness 4',
                                                            'form_data.PTEMPCLEAN_Thick5': 'Thickness 5'})

        #manipulate data from CleanOx
        for index, row in CleanOxDataSmall.iterrows():
            #shortens chars from recipe type
            recipe = shortenStr(row['Recipe Type'], 15)
            CleanOxDataSmall.at[index, 'Recipe Type'] = recipe

            #shorten chars in temp
            temp = shortenStr(row['Recipe Temp'], 22)
            CleanOxDataSmall.at[index, 'Recipe Temp'] = temp

            #shorten chars from meas tool
            meas = shortenStr(row['Measure Tool'], 20)
            CleanOxDataSmall.at[index, 'Measure Tool'] = meas

        CleanOxDataSmall.to_csv(os.path.join(DATA_DIR, 'small_CleanOx_DataCollection.csv'))

def saveDopedOx():
    print('Saving DopedOx')
    ensureExists('DopedOx_DataCollection.csv')
    DopedOxData = retrieveData('DopedOx')
    if changedData('DopedOx_DataCollection.csv', DopedOxData):
        DopedOxData.to_csv(os.path.join(DATA_DIR,'DopedOx_DataCollection.csv'))

        columns_to_keep = ['submission_id','submitter_name', 'form_data.PTEMPDOPED_RecipeType','form_data.PTEMPDOPED_RecipeTemp','form_data.PTEMPDOPED_VarTime','form_data.PTEMPDOPED_TargetThick',
                           'form_data.PTEMPDOPED_NoSamples','form_data.PTEMPDOPED_MonSlot','form_data.PTEMPDOPED_OxMeasTool','form_data.PTEMPDOPED_Thick1', 'form_data.PTEMPDOPED_Thick2',
                            'form_data.PTEMPDOPED_Thick3','form_data.PTEMPDOPED_Thick4','form_data.PTEMPDOPED_Thick5', 'form_data.PTEMPDOPED_ShtRho1','form_data.PTEMPDOPED_ShtRho2',
                            'form_data.PTEMPDOPED_ShtRho3','form_data.PTEMPDOPED_ShtRho4','form_data.PTEMPDOPED_ShtRho5']
        DopedOxDataSmall = DopedOxData[columns_to_keep]

        DopedOxDataSmall = DopedOxDataSmall.rename(columns={'form_data.PTEMPDOPED_RecipeType': 'Recipe Type', 'form_data.PTEMPDOPED_RecipeTemp': 'Recipe Temp', 'form_data.PTEMPDOPED_VarTime': 'Var Time',
                                                            'form_data.PTEMPDOPED_TargetThick': 'Target Thickness', 'form_data.PTEMPDOPED_NoSamples': 'Number of Samples',
                                                            'form_data.PTEMPDOPED_MonSlot': 'Mon Slot', 'form_data.PTEMPDOPED_OxMeasTool': 'Ox Measure Tool', 'form_data.PTEMPDOPED_Thick1': 'Thickness 1',
                                                            'form_data.PTEMPDOPED_Thick2': 'Thickness 2', 'form_data.PTEMPDOPED_Thick3': 'Thickness 3', 'form_data.PTEMPDOPED_Thick4': 'Thickness 4',
                                                            'form_data.PTEMPDOPED_Thick5': 'Thickness 5', 'form_data.PTEMPDOPED_ShtRho1': 'Sheet Resistivity 1', 'form_data.PTEMPDOPED_ShtRho2': 'Sheet Resistivity 2',
                                                            'form_data.PTEMPDOPED_ShtRho3': 'Sheet Resistivity 3', 'form_data.PTEMPDOPED_ShtRho4': 'Sheet Resistivity 4', 'form_data.PTEMPDOPED_ShtRho5': 'Sheet Resistivity 5'})

        #manipulate data from DopedOx
        for index, row in DopedOxDataSmall.iterrows():

            #shortens chars from recipe type
            recipe = shortenStr(row['Recipe Type'], 22)
            DopedOxDataSmall.at[index, 'Recipe Type'] = recipe

            #shorten chars in temp
            temp = shortenStr(row['Recipe Temp'], 22)
            DopedOxDataSmall.at[index, 'Recipe Temp'] = temp

            #shorten chars from meas tool
            meas = shortenStr(row['Ox Measure Tool'], 22)
            DopedOxDataSmall.at[index, 'Ox Measure Tool'] = meas

        DopedOxDataSmall.to_csv(os.path.join(DATA_DIR, 'small_DopedOx_DataCollection.csv'))

def saveLTO():
    print('Saving LTO')
    ensureExists('LTO_DataCollection.csv')
    LTOData = retrieveData('LTO')
    if changedData('LTO_DataCollection.csv', LTOData):
        LTOData.to_csv(os.path.join(DATA_DIR, 'LTO_DataCollection.csv'))

        columns_to_keep = ['submission_id','submitter_name','form_data.CTRLTO_Process','form_data.CTRLTO_DepTime','form_data.CTRLTO_TargetThick','form_data.CTRLTO_NoWfrs',
                           'form_data.CTRLTO_MonSlot','form_data.CTRLTO_MeasTool','form_data.CTRLTO_Thick1', 'form_data.CTRLTO_Thick2','form_data.CTRLTO_Thick3',
                           'form_data.CTRLTO_Thick4','form_data.CTRLTO_Thick5']
        LTODataSmall = LTOData[columns_to_keep]
        LTODataSmall = LTODataSmall.rename(columns={'form_data.CTRLTO_Process': 'Process', 'form_data.CTRLTO_DepTime': 'Deposition Time', 'form_data.CTRLTO_TargetThick': 'Target Thickness',
                                                    'form_data.CTRLTO_NoWfrs': 'Number of Wafers', 'form_data.CTRLTO_MonSlot': 'Mon Slot', 'form_data.CTRLTO_MeasTool': 'Measure Tool',
                                                    'form_data.CTRLTO_Thick1': 'Thickness 1', 'form_data.CTRLTO_Thick2': 'Thickness 2', 'form_data.CTRLTO_Thick3': 'Thickness 3',
                                                    'form_data.CTRLTO_Thick4': 'Thickness 4', 'form_data.CTRLTO_Thick5': 'Thickness 5'})
        #manipulate data from LTO
        for index, row in LTODataSmall.iterrows():
            #shortens chars from process
            process = shortenStr(row['Process'], 15)
            LTODataSmall.at[index, 'Process'] = process

            #shorten chars from meas tool
            meas = shortenStr(row['Measure Tool'], 16)
            LTODataSmall.at[index, 'Measure Tool'] = meas

        LTODataSmall.to_csv(os.path.join(DATA_DIR, 'small_LTO_DataCollection.csv'))

def saveNitride():
    print('Saving Nitride')
    ensureExists('Nitride_DataCollection.csv')
    NitrideData = retrieveData('Nitride')
    if changedData('Nitride_DataCollection.csv', NitrideData):
        NitrideData.to_csv(os.path.join(DATA_DIR, 'Nitride_DataCollection.csv'))

        #NEEED TO HAVE RUN WITH NONSTANDARD FORM DATA TODO TODO TODO
        columns_to_keep = ['submission_id','submitter_name','form_data.CTRNIT_Recipe','form_data.CTRNIT_NonStdRecipe','form_data.CTRNIT_DepTime',
                           'form_data.CTRNIT_TargetThick','form_data.CTRNIT_NoWafers','form_data.CTRNIT_MonSlot','form_data.CTRNIT_MeasTool',
                           'form_data.CTRNIT_Thick1','form_data.CTRNIT_Thick2','form_data.CTRNIT_Thick3','form_data.CTRNIT_Thick4','form_data.CTRNIT_Thick5']
        NitrideDataSmall = NitrideData[columns_to_keep]
        NitrideDataSmall = NitrideDataSmall.rename(columns={'form_data.CTRNIT_Recipe': 'Recipe', 'form_data.CTRNIT_NonStdRecipe': 'Non-Standard Recipe',
                                                            'form_data.CTRNIT_DepTime': 'Deposition Time','form_data.CTRNIT_TargetThick': 'Target Thickness',
                                                            'form_data.CTRNIT_NoWafers': 'Number of Wafers', 'form_data.CTRNIT_MonSlot': 'Mon Slot',
                                                            'form_data.CTRNIT_MeasTool': 'Measure Tool', 'form_data.CTRNIT_Thick1': 'Thickness 1',
                                                            'form_data.CTRNIT_Thick2': 'Thickness 2', 'form_data.CTRNIT_Thick3': 'Thickness 3',
                                                            'form_data.CTRNIT_Thick4': 'Thickness 4', 'form_data.CTRNIT_Thick5': 'Thickness 5'})

        #manipulate data from Nitride
        for index, row in NitrideDataSmall.iterrows():
            #shortens chars from recipe
            recipe = shortenStr(row['Recipe'], 14)
            NitrideDataSmall.at[index, 'Recipe'] = recipe

            #TODO TODO TODO HANDLE NONSTANDARD RECIPE

            #shorten chars from meas tool
            meas = shortenStr(row['Measure Tool'], 16)
            NitrideDataSmall.at[index, 'Measure Tool'] = meas

        #remove nonstandard recipe column
        NitrideDataSmall.drop(columns=['Non-Standard Recipe'], inplace=True)
        NitrideDataSmall.to_csv(os.path.join(DATA_DIR, 'small_Nitride_DataCollection.csv'))

def savePoly():
    print('Saving Poly')
    ensureExists('Poly_DataCollection.csv')
    PolyData = retrieveData('Poly')
    if changedData('Poly_DataCollection.csv', PolyData):
        PolyData.to_csv(os.path.join(DATA_DIR, 'Poly_DataCollection.csv'))

        columns_to_keep = ['submission_id','submitter_name','form_data.CTRPOLY_Recipe','form_data.CTRPOLY_NonStdRecipe','form_data.CTRPOLY_DepTime',
                           'form_data.CTRPOLY_TargetThick','form_data.CTRPOLY_NoWafers','form_data.CTRPOLY_MeasTool','form_data.CTRPOLY_MonSlot',
                           'form_data.CTRPOLY_Thick1','form_data.CTRPOLY_Thick2','form_data.CTRPOLY_Thick3','form_data.CTRPOLY_Thick4','form_data.CTRPOLY_Thick5']
        PolyDataSmall = PolyData[columns_to_keep]
        PolyDataSmall = PolyDataSmall.rename(columns={'form_data.CTRPOLY_Recipe': 'Recipe', 'form_data.CTRPOLY_NonStdRecipe': 'Non-Standard Recipe',
                                                      'form_data.CTRPOLY_DepTime': 'Deposition Time','form_data.CTRPOLY_TargetThick': 'Target Thickness',
                                                      'form_data.CTRPOLY_NoWafers': 'Number of Wafers', 'form_data.CTRPOLY_MeasTool': 'Measure Tool',
                                                      'form_data.CTRPOLY_MonSlot': 'Mon Slot', 'form_data.CTRPOLY_Thick1': 'Thickness 1',
                                                      'form_data.CTRPOLY_Thick2': 'Thickness 2', 'form_data.CTRPOLY_Thick3': 'Thickness 3',
                                                      'form_data.CTRPOLY_Thick4': 'Thickness 4', 'form_data.CTRPOLY_Thick5': 'Thickness 5'})

        #manipulate data from Poly
        for index, row in PolyDataSmall.iterrows():
            #shortens chars from recipe
            recipe = shortenStr(row['Recipe'], 15)
            PolyDataSmall.at[index, 'Recipe'] = combineCells(recipe, row['Non-Standard Recipe'])

            #shorten chars from meas tool
            meas = shortenStr(row['Measure Tool'], 17)
            PolyDataSmall.at[index, 'Measure Tool'] = meas

        #remove nonstandard recipe column
        PolyDataSmall.drop(columns=['Non-Standard Recipe'], inplace=True)
        PolyDataSmall.to_csv(os.path.join(DATA_DIR, 'small_Poly_DataCollection.csv'))

def saveAllwin():
    print('Saving Allwin')
    ensureExists('Allwin_DataCollection.csv')
    AllwinData = retrieveData('Allwin')
    if changedData('Allwin_DataCollection.csv', AllwinData):
        AllwinData.to_csv(os.path.join(DATA_DIR, 'Allwin_DataCollection.csv'))

        columns_to_keep = ['submission_id','submitter_name','form_data.RTP_Recipe']
        AllwinDataSmall = AllwinData[columns_to_keep]
        AllwinDataSmall = AllwinDataSmall.rename(columns={'form_data.RTP_Recipe': 'Recipe'})

        #no data to manipulate
        AllwinDataSmall.to_csv(os.path.join(DATA_DIR, 'small_Allwin_DataCollection.csv'))


#TODO EVERY DEVICE IN THE SYSTEM HAS A saveX function


#Brains of the device, this is called every morning at 5 AM
def save():
    #This is how handling from new loadpt
    #header = {'Authorization': AUTH}
    #fullDataTable = requests.get('https://n8n.cores.utah.edu/webhook/custom_form_data_dump?service_ids=761', headers=header)
    #readData = fullDataTable.text
    #importantData = json.loads(readData)

    #print(json.dumps(importantData, indent=4))

    #outputData = pd.json_normalize(importantData)
    #outputData.to_csv('C:\\Users\\Phelan\\NMon\\HSCDATA\\fullData.csv')

    #todo save every device

    try:
        #DEPOSITION DEVICES
        saveALD()                          #ALD Fiji F200
        saveEbeam()                        #E-Beam Denton SJ20C
        saveMOCVD()                        #MOCVD Agnitron Imperium
        saveParylene()                     #Parylene - SCS PDS 2010
        #savePECVD()                        #PECVD - Oxford Plasmalab 80
        saveDenton635()                    #Sputter - Denton 635
        saveDenton18()                     #Sputter - Denton Discovery 18
        saveTMV()                          #Sputter - TMV Super

        #ETCH DEVICES
        saveDRIE()                         #DRIE - Oxford 100 ICP
        saveIsotropic()                    #Isotropic - XACTIX X2 XeF2
        savePlasmalab()                    #RIE - Oxford Plasmalab 80
        savePlasmaTherm()                  #RIE - Plasmatherm Metal Etch
        saveTechnics()                     #RIE - Technics PE II-A

        #FURNACES
        saveCleanOx()                      #Atmospheric - ProTemp Clean Ox
        saveDopedOx()                      #Atmospheric - ProTemp Doped Ox
        saveLTO()                          #LPCVD - Expertech CTR125 LTO
        saveNitride()                      #LPCVD - Expertech CTR125 Nitride
        savePoly()                         #LPCVD - Expertech CTR125 Poly
        saveAllwin()                          #RTP - Allwin AccuThermo AW 610

        #LASERS
        #saveDPSS()                         #DPSS Samurai UV Laser

        #LITHOGRAPHY DEVICES
        #save100SC()                        #CEE 100 Spin Coat
        #save1800SC()                       #CEE 200X 1800 Spin Coat
        #save9260SC()                       #CEE 200X 9260 Spin Coat
        #saveEC101()                        #Headway EC101 Spin

        #MICROFLUIDICS
        #savePDMS()                         #CEE 200X PDMS Spin Coat

        #PATTERN DEVICES
        #saveDWL66()                        #Heidelberg DWL66+
        #saveMicroPG()                      #Heidelberg MicroPG 101
        #saveMicroPGzp4()                   #Heidelberg MicroPG 101-2 0.9/2.5um
        #saveNanoscribe()                   #Nanoscribe
        #saveNanoFrazor()                   #NanoFrazor Explore

        #OTHER
        #saveMaintenance()                  #Maintenance Activity

        logging.info("Executing save")
    except Exception as e:
        logging.error(f"Error executing save {e}")

def graceful_exit(signum, frame):
    logging.info("Exiting")
    sys.exit(0)

signal.signal(signal.SIGINT, graceful_exit)
signal.signal(signal.SIGTERM, graceful_exit)

#shedules the save function for 5AM
schedule.every().day.at("05:00").do(save)


def runForever():
    #Infinite Loop
    save()
    while True:
        try:
            schedule.run_pending()
            time.sleep(10)
        except Exception as e:
            logging.error(f"Error in scheduled loop {e}")

if __name__ == '__main__':
    runForever()
```

## Line-By-Line Reconstruction Notes

### Line 1

```text
# Copyright (c) 2024 Phelan Hobbs
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 1 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `none` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 2

```text
# All rights reserved.
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 2 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 3

```text
#
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 3 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 4

```text
# Version: 0.0.9
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 4 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 5

```text
# Date: 2024-07-03
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 5 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 6

```text
#
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 6 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 7

```text
# This code was created to be used by the University of Utah Nanofab under the direction of Kathy Anderson and Jim Pierce
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 7 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 8

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 8 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 9

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 9 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `blank` and next kind is `import`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 10

```text
import numpy as np
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 10 is classified as `import`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions. Neighbor context: previous kind is `blank` and next kind is `import`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 11

```text
import requests
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 11 is classified as `import`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions. Neighbor context: previous kind is `import` and next kind is `import`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 12

```text
import schedule
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 12 is classified as `import`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions. Neighbor context: previous kind is `import` and next kind is `import`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 13

```text
import os
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 13 is classified as `import`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions. Neighbor context: previous kind is `import` and next kind is `import`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 14

```text
import pandas as pd
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 14 is classified as `import`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions. Neighbor context: previous kind is `import` and next kind is `import`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 15

```text
import json
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 15 is classified as `import`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions. Neighbor context: previous kind is `import` and next kind is `import`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 16

```text
from io import StringIO
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 16 is classified as `import`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions. Neighbor context: previous kind is `import` and next kind is `import`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 17

```text
import logging
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 17 is classified as `import`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions. Neighbor context: previous kind is `import` and next kind is `import`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 18

```text
import time
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 18 is classified as `import`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions. Neighbor context: previous kind is `import` and next kind is `import`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 19

```text
import signal
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 19 is classified as `import`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions. Neighbor context: previous kind is `import` and next kind is `import`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 20

```text
import sys
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 20 is classified as `import`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions. Neighbor context: previous kind is `import` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 21

```text
breakLoop = 0
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 21 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `import` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 22

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 22 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 23

```text
script_dir = os.path.dirname(__file__) #<-- absolute dir the script is in
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 23 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `blank` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 24

```text
DATA_DIR = os.path.join(script_dir, 'HSCDATA')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 24 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `filesystem` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 25

```text
#DATA_DIR = "C:\\Users\\Phelan\\NMon\\HSCDATA"
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 25 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `filesystem` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 26

```text
AUTH = 'Bearer <redacted-secret-value>'
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 26 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 27

```text
URLBASE = 'https://n8n.cores.utah.edu/webhook/custom_form_data_dump?service_ids='
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 27 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 28

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 28 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 29

```text
# Setup basic logging
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 29 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 30

```text
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 30 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 31

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 31 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 32

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 32 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `blank` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 33

```text
def downloadFile(url):
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 33 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 34

```text
    header = {'Authorization': AUTH}
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 34 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `function` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 35

```text
    fullDataTable = requests.get(URLBASE + url, headers=header)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 35 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 36

```text
    readData = json.loads(fullDataTable.text)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 36 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 37

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 37 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `filesystem` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 38

```text
    #print(json.dumps(readData, indent=4))
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 38 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 39

```text
    DLed = pd.json_normalize(readData)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 39 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `comment` and next kind is `return`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 40

```text
    return DLed
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 40 is classified as `return`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect. Neighbor context: previous kind is `filesystem` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 41

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 41 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `return` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 42

```text
#Ensures that the files exist, if they don't, it creates them
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 42 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 43

```text
def ensureExists(fileName):
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 43 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 44

```text
    #ensures that the files both exist, if not, it creates them
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 44 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `function` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 45

```text
    filePathFull = os.path.join(DATA_DIR, fileName)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 45 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `comment` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 46

```text
    filePathSmall = os.path.join(DATA_DIR, 'small_' +fileName)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 46 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `filesystem` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 47

```text
    if not os.path.exists(filePathFull):
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 47 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `filesystem` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 48

```text
        open(filePathFull, 'w').close()
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 48 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `branch` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 49

```text
    if not os.path.exists(filePathSmall):
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 49 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `filesystem` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 50

```text
        open(filePathSmall, 'w').close()
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 50 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `branch` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 51

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 51 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `filesystem` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 52

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 52 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `blank` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 53

```text
#TODO
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 53 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 54

```text
def changedData(fileName, secondFile):
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 54 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 55

```text
    #checks if the data has changed
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 55 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `function` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 56

```text
    #if it has, it will return true
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 56 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 57

```text
    #if it hasn't, it will return false
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 57 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `comment` and next kind is `return`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 58

```text
    return 1
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 58 is classified as `return`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 59

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 59 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `return` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 60

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 60 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `blank` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 61

```text
#Retrieves the data from HSC, the deviceName selects which device to retrieve data from
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 61 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 62

```text
def retrieveData(deviceName):
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 62 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 63

```text
    #todo retrieve data from HSC
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 63 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `function` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 64

```text
    #need to handle as case statement
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 64 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 65

```text
    DLed = ''
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 65 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 66

```text
    #Deposition tools first
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 66 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `assignment` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 67

```text
    if (deviceName == 'ALD'):
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 67 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 68

```text
        DLed = downloadFile('761')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 68 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `branch` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 69

```text
        print("Retrieving Data from ALD")
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 69 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 70

```text
    elif (deviceName == 'Ebeam'):
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 70 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 71

```text
        DLed = downloadFile('764')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 71 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `branch` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 72

```text
        print("Retrieving Data from Ebeam")
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 72 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 73

```text
    elif (deviceName == 'MOCVD'):
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 73 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 74

```text
        DLed = downloadFile('769')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 74 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `branch` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 75

```text
        print("Retrieving Data from MOCVD")
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 75 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 76

```text
    elif (deviceName == 'Parylene'):
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 76 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 77

```text
        DLed = downloadFile('765')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 77 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `branch` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 78

```text
        print("Retrieving Data from Parylene")
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 78 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 79

```text
    elif (deviceName == 'PECVD'):
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 79 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 80

```text
        DLed = downloadFile('770')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 80 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `branch` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 81

```text
        print("Retrieving Data from PECVD")
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 81 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 82

```text
    elif (deviceName == 'Denton635'):
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 82 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 83

```text
        DLed = downloadFile('766')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 83 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `branch` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 84

```text
        print("Retrieving Data from Denton635")
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 84 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 85

```text
    elif (deviceName == 'Denton18'):
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 85 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 86

```text
        DLed = downloadFile('771')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 86 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `branch` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 87

```text
        print("Retrieving Data from Denton18")
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 87 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 88

```text
    elif(deviceName == 'TMV'):
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 88 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 89

```text
        DLed = downloadFile('772')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 89 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 90

```text
        print("Retrieving Data from TMV")
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 90 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 91

```text
    #start of sputter tools
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 91 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `generic` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 92

```text
    elif (deviceName == 'DRIE'):
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 92 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 93

```text
        DLed = downloadFile('767')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 93 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `branch` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 94

```text
        print("Retrieving Data from DRIE")
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 94 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 95

```text
    elif (deviceName == 'Isotropic'):
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 95 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 96

```text
        DLed = downloadFile('775')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 96 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `branch` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 97

```text
        print("Retrieving Data from Isotropic")
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 97 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 98

```text
    elif (deviceName == 'PlasmaLab'):
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 98 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 99

```text
        DLed = downloadFile('776')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 99 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `branch` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 100

```text
        print("Retrieving Data from PlasmaLab")
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 100 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 101

```text
    elif (deviceName == 'PlasmaTherm'):
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 101 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 102

```text
        DLed = downloadFile('777')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 102 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `branch` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 103

```text
        print("Retrieving Data from PlasmaTherm")
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 103 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 104

```text
    elif (deviceName == 'Technics'):
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 104 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 105

```text
        DLed = downloadFile('778')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 105 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `branch` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 106

```text
        print("Retrieving Data from Technics")
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 106 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 107

```text
        #Start of Furnace tools
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 107 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `generic` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 108

```text
    elif (deviceName == 'CleanOx'):
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 108 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 109

```text
        DLed = downloadFile('779')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 109 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `branch` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 110

```text
        print("Retrieving Data from CleanOx")
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 110 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 111

```text
    elif (deviceName == 'DopedOx'):
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 111 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 112

```text
        DLed = downloadFile('780')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 112 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `branch` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 113

```text
        print("Retrieving Data from DopedOx")
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 113 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 114

```text
    elif (deviceName == 'LTO'):
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 114 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 115

```text
        DLed = downloadFile('762')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 115 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `branch` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 116

```text
        print("Retrieving Data from LTO")
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 116 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 117

```text
    elif (deviceName == 'Nitride'):
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 117 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 118

```text
        DLed = downloadFile('763')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 118 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `branch` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 119

```text
        print("Retrieving Data from Nitride")
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 119 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 120

```text
    elif (deviceName == 'Poly'):
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 120 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 121

```text
        DLed = downloadFile('781')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 121 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `branch` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 122

```text
        print("Retrieving Data from Poly")
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 122 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 123

```text
    elif (deviceName == 'Allwin'):
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 123 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 124

```text
        DLed = downloadFile('801')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 124 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `branch` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 125

```text
        print("Retrieving Data from Allwin")
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 125 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 126

```text
    #Start of Laser Tools
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 126 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `generic` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 127

```text
    elif (deviceName == 'DPSS'):
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 127 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 128

```text
        DLed = downloadFile('825')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 128 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `branch` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 129

```text
        print("Retrieving Data from DPSS")
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 129 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 130

```text
    #Start of Lithography Tools
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 130 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `generic` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 131

```text
    elif (deviceName == '100SC'):
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 131 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 132

```text
        DLed = downloadFile('834')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 132 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `branch` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 133

```text
        print("Retrieving Data from 100SC")
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 133 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 134

```text
    elif (deviceName == '1800SC'):
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 134 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 135

```text
        DLed = downloadFile('835')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 135 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `branch` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 136

```text
        print("Retrieving Data from 1800SC")
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 136 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 137

```text
    elif (deviceName == '9260SC'):
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 137 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 138

```text
        DLed = downloadFile('836')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 138 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `branch` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 139

```text
        print("Retrieving Data from 9260SC")
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 139 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 140

```text
    elif (deviceName == 'EC101'):
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 140 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 141

```text
        DLed = downloadFile('844')                      #CURRENTLY HAS NO DATA
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 141 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `branch` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 142

```text
        print("Retrieving Data from EC101")
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 142 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 143

```text
    #Start of Microfluidics Tools
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 143 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `generic` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 144

```text
    elif (deviceName == 'PDMS'):
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 144 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 145

```text
        DLed = downloadFile('845')                      #CURRENTLY HAS NO DATA
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 145 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `branch` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 146

```text
        print("Retrieving Data from PDMS")
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 146 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 147

```text
    #Start of Patterning Tools
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 147 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `generic` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 148

```text
    elif (deviceName == 'DWL66'):
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 148 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 149

```text
        DLed = downloadFile('782')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 149 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `branch` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 150

```text
        print("Retrieving Data from DWL66")
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 150 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 151

```text
    elif (deviceName == 'MicroPG'):
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 151 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 152

```text
        DLed = downloadFile('785')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 152 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `branch` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 153

```text
        print("Retrieving Data from MicroPG")
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 153 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 154

```text
    elif (deviceName == 'MicroPGZP4'):
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 154 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 155

```text
        DLed = downloadFile('787')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 155 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `branch` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 156

```text
        print("Retrieving Data from MicroPGZP4")
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 156 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 157

```text
    elif (deviceName == 'Nanoscribe'):
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 157 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 158

```text
        DLed = downloadFile('827')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 158 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `branch` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 159

```text
        print("Retrieving Data from Nanoscribe")
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 159 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 160

```text
    elif (deviceName == 'NanoFrazor'):
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 160 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 161

```text
        DLed = downloadFile('833')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 161 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `branch` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 162

```text
        print("Retrieving Data from NanoFrazor")
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 162 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 163

```text
    #Start of Misc Tools
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 163 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `generic` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 164

```text
    elif (deviceName == 'Maintainence'):
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 164 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 165

```text
        DLed = downloadFile('843')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 165 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `branch` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 166

```text
        print("Retrieving Data from Maintainence")
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 166 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 167

```text
    else:
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 167 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 168

```text
        print("Invalid Device Name")
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 168 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `branch` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 169

```text
        return
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 169 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `return`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 170

```text
    return DLed
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 170 is classified as `return`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 171

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 171 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `return` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 172

```text
def shortenStr(fullStr, val):
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 172 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `blank` and next kind is `exception`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 173

```text
    try:
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 173 is classified as `exception`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state. Neighbor context: previous kind is `function` and next kind is `return`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 174

```text
        return fullStr[val:]
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 174 is classified as `return`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect. Neighbor context: previous kind is `exception` and next kind is `exception`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 175

```text
    except:
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 175 is classified as `exception`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state. Neighbor context: previous kind is `return` and next kind is `return`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 176

```text
        return 'Unknown'
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 176 is classified as `return`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect. Neighbor context: previous kind is `exception` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 177

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 177 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `return` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 178

```text
def combineCells(cell1, cell2):
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 178 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `blank` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 179

```text
    if cell1 == 'Other':
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 179 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `function` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 180

```text
        if cell2 == '':
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 180 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `branch` and next kind is `return`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 181

```text
            return 'Unknown/Other'
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 181 is classified as `return`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect. Neighbor context: previous kind is `branch` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 182

```text
        else:
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 182 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `return` and next kind is `return`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 183

```text
            return cell2
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 183 is classified as `return`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect. Neighbor context: previous kind is `branch` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 184

```text
    else:
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 184 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `return` and next kind is `return`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 185

```text
        return cell1
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 185 is classified as `return`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect. Neighbor context: previous kind is `branch` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 186

```text
#Saves and works with the ALD data
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 186 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `return` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 187

```text
def saveALD():
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 187 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `comment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 188

```text
    ensureExists('ALD_DataCollection.csv')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 188 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `function` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 189

```text
    #GET DATA FROM HSC
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 189 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 190

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 190 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 191

```text
    ALDData = retrieveData('ALD')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 191 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `blank` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 192

```text
    #CHECK IF DATA HAS CHANGED
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 192 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `assignment` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 193

```text
    if changedData('ALD_DataCollection.csv', ALDData):
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 193 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 194

```text
        #SAVE DATA
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 194 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `branch` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 195

```text
        ALDData.to_csv(os.path.join(DATA_DIR, 'ALD_DataCollection.csv'))
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 195 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 196

```text
        #Creates a smaller, more easily managed version of the data
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 196 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `filesystem` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 197

```text
        columns_to_keep = ['submission_id','submitter_name','form_data.ALDFIJI_Film','form_data.ALDFIJI_Film_OtherText','form_data.ALDFIJI_DepMode','form_data.ALDFIJI_Recipe',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 197 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 198

```text
                           'form_data.ALDFIJI_ChuckTemp','form_data.ALDFIJI_PrecursorTemp','form_data.ALDFIJI_NoCycles','form_data.ALDFIJI_BasePress',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 198 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 199

```text
                           'form_data.ALDFIJI_Thick','form_data.ALDFIJI_ThickUnit']
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 199 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 200

```text
        ALDDataSmall = ALDData[columns_to_keep]
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 200 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 201

```text
        ALDDataSmall = ALDDataSmall.rename(columns={'form_data.ALDFIJI_Film': 'Film Deposited','form_data.ALDFIJI_Film_OtherText': 'Other Film',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 201 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 202

```text
                                                    'form_data.ALDFIJI_DepMode': 'Deposition Mode', 'form_data.ALDFIJI_Recipe': 'Recipe',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 202 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 203

```text
                                                    'form_data.ALDFIJI_ChuckTemp': 'Chuck Temperature (C)',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 203 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 204

```text
                                                    'form_data.ALDFIJI_PrecursorTemp': 'Precursor Temperature (C)', 'form_data.ALDFIJI_NoCycles': 'Number of Cycles',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 204 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 205

```text
                                                    'form_data.ALDFIJI_BasePress': 'Base Pressure', 'form_data.ALDFIJI_Thick': 'Measured Thickness (nm)',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 205 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 206

```text
                                                    'form_data.ALDFIJI_ThickUnit': 'Measured Unit'})
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 206 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 207

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 207 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 208

```text
        #Iderates through the data to make necessary adjustments
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 208 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `loop`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 209

```text
        for index, row in ALDDataSmall.iterrows():
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 209 is classified as `loop`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 210

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 210 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `loop` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 211

```text
            #shortens the first chars of the film deposited
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 211 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 212

```text
            film = shortenStr(row['Film Deposited'],13)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 212 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 213

```text
            #handles "other" film, if nothing is entered, it will be marked as unknown
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 213 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 214

```text
            ALDDataSmall.at[index, 'Film Deposited'] = combineCells(film, row['Other Film'])
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 214 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 215

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 215 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 216

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 216 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `blank` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 217

```text
            #shortens first chars of Deposition Mode
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 217 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 218

```text
            ALDDataSmall.at[index, 'Deposition Mode'] = shortenStr(row['Deposition Mode'],12)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 218 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 219

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 219 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 220

```text
            #converts thickness to nm
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 220 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 221

```text
            if row['Measured Unit'] == 'ALDFIJI_ThickUnit_Ang':
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 221 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `comment` and next kind is `exception`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 222

```text
                try:
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 222 is classified as `exception`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state. Neighbor context: previous kind is `branch` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 223

```text
                    thickness_value = row['Measured Thickness (nm)']
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 223 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `exception` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 224

```text
                    ALDDataSmall.at[index, 'Measured Thickness (nm)'] = int(thickness_value) / 10
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 224 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `exception`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 225

```text
                except ValueError as e:
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 225 is classified as `exception`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 226

```text
                    # Upon failure, sets value to none (a.k.a not a number)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 226 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `exception` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 227

```text
                    ALDDataSmall.at[index, 'Measured Thickness (nm)'] = None
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 227 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 228

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 228 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 229

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 229 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `blank` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 230

```text
        #delete other film and units column
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 230 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 231

```text
        ALDDataSmall.drop(columns=['Other Film', 'Measured Unit'], inplace=True)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 231 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 232

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 232 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 233

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 233 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `blank` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 234

```text
        ALDDataSmall.to_csv(os.path.join(DATA_DIR, 'small_ALD_DataCollection.csv'))
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 234 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `blank` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 235

```text
        #SHORTEN DATA
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 235 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `filesystem` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 236

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 236 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 237

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 237 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 238

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 238 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `blank` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 239

```text
def saveEbeam():
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 239 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 240

```text
    print('Saving Ebeam')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 240 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `function` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 241

```text
    ensureExists('Ebeam_DataCollection.csv')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 241 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 242

```text
    EbeamData = retrieveData('Ebeam')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 242 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `generic` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 243

```text
    if changedData('Ebeam_DataCollection.csv', EbeamData):
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 243 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `assignment` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 244

```text
        EbeamData.to_csv(os.path.join(DATA_DIR, 'Ebeam_DataCollection.csv'))
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 244 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `branch` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 245

```text
        columns_to_keep = ['submission_id','submitter_name','form_data.DENTONSJ20C_Substrate','form_data.DENTONSJ20C_SubOther','form_data.DENTONSJ20C_BasePress','form_data.DENTONSJ20C_BasePressUnit','form_data.DENTONSJ20C_PumpDownTime',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 245 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `filesystem` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 246

```text
                           'form_data.DENTONSJ20C_Material1','form_data.DENTONSJ20C_Material1_MatOther','form_data.DENTONSJ20C_Material1_BeamVoltage','form_data.DENTONSJ20C_Material1_MaxCurrent','form_data.DENTONSJ20C_Material1_CrystalThick','form_data.DENTONSJ20C_Material1_MaxDepRate',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 246 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 247

```text
                           'form_data.DENTONSJ20C_Material2','form_data.DENTONSJ20C_Material2_MatOther','form_data.DENTONSJ20C_Material2_BeamVoltage','form_data.DENTONSJ20C_Material2_MaxCurrent','form_data.DENTONSJ20C_Material2_CrystalThick','form_data.DENTONSJ20C_Material2_MaxDepRate',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 247 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 248

```text
                           'form_data.DENTONSJ20C_Material3','form_data.DENTONSJ20C_Material3_MatOther','form_data.DENTONSJ20C_Material3_BeamVoltage','form_data.DENTONSJ20C_Material3_MaxCurrent','form_data.DENTONSJ20C_Material3_CrystalThick','form_data.DENTONSJ20C_Material3_MaxDepRate',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 248 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 249

```text
                           'form_data.DENTONSJ20C_Material4','form_data.DENTONSJ20C_Material4_MatOther','form_data.DENTONSJ20C_Material4_BeamVoltage','form_data.DENTONSJ20C_Material4_MaxCurrent','form_data.DENTONSJ20C_Material4_CrystalThick','form_data.DENTONSJ20C_Material4_MaxDepRate',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 249 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 250

```text
                           'form_data.DENTONSJ20C_TotalThick','form_data.DENTONSJ20C_TotalThickUnit','form_data.DENTONSJ20C_SheetRho', 'form_data.DENTONSJ20C_CryoTemp']
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 250 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 251

```text
        EbeamDataSmall = EbeamData[columns_to_keep]
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 251 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 252

```text
        EbeamDataSmall = EbeamDataSmall.rename(columns={'form_data.DENTONSJ20C_Substrate': 'Substrate','form_data.DENTONSJ20C_SubOther': 'Other Substrate',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 252 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 253

```text
                                                    'form_data.DENTONSJ20C_BasePress': 'Base Pressure', 'form_data.DENTONSJ20C_BasePressUnit': 'Base Pressure Unit',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 253 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 254

```text
                                                    'form_data.DENTONSJ20C_PumpDownTime': 'Pump Down Time (min)',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 254 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 255

```text
                                                    'form_data.DENTONSJ20C_Material1': 'Material Deposited 1', 'form_data.DENTONSJ20C_Material1_MatOther': 'Other Material 1',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 255 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 256

```text
                                                    'form_data.DENTONSJ20C_Material1_BeamVoltage': 'Beam Voltage 1', 'form_data.DENTONSJ20C_Material1_MaxCurrent': 'Max Beam Current 1',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 256 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 257

```text
                                                    'form_data.DENTONSJ20C_Material1_CrystalThick': 'Crystal Thickness 1', 'form_data.DENTONSJ20C_Material1_MaxDepRate': 'Max Deposition Rate 1',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 257 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 258

```text
                                                    'form_data.DENTONSJ20C_Material2': 'Material Deposited 2', 'form_data.DENTONSJ20C_Material2_MatOther': 'Other Material 2',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 258 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 259

```text
                                                    'form_data.DENTONSJ20C_Material2_BeamVoltage': 'Beam Voltage 2', 'form_data.DENTONSJ20C_Material2_MaxCurrent': 'Max Beam Current 2',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 259 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 260

```text
                                                    'form_data.DENTONSJ20C_Material2_CrystalThick': 'Crystal Thickness 2', 'form_data.DENTONSJ20C_Material2_MaxDepRate': 'Max Deposition Rate 2',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 260 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 261

```text
                                                    'form_data.DENTONSJ20C_Material3': 'Material Deposited 3', 'form_data.DENTONSJ20C_Material3_MatOther': 'Other Material 3',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 261 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 262

```text
                                                    'form_data.DENTONSJ20C_Material3_BeamVoltage': 'Beam Voltage 3', 'form_data.DENTONSJ20C_Material3_MaxCurrent': 'Max Beam Current 3',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 262 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 263

```text
                                                    'form_data.DENTONSJ20C_Material3_CrystalThick': 'Crystal Thickness 3', 'form_data.DENTONSJ20C_Material3_MaxDepRate': 'Max Deposition Rate 3',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 263 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 264

```text
                                                    'form_data.DENTONSJ20C_Material4': 'Material Deposited 4', 'form_data.DENTONSJ20C_Material4_MatOther': 'Other Material 4',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 264 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 265

```text
                                                    'form_data.DENTONSJ20C_Material4_BeamVoltage': 'Beam Voltage 4', 'form_data.DENTONSJ20C_Material4_MaxCurrent': 'Max Beam Current 4',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 265 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 266

```text
                                                    'form_data.DENTONSJ20C_Material4_CrystalThick': 'Crystal Thickness 4', 'form_data.DENTONSJ20C_Material4_MaxDepRate': 'Max Deposition Rate 4',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 266 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 267

```text
                                                    'form_data.DENTONSJ20C_TotalThick':'Total Thickness','form_data.DENTONSJ20C_TotalThickUnit' :'Thickness Unit','form_data.DENTONSJ20C_SheetRho': 'Sheet Resistivity (Ohm/sq)','form_data.DENTONSJ20C_CryoTemp':'Cryo Temp (C)'})
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 267 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 268

```text
        #TODO manipulate data from the EBEAM
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 268 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `generic` and next kind is `loop`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 269

```text
        for index, row in EbeamDataSmall.iterrows():
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 269 is classified as `loop`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 270

```text
            #Shortens chars from substrate
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 270 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `loop` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 271

```text
            sub = shortenStr(row['Substrate'], 16)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 271 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 272

```text
            EbeamDataSmall.at[index, 'Substrate'] = combineCells(sub, row['Other Substrate'])
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 272 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 273

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 273 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 274

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 274 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `blank` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 275

```text
            #normalize pressure measurements around micro (-6)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 275 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 276

```text
            powerFactor = shortenStr(row['Base Pressure Unit'], 23)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 276 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 277

```text
            if powerFactor != 'Unknown' and powerFactor != '':
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 277 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 278

```text
                EbeamDataSmall['Base Pressure'] = EbeamDataSmall['Base Pressure'].astype(float)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 278 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `branch` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 279

```text
                EbeamDataSmall.at[index, 'Base Pressure'] = row['Base Pressure'] * 10**(int(powerFactor) +6)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 279 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 280

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 280 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 281

```text
            #Shortens chars from material deposited
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 281 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 282

```text
            mat1 = shortenStr(row['Material Deposited 1'], 22)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 282 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 283

```text
            EbeamDataSmall.at[index, 'Material Deposited 1'] = combineCells(mat1, row['Other Material 1'])
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 283 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 284

```text
            mat2 = shortenStr(row['Material Deposited 2'], 22)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 284 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 285

```text
            EbeamDataSmall.at[index, 'Material Deposited 2'] = combineCells(mat2, row['Other Material 2'])
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 285 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 286

```text
            mat3 = shortenStr(row['Material Deposited 3'], 22)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 286 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 287

```text
            EbeamDataSmall.at[index, 'Material Deposited 3'] = combineCells(mat3, row['Other Material 3'])
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 287 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 288

```text
            mat4 = shortenStr(row['Material Deposited 4'], 22)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 288 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 289

```text
            EbeamDataSmall.at[index, 'Material Deposited 4'] = combineCells(mat4, row['Other Material 4'])
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 289 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 290

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 290 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 291

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 291 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 292

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 292 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 293

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 293 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 294

```text
        EbeamDataSmall.drop(columns=['Other Substrate', 'Base Pressure Unit', 'Other Material 1','Other Material 2','Other Material 3','Other Material 4'], inplace=True)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 294 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 295

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 295 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 296

```text
        EbeamDataSmall.to_csv(os.path.join(DATA_DIR, 'small_Ebeam_DataCollection.csv'))
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 296 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 297

```text
    return
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 297 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `filesystem` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 298

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 298 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 299

```text
def saveMOCVD():
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 299 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 300

```text
    print('Saving MOCVD')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 300 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `function` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 301

```text
    ensureExists('MOCVD_DataCollection.csv')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 301 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 302

```text
    MOCVDData = retrieveData('MOCVD')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 302 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `generic` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 303

```text
    if changedData('MOCVD_DataCollection.csv', MOCVDData):
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 303 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `assignment` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 304

```text
        MOCVDData.to_csv(os.path.join(DATA_DIR, 'MOCVD_DataCollection.csv'))
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 304 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `branch` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 305

```text
        columns_to_keep = ['submission_id','submitter_name','form_data.AGNITRON_Precursor','form_data.AGNITRON_Recipe','form_data.AGNITRON_RunTime']
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 305 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `filesystem` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 306

```text
        MOCVDDataSmall = MOCVDData[columns_to_keep]
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 306 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 307

```text
        MOCVDDataSmall = MOCVDDataSmall.rename(columns={'form_data.AGNITRON_Precursor': 'Precursors Used', 'form_data.AGNITRON_Recipe': 'Recipe', 'form_data.AGNITRON_RunTime': 'Total Run Time'})
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 307 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 308

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 308 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `loop`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 309

```text
        for index, row in MOCVDDataSmall.iterrows():
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 309 is classified as `loop`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones. Neighbor context: previous kind is `blank` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 310

```text
            #Shortens chars from precursors used
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 310 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `loop` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 311

```text
            prec = shortenStr(row['Precursors Used'], 19)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 311 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 312

```text
            MOCVDDataSmall.at[index, 'Precursors Used'] = prec
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 312 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 313

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 313 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 314

```text
            #TODO Normalize Runtime Maybe?
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 314 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 315

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 315 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 316

```text
    MOCVDDataSmall.to_csv(os.path.join(DATA_DIR, 'small_MOCVD_DataCollection.csv'))
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 316 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 317

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 317 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `filesystem` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 318

```text
def saveParylene():
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 318 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 319

```text
    print('Saving Parylene')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 319 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `function` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 320

```text
    ensureExists('Parylene_DataCollection.csv')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 320 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 321

```text
    ParyleneData = retrieveData('Parylene')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 321 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `generic` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 322

```text
    if  (changedData('Parylene_DataCollection.csv', ParyleneData)):
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 322 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `assignment` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 323

```text
        ParyleneData.to_csv(os.path.join(DATA_DIR, 'Parylene_DataCollection.csv'))
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 323 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `branch` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 324

```text
        columns_to_keep = ['submission_id','submitter_name','form_data.SCSPDS2010_Substrate','form_data.SCSPDS2010_SubstrateOth','form_data.SCSPDS2010_Adhesion','form_data.SCSPDS2010_Adhesion','form_data.SCSPDS2010_ThickUnit','form_data.SCSPDS2010_ThickTop','form_data.SCSPDS2010_ThickCenter']
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 324 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `filesystem` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 325

```text
        ParyleneDataSmall = ParyleneData[columns_to_keep]
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 325 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 326

```text
        ParyleneDataSmall = ParyleneDataSmall.rename(columns={'form_data.SCSPDS2010_Substrate':'Substrate', 'form_data.SCSPDS2010_SubstrateOth': 'Other Substrate', 'form_data.SCSPDS2010_Adhesion': 'Adhesion', 'form_data.SCSPDS2010_ThickUnit': 'Thickness Unit', 'form_data.SCSPDS2010_ThickTop': 'Top Thickness', 'form_data.SCSPDS2010_ThickCenter': 'Center Thickness'})
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 326 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 327

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 327 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `loop`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 328

```text
        for index, row in ParyleneDataSmall.iterrows():
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 328 is classified as `loop`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones. Neighbor context: previous kind is `blank` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 329

```text
            #Shortens chars from substrate used
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 329 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `loop` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 330

```text
            sub = shortenStr(row['Substrate'],21)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 330 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 331

```text
            #handles "other" film, if nothing is entered, it will be marked as unknown
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 331 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 332

```text
            ParyleneDataSmall.at[index, 'Substrate'] = combineCells(sub, row['Other Substrate'])
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 332 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 333

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 333 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 334

```text
            #Shortens chars from adhesion
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 334 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 335

```text
            adhesion = shortenStr(row['Adhesion'], 20)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 335 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 336

```text
            ParyleneDataSmall.at[index, 'Adhesion'] = adhesion
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 336 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 337

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 337 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 338

```text
            #implement thickness measurements
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 338 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 339

```text
            unit = shortenStr(row['Thickness Unit'], 21)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 339 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 340

```text
            ParyleneDataSmall.at[index, 'Thickness Top'] = str(ParyleneDataSmall.at[index, 'Top Thickness']) + unit
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 340 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 341

```text
            ParyleneDataSmall.at[index, 'Thickness Center'] = str(ParyleneDataSmall.at[index, 'Center Thickness']) + unit
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 341 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 342

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 342 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 343

```text
        ParyleneDataSmall.drop(columns=['Other Substrate', 'Thickness Unit'], inplace=True)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 343 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `blank` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 344

```text
        ParyleneDataSmall.to_csv(os.path.join(DATA_DIR, 'small_Parylene_DataCollection.csv'))
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 344 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 345

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 345 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `filesystem` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 346

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 346 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `blank` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 347

```text
def savePECVD():
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 347 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 348

```text
    print('Saving PECVD')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 348 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `function` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 349

```text
    ensureExists('PECVD_DataCollection.csv')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 349 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 350

```text
    PECVDData = retrieveData('PECVD')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 350 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `generic` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 351

```text
    if changedData('PECVD_DataCollection.csv', PECVDData):
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 351 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `assignment` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 352

```text
        PECVDData.to_csv(os.path.join(DATA_DIR, 'PECVD_DataCollection.csv'))
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 352 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `branch` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 353

```text
        columns_to_keep = ['submission_id','submitter_name','form_data.OX80PECVD_Recipe','form_data.OX80PECVD_BasePress','form_data.OX80PECVD_ArFlow','form_data.OX80PECVD_DepPress',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 353 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `filesystem` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 354

```text
                           'form_data.OX80PECVD_Power','form_data.OX80PECVD_EtchTime','form_data.OX80PECVD_ThickSite1','form_data.OX80PECVD_ThickUnit',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 354 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 355

```text
                           'form_data.OX80PECVD_NH3Flow','form_data.OX80PECVD_N2Flow','form_data.OX80PECVD_SiH4Flow','form_data.OX80PECVD_ThickSite2',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 355 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 356

```text
                           'form_data.OX80PECVD_ThickSite3','form_data.OX80PECVD_N2OFlow','form_data.OX80PECVD_O2Flow']
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 356 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 357

```text
        PECVDDataSmall = PECVDData[columns_to_keep]
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 357 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 358

```text
        PECVDDataSmall = PECVDDataSmall.rename(columns={'form_data.OX80PECVD_Recipe': 'Recipe', 'form_data.OX80PECVD_BasePress': 'Base Pressure', 'form_data.OX80PECVD_ArFlow': 'Argon Flow Rate',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 358 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 359

```text
                                                        'form_data.OX80PECVD_DepPress': 'Deposition Pressure', 'form_data.OX80PECVD_Power': 'Power', 'form_data.OX80PECVD_EtchTime': 'Etch Time',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 359 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 360

```text
                                                        'form_data.OX80PECVD_ThickSite1': 'Thickness Site 1', 'form_data.OX80PECVD_ThickSite2': 'Thickness Site 2', 'form_data.OX80PECVD_ThickSite3': 'Thickness Site 3',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 360 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 361

```text
                                                        'form_data.OX80PECVD_ThickUnit': 'Thickness Unit', 'form_data.OX80PECVD_NH3Flow': 'NH3 Flow Rate', 'form_data.OX80PECVD_N2Flow': 'N2 Flow Rate',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 361 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 362

```text
                                                        'form_data.OX80PECVD_SiH4Flow': 'SiH4 Flow Rate', 'form_data.OX80PECVD_N2OFlow': 'N2O Flow Rate', 'form_data.OX80PECVD_O2Flow': 'O2 Flow Rate'})
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 362 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 363

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 363 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `loop`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 364

```text
        for index, row in PECVDDataSmall.iterrows():
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 364 is classified as `loop`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones. Neighbor context: previous kind is `blank` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 365

```text
            #Normalize Thickness
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 365 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `loop` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 366

```text
                if row['Thickness Unit'] == 'OX80PECVD_ThickUnit_Ang':
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 366 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 367

```text
                    PECVDData.at[index, 'Thickness Site 1'] = int(row['Thickness Site 1']) / 10
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 367 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `branch` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 368

```text
                    PECVDData.at[index, 'Thickness Site 2'] = int(row['Thickness Site 2']) / 10
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 368 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 369

```text
                    PECVDData.at[index, 'Thickness Site 3'] = int(row['Thickness Site 3']) / 10
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 369 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 370

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 370 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 371

```text
        #TODO FIX THE LOCATION OF THICKNESS SITE 1
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 371 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 372

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 372 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 373

```text
        PECVDDataSmall.drop(columns=['Thickness Unit'], inplace=True)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 373 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `blank` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 374

```text
        PECVDDataSmall.to_csv(os.path.join(DATA_DIR, 'small_PECVD_DataCollection.csv'))
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 374 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 375

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 375 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `filesystem` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 376

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 376 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `blank` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 377

```text
def saveDenton635():
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 377 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 378

```text
    print('Saving Denton635')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 378 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `function` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 379

```text
    ensureExists('Denton635_DataCollection.csv')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 379 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 380

```text
    Denton635Data = retrieveData('Denton635')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 380 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `generic` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 381

```text
    if changedData('Denton635_DataCollection.csv', Denton635Data):
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 381 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `assignment` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 382

```text
        Denton635Data.to_csv(os.path.join(DATA_DIR, 'Denton635_DataCollection.csv'))
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 382 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `branch` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 383

```text
        columns_to_keep = ['submission_id','submitter_name','form_data.DENTON635_Substrate','form_data.DENTON635_SubstrateOther', 'form_data.DENTON635_MasterRecipe','form_data.DENTON635_DuplicateRuns',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 383 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `filesystem` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 384

```text
                           'form_data.DENTON635_BasePressVal','form_data.DENTON635_BasePressUnit','form_data.DENTON635_Clean_RFPower','form_data.DENTON635_Clean_RFTime',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 384 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 385

```text
                           'form_data.DENTON635_DepRecipe1','form_data.DENTON635_Mat1_Target','form_data.DENTON635_Mat1_OthTarget','form_data.DENTON635_Mat1_PreSputTime',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 385 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 386

```text
                           'form_data.DENTON635_Mat1_SputterTime','form_data.DENTON635_Mat1_SputterPower','form_data.DENTON635_Mat1_ChamberPress',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 386 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 387

```text
                           'form_data.DENTON635_Mat1_ArFlow','form_data.DENTON635_Mat1_N2Flow','form_data.DENTON635_Mat1_O2Flow',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 387 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 388

```text
                           'form_data.DENTON635_DepRecipe2','form_data.DENTON635_Mat2_Target','form_data.DENTON635_Mat2_OthTarget','form_data.DENTON635_Mat2_PreSputTime',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 388 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 389

```text
                           'form_data.DENTON635_Mat2_SputterTime','form_data.DENTON635_Mat2_SputterPower','form_data.DENTON635_Mat2_ChamberPress',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 389 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 390

```text
                           'form_data.DENTON635_Mat2_ArFlow','form_data.DENTON635_Mat2_N2Flow','form_data.DENTON635_Mat2_O2Flow',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 390 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 391

```text
                           'form_data.DENTON635_DepRecipe3','form_data.DENTON635_Mat3_Target','form_data.DENTON635_Mat3_OthTarget','form_data.DENTON635_Mat3_PreSputTime',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 391 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 392

```text
                           'form_data.DENTON635_Mat3_SputterTime','form_data.DENTON635_Mat3_SputterPower','form_data.DENTON635_Mat3_ChamberPress',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 392 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 393

```text
                           'form_data.DENTON635_Mat3_ArFlow','form_data.DENTON635_Mat3_N2Flow','form_data.DENTON635_Mat3_O2Flow',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 393 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 394

```text
                           'form_data.DENTON635_DepRecipe4','form_data.DENTON635_Mat4_Target','form_data.DENTON635_Mat4_OthTarget','form_data.DENTON635_Mat4_PreSputTime',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 394 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 395

```text
                           'form_data.DENTON635_Mat4_SputterTime','form_data.DENTON635_Mat4_SputterPower','form_data.DENTON635_Mat4_ChamberPress',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 395 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 396

```text
                           'form_data.DENTON635_Mat4_ArFlow','form_data.DENTON635_Ma4_N2Flow','form_data.DENTON635_Mat4_O2Flow',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 396 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 397

```text
                           'form_data.DENTON635_TotalThick','form_data.DENTON635_ThickUnit','form_data.DENTON635_Stress','form_data.DENTON635_SheetRho',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 397 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 398

```text
                           'form_data.DENTON635_CryoTemp','form_data.DENTON635_Mat1_PowerSupply','form_data.DENTON635_Mat2_PowerSupply','form_data.DENTON635_Mat3_PowerSupply',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 398 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 399

```text
                           'form_data.DENTON635_Mat4_PowerSupply','form_data.DENTON635_Resistivity']
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 399 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 400

```text
        Denton635DataSmall = Denton635Data[columns_to_keep]
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 400 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 401

```text
        Denton635DataSmall = Denton635DataSmall.rename(columns={'form_data.DENTON635_Substrate': 'Substrate', 'form_data.DENTON635_SubstrateOther': 'Other Substrate', 'form_data.DENTON635_MasterRecipe': 'Master Recipe',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 401 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 402

```text
                                                                'form_data.DENTON635_DuplicateRuns': 'Duplicate Runs','form_data.DENTON635_BasePressVal': 'Base Pressure', 'form_data.DENTON635_BasePressUnit': 'Base Pressure Unit',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 402 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 403

```text
                                                                'form_data.DENTON635_Clean_RFPower': 'Clean RF Power', 'form_data.DENTON635_Clean_RFTime': 'Clean RF Time',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 403 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 404

```text
                                                                'form_data.DENTON635_DepRecipe1': 'Deposition Recipe 1', 'form_data.DENTON635_Mat1_Target': 'Material 1 Target',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 404 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 405

```text
                                                                'form_data.DENTON635_Mat1_OthTarget': 'Other Material 1 Target', 'form_data.DENTON635_Mat1_PreSputTime': 'Material 1 Pre-Sputter Time',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 405 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 406

```text
                                                                'form_data.DENTON635_Mat1_SputterTime': 'Material 1 Sputter Time', 'form_data.DENTON635_Mat1_SputterPower': 'Material 1 Sputter Power',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 406 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 407

```text
                                                                'form_data.DENTON635_Mat1_ChamberPress': 'Material 1 Chamber Pressure','form_data.DENTON635_Mat1_ArFlow': 'Material 1 Argon Flow',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 407 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 408

```text
                                                                'form_data.DENTON635_Mat1_N2Flow': 'Material 1 Nitrogen Flow', 'form_data.DENTON635_Mat1_O2Flow': 'Material 1 Oxygen Flow',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 408 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 409

```text
                                                                'form_data.DENTON635_DepRecipe2': 'Deposition Recipe 2', 'form_data.DENTON635_Mat2_Target': 'Material 2 Target',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 409 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 410

```text
                                                                'form_data.DENTON635_Mat2_OthTarget': 'Other Material 2 Target', 'form_data.DENTON635_Mat2_PreSputTime': 'Material 2 Pre-Sputter Time',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 410 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 411

```text
                                                                'form_data.DENTON635_Mat2_SputterTime': 'Material 2 Sputter Time', 'form_data.DENTON635_Mat2_SputterPower': 'Material 2 Sputter Power',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 411 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 412

```text
                                                                'form_data.DENTON635_Mat2_ChamberPress': 'Material 2 Chamber Pressure', 'form_data.DENTON635_Mat2_ArFlow': 'Material 2 Argon Flow',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 412 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 413

```text
                                                                'form_data.DENTON635_Mat2_N2Flow': 'Material 2 Nitrogen', 'form_data.DENTON635_Mat2_O2Flow': 'Material 2 Oxygen Flow',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 413 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 414

```text
                                                                'form_data.DENTON635_DepRecipe3': 'Deposition Recipe 3','form_data.DENTON635_Mat3_Target': 'Material 3 Target',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 414 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 415

```text
                                                                'form_data.DENTON635_Mat3_OthTarget': 'Other Material 3 Target', 'form_data.DENTON635_Mat3_PreSputTime': 'Material 3 Pre-Sputter Time',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 415 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 416

```text
                                                                'form_data.DENTON635_Mat3_SputterTime': 'Material 3 Sputter Time', 'form_data.DENTON635_Mat3_SputterPower': 'Material 3 Sputter Power',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 416 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 417

```text
                                                                'form_data.DENTON635_Mat3_ChamberPress': 'Material 3 Chamber Pressure','form_data.DENTON635_Mat3_ArFlow': 'Material 3 Argon Flow',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 417 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 418

```text
                                                                'form_data.DENTON635_Mat3_N2Flow': 'Material 3 Nitrogen Flow', 'form_data.DENTON635_Mat3_O2Flow': 'Material 3 Oxygen Flow',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 418 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 419

```text
                                                                'form_data.DENTON635_DepRecipe4': 'Deposition Recipe 4','form_data.DENTON635_Mat4_Target': 'Material 4 Target',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 419 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 420

```text
                                                                'form_data.DENTON635_Mat4_OthTarget': 'Other Material 4 Target', 'form_data.DENTON635_Mat4_PreSputTime': 'Material 4 Pre-Sputter Time',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 420 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 421

```text
                                                                'form_data.DENTON635_Mat4_SputterTime': 'Material 4 Sputter Time', 'form_data.DENTON635_Mat4_SputterPower': 'Material 4 Sputter Power',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 421 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 422

```text
                                                                'form_data.DENTON635_Mat4_ChamberPress': 'Material 4 Chamber Pressure','form_data.DENTON635_Mat4_ArFlow': 'Material 4 Argon Flow',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 422 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 423

```text
                                                                'form_data.DENTON635_Ma4_N2Flow': 'Material 4 Nitrogen Flow', 'form_data.DENTON635_Mat4_O2Flow': 'Material 4 Oxygen Flow',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 423 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 424

```text
                                                                'form_data.DENTON635_TotalThick': 'Total Thickness', 'form_data.DENTON635_ThickUnit': 'Thickness Unit', 'form_data.DENTON635_Stress': 'Stress',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 424 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 425

```text
                                                                'form_data.DENTON635_SheetRho': 'Sheet Resistivity','form_data.DENTON635_CryoTemp': 'Cryo Temp',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 425 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 426

```text
                                                                'form_data.DENTON635_Mat1_PowerSupply': 'Material 1 Power Supply', 'form_data.DENTON635_Mat2_PowerSupply': 'Material 2 Power Supply',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 426 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 427

```text
                                                                'form_data.DENTON635_Mat3_PowerSupply': 'Material 3 Power Supply','form_data.DENTON635_Mat4_PowerSupply': 'Material 4 Power Supply',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 427 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 428

```text
                                                                'form_data.DENTON635_Resistivity': 'Resistivity'})
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 428 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 429

```text
        #manipulate data from Denton635
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 429 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `generic` and next kind is `loop`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 430

```text
        for index, row in Denton635DataSmall.iterrows():
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 430 is classified as `loop`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 431

```text
            #Shortens chars from substrate used
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 431 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `loop` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 432

```text
            sub = shortenStr(row['Substrate'],20)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 432 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 433

```text
            #handles "other" film, if nothing is entered, it will be marked as unknown
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 433 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 434

```text
            Denton635DataSmall.at[index, 'Substrate'] = combineCells(sub, row['Other Substrate'])
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 434 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 435

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 435 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 436

```text
            #Normalize Pressure around -6
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 436 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 437

```text
            powerFactor = shortenStr(row['Base Pressure Unit'], 25)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 437 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 438

```text
            if powerFactor != 'Unknown' and powerFactor != '':
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 438 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 439

```text
                Denton635DataSmall['Base Pressure'] = Denton635DataSmall['Base Pressure'].astype(float)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 439 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `branch` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 440

```text
                Denton635DataSmall.at[index, 'Base Pressure'] = row['Base Pressure'] * 10**(int(powerFactor) +6)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 440 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 441

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 441 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 442

```text
            #Shortens chars from material targets
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 442 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 443

```text
            mat1 = shortenStr(row['Material 1 Target'], 18)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 443 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 444

```text
            Denton635DataSmall.at[index, 'Material 1 Target'] = combineCells(mat1, row['Other Material 1 Target'])
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 444 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 445

```text
            mat2 = shortenStr(row['Material 2 Target'], 18)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 445 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 446

```text
            Denton635DataSmall.at[index, 'Material 2 Target'] = combineCells(mat2, row['Other Material 2 Target'])
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 446 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 447

```text
            mat3 = shortenStr(row['Material 3 Target'], 18)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 447 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 448

```text
            Denton635DataSmall.at[index, 'Material 3 Target'] = combineCells(mat3, row['Other Material 3 Target'])
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 448 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 449

```text
            mat4 = shortenStr(row['Material 4 Target'], 18)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 449 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 450

```text
            Denton635DataSmall.at[index, 'Material 4 Target'] = combineCells(mat4, row['Other Material 4 Target'])
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 450 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 451

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 451 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 452

```text
            #Normalize Thickness on nm
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 452 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 453

```text
            if row['Thickness Unit'] == 'DENTON635_ThickUnit_Ang':
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 453 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 454

```text
                Denton635DataSmall.at[index, 'Total Thickness'] = int(row['Total Thickness']) / 10
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 454 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `branch` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 455

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 455 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 456

```text
            #Shorten Chars from Power Supply
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 456 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 457

```text
            power1 = shortenStr(row['Material 1 Power Supply'], 27)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 457 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 458

```text
            Denton635DataSmall.at[index, 'Material 1 Power Supply'] = power1
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 458 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 459

```text
            power2 = shortenStr(row['Material 2 Power Supply'], 27)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 459 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 460

```text
            Denton635DataSmall.at[index, 'Material 2 Power Supply'] = power2
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 460 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 461

```text
            power3 = shortenStr(row['Material 3 Power Supply'], 27)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 461 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 462

```text
            Denton635DataSmall.at[index, 'Material 3 Power Supply'] = power3
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 462 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 463

```text
            power4 = shortenStr(row['Material 4 Power Supply'], 27)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 463 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 464

```text
            Denton635DataSmall.at[index, 'Material 4 Power Supply'] = power4
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 464 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 465

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 465 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 466

```text
        #remove unneeded columns and save
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 466 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 467

```text
        Denton635DataSmall.drop(columns=['Other Substrate', 'Base Pressure Unit', 'Other Material 1 Target','Other Material 2 Target',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 467 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 468

```text
                                         'Other Material 3 Target','Other Material 4 Target'], inplace=True)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 468 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 469

```text
        Denton635DataSmall.to_csv(os.path.join(DATA_DIR, 'small_Denton635_DataCollection.csv'))
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 469 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 470

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 470 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `filesystem` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 471

```text
def saveDenton18():
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 471 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 472

```text
    print('Saving Denton18')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 472 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `function` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 473

```text
    ensureExists('Denton18_DataCollection.csv')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 473 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 474

```text
    Denton18Data = retrieveData('Denton18')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 474 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `generic` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 475

```text
    if changedData('Denton18_DataCollection.csv', Denton18Data):
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 475 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `assignment` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 476

```text
        Denton18Data.to_csv(os.path.join(DATA_DIR, 'Denton18_DataCollection.csv'))
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 476 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `branch` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 477

```text
        columns_to_keep = ['submission_id','submitter_name','form_data.DENTON18_Substrate','form_data.DENTON18_SubstrateOther','form_data.DENTON18_TgtChng','form_data.DENTON18_NoRuns',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 477 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `filesystem` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 478

```text
                           'form_data.DENTON18_CryoTemp','form_data.DENTON18_BasePressVal','form_data.DENTON18_BasePressUnit',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 478 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 479

```text
                           'form_data.DENTON18_Mat1_Target','form_data.DENTON18_Mat1_OthTarget','form_data.DENTON18_Mat1_PowerSupply','form_data.DENTON18_Mat1_SputPower','form_data.DENTON18_Mat1_PreSputTime',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 479 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 480

```text
                           'form_data.DENTON18_Mat1_SputTime','form_data.DENTON18_Mat1_ArSputPress','form_data.DENTON18_Mat1_ArFlow','form_data.DENTON18_Mat1_O2Flow',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 480 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 481

```text
                           'form_data.DENTON18_Mat2_Target','form_data.DENTON18_Mat2_OthTarget','form_data.DENTON18_Mat2_SputPower','form_data.DENTON18_Mat2_PreSputTime',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 481 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 482

```text
                           'form_data.DENTON18_Mat2_SputTime','form_data.DENTON18_Mat2_ArSputPress','form_data.DENTON18_Mat2_ArFlow','form_data.DENTON18_Mat2_O2Flow',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 482 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 483

```text
                           'form_data.DENTON18_Mat3_Target','form_data.DENTON18_Mat3_OthTarget','form_data.DENTON18_Mat3_SputPower','form_data.DENTON18_Mat3_PreSputTime',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 483 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 484

```text
                            'form_data.DENTON18_Mat3_SputTime','form_data.DENTON18_Mat3_ArSputPress','form_data.DENTON18_Mat3_ArFlow','form_data.DENTON18_Mat3_O2Flow',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 484 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 485

```text
                            'form_data.DENTON18_ThickUnit','form_data.DENTON18_Thick1','form_data.DENTON18_Thick2','form_data.DENTON18_Thick3','form_data.DENTON18_Thick4','form_data.DENTON18_Thick5',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 485 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 486

```text
                            'form_data.DENTON18_FilmStress','form_data.DENTON18_SheetRho1','form_data.DENTON18_SheetRho2','form_data.DENTON18_SheetRho3','form_data.DENTON18_SheetRho4','form_data.DENTON18_SheetRho5']
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 486 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 487

```text
        Denton18DataSmall = Denton18Data[columns_to_keep]
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 487 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 488

```text
        Denton18DataSmall = Denton18DataSmall.rename(columns={'form_data.DENTON18_Substrate': 'Substrate', 'form_data.DENTON18_SubstrateOther': 'Other Substrate', 'form_data.DENTON18_TgtChng': 'Target Change',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 488 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 489

```text
                                                            'form_data.DENTON18_NoRuns': 'Number of Runs', 'form_data.DENTON18_CryoTemp': 'Cryo Temp', 'form_data.DENTON18_BasePressVal': 'Base Pressure','form_data.DENTON18_BasePressUnit': 'Base Pressure Unit',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 489 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 490

```text
                                                            'form_data.DENTON18_Mat1_Target': 'Material 1 Target', 'form_data.DENTON18_Mat1_OthTarget': 'Other Material 1 Target','form_data.DENTON18_Mat1_PowerSupply': 'Material 1 Power Supply',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 490 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 491

```text
                                                            'form_data.DENTON18_Mat1_SputPower': 'Material 1 Sputter Power', 'form_data.DENTON18_Mat1_PreSputTime': 'Material 1 Pre-Sputter Time','form_data.DENTON18_Mat1_SputTime': 'Material 1 Sputter Time',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 491 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 492

```text
                                                            'form_data.DENTON18_Mat1_ArSputPress': 'Material 1 Argon Sputter Pressure', 'form_data.DENTON18_Mat1_ArFlow': 'Material 1 Argon Flow','form_data.DENTON18_Mat1_O2Flow': 'Material 1 Oxygen Flow',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 492 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 493

```text
                                                            'form_data.DENTON18_Mat2_Target': 'Material 2 Target', 'form_data.DENTON18_Mat2_OthTarget': 'Other Material 2 Target',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 493 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 494

```text
                                                            'form_data.DENTON18_Mat2_SputPower': 'Material 2 Sputter Power', 'form_data.DENTON18_Mat2_PreSputTime': 'Material 2 Pre-Sputter Time','form_data.DENTON18_Mat2_SputTime': 'Material 2 Sputter Time',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 494 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 495

```text
                                                            'form_data.DENTON18_Mat2_ArSputPress': 'Material 2 Argon Sputter Pressure', 'form_data.DENTON18_Mat2_ArFlow': 'Material 2 Argon Flow','form_data.DENTON18_Mat2_O2Flow': 'Material 2 Oxygen Flow',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 495 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 496

```text
                                                            'form_data.DENTON18_Mat3_Target': 'Material 3 Target', 'form_data.DENTON18_Mat3_OthTarget': 'Other Material 3 Target',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 496 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 497

```text
                                                            'form_data.DENTON18_Mat3_SputPower': 'Material 3 Sputter Power', 'form_data.DENTON18_Mat3_PreSputTime': 'Material 3 Pre-Sputter Time','form_data.DENTON18_Mat3_SputTime': 'Material 3 Sputter Time',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 497 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 498

```text
                                                            'form_data.DENTON18_Mat3_ArSputPress': 'Material 3 Argon Sputter Pressure', 'form_data.DENTON18_Mat3_ArFlow': 'Material 3 Argon Flow','form_data.DENTON18_Mat3_O2Flow': 'Material 3 Oxygen Flow',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 498 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 499

```text
                                                            'form_data.DENTON18_ThickUnit': 'Thickness Unit', 'form_data.DENTON18_Thick1': 'Thickness 1','form_data.DENTON18_Thick2': 'Thickness 2', 'form_data.DENTON18_Thick3': 'Thickness 3',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 499 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 500

```text
                                                            'form_data.DENTON18_Thick4': 'Thickness 4', 'form_data.DENTON18_Thick5': 'Thickness 5','form_data.DENTON18_FilmStress': 'Film Stress', 'form_data.DENTON18_SheetRho1': 'Sheet Resistivity 1',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 500 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 501

```text
                                                            'form_data.DENTON18_SheetRho2': 'Sheet Resistivity 2','form_data.DENTON18_SheetRho3': 'Sheet Resistivity 3', 'form_data.DENTON18_SheetRho4': 'Sheet Resistivity 4', 'form_data.DENTON18_SheetRho5': 'Sheet Resistivity 5'})
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 501 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 502

```text
        #manipulate data from Denton18
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 502 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `generic` and next kind is `loop`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 503

```text
        for index, row in Denton18DataSmall.iterrows():
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 503 is classified as `loop`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 504

```text
            #Shortens chars from substrate used
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 504 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `loop` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 505

```text
            sub = shortenStr(row['Substrate'],19)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 505 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 506

```text
            #handles "other" film, if nothing is entered, it will be marked as unknown
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 506 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 507

```text
            Denton18DataSmall.at[index, 'Substrate'] = combineCells(sub, row['Other Substrate'])
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 507 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 508

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 508 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 509

```text
            #remove characters from target change
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 509 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 510

```text
            target = shortenStr(row['Target Change'], 19)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 510 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 511

```text
            Denton18DataSmall.at[index, 'Target Change'] = target
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 511 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 512

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 512 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 513

```text
            #Normalize Pressure around -6
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 513 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 514

```text
            powerFactor = shortenStr(row['Base Pressure Unit'], 17)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 514 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 515

```text
            if powerFactor != 'Unknown' and powerFactor != '':
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 515 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 516

```text
                #converts column if int
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 516 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `branch` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 517

```text
                Denton18DataSmall['Base Pressure'] = Denton18DataSmall['Base Pressure'].astype(float)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 517 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 518

```text
                Denton18DataSmall.at[index, 'Base Pressure'] = row['Base Pressure'] * 10**(int(powerFactor) +6)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 518 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 519

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 519 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 520

```text
            #Shortens chars from material targets
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 520 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 521

```text
            mat1 = shortenStr(row['Material 1 Target'], 17)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 521 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 522

```text
            Denton18DataSmall.at[index, 'Material 1 Target'] = combineCells(mat1, row['Other Material 1 Target'])
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 522 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 523

```text
            mat2 = shortenStr(row['Material 2 Target'], 17)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 523 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 524

```text
            Denton18DataSmall.at[index, 'Material 2 Target'] = combineCells(mat2, row['Other Material 2 Target'])
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 524 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 525

```text
            mat3 = shortenStr(row['Material 3 Target'], 17)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 525 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 526

```text
            Denton18DataSmall.at[index, 'Material 3 Target'] = combineCells(mat3, row['Other Material 3 Target'])
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 526 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 527

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 527 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 528

```text
            #Shorten Chars from Power Supply
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 528 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 529

```text
            power1 = shortenStr(row['Material 1 Power Supply'], 26)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 529 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 530

```text
            Denton18DataSmall.at[index, 'Material 1 Power Supply'] = power1
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 530 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 531

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 531 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 532

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 532 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 533

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 533 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 534

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 534 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 535

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 535 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `blank` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 536

```text
            #Normalize Thickness on nm
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 536 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 537

```text
            if row['Thickness Unit'] == 'DENTON18_ThickUnit_Ang':
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 537 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 538

```text
                Denton18DataSmall.at[index, 'Thickness 1'] = (row['Thickness 1']) / 10
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 538 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `branch` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 539

```text
                #occasionally, the thickness is not a number. If it isn't, it will be marked as NaN
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 539 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 540

```text
                #TODO VERIFY
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 540 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 541

```text
                t1 = pd.to_numeric(row['Thickness 1'], errors='coerce')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 541 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 542

```text
                t2 = pd.to_numeric(row['Thickness 2'], errors='coerce')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 542 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 543

```text
                t3 = pd.to_numeric(row['Thickness 3'], errors='coerce')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 543 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 544

```text
                t4 = pd.to_numeric(row['Thickness 4'], errors='coerce')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 544 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 545

```text
                t5 = pd.to_numeric(row['Thickness 5'], errors='coerce')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 545 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 546

```text
                Denton18DataSmall.at[index, 'Thickness 1'] = t1 / 10 if pd.notna(t1) else np.nan
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 546 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 547

```text
                Denton18DataSmall.at[index, 'Thickness 2'] = t2 / 10 if pd.notna(t2) else np.nan
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 547 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 548

```text
                Denton18DataSmall.at[index, 'Thickness 3'] = t3 / 10 if pd.notna(t3) else np.nan
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 548 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 549

```text
                Denton18DataSmall.at[index, 'Thickness 4'] = t4 / 10 if pd.notna(t4) else np.nan
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 549 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 550

```text
                Denton18DataSmall.at[index, 'Thickness 5'] = t5 / 10 if pd.notna(t5) else np.nan
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 550 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 551

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 551 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 552

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 552 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 553

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 553 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `blank` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 554

```text
        #remove unneeded columns and save
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 554 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 555

```text
        Denton18DataSmall.drop(columns=['Other Substrate', 'Base Pressure Unit', 'Other Material 1 Target','Other Material 2 Target','Other Material 3 Target','Thickness Unit'], inplace=True)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 555 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 556

```text
        Denton18DataSmall.to_csv(os.path.join(DATA_DIR, 'small_Denton18_DataCollection.csv'))
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 556 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 557

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 557 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `filesystem` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 558

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 558 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `blank` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 559

```text
def saveTMV():
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 559 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 560

```text
    print('Saving TMV')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 560 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `function` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 561

```text
    ensureExists('TMV_DataCollection.csv')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 561 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 562

```text
    TMVData = retrieveData('TMV')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 562 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `generic` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 563

```text
    if changedData('TMV_DataCollection.csv', TMVData):
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 563 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `assignment` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 564

```text
        TMVData.to_csv(os.path.join(DATA_DIR, 'TMV_DataCollection.csv'))
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 564 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `branch` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 565

```text
        columns_to_keep = ['submission_id','submitter_name','form_data.TMV_Substrate','form_data.TMV_OthSubstrate','form_data.TMV_SampleHolders','form_data.TMV_DupRuns',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 565 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `filesystem` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 566

```text
                           'form_data.TMV_ChamberPumpTime','form_data.TMV_BasePressVal','form_data.TMV_BasePressUnit',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 566 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 567

```text
                           'form_data.TMV_S1Chuck','form_data.TMV_S1Material','form_data.TMV_S1PowerSupply','form_data.TMV_S1PreSputTime','form_data.TMV_S1PreSputPower',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 567 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 568

```text
                           'form_data.TMV_S1SputTime','form_data.TMV_S1SputPower','form_data.TMV_S1SputDepPress', 'form_data.TMV_S1ArgonFlow','form_data.TMV_S1O2Flow',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 568 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 569

```text
                           'form_data.TMV_S2Chuck','form_data.TMV_S2Material','form_data.TMV_S2PowerSupply','form_data.TMV_S2PreSputTime','form_data.TMV_S2PreSputPower',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 569 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 570

```text
                           'form_data.TMV_S2SputTime','form_data.TMV_S2SputPower','form_data.TMV_S2SputDepPress', 'form_data.TMV_S2ArgonFlow','form_data.TMV_S2O2Flow',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 570 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 571

```text
                           'form_data.TMV_S3Chuck','form_data.TMV_S3Material','form_data.TMV_S3PowerSupply','form_data.TMV_S3PreSputTime',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 571 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 572

```text
                           'form_data.TMV_S3SputTime','form_data.TMV_S3SputPower','form_data.TMV_S3SputDepPress', 'form_data.TMV_S3ArgonFlow','form_data.TMV_S3O2Flow',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 572 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 573

```text
                           'form_data.TMV_S4Material','form_data.TMV_S4PowerSupply','form_data.TMV_S4PreSputTime','form_data.TMV_S4SputTime',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 573 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 574

```text
                           'form_data.TMV_ThickUnit','form_data.TMV_Thick']
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 574 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 575

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 575 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 576

```text
        TMVDataSmall = TMVData[columns_to_keep]
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 576 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 577

```text
        TMVDataSmall = TMVDataSmall.rename(columns={'form_data.TMV_Substrate': 'Substrate', 'form_data.TMV_OthSubstrate': 'Other Substrate',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 577 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 578

```text
                                                    'form_data.TMV_SampleHolders': 'Sample Holders','form_data.TMV_DupRuns': 'Duplicate Runs',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 578 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 579

```text
                                                    'form_data.TMV_ChamberPumpTime': 'Chamber Pump Time', 'form_data.TMV_BasePressVal': 'Base Pressure',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 579 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 580

```text
                                                    'form_data.TMV_BasePressUnit': 'Base Pressure Unit',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 580 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 581

```text
                                                    'form_data.TMV_S1Chuck': 'Sample 1 Chuck', 'form_data.TMV_S1Material': 'Sample 1 Material','form_data.TMV_S1PowerSupply': 'Sample 1 Power Supply',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 581 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 582

```text
                                                    'form_data.TMV_S1PreSputTime': 'Sample 1 Pre-Sputter Time', 'form_data.TMV_S1PreSputPower': 'Sample 1 Pre-Sputter Power',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 582 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 583

```text
                                                    'form_data.TMV_S1SputTime': 'Sample 1 Sputter Time', 'form_data.TMV_S1SputPower': 'Sample 1 Sputter Power',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 583 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 584

```text
                                                    'form_data.TMV_S1SputDepPress': 'Sample 1 Sputter Deposition Pressure','form_data.TMV_S1ArgonFlow': 'Sample 1 Argon Flow', 'form_data.TMV_S1O2Flow': 'Sample 1 Oxygen Flow',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 584 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 585

```text
                                                    'form_data.TMV_S2Chuck': 'Sample 2 Chuck','form_data.TMV_S2Material': 'Sample 2 Material', 'form_data.TMV_S2PowerSupply': 'Sample 2 Power Supply',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 585 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 586

```text
                                                    'form_data.TMV_S2PreSputTime': 'Sample 2 Pre-Sputter Time','form_data.TMV_S2PreSputPower': 'Sample 2 Pre-Sputter Power',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 586 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 587

```text
                                                    'form_data.TMV_S2SputTime': 'Sample 2 Sputter Time', 'form_data.TMV_S2SputPower': 'Sample 2 Sputter Power',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 587 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 588

```text
                                                    'form_data.TMV_S2SputDepPress': 'Sample 2 Sputter Deposition Pressure', 'form_data.TMV_S2ArgonFlow': 'Sample 2 Argon Flow', 'form_data.TMV_S2O2Flow': 'Sample 2 Oxygen Flow',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 588 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 589

```text
                                                    'form_data.TMV_S3Chuck': 'Sample 3 Chuck', 'form_data.TMV_S3Material': 'Sample 3 Material', 'form_data.TMV_S3PowerSupply': 'Sample 3 Power Supply',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 589 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 590

```text
                                                    'form_data.TMV_S3PreSputTime': 'Sample 3 Pre-Sputter Time', 'form_data.TMV_S3PreSputPower': 'Sample 3 Pre-Sputter Power',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 590 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 591

```text
                                                    'form_data.TMV_S3SputTime': 'Sample 3 Sputter Time', 'form_data.TMV_S3SputPower': 'Sample 3 Sputter Power',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 591 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 592

```text
                                                    'form_data.TMV_S3SputDepPress': 'Sample 3 Sputter Deposition Pressure', 'form_data.TMV_S3ArgonFlow': 'Sample 3 Argon Flow','form_data.TMV_S3O2Flow': 'Sample 3 Oxygen Flow',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 592 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 593

```text
                                                    'form_data.TMV_S4Chuck': 'Sample 4 Chuck', 'form_data.TMV_S4Material': 'Sample 4 Material','form_data.TMV_S4PowerSupply': 'Sample 4 Power Supply',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 593 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 594

```text
                                                    'form_data.TMV_S4PreSputTime': 'Sample 4 Pre-Sputter Time', 'form_data.TMV_S4PreSputPower': 'Sample 4 Pre-Sputter Power',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 594 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 595

```text
                                                    'form_data.TMV_S4SputTime': 'Sample 4 Sputter Time', 'form_data.TMV_S4SputPower': 'Sample 4 Sputter Power',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 595 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 596

```text
                                                    'form_data.TMV_S4SputDepPress': 'Sample 4 Sputter Deposition Pressure','form_data.TMV_S4ArgonFlow': 'Sample 4 Argon Flow', 'form_data.TMV_S4O2Flow': 'Sample 4 Oxygen Flow',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 596 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 597

```text
                                                    'form_data.TMV_ThickUnit': 'Thickness Unit', 'form_data.TMV_Thick': 'Thickness'})
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 597 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 598

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 598 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 599

```text
        #manipulate data from TMV
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 599 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 600

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 600 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `loop`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 601

```text
        for index, row in TMVDataSmall.iterrows():
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 601 is classified as `loop`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones. Neighbor context: previous kind is `blank` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 602

```text
            #shortens chars from substrate used
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 602 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `loop` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 603

```text
            sub = shortenStr(row['Substrate'], 14)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 603 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 604

```text
            #handles "other" film, if nothing is entered, it will be marked as unknown
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 604 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 605

```text
            TMVDataSmall.at[index, 'Substrate'] = combineCells(sub, row['Other Substrate'])
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 605 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 606

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 606 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 607

```text
            #normalize Pressure around -6
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 607 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 608

```text
            powerFactor = shortenStr(row['Base Pressure Unit'], 19)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 608 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 609

```text
            if powerFactor != 'Unknown' and powerFactor != '':
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 609 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 610

```text
                #converts pressure column to a float, it automatically resolves as an int for some reason
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 610 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `branch` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 611

```text
                TMVDataSmall['Base Pressure'] = TMVDataSmall['Base Pressure'].astype(float)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 611 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 612

```text
                TMVDataSmall['Sample 1 Sputter Deposition Pressure'] = TMVDataSmall['Sample 1 Sputter Deposition Pressure'].astype(float)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 612 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 613

```text
                TMVDataSmall['Sample 2 Sputter Deposition Pressure'] = TMVDataSmall['Sample 2 Sputter Deposition Pressure'].astype(float)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 613 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 614

```text
                TMVDataSmall['Sample 3 Sputter Deposition Pressure'] = TMVDataSmall['Sample 3 Sputter Deposition Pressure'].astype(float)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 614 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 615

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 615 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 616

```text
                TMVDataSmall.at[index, 'Base Pressure'] = row['Base Pressure'] * 10**(int(powerFactor) +6)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 616 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 617

```text
                TMVDataSmall.at[index, 'Sample 1 Sputter Deposition Pressure'] = row['Sample 1 Sputter Deposition Pressure'] * 10**(int(powerFactor) +6)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 617 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 618

```text
                TMVDataSmall.at[index, 'Sample 2 Sputter Deposition Pressure'] = row['Sample 2 Sputter Deposition Pressure'] * 10**(int(powerFactor) +6)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 618 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 619

```text
                TMVDataSmall.at[index, 'Sample 3 Sputter Deposition Pressure'] = row['Sample 3 Sputter Deposition Pressure'] * 10**(int(powerFactor) +6)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 619 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 620

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 620 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 621

```text
            #Shortens chars from material targets
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 621 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 622

```text
            mat1 = shortenStr(row['Sample 1 Material'], 15)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 622 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 623

```text
            TMVDataSmall.at[index, 'Sample 1 Material'] = mat1
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 623 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 624

```text
            mat2 = shortenStr(row['Sample 2 Material'], 15)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 624 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 625

```text
            TMVDataSmall.at[index, 'Sample 2 Material'] = mat2
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 625 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 626

```text
            mat3 = shortenStr(row['Sample 3 Material'], 15)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 626 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 627

```text
            TMVDataSmall.at[index, 'Sample 3 Material'] = mat3
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 627 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 628

```text
            mat4 = shortenStr(row['Sample 4 Material'], 15)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 628 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 629

```text
            TMVDataSmall.at[index, 'Sample 4 Material'] = mat4
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 629 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 630

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 630 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 631

```text
            #Shorten Chars from Power Supply
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 631 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 632

```text
            power1 = shortenStr(row['Sample 1 Power Supply'], 19)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 632 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 633

```text
            TMVDataSmall.at[index, 'Sample 1 Power Supply'] = power1
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 633 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 634

```text
            power2 = shortenStr(row['Sample 2 Power Supply'], 19)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 634 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 635

```text
            TMVDataSmall.at[index, 'Sample 2 Power Supply'] = power2
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 635 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 636

```text
            power3 = shortenStr(row['Sample 3 Power Supply'], 19)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 636 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 637

```text
            TMVDataSmall.at[index, 'Sample 3 Power Supply'] = power3
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 637 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 638

```text
            power4 = shortenStr(row['Sample 4 Power Supply'], 19)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 638 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 639

```text
            TMVDataSmall.at[index, 'Sample 4 Power Supply'] = power4
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 639 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 640

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 640 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 641

```text
            #Normalize Thickness on nm
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 641 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 642

```text
            if row['Thickness Unit'] == 'TMV_ThickUnit_Ang':
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 642 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 643

```text
                TMVDataSmall.at[index, 'Thickness'] = int(row['Thickness']) / 10
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 643 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `branch` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 644

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 644 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 645

```text
        #remove unneeded columns and save
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 645 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 646

```text
        TMVDataSmall.drop(columns=['Other Substrate', 'Base Pressure Unit'], inplace=True)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 646 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 647

```text
        TMVDataSmall.to_csv(os.path.join(DATA_DIR, 'small_TMV_DataCollection.csv'))
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 647 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 648

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 648 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `filesystem` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 649

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 649 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 650

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 650 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `blank` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 651

```text
def saveDRIE():
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 651 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 652

```text
    print('Saving DRIE')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 652 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `function` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 653

```text
    ensureExists('DRIE_DataCollection.csv')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 653 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 654

```text
    DRIEData = retrieveData('DRIE')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 654 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `generic` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 655

```text
    if changedData('DRIE_DataCollection.csv', DRIEData):
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 655 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `assignment` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 656

```text
        DRIEData.to_csv(os.path.join(DATA_DIR, 'DRIE_DataCollection.csv'))
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 656 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `branch` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 657

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 657 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `filesystem` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 658

```text
        columns_to_keep = ['submission_id','submitter_name','form_data.OXFORD100_Recipe','form_data.OXFORD100_SubstrateSize', 'form_data.OXFORD100_AreaEtched','form_data.OXFORD100_EtchPress','form_data.OXFORD100_HeBackPress',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 658 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 659

```text
                           'form_data.OXFORD100_CF4','form_data.OXFORD100_SF6','form_data.OXFORD100_DRIEDepTime','form_data.OXFORD100_DRIEEtchTime','form_data.OXFORD100_TotalEtchTime','form_data.OXFORD100_ICPForward',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 659 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 660

```text
                           'form_data.OXFORD100_RFCCP','form_data.OXFORD100_RFBias','form_data.OXFORD100_ChuckTemp','form_data.OXFORD100_ContPlasma','form_data.OXFORD100_EtchDepth1','form_data.OXFORD100_EtchDepth2',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 660 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 661

```text
                            'form_data.OXFORD100_EtchDepth3','form_data.OXFORD100_EtchDepth4','form_data.OXFORD100_EtchDepth5','form_data.OXFORD100_C4F8','form_data.OXFORD100_O2','form_data.OXFORD100_DRIECycles',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 661 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 662

```text
                            'form_data.OXFORD100_Helium','form_data.OXFORD100_PRPreThick','form_data.OXFORD100_PRPostThick','form_data.OXFORD100_N2','form_data.OXFORD100_Argon','form_data.OXFORD100_AspectRatio']
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 662 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 663

```text
        DRIEDataSmall = DRIEData[columns_to_keep]
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 663 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 664

```text
        DRIEDataSmall = DRIEDataSmall.rename(columns={'form_data.OXFORD100_Recipe': 'Recipe', 'form_data.OXFORD100_SubstrateSize': 'Substrate Size', 'form_data.OXFORD100_AreaEtched': 'Area Etched',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 664 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 665

```text
                                                      'form_data.OXFORD100_EtchPress': 'Etch Pressure', 'form_data.OXFORD100_HeBackPress': 'Helium Back Pressure', 'form_data.OXFORD100_CF4': 'CF4 Flow',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 665 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 666

```text
                                                      'form_data.OXFORD100_SF6': 'SF6 Flow', 'form_data.OXFORD100_DRIEDepTime': 'DRIE Deposition Time', 'form_data.OXFORD100_DRIEEtchTime': 'DRIE Etch Time',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 666 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 667

```text
                                                      'form_data.OXFORD100_TotalEtchTime': 'Total Etch Time', 'form_data.OXFORD100_ICPForward': 'ICP Forward Power', 'form_data.OXFORD100_RFCCP': 'RFC Bias',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 667 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 668

```text
                                                      'form_data.OXFORD100_RFBias': 'RF Bias', 'form_data.OXFORD100_ChuckTemp': 'Chuck Temp', 'form_data.OXFORD100_ContPlasma': 'Continuous Plasma',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 668 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 669

```text
                                                      'form_data.OXFORD100_EtchDepth1': 'Etch Depth 1', 'form_data.OXFORD100_EtchDepth2': 'Etch Depth 2', 'form_data.OXFORD100_EtchDepth3': 'Etch Depth 3',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 669 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 670

```text
                                                      'form_data.OXFORD100_EtchDepth4': 'Etch Depth 4', 'form_data.OXFORD100_EtchDepth5': 'Etch Depth 5', 'form_data.OXFORD100_C4F8': 'C4F8 Flow',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 670 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 671

```text
                                                      'form_data.OXFORD100_O2': 'O2 Flow', 'form_data.OXFORD100_DRIECycles': 'DRIE Cycles', 'form_data.OXFORD100_Helium': 'Helium Flow',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 671 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 672

```text
                                                      'form_data.OXFORD100_PRPreThick': 'PR Pre-Thick', 'form_data.OXFORD100_PRPostThick': 'PR Post-Thick', 'form_data.OXFORD100_N2': 'N2 Flow',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 672 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 673

```text
                                                      'form_data.OXFORD100_Argon': 'Argon Flow', 'form_data.OXFORD100_AspectRatio': 'Aspect Ratio'})
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 673 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 674

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 674 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 675

```text
        #manipulate data from DRIE
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 675 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `loop`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 676

```text
        for index, row in DRIEDataSmall.iterrows():
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 676 is classified as `loop`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 677

```text
            #shortens chars from substrate size and plasma
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 677 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `loop` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 678

```text
            sub = shortenStr(row['Substrate Size'], 24)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 678 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 679

```text
            DRIEDataSmall.at[index, 'Substrate Size'] = sub
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 679 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 680

```text
            plasma = shortenStr(row['Continuous Plasma'], 20)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 680 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 681

```text
            DRIEDataSmall.at[index, 'Continuous Plasma'] = plasma
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 681 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 682

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 682 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 683

```text
        DRIEDataSmall.to_csv(os.path.join(DATA_DIR, 'small_DRIE_DataCollection.csv'))
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 683 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 684

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 684 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `filesystem` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 685

```text
def saveIsotropic():
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 685 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 686

```text
    print('Saving Isotropic')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 686 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `function` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 687

```text
    ensureExists('Isotropic_DataCollection.csv')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 687 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 688

```text
    IsotropicData = retrieveData('Isotropic')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 688 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `generic` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 689

```text
    if changedData('Isotropic_DataCollection.csv', IsotropicData):
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 689 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `assignment` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 690

```text
        IsotropicData.to_csv(os.path.join(DATA_DIR, 'Isotropic_DataCollection.csv'))
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 690 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `branch` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 691

```text
        columns_to_keep = ['submission_id', 'submitter_name', 'form_data.XACTIX_NoCycles']
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 691 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `filesystem` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 692

```text
        IsotropicDataSmall = IsotropicData[columns_to_keep]
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 692 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 693

```text
        IsotropicDataSmall = IsotropicDataSmall.rename(columns={'form_data.XACTIX_NoCycles': 'Number of Cycles'})
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 693 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 694

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 694 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 695

```text
        #nothing needs to be manipulated from Isotropic
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 695 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 696

```text
        IsotropicDataSmall.to_csv(os.path.join(DATA_DIR, 'small_Isotropic_DataCollection.csv'))
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 696 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 697

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 697 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `filesystem` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 698

```text
def savePlasmalab():
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 698 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 699

```text
    print('Saving Plasmalab')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 699 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `function` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 700

```text
    ensureExists('Plasmalab_DataCollection.csv')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 700 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 701

```text
    PlasmalabData = retrieveData('PlasmaLab')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 701 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `generic` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 702

```text
    if changedData('Plasmalab_DataCollection.csv', PlasmalabData):
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 702 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `assignment` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 703

```text
        PlasmalabData.to_csv(os.path.join(DATA_DIR, 'Plasmalab_DataCollection.csv'))
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 703 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `branch` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 704

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 704 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `filesystem` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 705

```text
        columns_to_keep = ['submission_id','submitter_name','form_data.OX80RIE_Recipe','form_data.OX80RIE_MatrlEtched','form_data.OX80RIE_BasePress', 'form_data.OX80RIE_Argon', 'form_data.OX80RIE_Oxygen',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 705 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 706

```text
                           'form_data.OX80RIE_EtchPower', 'form_data.OX80RIE_EtchPress', 'form_data.OX80RIE_EtchTime', 'form_data.OX80RIE_EtchDepth1', 'form_data.OX80RIE_EtchDepth2',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 706 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 707

```text
                           'form_data.OX80RIE_EtchDepth3', 'form_data.OX80RIE_C4F8', 'form_data.OX80RIE_SF6']
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 707 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 708

```text
        PlasmalabDataSmall = PlasmalabData[columns_to_keep]
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 708 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 709

```text
        PlasmalabDataSmall = PlasmalabDataSmall.rename(columns={'form_data.OX80RIE_Recipe': 'Recipe', 'form_data.OX80RIE_MatrlEtched': 'Material Etched', 'form_data.OX80RIE_BasePress': 'Base Pressure',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 709 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 710

```text
                                                              'form_data.OX80RIE_Argon': 'Argon Flow', 'form_data.OX80RIE_Oxygen': 'Oxygen Flow', 'form_data.OX80RIE_EtchPower': 'Etch Power',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 710 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 711

```text
                                                              'form_data.OX80RIE_EtchPress': 'Etch Pressure', 'form_data.OX80RIE_EtchTime': 'Etch Time', 'form_data.OX80RIE_EtchDepth1': 'Etch Depth 1',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 711 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 712

```text
                                                              'form_data.OX80RIE_EtchDepth2': 'Etch Depth 2', 'form_data.OX80RIE_EtchDepth3': 'Etch Depth 3', 'form_data.OX80RIE_C4F8': 'C4F8 Flow',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 712 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 713

```text
                                                              'form_data.OX80RIE_SF6': 'SF6 Flow'})
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 713 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 714

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 714 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 715

```text
        #dont need to manipulate data from PlasmaLab
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 715 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 716

```text
        PlasmalabDataSmall.to_csv(os.path.join(DATA_DIR, 'small_Plasmalab_DataCollection.csv'))
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 716 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 717

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 717 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `filesystem` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 718

```text
def savePlasmaTherm():
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 718 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 719

```text
    print('Saving PlasmaTherm')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 719 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `function` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 720

```text
    ensureExists('PlasmaTherm_DataCollection.csv')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 720 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 721

```text
    PlasmaThermData = retrieveData('PlasmaTherm')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 721 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `generic` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 722

```text
    if changedData('PlasmaTherm_DataCollection.csv', PlasmaThermData):
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 722 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `assignment` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 723

```text
        PlasmaThermData.to_csv(os.path.join(DATA_DIR, 'PlasmaTherm_DataCollection.csv'))
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 723 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `branch` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 724

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 724 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `filesystem` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 725

```text
        columns_to_keep = ['submission_id','submitter_name','form_data.PTHERMMETAL_MatrlEtched','form_data.PTHERMMETAL_Handle','form_data.PTHERMMETAL_Batch','form_data.PTHERMMETAL_Duplicate']
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 725 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 726

```text
        PlasmaThermDataSmall = PlasmaThermData[columns_to_keep]
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 726 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 727

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 727 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 728

```text
        PlasmaThermDataSmall = PlasmaThermDataSmall.rename(columns={'form_data.PTHERMMETAL_MatrlEtched': 'Material Etched', 'form_data.PTHERMMETAL_Handle': 'Handle',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 728 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 729

```text
                                                                    'form_data.PTHERMMETAL_Batch': 'Batch', 'form_data.PTHERMMETAL_Duplicate': 'Duplicate'})
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 729 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 730

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 730 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 731

```text
        #just need to shorten chars from handle
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 731 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `loop`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 732

```text
        for index, row in PlasmaThermDataSmall.iterrows():
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 732 is classified as `loop`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 733

```text
            handle = shortenStr(row['Handle'], 19)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 733 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `loop` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 734

```text
            PlasmaThermDataSmall.at[index, 'Handle'] = handle
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 734 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 735

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 735 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 736

```text
        PlasmaThermDataSmall.to_csv(os.path.join(DATA_DIR, 'small_PlasmaTherm_DataCollection.csv'))
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 736 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 737

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 737 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `filesystem` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 738

```text
def saveTechnics():
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 738 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 739

```text
    print('Saving Technics')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 739 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `function` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 740

```text
    ensureExists('Technics_DataCollection.csv')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 740 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 741

```text
    TechnicsData = retrieveData('Technics')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 741 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `generic` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 742

```text
    if changedData('Technics_DataCollection.csv', TechnicsData):
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 742 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `assignment` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 743

```text
        TechnicsData.to_csv(os.path.join(DATA_DIR, 'Technics_DataCollection.csv'))
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 743 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `branch` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 744

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 744 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `filesystem` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 745

```text
        columns_to_keep = ['submission_id','submitter_name','form_data.TECHNICS_GenComment']
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 745 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 746

```text
        TechnicsDataSmall = TechnicsData[columns_to_keep]
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 746 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 747

```text
        TechnicsDataSmall = TechnicsDataSmall.rename(columns={'form_data.TECHNICS_GenComment': 'Recipe'})
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 747 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 748

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 748 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 749

```text
        #nothing needs to be manipulated from Technics
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 749 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 750

```text
        TechnicsDataSmall.to_csv(os.path.join(DATA_DIR, 'small_Technics_DataCollection.csv'))
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 750 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 751

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 751 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `filesystem` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 752

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 752 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `blank` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 753

```text
def saveCleanOx():
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 753 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 754

```text
    print('Saving CleanOx')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 754 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `function` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 755

```text
    ensureExists('CleanOx_DataCollection.csv')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 755 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 756

```text
    CleanOxData = retrieveData('CleanOx')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 756 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `generic` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 757

```text
    if changedData('CleanOx_DataCollection.csv', CleanOxData):
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 757 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `assignment` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 758

```text
        CleanOxData.to_csv(os.path.join(DATA_DIR, 'CleanOx_DataCollection.csv'))
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 758 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `branch` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 759

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 759 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `filesystem` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 760

```text
        columns_to_keep = ['submission_id','submitter_name','form_data.PTEMPCLEAN_RecipeType','form_data.PTEMPCLEAN_RecipeTemp','form_data.PTEMPCLEAN_OxTime','form_data.PTEMPCLEAN_TargetThick',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 760 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 761

```text
                           'form_data.PTEMPCLEAN_NoSamples','form_data.PTEMPCLEAN_MonSlot','form_data.PTEMPCLEAN_MeasTool','form_data.PTEMPCLEAN_Thick1', 'form_data.PTEMPCLEAN_Thick2',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 761 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 762

```text
                           'form_data.PTEMPCLEAN_Thick3','form_data.PTEMPCLEAN_Thick4','form_data.PTEMPCLEAN_Thick5']
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 762 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 763

```text
        CleanOxDataSmall = CleanOxData[columns_to_keep]
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 763 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 764

```text
        CleanOxDataSmall = CleanOxDataSmall.rename(columns={'form_data.PTEMPCLEAN_RecipeType': 'Recipe Type', 'form_data.PTEMPCLEAN_RecipeTemp': 'Recipe Temp', 'form_data.PTEMPCLEAN_OxTime': 'Ox Time',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 764 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 765

```text
                                                            'form_data.PTEMPCLEAN_TargetThick': 'Target Thickness', 'form_data.PTEMPCLEAN_NoSamples': 'Number of Samples',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 765 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 766

```text
                                                            'form_data.PTEMPCLEAN_MonSlot': 'Mon Slot', 'form_data.PTEMPCLEAN_MeasTool': 'Measure Tool', 'form_data.PTEMPCLEAN_Thick1': 'Thickness 1',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 766 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 767

```text
                                                            'form_data.PTEMPCLEAN_Thick2': 'Thickness 2', 'form_data.PTEMPCLEAN_Thick3': 'Thickness 3', 'form_data.PTEMPCLEAN_Thick4': 'Thickness 4',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 767 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 768

```text
                                                            'form_data.PTEMPCLEAN_Thick5': 'Thickness 5'})
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 768 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 769

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 769 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 770

```text
        #manipulate data from CleanOx
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 770 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `loop`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 771

```text
        for index, row in CleanOxDataSmall.iterrows():
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 771 is classified as `loop`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 772

```text
            #shortens chars from recipe type
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 772 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `loop` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 773

```text
            recipe = shortenStr(row['Recipe Type'], 15)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 773 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 774

```text
            CleanOxDataSmall.at[index, 'Recipe Type'] = recipe
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 774 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 775

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 775 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 776

```text
            #shorten chars in temp
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 776 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 777

```text
            temp = shortenStr(row['Recipe Temp'], 22)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 777 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 778

```text
            CleanOxDataSmall.at[index, 'Recipe Temp'] = temp
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 778 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 779

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 779 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 780

```text
            #shorten chars from meas tool
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 780 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 781

```text
            meas = shortenStr(row['Measure Tool'], 20)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 781 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 782

```text
            CleanOxDataSmall.at[index, 'Measure Tool'] = meas
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 782 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 783

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 783 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 784

```text
        CleanOxDataSmall.to_csv(os.path.join(DATA_DIR, 'small_CleanOx_DataCollection.csv'))
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 784 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 785

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 785 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `filesystem` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 786

```text
def saveDopedOx():
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 786 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 787

```text
    print('Saving DopedOx')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 787 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `function` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 788

```text
    ensureExists('DopedOx_DataCollection.csv')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 788 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 789

```text
    DopedOxData = retrieveData('DopedOx')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 789 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `generic` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 790

```text
    if changedData('DopedOx_DataCollection.csv', DopedOxData):
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 790 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `assignment` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 791

```text
        DopedOxData.to_csv(os.path.join(DATA_DIR,'DopedOx_DataCollection.csv'))
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 791 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `branch` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 792

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 792 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `filesystem` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 793

```text
        columns_to_keep = ['submission_id','submitter_name', 'form_data.PTEMPDOPED_RecipeType','form_data.PTEMPDOPED_RecipeTemp','form_data.PTEMPDOPED_VarTime','form_data.PTEMPDOPED_TargetThick',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 793 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 794

```text
                           'form_data.PTEMPDOPED_NoSamples','form_data.PTEMPDOPED_MonSlot','form_data.PTEMPDOPED_OxMeasTool','form_data.PTEMPDOPED_Thick1', 'form_data.PTEMPDOPED_Thick2',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 794 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 795

```text
                            'form_data.PTEMPDOPED_Thick3','form_data.PTEMPDOPED_Thick4','form_data.PTEMPDOPED_Thick5', 'form_data.PTEMPDOPED_ShtRho1','form_data.PTEMPDOPED_ShtRho2',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 795 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 796

```text
                            'form_data.PTEMPDOPED_ShtRho3','form_data.PTEMPDOPED_ShtRho4','form_data.PTEMPDOPED_ShtRho5']
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 796 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 797

```text
        DopedOxDataSmall = DopedOxData[columns_to_keep]
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 797 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 798

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 798 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 799

```text
        DopedOxDataSmall = DopedOxDataSmall.rename(columns={'form_data.PTEMPDOPED_RecipeType': 'Recipe Type', 'form_data.PTEMPDOPED_RecipeTemp': 'Recipe Temp', 'form_data.PTEMPDOPED_VarTime': 'Var Time',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 799 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 800

```text
                                                            'form_data.PTEMPDOPED_TargetThick': 'Target Thickness', 'form_data.PTEMPDOPED_NoSamples': 'Number of Samples',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 800 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 801

```text
                                                            'form_data.PTEMPDOPED_MonSlot': 'Mon Slot', 'form_data.PTEMPDOPED_OxMeasTool': 'Ox Measure Tool', 'form_data.PTEMPDOPED_Thick1': 'Thickness 1',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 801 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 802

```text
                                                            'form_data.PTEMPDOPED_Thick2': 'Thickness 2', 'form_data.PTEMPDOPED_Thick3': 'Thickness 3', 'form_data.PTEMPDOPED_Thick4': 'Thickness 4',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 802 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 803

```text
                                                            'form_data.PTEMPDOPED_Thick5': 'Thickness 5', 'form_data.PTEMPDOPED_ShtRho1': 'Sheet Resistivity 1', 'form_data.PTEMPDOPED_ShtRho2': 'Sheet Resistivity 2',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 803 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 804

```text
                                                            'form_data.PTEMPDOPED_ShtRho3': 'Sheet Resistivity 3', 'form_data.PTEMPDOPED_ShtRho4': 'Sheet Resistivity 4', 'form_data.PTEMPDOPED_ShtRho5': 'Sheet Resistivity 5'})
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 804 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 805

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 805 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 806

```text
        #manipulate data from DopedOx
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 806 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `loop`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 807

```text
        for index, row in DopedOxDataSmall.iterrows():
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 807 is classified as `loop`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 808

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 808 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `loop` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 809

```text
            #shortens chars from recipe type
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 809 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 810

```text
            recipe = shortenStr(row['Recipe Type'], 22)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 810 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 811

```text
            DopedOxDataSmall.at[index, 'Recipe Type'] = recipe
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 811 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 812

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 812 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 813

```text
            #shorten chars in temp
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 813 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 814

```text
            temp = shortenStr(row['Recipe Temp'], 22)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 814 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 815

```text
            DopedOxDataSmall.at[index, 'Recipe Temp'] = temp
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 815 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 816

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 816 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 817

```text
            #shorten chars from meas tool
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 817 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 818

```text
            meas = shortenStr(row['Ox Measure Tool'], 22)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 818 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 819

```text
            DopedOxDataSmall.at[index, 'Ox Measure Tool'] = meas
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 819 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 820

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 820 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 821

```text
        DopedOxDataSmall.to_csv(os.path.join(DATA_DIR, 'small_DopedOx_DataCollection.csv'))
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 821 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 822

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 822 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `filesystem` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 823

```text
def saveLTO():
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 823 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 824

```text
    print('Saving LTO')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 824 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `function` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 825

```text
    ensureExists('LTO_DataCollection.csv')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 825 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 826

```text
    LTOData = retrieveData('LTO')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 826 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `generic` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 827

```text
    if changedData('LTO_DataCollection.csv', LTOData):
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 827 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `assignment` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 828

```text
        LTOData.to_csv(os.path.join(DATA_DIR, 'LTO_DataCollection.csv'))
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 828 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `branch` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 829

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 829 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `filesystem` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 830

```text
        columns_to_keep = ['submission_id','submitter_name','form_data.CTRLTO_Process','form_data.CTRLTO_DepTime','form_data.CTRLTO_TargetThick','form_data.CTRLTO_NoWfrs',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 830 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 831

```text
                           'form_data.CTRLTO_MonSlot','form_data.CTRLTO_MeasTool','form_data.CTRLTO_Thick1', 'form_data.CTRLTO_Thick2','form_data.CTRLTO_Thick3',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 831 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 832

```text
                           'form_data.CTRLTO_Thick4','form_data.CTRLTO_Thick5']
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 832 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 833

```text
        LTODataSmall = LTOData[columns_to_keep]
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 833 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 834

```text
        LTODataSmall = LTODataSmall.rename(columns={'form_data.CTRLTO_Process': 'Process', 'form_data.CTRLTO_DepTime': 'Deposition Time', 'form_data.CTRLTO_TargetThick': 'Target Thickness',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 834 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 835

```text
                                                    'form_data.CTRLTO_NoWfrs': 'Number of Wafers', 'form_data.CTRLTO_MonSlot': 'Mon Slot', 'form_data.CTRLTO_MeasTool': 'Measure Tool',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 835 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 836

```text
                                                    'form_data.CTRLTO_Thick1': 'Thickness 1', 'form_data.CTRLTO_Thick2': 'Thickness 2', 'form_data.CTRLTO_Thick3': 'Thickness 3',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 836 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 837

```text
                                                    'form_data.CTRLTO_Thick4': 'Thickness 4', 'form_data.CTRLTO_Thick5': 'Thickness 5'})
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 837 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 838

```text
        #manipulate data from LTO
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 838 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `generic` and next kind is `loop`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 839

```text
        for index, row in LTODataSmall.iterrows():
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 839 is classified as `loop`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 840

```text
            #shortens chars from process
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 840 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `loop` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 841

```text
            process = shortenStr(row['Process'], 15)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 841 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 842

```text
            LTODataSmall.at[index, 'Process'] = process
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 842 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 843

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 843 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 844

```text
            #shorten chars from meas tool
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 844 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 845

```text
            meas = shortenStr(row['Measure Tool'], 16)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 845 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 846

```text
            LTODataSmall.at[index, 'Measure Tool'] = meas
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 846 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 847

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 847 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 848

```text
        LTODataSmall.to_csv(os.path.join(DATA_DIR, 'small_LTO_DataCollection.csv'))
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 848 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 849

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 849 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `filesystem` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 850

```text
def saveNitride():
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 850 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 851

```text
    print('Saving Nitride')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 851 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `function` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 852

```text
    ensureExists('Nitride_DataCollection.csv')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 852 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 853

```text
    NitrideData = retrieveData('Nitride')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 853 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `generic` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 854

```text
    if changedData('Nitride_DataCollection.csv', NitrideData):
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 854 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `assignment` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 855

```text
        NitrideData.to_csv(os.path.join(DATA_DIR, 'Nitride_DataCollection.csv'))
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 855 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `branch` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 856

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 856 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `filesystem` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 857

```text
        #NEEED TO HAVE RUN WITH NONSTANDARD FORM DATA TODO TODO TODO
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 857 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 858

```text
        columns_to_keep = ['submission_id','submitter_name','form_data.CTRNIT_Recipe','form_data.CTRNIT_NonStdRecipe','form_data.CTRNIT_DepTime',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 858 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 859

```text
                           'form_data.CTRNIT_TargetThick','form_data.CTRNIT_NoWafers','form_data.CTRNIT_MonSlot','form_data.CTRNIT_MeasTool',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 859 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 860

```text
                           'form_data.CTRNIT_Thick1','form_data.CTRNIT_Thick2','form_data.CTRNIT_Thick3','form_data.CTRNIT_Thick4','form_data.CTRNIT_Thick5']
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 860 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 861

```text
        NitrideDataSmall = NitrideData[columns_to_keep]
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 861 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 862

```text
        NitrideDataSmall = NitrideDataSmall.rename(columns={'form_data.CTRNIT_Recipe': 'Recipe', 'form_data.CTRNIT_NonStdRecipe': 'Non-Standard Recipe',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 862 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 863

```text
                                                            'form_data.CTRNIT_DepTime': 'Deposition Time','form_data.CTRNIT_TargetThick': 'Target Thickness',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 863 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 864

```text
                                                            'form_data.CTRNIT_NoWafers': 'Number of Wafers', 'form_data.CTRNIT_MonSlot': 'Mon Slot',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 864 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 865

```text
                                                            'form_data.CTRNIT_MeasTool': 'Measure Tool', 'form_data.CTRNIT_Thick1': 'Thickness 1',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 865 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 866

```text
                                                            'form_data.CTRNIT_Thick2': 'Thickness 2', 'form_data.CTRNIT_Thick3': 'Thickness 3',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 866 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 867

```text
                                                            'form_data.CTRNIT_Thick4': 'Thickness 4', 'form_data.CTRNIT_Thick5': 'Thickness 5'})
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 867 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 868

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 868 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 869

```text
        #manipulate data from Nitride
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 869 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `loop`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 870

```text
        for index, row in NitrideDataSmall.iterrows():
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 870 is classified as `loop`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 871

```text
            #shortens chars from recipe
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 871 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `loop` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 872

```text
            recipe = shortenStr(row['Recipe'], 14)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 872 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 873

```text
            NitrideDataSmall.at[index, 'Recipe'] = recipe
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 873 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 874

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 874 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 875

```text
            #TODO TODO TODO HANDLE NONSTANDARD RECIPE
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 875 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 876

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 876 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 877

```text
            #shorten chars from meas tool
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 877 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 878

```text
            meas = shortenStr(row['Measure Tool'], 16)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 878 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 879

```text
            NitrideDataSmall.at[index, 'Measure Tool'] = meas
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 879 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 880

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 880 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 881

```text
        #remove nonstandard recipe column
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 881 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 882

```text
        NitrideDataSmall.drop(columns=['Non-Standard Recipe'], inplace=True)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 882 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 883

```text
        NitrideDataSmall.to_csv(os.path.join(DATA_DIR, 'small_Nitride_DataCollection.csv'))
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 883 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 884

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 884 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `filesystem` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 885

```text
def savePoly():
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 885 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 886

```text
    print('Saving Poly')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 886 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `function` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 887

```text
    ensureExists('Poly_DataCollection.csv')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 887 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 888

```text
    PolyData = retrieveData('Poly')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 888 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `generic` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 889

```text
    if changedData('Poly_DataCollection.csv', PolyData):
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 889 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `assignment` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 890

```text
        PolyData.to_csv(os.path.join(DATA_DIR, 'Poly_DataCollection.csv'))
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 890 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `branch` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 891

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 891 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `filesystem` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 892

```text
        columns_to_keep = ['submission_id','submitter_name','form_data.CTRPOLY_Recipe','form_data.CTRPOLY_NonStdRecipe','form_data.CTRPOLY_DepTime',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 892 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 893

```text
                           'form_data.CTRPOLY_TargetThick','form_data.CTRPOLY_NoWafers','form_data.CTRPOLY_MeasTool','form_data.CTRPOLY_MonSlot',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 893 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 894

```text
                           'form_data.CTRPOLY_Thick1','form_data.CTRPOLY_Thick2','form_data.CTRPOLY_Thick3','form_data.CTRPOLY_Thick4','form_data.CTRPOLY_Thick5']
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 894 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 895

```text
        PolyDataSmall = PolyData[columns_to_keep]
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 895 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 896

```text
        PolyDataSmall = PolyDataSmall.rename(columns={'form_data.CTRPOLY_Recipe': 'Recipe', 'form_data.CTRPOLY_NonStdRecipe': 'Non-Standard Recipe',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 896 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 897

```text
                                                      'form_data.CTRPOLY_DepTime': 'Deposition Time','form_data.CTRPOLY_TargetThick': 'Target Thickness',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 897 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 898

```text
                                                      'form_data.CTRPOLY_NoWafers': 'Number of Wafers', 'form_data.CTRPOLY_MeasTool': 'Measure Tool',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 898 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 899

```text
                                                      'form_data.CTRPOLY_MonSlot': 'Mon Slot', 'form_data.CTRPOLY_Thick1': 'Thickness 1',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 899 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 900

```text
                                                      'form_data.CTRPOLY_Thick2': 'Thickness 2', 'form_data.CTRPOLY_Thick3': 'Thickness 3',
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 900 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 901

```text
                                                      'form_data.CTRPOLY_Thick4': 'Thickness 4', 'form_data.CTRPOLY_Thick5': 'Thickness 5'})
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 901 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 902

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 902 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 903

```text
        #manipulate data from Poly
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 903 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `loop`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 904

```text
        for index, row in PolyDataSmall.iterrows():
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 904 is classified as `loop`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 905

```text
            #shortens chars from recipe
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 905 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `loop` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 906

```text
            recipe = shortenStr(row['Recipe'], 15)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 906 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 907

```text
            PolyDataSmall.at[index, 'Recipe'] = combineCells(recipe, row['Non-Standard Recipe'])
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 907 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 908

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 908 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 909

```text
            #shorten chars from meas tool
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 909 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 910

```text
            meas = shortenStr(row['Measure Tool'], 17)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 910 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 911

```text
            PolyDataSmall.at[index, 'Measure Tool'] = meas
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 911 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 912

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 912 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 913

```text
        #remove nonstandard recipe column
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 913 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 914

```text
        PolyDataSmall.drop(columns=['Non-Standard Recipe'], inplace=True)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 914 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 915

```text
        PolyDataSmall.to_csv(os.path.join(DATA_DIR, 'small_Poly_DataCollection.csv'))
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 915 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 916

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 916 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `filesystem` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 917

```text
def saveAllwin():
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 917 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 918

```text
    print('Saving Allwin')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 918 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `function` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 919

```text
    ensureExists('Allwin_DataCollection.csv')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 919 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 920

```text
    AllwinData = retrieveData('Allwin')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 920 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `generic` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 921

```text
    if changedData('Allwin_DataCollection.csv', AllwinData):
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 921 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `assignment` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 922

```text
        AllwinData.to_csv(os.path.join(DATA_DIR, 'Allwin_DataCollection.csv'))
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 922 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `branch` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 923

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 923 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `filesystem` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 924

```text
        columns_to_keep = ['submission_id','submitter_name','form_data.RTP_Recipe']
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 924 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 925

```text
        AllwinDataSmall = AllwinData[columns_to_keep]
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 925 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 926

```text
        AllwinDataSmall = AllwinDataSmall.rename(columns={'form_data.RTP_Recipe': 'Recipe'})
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 926 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 927

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 927 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 928

```text
        #no data to manipulate
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 928 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 929

```text
        AllwinDataSmall.to_csv(os.path.join(DATA_DIR, 'small_Allwin_DataCollection.csv'))
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 929 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 930

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 930 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `filesystem` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 931

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 931 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `blank` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 932

```text
#TODO EVERY DEVICE IN THE SYSTEM HAS A saveX function
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 932 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 933

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 933 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 934

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 934 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `blank` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 935

```text
#Brains of the device, this is called every morning at 5 AM
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 935 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 936

```text
def save():
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 936 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 937

```text
    #This is how handling from new loadpt
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 937 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `function` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 938

```text
    #header = {'Authorization': AUTH}
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 938 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 939

```text
    #fullDataTable = requests.get('https://n8n.cores.utah.edu/webhook/custom_form_data_dump?service_ids=761', headers=header)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 939 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 940

```text
    #readData = fullDataTable.text
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 940 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 941

```text
    #importantData = json.loads(readData)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 941 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 942

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 942 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 943

```text
    #print(json.dumps(importantData, indent=4))
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 943 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 944

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 944 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 945

```text
    #outputData = pd.json_normalize(importantData)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 945 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 946

```text
    #outputData.to_csv('C:\\Users\\Phelan\\NMon\\HSCDATA\\fullData.csv')
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 946 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 947

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 947 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 948

```text
    #todo save every device
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 948 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 949

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 949 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `exception`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 950

```text
    try:
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 950 is classified as `exception`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state. Neighbor context: previous kind is `blank` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 951

```text
        #DEPOSITION DEVICES
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 951 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `exception` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 952

```text
        saveALD()                          #ALD Fiji F200
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 952 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `comment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 953

```text
        saveEbeam()                        #E-Beam Denton SJ20C
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 953 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 954

```text
        saveMOCVD()                        #MOCVD Agnitron Imperium
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 954 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 955

```text
        saveParylene()                     #Parylene - SCS PDS 2010
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 955 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 956

```text
        #savePECVD()                        #PECVD - Oxford Plasmalab 80
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 956 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 957

```text
        saveDenton635()                    #Sputter - Denton 635
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 957 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `comment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 958

```text
        saveDenton18()                     #Sputter - Denton Discovery 18
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 958 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 959

```text
        saveTMV()                          #Sputter - TMV Super
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 959 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 960

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 960 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 961

```text
        #ETCH DEVICES
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 961 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 962

```text
        saveDRIE()                         #DRIE - Oxford 100 ICP
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 962 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `comment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 963

```text
        saveIsotropic()                    #Isotropic - XACTIX X2 XeF2
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 963 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 964

```text
        savePlasmalab()                    #RIE - Oxford Plasmalab 80
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 964 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 965

```text
        savePlasmaTherm()                  #RIE - Plasmatherm Metal Etch
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 965 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 966

```text
        saveTechnics()                     #RIE - Technics PE II-A
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 966 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 967

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 967 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 968

```text
        #FURNACES
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 968 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 969

```text
        saveCleanOx()                      #Atmospheric - ProTemp Clean Ox
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 969 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `comment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 970

```text
        saveDopedOx()                      #Atmospheric - ProTemp Doped Ox
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 970 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 971

```text
        saveLTO()                          #LPCVD - Expertech CTR125 LTO
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 971 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 972

```text
        saveNitride()                      #LPCVD - Expertech CTR125 Nitride
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 972 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 973

```text
        savePoly()                         #LPCVD - Expertech CTR125 Poly
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 973 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 974

```text
        saveAllwin()                          #RTP - Allwin AccuThermo AW 610
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 974 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 975

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 975 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 976

```text
        #LASERS
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 976 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 977

```text
        #saveDPSS()                         #DPSS Samurai UV Laser
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 977 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 978

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 978 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 979

```text
        #LITHOGRAPHY DEVICES
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 979 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 980

```text
        #save100SC()                        #CEE 100 Spin Coat
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 980 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 981

```text
        #save1800SC()                       #CEE 200X 1800 Spin Coat
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 981 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 982

```text
        #save9260SC()                       #CEE 200X 9260 Spin Coat
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 982 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 983

```text
        #saveEC101()                        #Headway EC101 Spin
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 983 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 984

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 984 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 985

```text
        #MICROFLUIDICS
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 985 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 986

```text
        #savePDMS()                         #CEE 200X PDMS Spin Coat
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 986 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 987

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 987 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 988

```text
        #PATTERN DEVICES
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 988 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 989

```text
        #saveDWL66()                        #Heidelberg DWL66+
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 989 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 990

```text
        #saveMicroPG()                      #Heidelberg MicroPG 101
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 990 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 991

```text
        #saveMicroPGzp4()                   #Heidelberg MicroPG 101-2 0.9/2.5um
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 991 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 992

```text
        #saveNanoscribe()                   #Nanoscribe
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 992 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 993

```text
        #saveNanoFrazor()                   #NanoFrazor Explore
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 993 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 994

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 994 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 995

```text
        #OTHER
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 995 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 996

```text
        #saveMaintenance()                  #Maintenance Activity
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 996 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 997

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 997 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 998

```text
        logging.info("Executing save")
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 998 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `blank` and next kind is `exception`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 999

```text
    except Exception as e:
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 999 is classified as `exception`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 1000

```text
        logging.error(f"Error executing save {e}")
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 1000 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `exception` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 1001

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 1001 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 1002

```text
def graceful_exit(signum, frame):
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 1002 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 1003

```text
    logging.info("Exiting")
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 1003 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `function` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 1004

```text
    sys.exit(0)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 1004 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 1005

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 1005 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 1006

```text
signal.signal(signal.SIGINT, graceful_exit)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 1006 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 1007

```text
signal.signal(signal.SIGTERM, graceful_exit)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 1007 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 1008

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 1008 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 1009

```text
#shedules the save function for 5AM
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 1009 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 1010

```text
schedule.every().day.at("05:00").do(save)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 1010 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 1011

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 1011 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 1012

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 1012 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `blank` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 1013

```text
def runForever():
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 1013 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `blank` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 1014

```text
    #Infinite Loop
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 1014 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `function` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 1015

```text
    save()
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 1015 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `comment` and next kind is `loop`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 1016

```text
    while True:
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 1016 is classified as `loop`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones. Neighbor context: previous kind is `generic` and next kind is `exception`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 1017

```text
        try:
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 1017 is classified as `exception`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state. Neighbor context: previous kind is `loop` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 1018

```text
            schedule.run_pending()
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 1018 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `exception` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 1019

```text
            time.sleep(10)
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 1019 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `exception`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 1020

```text
        except Exception as e:
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 1020 is classified as `exception`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 1021

```text
            logging.error(f"Error in scheduled loop {e}")
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 1021 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `exception` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 1022

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 1022 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 1023

```text
if __name__ == '__main__':
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 1023 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 1024

```text
    runForever()
```

Reconstruction rule: in `UNanofabTools/HSCDownloader.py`, line 1024 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `branch` and next kind is `none`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.



## Edge-Case Matrix For This File

1. **Empty Input**: When recreating `UNanofabTools/HSCDownloader.py`, test the `empty input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
2. **Single Input**: When recreating `UNanofabTools/HSCDownloader.py`, test the `single input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
3. **Large Input**: When recreating `UNanofabTools/HSCDownloader.py`, test the `large input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
4. **Duplicate Input**: When recreating `UNanofabTools/HSCDownloader.py`, test the `duplicate input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
5. **Malformed Input**: When recreating `UNanofabTools/HSCDownloader.py`, test the `malformed input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
6. **Missing File**: When recreating `UNanofabTools/HSCDownloader.py`, test the `missing file` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
7. **Permission Denied**: When recreating `UNanofabTools/HSCDownloader.py`, test the `permission denied` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
8. **Network Timeout**: When recreating `UNanofabTools/HSCDownloader.py`, test the `network timeout` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
9. **Stale Credential**: When recreating `UNanofabTools/HSCDownloader.py`, test the `stale credential` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
10. **Rotated Secret**: When recreating `UNanofabTools/HSCDownloader.py`, test the `rotated secret` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
11. **Schema Drift**: When recreating `UNanofabTools/HSCDownloader.py`, test the `schema drift` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
12. **Partial Database Write**: When recreating `UNanofabTools/HSCDownloader.py`, test the `partial database write` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
13. **Concurrent Request**: When recreating `UNanofabTools/HSCDownloader.py`, test the `concurrent request` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
14. **Browser Refresh**: When recreating `UNanofabTools/HSCDownloader.py`, test the `browser refresh` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
15. **Double Submit**: When recreating `UNanofabTools/HSCDownloader.py`, test the `double submit` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
16. **Stale Tmux Session**: When recreating `UNanofabTools/HSCDownloader.py`, test the `stale tmux session` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
17. **Wrong Working Directory**: When recreating `UNanofabTools/HSCDownloader.py`, test the `wrong working directory` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
18. **Wrong User Account**: When recreating `UNanofabTools/HSCDownloader.py`, test the `wrong user account` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
19. **University It Boundary**: When recreating `UNanofabTools/HSCDownloader.py`, test the `University IT boundary` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
20. **Backup Restore**: When recreating `UNanofabTools/HSCDownloader.py`, test the `backup restore` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
21. **Disk Pressure**: When recreating `UNanofabTools/HSCDownloader.py`, test the `disk pressure` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
22. **Old Source Copy**: When recreating `UNanofabTools/HSCDownloader.py`, test the `old source copy` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
23. **Production Versus Development Configuration**: When recreating `UNanofabTools/HSCDownloader.py`, test the `production versus development configuration` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
24. **Redacted Secret Reconstruction**: When recreating `UNanofabTools/HSCDownloader.py`, test the `redacted secret reconstruction` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
