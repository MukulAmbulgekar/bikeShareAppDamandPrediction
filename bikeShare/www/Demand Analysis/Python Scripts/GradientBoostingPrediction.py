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
    
    for i_station in uniqueStations:
        print(i_station)
        trainPath = '../Data/'+str(i_station)+'_BikeStation_Trip_Train.json'
        train = pd.read_json(trainPath)
        testPath = '../Data/'+str(i_station)+'_BikeStation_Trip_Test.json'
        test = pd.read_json(testPath)
        for col in ['Count']:
            train['log-' + col] = train[col].apply(lambda x: np.log1p(x))

        features = ["workingDay","month","hour","day","peakHour"]

        clf = ensemble.GradientBoostingRegressor(n_estimators=200, max_depth=3)         
        clf.fit(train[features],train['log-Count'])
        result = clf.predict(test[features])
        result = np.expm1(result)
        df=pd.DataFrame({'station_id':test['station_id'],'name':test['name'],'time':test['time'],'Actual_Count':test['Count'],'Predicted_Count':result,'RMSLE':rmsele(test['Count'],result),'COR':round(np.corrcoef(test['Count'],result)[0, 1],2) })
        #print(df)
        df.reset_index().to_json('../Prediction/GradientBoosting/'+str(i_station)+'_Prediction_GB.json',orient='records')
        #df.to_csv('Prediction/GradientBoosting/'+str(i_station)+'_Prediction_GB.csv', index = False, columns=['station_id','name','time','Actual_Count','Predicted_Count','RMSLE','COR'])
        #Load Data with pandas, and parse the first column into datetime
    