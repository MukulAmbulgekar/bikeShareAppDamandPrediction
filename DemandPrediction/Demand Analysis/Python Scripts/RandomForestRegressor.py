if __name__ == '__main__':
	import numpy as np
	import matplotlib.pyplot as plt
	import pandas as pd
	import math
	import json
	from sklearn import ensemble
	from sklearn.cross_validation import train_test_split
	from sklearn.metrics import mean_absolute_error
	from sklearn.grid_search import GridSearchCV
	from datetime import datetime

	def rmsele(actual, pred):
		squared_errors = (np.log(pred + 1) - np.log(actual + 1)) ** 2
		mean_squared = np.sum(squared_errors) / len(squared_errors)
		return np.sqrt(mean_squared)
	stations = pd.read_csv('../Data/stationList.csv')
	uniqueStations = stations["station_id"];
	#print '\nRunning AdaBoost Regressor...\n'
	#print(uniqueStations)
	for i_station in uniqueStations:
		print(i_station)
		trainPath ='../Data/' + str(i_station) + '_BikeStation_Trip_Train.json'
		train = pd.read_json(trainPath)
		testPath ='../Data/' + str(i_station) + '_BikeStation_Trip_Test.json'
		test = pd.read_json(testPath)
		for col in ["Count"]:
			train['log-'+ col] = train[col].apply(lambda x:np.log1p(x))

		features = ["workingDay","month","hour","day","peakHour","temp","Cloud","rain"]

		clf= ensemble.RandomForestRegressor(n_estimators=100)
		clf.fit(train[features],train['log-Count'])
		
		featureImportance = pd.DataFrame(clf.fit(train[features],train['log-Count']).feature_importances_)
		#print featureImportance
		result= clf.predict(test[features])
		result = np.expm1(result);
		df = pd.DataFrame({'station_id':test['station_id'],'name':test['name'],'time':test['time'],'Actual_Count':test['Count'],'Predicted_Count':result,'RMSLE':rmsele(test['Count'],result),'COR':round(np.corrcoef(test['Count'],result)[0, 1],2) })
		df.reset_index().to_json('../Prediction/RandomForestTripsScikit/'+str(i_station)+'_Prediction_RF_SCI.json',orient='records')
		featureImportance.to_json('../Prediction/RandomForestTripsScikit/'+str(i_station)+'_Feature_RF_SCI.json',orient='records')
        #df.to_csv('Prediction/AdaBoosting/'+str(i_station)+'_Prediction_AB.csv', index = False, columns=['station_id','name','time','Actual_Count','Predicted_Count','RMSLE','COR']) 

