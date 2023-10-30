import { chromium, devices } from "playwright";
import lodash from "lodash";

const { keys, sample } = lodash;

export const DEVICES_NAME = keys(devices);

export const randomDeviceName = () => sample(DEVICES_NAME);

export const randomDevice = () => devices[randomDeviceName()];

export const getContext = async (device) => {
  const browser = await chromium.launch({
    headless: false,
  });
  let context;
  if (device) {
    context = await browser.newContext(device);
  }
  context = await browser.newContext(device);

  return context;
};
