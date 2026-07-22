#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// --- UPDATE FOR NODE 1 OR NODE 2 ---
const String node_id  = "NODE_002"; // Use NODE_001 for Kitchen, NODE_002 for Bedroom
const String location = "Bedroom";  // Use Kitchen or Bedroom

// STATIC IP CONFIGURATION
IPAddress local_IP(192, 168, 1, 102); // 101 for Kitchen, 102 for Bedroom
IPAddress gateway(192, 168, 1, 1);    
IPAddress subnet(255, 255, 255, 0);
IPAddress primaryDNS(8, 8, 8, 8);
IPAddress secondaryDNS(8, 8, 4, 4);

const char* ssid     = "-----";
const char* password = "-----";
const char* serverBase = "http://192.168.1.2:8000"; 

const int switchPin = 21;
const int ledPin = 19;
const int currentPin = 34; 
const int fanPin = 22; 

int lastSwitchState = HIGH;
bool manualMode = true;
int currentLedState = 0;
int currentFanState = 0;

unsigned long lastConfigSync = 0;
unsigned long lastTelemetrySync = 0;

void setup() {
    Serial.begin(115200);
    pinMode(switchPin, INPUT_PULLUP);
    pinMode(ledPin, OUTPUT);
    pinMode(fanPin, OUTPUT);
    pinMode(currentPin, INPUT);
    
    // Initial state: LEDs ON (no !), Fans OFF (relay active low)
    digitalWrite(ledPin, HIGH); 
    digitalWrite(fanPin, HIGH); 
    
    if (!WiFi.config(local_IP, gateway, subnet, primaryDNS, secondaryDNS)) {
        Serial.println("Static IP configuration failed!");
    }
    
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) delay(500);
    
    Serial.print("Connected! IP Address: ");
    Serial.println(WiFi.localIP());
    
    lastSwitchState = digitalRead(switchPin);
}

void loop() {
    // 1. PHYSICAL SWITCH
    if (manualMode) {
        int currentSwitchState = digitalRead(switchPin);
        if (currentSwitchState != lastSwitchState) {
            delay(50);
            if (digitalRead(switchPin) == currentSwitchState) { 
                lastSwitchState = currentSwitchState;
                currentLedState = (currentLedState == 0) ? 1 : 0;
                
                // NO '!' HERE - LED logic was already fine
                digitalWrite(ledPin, currentLedState); 

                HTTPClient httpCmd;
                httpCmd.begin(String(serverBase) + "/command/" + node_id + "/led/" + String(currentLedState));
                httpCmd.POST("");
                httpCmd.end();
            }
        }
    }

    // 2. SYNC CONFIG
    if (millis() - lastConfigSync > 1000) {
        HTTPClient httpConfig;
        httpConfig.begin(String(serverBase) + "/config/" + node_id);
        if (httpConfig.GET() > 0) {
            String payload = httpConfig.getString();
            StaticJsonDocument<200> doc;
            deserializeJson(doc, payload);
            
            currentLedState = doc["led_state"];
            currentFanState = doc["fan_state"];
            manualMode = doc["manual_mode"];
            
            // LED: No '!' (Normal)
            // FAN: Keep '!' (Inverted for Active Low relay)
            digitalWrite(ledPin, currentLedState); 
            digitalWrite(fanPin, !currentFanState); 
        }
        httpConfig.end();
        lastConfigSync = millis();
    }

    // 3. TELEMETRY
    if (millis() - lastTelemetrySync > 1000) {
        int rawValue = analogRead(currentPin);
        float sensorVoltage = (rawValue / 4095.0) * 3.3;

        HTTPClient httpTel;
        httpTel.begin(String(serverBase) + "/telemetry");
        httpTel.addHeader("Content-Type", "application/json");
        
        StaticJsonDocument<256> tDoc;
        tDoc["node_id"] = node_id;
        tDoc["location"] = location;
        tDoc["voltage"] = sensorVoltage; 
        tDoc["switch_state"] = (currentLedState == 1) ? "CLOSED" : "OPEN";
        
        String json;
        serializeJson(tDoc, json);
        httpTel.POST(json);
        httpTel.end();
        
        lastTelemetrySync = millis();
    }
}