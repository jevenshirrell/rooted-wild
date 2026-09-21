# Nature App

## Concept

* Has three main tabs  
  * Observations  
    * These are the pictures you've taken  
    * To get an observation, just take a picture or choose a picture  
      * Select location  
      * (Future) Then either AI or a database or you search it up and find the species   
  * Species tab  
    * All the species you've seen  
    * You can order this by A-Z, date, and number of observations for a species. Also a toggle feature for showing subspeices  
    * Species cover uses good photos, while observations use yours  
    * Number on the species cover on how many you've seen  
  * (Future) Badges  
    * Show up on your profile   
    * There can be badges for a lot of things  
      * Find X amount of species under a type or thing  
        *  Plants, mammals, reptiles  
      * Geolocated badges   
      * Seasonal badges  
      * Badges for observing every animal in a family or clade  
    * Badges have tiers

## API Structure

* Resource: Observation  
  * Species Name  
  * Location  
  * Date/Time  
  * Photo(s)  
  * Times seen  
  * User  
  * Visibility  
* Ownership  
  * Each user owns their own observations and can publish them for others to see  
* Roles  
  * User  
    * Upload their own observations  
    * View other public observations  
    * See how many of each species you’ve observed (specific route)  
  * Approver  
    * Can approve public uploads  
  * Admin  
    * View and delete every observation