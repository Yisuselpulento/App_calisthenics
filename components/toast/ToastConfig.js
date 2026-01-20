import RankedReadyToast from "./RankedReadyToast";

export const toastConfig = {
  rankedReady: ({ props }) => (
    <RankedReadyToast
      waiting={props.waiting}
      onAccept={props.onAccept}
    />
  ),
};
