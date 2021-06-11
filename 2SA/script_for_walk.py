# -*- coding: utf-8 -*-
"""
Created on Sat May  8 20:15:25 2021

@author: niels
"""
import names
import random
import math

number_of_walkers = 20;
distance = 20
random_starttijd_variantie = 6 #number_of_walkers / 2 

import csv
with open('walkers_random.csv', 'w', newline='') as file:
    writer = csv.writer(file)
    writer.writerow(["Configuration","Point name","Timestamp","X-coordinate","Y-coordinate"])
    for i in range(0, number_of_walkers):
        positie = 0
        start_time = random.uniform(random_starttijd_variantie/2+1, random_starttijd_variantie+1)
        stopfrequentie = random.uniform(0, 0.03)
        stay_stopped = 0.4
        if(i == 0):
            name = "Elke Remy"
        elif(i == 1):
            name = "To Cornelis"
        elif(i==2):
            name ="Niels Vanden Bussche"
        else:
            name = names.get_full_name()
            stopfrequentie = random.uniform(0.05, 0.09)
            start_time = random.uniform(0, random_starttijd_variantie)
            stay_stopped = 0.6
        timestamp = 0
        
        stop = 0
        
        while(timestamp < start_time):
            writer.writerow([name, name, timestamp, positie, i])
            timestamp += random.uniform(0, 1)
        
        while(positie < math.ceil(distance)):
            
            writer.writerow([name, name, timestamp, positie, i])
            if (random.random() > stopfrequentie) and (random.random()>stay_stopped*stop):
                positie += 0.3
                stop = 0;
            else:
                stop = 1;
            timestamp += random.random()*0.2+0.1
        
        while(timestamp < distance*6/5 + random_starttijd_variantie*6/5):
            writer.writerow([name, name, timestamp, positie, i])
            timestamp = math.ceil(timestamp + random.uniform(0, 1))
        
        
        