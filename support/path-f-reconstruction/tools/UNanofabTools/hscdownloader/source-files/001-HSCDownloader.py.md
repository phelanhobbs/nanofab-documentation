

# Source Reconstruction: UNanofabTools/HSCDownloader.py

## Breadcrumbs

[Path F Home](../../../../README.md) | [Navigator](../../../../NAVIGATOR.md) | [Troubleshooting Routes](../../../../TROUBLESHOOTING-ROUTES.md) | [Reconstruction Checklist](../../../../RECONSTRUCTION-CHECKLIST.md) | [First Hour](../../../../MAINTAINER-FIRST-HOUR.md) | [Glossary](../../../../GLOSSARY.md) | [Evidence Template](../../../../REBUILD-EVIDENCE-TEMPLATE.md) | [Fixture Index](../../../../FIXTURE-AND-EVIDENCE-INDEX.md) | [Tool Index](../../../INDEX.md) | [System Map](../../../00-system-map/README.md) | [Owning Tool README](../README.md)

If you opened this page directly from search, stop here first: read the owning tool README, then return to this source page only for implementation evidence.

- Repository: `UNanofabTools`
- Relative path: `HSCDownloader.py`
- Lines read: `1024`
- Dirty in working tree at generation time: `no`
- Untracked at generation time: `no`
- Sanitized SHA-256 prefix: `04009834f9dd2383`
- Code fence language: `python`

## Reconstruction Purpose

This section is written so a maintainer can recreate the file's behavior without opening the source tree. The sanitized code excerpt preserves structure and names while removing secret-looking literal values. The line-by-line notes explain the operational reason for each line, the behavior that must survive a rewrite, and the edge cases to test.

## Python Structure Summary

- Imports: `import numpy`, `import requests`, `import schedule`, `import os`, `import pandas`, `import json`, `from io import StringIO`, `import logging`, `import time`, `import signal`, `import sys`, `from dotenv import load_dotenv`
- Classes: none detected
- Functions: `downloadFile`, `ensureExists`, `changedData`, `retrieveData`, `shortenStr`, `combineCells`, `scalePressure`, `saveALD`, `saveEbeam`, `saveMOCVD`, `saveParylene`, `savePECVD`, `saveDenton635`, `saveDenton18`, `saveTMV`, `saveDRIE`, `saveIsotropic`, `savePlasmalab`, `savePlasmaTherm`, `saveTechnics`, `saveCleanOx`, `saveDopedOx`, `saveLTO`, `saveNitride`, `savePoly`, `saveAllwin`, `save`, `graceful_exit`, `runForever`
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
from dotenv import load_dotenv

load_dotenv()
breakLoop = 0

script_dir = os.path.dirname(__file__) #<-- absolute dir the script is in
DATA_DIR = os.path.join(script_dir, 'HSCDATA')
#DATA_DIR = "C:\\Users\\Phelan\\NMon\\HSCDATA"
AUTH = 'Bearer ' + os.environ['CORES_TOKEN']
URLBASE = 'https://n8n.cores.utah.edu/webhook/custom_form_data_dump?service_ids='

# Setup basic logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')


def downloadFile(url):
    header = {'Authorization': AUTH}
    # timeout so a hung CORES/n8n request can't stall the whole daily run;
    # raise_for_status turns a revoked-token 403 (or any error) into a clean
    # exception that the per-machine guard in save() contains.
    fullDataTable = requests.get(URLBASE + url, headers=header, timeout=30)
    fullDataTable.raise_for_status()
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

def scalePressure(value, powerFactor):
    """Normalize a pressure reading to micro (-6):  value * 10**(powerFactor + 6).

    `value` comes from a stale iterrows() copy, so it may still be a string —
    cast it here. If it (or powerFactor) can't be parsed, log and return the
    value unchanged so one malformed row never aborts the whole machine's save.
    """
    try:
        return float(value) * 10 ** (int(powerFactor) + 6)
    except (ValueError, TypeError):
        logging.warning("Could not scale pressure %r with factor %r; leaving as-is", value, powerFactor)
        return value

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
                EbeamDataSmall.at[index, 'Base Pressure'] = scalePressure(row['Base Pressure'], powerFactor)

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
                Denton635DataSmall.at[index, 'Base Pressure'] = scalePressure(row['Base Pressure'], powerFactor)

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
                Denton18DataSmall.at[index, 'Base Pressure'] = scalePressure(row['Base Pressure'], powerFactor)

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
                #pressure values are scaled per-row by scalePressure() below

                TMVDataSmall.at[index, 'Base Pressure'] = scalePressure(row['Base Pressure'], powerFactor)
                TMVDataSmall.at[index, 'Sample 1 Sputter Deposition Pressure'] = scalePressure(row['Sample 1 Sputter Deposition Pressure'], powerFactor)
                TMVDataSmall.at[index, 'Sample 2 Sputter Deposition Pressure'] = scalePressure(row['Sample 2 Sputter Deposition Pressure'], powerFactor)
                TMVDataSmall.at[index, 'Sample 3 Sputter Deposition Pressure'] = scalePressure(row['Sample 3 Sputter Deposition Pressure'], powerFactor)

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

    # Each machine runs in its own try/except so one failure (a CORES schema
    # change raising KeyError, a network error, etc.) can't abort the rest of the
    # daily run. savePECVD is intentionally omitted (not yet in service).
    machines = [
        ("ALD", saveALD),               # ALD Fiji F200
        ("Ebeam", saveEbeam),           # E-Beam Denton SJ20C
        ("MOCVD", saveMOCVD),           # MOCVD Agnitron Imperium
        ("Parylene", saveParylene),     # Parylene - SCS PDS 2010
        ("Denton635", saveDenton635),   # Sputter - Denton 635
        ("Denton18", saveDenton18),     # Sputter - Denton Discovery 18
        ("TMV", saveTMV),               # Sputter - TMV Super
        ("DRIE", saveDRIE),             # DRIE - Oxford 100 ICP
        ("Isotropic", saveIsotropic),   # Isotropic - XACTIX X2 XeF2
        ("Plasmalab", savePlasmalab),   # RIE - Oxford Plasmalab 80
        ("PlasmaTherm", savePlasmaTherm),  # RIE - Plasmatherm Metal Etch
        ("Technics", saveTechnics),     # RIE - Technics PE II-A
        ("CleanOx", saveCleanOx),       # Atmospheric - ProTemp Clean Ox
        ("DopedOx", saveDopedOx),       # Atmospheric - ProTemp Doped Ox
        ("LTO", saveLTO),               # LPCVD - Expertech CTR125 LTO
        ("Nitride", saveNitride),       # LPCVD - Expertech CTR125 Nitride
        ("Poly", savePoly),             # LPCVD - Expertech CTR125 Poly
        ("Allwin", saveAllwin),         # RTP - Allwin AccuThermo AW 610
    ]

    failures = []
    for name, fn in machines:
        try:
            fn()
        except Exception as e:
            failures.append(name)
            logging.error(f"save({name}) failed: {e}")

    if failures:
        logging.warning(
            f"save complete with {len(failures)} machine failure(s): {', '.join(failures)}"
        )
    else:
        logging.info("save complete: all machines OK")

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

### Line 10

```text
import numpy as np
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 11

```text
import requests
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 12

```text
import schedule
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 13

```text
import os
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 14

```text
import pandas as pd
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 15

```text
import json
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 16

```text
from io import StringIO
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 17

```text
import logging
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 18

```text
import time
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 19

```text
import signal
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 20

```text
import sys
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 21

```text
from dotenv import load_dotenv
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 23

```text
load_dotenv()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 24

```text
breakLoop = 0
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 26

```text
script_dir = os.path.dirname(__file__) #<-- absolute dir the script is in
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 27

```text
DATA_DIR = os.path.join(script_dir, 'HSCDATA')
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 29

```text
AUTH = 'Bearer ' + os.environ['CORES_TOKEN']
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 30

```text
URLBASE = 'https://n8n.cores.utah.edu/webhook/custom_form_data_dump?service_ids='
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 33

```text
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 36

```text
def downloadFile(url):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 37

```text
    header = {'Authorization': AUTH}
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 41

```text
    fullDataTable = requests.get(URLBASE + url, headers=header, timeout=30)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 42

```text
    fullDataTable.raise_for_status()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 43

```text
    readData = json.loads(fullDataTable.text)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 46

```text
    DLed = pd.json_normalize(readData)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 47

```text
    return DLed
```

`return` — This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect.

### Line 50

```text
def ensureExists(fileName):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 52

```text
    filePathFull = os.path.join(DATA_DIR, fileName)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 53

```text
    filePathSmall = os.path.join(DATA_DIR, 'small_' +fileName)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 54

```text
    if not os.path.exists(filePathFull):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 55

```text
        open(filePathFull, 'w').close()
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 56

```text
    if not os.path.exists(filePathSmall):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 57

```text
        open(filePathSmall, 'w').close()
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 61

```text
def changedData(fileName, secondFile):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 65

```text
    return 1
```

`return` — This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect.

### Line 69

```text
def retrieveData(deviceName):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 72

```text
    DLed = ''
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 74

```text
    if (deviceName == 'ALD'):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 75

```text
        DLed = downloadFile('761')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 76

```text
        print("Retrieving Data from ALD")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 77

```text
    elif (deviceName == 'Ebeam'):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 78

```text
        DLed = downloadFile('764')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 79

```text
        print("Retrieving Data from Ebeam")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 80

```text
    elif (deviceName == 'MOCVD'):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 81

```text
        DLed = downloadFile('769')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 82

```text
        print("Retrieving Data from MOCVD")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 83

```text
    elif (deviceName == 'Parylene'):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 84

```text
        DLed = downloadFile('765')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 85

```text
        print("Retrieving Data from Parylene")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 86

```text
    elif (deviceName == 'PECVD'):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 87

```text
        DLed = downloadFile('770')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 88

```text
        print("Retrieving Data from PECVD")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 89

```text
    elif (deviceName == 'Denton635'):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 90

```text
        DLed = downloadFile('766')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 91

```text
        print("Retrieving Data from Denton635")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 92

```text
    elif (deviceName == 'Denton18'):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 93

```text
        DLed = downloadFile('771')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 94

```text
        print("Retrieving Data from Denton18")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 95

```text
    elif(deviceName == 'TMV'):
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 96

```text
        DLed = downloadFile('772')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 97

```text
        print("Retrieving Data from TMV")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 99

```text
    elif (deviceName == 'DRIE'):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 100

```text
        DLed = downloadFile('767')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 101

```text
        print("Retrieving Data from DRIE")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 102

```text
    elif (deviceName == 'Isotropic'):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 103

```text
        DLed = downloadFile('775')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 104

```text
        print("Retrieving Data from Isotropic")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 105

```text
    elif (deviceName == 'PlasmaLab'):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 106

```text
        DLed = downloadFile('776')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 107

```text
        print("Retrieving Data from PlasmaLab")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 108

```text
    elif (deviceName == 'PlasmaTherm'):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 109

```text
        DLed = downloadFile('777')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 110

```text
        print("Retrieving Data from PlasmaTherm")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 111

```text
    elif (deviceName == 'Technics'):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 112

```text
        DLed = downloadFile('778')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 113

```text
        print("Retrieving Data from Technics")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 115

```text
    elif (deviceName == 'CleanOx'):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 116

```text
        DLed = downloadFile('779')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 117

```text
        print("Retrieving Data from CleanOx")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 118

```text
    elif (deviceName == 'DopedOx'):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 119

```text
        DLed = downloadFile('780')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 120

```text
        print("Retrieving Data from DopedOx")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 121

```text
    elif (deviceName == 'LTO'):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 122

```text
        DLed = downloadFile('762')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 123

```text
        print("Retrieving Data from LTO")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 124

```text
    elif (deviceName == 'Nitride'):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 125

```text
        DLed = downloadFile('763')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 126

```text
        print("Retrieving Data from Nitride")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 127

```text
    elif (deviceName == 'Poly'):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 128

```text
        DLed = downloadFile('781')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 129

```text
        print("Retrieving Data from Poly")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 130

```text
    elif (deviceName == 'Allwin'):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 131

