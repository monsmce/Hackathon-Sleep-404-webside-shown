# Prototype:
A system that shows available rooms across via, like parking lots,based on the motion sensors
# Plan:
There's about 12 study rooms per hub, 3 hubs abc, and 5 floors but the first without study rooms

Rooms can not be reserved, it was tried before but became and issue, but it continues to be an issue not reserving as finding available rooms can be hard and implies going throughout the whole university


# Our idea: 
Inspired on parking availability systems based on sensors (that we already have in via rooms), we want to create a system that shows available rooms by hub and floor, the rooms will be determined available or not based in the motion sensors, if there's nobody there for a certain time, it becaumes available (even if stuff is there).

We want to display availability throught the monitors around Via, and through the website, so students can check at any moment. 
The display works as tables with numbers and separations per hub (each room has a designated number as C.2.12 meaning hub c, floor 2, room 12), and by a map display showing green or red for the rooms in each floor of the section.

# Entities (EER):
1. StudyRoom
Represents each physical room.
### Attributes:
- roomId (e.g., C.2.12) 
- PK (auto increment)
- capacity (optional)
- status (available / occupied)
- lastActivityTime
- Motion sensor id (optional?)
- FK: tower id (Hub/Tower)

2. Hub/Tower
Represents a building section (A, B, C).
### Attributes:
- hubId (A, B, C)
- name (optional)

3. Floor
Represents a level within a hub.
### Attributes:
- floorNumber (1–5(6 only avaliable in hub C))


# Tech stack
- Backend => .NET10 with Restful APIs
- Database => PostgreSQL
- Frontend => Blazor/(maybe React+Vite instead?)