![Lynxari IoT Platform](https://agilatech.com/images/lynxari/lynxari200x60.png) **IoT Platform**
## Lynxari CtIn Current Transformer sensor device driver

This device driver is specifically designed to be used with the Agilatech® Lynxari IoT Platform.
Please see [agilatech.com](https://agilatech.com/software) to download a copy of the system.

### Install
```
$> npm install @agilatech/lynxari-ctin-device
```
Install in the same directory in which lynxari is installed.


### Design
This device driver is designed for both streaming and polled data collection from the CtIn sensor.  The sensor reports current amps, and this driver is programed to report on that parameter.  It will automatically poll and stream the value with configurable time periods.


### Usage
This device driver is designed to be consumed by the Agilatech® Lynxari IoT system.  As such, it is not really applicable or useful in other environments.

To use it with Lynxari, insert its object definition as an element in the devices array in the _devlist.json_ file.
```
{
  "name": "CtIn",
  "module": "@agilatech/lynxari-ctin-device",
  "options": {
    "inputNumber" : 0,
    "devicePoll": 10000,
    "streamPeriod": 60000,
    "deltaPercent": 0.1,
    "maxCurrent": 127.3,
    "calibration" : 3,
    "current_range" : 50
  }
}
```


#### Device config object
The device config object is an element in the devlist.json device configuration file, which is located in the Lynxari root directory.  It is used to tell the Lynxari system to load the device, as well as several operational parameters.

_name_ is simply the name given to the device.  This name can be used in queries and for other identifcation purposes.

_module_ is the name of the npm module. The module is expected to exist in this directory under the _node_modules_ directory.  If the module is not strictly an npm module, it must still be found under the node_modules directory.

_options_ is an object within the device config object which defines all other operational parameters.  In general, any parameters may be defined in this options object, and most modules will have many several.  The three which are a part of every Lynxari device are 'devicePoll', 'streamPeriod', and 'deltaPercent'.  The ctin options also can define 'bus', and 'altitude'.  Finally, all parameter values can have a range defined by specifying '&lt;parameter&gt;\_range'.


```
"inputNumber":<number>
The number of the CT input. Valid values are from 0 - 6

"devicePoll":<period>
Period in milliseconds in which device will be polled to check for new data

"streamPeriod":<period>
Period in milliseconds for broadcast of streaming values

"deltaPercent":<percent>
Percent of the data range which must be exceeded (delta) to qualify as "new" data

"maxCurrent":<current>
The maximum current in Amps the electronics are sized to handle.

"calibration":<percent>
A calibration correction percentage to be applied to the measurement.

"current_range":A typical range for the current value.  If the current varies from 35 to 75 amps, then the current_range is 40.
```

#### devicePoll and streamPeriod
_devicePoll_ is given in milliseconds, and defines how often the device will be polled for new values.  This paramter is primary useful in sensors which sit idle waiting to be polled, and not for devices which supply values on their own schedule (i.e. for pull ranther that push).

_streamPeriod_ is also given in milliseconds, and defines how often the device will publish its values on the data stream.  Streaming is disabled if this parameter is set to 0. 

#### deltaPercent explained
_deltaPercent_ is the percentage of the current numerical data range which a polled data value must exceed to be considred "new". As an example, consider a current range of 100, a deltaPercent of 2, and the current amperage of 34.  In such a case, a device poll must produce a value of 36 or greater, or 32 or less than in order to be stored as a current value.  35 or 33 will be ignored.  deltaPercent may be any value greater than 0 or less than 100, and may be fractional. If not defined, the default is 5 percent.


#### Defining the value ranges
Value ranges may also be defined in the options, and are closely related to deltaPercent.  If not defined, the software will keep track of minimum and maximum values and derive the range from them.  However, that takes time for the software to "learn" the ranges, so they can be defined in the options object:
```
"current_range":<numeric range>
```
where the &lt;numeric range&gt; is a number representing the absolute range of the value.


#### module config 
Every module released by Agilatech includes configuration in a file named 'config.json' and we encourage any other publishers to follow the same pattern.  The parameters in this file are considered defaults, since they are overriden by definitions appearing in the options object of the Lynxari devlist.json file.

The construction of the config.json mirrors that of the options object, which is simply a JSON object with key/value pairs.
Here is an example of an 'config.json' file which polls the device every 10 seconds and streams value every minute, and indicates the sensor is equipped for a max current of
127.3 amps with a calibration correction factor of 3 percent:
```
{
  "devicePoll":10000,
  "streamPeriod":60000,
  "maxCurrent": 127.3,
  "calibration": 3
}
```


#### Default values
If not defined in either the devlist.json or the config.json files, the program uses the following default values:
* _streamPeriod_ : 10000 (10,000ms or 10 seconds)
* _devicePoll_ : 1000 (1,000ms or 1 second)
* _deltaPercent_ : 5 (polled values must exceed the range by &plusmn; 5%)


### Properties
All drivers contain the following 4 core properties:
1. **state** : the current state of the device, containing either the value *chron-on* or *chron-off* 
to indicate whether the device is monitoring data isochronally (a predefinied uniform time period of device data query).
2. **id** : the unique id for this device.  This device id is used to subscribe to this device streams.
3. **name** : the given name for this device.
4. **type** : the given type category for this device,  (_sensor_, _actuator_, etc)


#### Monitored Properties
In the *on* state, the driver software for this device monitors three values.
1. **current** - current in amp, as measured by the CT


#### Streaming Properties
In the *on* state, the driver software continuously streams three values in isochronal
fashion with a period defined by *streamPeriod*. Note that a *streamPeriod* of 0 disables streaming.
1. **current_stream**
  

### State
This device driver has a binary state: __on__ or __off__. When off, no parameter values are streamed or available, and no commands are accepted other than the _turn-on_ transition. When on, the device is operations and accepts all commands.  The initial state is _off_.
  
  
### Transitions
1. **turn-on** : Sets the device state to *on*. When on, the device is operational and accepts all commands. Values are streamed, and the device is polled periodically to keep monitored values up to date.

2. **turn-off** : Sets the device state to *off*, When off, no parameter values are streamed or available, and no commands are accepted other than the _turn-on_ transition.


### Compatibility
This driver runs under Lynxari operating on any computer from a small single board computer up to large cloud server, using any of the following operating systems:
* 32 or 64-bit Linux
* Windows 7 and up
* macOS and OS X
* SunOS
* AIX


### Copyright
Copyright © 2018 [Agilatech®](https://agilatech.com). All Rights Reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