```text
        DLed = downloadFile('801')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 132

```text
        print("Retrieving Data from Allwin")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 134

```text
    elif (deviceName == 'DPSS'):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 135

```text
        DLed = downloadFile('825')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 136

```text
        print("Retrieving Data from DPSS")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 138

```text
    elif (deviceName == '100SC'):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 139

```text
        DLed = downloadFile('834')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 140

```text
        print("Retrieving Data from 100SC")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 141

```text
    elif (deviceName == '1800SC'):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 142

```text
        DLed = downloadFile('835')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 143

```text
        print("Retrieving Data from 1800SC")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 144

```text
    elif (deviceName == '9260SC'):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 145

```text
        DLed = downloadFile('836')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 146

```text
        print("Retrieving Data from 9260SC")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 147

```text
    elif (deviceName == 'EC101'):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 148

```text
        DLed = downloadFile('844')                      #CURRENTLY HAS NO DATA
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 149

```text
        print("Retrieving Data from EC101")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 151

```text
    elif (deviceName == 'PDMS'):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 152

```text
        DLed = downloadFile('845')                      #CURRENTLY HAS NO DATA
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 153

```text
        print("Retrieving Data from PDMS")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 155

```text
    elif (deviceName == 'DWL66'):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 156

```text
        DLed = downloadFile('782')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 157

```text
        print("Retrieving Data from DWL66")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 158

```text
    elif (deviceName == 'MicroPG'):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 159

```text
        DLed = downloadFile('785')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 160

```text
        print("Retrieving Data from MicroPG")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 161

```text
    elif (deviceName == 'MicroPGZP4'):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 162

```text
        DLed = downloadFile('787')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 163

```text
        print("Retrieving Data from MicroPGZP4")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 164

```text
    elif (deviceName == 'Nanoscribe'):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 165

```text
        DLed = downloadFile('827')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 166

```text
        print("Retrieving Data from Nanoscribe")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 167

```text
    elif (deviceName == 'NanoFrazor'):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 168

```text
        DLed = downloadFile('833')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 169

```text
        print("Retrieving Data from NanoFrazor")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 171

```text
    elif (deviceName == 'Maintainence'):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 172

```text
        DLed = downloadFile('843')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 173

```text
        print("Retrieving Data from Maintainence")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 174

```text
    else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 175

```text
        print("Invalid Device Name")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 176

```text
        return
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 177

```text
    return DLed
```

`return` — This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect.

### Line 179

```text
def shortenStr(fullStr, val):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 180

```text
    try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 181

```text
        return fullStr[val:]
```

`return` — This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect.

### Line 182

```text
    except:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 183

```text
        return 'Unknown'
```

`return` — This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect.

### Line 185

```text
def combineCells(cell1, cell2):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 186

```text
    if cell1 == 'Other':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 187

```text
        if cell2 == '':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 188

```text
            return 'Unknown/Other'
```

`return` — This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect.

### Line 189

```text
        else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 190

```text
            return cell2
```

`return` — This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect.

### Line 191

```text
    else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 192

```text
        return cell1
```

`return` — This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect.

### Line 194

```text
def scalePressure(value, powerFactor):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 195

```text
    """Normalize a pressure reading to micro (-6):  value * 10**(powerFactor + 6).
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 197

```text
    `value` comes from a stale iterrows() copy, so it may still be a string —
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 198

```text
    cast it here. If it (or powerFactor) can't be parsed, log and return the
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 199

```text
    value unchanged so one malformed row never aborts the whole machine's save.
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 200

```text
    """
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 201

```text
    try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 202

```text
        return float(value) * 10 ** (int(powerFactor) + 6)
```

`return` — This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect.

### Line 203

```text
    except (ValueError, TypeError):
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 204

```text
        logging.warning("Could not scale pressure %r with factor %r; leaving as-is", value, powerFactor)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 205

```text
        return value
```

`return` — This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect.

### Line 208

```text
def saveALD():
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 209

```text
    ensureExists('ALD_DataCollection.csv')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 212

```text
    ALDData = retrieveData('ALD')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 214

```text
    if changedData('ALD_DataCollection.csv', ALDData):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 216

```text
        ALDData.to_csv(os.path.join(DATA_DIR, 'ALD_DataCollection.csv'))
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 218

```text
        columns_to_keep = ['submission_id','submitter_name','form_data.ALDFIJI_Film','form_data.ALDFIJI_Film_OtherText','form_data.ALDFIJI_DepMode','form_data.ALDFIJI_Recipe',
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 219

```text
                           'form_data.ALDFIJI_ChuckTemp','form_data.ALDFIJI_PrecursorTemp','form_data.ALDFIJI_NoCycles','form_data.ALDFIJI_BasePress',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 220

```text
                           'form_data.ALDFIJI_Thick','form_data.ALDFIJI_ThickUnit']
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 221

