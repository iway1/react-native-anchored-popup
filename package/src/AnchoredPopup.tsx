import React, {ReactNode, useEffect, useRef, useState} from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacityProps,
  LayoutChangeEvent,
  TouchableOpacity,
  GestureResponderEvent,
  Dimensions,
} from 'react-native';
import {
  gestureHandlerRootHOC,
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  Easing,
  FadeOut,
  interpolate,
  runOnJS,
  SharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useAppHeight} from './AnchoredPopupProvider';

function w() {
  return Dimensions.get('window').width;
}

export function logBaseN({n, value}: {n: number; value: number}) {
  'worklet';
  return Math.log(value) / Math.log(n);
}

export function logOffset({
  base,
  value,
  offset,
}: {
  base: number;
  value: number;
  offset: number;
}) {
  'worklet';
  return (
    logBaseN({n: base, value: value + offset}) -
    logBaseN({n: base, value: offset})
  );
}

export function distanceForCoords(x: number, y: number) {
  'worklet';
  return Math.sqrt(x * x + y * y);
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type AnchoredPopupAnchor = {
  x: number;
  y: number;
};

export type AnchoredPopupMode = 'stick' | 'center-x' | 'center-y' | 'center';

type CloseAnimationType = 'touchoutside' | 'swipe-away';

export type AnchoredPopupHandle = {
  closePopup: () => void;
};

/**
 * A touchable that shows an anchored popup when pressed. The element that is rendered in the popup view is whatever
 * is passed to the popupElement prop.
 * @example
 * <AnchoredPopupTouchableOpacity
 *  popupElement={<Text>I appear in the popup! woo!</Text>}
 * >
 *  <Text>Text Shown in the touchable</Text>
 * </AnchoredPopupTouchableOpacity>
 */
export function AnchoredPopupTouchableOpacity({
  animationDuration = 150,
  backgroundColor = 'rgba(0,0,0,0.07)',
  closeOnBackdropPress = true,
  handle,
  mode = 'stick',
  onAnchorChange,
  swipeToClose = true,
  openOnEvent = 'onPress',
  ...props
}: TouchableOpacityProps & {
  /**
   * ReactNode or render function that will be shown whenever the popup is shown. Required.
   */
  popupElement: ReactNode | ((vars: {close: () => void}) => ReactNode);
  /**
   * Controls the animation time of all animations the component uses.
   * @default 150 (ms)
   */
  animationDuration?: number;
  /**
   * Color of the backdrop that is shown while the popup is open.
   * @default 'rgba(0,0,0,0.07)''
   */
  backgroundColor?: string;
  /**
   * Callback function called when the anchor changes. Useful if you want to synchronize other parts of your UI with
   * the popup, although is not required (state is managed internally).
   */
  onAnchorChange?: (v: AnchoredPopupAnchor | null) => void;
  /**
   * Sets the positioning behavior of the popup. Each behavior will open the popup towards the center of the screen, but each option
   * varies slightly in how the final position is calculated.
   * @default 'stick'
   * @option
   * 'stick'
   * Renders the popup as far as possible towards the center screen while making sure the anchor is still inside the popup view.
   * @option center-x
   * 'center-x'
   * Renders the popup horizontally in the screen, and renders vertically as far as possible towards the y center while making
   * sure the anchor's y value is still inside the popup view.
   * @option center-y
   * 'center-y'
   * Renders the popup vertically in the screen, and renders horizontally as far as possible towards the x center while making
   * sure the anchor's x value is still inside the popup view.
   * @option center
   * 'center'
   * Renders the popup in the center of the screen.
   */
  mode?: AnchoredPopupMode;
  /**
   * Allows you to imperatively interact with the component (IE to close the component from the parent).
   * Will be set to null when the component unmounts.
   * @example
   * ```ts
   * const handle = usePopupHandle();
   * function closePopup() {
   *     if(handle.current) handle.current.close();
   * }
   * return <AnchoredPopupTouchableOpacity handle={handle}/>;
   * ```
   */
  handle?: ReturnType<typeof usePopupHandle>;
  /**
   * If enabled, the popup will close when the backdrop is pressed.
   * @default true
   */
  closeOnBackdropPress?: boolean;

  /**
   * If enabled, the popup can be swiped away.
   * @default true
   */
  swipeToClose?: boolean;

  /**
   * Control which gestures open the popup.
   * @default 'onPress'
   * @option
   * 'onPress'
   * Opens the popup on the 'onPress'.
   * @option
   * 'onLongPress'
   * Opens the popup on the 'onLongPress' event.
   */
  openOnEvent?: 'onPress' | 'onLongPress';
}) {
  const [visible, setVisible] = useState<boolean>(false);
  const [anchor, setAnchor] = useState<AnchoredPopupAnchor | null>(null);
  const anchorCache = useRef<AnchoredPopupAnchor>(anchor ?? {x: 0, y: 0});
  const touchOutsideCloseAnimation = useSharedValue(0);
  const swipeCloseAnimation = useSharedValue(0);
  const swipeCloseDirectionVector = useSharedValue({
    x: 0,
    y: 0,
  });
  const opacityAnimation = useSharedValue(0);
  const isClosing = useRef<boolean>(false);

  function close(closeAnimation: CloseAnimationType = 'touchoutside') {
    if (isClosing.current) return;
    isClosing.current = true;
    if (closeAnimation !== 'swipe-away') {
      touchOutsideCloseAnimation.value = withTiming(0, {
        duration: animationDuration - 50,
        easing: Easing.in(Easing.ease),
      });
    } else {
      swipeCloseAnimation.value = withTiming(1, {
        duration: animationDuration - 50,
        easing: Easing.in(Easing.ease),
      });
    }

    opacityAnimation.value = withTiming(0, {
      duration: animationDuration,
    });
    setAnchor(null);
    onAnchorChange && onAnchorChange(null);
    setTimeout(() => {
      isClosing.current = false;
      setVisible(false);
      swipeCloseAnimation.value = 0;
      swipeCloseDirectionVector.value = {x: 0, y: 0};
      opacityAnimation.value = 0;
      touchOutsideCloseAnimation.value = 0;
    }, animationDuration);
  }

  if (anchor !== null) anchorCache.current = anchor;
  if (handle) handle.current = {closePopup: close};

  useEffect(() => {
    return () => {
      if (handle) handle.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openWithEvent(e: GestureResponderEvent) {
    const newAnchor = {
      x: e.nativeEvent.pageX,
      y: e.nativeEvent.pageY,
    };
    setAnchor(newAnchor);
    onAnchorChange && onAnchorChange(newAnchor);
    setVisible(true);
  }

  return (
    <>
      <TouchableOpacity
        {...props}
        onPress={(e: GestureResponderEvent) => {
          if (openOnEvent === 'onPress') {
            openWithEvent(e);
          }
          props.onPress && props.onPress(e);
        }}
        onLongPress={
          openOnEvent == 'onLongPress'
            ? e => {
                if (openOnEvent === 'onLongPress') {
                  openWithEvent(e);
                }
                props.onLongPress && props.onLongPress(e);
              }
            : props.onLongPress
        }
      />
      {(anchor || visible) && (
        <Modal transparent visible={visible}>
          <AnchoredPopup
            animation={touchOutsideCloseAnimation}
            close={close}
            swipeDirection={swipeCloseDirectionVector}
            swipeToCloseAnimation={swipeCloseAnimation}
            swipeToClose={swipeToClose}
            anchor={anchor ?? anchorCache.current}
            animationDuration={animationDuration}
            closeOnBackdropPress={closeOnBackdropPress}
            mode={mode}
            backgroundColor={backgroundColor}
            opacityAnimation={opacityAnimation}>
            {typeof props.popupElement == 'function'
              ? props.popupElement({close})
              : props.popupElement}
          </AnchoredPopup>
        </Modal>
      )}
    </>
  );
}

const SWIPE_TO_DELETE_THRESHOLD = 80;
const SWIPE_AWAY_ANIMATION_MAGNITUDE = 50;

const AnchoredPopup = gestureHandlerRootHOC(function ({
  close,
  children,
  swipeDirection,
  swipeToCloseAnimation,
  anchor,
  animationDuration,
  mode,
  backgroundColor,
  animation,
  opacityAnimation,
  closeOnBackdropPress,
  swipeToClose,
}: {
  close: (closeAnimation?: CloseAnimationType) => void;
  children: ReactNode;
  swipeDirection: SharedValue<{x: number; y: number}>;
  swipeToCloseAnimation: SharedValue<number>;
  animation: SharedValue<number>;
  anchor: AnchoredPopupAnchor;
  animationDuration: number;
  mode: AnchoredPopupMode;
  backgroundColor: string;
  opacityAnimation: SharedValue<number>;
  closeOnBackdropPress: boolean;
  swipeToClose: boolean;
}) {
  const [height, setHeight] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);
  const hasSetHeight = useRef<boolean>(false);
  const hasAnimatedOpen = useRef<boolean>(false);
  const animatedDragX = useSharedValue(0);
  const animatedDragY = useSharedValue(0);
  const appHeight = useAppHeight();
  const h = () => {
    return appHeight;
  };

  const midX = w() / 2;
  const midY = h() / 2;
  const anchorHorizontal = anchor.x < midX ? 'right' : 'left';
  const anchorVertical = anchor.y < midY ? 'bottom' : 'top';
  const centerX = w() / 2 - (1 / 2) * width;
  const centerY = h() / 2 - (1 / 2) * height;
  const left = (() => {
    if (mode == 'center-x' || mode == 'center') return centerX;
    if (anchorHorizontal == 'right') return Math.min(centerX, anchor.x);
    if (anchorHorizontal == 'left') return Math.max(centerX, anchor.x - width);
  })()!;
  const top = (() => {
    if (mode == 'center-y' || mode == 'center') return centerY;
    if (anchorVertical == 'bottom') return Math.min(centerY, anchor.y);
    if (anchorVertical == 'top') return Math.max(centerY, anchor.y - height);
  })()!;

  function onLayout(event: LayoutChangeEvent) {
    if (hasSetHeight.current) return;
    hasSetHeight.current = true;
    setHeight(event.nativeEvent.layout.height);
    setWidth(event.nativeEvent.layout.width);
  }

  const swipeToCloseGestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    {deleted?: boolean}
  >({
    onActive: (event, ctx) => {
      if (ctx.deleted) return;
      const distance = Math.max(
        distanceForCoords(event.translationX, event.translationY),
        1,
      );
      const normalizedX = event.translationX / distance;
      const normalizedY = event.translationY / distance;

      const logDistance =
        15 *
        logOffset({
          base: 10,
          value: distance,
          offset: 50,
        });
      const x = normalizedX * logDistance;
      const y = normalizedY * logDistance;
      animatedDragX.value = x;
      animatedDragY.value = y;
      swipeDirection.value = {
        x,
        y,
      };
      if (distance > SWIPE_TO_DELETE_THRESHOLD) {
        ctx.deleted = true;
        runOnJS(close)('swipe-away');
      }
    },
    onEnd: (event, ctx) => {
      if (ctx.deleted) return;
      animatedDragX.value = withTiming(0, {duration: 50});
      animatedDragY.value = withTiming(0, {duration: 50});
    },
  });

  const animatedInnerViewStyle = useAnimatedStyle(
    () => ({
      opacity: opacityAnimation.value,
      transform: [
        {
          translateX: interpolate(
            animation.value,
            [0, 1],
            [anchor.x - (left + width / 2), 0],
          ),
        },
        {
          translateY: interpolate(
            animation.value,
            [0, 1],
            [(anchor.y - (top + height / 2)) / 2, 0],
          ),
        },
        {
          translateX:
            animatedDragX.value +
            swipeToCloseAnimation.value *
              SWIPE_AWAY_ANIMATION_MAGNITUDE *
              swipeDirection.value.x,
        },
        {
          translateY:
            animatedDragY.value +
            swipeToCloseAnimation.value *
              SWIPE_AWAY_ANIMATION_MAGNITUDE *
              swipeDirection.value.y,
        },
        {
          scale: animation.value,
        },
      ],
    }),
    [height],
  );
  const animatedBackgroundStyle = useAnimatedStyle(() => ({
    opacity: opacityAnimation.value,
  }));

  useEffect(() => {
    if (hasAnimatedOpen.current) return;
    if (!height) return;
    if (!width) return;
    hasAnimatedOpen.current = true;
    animation.value = withTiming(1, {
      duration: animationDuration,
      easing: Easing.out(Easing.ease),
    });
    opacityAnimation.value = withTiming(1, {
      duration: animationDuration,
      easing: Easing.out(Easing.ease),
    });
  }, [animation, animationDuration, height, opacityAnimation, width]);
  return (
    <>
      <AnimatedPressable
        style={[
          StyleSheet.absoluteFill,
          {backgroundColor},
          animatedBackgroundStyle,
        ]}
        onPress={closeOnBackdropPress ? () => close('touchoutside') : undefined}
      />
      <Animated.View
        style={[
          {
            position: 'absolute',
            left,
            top,
          },
          animatedInnerViewStyle,
        ]}
        onLayout={onLayout}
        exiting={FadeOut.duration(animationDuration)}>
        <PanGestureHandler
          activeOffsetX={[-10, 10]}
          activeOffsetY={[-10, 10]}
          onGestureEvent={swipeToCloseGestureHandler}
          enabled={swipeToClose}>
          <Animated.View>{children}</Animated.View>
        </PanGestureHandler>
      </Animated.View>
    </>
  );
});

/**
 * Creates a handle to interact with the popup imperatively (if you need to close it from the parent).
 * @returns An AnchoredPopupHandle ref.
 */
export function usePopupHandle() {
  return useRef<null | AnchoredPopupHandle>(null);
}
