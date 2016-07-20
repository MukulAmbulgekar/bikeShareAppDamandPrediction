library(ggplot2)
library(lubridate)
library(randomForest)
library(magrittr)
library(dplyr)
library(readr)
library(jsonlite)

set.seed(1)
setwd('/Users/mambulge/Downloads/babs_open_data_year_2')
statusData <- read.csv("201508_status_data.csv");
stations <- read.csv("201508_station_data.csv")
for (i_station in unique(stations$station_id)) {
  cat("\n",i_station,"\n")
  statusDataNew <- filter(statusData, station_id ==i_station)
  class(statusData$time)
  statusDataNew$time <- as.POSIXct(statusDataNew$time)
  statusDataGrouped <- statusDataNew %>%
    group_by(station_id,format(time, "%Y-%m-%d %H")) %>%
    summarise(count = round(sum(bikes_available/60)))
  
  names(statusDataGrouped) <- c("station_id","time","Count")
  class(statusDataNew$time)
  statusDataGrouped <- merge(statusDataGrouped, stations, by = c("station_id"), all.x = TRUE);
  statusDataGrouped$hour <- hour(ymd_h(statusDataGrouped$time))
  statusDataGrouped$month <-  month(ymd_h(statusDataGrouped$time))
  statusDataGrouped$year <-  year(ymd_h(statusDataGrouped$time))
  statusDataGrouped$day <-  wday(ymd_h(statusDataGrouped$time))
  statusDataGrouped$peakHour <- 1
  statusDataGrouped$peakHour[hour(ymd_h(statusDataGrouped$time)) >= 7 &  hour(ymd_h(statusDataGrouped$time)) <10 ] <- 0
  statusDataGrouped$peakHour[hour(ymd_h(statusDataGrouped$time)) >= 17 &  hour(ymd_h(statusDataGrouped$time)) <20 ] <- 0
  statusDataGrouped$workingDay[strftime(ymd_h(statusDataGrouped$time, tz="America/Los_Angeles"), format="%A")=='Monday'] <- 1
  statusDataGrouped$workingDay[strftime(ymd_h(statusDataGrouped$time, tz="America/Los_Angeles"), format="%A")=='Tuesday'] <- 1
  statusDataGrouped$workingDay[strftime(ymd_h(statusDataGrouped$time, tz="America/Los_Angeles"), format="%A")=='Wednesday'] <- 1
  statusDataGrouped$workingDay[strftime(ymd_h(statusDataGrouped$time, tz="America/Los_Angeles"), format="%A")=='Thursday'] <- 1
  statusDataGrouped$workingDay[strftime(ymd_h(statusDataGrouped$time, tz="America/Los_Angeles"), format="%A")=='Friday'] <- 1
  statusDataGrouped$workingDay[strftime(ymd_h(statusDataGrouped$time, tz="America/Los_Angeles"), format="%A")=='Saturday'] <- 0
  statusDataGrouped$workingDay[strftime(ymd_h(statusDataGrouped$time, tz="America/Los_Angeles"), format="%A")=='Sunday'] <- 0
  statusDataGrouped$lat = NULL
  statusDataGrouped$long = NULL
  statusDataGrouped$dockcount = NULL
  statusDataGrouped$landmark = NULL
  statusDataGrouped$installation = NULL
  
  
  statusDataNewTrain <-subset(statusDataGrouped,day(ymd_h(statusDataGrouped$time))  <= 20 )
  statusDataNewTest <-subset(statusDataGrouped,day(ymd_h(statusDataGrouped$time))  > 20 )
  statusDataNewTrain$time <- ymd_h(statusDataNewTrain$time, tz="America/Los_Angeles")
  statusDataNewTest$time <- ymd_h(statusDataNewTest$time, tz="America/Los_Angeles")
  statusDataNewTrain <- tbl_df(statusDataNewTrain)
  as_data_frame(statusDataNewTrain)
  statusDataNewTest <- tbl_df(statusDataNewTest)
  as_data_frame(statusDataNewTest)
  jsonTrain <- toJSON(statusDataNewTrain)
  jsonTest <- toJSON(statusDataNewTest)
  
  write(jsonTrain, paste('Data/',i_station,"_BikeStation_Status_Train.json",sep=""))
  write(jsonTest, paste('Data/',i_station,"_BikeStation_Status_Test.json",sep=""))
  
}


