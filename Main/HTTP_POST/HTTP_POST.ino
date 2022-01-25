// Declare libraries
#include <Wire.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>

// Define SSID and Password for WiFi
const char* ssid = "ADF.";
const char* password = "wiwied100668";

// API Endpoint "http://{open cmd = ipconfig = ipv4}:5000/temperatures"
const char* serverName = "http://192.168.68.113:5000/temperatures";

unsigned long lastTime = 0;

// Set timer to X milliseconds
unsigned long timerDelay = 500;

void setup() {
  Serial.begin(9600);

  WiFi.begin(ssid, password);
  Serial.println("Connecting");
  while(WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());
  Serial.println("Timer set to 0.5 seconds (timerDelay variable), it will take 0.5 seconds before publishing the first reading.");
}

void loop() {
  //Send an HTTP POST request every X milliseconds (timerDelay variable)
  if ((millis() - lastTime) > timerDelay) {
    float tempAtas = 11;
    float tempSamping = 12;
    String trafoStatus = "Normal";
    
    //Check WiFi connection status
    if(WiFi.status()== WL_CONNECTED){
      WiFiClient client;
      HTTPClient http;
      
      // Your Domain name with API Endpoint
      http.begin(client, serverName);

      // Specify content-type header
      http.addHeader("Content-Type", "application/json");
      // Data to send with HTTP POST
      String httpRequestData = "{\"temp_atas\":" + (String)tempAtas + ",";
      httpRequestData += "\"temp_samping\":" + (String)tempSamping + "}";
      Serial.println(httpRequestData);       
      // Send HTTP POST request
      int httpResponseCode = http.POST(httpRequestData);
      // Get the request
      String payload = http.getString();

      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
      Serial.print("JSON Data Response: ");
      Serial.println(payload);
      
      // Free resources
      http.end();
    }
    else {
      Serial.println("WiFi Disconnected");
    }
    lastTime = millis();
  }
}
