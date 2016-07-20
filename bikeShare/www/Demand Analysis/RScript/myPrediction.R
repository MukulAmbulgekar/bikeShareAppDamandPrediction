library(ggplot2)
library(lubridate)
library(randomForest)
library(magrittr)
library(dplyr)
library(readr)
library(jsonlite)

set.seed(1)
setwd('/Users/mambulge/Downloads/babs_open_data_year_2')
args = commandArgs(trailingOnly=TRUE)
statusData <- fromJSON("Data/69_BikeStation_Status.json", flatten=TRUE)
class(statusData$time)
statusData$time <- as.POSIXct(statusData$time)
stations <- read.csv("201508_station_data.csv")
extractFeatures <- function(data) {
  features <- c("workingDay","month","hour","day","peakHour");
  return(data[,features])
}

statusDataNew <- statusData %>%
  group_by(station_id,format(time, "%Y-%m-%d %H")) %>%
  summarise(count = round(sum(bikes_available/60)))

names(statusDataNew) <- c("station_id","time","Count")
class(statusDataNew$time)
statusDataNew <- merge(statusDataNew, stations, by = c("station_id"), all.x = TRUE);
statusDataNew$hour <- hour(ymd_h(statusDataNew$time))
statusDataNew$month <-  month(ymd_h(statusDataNew$time))
statusDataNew$year <-  year(ymd_h(statusDataNew$time))
statusDataNew$day <-  wday(ymd_h(statusDataNew$time))
statusDataNew$peakHour <- 1
statusDataNew$peakHour[hour(ymd_h(statusDataNew$time)) >= 7 &  hour(ymd_h(statusDataNew$time)) <10 ] <- 0
statusDataNew$peakHour[hour(ymd_h(statusDataNew$time)) >= 17 &  hour(ymd_h(statusDataNew$time)) <20 ] <- 0
statusDataNew$workingDay[strftime(ymd_h(statusDataNew$time, tz="America/Los_Angeles"), format="%A")=='Monday'] <- 1
statusDataNew$workingDay[strftime(ymd_h(statusDataNew$time, tz="America/Los_Angeles"), format="%A")=='Tuesday'] <- 1
statusDataNew$workingDay[strftime(ymd_h(statusDataNew$time, tz="America/Los_Angeles"), format="%A")=='Wednesday'] <- 1
statusDataNew$workingDay[strftime(ymd_h(statusDataNew$time, tz="America/Los_Angeles"), format="%A")=='Thursday'] <- 1
statusDataNew$workingDay[strftime(ymd_h(statusDataNew$time, tz="America/Los_Angeles"), format="%A")=='Friday'] <- 1
statusDataNew$workingDay[strftime(ymd_h(statusDataNew$time, tz="America/Los_Angeles"), format="%A")=='Saturday'] <- 0
statusDataNew$workingDay[strftime(ymd_h(statusDataNew$time, tz="America/Los_Angeles"), format="%A")=='Sunday'] <- 0
statusDataNew$lat = NULL
statusDataNew$long = NULL
statusDataNew$dockcount = NULL
statusDataNew$landmark = NULL
statusDataNew$installation = NULL
print(statusDataNew)


tp <- extractFeatures(statusDataNew)
rf <- randomForest(extractFeatures(statusDataNew), statusDataNew$Count, ntree=501, importance=TRUE)
imp <- importance(rf, type=1)
featureImportance <- data.frame(Feature=row.names(imp), Importance=imp[,1])

p <- ggplot(featureImportance, aes(x=reorder(Feature, Importance), y=Importance)) +
  geom_bar(stat="identity", fill="#53cfff") +
  coord_flip() + 
  theme_light(base_size=20) +
  xlab("Importance") +
  ylab("") + 
  ggtitle("Random Forest Feature Importance\n") +
  theme(plot.title=element_text(size=18))

ggsave("Bike_feature_importance.png", p,  width = 40, height = 40, units = "cm")

submission <- data.frame(time=statusDataNew$time,station_id=statusDataNew$station_id,name=statusDataNew$name,actual_count=statusDataNew$Count, predic_count=NA)

for (i_month in unique(month(ymd_h(statusDataNew$time)))) {
  cat("\nMonth: ", i_month, "\n")
  testLocs   <-  month(ymd_h(statusDataNew$time))==i_month
  testSubset <- statusDataNew[testLocs,]
  testSubset$Count  = NULL
  rf <- randomForest(extractFeatures(statusDataNew), statusDataNew$Count, ntree=500)
  submission[testLocs, "predic_count"] <- predict(rf, extractFeatures(testSubset))
}




submission$predic_count_round = round(submission$predic_count)

print(ymd_h(submission$time, tz="America/Los_Angeles"))

length(submission)

names(submission) <- c("time","station_id","name","Actual_Count","Predicted_Count")
submission$correlation <- round(cor(submission$Actual_Count, submission$Predicted_Count),2)
submission$time <- ymd_h(submission$time, tz="America/Los_Angeles")
json <- toJSON(submission)
write(json, paste('Data/',"69_Prediction.json",sep=""))


ggplot(submission, aes(x=Actual_Count, y=Predicted_Count)) +
  geom_point(size=0.5, colour = "blue") + 
  theme_light(base_size=16) +
  xlab("Actual Hourly Bike Trips") +
  ylab("Predicted Hourly Bike Trips") +
  ggtitle(paste0(unique(submission$name)," - Correlation: ", round(cor(submission$Actual_Count, submission$Predicted_Count), 2)))
ggsave("5.png",  width = 40, height = 40, units = "cm")

cor(submission$Actual_Count, submission$Predicted_Count)
rmsle( submission$Actual_Count,submission$Predicted_Count)
sqrt(mean( submission$Actual_Count^2))
sqrt(mean( submission$Predicted_Count^2))
error <- submission$Actual_Count - submission$Predicted_Count
rmsle(sqrt(mean( submission$Actual_Count^2)),sqrt(mean( submission$Predicted_Count^2)))

rmse(error)


ctl <- c(4.17,5.58,5.18,6.11,4.50,4.61,5.17,4.53,5.33,5.14)
trt <- c(4.81,4.17,4.41,3.59,5.87,3.83,6.03,4.89,4.32,4.69)
group <- gl(2, 10, 20, labels = c("Ctl","Trt"))
weight <- c(ctl, trt)
lm.D9 <- lm(weight ~ group)
rmse(lm.D9$residuals)