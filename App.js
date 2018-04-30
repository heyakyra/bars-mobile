import React from "react";
import {
  Dimensions,
  Image,
  Button,
  StyleSheet,
  Text,
  View
} from "react-native";
import Expo, { Asset, Audio, FileSystem, Font, Permissions } from "expo";

export default class App extends React.Component {
  recording = null;
  preview = null;
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

  _onPressOverwrite = () => {};

  _onPressRecord = async () => {
    this.recording = new Audio.Recording();
    await this._startRecording();
  };

  _onPressReplay = async () => {
    if (this.state.status === "recording") {
      await this.recording.stopAndUnloadAsync();
      const { sound } = await this.recording.createNewLoadedSound();
      this.preview = sound;
      console.log("PRE-PLAY STATUS: ", await this.preview.getStatusAsync());
      this.preview.playAsync();
      console.log("PLAYING STATUS: ", await this.preview.getStatusAsync());
      this.setState({ status: "playing" });
    } else {
      this.preview.replayAsync();
    }
  };

  _onPressSave = () => {
    this.recording.stopAndUnloadAsync();
  };

  _startRecording = async () => {
    try {
      await this.recording.prepareToRecordAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      await this.recording.startAsync();
      this.setState({ status: "recording" });
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
        <View style={styles.clips}>
          <View style={styles.clip}>
            <Text>00:09.203</Text>
          </View>
        </View>
        <View style={styles.controls}>
          <Button
            onPress={this._onPressOverwrite}
            title="Re-do"
            style={styles.button}
            color="#e4b4c2"
            accessibilityLabel="Re-do"
          />
          {this.state.status !== "recording" ? (
            <Button
              onPress={this._onPressRecord}
              title="Record"
              style={styles.button}
              color="#e4b4c2"
              accessibilityLabel="Record"
            />
          ) : (
            <Button
              onPress={this._onPressReplay}
              title="Replay"
              style={styles.button}
              color="#e4b4c2"
              accessibilityLabel="Replay"
            />
          )}
          <Button
            onPress={this._onPressSave}
            title="Next"
            style={styles.button}
            color="#e4b4c2"
            accessibilityLabel="Next"
          />
        </View>
      </View>
    );
  };
}

const styles = StyleSheet.create({
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
    flexDirection: "row"
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
