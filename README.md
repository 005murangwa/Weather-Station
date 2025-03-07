# Weather Station

This project collects weather data (temperature and humidity) using the MQTT protocol and stores it in an SQLite database. The data is then visualized in a real-time graph, with the temperature and humidity values averaged every 5 minutes.

## Features

- Collects weather data (temperature and humidity) via MQTT.
- Stores the collected data in an SQLite database.
- Visualizes data in real-time using graphs.
- Averages the temperature and humidity values every 5 minutes for improved clarity.
  
## Prerequisites

To run this project, ensure you have the following installed on your system:

- **Node.js** (version 14 or higher)
- **npm** (Node Package Manager)
- **SQLite** (for database storage)
- **MQTT broker** (for publishing and subscribing to weather data)

## Installation

### 1. Clone the repository:
Open your terminal and run the following command to clone this repository to your local machine.

```bash
git clone https://github.com/005murangwa/Weather-Station.git