```text
        ALDDataSmall = ALDData[columns_to_keep]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 222

```text
        ALDDataSmall = ALDDataSmall.rename(columns={'form_data.ALDFIJI_Film': 'Film Deposited','form_data.ALDFIJI_Film_OtherText': 'Other Film',
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 223

```text
                                                    'form_data.ALDFIJI_DepMode': 'Deposition Mode', 'form_data.ALDFIJI_Recipe': 'Recipe',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 224

```text
                                                    'form_data.ALDFIJI_ChuckTemp': 'Chuck Temperature (C)',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 225

```text
                                                    'form_data.ALDFIJI_PrecursorTemp': 'Precursor Temperature (C)', 'form_data.ALDFIJI_NoCycles': 'Number of Cycles',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 226

```text
                                                    'form_data.ALDFIJI_BasePress': 'Base Pressure', 'form_data.ALDFIJI_Thick': 'Measured Thickness (nm)',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 227

```text
                                                    'form_data.ALDFIJI_ThickUnit': 'Measured Unit'})
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 230

```text
        for index, row in ALDDataSmall.iterrows():
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 233

```text
            film = shortenStr(row['Film Deposited'],13)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 235

```text
            ALDDataSmall.at[index, 'Film Deposited'] = combineCells(film, row['Other Film'])
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 239

```text
            ALDDataSmall.at[index, 'Deposition Mode'] = shortenStr(row['Deposition Mode'],12)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 242

```text
            if row['Measured Unit'] == 'ALDFIJI_ThickUnit_Ang':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 243

```text
                try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 244

```text
                    thickness_value = row['Measured Thickness (nm)']
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 245

```text
                    ALDDataSmall.at[index, 'Measured Thickness (nm)'] = int(thickness_value) / 10
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 246

```text
                except ValueError as e:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 248

```text
                    ALDDataSmall.at[index, 'Measured Thickness (nm)'] = None
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 252

```text
        ALDDataSmall.drop(columns=['Other Film', 'Measured Unit'], inplace=True)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 255

```text
        ALDDataSmall.to_csv(os.path.join(DATA_DIR, 'small_ALD_DataCollection.csv'))
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 260

```text
def saveEbeam():
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 261

```text
    print('Saving Ebeam')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 262

```text
    ensureExists('Ebeam_DataCollection.csv')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 263

```text
    EbeamData = retrieveData('Ebeam')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 264

```text
    if changedData('Ebeam_DataCollection.csv', EbeamData):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 265

```text
        EbeamData.to_csv(os.path.join(DATA_DIR, 'Ebeam_DataCollection.csv'))
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 266

```text
        columns_to_keep = ['submission_id','submitter_name','form_data.DENTONSJ20C_Substrate','form_data.DENTONSJ20C_SubOther','form_data.DENTONSJ20C_BasePress','form_data.DENTONSJ20C_BasePressUnit','form_data.DENTONSJ20C_PumpDownTime',
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 267

```text
                           'form_data.DENTONSJ20C_Material1','form_data.DENTONSJ20C_Material1_MatOther','form_data.DENTONSJ20C_Material1_BeamVoltage','form_data.DENTONSJ20C_Material1_MaxCurrent','form_data.DENTONSJ20C_Material1_CrystalThick','form_data.DENTONSJ20C_Material1_MaxDepRate',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 268

```text
                           'form_data.DENTONSJ20C_Material2','form_data.DENTONSJ20C_Material2_MatOther','form_data.DENTONSJ20C_Material2_BeamVoltage','form_data.DENTONSJ20C_Material2_MaxCurrent','form_data.DENTONSJ20C_Material2_CrystalThick','form_data.DENTONSJ20C_Material2_MaxDepRate',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 269

```text
                           'form_data.DENTONSJ20C_Material3','form_data.DENTONSJ20C_Material3_MatOther','form_data.DENTONSJ20C_Material3_BeamVoltage','form_data.DENTONSJ20C_Material3_MaxCurrent','form_data.DENTONSJ20C_Material3_CrystalThick','form_data.DENTONSJ20C_Material3_MaxDepRate',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 270

```text
                           'form_data.DENTONSJ20C_Material4','form_data.DENTONSJ20C_Material4_MatOther','form_data.DENTONSJ20C_Material4_BeamVoltage','form_data.DENTONSJ20C_Material4_MaxCurrent','form_data.DENTONSJ20C_Material4_CrystalThick','form_data.DENTONSJ20C_Material4_MaxDepRate',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 271

```text
                           'form_data.DENTONSJ20C_TotalThick','form_data.DENTONSJ20C_TotalThickUnit','form_data.DENTONSJ20C_SheetRho', 'form_data.DENTONSJ20C_CryoTemp']
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 272

```text
        EbeamDataSmall = EbeamData[columns_to_keep]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 273

```text
        EbeamDataSmall = EbeamDataSmall.rename(columns={'form_data.DENTONSJ20C_Substrate': 'Substrate','form_data.DENTONSJ20C_SubOther': 'Other Substrate',
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 274

```text
                                                    'form_data.DENTONSJ20C_BasePress': 'Base Pressure', 'form_data.DENTONSJ20C_BasePressUnit': 'Base Pressure Unit',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 275

```text
                                                    'form_data.DENTONSJ20C_PumpDownTime': 'Pump Down Time (min)',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 276

```text
                                                    'form_data.DENTONSJ20C_Material1': 'Material Deposited 1', 'form_data.DENTONSJ20C_Material1_MatOther': 'Other Material 1',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 277

```text
                                                    'form_data.DENTONSJ20C_Material1_BeamVoltage': 'Beam Voltage 1', 'form_data.DENTONSJ20C_Material1_MaxCurrent': 'Max Beam Current 1',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 278

```text
                                                    'form_data.DENTONSJ20C_Material1_CrystalThick': 'Crystal Thickness 1', 'form_data.DENTONSJ20C_Material1_MaxDepRate': 'Max Deposition Rate 1',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 279

```text
                                                    'form_data.DENTONSJ20C_Material2': 'Material Deposited 2', 'form_data.DENTONSJ20C_Material2_MatOther': 'Other Material 2',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 280

```text
                                                    'form_data.DENTONSJ20C_Material2_BeamVoltage': 'Beam Voltage 2', 'form_data.DENTONSJ20C_Material2_MaxCurrent': 'Max Beam Current 2',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 281

```text
                                                    'form_data.DENTONSJ20C_Material2_CrystalThick': 'Crystal Thickness 2', 'form_data.DENTONSJ20C_Material2_MaxDepRate': 'Max Deposition Rate 2',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 282

```text
                                                    'form_data.DENTONSJ20C_Material3': 'Material Deposited 3', 'form_data.DENTONSJ20C_Material3_MatOther': 'Other Material 3',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 283

```text
                                                    'form_data.DENTONSJ20C_Material3_BeamVoltage': 'Beam Voltage 3', 'form_data.DENTONSJ20C_Material3_MaxCurrent': 'Max Beam Current 3',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 284

```text
                                                    'form_data.DENTONSJ20C_Material3_CrystalThick': 'Crystal Thickness 3', 'form_data.DENTONSJ20C_Material3_MaxDepRate': 'Max Deposition Rate 3',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 285

```text
                                                    'form_data.DENTONSJ20C_Material4': 'Material Deposited 4', 'form_data.DENTONSJ20C_Material4_MatOther': 'Other Material 4',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 286

```text
                                                    'form_data.DENTONSJ20C_Material4_BeamVoltage': 'Beam Voltage 4', 'form_data.DENTONSJ20C_Material4_MaxCurrent': 'Max Beam Current 4',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 287

```text
                                                    'form_data.DENTONSJ20C_Material4_CrystalThick': 'Crystal Thickness 4', 'form_data.DENTONSJ20C_Material4_MaxDepRate': 'Max Deposition Rate 4',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 288

```text
                                                    'form_data.DENTONSJ20C_TotalThick':'Total Thickness','form_data.DENTONSJ20C_TotalThickUnit' :'Thickness Unit','form_data.DENTONSJ20C_SheetRho': 'Sheet Resistivity (Ohm/sq)','form_data.DENTONSJ20C_CryoTemp':'Cryo Temp (C)'})
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 290

```text
        for index, row in EbeamDataSmall.iterrows():
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 292

```text
            sub = shortenStr(row['Substrate'], 16)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 293

```text
            EbeamDataSmall.at[index, 'Substrate'] = combineCells(sub, row['Other Substrate'])
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 297

```text
            powerFactor = shortenStr(row['Base Pressure Unit'], 23)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 298

```text
            if powerFactor != 'Unknown' and powerFactor != '':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 299

```text
                EbeamDataSmall.at[index, 'Base Pressure'] = scalePressure(row['Base Pressure'], powerFactor)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 302

```text
            mat1 = shortenStr(row['Material Deposited 1'], 22)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 303

```text
            EbeamDataSmall.at[index, 'Material Deposited 1'] = combineCells(mat1, row['Other Material 1'])
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 304

```text
            mat2 = shortenStr(row['Material Deposited 2'], 22)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 305

```text
            EbeamDataSmall.at[index, 'Material Deposited 2'] = combineCells(mat2, row['Other Material 2'])
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 306

```text
            mat3 = shortenStr(row['Material Deposited 3'], 22)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 307

```text
            EbeamDataSmall.at[index, 'Material Deposited 3'] = combineCells(mat3, row['Other Material 3'])
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 308

```text
            mat4 = shortenStr(row['Material Deposited 4'], 22)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 309

```text
            EbeamDataSmall.at[index, 'Material Deposited 4'] = combineCells(mat4, row['Other Material 4'])
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 314

```text
        EbeamDataSmall.drop(columns=['Other Substrate', 'Base Pressure Unit', 'Other Material 1','Other Material 2','Other Material 3','Other Material 4'], inplace=True)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 316

```text
        EbeamDataSmall.to_csv(os.path.join(DATA_DIR, 'small_Ebeam_DataCollection.csv'))
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 317

```text
    return
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 319

```text
def saveMOCVD():
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 320

```text
    print('Saving MOCVD')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 321

```text
    ensureExists('MOCVD_DataCollection.csv')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 322

```text
    MOCVDData = retrieveData('MOCVD')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 323

```text
    if changedData('MOCVD_DataCollection.csv', MOCVDData):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 324

```text
        MOCVDData.to_csv(os.path.join(DATA_DIR, 'MOCVD_DataCollection.csv'))
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 325

```text
        columns_to_keep = ['submission_id','submitter_name','form_data.AGNITRON_Precursor','form_data.AGNITRON_Recipe','form_data.AGNITRON_RunTime']
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 326

```text
        MOCVDDataSmall = MOCVDData[columns_to_keep]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 327

```text
        MOCVDDataSmall = MOCVDDataSmall.rename(columns={'form_data.AGNITRON_Precursor': 'Precursors Used', 'form_data.AGNITRON_Recipe': 'Recipe', 'form_data.AGNITRON_RunTime': 'Total Run Time'})
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 329

```text
        for index, row in MOCVDDataSmall.iterrows():
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 331

```text
            prec = shortenStr(row['Precursors Used'], 19)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 332

```text
            MOCVDDataSmall.at[index, 'Precursors Used'] = prec
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 336

```text
    MOCVDDataSmall.to_csv(os.path.join(DATA_DIR, 'small_MOCVD_DataCollection.csv'))
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 338

```text
def saveParylene():
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 339

```text
    print('Saving Parylene')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 340

```text
    ensureExists('Parylene_DataCollection.csv')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 341

```text
    ParyleneData = retrieveData('Parylene')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 342

```text
    if  (changedData('Parylene_DataCollection.csv', ParyleneData)):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 343

```text
        ParyleneData.to_csv(os.path.join(DATA_DIR, 'Parylene_DataCollection.csv'))
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 344

```text
        columns_to_keep = ['submission_id','submitter_name','form_data.SCSPDS2010_Substrate','form_data.SCSPDS2010_SubstrateOth','form_data.SCSPDS2010_Adhesion','form_data.SCSPDS2010_Adhesion','form_data.SCSPDS2010_ThickUnit','form_data.SCSPDS2010_ThickTop','form_data.SCSPDS2010_ThickCenter']
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 345

```text
        ParyleneDataSmall = ParyleneData[columns_to_keep]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 346

```text
        ParyleneDataSmall = ParyleneDataSmall.rename(columns={'form_data.SCSPDS2010_Substrate':'Substrate', 'form_data.SCSPDS2010_SubstrateOth': 'Other Substrate', 'form_data.SCSPDS2010_Adhesion': 'Adhesion', 'form_data.SCSPDS2010_ThickUnit': 'Thickness Unit', 'form_data.SCSPDS2010_ThickTop': 'Top Thickness', 'form_data.SCSPDS2010_ThickCenter': 'Center Thickness'})
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 348

```text
        for index, row in ParyleneDataSmall.iterrows():
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 350

```text
            sub = shortenStr(row['Substrate'],21)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 352

```text
            ParyleneDataSmall.at[index, 'Substrate'] = combineCells(sub, row['Other Substrate'])
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 355

```text
            adhesion = shortenStr(row['Adhesion'], 20)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 356

```text
            ParyleneDataSmall.at[index, 'Adhesion'] = adhesion
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 359

```text
            unit = shortenStr(row['Thickness Unit'], 21)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 360

```text
            ParyleneDataSmall.at[index, 'Thickness Top'] = str(ParyleneDataSmall.at[index, 'Top Thickness']) + unit
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 361

```text
            ParyleneDataSmall.at[index, 'Thickness Center'] = str(ParyleneDataSmall.at[index, 'Center Thickness']) + unit
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 363

```text
        ParyleneDataSmall.drop(columns=['Other Substrate', 'Thickness Unit'], inplace=True)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 364

```text
        ParyleneDataSmall.to_csv(os.path.join(DATA_DIR, 'small_Parylene_DataCollection.csv'))
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 367

```text
def savePECVD():
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 368

```text
    print('Saving PECVD')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 369

```text
    ensureExists('PECVD_DataCollection.csv')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 370

```text
    PECVDData = retrieveData('PECVD')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 371

```text
    if changedData('PECVD_DataCollection.csv', PECVDData):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 372

```text
        PECVDData.to_csv(os.path.join(DATA_DIR, 'PECVD_DataCollection.csv'))
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 373

```text
        columns_to_keep = ['submission_id','submitter_name','form_data.OX80PECVD_Recipe','form_data.OX80PECVD_BasePress','form_data.OX80PECVD_ArFlow','form_data.OX80PECVD_DepPress',
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 374

```text
                           'form_data.OX80PECVD_Power','form_data.OX80PECVD_EtchTime','form_data.OX80PECVD_ThickSite1','form_data.OX80PECVD_ThickUnit',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 375

```text
                           'form_data.OX80PECVD_NH3Flow','form_data.OX80PECVD_N2Flow','form_data.OX80PECVD_SiH4Flow','form_data.OX80PECVD_ThickSite2',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 376

```text
                           'form_data.OX80PECVD_ThickSite3','form_data.OX80PECVD_N2OFlow','form_data.OX80PECVD_O2Flow']
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 377

```text
        PECVDDataSmall = PECVDData[columns_to_keep]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 378

```text
        PECVDDataSmall = PECVDDataSmall.rename(columns={'form_data.OX80PECVD_Recipe': 'Recipe', 'form_data.OX80PECVD_BasePress': 'Base Pressure', 'form_data.OX80PECVD_ArFlow': 'Argon Flow Rate',
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 379

```text
                                                        'form_data.OX80PECVD_DepPress': 'Deposition Pressure', 'form_data.OX80PECVD_Power': 'Power', 'form_data.OX80PECVD_EtchTime': 'Etch Time',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 380

```text
                                                        'form_data.OX80PECVD_ThickSite1': 'Thickness Site 1', 'form_data.OX80PECVD_ThickSite2': 'Thickness Site 2', 'form_data.OX80PECVD_ThickSite3': 'Thickness Site 3',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 381

```text
                                                        'form_data.OX80PECVD_ThickUnit': 'Thickness Unit', 'form_data.OX80PECVD_NH3Flow': 'NH3 Flow Rate', 'form_data.OX80PECVD_N2Flow': 'N2 Flow Rate',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 382

```text
                                                        'form_data.OX80PECVD_SiH4Flow': 'SiH4 Flow Rate', 'form_data.OX80PECVD_N2OFlow': 'N2O Flow Rate', 'form_data.OX80PECVD_O2Flow': 'O2 Flow Rate'})
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 384

```text
        for index, row in PECVDDataSmall.iterrows():
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 386

```text
                if row['Thickness Unit'] == 'OX80PECVD_ThickUnit_Ang':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 387

```text
                    PECVDData.at[index, 'Thickness Site 1'] = int(row['Thickness Site 1']) / 10
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 388

```text
                    PECVDData.at[index, 'Thickness Site 2'] = int(row['Thickness Site 2']) / 10
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 389

```text
                    PECVDData.at[index, 'Thickness Site 3'] = int(row['Thickness Site 3']) / 10
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 393

```text
        PECVDDataSmall.drop(columns=['Thickness Unit'], inplace=True)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 394

```text
        PECVDDataSmall.to_csv(os.path.join(DATA_DIR, 'small_PECVD_DataCollection.csv'))
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 397

```text
def saveDenton635():
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 398

```text
    print('Saving Denton635')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 399

```text
    ensureExists('Denton635_DataCollection.csv')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 400

```text
    Denton635Data = retrieveData('Denton635')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 401

```text
    if changedData('Denton635_DataCollection.csv', Denton635Data):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 402

```text
        Denton635Data.to_csv(os.path.join(DATA_DIR, 'Denton635_DataCollection.csv'))
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 403

```text
        columns_to_keep = ['submission_id','submitter_name','form_data.DENTON635_Substrate','form_data.DENTON635_SubstrateOther', 'form_data.DENTON635_MasterRecipe','form_data.DENTON635_DuplicateRuns',
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 404

```text
                           'form_data.DENTON635_BasePressVal','form_data.DENTON635_BasePressUnit','form_data.DENTON635_Clean_RFPower','form_data.DENTON635_Clean_RFTime',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 405

```text
                           'form_data.DENTON635_DepRecipe1','form_data.DENTON635_Mat1_Target','form_data.DENTON635_Mat1_OthTarget','form_data.DENTON635_Mat1_PreSputTime',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 406

```text
                           'form_data.DENTON635_Mat1_SputterTime','form_data.DENTON635_Mat1_SputterPower','form_data.DENTON635_Mat1_ChamberPress',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 407

```text
                           'form_data.DENTON635_Mat1_ArFlow','form_data.DENTON635_Mat1_N2Flow','form_data.DENTON635_Mat1_O2Flow',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 408

```text
                           'form_data.DENTON635_DepRecipe2','form_data.DENTON635_Mat2_Target','form_data.DENTON635_Mat2_OthTarget','form_data.DENTON635_Mat2_PreSputTime',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 409

```text
                           'form_data.DENTON635_Mat2_SputterTime','form_data.DENTON635_Mat2_SputterPower','form_data.DENTON635_Mat2_ChamberPress',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 410

```text
                           'form_data.DENTON635_Mat2_ArFlow','form_data.DENTON635_Mat2_N2Flow','form_data.DENTON635_Mat2_O2Flow',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 411

```text
                           'form_data.DENTON635_DepRecipe3','form_data.DENTON635_Mat3_Target','form_data.DENTON635_Mat3_OthTarget','form_data.DENTON635_Mat3_PreSputTime',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 412

```text
                           'form_data.DENTON635_Mat3_SputterTime','form_data.DENTON635_Mat3_SputterPower','form_data.DENTON635_Mat3_ChamberPress',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 413

```text
                           'form_data.DENTON635_Mat3_ArFlow','form_data.DENTON635_Mat3_N2Flow','form_data.DENTON635_Mat3_O2Flow',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 414

```text
                           'form_data.DENTON635_DepRecipe4','form_data.DENTON635_Mat4_Target','form_data.DENTON635_Mat4_OthTarget','form_data.DENTON635_Mat4_PreSputTime',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 415

```text
                           'form_data.DENTON635_Mat4_SputterTime','form_data.DENTON635_Mat4_SputterPower','form_data.DENTON635_Mat4_ChamberPress',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 416

```text
                           'form_data.DENTON635_Mat4_ArFlow','form_data.DENTON635_Ma4_N2Flow','form_data.DENTON635_Mat4_O2Flow',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 417

```text
                           'form_data.DENTON635_TotalThick','form_data.DENTON635_ThickUnit','form_data.DENTON635_Stress','form_data.DENTON635_SheetRho',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 418

```text
                           'form_data.DENTON635_CryoTemp','form_data.DENTON635_Mat1_PowerSupply','form_data.DENTON635_Mat2_PowerSupply','form_data.DENTON635_Mat3_PowerSupply',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 419

```text
                           'form_data.DENTON635_Mat4_PowerSupply','form_data.DENTON635_Resistivity']
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 420

```text
        Denton635DataSmall = Denton635Data[columns_to_keep]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 421

```text
        Denton635DataSmall = Denton635DataSmall.rename(columns={'form_data.DENTON635_Substrate': 'Substrate', 'form_data.DENTON635_SubstrateOther': 'Other Substrate', 'form_data.DENTON635_MasterRecipe': 'Master Recipe',
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 422

```text
                                                                'form_data.DENTON635_DuplicateRuns': 'Duplicate Runs','form_data.DENTON635_BasePressVal': 'Base Pressure', 'form_data.DENTON635_BasePressUnit': 'Base Pressure Unit',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 423

```text
                                                                'form_data.DENTON635_Clean_RFPower': 'Clean RF Power', 'form_data.DENTON635_Clean_RFTime': 'Clean RF Time',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 424

```text
                                                                'form_data.DENTON635_DepRecipe1': 'Deposition Recipe 1', 'form_data.DENTON635_Mat1_Target': 'Material 1 Target',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 425

```text
                                                                'form_data.DENTON635_Mat1_OthTarget': 'Other Material 1 Target', 'form_data.DENTON635_Mat1_PreSputTime': 'Material 1 Pre-Sputter Time',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 426

```text
                                                                'form_data.DENTON635_Mat1_SputterTime': 'Material 1 Sputter Time', 'form_data.DENTON635_Mat1_SputterPower': 'Material 1 Sputter Power',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 427

```text
                                                                'form_data.DENTON635_Mat1_ChamberPress': 'Material 1 Chamber Pressure','form_data.DENTON635_Mat1_ArFlow': 'Material 1 Argon Flow',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 428

```text
                                                                'form_data.DENTON635_Mat1_N2Flow': 'Material 1 Nitrogen Flow', 'form_data.DENTON635_Mat1_O2Flow': 'Material 1 Oxygen Flow',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 429

```text
                                                                'form_data.DENTON635_DepRecipe2': 'Deposition Recipe 2', 'form_data.DENTON635_Mat2_Target': 'Material 2 Target',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 430

```text
                                                                'form_data.DENTON635_Mat2_OthTarget': 'Other Material 2 Target', 'form_data.DENTON635_Mat2_PreSputTime': 'Material 2 Pre-Sputter Time',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 431

```text
                                                                'form_data.DENTON635_Mat2_SputterTime': 'Material 2 Sputter Time', 'form_data.DENTON635_Mat2_SputterPower': 'Material 2 Sputter Power',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 432

```text
                                                                'form_data.DENTON635_Mat2_ChamberPress': 'Material 2 Chamber Pressure', 'form_data.DENTON635_Mat2_ArFlow': 'Material 2 Argon Flow',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 433

```text
                                                                'form_data.DENTON635_Mat2_N2Flow': 'Material 2 Nitrogen', 'form_data.DENTON635_Mat2_O2Flow': 'Material 2 Oxygen Flow',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 434

```text
                                                                'form_data.DENTON635_DepRecipe3': 'Deposition Recipe 3','form_data.DENTON635_Mat3_Target': 'Material 3 Target',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 435

```text
                                                                'form_data.DENTON635_Mat3_OthTarget': 'Other Material 3 Target', 'form_data.DENTON635_Mat3_PreSputTime': 'Material 3 Pre-Sputter Time',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 436

```text
                                                                'form_data.DENTON635_Mat3_SputterTime': 'Material 3 Sputter Time', 'form_data.DENTON635_Mat3_SputterPower': 'Material 3 Sputter Power',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 437

```text
                                                                'form_data.DENTON635_Mat3_ChamberPress': 'Material 3 Chamber Pressure','form_data.DENTON635_Mat3_ArFlow': 'Material 3 Argon Flow',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 438

```text
                                                                'form_data.DENTON635_Mat3_N2Flow': 'Material 3 Nitrogen Flow', 'form_data.DENTON635_Mat3_O2Flow': 'Material 3 Oxygen Flow',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 439

```text
                                                                'form_data.DENTON635_DepRecipe4': 'Deposition Recipe 4','form_data.DENTON635_Mat4_Target': 'Material 4 Target',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 440

```text
                                                                'form_data.DENTON635_Mat4_OthTarget': 'Other Material 4 Target', 'form_data.DENTON635_Mat4_PreSputTime': 'Material 4 Pre-Sputter Time',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 441

```text
                                                                'form_data.DENTON635_Mat4_SputterTime': 'Material 4 Sputter Time', 'form_data.DENTON635_Mat4_SputterPower': 'Material 4 Sputter Power',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 442

```text
                                                                'form_data.DENTON635_Mat4_ChamberPress': 'Material 4 Chamber Pressure','form_data.DENTON635_Mat4_ArFlow': 'Material 4 Argon Flow',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 443

```text
                                                                'form_data.DENTON635_Ma4_N2Flow': 'Material 4 Nitrogen Flow', 'form_data.DENTON635_Mat4_O2Flow': 'Material 4 Oxygen Flow',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 444

```text
                                                                'form_data.DENTON635_TotalThick': 'Total Thickness', 'form_data.DENTON635_ThickUnit': 'Thickness Unit', 'form_data.DENTON635_Stress': 'Stress',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 445

```text
                                                                'form_data.DENTON635_SheetRho': 'Sheet Resistivity','form_data.DENTON635_CryoTemp': 'Cryo Temp',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 446

```text
                                                                'form_data.DENTON635_Mat1_PowerSupply': 'Material 1 Power Supply', 'form_data.DENTON635_Mat2_PowerSupply': 'Material 2 Power Supply',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 447

```text
                                                                'form_data.DENTON635_Mat3_PowerSupply': 'Material 3 Power Supply','form_data.DENTON635_Mat4_PowerSupply': 'Material 4 Power Supply',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 448

```text
                                                                'form_data.DENTON635_Resistivity': 'Resistivity'})
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 450

