library(magrittr)
library(dplyr)
library(lubridate)
library(readr)
library(jsonlite)
library(NbClust)
setwd('/Users/mambulge/Downloads/babs_open_data_year_2')
# read trip data
trip <- read_csv("201508_trip_data.csv")
dfTrip <- tbl_df(trip)
as_data_frame(dfTrip)

#read station data
station <- read_csv("201508_station_data.csv")
dfStation <- tbl_df(station)
as_data_frame(dfStation)

#add day of the week
dfTripFiltered <- dfTrip
dfTripFiltered$day_of_week <- strftime(mdy_hm(dfTripFiltered$start_date, tz="America/Los_Angeles"), format="%A")

dfTripFiltered$hour <- hour(as.POSIXct(strftime(mdy_hm(dfTripFiltered$start_date, tz="America/Los_Angeles"), format="%H:%M"), format="%H:%M"))

#trip ending from station
dfTripsCnt <- dfTripFiltered %>%
  group_by(hour) %>%
  summarise(trips = n())

#add city column
#dfTripsCntWithCity <- merge(dfTripsCnt, dfStation, by.x="start_terminal", by.y="station_id")
#dfTripsCntWithCity <- dfTripsCntWithCity[c(1,2,3)]

#select only numeric columns
#dfTripsCntAltered <- dfTripsCntWithCity[c(1,3)]

#determine best number of clusters
#nc <- NbClust(dfTripsCntAltered, min.nc=2, max.nc=15, method="kmeans")

#verify suggested cluster number
#table(nc$Best.n[1,])

#k-means clustering and provice cluster to form from previous suggestion
set.seed(1234)
fit.km <- kmeans(dfTripsCnt, 3, nstart=25) 
fit.km$size
fit.km$centers
fit.km$cluster

#add cluster column to stations
cluster <- fit.km$cluster
dfCluster <- data.frame(fit.km$cluster)
names(dfCluster)
names(dfCluster) <- c("cluster")
dfTripsCnt <- merge(dfTripsCnt, dfCluster, by=0, all=TRUE)
dfTripsCnt <- dfTripsCnt[c(2,3,4)]
#generate json
plot(dfTripsCnt,fit.km$cluster)
json <- toJSON(dfTripsCnt)
write(json, "hourlyTrips.json")

