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
  dimensions = {};
  state = {
    haveRecordingPermissions: false,
    longestDuration: 0,
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

  componentDidUpdate = () => {
    this.dimensions = Dimensions.get("window");
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

  _onPressStart = () => {
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
    if (this.state.status === "recording") {
      await this.recorder.stopAndUnloadAsync();
    }
    this.setState(
      {
        clips: [
          ...this.state.clips,
          { ...this.recorder, key: (this.state.clips.length + 1).toString() }
        ],
        longestDuration:
          this.state.longestDuration > this.recorder._finalDurationMillis
            ? this.state.longestDuration
            : this.recorder._finalDurationMillis
      },
      this._startRecorder
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
          renderItem={clip => {
            console.log(
              "WIDTH",
              Math.floor(
                clip._finalDurationMillis /
                  this.state.longestDuration *
                  this.dimensions.width *
                  0.8
              ),
              "CLIP DURATION:",
              clip._finalDurationMillis,
              "LONGEST DURATION:",
              this.state.longestDuration,
              "WIDTH",
              this.dimensions.width,
              "CLIP",
              clip
            );
            return (
              <View
                style={{
                  height: 20,
                  margin: 4,
                  backgroundColor: "#e4b4c2",
                  width: this.state._finalDurationMillis
                    ? Math.floor(
                        clip._finalDurationMillis /
                          this.state.longestDuration *
                          this.dimensions.width *
                          0.8
                      )
                    : Math.floor(this.dimensions.width * 0.8)
                }}
              >
                <Text>{clip._finalDurationMillis}</Text>
              </View>
            );
          }}
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
              onPress={this._onPressStart}
              title="Start"
              style={styles.button}
              color="#ffb8d1"
              accessibilityLabel="Start"
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
    height: 20,
    margin: 4,
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
    backgroundColor: "#e7cee3"
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