```text
        for index, row in Denton635DataSmall.iterrows():
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 452

```text
            sub = shortenStr(row['Substrate'],20)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 454

```text
            Denton635DataSmall.at[index, 'Substrate'] = combineCells(sub, row['Other Substrate'])
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 457

```text
            powerFactor = shortenStr(row['Base Pressure Unit'], 25)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 458

```text
            if powerFactor != 'Unknown' and powerFactor != '':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 459

```text
                Denton635DataSmall.at[index, 'Base Pressure'] = scalePressure(row['Base Pressure'], powerFactor)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 462

```text
            mat1 = shortenStr(row['Material 1 Target'], 18)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 463

```text
            Denton635DataSmall.at[index, 'Material 1 Target'] = combineCells(mat1, row['Other Material 1 Target'])
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 464

```text
            mat2 = shortenStr(row['Material 2 Target'], 18)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 465

```text
            Denton635DataSmall.at[index, 'Material 2 Target'] = combineCells(mat2, row['Other Material 2 Target'])
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 466

```text
            mat3 = shortenStr(row['Material 3 Target'], 18)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 467

```text
            Denton635DataSmall.at[index, 'Material 3 Target'] = combineCells(mat3, row['Other Material 3 Target'])
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 468

```text
            mat4 = shortenStr(row['Material 4 Target'], 18)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 469

```text
            Denton635DataSmall.at[index, 'Material 4 Target'] = combineCells(mat4, row['Other Material 4 Target'])
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 472

```text
            if row['Thickness Unit'] == 'DENTON635_ThickUnit_Ang':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 473

```text
                Denton635DataSmall.at[index, 'Total Thickness'] = int(row['Total Thickness']) / 10
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 476

```text
            power1 = shortenStr(row['Material 1 Power Supply'], 27)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 477

```text
            Denton635DataSmall.at[index, 'Material 1 Power Supply'] = power1
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 478

```text
            power2 = shortenStr(row['Material 2 Power Supply'], 27)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 479

```text
            Denton635DataSmall.at[index, 'Material 2 Power Supply'] = power2
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 480

```text
            power3 = shortenStr(row['Material 3 Power Supply'], 27)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 481

```text
            Denton635DataSmall.at[index, 'Material 3 Power Supply'] = power3
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 482

```text
            power4 = shortenStr(row['Material 4 Power Supply'], 27)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 483

```text
            Denton635DataSmall.at[index, 'Material 4 Power Supply'] = power4
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 486

```text
        Denton635DataSmall.drop(columns=['Other Substrate', 'Base Pressure Unit', 'Other Material 1 Target','Other Material 2 Target',
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 487

```text
                                         'Other Material 3 Target','Other Material 4 Target'], inplace=True)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 488

```text
        Denton635DataSmall.to_csv(os.path.join(DATA_DIR, 'small_Denton635_DataCollection.csv'))
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 490

```text
def saveDenton18():
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 491

```text
    print('Saving Denton18')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 492

```text
    ensureExists('Denton18_DataCollection.csv')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 493

```text
    Denton18Data = retrieveData('Denton18')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 494

```text
    if changedData('Denton18_DataCollection.csv', Denton18Data):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 495

