#!usr/bin/python

import sys
import re
import os
import httplib, urllib
from firebase import firebase

if len(sys.argv) != 2:
	print "Use uploadClasses <classes file>"
	sys.exit()

classesFile = sys.argv[1]
f = open(classesFile, 'r')

# establixh firebase connection
print "Autheticating...\n"
fb = firebase.FirebaseApplication('https://torid-fire-3655.firebaseio.com/', authentication=None)
authentication = firebase.FirebaseAuthentication(os.environ['GENSECRET'], 'iyob.gm@gmail.com', extra={})
fb.authentication = authentication
user = authentication.get_user()


# get first line
line = f.readline()
classTable = {}
print "Parsing classes...\n"
while line != "":
	classCodes = re.findall( r'[A-Z]{4} \d\d\d[ab]', line)
	index      = line.index(", ") + 2
	className  = line[index:-1]
	classProf  = f.readline()
	for classCode in classCodes:
		classSem = classCodes[-1]
		if classSem == "a":
			classSem = "Fall"
		else:
			classSem = "Spring"

		className = className.rstrip()
		classProf = classProf.rstrip()
		# a mean bug, need to eliminate dots from class names
		className = className.replace(".", "_")

		if not className in classTable:
			classTable[className] = {'codes':{}, 'semesters':{}, 'prof':classProf}
		classTable[className]['semesters'][classSem] = True
		classTable[className]['codes'][classCode] = True

	f.readline()
	line = f.readline()

print classTable
for className in classTable.keys():
	print "Processing", className, "..."
	for classCode in classTable[className]['codes'].keys():
		spring = 'Spring' in classTable[className]['semesters'].keys()
		fall = 'Fall' in classTable[className]['semesters'].keys()
		classProf = classTable[className]['prof']
		params = {'name': className, 'code': classCode, 'prof': classProf, 'fall': fall, 'spring': spring}
		fb.put('/classcodes/', classCode, params)
	params = {'name': className}
	try:
		params = {'name': className, 'code': classCode}
		fb.put('/classnames', className, params)
	except Exception as inst:
		print inst
