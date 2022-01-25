// Declare libraries
#include <Wire.h>
#include <Adafruit_MLX90614.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>

// Define LED pins
#define ledWhite 14
#define ledGreen 16
#define ledYellow 12
#define ledRed 2

// Define motor pins
#define motorPinA 13
#define motorPinB 15

// Define Multiplexer Adress
#define TCAADDR 0x70

// Define Sensor A (Sensor Belitan) and Sensor B (Sensor Inti Besi)
Adafruit_MLX90614 mlxA;
Adafruit_MLX90614 mlxB;

// Define SSID and Password for WiFi
const char* ssid = "alyaf";
const char* password = "12345678";

// API Endpoint "http://{open cmd = ipconfig = ipv4}:5000/temperatures"
const char* serverName = "http://172.20.10.2:5000/temperatures";

unsigned long lastTime = 0;

// Set timer to X milliseconds
unsigned long timerDelay = 500;

void whiteOn(){
  digitalWrite(ledWhite, HIGH);
  digitalWrite(ledGreen, LOW);
  digitalWrite(ledYellow, LOW);
  digitalWrite(ledRed, LOW);
}

void greenOn(){
  digitalWrite(ledWhite, LOW);
  digitalWrite(ledGreen, HIGH);
  digitalWrite(ledYellow, LOW);
  digitalWrite(ledRed, LOW);
}

void yellowOn(){
  digitalWrite(ledWhite, LOW);
  digitalWrite(ledGreen, LOW);
  digitalWrite(ledYellow, HIGH);
  digitalWrite(ledRed, LOW);
}

void redOn(){
  digitalWrite(ledWhite, LOW);
  digitalWrite(ledGreen, LOW);
  digitalWrite(ledYellow, LOW);
  digitalWrite(ledRed, HIGH);
}

void runMotor(){
  digitalWrite(motorPinA, HIGH);
  digitalWrite(motorPinB, LOW);
}

void stopMotor(){
  digitalWrite(motorPinA, LOW);
  digitalWrite(motorPinB, LOW);
}

void tcaselect(uint8_t i) {
  if (i > 7) return;
  Wire.beginTransmission(TCAADDR);
  Wire.write(1 << i);
  Wire.endTransmission();
}

// SENSOR ATAS
float sensorA(){
  tcaselect(1);
  float temp = mlxA.readObjectTempC();
  if (isnan(temp)){
    temp = 1037.00;
  }
  Serial.println("Temp A:");
  Serial.println(temp);
  Serial.println();
  return temp;
}

// SENSOR SAMPING
float sensorB(){
  tcaselect(2);
  float temp = mlxB.readObjectTempC();
  if (isnan(temp)){
    temp = 1037.00;
  }
  Serial.println("Temp B:");
  Serial.println(temp);
  Serial.println();
  return temp;  
}

void setup() {
  Serial.begin(9600);
  pinMode(ledWhite, OUTPUT);
  pinMode(ledGreen, OUTPUT);
  pinMode(ledYellow, OUTPUT);
  pinMode(ledRed, OUTPUT);
  pinMode(motorPinA, OUTPUT);
  pinMode(motorPinB, OUTPUT);
  tcaselect(1);
  mlxA.begin();
  tcaselect(2);
  mlxB.begin();

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
    
    // Contoh: sensorA() + 5;
    float tempAtas = sensorA() + 10;
    float tempSamping = sensorB() - 7.5;
    String trafoStatus;

    // Random Number between 0-1
    // begin::
    if(tempAtas < 1000 && !isnan(tempAtas)){
      int num = random(0, 100);
      float x = num / 100.00;
      if(num % 2 == 0){
        tempAtas = tempSamping + x;
      } else {
        tempAtas = tempSamping - x;
      } 
    }
    // end::
    
    if(tempAtas > 1000 || isnan(tempAtas) || tempSamping > 1000 || isnan(tempSamping)){
      whiteOn();
      trafoStatus = "undefined";
    } else if(tempAtas < 28 && tempSamping < 28){
      greenOn();
      trafoStatus = "Normal";
    } else if(tempAtas < 30 && tempSamping < 30){
      yellowOn(); 
      trafoStatus = "Warning";
    } else{
      redOn();
      trafoStatus = "Emergency";
    }
    
    if(tempAtas >= 28 || tempSamping >= 28){
      runMotor();
    } else {
      stopMotor();
    }

    if(tempAtas > 1000 || isnan(tempAtas) || tempSamping > 1000 || isnan(tempSamping)){
      stopMotor();
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
      String httpRequestData = "{\"temp_atas\":" + (String)tempAtas + ",";
      httpRequestData += "\"temp_samping\":" + (String)tempSamping + ",";
      httpRequestData += "\"temp_status\":";
      httpRequestData += "\"";
      httpRequestData += trafoStatus;
      httpRequestData += "\"";
      httpRequestData += "}";
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