```text
        Denton18Data.to_csv(os.path.join(DATA_DIR, 'Denton18_DataCollection.csv'))
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 496

```text
        columns_to_keep = ['submission_id','submitter_name','form_data.DENTON18_Substrate','form_data.DENTON18_SubstrateOther','form_data.DENTON18_TgtChng','form_data.DENTON18_NoRuns',
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 497

```text
                           'form_data.DENTON18_CryoTemp','form_data.DENTON18_BasePressVal','form_data.DENTON18_BasePressUnit',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 498

```text
                           'form_data.DENTON18_Mat1_Target','form_data.DENTON18_Mat1_OthTarget','form_data.DENTON18_Mat1_PowerSupply','form_data.DENTON18_Mat1_SputPower','form_data.DENTON18_Mat1_PreSputTime',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 499

```text
                           'form_data.DENTON18_Mat1_SputTime','form_data.DENTON18_Mat1_ArSputPress','form_data.DENTON18_Mat1_ArFlow','form_data.DENTON18_Mat1_O2Flow',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 500

```text
                           'form_data.DENTON18_Mat2_Target','form_data.DENTON18_Mat2_OthTarget','form_data.DENTON18_Mat2_SputPower','form_data.DENTON18_Mat2_PreSputTime',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 501

```text
                           'form_data.DENTON18_Mat2_SputTime','form_data.DENTON18_Mat2_ArSputPress','form_data.DENTON18_Mat2_ArFlow','form_data.DENTON18_Mat2_O2Flow',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 502

```text
                           'form_data.DENTON18_Mat3_Target','form_data.DENTON18_Mat3_OthTarget','form_data.DENTON18_Mat3_SputPower','form_data.DENTON18_Mat3_PreSputTime',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 503

```text
                            'form_data.DENTON18_Mat3_SputTime','form_data.DENTON18_Mat3_ArSputPress','form_data.DENTON18_Mat3_ArFlow','form_data.DENTON18_Mat3_O2Flow',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 504

```text
                            'form_data.DENTON18_ThickUnit','form_data.DENTON18_Thick1','form_data.DENTON18_Thick2','form_data.DENTON18_Thick3','form_data.DENTON18_Thick4','form_data.DENTON18_Thick5',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 505

```text
                            'form_data.DENTON18_FilmStress','form_data.DENTON18_SheetRho1','form_data.DENTON18_SheetRho2','form_data.DENTON18_SheetRho3','form_data.DENTON18_SheetRho4','form_data.DENTON18_SheetRho5']
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 506

```text
        Denton18DataSmall = Denton18Data[columns_to_keep]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 507

```text
        Denton18DataSmall = Denton18DataSmall.rename(columns={'form_data.DENTON18_Substrate': 'Substrate', 'form_data.DENTON18_SubstrateOther': 'Other Substrate', 'form_data.DENTON18_TgtChng': 'Target Change',
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 508

```text
                                                            'form_data.DENTON18_NoRuns': 'Number of Runs', 'form_data.DENTON18_CryoTemp': 'Cryo Temp', 'form_data.DENTON18_BasePressVal': 'Base Pressure','form_data.DENTON18_BasePressUnit': 'Base Pressure Unit',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 509

```text
                                                            'form_data.DENTON18_Mat1_Target': 'Material 1 Target', 'form_data.DENTON18_Mat1_OthTarget': 'Other Material 1 Target','form_data.DENTON18_Mat1_PowerSupply': 'Material 1 Power Supply',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 510

```text
                                                            'form_data.DENTON18_Mat1_SputPower': 'Material 1 Sputter Power', 'form_data.DENTON18_Mat1_PreSputTime': 'Material 1 Pre-Sputter Time','form_data.DENTON18_Mat1_SputTime': 'Material 1 Sputter Time',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 511

```text
                                                            'form_data.DENTON18_Mat1_ArSputPress': 'Material 1 Argon Sputter Pressure', 'form_data.DENTON18_Mat1_ArFlow': 'Material 1 Argon Flow','form_data.DENTON18_Mat1_O2Flow': 'Material 1 Oxygen Flow',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 512

```text
                                                            'form_data.DENTON18_Mat2_Target': 'Material 2 Target', 'form_data.DENTON18_Mat2_OthTarget': 'Other Material 2 Target',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 513

```text
                                                            'form_data.DENTON18_Mat2_SputPower': 'Material 2 Sputter Power', 'form_data.DENTON18_Mat2_PreSputTime': 'Material 2 Pre-Sputter Time','form_data.DENTON18_Mat2_SputTime': 'Material 2 Sputter Time',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 514

```text
                                                            'form_data.DENTON18_Mat2_ArSputPress': 'Material 2 Argon Sputter Pressure', 'form_data.DENTON18_Mat2_ArFlow': 'Material 2 Argon Flow','form_data.DENTON18_Mat2_O2Flow': 'Material 2 Oxygen Flow',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 515

```text
                                                            'form_data.DENTON18_Mat3_Target': 'Material 3 Target', 'form_data.DENTON18_Mat3_OthTarget': 'Other Material 3 Target',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 516

```text
                                                            'form_data.DENTON18_Mat3_SputPower': 'Material 3 Sputter Power', 'form_data.DENTON18_Mat3_PreSputTime': 'Material 3 Pre-Sputter Time','form_data.DENTON18_Mat3_SputTime': 'Material 3 Sputter Time',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 517

```text
                                                            'form_data.DENTON18_Mat3_ArSputPress': 'Material 3 Argon Sputter Pressure', 'form_data.DENTON18_Mat3_ArFlow': 'Material 3 Argon Flow','form_data.DENTON18_Mat3_O2Flow': 'Material 3 Oxygen Flow',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 518

```text
                                                            'form_data.DENTON18_ThickUnit': 'Thickness Unit', 'form_data.DENTON18_Thick1': 'Thickness 1','form_data.DENTON18_Thick2': 'Thickness 2', 'form_data.DENTON18_Thick3': 'Thickness 3',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 519

```text
                                                            'form_data.DENTON18_Thick4': 'Thickness 4', 'form_data.DENTON18_Thick5': 'Thickness 5','form_data.DENTON18_FilmStress': 'Film Stress', 'form_data.DENTON18_SheetRho1': 'Sheet Resistivity 1',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 520

```text
                                                            'form_data.DENTON18_SheetRho2': 'Sheet Resistivity 2','form_data.DENTON18_SheetRho3': 'Sheet Resistivity 3', 'form_data.DENTON18_SheetRho4': 'Sheet Resistivity 4', 'form_data.DENTON18_SheetRho5': 'Sheet Resistivity 5'})
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 522

```text
        for index, row in Denton18DataSmall.iterrows():
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 524

```text
            sub = shortenStr(row['Substrate'],19)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 526

```text
            Denton18DataSmall.at[index, 'Substrate'] = combineCells(sub, row['Other Substrate'])
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 529

```text
            target = shortenStr(row['Target Change'], 19)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 530

```text
            Denton18DataSmall.at[index, 'Target Change'] = target
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 533

```text
            powerFactor = shortenStr(row['Base Pressure Unit'], 17)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 534

```text
            if powerFactor != 'Unknown' and powerFactor != '':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 535

```text
                Denton18DataSmall.at[index, 'Base Pressure'] = scalePressure(row['Base Pressure'], powerFactor)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 538

```text
            mat1 = shortenStr(row['Material 1 Target'], 17)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 539

```text
            Denton18DataSmall.at[index, 'Material 1 Target'] = combineCells(mat1, row['Other Material 1 Target'])
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 540

```text
            mat2 = shortenStr(row['Material 2 Target'], 17)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 541

```text
            Denton18DataSmall.at[index, 'Material 2 Target'] = combineCells(mat2, row['Other Material 2 Target'])
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 542

```text
            mat3 = shortenStr(row['Material 3 Target'], 17)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 543

```text
            Denton18DataSmall.at[index, 'Material 3 Target'] = combineCells(mat3, row['Other Material 3 Target'])
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 546

```text
            power1 = shortenStr(row['Material 1 Power Supply'], 26)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 547

```text
            Denton18DataSmall.at[index, 'Material 1 Power Supply'] = power1
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 554

```text
            if row['Thickness Unit'] == 'DENTON18_ThickUnit_Ang':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 555

```text
                Denton18DataSmall.at[index, 'Thickness 1'] = (row['Thickness 1']) / 10
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 558

```text
                t1 = pd.to_numeric(row['Thickness 1'], errors='coerce')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 559

```text
                t2 = pd.to_numeric(row['Thickness 2'], errors='coerce')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 560

```text
                t3 = pd.to_numeric(row['Thickness 3'], errors='coerce')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 561

```text
                t4 = pd.to_numeric(row['Thickness 4'], errors='coerce')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 562

```text
                t5 = pd.to_numeric(row['Thickness 5'], errors='coerce')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 563

```text
                Denton18DataSmall.at[index, 'Thickness 1'] = t1 / 10 if pd.notna(t1) else np.nan
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 564

```text
                Denton18DataSmall.at[index, 'Thickness 2'] = t2 / 10 if pd.notna(t2) else np.nan
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 565

```text
                Denton18DataSmall.at[index, 'Thickness 3'] = t3 / 10 if pd.notna(t3) else np.nan
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 566

```text
                Denton18DataSmall.at[index, 'Thickness 4'] = t4 / 10 if pd.notna(t4) else np.nan
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 567

```text
                Denton18DataSmall.at[index, 'Thickness 5'] = t5 / 10 if pd.notna(t5) else np.nan
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 572

```text
        Denton18DataSmall.drop(columns=['Other Substrate', 'Base Pressure Unit', 'Other Material 1 Target','Other Material 2 Target','Other Material 3 Target','Thickness Unit'], inplace=True)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 573

```text
        Denton18DataSmall.to_csv(os.path.join(DATA_DIR, 'small_Denton18_DataCollection.csv'))
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 576

```text
def saveTMV():
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 577

```text
    print('Saving TMV')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 578

```text
    ensureExists('TMV_DataCollection.csv')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 579

```text
    TMVData = retrieveData('TMV')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 580

```text
    if changedData('TMV_DataCollection.csv', TMVData):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 581

```text
        TMVData.to_csv(os.path.join(DATA_DIR, 'TMV_DataCollection.csv'))
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 582

```text
        columns_to_keep = ['submission_id','submitter_name','form_data.TMV_Substrate','form_data.TMV_OthSubstrate','form_data.TMV_SampleHolders','form_data.TMV_DupRuns',
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 583

```text
                           'form_data.TMV_ChamberPumpTime','form_data.TMV_BasePressVal','form_data.TMV_BasePressUnit',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 584

```text
                           'form_data.TMV_S1Chuck','form_data.TMV_S1Material','form_data.TMV_S1PowerSupply','form_data.TMV_S1PreSputTime','form_data.TMV_S1PreSputPower',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 585

```text
                           'form_data.TMV_S1SputTime','form_data.TMV_S1SputPower','form_data.TMV_S1SputDepPress', 'form_data.TMV_S1ArgonFlow','form_data.TMV_S1O2Flow',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 586

```text
                           'form_data.TMV_S2Chuck','form_data.TMV_S2Material','form_data.TMV_S2PowerSupply','form_data.TMV_S2PreSputTime','form_data.TMV_S2PreSputPower',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 587

```text
                           'form_data.TMV_S2SputTime','form_data.TMV_S2SputPower','form_data.TMV_S2SputDepPress', 'form_data.TMV_S2ArgonFlow','form_data.TMV_S2O2Flow',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 588

```text
                           'form_data.TMV_S3Chuck','form_data.TMV_S3Material','form_data.TMV_S3PowerSupply','form_data.TMV_S3PreSputTime',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 589

```text
                           'form_data.TMV_S3SputTime','form_data.TMV_S3SputPower','form_data.TMV_S3SputDepPress', 'form_data.TMV_S3ArgonFlow','form_data.TMV_S3O2Flow',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 590

```text
                           'form_data.TMV_S4Material','form_data.TMV_S4PowerSupply','form_data.TMV_S4PreSputTime','form_data.TMV_S4SputTime',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 591

```text
                           'form_data.TMV_ThickUnit','form_data.TMV_Thick']
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 593

