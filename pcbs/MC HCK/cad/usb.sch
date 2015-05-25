EESchema Schematic File Version 2
LIBS:usb
LIBS:power
LIBS:device
LIBS:transistors
LIBS:conn
LIBS:linear
LIBS:regul
LIBS:74xx
LIBS:cmos4000
LIBS:adc-dac
LIBS:memory
LIBS:xilinx
LIBS:special
LIBS:microcontrollers
LIBS:dsp
LIBS:microchip
LIBS:analog_switches
LIBS:motorola
LIBS:texas
LIBS:intel
LIBS:audio
LIBS:interface
LIBS:digital-audio
LIBS:philips
LIBS:display
LIBS:cypress
LIBS:siliconi
LIBS:opto
LIBS:atmel
LIBS:contrib
LIBS:valves
LIBS:microsd
LIBS:conn_16
LIBS:conn_15
LIBS:conn_18
LIBS:mcp73831
LIBS:SparkFun
LIBS:tac_switchsmd_evqp2
LIBS:cn3063
LIBS:mic5205
LIBS:NUC120_QFN48
LIBS:mcp1702
LIBS:multireg
LIBS:inductor_select
LIBS:logo
LIBS:MK20LF
LIBS:mounthole
LIBS:vssa
LIBS:vdda
LIBS:mchck-cache
EELAYER 27 0
EELAYER END
$Descr A4 11693 8268
encoding utf-8
Sheet 2 4
Title "MC HCK microcontroller board"
Date "28 feb 2014"
Rev "R5-rc3"
Comp "(c) 2011,2012,2013 Simon Schubert"
Comment1 "CERN OHL v.1.1 or later"
Comment2 ""
Comment3 ""
Comment4 ""
$EndDescr
$Comp
L CONN_5 J3
U 1 1 4F274705
P 4350 4150
F 0 "J3" V 4300 4150 50  0000 C CNN
F 1 "MICRO_USB" V 4400 4150 50  0000 C CNN
F 2 "SparkFun-USB-MICROB" V 4500 4150 50  0001 C CNN
F 3 "" H 4350 4150 60  0001 C CNN
F 4 "optional" V 4350 4150 60  0001 C CNN "populate"
	1    4350 4150
	-1   0    0    -1  
$EndComp
$Comp
L R R1
U 1 1 4F22C569
P 6950 4150
F 0 "R1" V 7000 4350 50  0000 C CNN
F 1 "33" V 6950 4150 50  0000 C CNN
F 2 "SMD-1005" V 7050 4150 50  0001 C CNN
F 3 "" H 6950 4150 60  0001 C CNN
	1    6950 4150
	0    -1   -1   0   
$EndComp
$Comp
L R R2
U 1 1 4F22C560
P 6950 4050
F 0 "R2" V 7000 4250 50  0000 C CNN
F 1 "33" V 6950 4050 50  0000 C CNN
F 2 "SMD-1005" V 7050 4050 50  0001 C CNN
F 3 "" H 6950 4050 60  0001 C CNN
	1    6950 4050
	0    -1   -1   0   
$EndComp
Text Notes 4950 4550 2    40   Italic 0
Micro USB header
Text Label 6300 4050 0    40   ~ 0
USB_D-
Text Label 6300 4150 0    40   ~ 0
USB_D+
Text HLabel 5250 3850 1    40   Output ~ 0
VBUS
Wire Wire Line
	4750 4150 6700 4150
Wire Wire Line
	4750 3950 5250 3950
Wire Wire Line
	7200 4050 7450 4050
Wire Wire Line
	4750 4350 5250 4350
Wire Wire Line
	7200 4150 7450 4150
Wire Wire Line
	4750 4050 6700 4050
Wire Wire Line
	5250 4350 5250 4500
Wire Wire Line
	5250 3950 5250 3850
Text HLabel 7450 4050 2    40   3State ~ 0
USB_DM
Text HLabel 7450 4150 2    40   3State ~ 0
USB_DP
$Comp
L VSS #PWR07
U 1 1 51F1CF4D
P 5250 4500
F 0 "#PWR07" H 5250 4500 30  0001 C CNN
F 1 "VSS" H 5250 4430 30  0000 C CNN
F 2 "" H 5250 4500 60  0000 C CNN
F 3 "" H 5250 4500 60  0000 C CNN
	1    5250 4500
	1    0    0    -1  
$EndComp
$Comp
L CONN_1 P9
U 1 1 530E6520
P 5400 3950
F 0 "P9" H 5480 3950 40  0001 L CNN
F 1 "5V" H 5450 3950 30  0000 L CNN
F 2 "solderpad" H 5400 4105 30  0001 C CNN
F 3 "" H 5400 3950 60  0001 C CNN
F 4 "never" H 5400 3950 60  0001 C CNN "populate"
	1    5400 3950
	1    0    0    -1  
$EndComp
$Comp
L CONN_1 P10
U 1 1 530E6527
P 5400 4350
F 0 "P10" H 5480 4350 40  0001 L CNN
F 1 "GND" H 5450 4350 30  0000 L CNN
F 2 "solderpad" H 5400 4505 30  0001 C CNN
F 3 "" H 5400 4350 60  0001 C CNN
F 4 "never" H 5400 4350 60  0001 C CNN "populate"
	1    5400 4350
	1    0    0    -1  
$EndComp
$Comp
L CONN_1 P11
U 1 1 530E677F
P 5700 3900
F 0 "P11" H 5780 3900 40  0001 L CNN
F 1 "D-" H 5750 3900 30  0000 L CNN
F 2 "solderpad" H 5700 4055 30  0001 C CNN
F 3 "" H 5700 3900 60  0001 C CNN
F 4 "never" H 5700 3900 60  0001 C CNN "populate"
	1    5700 3900
	0    -1   -1   0   
$EndComp
$Comp
L CONN_1 P12
U 1 1 530E6786
P 5700 4300
F 0 "P12" H 5780 4300 40  0001 L CNN
F 1 "D+" H 5750 4300 30  0000 L CNN
F 2 "solderpad" H 5700 4455 30  0001 C CNN
F 3 "" H 5700 4300 60  0001 C CNN
F 4 "never" H 5700 4300 60  0001 C CNN "populate"
	1    5700 4300
	0    1    1    0   
$EndComp
Connection ~ 5700 4050
Connection ~ 5700 4150
Connection ~ 5250 3950
Connection ~ 5250 4350
NoConn ~ 4750 4250
$EndSCHEMATC
