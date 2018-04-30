import React from "react";
import {
  Dimensions,
  Image,
  Button,
  StyleSheet,
  Text,
  View,
  FlatList
} from "react-native";
import Expo, { Asset, Audio, FileSystem, Font, Permissions } from "expo";

export default class App extends React.Component {
  recorder = null;
  recording = null;
  state = {
    haveRecordingPermissions: false,
    status: "",
    clips: []
  };

  componentDidMount = () => {
    // (async () => {
    //   await Font.loadAsync({
    //     "font-name": require("./assets/fonts/font-file.ttf")
    //   });
    //   this.setState({ fontLoaded: true });
    // })();
    this._askForPermissions();
  };

  _askForPermissions = async () => {
    const response = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    this.setState({
      haveRecordingPermissions: response.status === "granted"
    });
  };

  _onPressExport = () => {};

  _onPressOverwrite = () => {
    this._startRecorder();
  };

  _onPressRecord = () => {
    this._startRecorder();
  };

  _onPressReplay = async () => {
    if (this.state.status === "recording") {
      await this._convertRecording();
      this.recording.playAsync();
      this.setState({ status: "playing" });
    } else {
      this.recording.replayAsync();
    }
  };

  _onPressSave = async () => {
    this.setState(
      {
        clips: [
          ...this.state.clips,
          { ...this.recorder, key: (this.state.clips.length + 1).toString() }
        ]
      },
      () => {
        this._startRecorder;
        console.log(this.state.clips);
      }
    );
  };

  _startRecorder = async () => {
    try {
      this.recorder = new Audio.Recording();
      await this.recorder.prepareToRecordAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      await this.recorder.startAsync();
      this.setState({ status: "recording" });
    } catch (error) {
      console.error(error);
    }
  };

  _convertRecording = async () => {
    try {
      await this.recorder.stopAndUnloadAsync();
      const { sound } = await this.recorder.createNewLoadedSound();
      this.recording = sound;
    } catch (error) {
      console.error(error);
    }
  };

  render = () => {
    return (
      <View style={styles.container}>
        <View style={styles.nav}>
          <Button
            onPress={this._onPressExport}
            title="Save"
            style={styles.button}
            color="#e4b4c2"
            accessibilityLabel="Re-do"
          />
        </View>
        <FlatList
          style={styles.clips}
          data={this.state.clips}
          renderItem={clip => (
            <View style={styles.bar}>
              <Text>{clip._finalDurationMillis}</Text>
            </View>
          )}
        />
        <View style={styles.controls}>
          <Button
            onPress={this._onPressOverwrite}
            title="Re-do"
            style={styles.button}
            color="#ffb8d1"
            accessibilityLabel="Re-do"
          />
          {!this.state.status ? (
            <Button
              onPress={this._onPressRecord}
              title="Record"
              style={styles.button}
              color="#ffb8d1"
              accessibilityLabel="Record"
            />
          ) : (
            <Button
              onPress={this._onPressReplay}
              title="Replay"
              style={styles.button}
              color="#ffb8d1"
              accessibilityLabel="Replay"
            />
          )}
          <Button
            onPress={this._onPressSave}
            title="Next"
            style={styles.button}
            color="#ffb8d1"
            accessibilityLabel="Next"
          />
        </View>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  bar: {
    height: 40,
    backgroundColor: "#e4b4c2"
  },
  container: {
    flex: 1,
    backgroundColor: "#e7cee3",
    flexDirection: "column"
  },
  nav: {
    height: 60,
    width: "100%",
    flexDirection: "row",
    backgroundColor: "#e7cee3"
  },
  clips: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "blue"
  },
  controls: {
    height: 80,
    width: "100%",
    flexDirection: "row",
    backgroundColor: "#e7cee3"
  },
  button: {
    flex: 1,
    margin: 10
  }
});

Expo.registerRootComponent(App);
