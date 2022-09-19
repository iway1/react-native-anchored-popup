import React, {createContext, ReactNode, useContext, useState} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';

const Context = createContext<number | null>(null);

export default function AnchoredPopupProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [appHeight, setAppHeight] = useState<number>(
    Dimensions.get('window').height,
  );
  return (
    <Context.Provider value={appHeight}>
      <View
        style={styles.viewStyle}
        onLayout={e => setAppHeight(e.nativeEvent.layout.height)}>
        {children}
      </View>
    </Context.Provider>
  );
}

export function useAppHeight() {
  const context = useContext(Context);
  if (context === null) {
    throw new Error(
      'Please wrap your app in an `AnchoredPopupProvider` to use the AnchoredPopup component.',
    );
  }
  return context;
}

const styles = StyleSheet.create({
  viewStyle: {
    flex: 1,
  },
});
