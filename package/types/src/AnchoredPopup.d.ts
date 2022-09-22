import React, { ReactNode } from 'react';
import { TouchableOpacityProps } from 'react-native';
export declare function logBaseN({ n, value }: {
    n: number;
    value: number;
}): number;
export declare function logOffset({ base, value, offset, }: {
    base: number;
    value: number;
    offset: number;
}): number;
export declare function distanceForCoords(x: number, y: number): number;
export declare type AnchoredPopupAnchor = {
    x: number;
    y: number;
};
export declare type AnchoredPopupMode = 'stick' | 'center-x' | 'center-y' | 'center';
export declare type AnchoredPopupHandle = {
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
export declare function AnchoredPopupTouchableOpacity({ animationDuration, backgroundColor, closeOnBackdropPress, handle, mode, onAnchorChange, swipeToClose, openOnEvent, ...props }: TouchableOpacityProps & {
    /**
     * ReactNode or render function that will be shown whenever the popup is shown. Required.
     */
    popupElement: ReactNode | ((vars: {
        close: () => void;
    }) => ReactNode);
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
}): JSX.Element;
/**
 * Creates a handle to interact with the popup imperatively (if you need to close it from the parent).
 * @returns An AnchoredPopupHandle ref.
 */
export declare function usePopupHandle(): React.MutableRefObject<AnchoredPopupHandle>;
