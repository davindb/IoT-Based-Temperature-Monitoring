#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>

const int trigPin = 12;
const int echoPin = 14;


#define LED_GREEN 16
#define LED_YELLOW 5
#define LED_RED 4

const char* ssid = "SSID_NAME";
const char* password = "PASSWORD";

// API Endpoint "http://192.168.68.105:5000/temperatures"
const char* serverName = "http://192.168.68.105:5000/temperatures";

unsigned long lastTime = 0;

// Set timer to X milliseconds
unsigned long timerDelay = 500;

void setup() {
  Serial.begin(115200);
  pinMode(trigPin, OUTPUT); // Sets the trigPin as an Output
  pinMode(echoPin, INPUT); // Sets the echoPin as an Input
  pinMode(LED_GREEN, OUTPUT);
  pinMode(LED_YELLOW, OUTPUT);
  pinMode(LED_RED, OUTPUT);

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

float soundWave(){
  long duration;
  float distance;

  //define sound velocity in cm/uS
  float SOUND_VELOCITY = 0.034;

  // Clears the trigPin
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  // Sets the trigPin on HIGH state for 10 micro seconds
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  
  // Reads the echoPin, returns the sound wave travel time in microseconds
  duration = pulseIn(echoPin, HIGH);
  
  // Calculate the distance
  distance = duration * SOUND_VELOCITY/2;
  return distance;
}

void greenOn(){
  digitalWrite(LED_GREEN, HIGH);
  digitalWrite(LED_YELLOW, LOW);
  digitalWrite(LED_RED, LOW);
}

void yellowOn(){
  digitalWrite(LED_GREEN, LOW);
  digitalWrite(LED_YELLOW, HIGH);
  digitalWrite(LED_RED, LOW);
}

void redOn(){
  digitalWrite(LED_GREEN, LOW);
  digitalWrite(LED_YELLOW, LOW);
  digitalWrite(LED_RED, HIGH);
}

void loop() { 
  
  //Send an HTTP POST request every X milliseconds (timerDelay variable)
  if ((millis() - lastTime) > timerDelay) {
    float distance = soundWave();
    // Prints the distance on the Serial Monitor
    if(distance < 10){
      greenOn();
    } else if(distance < 20){
      yellowOn();  
    } else{
      redOn(); 
    }
    //Check WiFi connection status
    if(WiFi.status()== WL_CONNECTED){
      WiFiClient client;
      HTTPClient http;
      
      // Your Domain name with API Endpoint
      http.begin(client, serverName);

      // Specify content-type header
      http.addHeader("Content-Type", "application/json");
      // Data to send with HTTP POST
      String httpRequestData = "{\"temp_belitan\":" + (String)distance + ",";
      httpRequestData += "\"temp_intibesi\":" + (String)distance + "}";
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