```text
        TMVDataSmall = TMVData[columns_to_keep]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 594

```text
        TMVDataSmall = TMVDataSmall.rename(columns={'form_data.TMV_Substrate': 'Substrate', 'form_data.TMV_OthSubstrate': 'Other Substrate',
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 595

```text
                                                    'form_data.TMV_SampleHolders': 'Sample Holders','form_data.TMV_DupRuns': 'Duplicate Runs',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 596

```text
                                                    'form_data.TMV_ChamberPumpTime': 'Chamber Pump Time', 'form_data.TMV_BasePressVal': 'Base Pressure',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 597

```text
                                                    'form_data.TMV_BasePressUnit': 'Base Pressure Unit',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 598

```text
                                                    'form_data.TMV_S1Chuck': 'Sample 1 Chuck', 'form_data.TMV_S1Material': 'Sample 1 Material','form_data.TMV_S1PowerSupply': 'Sample 1 Power Supply',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 599

```text
                                                    'form_data.TMV_S1PreSputTime': 'Sample 1 Pre-Sputter Time', 'form_data.TMV_S1PreSputPower': 'Sample 1 Pre-Sputter Power',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 600

```text
                                                    'form_data.TMV_S1SputTime': 'Sample 1 Sputter Time', 'form_data.TMV_S1SputPower': 'Sample 1 Sputter Power',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 601

```text
                                                    'form_data.TMV_S1SputDepPress': 'Sample 1 Sputter Deposition Pressure','form_data.TMV_S1ArgonFlow': 'Sample 1 Argon Flow', 'form_data.TMV_S1O2Flow': 'Sample 1 Oxygen Flow',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 602

```text
                                                    'form_data.TMV_S2Chuck': 'Sample 2 Chuck','form_data.TMV_S2Material': 'Sample 2 Material', 'form_data.TMV_S2PowerSupply': 'Sample 2 Power Supply',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 603

```text
                                                    'form_data.TMV_S2PreSputTime': 'Sample 2 Pre-Sputter Time','form_data.TMV_S2PreSputPower': 'Sample 2 Pre-Sputter Power',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 604

```text
                                                    'form_data.TMV_S2SputTime': 'Sample 2 Sputter Time', 'form_data.TMV_S2SputPower': 'Sample 2 Sputter Power',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 605

```text
                                                    'form_data.TMV_S2SputDepPress': 'Sample 2 Sputter Deposition Pressure', 'form_data.TMV_S2ArgonFlow': 'Sample 2 Argon Flow', 'form_data.TMV_S2O2Flow': 'Sample 2 Oxygen Flow',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 606

```text
                                                    'form_data.TMV_S3Chuck': 'Sample 3 Chuck', 'form_data.TMV_S3Material': 'Sample 3 Material', 'form_data.TMV_S3PowerSupply': 'Sample 3 Power Supply',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 607

```text
                                                    'form_data.TMV_S3PreSputTime': 'Sample 3 Pre-Sputter Time', 'form_data.TMV_S3PreSputPower': 'Sample 3 Pre-Sputter Power',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 608

```text
                                                    'form_data.TMV_S3SputTime': 'Sample 3 Sputter Time', 'form_data.TMV_S3SputPower': 'Sample 3 Sputter Power',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 609

```text
                                                    'form_data.TMV_S3SputDepPress': 'Sample 3 Sputter Deposition Pressure', 'form_data.TMV_S3ArgonFlow': 'Sample 3 Argon Flow','form_data.TMV_S3O2Flow': 'Sample 3 Oxygen Flow',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 610

```text
                                                    'form_data.TMV_S4Chuck': 'Sample 4 Chuck', 'form_data.TMV_S4Material': 'Sample 4 Material','form_data.TMV_S4PowerSupply': 'Sample 4 Power Supply',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 611

```text
                                                    'form_data.TMV_S4PreSputTime': 'Sample 4 Pre-Sputter Time', 'form_data.TMV_S4PreSputPower': 'Sample 4 Pre-Sputter Power',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 612

```text
                                                    'form_data.TMV_S4SputTime': 'Sample 4 Sputter Time', 'form_data.TMV_S4SputPower': 'Sample 4 Sputter Power',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 613

```text
                                                    'form_data.TMV_S4SputDepPress': 'Sample 4 Sputter Deposition Pressure','form_data.TMV_S4ArgonFlow': 'Sample 4 Argon Flow', 'form_data.TMV_S4O2Flow': 'Sample 4 Oxygen Flow',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 614

```text
                                                    'form_data.TMV_ThickUnit': 'Thickness Unit', 'form_data.TMV_Thick': 'Thickness'})
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 618

```text
        for index, row in TMVDataSmall.iterrows():
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 620

```text
            sub = shortenStr(row['Substrate'], 14)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 622

```text
            TMVDataSmall.at[index, 'Substrate'] = combineCells(sub, row['Other Substrate'])
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 625

```text
            powerFactor = shortenStr(row['Base Pressure Unit'], 19)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 626

```text
            if powerFactor != 'Unknown' and powerFactor != '':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 629

```text
                TMVDataSmall.at[index, 'Base Pressure'] = scalePressure(row['Base Pressure'], powerFactor)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 630

```text
                TMVDataSmall.at[index, 'Sample 1 Sputter Deposition Pressure'] = scalePressure(row['Sample 1 Sputter Deposition Pressure'], powerFactor)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 631

```text
                TMVDataSmall.at[index, 'Sample 2 Sputter Deposition Pressure'] = scalePressure(row['Sample 2 Sputter Deposition Pressure'], powerFactor)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 632

```text
                TMVDataSmall.at[index, 'Sample 3 Sputter Deposition Pressure'] = scalePressure(row['Sample 3 Sputter Deposition Pressure'], powerFactor)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 635

```text
            mat1 = shortenStr(row['Sample 1 Material'], 15)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 636

```text
            TMVDataSmall.at[index, 'Sample 1 Material'] = mat1
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 637

```text
            mat2 = shortenStr(row['Sample 2 Material'], 15)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 638

```text
            TMVDataSmall.at[index, 'Sample 2 Material'] = mat2
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 639

```text
            mat3 = shortenStr(row['Sample 3 Material'], 15)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 640

```text
            TMVDataSmall.at[index, 'Sample 3 Material'] = mat3
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 641

```text
            mat4 = shortenStr(row['Sample 4 Material'], 15)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 642

```text
            TMVDataSmall.at[index, 'Sample 4 Material'] = mat4
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 645

```text
            power1 = shortenStr(row['Sample 1 Power Supply'], 19)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 646

```text
            TMVDataSmall.at[index, 'Sample 1 Power Supply'] = power1
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 647

```text
            power2 = shortenStr(row['Sample 2 Power Supply'], 19)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 648

```text
            TMVDataSmall.at[index, 'Sample 2 Power Supply'] = power2
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 649

```text
            power3 = shortenStr(row['Sample 3 Power Supply'], 19)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 650

```text
            TMVDataSmall.at[index, 'Sample 3 Power Supply'] = power3
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 651

```text
            power4 = shortenStr(row['Sample 4 Power Supply'], 19)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 652

```text
            TMVDataSmall.at[index, 'Sample 4 Power Supply'] = power4
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 655

```text
            if row['Thickness Unit'] == 'TMV_ThickUnit_Ang':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 656

```text
                TMVDataSmall.at[index, 'Thickness'] = int(row['Thickness']) / 10
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 659

```text
        TMVDataSmall.drop(columns=['Other Substrate', 'Base Pressure Unit'], inplace=True)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 660

```text
        TMVDataSmall.to_csv(os.path.join(DATA_DIR, 'small_TMV_DataCollection.csv'))
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 664

```text
def saveDRIE():
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 665

```text
    print('Saving DRIE')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 666

```text
    ensureExists('DRIE_DataCollection.csv')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 667

```text
    DRIEData = retrieveData('DRIE')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 668

```text
    if changedData('DRIE_DataCollection.csv', DRIEData):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 669

```text
        DRIEData.to_csv(os.path.join(DATA_DIR, 'DRIE_DataCollection.csv'))
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 671

```text
        columns_to_keep = ['submission_id','submitter_name','form_data.OXFORD100_Recipe','form_data.OXFORD100_SubstrateSize', 'form_data.OXFORD100_AreaEtched','form_data.OXFORD100_EtchPress','form_data.OXFORD100_HeBackPress',
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 672

```text
                           'form_data.OXFORD100_CF4','form_data.OXFORD100_SF6','form_data.OXFORD100_DRIEDepTime','form_data.OXFORD100_DRIEEtchTime','form_data.OXFORD100_TotalEtchTime','form_data.OXFORD100_ICPForward',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 673

```text
                           'form_data.OXFORD100_RFCCP','form_data.OXFORD100_RFBias','form_data.OXFORD100_ChuckTemp','form_data.OXFORD100_ContPlasma','form_data.OXFORD100_EtchDepth1','form_data.OXFORD100_EtchDepth2',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 674

```text
                            'form_data.OXFORD100_EtchDepth3','form_data.OXFORD100_EtchDepth4','form_data.OXFORD100_EtchDepth5','form_data.OXFORD100_C4F8','form_data.OXFORD100_O2','form_data.OXFORD100_DRIECycles',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 675

```text
                            'form_data.OXFORD100_Helium','form_data.OXFORD100_PRPreThick','form_data.OXFORD100_PRPostThick','form_data.OXFORD100_N2','form_data.OXFORD100_Argon','form_data.OXFORD100_AspectRatio']
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 676

