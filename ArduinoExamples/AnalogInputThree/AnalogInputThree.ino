/*
  AnalogInput
 Demonstrates analog input by reading an analog sensor on analog pin 0 and
 turning on and off a light emitting diode(LED)  connected to digital pin 13. 
 The amount of time the LED will be on and off depends on
 the value obtained by analogRead(). 
 
 The circuit:
 * Potentiometer attached to analog input 0
 * center pin of the potentiometer to the analog pin
 * one side pin (either one) to ground
 * the other side pin to +5V
 * LED anode (long leg) attached to digital output 13
 * LED cathode (short leg) attached to ground
 
 * Note: because most Arduinos have a built-in LED attached 
 to pin 13 on the board, the LED is optional.
 
 
 Created by David Cuartielles
 modified 30 Aug 2011
 By Tom Igoe
 
 This example code is in the public domain.
 
 http://arduino.cc/en/Tutorial/AnalogInput
 
 */

int sensorPinA = A0;    // select the input pin for the potentiometer
int sensorPinB = A1;
int sensorPinC = A2;
int ledPin = 10;      // select the pin for the LED
int sensorValueA = 0;
int sensorValueB = 0;
int sensorValueC = 0;

int sensorValueATemp = 0;
int sensorValueBTemp = 0;
int sensorValueCTemp = 0;

int sensorUpperLimit = 1023;
int sensorLowerLimit = 0;

// variable for saving print time ignoring some slight sensor variance
int changeThreshold = 4; 

// variable to store the value coming from the sensor
int ledBrightness = 0;
int sensorShift = 1;



void setup() {
  // declare the ledPin as an OUTPUT:
  pinMode(ledPin, OUTPUT);
  Serial.begin(115200);
}

void loop() {
  
  // read the value from the sensor:
  sensorValueATemp = analogRead(sensorPinA);
  sensorValueBTemp = analogRead(sensorPinB);
  sensorValueCTemp = analogRead(sensorPinC);
  
  if(
         sensorValueATemp > sensorValueA+changeThreshold
      || sensorValueATemp < sensorValueA-changeThreshold
      || sensorValueBTemp > sensorValueB+changeThreshold
      || sensorValueBTemp < sensorValueB-changeThreshold
      || sensorValueCTemp > sensorValueC+changeThreshold
      || sensorValueCTemp < sensorValueC-changeThreshold
    ){
        
    sensorValueA = sensorValueATemp;
    sensorValueB = sensorValueBTemp;
    sensorValueC = sensorValueCTemp;
    
    Serial.print(sensorValueA);
    Serial.print(",");
    Serial.print(sensorValueB);
    Serial.print(",");
    Serial.println(sensorValueC);
    
  }  
  
  //DELAY to not overrun the serial buffer in the receiver (processing app)
  //Unfortunately this delays the LED. Should probably not use Delay but a timer or counter instead... Will Fix.
  delay(20);
  

}
