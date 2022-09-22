/**
 * Demo app for react-native-anchored-popup. Check out /package for package source code.
 */
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
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {
  AnchoredPopupMode,
  AnchoredPopupTouchableOpacity,
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

function DemoApp() {
  const w = Dimensions.get('window').width / 1.9;
  const imageWidth = w - 36;
  return (
    <View
      style={{
        paddingHorizontal: 24,
        paddingVertical: 50,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <ImageBackground
        source={require('./anchored-popup-anchor.png')}
        imageStyle={{opacity: 0.2}}
        style={StyleSheet.absoluteFill}
      />
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <AnchoredPopupTouchableOpacity
          style={{
            padding: 24,
            paddingHorizontal: 12,
            borderRadius: 100,
            backgroundColor: 'purple',
          }}
          popupElement={
            <View
              style={{
                width: w,
                backgroundColor: 'white',
                padding: 24,
                paddingHorizontal: 18,
                borderRadius: 10,
                shadowColor: 'black',
                shadowRadius: 2,
                shadowOffset: {height: 2, width: 2},
              }}>
              <Text style={{fontSize: 32}}>A cool popup! =D</Text>
              <Image
                style={{width: imageWidth, height: imageWidth}}
                source={require('./anchored-popup-react.png')}
              />
            </View>
          }>
          <Text
            style={{
              color: 'white',
            }}>
            Open
          </Text>
        </AnchoredPopupTouchableOpacity>
      </View>
      <View style={{flex: 1, justifyContent: 'center'}}>
        <AnchoredPopupTouchableOpacity
          style={{
            padding: 24,
            paddingHorizontal: 12,
            borderRadius: 100,
            backgroundColor: 'purple',
            marginBottom: 32,
          }}
          popupElement={
            <View
              style={{
                width: w,
                backgroundColor: 'white',
                padding: 24,
                paddingHorizontal: 18,
                borderRadius: 10,
                shadowColor: 'black',
                shadowRadius: 2,
                shadowOffset: {height: 2, width: 2},
              }}>
              <Text style={{fontSize: 32}}>A cool popup! =D</Text>
              <Image
                style={{width: imageWidth, height: imageWidth}}
                source={require('./anchored-popup-react.png')}
              />
            </View>
          }>
          <Text
            style={{
              color: 'white',
            }}>
            Open
          </Text>
        </AnchoredPopupTouchableOpacity>
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
          width: '100%',
        }}>
        <AnchoredPopupTouchableOpacity
          style={{
            padding: 24,
            paddingHorizontal: 12,
            borderRadius: 100,
            backgroundColor: 'purple',
            marginBottom: 32,
          }}
          popupElement={
            <View
              style={{
                width: w,
                backgroundColor: 'white',
                padding: 24,
                paddingHorizontal: 18,
                borderRadius: 10,
                shadowColor: 'black',
                shadowRadius: 2,
                shadowOffset: {height: 2, width: 2},
              }}>
              <Text style={{fontSize: 32}}>A cool popup! =D</Text>
              <Image
                style={{width: imageWidth, height: imageWidth}}
                source={require('./anchored-popup-react.png')}
              />
            </View>
          }>
          <Text
            style={{
              color: 'white',
            }}>
            Open
          </Text>
        </AnchoredPopupTouchableOpacity>
      </View>
    </View>
  );
}

const App = () => {
  const [app, setApp] = useState<'test' | 'demo'>('demo');
  const [hideOverlay, setHideOverlay] = useState(false);
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <AnchoredPopupProvider>
        <View
          style={{
            flexDirection: 'row',
            paddingTop: 50,
            paddingHorizontal: 24,
          }}>
          {!hideOverlay &&
            (['test', 'demo'] as const).map(e => (
              <TouchableOpacity
                style={{
                  padding: 24,
                  backgroundColor: 'purple',
                  marginRight: 24,
                }}
                key={e}
                onPress={() => setApp(e)}>
                <Text style={{color: 'white'}}>{e}</Text>
              </TouchableOpacity>
            ))}
        </View>
        {app == 'test' ? <TestApp /> : <DemoApp />}
        {!hideOverlay && (
          <View
            style={{
              position: 'absolute',
              right: 24,
              bottom: 60,
            }}>
            <TouchableOpacity onPress={() => setHideOverlay(true)}>
              <Text>hide overlay</Text>
            </TouchableOpacity>
          </View>
        )}
      </AnchoredPopupProvider>
    </GestureHandlerRootView>
  );
};

export default App;
