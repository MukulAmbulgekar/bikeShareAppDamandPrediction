library(ggplot2)
library(lubridate)
library(randomForest)
library(magrittr)
library(dplyr)
library(readr)
library(jsonlite)

set.seed(1)
setwd('/Users/mambulge/Downloads/babs_open_data_year_2')
tripData <- read.csv("201508_trip_data.csv");
for (i_station in unique(tripData$start_terminal)) {
  cat("\n",i_station,"\n")
  TripDataNew <- filter(tripData, start_terminal == i_station )
  TripDataNew$start_date <- as.POSIXct(TripDataNew$start_date)
  class(TripDataNew$start_date)
  TripDataNewGrouped <- TripDataNew %>%
    group_by(start_terminal,start_station,format(TripDataNew$start_date, "%Y-%m-%d %H")) %>%
    summarise(count = n())
  
  names(TripDataNewGrouped) <- c("station_id","name","time","Count")
  class(TripDataNewGrouped$time)
  #statusDataNew <- merge(statusDataNew, stations, by = c("station_id"), all.x = TRUE);
  #TripDataNewGrouped$type1 [TripDataNewGrouped$type=='Customer'] <- 0
  #TripDataNewGrouped$type1 [TripDataNewGrouped$type=='Subscriber'] <-  1
  TripDataNewGrouped$peakHour <- 1
  TripDataNewGrouped$peakHour[hour(ymd_h(TripDataNewGrouped$time)) >= 7 &  hour(ymd_h(TripDataNewGrouped$time)) <10 ] <- 0
  TripDataNewGrouped$peakHour[hour(ymd_h(TripDataNewGrouped$time)) >= 17 &  hour(ymd_h(TripDataNewGrouped$time)) <20 ] <- 0
  TripDataNewGrouped$hour <- hour(ymd_h(TripDataNewGrouped$time))
  TripDataNewGrouped$month <-  month(ymd_h(TripDataNewGrouped$time))
  TripDataNewGrouped$year <-  year(ymd_h(TripDataNewGrouped$time))
  TripDataNewGrouped$day <-  wday(ymd_h(TripDataNewGrouped$time))
  TripDataNewGrouped$workingDay[strftime(ymd_h(TripDataNewGrouped$time, tz="America/Los_Angeles"), format="%A")=='Monday'] <- 1
  TripDataNewGrouped$workingDay[strftime(ymd_h(TripDataNewGrouped$time, tz="America/Los_Angeles"), format="%A")=='Tuesday'] <- 1
  TripDataNewGrouped$workingDay[strftime(ymd_h(TripDataNewGrouped$time, tz="America/Los_Angeles"), format="%A")=='Wednesday'] <- 1
  TripDataNewGrouped$workingDay[strftime(ymd_h(TripDataNewGrouped$time, tz="America/Los_Angeles"), format="%A")=='Thursday'] <- 1
  TripDataNewGrouped$workingDay[strftime(ymd_h(TripDataNewGrouped$time, tz="America/Los_Angeles"), format="%A")=='Friday'] <- 1
  TripDataNewGrouped$workingDay[strftime(ymd_h(TripDataNewGrouped$time, tz="America/Los_Angeles"), format="%A")=='Saturday'] <- 0
  TripDataNewGrouped$workingDay[strftime(ymd_h(TripDataNewGrouped$time, tz="America/Los_Angeles"), format="%A")=='Sunday'] <- 0
  TripDataNewGroupedTrain <-subset(TripDataNewGrouped,day(ymd_h(TripDataNewGrouped$time))  <= 20 )
  TripDataNewGroupedTest <-subset(TripDataNewGrouped,day(ymd_h(TripDataNewGrouped$time))  > 20 )
  TripDataNewGroupedTrain$time <- ymd_h(TripDataNewGroupedTrain$time, tz="America/Los_Angeles")
  TripDataNewGroupedTest$time <- ymd_h(TripDataNewGroupedTest$time, tz="America/Los_Angeles")
  TripDataNewGroupedTrain <- tbl_df(TripDataNewGroupedTrain)
  as_data_frame(TripDataNewGroupedTrain)
  TripDataNewGroupedTest <- tbl_df(TripDataNewGroupedTest)
  as_data_frame(TripDataNewGroupedTest)
  jsonTrain <- toJSON(TripDataNewGroupedTrain)
  jsonTest <- toJSON(TripDataNewGroupedTest)
  
  write(jsonTrain, paste('Data/',i_station,"_BikeStation_Trip_Train.json",sep=""))
  write(jsonTest, paste('Data/',i_station,"_BikeStation_Trip_Test.json",sep=""))
}


