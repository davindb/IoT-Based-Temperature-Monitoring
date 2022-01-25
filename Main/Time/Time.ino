#include <ESP8266WiFi.h>
#include <time.h>

const char* ssid = "ADF.";
const char* password = "wiwied100668";

int timezone = 3;
int dst = 0;

void setup() {
  Serial.begin(9600);
  Serial.setDebugOutput(true);

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  Serial.println("\nConnecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(1000);
  }

  configTime(3 * 3600, 0, "pool.ntp.org", "time.nist.gov");
  Serial.println("\nWaiting for time");
  while (!time(nullptr)) {
    Serial.print(".");
    delay(1000);
  }
  Serial.println("");
}

void loop() {
  time_t now = time(nullptr);
  Serial.println(ctime(&now));
  delay(1000);
}
