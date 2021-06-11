import glob
import json
import csv
import numpy as np
import pandas as pd
import os
def importfile():
	teller=0
	for file in glob.glob('./json/*'):
		teller+=1

		with open(file) as json_file:
			base=os.path.basename(file)
			with open(base+'.csv', mode='w') as csv_file:
				fieldnames = ['name', 'Timestamp', 'X-coordinate','Y-coordinate']
				writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
				writer.writeheader()	
				data = json.load(json_file)
				time=0
				if(data["Metadata"]["fps_scale"]==1):
					for name,p in enumerate(data["projected_data"]):
							time=0
							counter=0
							
							while counter< len(p):
								
								time+=1/30
								
								writer.writerow({'name': name+1, 'Timestamp': time, 'X-coordinate':p[counter][0], 'Y-coordinate':p[counter][1]})
								counter+=1	
				
				
				elif(data["Metadata"]["fps_scale"]==2):
					for name,p in enumerate(data["projected_data"]):
							time=0
							counter=0
							writer.writerow({'name': name+1, 'Timestamp': 0, 'X-coordinate':p[counter][0], 'Y-coordinate':p[counter][1]})
							while counter< len(p)-1:
								sx = pd.Series([p[counter][0], np.nan, p[counter+1][0]], index=[1, 2, 3])
								sx=sx.interpolate(method='index')
								sy = pd.Series([p[counter][1], np.nan, p[counter+1][1]], index=[1, 2, 3])
								sy=sy.interpolate(method='index')
								time+=1/30
								
								
								writer.writerow({'name': name+1, 'Timestamp': time, 'X-coordinate':sx[2], 'Y-coordinate':sy[2]})
								time+=1/30
								writer.writerow({'name': name+1, 'Timestamp': time, 'X-coordinate':p[counter+1][0], 'Y-coordinate':p[counter+1][1]})
								counter+=1		
				elif(data["Metadata"]["fps_scale"]==3):
					for name,p in enumerate(data["projected_data"]):
							time=0
							counter=0
							writer.writerow({'name': name+1, 'Timestamp': 0, 'X-coordinate':p[counter][0], 'Y-coordinate':p[counter][1]})
							while counter< len(p)-1:
								sx = pd.Series([p[counter][0], np.nan,np.nan, p[counter+1][0]], index=[1, 2, 3,4])
								sx=sx.interpolate(method='index')
								sy = pd.Series([p[counter][1], np.nan,np.nan, p[counter+1][1]], index=[1, 2, 3,4])
								sy=sy.interpolate(method='index')
								time+=1/30
								
								
								writer.writerow({'name': name+1, 'Timestamp': time, 'X-coordinate':sx[2], 'Y-coordinate':sy[2]})
								time+=1/30
								writer.writerow({'name': name+1, 'Timestamp': time, 'X-coordinate':sx[3], 'Y-coordinate':sy[3]})
								time+=1/30
								writer.writerow({'name': name+1, 'Timestamp': time, 'X-coordinate':p[counter+1][0], 'Y-coordinate':p[counter+1][1]})
								counter+=1	
									
							"""
					s = pd.Series([, np.nan, 17], index=[1, 2, 3])
					s.interpolate(method='index')
					print(s)
					"""
					

				"""
		    writer = csv.DictWriter(csv_file, fieldnames=fieldnames)

		    writer.writeheader()
		    writer.writerow({'emp_name': 'John Smith', 'dept': 'Accounting', 'birth_month': 'November'})
		    writer.writerow({'emp_name': 'Erica Meyers', 'dept': 'IT', 'birth_month': 'March'})
		    """
importfile()
