library(ggplot2)
library(lubridate)
library(randomForest)
library(magrittr)
library(dplyr)
library(readr)
library(Metrics)
library(jsonlite)


set.seed(1)
setwd('/Users/mambulge/Documents/Demand Analysis')
stations <- read.csv("Data/stationList.csv")

extractFeatures <- function(data) {
  features <- c("workingDay","month","hour","day","peakHour");
  #data$hour <- hour(ymd_h(data$time))
  #print(data)
  return(data[,features])
}

for(i_station in unique(stations$station_id)){
  train <- fromJSON(paste0("Data/",i_station,"_BikeStation_Trip_Train.json"), flatten=TRUE)
  test <- fromJSON(paste0("Data/",i_station,"_BikeStation_Trip_Test.json"), flatten=TRUE)
  
  tp <- extractFeatures(train)
  rf <- randomForest(extractFeatures(train), train$Count, ntree=501, importance=TRUE)
  imp <- importance(rf, type=1)
  featureImportance <- data.frame(Feature=row.names(imp), Importance=imp[,1])
  feature <- toJSON(featureImportance)
  write(feature, paste('Prediction/RandomForestTrips/',i_station,"_Prediction_Trip_RF_FeatureImportance.json",sep=""))
  p <- ggplot(featureImportance, aes(x=reorder(Feature, Importance), y=Importance)) +
    geom_bar(stat="identity", fill="#53cfff") +
    coord_flip() + 
    theme_light(base_size=20) +
    xlab("Importance") +
    ylab("") + 
    ggtitle("Random Forest Feature Importance\n") +
    theme(plot.title=element_text(size=18))
  
  ggsave(paste0("Prediction/RandomForestTrips/",i_station,"_Trips_feature_importance.png"), p,  width = 40, height = 40, units = "cm")
  
  submission <- data.frame(time=test$time,station_id=test$station_id,name=test$name,actual_count=test$Count, predic_count=NA)
  
  for (i_month in unique(month(ymd_hms(test$time)))) {
    cat("\nMonth: ", i_month, "\t station",i_station)
    testLocs   <-  month(ymd_hms(test$time))==i_month
    testSubset <- test[testLocs,]
    if(nrow(testSubset) != 0){
      rf <- randomForest(extractFeatures(train),  train$Count, ntree=501, importance=TRUE)
      submission[testLocs,"predic_count"] <- predict(rf, extractFeatures(testSubset))
    }

  }
  submission$predic_count_round = round(submission$predic_count)
  
  names(submission) <- c("time","station_id","name","Actual_Count","Predicted_Count")
  submission$COR <- round(cor(submission$Actual_Count, submission$Predicted_Count),2)
  submission$time <- ymd_hms(submission$time, tz="America/Los_Angeles")
  submission$RMSLE <- rmsle( submission$Actual_Count,submission$Predicted_Count)
  submission$RMSE <- rmse( submission$Actual_Count,submission$Predicted_Count)
  submission$mae <- mae(submission$Actual_Count,submission$Predicted_Count)
  json <- toJSON(submission)
  write(json, paste('Prediction/RandomForestTrips/',i_station,"_Prediction_Trip_RF.json",sep=""))
  
  
  #ggplot(submission, aes(x=Actual_Count, y=Predicted_Count)) +
  # geom_point() + 
  # theme_light(base_size=16) +
  # xlab("Actual Hourly Bike Trips") +
  #ylab("Predicted Hourly Bike Trips") +
  #ggtitle(paste0("Correlation: ", round(cor(submission$Actual_Count, submission$Predicted_Count), 3)))
}








