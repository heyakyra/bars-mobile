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
  state = {
    haveRecordingPermissions: false,
    status: "",
    currentRecording: {},
    previewAudio: {},
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
    this.setState(
      { currentRecording: new Expo.Audio.Recording() },
      startRecording
    );

    const startRecording = async () => {
      try {
        await this.currentRecording.prepareToRecordAsync(
          Expo.Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );
        await this.currentRecording.startAsync();
        console.log("RECORDING!");
        this.setState({ status: "recording" });
      } catch (error) {
        console.error(error);
      }
    };
  };

  _onPressReplay = async () => {
    if (this.status === "recording") {
      await this.currentRecording.stopAndUnloadAsync();
      this.previewAudio = await this.currentRecording.createNewLoadedSound();
      this.setState({ status: "playing" });
    }
    this.previewAudio.replayAsync();
  };

  _onPressSave = () => {
    this.currentRecording.stopAndUnloadAsync();
  };

  render = () => {
    return (
      <View style={styles.container}>
        <View style={styles.nav}>
          <Button
            onPress={this._onPressExport}
            title="Save"
            color="#841584"
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
            color="#841584"
            accessibilityLabel="Re-do"
          />
          {this.state.status !== "recording" ? (
            <Button
              onPress={this._onPressRecord}
              title="Record"
              color="#841584"
              accessibilityLabel="Record"
            />
          ) : (
            <Button
              onPress={this._onPressReplay}
              title="Replay"
              color="#841584"
              accessibilityLabel="Replay"
            />
          )}
          <Button
            onPress={this._onPressSave}
            title="Next"
            color="#841584"
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
    flexDirection: "column"
  },
  nav: {
    height: 60,
    width: "100%",
    flexDirection: "row",
    backgroundColor: "blue"
  },
  clips: {
    flex: 1,
    flexDirection: "row"
  },
  controls: {
    height: 80,
    width: "100%",
    flexDirection: "row",
    backgroundColor: "blue"
  }
});

Expo.registerRootComponent(App);