```text
        DRIEDataSmall = DRIEData[columns_to_keep]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 677

```text
        DRIEDataSmall = DRIEDataSmall.rename(columns={'form_data.OXFORD100_Recipe': 'Recipe', 'form_data.OXFORD100_SubstrateSize': 'Substrate Size', 'form_data.OXFORD100_AreaEtched': 'Area Etched',
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 678

```text
                                                      'form_data.OXFORD100_EtchPress': 'Etch Pressure', 'form_data.OXFORD100_HeBackPress': 'Helium Back Pressure', 'form_data.OXFORD100_CF4': 'CF4 Flow',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 679

```text
                                                      'form_data.OXFORD100_SF6': 'SF6 Flow', 'form_data.OXFORD100_DRIEDepTime': 'DRIE Deposition Time', 'form_data.OXFORD100_DRIEEtchTime': 'DRIE Etch Time',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 680

```text
                                                      'form_data.OXFORD100_TotalEtchTime': 'Total Etch Time', 'form_data.OXFORD100_ICPForward': 'ICP Forward Power', 'form_data.OXFORD100_RFCCP': 'RFC Bias',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 681

```text
                                                      'form_data.OXFORD100_RFBias': 'RF Bias', 'form_data.OXFORD100_ChuckTemp': 'Chuck Temp', 'form_data.OXFORD100_ContPlasma': 'Continuous Plasma',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 682

```text
                                                      'form_data.OXFORD100_EtchDepth1': 'Etch Depth 1', 'form_data.OXFORD100_EtchDepth2': 'Etch Depth 2', 'form_data.OXFORD100_EtchDepth3': 'Etch Depth 3',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 683

```text
                                                      'form_data.OXFORD100_EtchDepth4': 'Etch Depth 4', 'form_data.OXFORD100_EtchDepth5': 'Etch Depth 5', 'form_data.OXFORD100_C4F8': 'C4F8 Flow',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 684

```text
                                                      'form_data.OXFORD100_O2': 'O2 Flow', 'form_data.OXFORD100_DRIECycles': 'DRIE Cycles', 'form_data.OXFORD100_Helium': 'Helium Flow',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 685

```text
                                                      'form_data.OXFORD100_PRPreThick': 'PR Pre-Thick', 'form_data.OXFORD100_PRPostThick': 'PR Post-Thick', 'form_data.OXFORD100_N2': 'N2 Flow',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 686

```text
                                                      'form_data.OXFORD100_Argon': 'Argon Flow', 'form_data.OXFORD100_AspectRatio': 'Aspect Ratio'})
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 689

```text
        for index, row in DRIEDataSmall.iterrows():
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 691

```text
            sub = shortenStr(row['Substrate Size'], 24)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 692

```text
            DRIEDataSmall.at[index, 'Substrate Size'] = sub
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 693

```text
            plasma = shortenStr(row['Continuous Plasma'], 20)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 694

```text
            DRIEDataSmall.at[index, 'Continuous Plasma'] = plasma
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 696

```text
        DRIEDataSmall.to_csv(os.path.join(DATA_DIR, 'small_DRIE_DataCollection.csv'))
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 698

```text
def saveIsotropic():
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 699

```text
    print('Saving Isotropic')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 700

```text
    ensureExists('Isotropic_DataCollection.csv')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 701

```text
    IsotropicData = retrieveData('Isotropic')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 702

```text
    if changedData('Isotropic_DataCollection.csv', IsotropicData):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 703

```text
        IsotropicData.to_csv(os.path.join(DATA_DIR, 'Isotropic_DataCollection.csv'))
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 704

```text
        columns_to_keep = ['submission_id', 'submitter_name', 'form_data.XACTIX_NoCycles']
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 705

```text
        IsotropicDataSmall = IsotropicData[columns_to_keep]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 706

```text
        IsotropicDataSmall = IsotropicDataSmall.rename(columns={'form_data.XACTIX_NoCycles': 'Number of Cycles'})
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 709

```text
        IsotropicDataSmall.to_csv(os.path.join(DATA_DIR, 'small_Isotropic_DataCollection.csv'))
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 711

```text
def savePlasmalab():
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 712

```text
    print('Saving Plasmalab')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 713

```text
    ensureExists('Plasmalab_DataCollection.csv')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 714

```text
    PlasmalabData = retrieveData('PlasmaLab')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 715

```text
    if changedData('Plasmalab_DataCollection.csv', PlasmalabData):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 716

```text
        PlasmalabData.to_csv(os.path.join(DATA_DIR, 'Plasmalab_DataCollection.csv'))
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 718

```text
        columns_to_keep = ['submission_id','submitter_name','form_data.OX80RIE_Recipe','form_data.OX80RIE_MatrlEtched','form_data.OX80RIE_BasePress', 'form_data.OX80RIE_Argon', 'form_data.OX80RIE_Oxygen',
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 719

```text
                           'form_data.OX80RIE_EtchPower', 'form_data.OX80RIE_EtchPress', 'form_data.OX80RIE_EtchTime', 'form_data.OX80RIE_EtchDepth1', 'form_data.OX80RIE_EtchDepth2',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 720

```text
                           'form_data.OX80RIE_EtchDepth3', 'form_data.OX80RIE_C4F8', 'form_data.OX80RIE_SF6']
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 721

```text
        PlasmalabDataSmall = PlasmalabData[columns_to_keep]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 722

```text
        PlasmalabDataSmall = PlasmalabDataSmall.rename(columns={'form_data.OX80RIE_Recipe': 'Recipe', 'form_data.OX80RIE_MatrlEtched': 'Material Etched', 'form_data.OX80RIE_BasePress': 'Base Pressure',
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 723

```text
                                                              'form_data.OX80RIE_Argon': 'Argon Flow', 'form_data.OX80RIE_Oxygen': 'Oxygen Flow', 'form_data.OX80RIE_EtchPower': 'Etch Power',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 724

```text
                                                              'form_data.OX80RIE_EtchPress': 'Etch Pressure', 'form_data.OX80RIE_EtchTime': 'Etch Time', 'form_data.OX80RIE_EtchDepth1': 'Etch Depth 1',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 725

```text
                                                              'form_data.OX80RIE_EtchDepth2': 'Etch Depth 2', 'form_data.OX80RIE_EtchDepth3': 'Etch Depth 3', 'form_data.OX80RIE_C4F8': 'C4F8 Flow',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 726

```text
                                                              'form_data.OX80RIE_SF6': 'SF6 Flow'})
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 729

```text
        PlasmalabDataSmall.to_csv(os.path.join(DATA_DIR, 'small_Plasmalab_DataCollection.csv'))
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 731

```text
def savePlasmaTherm():
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 732

```text
    print('Saving PlasmaTherm')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 733

```text
    ensureExists('PlasmaTherm_DataCollection.csv')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 734

```text
    PlasmaThermData = retrieveData('PlasmaTherm')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 735

```text
    if changedData('PlasmaTherm_DataCollection.csv', PlasmaThermData):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 736

```text
        PlasmaThermData.to_csv(os.path.join(DATA_DIR, 'PlasmaTherm_DataCollection.csv'))
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 738

```text
        columns_to_keep = ['submission_id','submitter_name','form_data.PTHERMMETAL_MatrlEtched','form_data.PTHERMMETAL_Handle','form_data.PTHERMMETAL_Batch','form_data.PTHERMMETAL_Duplicate']
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 739

```text
        PlasmaThermDataSmall = PlasmaThermData[columns_to_keep]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 741

```text
        PlasmaThermDataSmall = PlasmaThermDataSmall.rename(columns={'form_data.PTHERMMETAL_MatrlEtched': 'Material Etched', 'form_data.PTHERMMETAL_Handle': 'Handle',
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 742

```text
                                                                    'form_data.PTHERMMETAL_Batch': 'Batch', 'form_data.PTHERMMETAL_Duplicate': 'Duplicate'})
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 745

```text
        for index, row in PlasmaThermDataSmall.iterrows():
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 746

```text
            handle = shortenStr(row['Handle'], 19)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 747

```text
            PlasmaThermDataSmall.at[index, 'Handle'] = handle
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 749

```text
        PlasmaThermDataSmall.to_csv(os.path.join(DATA_DIR, 'small_PlasmaTherm_DataCollection.csv'))
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 751

```text
def saveTechnics():
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 752

```text
    print('Saving Technics')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 753

```text
    ensureExists('Technics_DataCollection.csv')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 754

```text
    TechnicsData = retrieveData('Technics')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 755

```text
    if changedData('Technics_DataCollection.csv', TechnicsData):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 756

```text
        TechnicsData.to_csv(os.path.join(DATA_DIR, 'Technics_DataCollection.csv'))
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 758

```text
        columns_to_keep = ['submission_id','submitter_name','form_data.TECHNICS_GenComment']
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 759

```text
        TechnicsDataSmall = TechnicsData[columns_to_keep]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 760

```text
        TechnicsDataSmall = TechnicsDataSmall.rename(columns={'form_data.TECHNICS_GenComment': 'Recipe'})
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 763

```text
        TechnicsDataSmall.to_csv(os.path.join(DATA_DIR, 'small_Technics_DataCollection.csv'))
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 766

```text
def saveCleanOx():
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 767

```text
    print('Saving CleanOx')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 768

```text
    ensureExists('CleanOx_DataCollection.csv')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 769

```text
    CleanOxData = retrieveData('CleanOx')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 770

```text
    if changedData('CleanOx_DataCollection.csv', CleanOxData):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 771

```text
        CleanOxData.to_csv(os.path.join(DATA_DIR, 'CleanOx_DataCollection.csv'))
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 773

```text
        columns_to_keep = ['submission_id','submitter_name','form_data.PTEMPCLEAN_RecipeType','form_data.PTEMPCLEAN_RecipeTemp','form_data.PTEMPCLEAN_OxTime','form_data.PTEMPCLEAN_TargetThick',
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 774

```text
                           'form_data.PTEMPCLEAN_NoSamples','form_data.PTEMPCLEAN_MonSlot','form_data.PTEMPCLEAN_MeasTool','form_data.PTEMPCLEAN_Thick1', 'form_data.PTEMPCLEAN_Thick2',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 775

```text
                           'form_data.PTEMPCLEAN_Thick3','form_data.PTEMPCLEAN_Thick4','form_data.PTEMPCLEAN_Thick5']
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 776

```text
        CleanOxDataSmall = CleanOxData[columns_to_keep]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 777

```text
        CleanOxDataSmall = CleanOxDataSmall.rename(columns={'form_data.PTEMPCLEAN_RecipeType': 'Recipe Type', 'form_data.PTEMPCLEAN_RecipeTemp': 'Recipe Temp', 'form_data.PTEMPCLEAN_OxTime': 'Ox Time',
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 778

```text
                                                            'form_data.PTEMPCLEAN_TargetThick': 'Target Thickness', 'form_data.PTEMPCLEAN_NoSamples': 'Number of Samples',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 779

```text
                                                            'form_data.PTEMPCLEAN_MonSlot': 'Mon Slot', 'form_data.PTEMPCLEAN_MeasTool': 'Measure Tool', 'form_data.PTEMPCLEAN_Thick1': 'Thickness 1',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 780

```text
                                                            'form_data.PTEMPCLEAN_Thick2': 'Thickness 2', 'form_data.PTEMPCLEAN_Thick3': 'Thickness 3', 'form_data.PTEMPCLEAN_Thick4': 'Thickness 4',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 781

```text
                                                            'form_data.PTEMPCLEAN_Thick5': 'Thickness 5'})
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 784

```text
        for index, row in CleanOxDataSmall.iterrows():
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 786

```text
            recipe = shortenStr(row['Recipe Type'], 15)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 787

```text
            CleanOxDataSmall.at[index, 'Recipe Type'] = recipe
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 790

```text
            temp = shortenStr(row['Recipe Temp'], 22)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 791

```text
            CleanOxDataSmall.at[index, 'Recipe Temp'] = temp
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 794

```text
            meas = shortenStr(row['Measure Tool'], 20)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 795

```text
            CleanOxDataSmall.at[index, 'Measure Tool'] = meas
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 797

```text
        CleanOxDataSmall.to_csv(os.path.join(DATA_DIR, 'small_CleanOx_DataCollection.csv'))
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 799

```text
def saveDopedOx():
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 800

```text
    print('Saving DopedOx')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 801

```text
    ensureExists('DopedOx_DataCollection.csv')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 802

```text
    DopedOxData = retrieveData('DopedOx')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 803

```text
    if changedData('DopedOx_DataCollection.csv', DopedOxData):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 804

```text
        DopedOxData.to_csv(os.path.join(DATA_DIR,'DopedOx_DataCollection.csv'))
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 806

```text
        columns_to_keep = ['submission_id','submitter_name', 'form_data.PTEMPDOPED_RecipeType','form_data.PTEMPDOPED_RecipeTemp','form_data.PTEMPDOPED_VarTime','form_data.PTEMPDOPED_TargetThick',
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 807

```text
                           'form_data.PTEMPDOPED_NoSamples','form_data.PTEMPDOPED_MonSlot','form_data.PTEMPDOPED_OxMeasTool','form_data.PTEMPDOPED_Thick1', 'form_data.PTEMPDOPED_Thick2',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 808

```text
                            'form_data.PTEMPDOPED_Thick3','form_data.PTEMPDOPED_Thick4','form_data.PTEMPDOPED_Thick5', 'form_data.PTEMPDOPED_ShtRho1','form_data.PTEMPDOPED_ShtRho2',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 809

```text
                            'form_data.PTEMPDOPED_ShtRho3','form_data.PTEMPDOPED_ShtRho4','form_data.PTEMPDOPED_ShtRho5']
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 810

```text
        DopedOxDataSmall = DopedOxData[columns_to_keep]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 812

```text
        DopedOxDataSmall = DopedOxDataSmall.rename(columns={'form_data.PTEMPDOPED_RecipeType': 'Recipe Type', 'form_data.PTEMPDOPED_RecipeTemp': 'Recipe Temp', 'form_data.PTEMPDOPED_VarTime': 'Var Time',
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 813

```text
                                                            'form_data.PTEMPDOPED_TargetThick': 'Target Thickness', 'form_data.PTEMPDOPED_NoSamples': 'Number of Samples',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 814

```text
                                                            'form_data.PTEMPDOPED_MonSlot': 'Mon Slot', 'form_data.PTEMPDOPED_OxMeasTool': 'Ox Measure Tool', 'form_data.PTEMPDOPED_Thick1': 'Thickness 1',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 815

```text
                                                            'form_data.PTEMPDOPED_Thick2': 'Thickness 2', 'form_data.PTEMPDOPED_Thick3': 'Thickness 3', 'form_data.PTEMPDOPED_Thick4': 'Thickness 4',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 816

```text
                                                            'form_data.PTEMPDOPED_Thick5': 'Thickness 5', 'form_data.PTEMPDOPED_ShtRho1': 'Sheet Resistivity 1', 'form_data.PTEMPDOPED_ShtRho2': 'Sheet Resistivity 2',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 817

```text
                                                            'form_data.PTEMPDOPED_ShtRho3': 'Sheet Resistivity 3', 'form_data.PTEMPDOPED_ShtRho4': 'Sheet Resistivity 4', 'form_data.PTEMPDOPED_ShtRho5': 'Sheet Resistivity 5'})
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 820

```text
        for index, row in DopedOxDataSmall.iterrows():
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 823

```text
            recipe = shortenStr(row['Recipe Type'], 22)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 824

```text
            DopedOxDataSmall.at[index, 'Recipe Type'] = recipe
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 827

```text
            temp = shortenStr(row['Recipe Temp'], 22)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 828

```text
            DopedOxDataSmall.at[index, 'Recipe Temp'] = temp
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 831

```text
            meas = shortenStr(row['Ox Measure Tool'], 22)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 832

```text
            DopedOxDataSmall.at[index, 'Ox Measure Tool'] = meas
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 834

```text
        DopedOxDataSmall.to_csv(os.path.join(DATA_DIR, 'small_DopedOx_DataCollection.csv'))
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 836

```text
def saveLTO():
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 837

```text
    print('Saving LTO')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 838

```text
    ensureExists('LTO_DataCollection.csv')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 839

```text
    LTOData = retrieveData('LTO')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 840

```text
    if changedData('LTO_DataCollection.csv', LTOData):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 841

```text
        LTOData.to_csv(os.path.join(DATA_DIR, 'LTO_DataCollection.csv'))
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 843

```text
        columns_to_keep = ['submission_id','submitter_name','form_data.CTRLTO_Process','form_data.CTRLTO_DepTime','form_data.CTRLTO_TargetThick','form_data.CTRLTO_NoWfrs',
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 844

```text
                           'form_data.CTRLTO_MonSlot','form_data.CTRLTO_MeasTool','form_data.CTRLTO_Thick1', 'form_data.CTRLTO_Thick2','form_data.CTRLTO_Thick3',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 845

```text
                           'form_data.CTRLTO_Thick4','form_data.CTRLTO_Thick5']
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 846

```text
        LTODataSmall = LTOData[columns_to_keep]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 847

```text
        LTODataSmall = LTODataSmall.rename(columns={'form_data.CTRLTO_Process': 'Process', 'form_data.CTRLTO_DepTime': 'Deposition Time', 'form_data.CTRLTO_TargetThick': 'Target Thickness',
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 848

```text
                                                    'form_data.CTRLTO_NoWfrs': 'Number of Wafers', 'form_data.CTRLTO_MonSlot': 'Mon Slot', 'form_data.CTRLTO_MeasTool': 'Measure Tool',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 849

```text
                                                    'form_data.CTRLTO_Thick1': 'Thickness 1', 'form_data.CTRLTO_Thick2': 'Thickness 2', 'form_data.CTRLTO_Thick3': 'Thickness 3',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 850

```text
                                                    'form_data.CTRLTO_Thick4': 'Thickness 4', 'form_data.CTRLTO_Thick5': 'Thickness 5'})
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 852

```text
        for index, row in LTODataSmall.iterrows():
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 854

```text
            process = shortenStr(row['Process'], 15)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 855

```text
            LTODataSmall.at[index, 'Process'] = process
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 858

```text
            meas = shortenStr(row['Measure Tool'], 16)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 859

```text
            LTODataSmall.at[index, 'Measure Tool'] = meas
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 861

```text
        LTODataSmall.to_csv(os.path.join(DATA_DIR, 'small_LTO_DataCollection.csv'))
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 863

```text
def saveNitride():
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 864

```text
    print('Saving Nitride')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 865

```text
    ensureExists('Nitride_DataCollection.csv')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 866

```text
    NitrideData = retrieveData('Nitride')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 867

```text
    if changedData('Nitride_DataCollection.csv', NitrideData):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 868

```text
        NitrideData.to_csv(os.path.join(DATA_DIR, 'Nitride_DataCollection.csv'))
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 871

```text
        columns_to_keep = ['submission_id','submitter_name','form_data.CTRNIT_Recipe','form_data.CTRNIT_NonStdRecipe','form_data.CTRNIT_DepTime',
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 872

```text
                           'form_data.CTRNIT_TargetThick','form_data.CTRNIT_NoWafers','form_data.CTRNIT_MonSlot','form_data.CTRNIT_MeasTool',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 873

```text
                           'form_data.CTRNIT_Thick1','form_data.CTRNIT_Thick2','form_data.CTRNIT_Thick3','form_data.CTRNIT_Thick4','form_data.CTRNIT_Thick5']
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 874

```text
        NitrideDataSmall = NitrideData[columns_to_keep]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 875

```text
        NitrideDataSmall = NitrideDataSmall.rename(columns={'form_data.CTRNIT_Recipe': 'Recipe', 'form_data.CTRNIT_NonStdRecipe': 'Non-Standard Recipe',
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 876

```text
                                                            'form_data.CTRNIT_DepTime': 'Deposition Time','form_data.CTRNIT_TargetThick': 'Target Thickness',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 877

```text
                                                            'form_data.CTRNIT_NoWafers': 'Number of Wafers', 'form_data.CTRNIT_MonSlot': 'Mon Slot',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 878

```text
                                                            'form_data.CTRNIT_MeasTool': 'Measure Tool', 'form_data.CTRNIT_Thick1': 'Thickness 1',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 879

```text
                                                            'form_data.CTRNIT_Thick2': 'Thickness 2', 'form_data.CTRNIT_Thick3': 'Thickness 3',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 880

```text
                                                            'form_data.CTRNIT_Thick4': 'Thickness 4', 'form_data.CTRNIT_Thick5': 'Thickness 5'})
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 883

```text
        for index, row in NitrideDataSmall.iterrows():
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 885

```text
            recipe = shortenStr(row['Recipe'], 14)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 886

```text
            NitrideDataSmall.at[index, 'Recipe'] = recipe
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 891

```text
            meas = shortenStr(row['Measure Tool'], 16)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 892

```text
            NitrideDataSmall.at[index, 'Measure Tool'] = meas
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 895

```text
        NitrideDataSmall.drop(columns=['Non-Standard Recipe'], inplace=True)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 896

```text
        NitrideDataSmall.to_csv(os.path.join(DATA_DIR, 'small_Nitride_DataCollection.csv'))
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 898

```text
def savePoly():
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 899

```text
    print('Saving Poly')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 900

```text
    ensureExists('Poly_DataCollection.csv')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 901

```text
    PolyData = retrieveData('Poly')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 902

```text
    if changedData('Poly_DataCollection.csv', PolyData):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 903

```text
        PolyData.to_csv(os.path.join(DATA_DIR, 'Poly_DataCollection.csv'))
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 905

```text
        columns_to_keep = ['submission_id','submitter_name','form_data.CTRPOLY_Recipe','form_data.CTRPOLY_NonStdRecipe','form_data.CTRPOLY_DepTime',
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 906

```text
                           'form_data.CTRPOLY_TargetThick','form_data.CTRPOLY_NoWafers','form_data.CTRPOLY_MeasTool','form_data.CTRPOLY_MonSlot',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 907

```text
                           'form_data.CTRPOLY_Thick1','form_data.CTRPOLY_Thick2','form_data.CTRPOLY_Thick3','form_data.CTRPOLY_Thick4','form_data.CTRPOLY_Thick5']
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 908

```text
        PolyDataSmall = PolyData[columns_to_keep]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 909

```text
        PolyDataSmall = PolyDataSmall.rename(columns={'form_data.CTRPOLY_Recipe': 'Recipe', 'form_data.CTRPOLY_NonStdRecipe': 'Non-Standard Recipe',
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 910

```text
                                                      'form_data.CTRPOLY_DepTime': 'Deposition Time','form_data.CTRPOLY_TargetThick': 'Target Thickness',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 911

```text
                                                      'form_data.CTRPOLY_NoWafers': 'Number of Wafers', 'form_data.CTRPOLY_MeasTool': 'Measure Tool',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 912

```text
                                                      'form_data.CTRPOLY_MonSlot': 'Mon Slot', 'form_data.CTRPOLY_Thick1': 'Thickness 1',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 913

```text
                                                      'form_data.CTRPOLY_Thick2': 'Thickness 2', 'form_data.CTRPOLY_Thick3': 'Thickness 3',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 914

```text
                                                      'form_data.CTRPOLY_Thick4': 'Thickness 4', 'form_data.CTRPOLY_Thick5': 'Thickness 5'})
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 917

```text
        for index, row in PolyDataSmall.iterrows():
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 919

```text
            recipe = shortenStr(row['Recipe'], 15)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 920

```text
            PolyDataSmall.at[index, 'Recipe'] = combineCells(recipe, row['Non-Standard Recipe'])
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 923

```text
            meas = shortenStr(row['Measure Tool'], 17)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 924

```text
            PolyDataSmall.at[index, 'Measure Tool'] = meas
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 927

```text
        PolyDataSmall.drop(columns=['Non-Standard Recipe'], inplace=True)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 928

```text
        PolyDataSmall.to_csv(os.path.join(DATA_DIR, 'small_Poly_DataCollection.csv'))
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 930

```text
def saveAllwin():
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 931

```text
    print('Saving Allwin')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 932

```text
    ensureExists('Allwin_DataCollection.csv')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 933

```text
    AllwinData = retrieveData('Allwin')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 934

```text
    if changedData('Allwin_DataCollection.csv', AllwinData):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 935

```text
        AllwinData.to_csv(os.path.join(DATA_DIR, 'Allwin_DataCollection.csv'))
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 937

```text
        columns_to_keep = ['submission_id','submitter_name','form_data.RTP_Recipe']
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 938

```text
        AllwinDataSmall = AllwinData[columns_to_keep]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 939

```text
        AllwinDataSmall = AllwinDataSmall.rename(columns={'form_data.RTP_Recipe': 'Recipe'})
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 942

```text
        AllwinDataSmall.to_csv(os.path.join(DATA_DIR, 'small_Allwin_DataCollection.csv'))
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 949

```text
def save():
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 966

```text
    machines = [
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 967

```text
        ("ALD", saveALD),               # ALD Fiji F200
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 968

```text
        ("Ebeam", saveEbeam),           # E-Beam Denton SJ20C
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 969

```text
        ("MOCVD", saveMOCVD),           # MOCVD Agnitron Imperium
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 970

```text
        ("Parylene", saveParylene),     # Parylene - SCS PDS 2010
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 971

```text
        ("Denton635", saveDenton635),   # Sputter - Denton 635
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 972

```text
        ("Denton18", saveDenton18),     # Sputter - Denton Discovery 18
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 973

```text
        ("TMV", saveTMV),               # Sputter - TMV Super
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 974

```text
        ("DRIE", saveDRIE),             # DRIE - Oxford 100 ICP
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 975

```text
        ("Isotropic", saveIsotropic),   # Isotropic - XACTIX X2 XeF2
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 976

```text
        ("Plasmalab", savePlasmalab),   # RIE - Oxford Plasmalab 80
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 977

```text
        ("PlasmaTherm", savePlasmaTherm),  # RIE - Plasmatherm Metal Etch
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 978

```text
        ("Technics", saveTechnics),     # RIE - Technics PE II-A
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 979

```text
        ("CleanOx", saveCleanOx),       # Atmospheric - ProTemp Clean Ox
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 980

```text
        ("DopedOx", saveDopedOx),       # Atmospheric - ProTemp Doped Ox
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 981

```text
        ("LTO", saveLTO),               # LPCVD - Expertech CTR125 LTO
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 982

```text
        ("Nitride", saveNitride),       # LPCVD - Expertech CTR125 Nitride
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 983

```text
        ("Poly", savePoly),             # LPCVD - Expertech CTR125 Poly
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 984

```text
        ("Allwin", saveAllwin),         # RTP - Allwin AccuThermo AW 610
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 985

```text
    ]
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 987

```text
    failures = []
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 988

```text
    for name, fn in machines:
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 989

```text
        try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 990

```text
            fn()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 991

```text
        except Exception as e:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 992

```text
            failures.append(name)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 993

```text
            logging.error(f"save({name}) failed: {e}")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 995

```text
    if failures:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 996

```text
        logging.warning(
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 997

```text
            f"save complete with {len(failures)} machine failure(s): {', '.join(failures)}"
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 998

```text
        )
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 999

```text
    else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1000

```text
        logging.info("save complete: all machines OK")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1002

```text
def graceful_exit(signum, frame):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 1003

```text
    logging.info("Exiting")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1004

```text
    sys.exit(0)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1006

```text
signal.signal(signal.SIGINT, graceful_exit)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1007

```text
signal.signal(signal.SIGTERM, graceful_exit)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1010

```text
schedule.every().day.at("05:00").do(save)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1013

```text
def runForever():
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 1015

```text
    save()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1016

```text
    while True:
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 1017

```text
        try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 1018

```text
            schedule.run_pending()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1019

```text
            time.sleep(10)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1020

```text
        except Exception as e:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 1021

```text
            logging.error(f"Error in scheduled loop {e}")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1023

```text
if __name__ == '__main__':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1024

```text
    runForever()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.



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
