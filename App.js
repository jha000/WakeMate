import React, {useState, useRef} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ToastAndroid,
  Image,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import Sound from 'react-native-sound';

const App = () => {
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [alarmTime, setAlarmTime] = useState(null);
  const [sound, setSound] = useState(null);
  const timeoutRef = useRef(null);

  const handleDateConfirm = date => {
    setIsDatePickerVisible(false);
    setSelectedDate(date);
    const time = moment(date).format('h:mm:ss A');
    setAlarmTime(time);

    const now = moment();
    const diff = moment(date).diff(now);

    if (diff < 0) {
      ToastAndroid.show('past time selected', ToastAndroid.SHORT);
      return;
    }

    // set a timeout to show the toast message when the alarm time comes
    timeoutRef.current = setTimeout(() => {
      ToastAndroid.show('Alarm ringing!', ToastAndroid.SHORT);

      // play the music
      const s = new Sound('music.mp3', Sound.MAIN_BUNDLE, error => {
        if (error) {
          console.log('Error loading sound: ', error);
        } else {
          console.log('Sound loaded');
          s.setCategory('Playback');
          s.play();
          setSound(s);
        }
      });
    }, diff);
  };

  const handleCancel = () => {
    setIsDatePickerVisible(false);
    setSelectedDate(null);
    setAlarmTime(null);
  };

  const handleStop = () => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
    }
    if (sound !== null) {
      sound.stop(() => {
        console.log('Sound stopped');
        setSound(null);
      });
    }
  };

  const showDatePicker = () => {
    setIsDatePickerVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image source={require('./clock.png')} style={styles.logo} />
        <Text style={styles.appName}>WakeMate</Text>
      </View>
      <View style={styles.alarmContainer}>
        <Text style={styles.alarmText}>{alarmTime || 'Set Alarm'}</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={showDatePicker}>
        <Text style={styles.buttonText}>SET TIME</Text>
      </TouchableOpacity>
      {sound && (
        <TouchableOpacity style={styles.button} onPress={handleStop}>
          <Text style={styles.buttonText}>STOP</Text>
        </TouchableOpacity>
      )}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="time"
        onConfirm={handleDateConfirm}
        onCancel={handleCancel}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 50,
  },
  logo: {
    width: 32,
    height: 32,
    marginRight: 10,
  },
  appName: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
  alarmContainer: {
    backgroundColor: '#5065AD',
    borderRadius: 100,
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
  },
  alarmText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#2C856B',
    padding: 16,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  stopButton: {
    backgroundColor: '#E70D0D',
    padding: 10,
    borderRadius: 10,
    marginTop: 32,
  },
  stopButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default App;
