import React, {useState} from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import AnchoredPopupTouchableOpacity, {
  AnchoredPopupMode,
} from './package/src/AnchoredPopup';
import AnchoredPopupProvider from './package/src/AnchoredPopupProvider';

const modes: AnchoredPopupMode[] = ['stick', 'center-x', 'center-y', 'center'];

const popupWidth = (Dimensions.get('window').width - 36) / 2;
const element = (
  <Image
    source={require('./anchored-popup-react.png')}
    style={{
      width: popupWidth,
      height: popupWidth,
      borderWidth: 2,
      borderRadius: 5,
      backgroundColor: 'white',
    }}
  />
);

const opacityStyle: ViewStyle = {
  backgroundColor: 'purple',
  borderRadius: 30,
  paddingHorizontal: 24,
  paddingVertical: 12,
};

function Button({mode}: {mode: AnchoredPopupMode}) {
  return (
    <AnchoredPopupTouchableOpacity
      popupElement={element}
      mode={mode}
      style={opacityStyle}>
      <Text style={{color: 'white'}}>Open</Text>
    </AnchoredPopupTouchableOpacity>
  );
}

function TestApp() {
  const [mode, setMode] = useState<AnchoredPopupMode>('stick');

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'space-between',
        paddingVertical: 60,
        paddingHorizontal: 24,
      }}>
      <ImageBackground
        source={require('./anchored-popup-anchor.png')}
        style={StyleSheet.absoluteFill}
        imageStyle={{opacity: 0.2}}
      />
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Button mode={mode} />
        <Button mode={mode} />
      </View>
      <View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Button mode={mode} />
          <Button mode={mode} />
        </View>
        <View
          style={{
            flexDirection: 'row',
          }}>
          {modes.map(m => (
            <TouchableOpacity
              style={{
                paddingVertical: 12,
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
              }}
              onPress={() => setMode(m)}>
              <Text style={{color: m === mode ? 'purple' : 'black'}}>{m}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const App = () => {
  console.log('Rendered');
  return (
    <AnchoredPopupProvider>
      <TestApp />
    </AnchoredPopupProvider>
  );
};

export default App;
